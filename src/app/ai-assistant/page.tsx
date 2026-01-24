
const AIAssistantPage = () => {
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
              Insider Logic
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-[1.15]">
              Inside Our <br /> <span className="text-indigo-400 italic font-medium">AI Engine</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
              Transparency-first Job Matching. We don't just give you a score; we show you the reasoning behind every match.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            
            {/* Four Pillars */}
            <div className="mb-32">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="max-w-xl">
                  <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight font-zalando">
                    The Four Pillars <br /> of Our Analysis
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">
                    Our AI evaluates your profile based on four core categories to ensure a multidimensional match that goes beyond simple keywords.
                  </p>
                </div>
                <div className="hidden md:block w-32 h-1.5 bg-indigo-600 rounded-full mb-4"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Technical Alignment", desc: "Evaluating hard skills, technical tools, and domain expertise against the specific requirements." },
                  { title: "Seniority Signal", desc: "Mapping years of experience and level of responsibility to ensure the role matches your career stage." },
                  { title: "Semantic Relevance", desc: "Understanding the context of your achievements rather than just scanning for exact word matches." }
                ].map((pillar, i) => (
                  <div key={i} className="group p-10 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all hover:border-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 text-slate-50 font-black text-6xl group-hover:text-indigo-50/50 transition-colors pointer-events-none">
                      0{i+1}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-4 relative">{pillar.title}</h4>
                    <p className="text-slate-500 leading-relaxed text-sm font-medium relative">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Anti-Hallucination Section */}
            <div className="relative p-1 bg-slate-900 rounded-[3rem] overflow-hidden mb-32">
               <div className="relative p-12 md:p-20 bg-slate-900 rounded-[2.8rem] border border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                  <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                </div>
                
                <h2 className="text-4xl font-black text-white mb-8 tracking-tight font-zalando max-w-xl">
                  Built-in <span className="text-indigo-400">Accuracy</span> (Anti-Hallucination)
                </h2>
                <p className="text-slate-400 mb-12 text-lg leading-relaxed max-w-2xl font-medium">
                  We've engineered our models with strict semantic constraints to ensure the output is grounded in your actual data.
                </p>
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <h4 className="font-bold text-white text-xl mb-4 flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 text-xs text-center leading-none">✕</span>
                      No Inventions
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                      We never "create" skills that aren't present. If it's not in your resume or clearly implied by your experience, it doesn't exist to our AI.
                    </p>
                  </div>
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <h4 className="font-bold text-white text-xl mb-4 flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 text-xs text-center leading-none">✕</span>
                      Strict Evidence
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                      Every insight is backed by specific points from your history. We don't assume professional expertise without project-based proof.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparency-First Section */}
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight font-zalando">
                  Transparency <br /> Above All
                </h2>
                <div className="w-20 h-1.5 bg-indigo-600 rounded-full mb-10"></div>
                
                <div className="space-y-10">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">Reasoning Over Scoring</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      A raw score is just a number. Our AI provides a detailed technical breakdown, identifying exactly where the gaps are so you can fix them.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">Constant Optimization</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      We refine our matching models against real-world ATS data to ensure our "likelihood to interview" logic remains accurate to current hiring trends.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square bg-slate-900 rounded-[3rem] p-1 overflow-hidden">
                  <div className="w-full h-full rounded-[2.85rem] bg-indigo-50 flex items-center justify-center p-12">
                    <div className="space-y-6 w-full">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-4 bg-white rounded-full w-full animate-pulse shadow-sm" style={{ animationDelay: `${i * 200}ms` }}></div>
                      ))}
                      <div className="h-20 bg-indigo-600/10 rounded-2xl w-full border border-indigo-600/5"></div>
                      {[1, 2].map((i) => (
                        <div key={i} className="h-4 bg-white rounded-full w-full animate-pulse shadow-sm" style={{ animationDelay: `${(i+3) * 200}ms` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Visual accent */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
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
               Ready to see the <br /> <span className="text-indigo-400 italic">AI in action?</span>
             </h2>
             <p className="text-slate-400 mb-12 text-lg max-w-xl mx-auto font-medium relative">
               Run a sample analysis to understand how our algorithms weigh your experience.
             </p>
             <button className="relative bg-white text-slate-900 px-12 py-5 rounded-full font-black text-lg hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95 font-zalando cursor-pointer">
               Start Free Analysis
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIAssistantPage;
