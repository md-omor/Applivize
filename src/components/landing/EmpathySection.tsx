import React from 'react';

const EmpathySection: React.FC = () => {
  const questions = [
    "Why do I keep getting rejected?",
    "Am I underqualified or just missing keywords?",
    "Should I even apply?"
  ];

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-6">The Job Search Struggle</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 max-w-3xl leading-tight">
            We know how it feels to apply into the void.
          </h2>
          
          <div className="flex flex-col md:row gap-6 md:gap-12 mb-12">
            {questions.map((q, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl">
                <p className="text-xl font-medium italic text-slate-200">{"\""}{q}{"\""}</p>
              </div>
            ))}
          </div>

          <p className="text-slate-400 max-w-2xl text-lg">
            Job hunting is hard enough. We built Applivize to give you back control. Stop wondering and start knowing exactly where you stand.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EmpathySection;
