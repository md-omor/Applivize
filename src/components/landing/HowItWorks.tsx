import Card from '@/components/shared/Card';
import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Drop your resume',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    description: 'We support PDF and DOCX formats. Our AI extracts the core signal from your experience.',
  },
  {
    number: '02',
    title: 'Input the role',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Paste the requirements or upload the JD. We look for hidden keywords and implied traits.',
  },
  {
    number: '03',
    title: 'Get the truth',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'A realistic score and actionable advice on what to improve or why to skip.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 px-4 relative overflow-hidden bg-slate-50/40">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4 font-zalando ">Three steps to clarity.</h2>
          <p className="text-lg text-slate-500 font-medium font-zalando">Built for competitive job markets where every application counts.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <Card key={step.number} className="p-10 border-none bg-white relative group overflow-hidden " hoverable>
              <div className="absolute top-0 right-0 p-4 select-none opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <span className="text-9xl font-black italic leading-none">{step.number}</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white mb-8 shadow-lg shadow-slate-900/10">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 font-zalando">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium font-mono">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
