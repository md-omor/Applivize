type Seniority = "junior" | "mid" | "senior" | "unknown";

export type AISkillUnderstanding = {
  explicitSkills: string[];
  likelySkills: string[];
  role: string;
  seniority: Seniority;
  experienceYears: number | null;
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const FIXED_GEMINI_PROMPT =
  "You are extracting structured career information.\n\nInput:\n- Resume text\n- Job description\n\nYour task:\n1. List explicit skills mentioned in the resume\n2. Infer likely skills ONLY if they are industry-obvious and high confidence\n3. Identify role and seniority\n4. Estimate years of experience ONLY if stated\n\nRules:\n- Do not invent skills\n- Do not assume advanced tools\n- Prefer under-inference to over-inference\n- Normalize skills to lowercase, dash-separated tokens\n- Output valid JSON only, no explanations\n\nOutput schema:\n{\n  explicitSkills: [],\n  likelySkills: [],\n  role: \"\",\n  seniority: \"\",\n  experienceYears: number | null\n}";

function cleanJSON(text: string): string {
  return text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
}

function tryParseJSONObject(text: string): unknown {
  const cleaned = cleanJSON(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to recover a JSON object from a larger response.
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const slice = cleaned.slice(start, end + 1);
      return JSON.parse(slice);
    }
    throw new Error("LLM returned non-JSON output");
  }
}

function normalizeSkillToken(value: string): string {
  const trimmed = value.trim().toLowerCase();
  // Replace non-alphanumeric with dashes, collapse repeats, trim edges.
  const dashed = trimmed.replace(/[^a-z0-9]+/g, "-");
  return dashed.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const norm = normalizeSkillToken(item);
    if (!norm) continue;
    out.push(norm);
  }
  return Array.from(new Set(out));
}

function asSeniority(value: unknown): Seniority {
  if (value === "junior" || value === "mid" || value === "senior" || value === "unknown") {
    return value;
  }
  return "unknown";
}

function validateSkillUnderstanding(payload: unknown): AISkillUnderstanding {
  if (!payload || typeof payload !== "object") {
    throw new Error("LLM returned invalid JSON schema");
  }

  const obj = payload as Record<string, unknown>;

  const explicitSkills = asStringArray(obj.explicitSkills);
  const likelySkills = asStringArray(obj.likelySkills);

  const role = typeof obj.role === "string" ? obj.role.trim() : "";
  const seniority = asSeniority(typeof obj.seniority === "string" ? obj.seniority.trim() : obj.seniority);

  let experienceYears: number | null = null;
  if (obj.experienceYears === null) {
    experienceYears = null;
  } else if (typeof obj.experienceYears === "number" && Number.isFinite(obj.experienceYears)) {
    experienceYears = obj.experienceYears;
  }

  return {
    explicitSkills,
    likelySkills,
    role,
    seniority,
    experienceYears,
  };
}

async function callGeminiJSON(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${err}`);
  }

  const data = (await response.json()) as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Gemini response missing text");
  }
  return text;
}

async function callGroqJSON(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const url = "https://api.groq.com/openai/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${err}`);
  }

  const data = (await response.json()) as any;
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") {
    throw new Error("Groq response missing text");
  }
  return text;
}

function buildPrompt(resumeText: string, jobDescriptionText: string): string {
  return (
    `${FIXED_GEMINI_PROMPT}` +
    `\n\nResume text:\n${resumeText}` +
    `\n\nJob description:\n${jobDescriptionText}`
  );
}

async function runProvider(provider: "gemini" | "groq", prompt: string): Promise<AISkillUnderstanding> {
  const raw = provider === "gemini" ? await callGeminiJSON(prompt) : await callGroqJSON(prompt);
  const parsed = tryParseJSONObject(raw);
  return validateSkillUnderstanding(parsed);
}

export async function understandSkillsWithGemini(input: {
  resumeText: string;
  jobDescriptionText: string;
}): Promise<AISkillUnderstanding> {
  const resumeText = input.resumeText ?? "";
  const jobDescriptionText = input.jobDescriptionText ?? "";

  const prompt = buildPrompt(resumeText, jobDescriptionText);

  // Primary: Gemini
  try {

    
    return await runProvider("gemini", prompt);
  } catch (geminiError: any) {
    // Fallback: Groq (retry once using fallback provider)
    try {
      return await runProvider("groq", prompt);
    } catch (groqError: any) {
      const g1 = geminiError?.message ? String(geminiError.message) : String(geminiError);
      const g2 = groqError?.message ? String(groqError.message) : String(groqError);
      throw new Error(`All LLM providers failed. Gemini: ${g1}; Groq: ${g2}`);
    }
  }
}
