const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Error: Missing GEMINI_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    // Note: listModels might not be directly exposed easily in all SDK versions, 
    // but we can try a simple generation with a known old model to see if it works,
    // or use the model listing API if supported.
    // For now, let's just try to hit the API with a "gemini-pro" model which is usually available.
    console.log("Attempting to use 'gemini-pro' as a test...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-pro: ", result.response.text());

    console.log("\nAttempting 'gemini-1.5-flash'...");
    const flash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const res2 = await flash.generateContent("Hello");
    console.log("Success with gemini-1.5-flash: ", res2.response.text());

  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();
