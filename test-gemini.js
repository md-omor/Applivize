// Simple test to validate Gemini API key
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey() {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCMf3JEYkZvB2n9wUOBzyUifKsYIhw-V8A";
  console.log("Testing API Key:", apiKey.substring(0, 10) + "...");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try the simplest possible model
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Say hello");
    console.log("✓ SUCCESS! Response:", result.response.text());
  } catch (error) {
    console.error("✗ FAILED:", error.message);
    console.error("\nFull error:", error);
  }
}

testKey();
