import { matchJobWithCandidate } from './src/lib/match';
import { CandidateProfile, JobRequirements } from './src/types/analysis';

async function runTests() {
  console.log("=== Running Consistency Tests ===\n");

  const mockJob: JobRequirements = {
    job: { title: "Frontend Engineer", company: "Tech Corp", location: "Remote", workType: "remote" },
    requirements: {
      requiredSkills: ["React", "TypeScript", "JavaScript", "HTML"],
      preferredSkills: ["GraphQL"],
      tools: ["Git"],
      minimumExperienceYears: 3,
      educationLevel: "Bachelor's Degree"
    },
    responsibilities: [],
    seniority: "mid",
    keywords: [],
    meta: { remoteAllowed: true, visaRequired: false }
  };

  const mockCandidate: CandidateProfile = {
    candidate: { fullName: "John Doe", email: null, phone: null, location: null },
    professionalSummary: "",
    experience: { totalYears: 5, currentRole: "React Developer", workHistory: [] },
    education: { highestLevel: "Bachelor's Degree", fieldOfStudy: null, institutions: [] },
    skills: { primary: ["React"], secondary: [], tools: ["Git"] },
    projects: [],
    certifications: [],
    meta: { resumeLanguage: "en", hasGaps: false }
  };

  const likelySkills = ["JavaScript", "HTML", "CSS"]; // Industry obvious for React Dev

  console.log("--- Test 1: Implied Skills Separation ---");
  const result1 = matchJobWithCandidate(mockJob, mockCandidate, likelySkills);
  console.log("Missing Skills:", result1.missingSkills);
  console.log("Implied Skills:", result1.impliedSkills);
  
  const hasJavaScriptInMissing = result1.missingSkills.includes("JavaScript");
  const hasJavaScriptInImplied = result1.impliedSkills.includes("JavaScript");
  
  console.log("JavaScript in Missing:", hasJavaScriptInMissing ? "❌ FAIL" : "✅ PASS (Removed)");
  console.log("JavaScript in Implied:", hasJavaScriptInImplied ? "✅ PASS" : "❌ FAIL");
  console.log("TypeScript in Missing:", result1.missingSkills.includes("TypeScript") ? "✅ PASS" : "❌ FAIL");

  console.log("\n--- Test 2: Required Skills Score Floor (Refinement) ---");
  // Force 0 matched skills but some missing
  const zeroSkillCandidate = { ...mockCandidate, skills: { primary: [], secondary: [], tools: [] } };
  const result2 = matchJobWithCandidate(mockJob, zeroSkillCandidate);
  console.log("Required Skills Score:", result2.breakdown.requiredSkills);
  console.log("Score is 0 (No Floor):", result2.breakdown.requiredSkills === 0 ? "✅ PASS" : "❌ FAIL");

  console.log("\n--- Test 3: Job Reality Floor (Refinement) ---");
  console.log("Job Reality Score:", result2.breakdown.jobReality);
  console.log("Reality Score is 0 (No Floor):", result2.breakdown.jobReality === 0 ? "✅ PASS" : "❌ FAIL");

  console.log("\n--- Test 4: Education Status & Score (Refinement) ---");
  const result4 = matchJobWithCandidate(mockJob, { ...mockCandidate, education: { highestLevel: "none", fieldOfStudy: null, institutions: [] } });
  console.log("Education Status (Missing logic):", result4.breakdown.education.status);
  console.log("Score (Should be 25):", result4.breakdown.education.score);
  console.log("Status is PARTIAL:", result4.breakdown.education.status === "PARTIAL" ? "✅ PASS" : "❌ FAIL");
  
  // Also check "education exists but not required" logic from before? No, that specific test case (mockJob has educationLevel)
  const noEduJob: JobRequirements = { ...mockJob, requirements: { ...mockJob.requirements, educationLevel: null } };
  const result4b = matchJobWithCandidate(noEduJob, mockCandidate);
  console.log("Education Score (NOT_REQUIRED job):", result4b.breakdown.education.score);
  console.log("Score is 0 for NOT_REQUIRED:", result4b.breakdown.education.score === 0 ? "✅ PASS" : "❌ FAIL");

  console.log("\n--- Test 5: Eligibility Status (Task D) ---");
  // Test with education existing: eligibility should be NOT_EVALUATED
  const result5 = matchJobWithCandidate(mockJob, mockCandidate);
  console.log("Eligibility Status (w/ Education):", result5.breakdown.eligibility.status);
  console.log("Status is NOT_EVALUATED:", result5.breakdown.eligibility.status === "NOT_EVALUATED" ? "✅ PASS" : "❌ FAIL");

  // Test without education: eligibility should be MATCHED (because remoteAllowed is true)
  const result5b = matchJobWithCandidate(noEduJob, mockCandidate);
  console.log("Eligibility Status (no Education):", result5b.breakdown.eligibility.status);
  console.log("Status is MATCHED:", result5b.breakdown.eligibility.status === "MATCHED" ? "✅ PASS" : "❌ FAIL");
}

runTests().catch(console.error);
