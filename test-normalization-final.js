function normalize(skill) {
  return skill
    .toLowerCase()
    .replace(/\.js/g, "")
    .replace(/[^a-z0-9+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const testCases = [
  { input: "React.js", expected: "react" },
  { input: "Next.js", expected: "next" },
  { input: "Node JS", expected: "node js" },
  { input: "C++", expected: "c++" },
  { input: "TypeScript!", expected: "typescript" },
  { input: "  AWS-Cloud  ", expected: "aws cloud" },
  { input: "Vue.JS", expected: "vue" }
];

console.log("=== Testing Mandatory Normalization ===");
let allPassed = true;
testCases.forEach(t => {
  const result = normalize(t.input);
  const passed = result === t.expected;
  if (!passed) allPassed = false;
  console.log(`${t.input.padEnd(15)} => ${result.padEnd(12)} [${passed ? "✅ PASS" : "❌ FAIL"}]`);
});

console.log("\nFinal Result:", allPassed ? "✅ ALL PASSED" : "❌ SOME FAILED");

// Test weight distribution
const weights = {
  REQUIRED_SKILLS: 30,
  PREFERRED_SKILLS: 10,
  TOOLS: 10,
  EXPERIENCE: 25,
  EDUCATION: 15,
  ELIGIBILITY: 10,
};

const total = Object.values(weights).reduce((a, b) => a + b, 0);
console.log("\nWeight Distribution Check:");
console.log("Total Weight:", total, total === 100 ? "✅ 100%" : "❌ NOT 100%");
