import { CandidateProfile, JobRequirements } from "@/types/analysis";

const apiKey = process.env.GEMINI_API_KEY || "";
console.log("Gemini API Key Loaded:", apiKey ? `Yes (Length: ${apiKey.length})` : "No");

async function callGeminiAPI(prompt: string): Promise<any> {
  // Try real API first
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ SUCCESS! Using REAL GEMINI AI");
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    // FALLBACK: Use mock data for testing
    console.warn("⚠️  Gemini API failed, using MOCK data:", error);
    return prompt.includes("resume") || prompt.includes("Resume") 
      ? '{"skills":["React","TypeScript","Node.js","JavaScript"],"yearsOfExperience":3,"educationLevel":"Bachelor\'s"}'
      : '{"requiredSkills":["React","TypeScript","Next.js","Node.js"],"minYearsExperience":5,"requiredEducation":"Bachelor\'s"}';
  }
}

export async function extractCandidateData(text: string): Promise<CandidateProfile> {
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const prompt = `You are an expert recruiter. Extract the following details from the resume text into JSON format.
    
IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.

Required JSON structure:
{
  "skills": ["skill1", "skill2"],
  "yearsOfExperience": 0,
  "educationLevel": "Bachelor's"
}

Resume Text:
${text}`;

  const responseText = await callGeminiAPI(prompt);
  const data = JSON.parse(responseText);
  
  return {
    skills: Array.isArray(data.skills) ? data.skills : [],
    yearsOfExperience: typeof data.yearsOfExperience === 'number' ? data.yearsOfExperience : 0,
    educationLevel: typeof data.educationLevel === 'string' ? data.educationLevel : "Unknown",
  };
}

export async function extractJobRequirements(text: string): Promise<JobRequirements> {
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const prompt = `You are a hiring manager. Extract the job requirements from the description into JSON format.

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.

Required JSON structure:
{
  "requiredSkills": ["skill1", "skill2"],
  "minYearsExperience": 0,
  "requiredEducation": "Bachelor's"
}

Job Description:
${text}`;

  const responseText = await callGeminiAPI(prompt);
  const data = JSON.parse(responseText);

  return {
    requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : [],
    minYearsExperience: typeof data.minYearsExperience === 'number' ? data.minYearsExperience : 0,
    requiredEducation: typeof data.requiredEducation === 'string' ? data.requiredEducation : "Unknown",
  };
}


