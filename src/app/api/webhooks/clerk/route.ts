import { getOrCreateUser } from "@/lib/credits";
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
        ...(isDev
          ? {
              name: e?.name,
              message: e?.message,
              stack: e?.stack,
            }
          : {}),
      },
      { status: 400 }
    );
  }

  const eventType = event?.type;
  if (eventType !== "user.created" && eventType !== "user.updated") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const userId = event?.data?.id;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const emails = event?.data?.email_addresses ?? [];
  const primaryId = event?.data?.primary_email_address_id ?? null;
  const primary = primaryId ? emails.find((e) => e.id === primaryId) : undefined;
  const email = primary?.email_address ?? emails[0]?.email_address;

  try {
    await getOrCreateUser(userId, email);
  } catch (err) {
    console.error("Failed to upsert user from Clerk webhook:", err);
    const isDev = process.env.NODE_ENV === "development";
    const e = err as { name?: string; message?: string; stack?: string };
    return NextResponse.json(
      {
        error: "UPSERT_FAILED",
        ...(isDev
          ? {
              name: e?.name,
              message: e?.message,
              stack: e?.stack,
            }
          : {}),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
