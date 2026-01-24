const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

console.log("Testing MongoDB Connection...");
console.log("URI (masked):", uri.replace(/:[^:@]+@/, ":****@"));

const options = {
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
};

async function testConnection() {
  let client;
  try {
    console.log("\n1. Creating MongoClient...");
    client = new MongoClient(uri, options);
    
    console.log("2. Attempting to connect...");
    await client.connect();
    
    console.log("✅ 3. Connected successfully!");
    
    console.log("4. Testing database access...");
    const db = client.db(process.env.MONGODB_DB || "applivize");
    const collections = await db.listCollections().toArray();
    
    console.log("✅ 5. Database accessible!");
    console.log("   Collections:", collections.map(c => c.name).join(", ") || "none");
    
    console.log("\n✅ ALL TESTS PASSED - MongoDB connection is working!");
  } catch (error) {
    console.error("\n❌ CONNECTION FAILED:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    if (error.cause) {
      console.error("\nCause:", error.cause.message || error.cause);
    }
    
    console.error("\n🔍 Troubleshooting suggestions:");
    console.error("1. Check if your IP is whitelisted in MongoDB Atlas Network Access");
    console.error("2. Verify your MongoDB credentials are correct");
    console.error("3. Check if MongoDB Atlas cluster is running");
    console.error("4. Try updating Node.js to the latest LTS version");
    
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("\n6. Connection closed.");
    }
  }
}

testConnection();
