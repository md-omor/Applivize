import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });

    const dbName = process.env.MONGODB_DB || "jobfit";
    const db = client.db(dbName);

    const sampleUser = {
      name: "Sample User",
      email: "sample.user@example.com",
      createdAt: new Date(),
    };

    const insertResult = await db.collection("sample_users").insertOne(sampleUser);

    const inserted = await db
      .collection("sample_users")
      .findOne({ _id: insertResult.insertedId });

    return Response.json({
      ok: true,
      ping: true,
      db: dbName,
      collection: "sample_users",
      insertedId: String(insertResult.insertedId),
      inserted,
    });
  } catch (e) {
    const err = e as unknown;
    const message = err instanceof Error ? err.message : "Unknown error";
    const name = err instanceof Error ? err.name : undefined;
    const stack = err instanceof Error ? err.stack : undefined;

    const anyErr = err as { code?: unknown; errorLabels?: unknown };

    return Response.json(
      {
        ok: false,
        error: message,
        name,
        code: anyErr?.code,
        errorLabels: anyErr?.errorLabels,
        nodeEnv: process.env.NODE_ENV,
        stack,
      },
      { status: 500 }
    );
  }
}
