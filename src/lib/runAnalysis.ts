import { AnalysisResponse, normalizeSkill } from "@/types/analysis";
import { understandSkillsWithGemini } from "./ai-skill-understanding";
import { extractCandidateData, extractJobRequirements } from "./extract";
import { matchJobWithCandidate } from "./match";
import { calculateFinalScore, getDecision } from "./scoring";

function shouldSuppressMissingSkill(missingLabel: string, likelyKeys: Set<string>): boolean {
  const missingKey = normalizeSkill(missingLabel).key;
  if (!missingKey) return false;
  if (likelyKeys.has(missingKey)) return true;
  for (const lk of likelyKeys) {
    if (!lk) continue;
    if (missingKey.length >= 4 && lk.length >= 4 && (missingKey.includes(lk) || lk.includes(missingKey))) {
      return true;
    }
  }
  return false;
}

export async function runAnalysis(
  resumeText: string,
  jobDescriptionText: string,
  userId: string | null
): Promise<AnalysisResponse> {
  try {
    // 1. Extract Data (Parallel execution for speed)
    const [candidateProfile, jobRequirements, skillUnderstanding] = await Promise.all([
      extractCandidateData(resumeText),
      extractJobRequirements(jobDescriptionText),
      understandSkillsWithGemini({ resumeText, jobDescriptionText }).catch(() => null),
    ]);

    const likelyKeys = new Set<string>();
    if (skillUnderstanding?.likelySkills && Array.isArray(skillUnderstanding.likelySkills)) {
      for (const s of skillUnderstanding.likelySkills) {
        if (typeof s !== "string") continue;
        const k = normalizeSkill(s.replace(/-/g, " ")).key;
        if (k) likelyKeys.add(k);
      }
    }

    // 2. Match Logic
    const { breakdown, missingSkills, notes } = matchJobWithCandidate(
      jobRequirements,
      candidateProfile
    );

    const filteredMissingSkills =
      likelyKeys.size === 0 ? missingSkills : missingSkills.filter((m) => !shouldSuppressMissingSkill(m, likelyKeys));

    const adjustedNotes = (() => {
      const out = [...notes];
      const idx = out.findIndex((n) => /^Missing\s+\d+\s+required\s+skill/.test(n));
      if (idx !== -1) {
        const n = filteredMissingSkills.length;
        out[idx] = `Missing ${n} required skill${n !== 1 ? "s" : ""}`;
      }

      const suppressedCount = missingSkills.length - filteredMissingSkills.length;
      if (suppressedCount > 0) {
        out.push(`Baseline: Suppressed ${suppressedCount} likely skill${suppressedCount !== 1 ? "s" : ""} from missing list.`);
      }

      return out;
    })();

    // 3. Calculate Final Score
    const finalScore = calculateFinalScore(breakdown);

    // 4. Normalize & Decide
    const decision = getDecision(finalScore);

    // 5. Construct Response satisfying the user requested schema
    return {
      finalScore,
      decision,
      isHardCapped: breakdown.isHardCapped,
      breakdown,
      missingSkills: filteredMissingSkills,
      notes: adjustedNotes,
      meta: {
        analysisVersion: "v1"
      }
    };
  } catch (error) {
    console.error("runAnalysis Error:", error);
    throw new Error("ANALYSIS_FAILED");
  }
}
