import clientPromise from "./mongodb";

const INITIAL_FREE_CREDITS = 3;

async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "applivize");
  return db.collection("users");
}

export async function ensureUserInitialized(userId: string): Promise<void> {
  const users = await getUsersCollection();

  await users.updateOne(
    { userId },
    {
      $setOnInsert: {
        userId,
        credits: INITIAL_FREE_CREDITS,
        totalAnalyses: 0,
        createdAt: new Date(),
      },
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  );
}

export async function getUserCredits(userId: string): Promise<number> {
  const users = await getUsersCollection();
  const user = await users.findOne({ userId });
  if (!user) return INITIAL_FREE_CREDITS;
  return typeof user.credits === "number" ? user.credits : 0;
}

export async function deductCredit(userId: string): Promise<{ success: boolean; error?: string }> {
  const users = await getUsersCollection();

  // Ensure user exists with initial credits, then decrement only if credits > 0.
  await ensureUserInitialized(userId);

  const res = await users.updateOne(
    { userId, credits: { $gt: 0 } },
    {
      $inc: { credits: -1, totalAnalyses: 1 },
      $set: { updatedAt: new Date() },
    }
  );

  if (res.modifiedCount === 0) {
    return { success: false, error: "NO_CREDITS" };
  }

  return { success: true };
}
