import { SCORING_WEIGHTS } from './src/config/constants';
import { matchJobWithCandidate } from './src/lib/match';
import { calculateFinalScore } from './src/lib/scoring';

// Mock data
const mockCandidate = {
  skills: {
    primary: ["reactjs", "typescript"],
    secondary: ["nodejs"],
    tools: ["git"]
  },
  experience: {
    totalYears: 5
  },
  education: {
    highestLevel: "Bachelor's Degree"
  },
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
  meta: {
    visaRequired: false,
    remoteAllowed: true
  }
};

function testMatching() {
  console.log("=== Testing Deterministic Matching Logic ===\n");

  try {
    const result = matchJobWithCandidate(mockJob, mockCandidate);
    
    console.log("Breakdown:", JSON.stringify(result.breakdown, null, 2));
    console.log("Missing Skills:", result.missingSkills);
    console.log("Notes:", result.notes);

    // Assertions
    const skillsMax = SCORING_WEIGHTS.REQUIRED_SKILLS;
    const prefMax = SCORING_WEIGHTS.PREFERRED_SKILLS;
    const toolsMax = SCORING_WEIGHTS.TOOLS;
    const expMax = SCORING_WEIGHTS.EXPERIENCE;
    const eduMax = SCORING_WEIGHTS.EDUCATION;
    const eligMax = SCORING_WEIGHTS.ELIGIBILITY;

    console.log("\nValidation:");
    const skillsCorrect = result.breakdown.requiredSkills === skillsMax;
    console.log("Required Skills (100% Match):", skillsCorrect ? "✅ PASS" : "❌ FAIL");

    const expCorrect = result.breakdown.experience === expMax;
    console.log("Experience (>= Match):", expCorrect ? "✅ PASS" : "❌ FAIL");

    const eligCorrect = result.breakdown.eligibility === eligMax;
    console.log("Eligibility (Full):", eligCorrect ? "✅ PASS" : "❌ FAIL");

    // Test under-experience
    const lowExpCandidate = { ...mockCandidate, experience: { totalYears: 1.5 } };
    const lowExpResult = matchJobWithCandidate(mockJob, lowExpCandidate);
    console.log("\nLow Experience Test (1.5 / 3 years):");
    console.log("Score:", lowExpResult.breakdown.experience);
    console.log("Ratio matches:", lowExpResult.breakdown.experience === Math.round(0.5 * expMax) ? "✅ PASS" : "❌ FAIL");

    // Test Hard Cap (Missing > 50% required skills)
    console.log("\n--- Hard Cap Test (Missing > 50% Required Skills) ---");
    const highReqJob = {
      ...mockJob,
      requirements: {
        ...mockJob.requirements,
        requiredSkills: ["Skill 1", "Skill 2", "Skill 3", "Skill 4"]
      }
    };
    const lowSkillCandidate = {
      ...mockCandidate,
      skills: {
        primary: ["Skill 1"], // 1/4 = 25% < 50%
        secondary: [],
        tools: []
      }
    };
    const capResult = matchJobWithCandidate(highReqJob as any, lowSkillCandidate as any);
    const finalScore = calculateFinalScore(capResult.breakdown);
    
    console.log("Is Hard Capped flag:", capResult.breakdown.isHardCapped ? "✅ YES" : "❌ NO");
    console.log("Final Score (capped at 49):", finalScore);
    console.log("Cap applied correctly:", finalScore <= 49 ? "✅ PASS" : "❌ FAIL");

  } catch (e: any) {
    console.error("Test failed with error:", e.message);
  }
}

testMatching();
