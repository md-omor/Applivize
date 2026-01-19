import { SCORING_WEIGHTS } from "@/config/constants";
import { AnalysisBreakdown, CandidateProfile, JobRequirements } from "@/types/analysis";

// Education Level Ranks for comparison
const EDUCATION_RANKS: Record<string, number> = {
  "phd": 5,
  "master": 4,
  "bachelor": 3,
  "associate": 2,
  "highschool": 1,
  "none": 0,
  "unknown": 0
};

/**
 * Normalizes a skill string for consistent matching and storage.
 * MANDATORY IMPLEMENTATION
 */
function normalize(skill: string): string {
  return skill
    .toLowerCase()
    .replace(/\.js/g, "")
    .replace(/[^a-z0-9+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getEducationRank(level: string | null): number {
  if (!level) return 0;
  const l = level.toLowerCase();
  if (l.includes("phd") || l.includes("doctorate")) return EDUCATION_RANKS.phd;
  if (l.includes("master")) return EDUCATION_RANKS.master;
  if (l.includes("bachelor")) return EDUCATION_RANKS.bachelor;
  if (l.includes("associate")) return EDUCATION_RANKS.associate;
  if (l.includes("high school")) return EDUCATION_RANKS.highschool;
  return 0;
}

export function matchJobWithCandidate(
  job: JobRequirements,
  candidate: CandidateProfile
): { breakdown: AnalysisBreakdown; missingSkills: string[]; notes: string[] } {
  const missingSkills: string[] = [];
  const notes: string[] = [];

  // 1. Mandatory Normalization
  const candSkills = new Set([
    ...candidate.skills.primary.map(normalize),
    ...candidate.skills.secondary.map(normalize),
    ...candidate.skills.tools.map(normalize)
  ]);

  // 4. REQUIRED SKILLS MATCHING (CORE LOGIC)
  // Rule: Each required skill is mandatory. Missing >50% heavily penalizes (hard cap).
  let requiredSkillsScore = 0;
  let isHardCapped = false;
  let jobRealityScore = 0;
  const reqSkills = job.requirements.requiredSkills.map(normalize);
  
  if (reqSkills.length > 0) {
    const matched = reqSkills.filter(s => candSkills.has(s));
    const matchRatio = matched.length / reqSkills.length;
    
    // Logic: (matchedRequired / jobRequiredSkills) * 30
    requiredSkillsScore = matchRatio * SCORING_WEIGHTS.REQUIRED_SKILLS;
    
    // If >50% required skills missing, cap final score at 49
    if (matchRatio < 0.5) {
      isHardCapped = true;
      notes.push("Job Reality: Missing more than 50% of required skills. Final score capped at 49.");
    }

    // Output: jobReality (0-100 percentage based on required skills)
    jobRealityScore = Math.round(matchRatio * 100);

    // Output: missingSkills (directly from here)
    job.requirements.requiredSkills.forEach(originalSkill => {
        if (!candSkills.has(normalize(originalSkill))) {
            missingSkills.push(originalSkill);
        }
    });

    if (missingSkills.length > 0) {
      notes.push(`Missing ${missingSkills.length} required skill${missingSkills.length > 1 ? 's' : ''}`);
    }
  } else {
    requiredSkillsScore = SCORING_WEIGHTS.REQUIRED_SKILLS; // Neutral
    jobRealityScore = 100;
  }

  // 5. PREFERRED SKILLS MATCHING
  // Logic: (matchedPreferred / jobPreferredSkills) * 10. Bonus only, no penalty for missing.
  let preferredSkillsScore = 0;
  const prefSkills = job.requirements.preferredSkills.map(normalize);
  if (prefSkills.length > 0) {
      const matched = prefSkills.filter(s => candSkills.has(s));
      preferredSkillsScore = (matched.length / prefSkills.length) * SCORING_WEIGHTS.PREFERRED_SKILLS;
  } else {
      preferredSkillsScore = SCORING_WEIGHTS.PREFERRED_SKILLS; // Neutral (standard weight)
  }

  // 6. TOOLS MATCHING
  // Logic: (matchedTools / jobTools) * 10. If job lists no tools -> full score (10).
  let toolsScore = 0;
  const targetTools = job.requirements.tools.map(normalize);
  if (targetTools.length > 0) {
      const matched = targetTools.filter(s => candSkills.has(s));
      toolsScore = (matched.length / targetTools.length) * SCORING_WEIGHTS.TOOLS;
  } else {
      toolsScore = SCORING_WEIGHTS.TOOLS; // Rule: "If job lists no tools -> full score (10)"
  }

  // 7. EXPERIENCE SCORING
  let experienceScore = 0;
  const candidateYears = candidate.experience.totalYears;
  const minYears = job.requirements.minimumExperienceYears || 0;
  
  if (minYears > 0) {
    if (candidateYears >= minYears) {
      experienceScore = SCORING_WEIGHTS.EXPERIENCE;
    } else {
      const ratio = candidateYears / minYears;
      experienceScore = ratio * SCORING_WEIGHTS.EXPERIENCE;
      notes.push(`Experience Gap: Candidate has ${candidateYears} years, but ${minYears} required.`);
    }
  } else {
    experienceScore = SCORING_WEIGHTS.EXPERIENCE; 
  }

  // 8. EDUCATION SCORING
  let educationScore = 0;
  const jobEduRank = getEducationRank(job.requirements.educationLevel);
  const candEduRank = getEducationRank(candidate.education.highestLevel);

  if (candEduRank >= jobEduRank) {
    educationScore = SCORING_WEIGHTS.EDUCATION;
  } else if (candEduRank > 0) {
    const eduRatio = candEduRank / jobEduRank;
    educationScore = (eduRatio * SCORING_WEIGHTS.EDUCATION);
    notes.push(`Education Gap: Level (${candidate.education.highestLevel}) is lower than required.`);
  }

  // 9. ELIGIBILITY / PENALTIES
  let eligibilityScore = SCORING_WEIGHTS.ELIGIBILITY;
  if (job.meta.visaRequired && !job.meta.remoteAllowed) {
    eligibilityScore -= 5;
    notes.push("Eligibility Note: Job requires visa and is not remote.");
  } 


  return {
    breakdown: {
      requiredSkills: Math.round(requiredSkillsScore),
      preferredSkills: Math.round(preferredSkillsScore),
      tools: Math.round(toolsScore),
      experience: Math.round(experienceScore),
      education: Math.round(educationScore),
      eligibility: Math.round(eligibilityScore),
      jobReality: jobRealityScore,
      competition: 0,
      isHardCapped
    },
    missingSkills,
    notes,
  };
}
