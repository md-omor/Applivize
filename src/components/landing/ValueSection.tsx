import React from 'react';

const values = [
  {
    title: 'Stop the application black hole',
    description: 'Stop sending resumes into the void. Know exactly where your gaps are and how to bridge them.',
  },
  {
    title: 'Targeted Skill Extraction',
    description: 'We pull the most critical requirements from the JD and see if they exist in your profile—implicitly or explicitly.',
  },
  {
    title: 'Hiring Manager Perspective',
    description: 'Our AI simulates the logic of a technical recruiter, giving you an unbiased assessment of your "paper" fit.',
  },
];

const ValueSection: React.FC = () => {
  return (
    <section className="pb-32 px-4 bg-white relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tighter leading-[1.15] font-zalando">
              DESIGNED FOR <br />
              HIGH-IMPACT SEASONS.
            </h2>
            <div className="space-y-12">
              {values.map((value) => (
                <div key={value.title} className="flex gap-6 group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border-4 border-slate-50 flex items-center justify-center transition-transform group-hover:scale-110">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-transparent blur-[80px] -z-10 rounded-full"></div>
            <div className="relative bg-slate-900 rounded-[32px] p-1 shadow-2xl overflow-hidden group">
              <div className="bg-slate-950 rounded-[30px] p-8 border border-white/10">
                {/* Mock UI Header */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-bold tracking-widest uppercase">
                    Status: Matching
                  </div>
                </div>
                
                {/* Mock UI Content */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="h-2 w-1/4 bg-white/20 rounded-full"></div>
                    <div className="h-5 w-3/4 bg-white/10 rounded-full"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-4">
                      <div className="h-1.5 w-1/2 bg-white/10 rounded-full mb-3"></div>
                      <div className="text-3xl font-black text-emerald-400">84%</div>
                    </div>
                    <div className="h-24 bg-white/5 rounded-2xl border border-white/5 p-4">
                      <div className="h-1.5 w-1/2 bg-white/10 rounded-full mb-3"></div>
                      <div className="text-3xl font-black text-rose-400">Low</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="h-1.5 w-full bg-white/5 rounded-full relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-[84%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.3)]"></div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-[60%] bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
