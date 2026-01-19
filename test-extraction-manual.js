const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Error: Missing GEMINI_API_KEY in environment variables.");
  process.exit(1);
}
console.log("Testing with API Key:", apiKey.substring(0, 5) + "...");

const genAI = new GoogleGenerativeAI(apiKey);

async function testResumeExtraction() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const resumeText = `
  John Doe
  Software Engineer
  john.doe@email.com | (555) 123-4567 | San Francisco, CA
  
  SUMMARY
  Experienced Full Stack Developer with 5 years of experience in React and Node.js.
  
  EXPERIENCE
  Senior Developer at Tech Corp (2022 - Present)
  - Led team of 5 developers
  - Built scalable APIs using NestJS
  
  Junior Developer at Web Solutions (2019 - 2022)
  - Created responsive UI with React
  
  EDUCATION
  B.S. Computer Science, University of Tech (2019)
  
  SKILLS
  React, Node.js, TypeScript, AWS
  `;

  const prompt = `You are an information extraction engine.

Your task is to extract structured data from a resume text.
You must follow the output schema exactly.
If information is missing, use null for strings and empty arrays for lists.
Do NOT guess or infer beyond the text.
Do NOT add explanations.
Return ONLY valid JSON.

USER PROMPT (RESUME)
Extract the following information from this resume:

Resume text:
"""
${resumeText}
"""

Return JSON only.

EXPECTED OUTPUT (STRICT SHAPE)
{
  "candidate": {
    "fullName": null,
    "email": null,
    "phone": null,
    "location": null
  },

  "professionalSummary": null,

  "experience": {
    "totalYears": 0,
    "currentRole": null,
    "workHistory": [
      {
        "role": null,
        "company": null,
        "durationYears": 0,
        "technologies": []
      }
    ]
  },

  "education": {
    "highestLevel": null,
    "fieldOfStudy": null,
    "institutions": []
  },

  "skills": {
    "primary": [],
    "secondary": [],
    "tools": []
  },

  "projects": [
    {
      "name": null,
      "technologies": [],
      "description": null
    }
  ],

  "certifications": [],

  "meta": {
    "resumeLanguage": null,
    "hasGaps": false
  }
}

Return JSON only.`;

  console.log("Sending request to Gemini...");
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("\n--- RAW RESPONSE ---");
    console.log(text);
    
    // Test cleaning logic
    let clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const data = JSON.parse(clean);
    console.log("\n--- PARSED JSON ---");
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("Error:", error);
  }
}

async function testJobExtraction() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const jobText = `
  Senior Frontend Engineer at Big Tech
  Remote | Full-time
  
  We are looking for a Senior Frontend Engineer to join our team.
  You will work with React and TypeScript to build scalable web applications.
  
  Requirements:
  - 4+ years of experience
  - Strong proficiency in React, TypeScript, and CSS
  - Experience with AWS is a plus
  - Bachelor's degree in Computer Science preferred
  
  Responsibilities:
  - Develop user-facing features
  - optimize applications for maximum speed
  `;

  const prompt = `SYSTEM PROMPT (COPY EXACTLY)
You are a job description parsing engine.
Your task is to convert unstructured job description text into structured JSON.
Follow the schema exactly.
If a field is missing, return null or empty arrays.
Do NOT infer or guess information.
Do NOT include explanations.
Return ONLY valid JSON.

USER PROMPT (JOB DESCRIPTION)
Extract job information using the following JSON schema:

{
  "job": {
    "title": null,
    "company": null,
    "location": null,
    "workType": "unknown"
  },
  "requirements": {
    "minimumExperienceYears": null,
    "educationLevel": null,
    "requiredSkills": [],
    "preferredSkills": [],
    "tools": []
  },
  "responsibilities": [],
  "seniority": "unknown",
  "keywords": [],
  "meta": {
    "remoteAllowed": false,
    "visaRequired": false
  }
}

Job Description:
"""
${jobText}
"""

Return JSON only.`;

  console.log("\n\n=== TESTING JOB EXTRACTION ===");
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("\n--- RAW RESPONSE ---");
    console.log(text);
    
    let clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const data = JSON.parse(clean);
    console.log("\n--- PARSED JSON ---");
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("Error:", error);
  }
}

async function runTests() {
  await testResumeExtraction();
  await testJobExtraction();
}

runTests();
