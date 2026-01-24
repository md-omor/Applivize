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
    const likelySkills = Array.isArray(skillUnderstanding?.likelySkills) ? skillUnderstanding.likelySkills : [];
    
    const { breakdown, missingSkills, impliedSkills, notes } = matchJobWithCandidate(
      jobRequirements,
      candidateProfile,
      likelySkills,
      resumeText
    );

    // 2.5. AI Baseline Skill Normalization (New Step)
    // Remove "baseline covered" skills from missingSkills list (but do not change score)
    if (missingSkills.length > 0) {
      const { normalizeBaselineSkills } = await import("./ai-baseline-skill-normalizer");
      const { baselineCoveredSkills, remainingMissingSkills } = await normalizeBaselineSkills(
        candidateProfile.skills.primary,
        impliedSkills,
        missingSkills
      );

      // Update missingSkills to only show truly missing ones
      missingSkills.length = 0; // Clear array
      missingSkills.push(...remainingMissingSkills);

      // Add baseline covered skills to impliedSkills for visibility (optional)
      baselineCoveredSkills.forEach(s => {
        if (!impliedSkills.includes(s)) {
          impliedSkills.push(s);
        }
      });
      
      if (baselineCoveredSkills.length > 0) {
         notes.push(`Baseline Skills: ${baselineCoveredSkills.length} prerequisite skill${baselineCoveredSkills.length > 1 ? 's' : ''} assumed covered (not listed as missing).`);
      }
    }

    // 3. Calculate Final Score
    const finalScore = calculateFinalScore(breakdown);

    // 4. Normalize & Decide
    const decision = getDecision(finalScore);

    // 5. Construct Response satisfying the user requested schema
    const explanations = {
      eligibility: breakdown.eligibility.status === "NOT_EVALUATED"
        ? "Eligibility checks whether the job has any strict requirements that would automatically disqualify you (visa, location, age, mandatory certification). For this job, eligibility was not evaluated; the eligibility score is a placeholder and does not affect your final score."
        : "Eligibility checks whether the job has any strict requirements that would automatically disqualify you (visa, location, age, mandatory certification).",
      jobReality: breakdown.isHardCapped
        ? "Job Reality measures how closely your background matches the core focus of this role (role alignment, not personal ability). A significant mismatch in core requirements was detected, so the final score is capped to reflect alignment to this role, not your overall potential."
        : "Job Reality measures how closely your background matches the core focus of this role (role alignment, not personal ability). Lower values usually mean the job’s main requirements don’t strongly overlap with what is shown in the resume.",
      requiredSkills: "Missing skills lists required skills that were not explicitly found in the resume text. Required skills reflects coverage of the job’s required skills based on what is explicitly present in the resume.",
      impliedSkills: "Implied skills are high-confidence inferred skills shown for context only. They do not affect scoring, missing skills, or any caps (and this list may be empty even for strong candidates).",
      competition: "Competition analysis is not available for this role yet. A value of 0 means it was not evaluated (not that there are no competitors).",
      scoringNote: "Scores represent alignment with this specific role, not your overall ability or potential. Lower scores indicate weaker alignment to this job’s requirements, not poor performance."
    };

    return {
      finalScore,
      decision,
      isHardCapped: breakdown.isHardCapped,
      breakdown,
      missingSkills,
      impliedSkills,
      notes,
      explanations,
      meta: {
        analysisVersion: "v1"
      }
    };
  } catch (error) {
    console.error("runAnalysis Error:", error);
    throw new Error("ANALYSIS_FAILED");
  }
}
