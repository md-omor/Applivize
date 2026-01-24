import { getOrCreateUser } from "@/lib/credits";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let email: string | undefined;
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const primary = user.emailAddresses?.find((e: { id: string }) => e.id === user.primaryEmailAddressId);
      email = primary?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress;
    } catch {
      // ignore
    }

    const user = await getOrCreateUser(userId, email);

    return NextResponse.json({
      creditsRemaining: user.creditsRemaining,
      creditsTotal: user.creditsTotal,
      creditsUsed: user.creditsUsed
    });
  } catch (error) {
    console.error("Credits API Error:", error);

    const isDev = process.env.NODE_ENV === "development";
    const err = error as { message?: string; stack?: string; name?: string };
    return NextResponse.json(
      {
        error: "Failed to fetch credits",
        ...(isDev
          ? {
              name: err?.name,
              message: err?.message,
              stack: err?.stack,
            }
          : {}),
      },
      { status: 500 }
    );
  }
}
