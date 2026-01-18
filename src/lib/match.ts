import { SCORING_WEIGHTS } from "@/config/constants";
import { AnalysisBreakdown, CandidateProfile, JobRequirements } from "@/types/analysis";

export function matchJobWithCandidate(
  job: JobRequirements,
  candidate: CandidateProfile
): { breakdown: AnalysisBreakdown; missingSkills: string[]; notes: string[] } {
  const missingSkills: string[] = [];
  const notes: string[] = [];
  
  // 1. Skills Scoring (Weight: 30)
  let skillsScore = 0;
  if (job.requiredSkills.length > 0) {
    const matchedSkills = job.requiredSkills.filter(skill => 
      candidate.skills.some(cSkill => cSkill.toLowerCase().includes(skill.toLowerCase()))
    );
    
    const matchRatio = matchedSkills.length / job.requiredSkills.length;
    skillsScore = matchRatio * SCORING_WEIGHTS.SKILLS;
    
    // Identify missing skills
    job.requiredSkills.forEach(skill => {
        if (!candidate.skills.some(cSkill => cSkill.toLowerCase().includes(skill.toLowerCase()))) {
            missingSkills.push(skill);
        }
    });

  } else {
    // If no specific skills listed, give partial credit or full credit depending on policy
    // For now, let's be generous if it's generic
    skillsScore = SCORING_WEIGHTS.SKILLS * 0.8;
    notes.push("No specific skills extracted from job description.");
  }

  // 2. Experience Scoring (Weight: 25)
  let experienceScore = 0;
  if (job.minYearsExperience > 0) {
    if (candidate.yearsOfExperience >= job.minYearsExperience) {
      experienceScore = SCORING_WEIGHTS.EXPERIENCE;
    } else {
      const diff = job.minYearsExperience - candidate.yearsOfExperience;
      if (diff <= 1) {
        experienceScore = SCORING_WEIGHTS.EXPERIENCE * 0.7; // Close enough
        notes.push("Experience slightly below requirement.");
      } else {
        experienceScore = SCORING_WEIGHTS.EXPERIENCE * 0.3; // Gap exists
        notes.push("Significant experience gap.");
      }
    }
  } else {
      experienceScore = SCORING_WEIGHTS.EXPERIENCE; // Entry level or unspecified
  }

  // 3. Eligibility (Weight: 20)
  // Simplified for now: Assume eligible unless stated otherwise
  const eligibilityScore = SCORING_WEIGHTS.ELIGIBILITY; 

  // 4. Job Reality (Weight: 15)
  // Placeholder: Assess commute, salary match, etc.
  const jobRealityScore = SCORING_WEIGHTS.JOB_REALITY * 0.8; 

  // 5. Competition (Weight: 10)
  // Placeholder: Early applicants get higher score?
  const competitionScore = SCORING_WEIGHTS.COMPETITION * 0.5;

  return {
    breakdown: {
      skills: Math.round(skillsScore),
      experience: Math.round(experienceScore),
      eligibility: Math.round(eligibilityScore),
      jobReality: Math.round(jobRealityScore),
      competition: Math.round(competitionScore),
    },
    missingSkills,
    notes,
  };
}
