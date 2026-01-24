import { CandidateProfile, JobRequirements } from "@/types/analysis";

// Providers
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

// Log provider status
console.log("AI Providers Status:");
console.log(`- Gemini: ${GEMINI_API_KEY ? "Present" : "Missing"}`);
console.log(`- Groq:   ${GROQ_API_KEY ? "Present" : "Missing"}`);

// --- GEMINI IMPLEMENTATION ---
async function callGeminiAPI(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0 }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// --- GROQ IMPLEMENTATION ---
async function callGroqAPI(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");

  const url = "https://api.groq.com/openai/v1/chat/completions";
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // High performance, good JSON adherence
      messages: [
        { role: "system", content: "You are a helpful JSON extraction assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0,
      response_format: { type: "json_object" } // Enforce valid JSON
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// --- UNIFIED CALLER ---
export let mockAIResponse: string | null = null;

export async function callAI(prompt: string): Promise<string> {
  if (mockAIResponse && prompt.includes("baseline-covered")) return mockAIResponse;
  const errors: string[] = [];

  // 1. Try Gemini (Primary)
  if (GEMINI_API_KEY) {
    try {
      console.log("Attempting Gemini (1.5-flash)...");
      return await callGeminiAPI(prompt);
    } catch (e: any) {
      console.warn("Gemini Failed:", e.message);
      errors.push(`Gemini: ${e.message}`);

      // Retry Gemini once before falling back (reduces provider-switch variance)
      try {
        console.log("Retrying Gemini (1.5-flash)...");
        return await callGeminiAPI(prompt);
      } catch (e2: any) {
        console.warn("Gemini Retry Failed:", e2.message);
        errors.push(`GeminiRetry: ${e2.message}`);
      }
    }
  } else {
    console.warn("Skipping Gemini (No Key)");
  }

  // 2. Try Groq (Fallback)
  if (GROQ_API_KEY) {
    try {
      console.log("Attempting Groq (Llama 3)...");
      return await callGroqAPI(prompt);
    } catch (e: any) {
      console.warn("Groq Failed:", e.message);
      errors.push(`Groq: ${e.message}`);
    }
  } else {
    console.warn("Skipping Groq (No Key)");
  }

  // 3. Fallback Mock Data (Dev Mode Only)
  if (process.env.NODE_ENV === "development") {
    console.warn("⚠️ All AI providers failed. Returning MOCK data.");
    return prompt.includes("resume") 
      ? '{"skills":["React (Mock)","TypeScript"],"yearsOfExperience":5,"educationLevel":"Bachelor\'s"}'
      : '{"requiredSkills":["React (Mock)"],"minYearsExperience":3,"requiredEducation":"Bachelor\'s"}';
  }

  throw new Error(`All AI providers failed:\n${errors.join("\n")}`);
}
// Helper to clean Markdown code blocks from JSON response
function cleanJSON(text: string): string {
  // Remove markdown code blocks if present
  let clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  // Trim whitespace
  return clean.trim();
}

export function safeParseJSONObject(text: string): any {
  const cleaned = cleanJSON(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const slice = cleaned.slice(start, end + 1);
      return JSON.parse(slice);
    }
    throw new Error("AI returned non-JSON output");
  }
}

/**
 * Normalizes a skill string for consistent matching and storage.
 * MANDATORY IMPLEMENTATION
 */
function normalize(skill: string): string {
  if (!skill) return "";
  return skill
    .toLowerCase()
    .replace(/\.js\b/g, "")
    .replace(/\+js\b/g, "")
    .replace(/[^a-z0-9+#]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSkills(skills: string[]): string[] {
  if (!Array.isArray(skills)) return [];
  // Filter out empty strings after normalization and deduplicate
  return [...new Set(skills.map(normalize).filter(s => s.length > 0))];
}

function keyify(text: string): string {
  return (text || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function filterSkillsByEvidence(sourceText: string, skills: string[]): string[] {
  const srcKey = keyify(sourceText);
  if (!srcKey) return [];
  const out: string[] = [];
  for (const s of skills) {
    if (typeof s !== "string") continue;
    const k = keyify(s);
    if (k.length < 3) continue;
    if (srcKey.includes(k)) out.push(s);
  }
  return out;
}

// Output Interface matching Strict JSON Prompt
interface ResumeExtractionResult {
  candidate: {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
  };
  professionalSummary: string | null;
  experience: {
    totalYears: number;
    currentRole: string | null;
    workHistory: {
      role: string | null;
      company: string | null;
      durationYears: number;
      technologies: string[];
    }[];
  };
  education: {
    highestLevel: string | null;
    fieldOfStudy: string | null;
    institutions: string[];
  };
  skills: {
    primary: string[];
    secondary: string[];
    tools: string[];
    implied: string[];
  };
  projects: {
    name: string | null;
    technologies: string[];
    description: string | null;
  }[];
  certifications: string[];
  meta: {
    resumeLanguage: string | null;
    hasGaps: boolean;
  };
}

export async function extractCandidateData(text: string): Promise<CandidateProfile> {
  const prompt = `SYSTEM PROMPT (COPY EXACTLY)
You are a resume parsing engine.
Your task is to convert unstructured resume text into structured JSON.
Follow the schema exactly.
If a field is missing, return null or empty arrays.
Do NOT infer or guess information.
CRITICAL: Extract ALL technical skills, languages, and frameworks mentioned ANYWHERE in the text (including summary, experience, and projects) into the "skills" object.
Do NOT include explanations.
Return ONLY valid JSON.

USER PROMPT (RESUME)
Extract resume information using the following JSON schema:

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
    "tools": [],
    "implied": []
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

Resume text:
"""
${text}
"""

Return JSON only.`;

  try {
    const responseText = await callAI(prompt);
    console.log("🔍 Extraction Raw Output:", responseText); // Debugging
    const data: ResumeExtractionResult = safeParseJSONObject(responseText);
    
    // valid JSON check (basic)
    if (!data || typeof data !== 'object') {
       throw new Error("Invalid JSON structure received from AI");
    }

    // Map strict output to Application CandidateProfile
    const profile: CandidateProfile = {
      candidate: {
        fullName: data.candidate?.fullName || null,
        email: data.candidate?.email || null,
        phone: data.candidate?.phone || null,
        location: data.candidate?.location || null,
      },
      professionalSummary: data.professionalSummary || null,
      experience: {
        totalYears: typeof data.experience?.totalYears === 'number' ? data.experience.totalYears : 0,
        currentRole: data.experience?.currentRole || null,
        workHistory: Array.isArray(data.experience?.workHistory) ? data.experience.workHistory.map(h => ({
          role: h.role || null,
          company: h.company || null,
          durationYears: typeof h.durationYears === 'number' ? h.durationYears : 0,
          technologies: filterSkillsByEvidence(text, normalizeSkills(h.technologies || []))
        })) : []
      },
      education: {
        highestLevel: data.education?.highestLevel || null,
        fieldOfStudy: data.education?.fieldOfStudy || null,
        institutions: Array.isArray(data.education?.institutions) ? data.education.institutions : []
      },
      skills: {
        primary: normalizeSkills(data.skills?.primary || []),
        secondary: normalizeSkills(data.skills?.secondary || []),
        tools: normalizeSkills(data.skills?.tools || []),
        implied: normalizeSkills(data.skills?.implied || [])
      },
      projects: Array.isArray(data.projects) ? data.projects.map(p => ({
        name: p.name || null,
        technologies: filterSkillsByEvidence(text, normalizeSkills(p.technologies || [])),
        description: p.description || null
      })) : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      meta: {
        resumeLanguage: data.meta?.resumeLanguage || null,
        hasGaps: !!data.meta?.hasGaps
      },
      debug: {
        rawAIResponse: responseText
      }
    };

    return profile;

  } catch (error) {
    console.error("Error parsing candidate data:", error);
    return {
      candidate: { fullName: null, email: null, phone: null, location: null },
      professionalSummary: null,
      experience: { totalYears: 0, currentRole: null, workHistory: [] },
      education: { highestLevel: null, fieldOfStudy: null, institutions: [] },
      skills: { primary: [], secondary: [], tools: [] },
      projects: [],
      certifications: [],
      meta: { resumeLanguage: null, hasGaps: false }
    };
  }
}

interface JobExtractionResult {
  job: {
    title: string | null;
    company: string | null;
    location: string | null;
    workType: "remote" | "onsite" | "hybrid" | "unknown";
  };
  requirements: {
    minimumExperienceYears: number | null;
    educationLevel: string | null;
    requiredSkills: string[];
    preferredSkills: string[];
    tools: string[];
  };
  responsibilities: string[];
  seniority: string;
  keywords: string[];
  meta: {
    remoteAllowed: boolean;
    visaRequired: boolean;
  };
}

export async function extractJobRequirements(text: string): Promise<JobRequirements> {
  const prompt = `SYSTEM PROMPT (COPY EXACTLY)
You are a job description analysis engine.
Extract hiring requirements into structured JSON.
Follow the schema exactly.
CRITICAL: Identify ALL required and preferred skills mentioned in the entire text. If a skill is mentioned as mandatory or in the context of "experience in", put it in "requiredSkills".
Do NOT infer missing data.
Return ONLY valid JSON.

USER PROMPT (JOB DESCRIPTION)
Extract job information using the following JSON schema:
CRITICAL: For "educationLevel", look for keywords like "Diploma", "Bachelor", "BSc", "Masters", "PhD". If not explicitly mentioned, try to infer from the context but prioritize explicit mentions.

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

Job description text:
"""
${text}
"""

Return JSON only.`;

  try {
    const responseText = await callAI(prompt);
    const data: JobExtractionResult = safeParseJSONObject(responseText);

    // Map strict output to Application JobRequirements, ensuring type safety
    const reqSkills = filterSkillsByEvidence(text, normalizeSkills(data.requirements?.requiredSkills || []));
    const prefSkills = filterSkillsByEvidence(text, normalizeSkills(data.requirements?.preferredSkills || []));
    const tools = filterSkillsByEvidence(text, normalizeSkills(data.requirements?.tools || []));
    const keywords = filterSkillsByEvidence(text, normalizeSkills(data.keywords || []));

    const jobReqs: JobRequirements = {
      job: {
        title: data.job?.title || "Unknown Role",
        company: data.job?.company || null,
        location: data.job?.location || null,
        workType: data.job?.workType || "unknown"
      },
      requirements: {
        minimumExperienceYears: typeof data.requirements?.minimumExperienceYears === 'number' ? data.requirements.minimumExperienceYears : 0,
        educationLevel: data.requirements?.educationLevel || null,
        requiredSkills: reqSkills,
        preferredSkills: prefSkills,
        tools
      },
      responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
      seniority: data.seniority || "unknown",
      keywords,
      meta: {
        remoteAllowed: !!data.meta?.remoteAllowed,
        visaRequired: !!data.meta?.visaRequired
      },
      debug: {
        rawAIResponse: responseText
      }
    };

    return jobReqs;

  } catch (error) {
    console.error("Error parsing job requirements:", error);
    return {
      job: { title: "Error extracting role", company: null, location: null, workType: "unknown" },
      requirements: {
        minimumExperienceYears: 0,
        educationLevel: null,
        requiredSkills: [],
        preferredSkills: [],
        tools: []
      },
      responsibilities: [],
      seniority: "unknown",
      keywords: [],
      meta: { remoteAllowed: false, visaRequired: false }
    };
  }
}


