const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "applivize";
const TEST_USER_ID = process.env.TEST_USER_ID || process.argv[2];

const options = {
  tls: true,
  serverSelectionTimeoutMS: 5000,
};

async function testPhase3() {
    const client = new MongoClient(uri, options);
    try {
        if (!TEST_USER_ID) {
            throw new Error("Missing TEST_USER_ID. Provide via env TEST_USER_ID or as the first CLI argument.");
        }
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        const users = db.collection('users');
        const records = db.collection('analysis_records');

        // 1. Reset Test User
        console.log("\n--- Testing User & Credits ---");
        await users.deleteOne({ userId: TEST_USER_ID });
        console.log(`Cleaned up test user for test: ${TEST_USER_ID}`);

        // Simulate getOrCreateUser
        await users.updateOne(
            { userId: TEST_USER_ID },
            {
                $setOnInsert: {
                    userId: TEST_USER_ID,
                    creditsRemaining: 10,
                    creditsUsed: 0,
                    createdAt: new Date(),
                },
                $set: { updatedAt: new Date() },
            },
            { upsert: true }
        );

        let user = await users.findOne({ userId: TEST_USER_ID });
        console.log(`Initial Credits Remaining: ${user.creditsRemaining}`);
        console.log(`Initial Credits Used: ${user.creditsUsed}`);

        if (user.creditsRemaining !== 10) {
            console.error("FAILURE: Initial credits should be 10.");
            return;
        }

        // 2. Simulate Credit Deduction
        console.log("\n--- Testing Credit Deduction ---");
        const deductionResult = await users.updateOne(
            { userId: TEST_USER_ID, creditsRemaining: { $gt: 0 } },
            {
                $inc: { creditsRemaining: -1, creditsUsed: 1 },
                $set: { updatedAt: new Date() },
            }
        );
        
        user = await users.findOne({ userId: TEST_USER_ID });
        console.log(`After deduction - Remaining: ${user.creditsRemaining}, Used: ${user.creditsUsed}`);

        if (user.creditsRemaining === 9 && user.creditsUsed === 1) {
            console.log("SUCCESS: Credit deduction logic verified.");
        } else {
            console.error("FAILURE: Credit deduction mismatch.");
            return;
        }

        // 3. Simulate Analysis Record Save
        console.log("\n--- Testing Analysis Record Save ---");
        const mockRecord = {
            userId: TEST_USER_ID,
            finalScore: 85,
            decision: "STRONG_FIT",
            scoreBreakdown: {
                requiredSkills: 90,
                experience: 80,
                culturalFit: 85
            },
            missingSkills: ["Docker"],
            notes: ["Strong candidate", "Needs Docker training"],
            createdAt: new Date()
        };

        const insertResult = await records.insertOne(mockRecord);
        console.log(`Analysis record saved with ID: ${insertResult.insertedId}`);

        const savedRecord = await records.findOne({ _id: insertResult.insertedId });
        if (savedRecord && savedRecord.scoreBreakdown && savedRecord.scoreBreakdown.requiredSkills === 90) {
            console.log("SUCCESS: Analysis record structure verified.");
        } else {
            console.error("FAILURE: Analysis record data mismatch.");
            return;
        }

        console.log("\nALL PHASE 3 DATABASE TESTS PASSED!");

    } catch (err) {
        console.error("Error during test:", err);
    } finally {
        await client.close();
    }
}

testPhase3();
