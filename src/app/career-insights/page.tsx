
const CareerInsightsPage = () => {
  return (
    <div className="min-h-screen bg-white font-zalando selection:bg-indigo-100">
      {/* Hero Section */}
      <section className="relative py-28 bg-slate-900 overflow-hidden">
        {/* Abstract background effect */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-radial-at-bl from-indigo-500/5 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[12px] font-bold tracking-widest uppercase">
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Insider Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-[1.15]">
              The Career <br /> <span className="text-indigo-400 italic font-medium">Insights Portal</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
              Navigating the modern job market with data-driven clarity. Understand what recruiters truly value in the 2024 landscape.
            </p>
          </div>
        </div>
      </section>

     

      {/* Content Sections */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-32 max-w-5xl mx-auto">
            
            {/* New Section: Market Pulse */}
            <div className="grid lg:grid-cols-2 gap-20 items-center mb-10">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight font-zalando">
                  The 2024 <br /> Market Pulse
                </h2>
                <div className="w-20 h-1.5 bg-indigo-600 rounded-full mb-8"></div>
                <div className="space-y-6">
                  {[
                    { title: "AI-First Hiring", desc: "65% of companies now use advanced LLMs like our engine to screen for semantic skill matches." },
                    { title: "The Soft Skill Premium", desc: "Evidence of 'Collaboration' and 'Adaptability' is being weighed heavier than ever in technical roles." },
                    { title: "Hybrid is the Standard", desc: "Remote-only roles are stabilizing, while 'Hybrid-Flexible' has become the most competitive category." }
                  ].map((trend, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5"></div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{trend.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{trend.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100/50 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200/50 rounded-full blur-3xl opacity-50"></div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 font-zalando">Insider Tip</h3>
                <p className="text-slate-600 leading-relaxed font-medium mb-8">
                  "Don't just list your tools. List the impact those tools had on the business. Recruiters search for 'SQL', but they hire 'SQL-driven revenue growth'."
                </p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">J</div>
                   <div>
                     <p className="text-sm font-bold text-slate-900">Applivize Analysis Team</p>
                     <p className="text-xs text-slate-500">Recruitment Data Analysts</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Existing: Why JDs are Unrealistic */}
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="sticky top-28">
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight font-zalando">
                  Why JDs are <br /> Often Unrealistic
                </h2>
                <div className="w-20 h-1.5 bg-indigo-600 rounded-full mb-8"></div>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">
                  Most Job Descriptions (JDs) are "wish lists" rather than strict requirements. Recruiters often copy-paste from other roles or include every possible tool their team touches.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  { id: "01", title: "The Unicorn Trap", desc: "Companies list everything they WANT, but hire who they NEED. You only need to hit ~70% to be a top candidate." },
                  { id: "02", title: "Legacy Bloat", desc: "Requirements often include tools the team no longer uses but hasn't removed from the template." },
                  { id: "03", title: "Critical vs Secondary", desc: "The first 3-5 bullet points are usually the only ones the hiring manager actually cares about." }
                ].map((item) => (
                  <div key={item.id} className="group p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all hover:border-indigo-100">
                    <span className="block text-indigo-600 font-black text-2xl mb-4 font-zalando opacity-50 group-hover:opacity-100 transition-opacity">
                      {item.id}
                    </span>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                    <p className="text-slate-500 leading-relaxed text-sm font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leveling Expectations Redesign */}
            <div className="relative p-1 bg-slate-900 rounded-[3rem] overflow-hidden">
               <div className="relative p-12 md:p-20 bg-slate-900 rounded-[2.8rem] border border-white/5">
                <h2 className="text-4xl font-black text-white mb-12 tracking-tight font-zalando text-center">
                  Decoding <span className="text-indigo-400">Experience Levels</span>
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { level: "Junior", color: "text-blue-400", focus: "Learning & Execution", expectation: "High curiosity, solid fundamentals, requires guidance." },
                    { level: "Mid-Level", color: "text-indigo-400", focus: "Independence", expectation: "Strong problem solving, autonomy, mentors juniors." },
                    { level: "Senior", color: "text-emerald-400", focus: "Architecture & Impact", expectation: "Strategic thinking, cross-team impact, defines standards." }
                  ].map((item, i) => (
                    <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-colors">
                      <span className={`block font-black uppercase tracking-widest text-xs mb-4 ${item.color}`}>
                        {item.level}
                      </span>
                      <h4 className="text-xl font-bold text-white mb-3">{item.focus}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        {item.expectation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-32 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-[3.5rem] bg-slate-900 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-radial-at-t from-indigo-500/20 to-transparent pointer-events-none"></div>
             
             <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight font-zalando relative">
               Unlock Your <br /> <span className="text-indigo-400 italic">Market Potential</span>
             </h2>
             <p className="text-slate-400 mb-12 text-lg max-w-xl mx-auto font-medium relative">
               Don't guess how you compare to the competition. Get a data-driven breakdown of your fitness for any role.
             </p>
             <button className="relative bg-white text-slate-900 px-12 py-5 rounded-full font-black text-lg hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95 font-zalando cursor-pointer">
               Unlock My Insights
             </button>
          </div>
        </div>
      </section>

       {/* Platform Stats Bar (Integrated based on shared design) */}
      <section className="bg-slate-900 border-t border-white/5 py-12">
        <div className="container mx-auto px-4">
          <p className="text-slate-500 mb-8 uppercase tracking-widest text-[11px] font-black text-center">Platform Stats</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
            <div>
              <span className="block text-4xl font-black mb-2 text-white">10k+</span>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">Resumes Analyzed</p>
            </div>
            <div>
              <span className="block text-4xl font-black mb-2 text-white">85%</span>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">ATS Optimized</p>
            </div>
            <div>
              <span className="block text-4xl font-black mb-2 text-white">2x</span>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">Interview Rate Increase</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerInsightsPage;
