
const resumeText = `
John Doe
john.doe@example.com
123-456-7890
New York, NY

Summary: Seasoned developer with 5 years of experience in React and Node.js.

Experience:
Senior Developer at Tech Corp (2020 - Present)
- Built scalable apps.

Junior Developer at StartUp Inc (2018 - 2020)
- Learned coding.

Skills: React, Node.js, TypeScript

Projects:
- E-commerce Platform
- Chat App
`;

const jobDescription = `
Looking for a React Developer.
Requirements:
- 3+ years experience
- React, TypeScript
`;

async function test() {
  console.log("Testing API extraction...");
  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, jobDescription })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${text}`);
    }

    const data = await response.json();
    console.log("API Response Status:", response.status);
    console.log("Final Score:", data.finalScore);
    console.log("Decision:", data.decision);
    console.log("Test Passed!");
    
  } catch (error) {
    console.error("Test Failed:", error);
  }
}

test();
