// Test Gemini API Key directly
require('dotenv').config({ path: '.env.local' });
const apiKey = process.env.GEMINI_API_KEY;

async function testGeminiAPI() {
  console.log("🔑 Testing API Key:", apiKey.substring(0, 15) + "...");
  console.log("📍 Testing endpoint: gemini-2.0-flash-exp\n");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "Extract skills from this resume: I am a React developer with 3 years of experience in TypeScript and Node.js. Return ONLY JSON: {\"skills\":[],\"yearsOfExperience\":0}" }]
        }]
      })
    });

    console.log("📊 Status Code:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Error Response:", errorText);
      return false;
    }

    const data = await response.json();
    console.log("✅ SUCCESS! API Response:");
    console.log(JSON.stringify(data, null, 2));
    return true;
    
  } catch (error) {
    console.error("❌ Request Failed:", error.message);
    return false;
  }
}

testGeminiAPI().then(success => {
  if (success) {
    console.log("\n✅ Your Gemini API key is WORKING!");
  } else {
    console.log("\n❌ API key has issues - using mock fallback");
  }
});
