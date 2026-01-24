import { UserAccount } from "@/types/db";
import clientPromise from "./mongodb";

const INITIAL_CREDITS = 10;

function asFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "applivize");
  return db.collection<UserAccount>("users");
}

/**
 * Gets a user or creates a new one with 10 initial credits
 */
export async function getOrCreateUser(userId: string, email?: string): Promise<UserAccount> {
  const users = await getUsersCollection();

  const setFields: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof email === "string" && email.length > 0) {
    setFields.email = email;
  }

  const result = (await users.findOneAndUpdate(
    { userId },
    {
      $setOnInsert: {
        userId,
        creditsTotal: INITIAL_CREDITS,
        creditsUsed: 0,
        creditsRemaining: INITIAL_CREDITS,
        createdAt: new Date(),
      },
      $set: setFields,
    },
    { upsert: true, returnDocument: "after" }
  )) as any;

  const user = (result?.value ?? result) as (Partial<UserAccount> & {
    remainingCredits?: number;
    usedCredits?: number;
    totalCredits?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) | null;
  if (!user) {
    throw new Error("Failed to get or create user account");
  }

  const remA = asFiniteNumber(user.creditsRemaining);
  const remB = asFiniteNumber(user.remainingCredits);
  const creditsRemaining =
    remA == null && remB == null ? INITIAL_CREDITS : remA == null ? (remB as number) : remB == null ? remA : Math.max(remA, remB);

  const usedA = asFiniteNumber(user.creditsUsed);
  const usedB = asFiniteNumber(user.usedCredits);
  const creditsUsed = usedA == null && usedB == null ? 0 : usedA == null ? (usedB as number) : usedB == null ? usedA : Math.max(usedA, usedB);

  const totalA = asFiniteNumber(user.creditsTotal);
  const totalB = asFiniteNumber(user.totalCredits);
  const creditsTotal =
    totalA == null && totalB == null
      ? creditsRemaining + creditsUsed
      : totalA == null
        ? (totalB as number)
        : totalB == null
          ? totalA
          : Math.max(totalA, totalB);

  if (
    user.creditsRemaining !== creditsRemaining ||
    user.creditsUsed !== creditsUsed ||
    user.creditsTotal !== creditsTotal ||
    user.remainingCredits != null ||
    user.usedCredits != null ||
    user.totalCredits != null
  ) {
    await users.updateOne(
      { userId },
      {
        $set: {
          creditsRemaining,
          creditsUsed,
          creditsTotal,
          updatedAt: new Date(),
        },
        $unset: {
          remainingCredits: "",
          usedCredits: "",
          totalCredits: "",
        },
      }
    );
  }

  return {
    userId: user.userId ?? userId,
    email: (typeof email === "string" && email.length > 0 ? email : user.email) as any,
    creditsRemaining,
    creditsUsed,
    creditsTotal,
    createdAt: (user.createdAt ?? new Date()) as any,
    updatedAt: new Date(),
  } as UserAccount;
}

/**
 * Checks if user has at least 1 credit remaining
 */
export async function hasCredits(userId: string): Promise<boolean> {
  const user = await getOrCreateUser(userId);
  return user.creditsRemaining > 0;
}

/**
 * Deducts 1 credit from the user's account
 */
export async function deductCredit(userId: string): Promise<{ success: boolean; error?: string }> {
  const users = await getUsersCollection();

  await getOrCreateUser(userId);

  const res = await users.updateOne(
    {
      userId,
      creditsRemaining: { $gt: 0 },
    },
    {
      $inc: {
        creditsRemaining: -1,
        creditsUsed: 1,
      },
      $set: { updatedAt: new Date() },
    }
  );

  if (res.modifiedCount === 0) {
    return { success: false, error: "NO_CREDITS" };
  }

  return { success: true };
}
