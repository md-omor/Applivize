// Standalone test for matchJobWithCandidate logic

// Copy of SCORING_WEIGHTS
const SCORING_WEIGHTS = {
  SKILLS: 30,
  EXPERIENCE: 25,
  ELIGIBILITY: 20,
  JOB_REALITY: 15,
  COMPETITION: 10,
};

// Copy of Education Ranking Logic
const EDUCATION_RANKS = {
  "phd": 5,
  "master": 4,
  "bachelor": 3,
  "associate": 2,
  "highschool": 1,
  "none": 0,
  "unknown": 0
};

function getEducationRank(level) {
  if (!level) return 0;
  const l = level.toLowerCase();
  if (l.includes("phd") || l.includes("doctorate")) return EDUCATION_RANKS.phd;
  if (l.includes("master")) return EDUCATION_RANKS.master;
  if (l.includes("bachelor")) return EDUCATION_RANKS.bachelor;
  if (l.includes("associate")) return EDUCATION_RANKS.associate;
  if (l.includes("high school")) return EDUCATION_RANKS.highschool;
  return 0;
}

// Copy of matchJobWithCandidate
function matchJobWithCandidate(job, candidate) {
  const missingSkills = [];
  const notes = [];
  
  let skillsScore = 0;
  
  const allCandidateSkills = new Set([
    ...candidate.skills.primary,
    ...candidate.skills.secondary,
    ...candidate.skills.tools
  ]);

  const reqSkills = job.requirements.requiredSkills;
  const prefSkills = job.requirements.preferredSkills;
  const jobTools = job.requirements.tools;

  let totalPossibleWeight = 0;
  let earnedWeight = 0;

  reqSkills.forEach(skill => {
    totalPossibleWeight += 1.0;
    if (allCandidateSkills.has(skill)) {
      earnedWeight += 1.0;
    } else {
      missingSkills.push(skill);
    }
  });

  prefSkills.forEach(skill => {
    totalPossibleWeight += 0.5;
    if (allCandidateSkills.has(skill)) {
      earnedWeight += 0.5;
    }
  });

  jobTools.forEach(tool => {
    totalPossibleWeight += 0.5;
    if (allCandidateSkills.has(tool)) {
      earnedWeight += 0.5;
    }
  });

  if (totalPossibleWeight > 0) {
    skillsScore = (earnedWeight / totalPossibleWeight) * SCORING_WEIGHTS.SKILLS;
  } else {
    skillsScore = SCORING_WEIGHTS.SKILLS * 0.8;
  }

  let experienceScore = 0;
  const candidateYears = candidate.experience.totalYears;
  const minYears = job.requirements.minimumExperienceYears || 0;
  
  if (minYears > 0) {
    if (candidateYears >= minYears) {
      experienceScore = SCORING_WEIGHTS.EXPERIENCE;
    } else {
      const ratio = candidateYears / minYears;
      experienceScore = ratio * SCORING_WEIGHTS.EXPERIENCE;
    }
  } else {
    experienceScore = SCORING_WEIGHTS.EXPERIENCE;
  }

  let eligibilityScore = 0;
  const educationWeight = SCORING_WEIGHTS.ELIGIBILITY * 0.6;
  const visaWeight = SCORING_WEIGHTS.ELIGIBILITY * 0.4;

  const jobEduRank = getEducationRank(job.requirements.educationLevel);
  const candEduRank = getEducationRank(candidate.education.highestLevel);

  if (candEduRank >= jobEduRank) {
    eligibilityScore += educationWeight;
  } else if (candEduRank > 0) {
    const eduRatio = candEduRank / jobEduRank;
    eligibilityScore += (eduRatio * educationWeight);
  }

  if (!job.meta.visaRequired) {
    eligibilityScore += visaWeight;
  } else if (job.meta.remoteAllowed) {
    eligibilityScore += visaWeight * 0.8;
  }

  const jobRealityScore = SCORING_WEIGHTS.JOB_REALITY * 0.8; 
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

// Test cases
const mockCandidate = {
  skills: { primary: ["reactjs", "typescript"], secondary: ["nodejs"], tools: ["git"] },
  experience: { totalYears: 5 },
  education: { highestLevel: "Bachelor's Degree" },
  meta: {}
};

const mockJob = {
  requirements: {
    requiredSkills: ["reactjs", "typescript"],
    preferredSkills: ["nodejs"],
    tools: ["git"],
    minimumExperienceYears: 3,
    educationLevel: "Bachelor's Degree"
  },
  meta: { visaRequired: false, remoteAllowed: true }
};

console.log("=== Testing Deterministic Matching Logic ===");
const result = matchJobWithCandidate(mockJob, mockCandidate);
console.log("Full Match Result:", JSON.stringify(result.breakdown, null, 2));

const expectedFull = { skills: 30, experience: 25, eligibility: 20, jobReality: 12, competition: 5 };
const passFull = JSON.stringify(result.breakdown) === JSON.stringify(expectedFull);
console.log("Full Match Pass:", passFull ? "✅" : "❌");

// Low exp
const lowExpCand = { ...mockCandidate, experience: { totalYears: 1.5 } };
const lowExpRes = matchJobWithCandidate(mockJob, lowExpCand);
console.log("Low Exp (1.5/3):", lowExpRes.breakdown.experience, "(Expected 13)");
console.log("Low Exp Pass:", lowExpRes.breakdown.experience === 13 ? "✅" : "❌");

// Missing skill
const missingSkillJob = { ...mockJob, requirements: { ...mockJob.requirements, requiredSkills: ["reactjs", "typescript", "rust"] } };
const missingRes = matchJobWithCandidate(missingSkillJob, mockCandidate);
console.log("Missing Skill (Rust):", missingRes.breakdown.skills, "(Expected lower than 30)");
console.log("Missing Skill List:", missingRes.missingSkills);
console.log("Missing Skill Pass:", missingRes.breakdown.skills < 30 ? "✅" : "❌");
