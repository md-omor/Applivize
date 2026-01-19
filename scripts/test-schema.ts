
import { matchJobWithCandidate } from "../src/lib/match";
import { CandidateProfile, JobRequirements } from "../src/types/analysis";

// Mock Candidate Data adhering to new schema
const mockCandidate: CandidateProfile = {
  candidate: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    location: "New York, NY"
  },
  professionalSummary: "Experienced developer",
  experience: {
    totalYears: 5,
    currentRole: "Senior Developer",
    workHistory: [
      {
        role: "Senior Developer",
        company: "Tech Corp",
        durationYears: 3,
        technologies: ["React", "TypeScript", "Node.js"]
      },
      {
        role: "Junior Developer",
        company: "Startup Inc",
        durationYears: 2,
        technologies: ["JavaScript", "HTML", "CSS"]
      }
    ]
  },
  education: {
    highestLevel: "Bachelor",
    fieldOfStudy: "Computer Science",
    institutions: ["University of Tech"]
  },
  skills: {
    primary: ["React", "TypeScript", "Node.js"],
    secondary: ["AWS", "Docker"],
    tools: ["VS Code", "Git"]
  },
  projects: [],
  certifications: [],
  meta: {
    resumeLanguage: "English",
    hasGaps: false
  }
};

// Mock Job Data
const mockJob: JobRequirements = {
  job: {
    title: "Senior Frontend Engineer",
    company: "Big Tech",
    location: "Remote",
    workType: "remote"
  },
  requirements: {
    minimumExperienceYears: 4,
    educationLevel: "Bachelor",
    requiredSkills: ["React", "TypeScript"],
    preferredSkills: ["AWS"],
    tools: ["Jira"]
  },
  responsibilities: ["Build UI"],
  seniority: "Senior",
  keywords: ["Frontend", "React"],
  meta: {
    remoteAllowed: true,
    visaRequired: false
  }
};

console.log("Testing Matching Logic...");
const result = matchJobWithCandidate(mockJob, mockCandidate);

console.log("Match Result:", JSON.stringify(result, null, 2));

if (result.breakdown.skills > 20 && result.breakdown.experience === 25) {
  console.log("✅ TEST PASSED: Matching logic works with new schema.");
} else {
  console.error("❌ TEST FAILED: Scores are not as expected.");
  process.exit(1);
}
