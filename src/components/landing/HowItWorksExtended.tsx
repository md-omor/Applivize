import React from 'react';

const steps = [
  {
    title: 'Upload Resume',
    description: 'Securely upload your resume in PDF or Word format. We extract your skills and experience automatically.',
  },
  {
    title: 'Paste Job Description',
    description: 'Copy and paste the JD of the role you are targeting. We analyze the explicit and hidden requirements.',
  },
  {
    title: 'Get Match Insights',
    description: 'Receive a detailed score and actionable feedback on how you align with the specific job.',
  },
];

const HowItWorksExtended: React.FC = () => {
  return (
    <section id="how-it-works-extended" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-16 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold mb-6">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-500 max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksExtended;
