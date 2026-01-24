import { deleteUser, getOrCreateUser } from "@/lib/credits";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export const runtime = "nodejs";

type ClerkWebhookEvent = {
  type?: string;
  data?: {
    id?: string;
    email_addresses?: Array<{ id: string; email_address: string }>;
    primary_email_address_id?: string | null;
  };
};

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Missing CLERK_WEBHOOK_SECRET" }, { status: 500 });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  const payload = await request.text();

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    const isDev = process.env.NODE_ENV === "development";
    const e = err as { name?: string; message?: string; stack?: string };
    return NextResponse.json(
      {
        error: "INVALID_SIGNATURE",
        name: e?.name,
        message: e?.message,
        ...(isDev ? { stack: e?.stack } : {}),
      },
      { status: 400 }
    );
  }

  const eventType = event?.type;
  if (eventType !== "user.created" && eventType !== "user.updated" && eventType !== "user.deleted") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const userId = event?.data?.id;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  if (!process.env.MONGODB_URI?.trim()) {
    return NextResponse.json(
      {
        error: "MONGODB_NOT_CONFIGURED",
        message: 'Missing environment variable: "MONGODB_URI"',
      },
      { status: 500 }
    );
  }

  if (eventType === "user.deleted") {
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error("Failed to delete user from Clerk webhook:", err);
      const isDev = process.env.NODE_ENV === "development";
      const e = err as { name?: string; message?: string; stack?: string };
      return NextResponse.json(
        {
          error: "DELETE_FAILED",
          name: e?.name,
          message: e?.message,
          ...(isDev ? { stack: e?.stack } : {}),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const emails = event?.data?.email_addresses ?? [];
  const primaryId = event?.data?.primary_email_address_id ?? null;
  const primary = primaryId ? emails.find((e) => e.id === primaryId) : undefined;
  let email = primary?.email_address ?? emails[0]?.email_address;

  if (!email) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const primaryEmail = user.emailAddresses?.find((e: { id: string }) => e.id === user.primaryEmailAddressId);
      email = primaryEmail?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress;
    } catch (err) {
      console.warn("Failed to fetch user email from Clerk:", err);
    }
  }

  try {
    await getOrCreateUser(userId, email);
  } catch (err) {
    console.error("Clerk webhook Mongo context:", {
      vercelEnv: process.env.VERCEL_ENV,
      nodeEnv: process.env.NODE_ENV,
      mongodbDb: process.env.MONGODB_DB,
      hasMongoUri: Boolean(process.env.MONGODB_URI),
    });
    console.error("Failed to upsert user from Clerk webhook:", err);
    const isDev = process.env.NODE_ENV === "development";
    const e = err as { name?: string; message?: string; stack?: string };
    return NextResponse.json(
      {
        error: "UPSERT_FAILED",
        name: e?.name,
        message: e?.message,
        ...(isDev ? { stack: e?.stack } : {}),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
