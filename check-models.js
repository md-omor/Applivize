const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Testing gemini-1.5-flash...");
    // Just try to get info if possible, or list models
    // The SDK doesn't have a direct listModels on the client instance in some versions,
    // but the error message suggested calling ListModels.
    // Let's try to infer from a simple generation attempt or catch the error again to see if it lists them.
    
    // Actually, looking at docs, there isn't a simple client.listModels() in the node SDK easily accessible 
    // without using the ModelService. 
    // Let's try a safe "gemini-pro" fallback.
    
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash");
  } catch (error) {
    console.error("Error with gemini-1.5-flash:", error.message);
  }
}

listModels();
