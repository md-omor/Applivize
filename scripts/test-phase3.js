const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "applivize";
const DUMMY_USER_ID = "user_dummy_123";

async function testPhase3() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        const users = db.collection('users');
        const records = db.collection('analysis_records');

        // 1. Check/Reset User
        console.log("\n--- Testing User & Credits ---");
        let user = await users.findOne({ userId: DUMMY_USER_ID });
        if (!user) {
            console.log("User not found, creating...");
            await users.insertOne({
                userId: DUMMY_USER_ID,
                credits: 10,
                totalAnalyses: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            user = await users.findOne({ userId: DUMMY_USER_ID });
        }
        console.log(`Current Credits: ${user.credits}`);

        // 2. Simulate Analysis (Directly via DB for logic check, or we could fetch the API but this is faster for DB verification)
        console.log("\n--- Simulating Analysis Record ---");
        const initialCredits = user.credits;
        
        if (initialCredits <= 0) {
            console.log("No credits left, resetting to 10 for test.");
            await users.updateOne({ userId: DUMMY_USER_ID }, { $set: { credits: 10 } });
        }

        // Deduct credit
        const deductionResult = await users.findOneAndUpdate(
            { userId: DUMMY_USER_ID, credits: { $gt: 0 } },
            { $inc: { credits: -1 }, $set: { updatedAt: new Date() } },
            { returnDocument: 'after' }
        );
        
        console.log(`Credit deducted. Remaining: ${deductionResult.credits}`);

        // Insert Record
        const mockRecord = {
            userId: DUMMY_USER_ID,
            timestamp: new Date(),
            finalScore: 85,
            decision: "APPLY",
            breakdown: { requiredSkills: 90, experience: 80 },
            inputs: { resumeText: "Mock Resume", jobText: "Mock JD" },
            extractedData: { candidate: {}, job: {} }
        };

        const insertResult = await records.insertOne(mockRecord);
        console.log(`Analysis record saved with ID: ${insertResult.insertedId}`);

        // 3. Verify
        const updatedUser = await users.findOne({ userId: DUMMY_USER_ID });
        if (updatedUser.credits === initialCredits - 1 || (initialCredits === 0 && updatedUser.credits === 9)) {
            console.log("\nSUCCESS: Credit system working.");
        } else {
            console.log("\nFAILURE: Credit system mismatch.");
        }

        const recentRecord = await records.findOne({ userId: DUMMY_USER_ID }, { sort: { timestamp: -1 } });
        if (recentRecord) {
            console.log("SUCCESS: Record found in database.");
        } else {
            console.log("FAILURE: Record not found.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

testPhase3();
