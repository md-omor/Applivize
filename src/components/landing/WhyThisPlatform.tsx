import React from 'react';

const WhyThisPlatform: React.FC = () => {
  const points = [
    {
      title: "ATS-Aware Analysis",
      description: "We simulate how Applicant Tracking Systems parse your resume, identifying potential filtering issues before you hit apply."
    },
    {
      title: "Skill Gap Clarity",
      description: "Instantly see which required skills you're missing and get advice on how to bridge the gap in your experience list."
    },
    {
      title: "No Guessing, Just Data",
      description: "Our proprietary scoring algorithm is based on real-world hiring patterns, not just keyword matching."
    },
    {
      title: "Built for Real Job Seekers",
      description: "Professional tools shouldn't be complicated. We focus on clarity and actionable insights for developers and designers."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Why This Platform?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {points.map((point, index) => (
              <div key={index} className="flex gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="mt-1">
                  <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px]">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{point.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyThisPlatform;
