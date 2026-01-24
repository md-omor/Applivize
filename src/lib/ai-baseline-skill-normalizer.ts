
import { callAI, safeParseJSONObject } from "./extract";

interface BaselineNormalizationResult {
  baselineCoveredSkills: string[];
  remainingMissingSkills: string[];
}

export async function normalizeBaselineSkills(
  explicitSkills: string[],
  impliedSkills: string[],
  missingSkills: string[]
): Promise<BaselineNormalizationResult> {
  if (missingSkills.length === 0) {
    return { baselineCoveredSkills: [], remainingMissingSkills: [] };
  }

  const prompt = `You are determining whether a missing skill is a foundational prerequisite
of an explicitly stated or confidently implied skill.

Rules:
- Only mark skills as baseline-covered if they are universally assumed
- Do NOT infer advanced or specialized skills
- Do NOT invent new skills
- Prefer exclusion over inclusion
- Normalize all skills to lowercase, dash-separated

Return valid JSON only.

Schema:
{
  "baselineCoveredSkills": [],
  "remainingMissingSkills": []
}

Context:
Explicit Skills: ${JSON.stringify(explicitSkills)}
Implied Skills: ${JSON.stringify(impliedSkills)}
Missing Skills: ${JSON.stringify(missingSkills)}

Return JSON only.`;

  try {
    const responseText = await callAI(prompt);
    const data = safeParseJSONObject(responseText);

    if (!data || !Array.isArray(data.baselineCoveredSkills) || !Array.isArray(data.remainingMissingSkills)) {
      console.warn("Invalid AI response for baseline normalization, returning original missing skills.");
      return { baselineCoveredSkills: [], remainingMissingSkills: missingSkills };
    }

    return {
      baselineCoveredSkills: data.baselineCoveredSkills,
      remainingMissingSkills: data.remainingMissingSkills
    };
  } catch (error) {
    console.error("Error in baseline skill normalization:", error);
    return { baselineCoveredSkills: [], remainingMissingSkills: missingSkills };
  }
}
