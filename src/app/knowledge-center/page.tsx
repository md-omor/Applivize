
const KnowledgeCenterPage = () => {
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
              Insider Knowledge
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-[1.15]">
              Knowledge <br /> <span className="text-indigo-400 italic font-medium">Center</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
              Master the art of job matching. Understand the technology behind hiring and how to position yourself for success.
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-32 max-w-5xl mx-auto">
            
            {/* What ATS Systems Look For */}
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="sticky top-28">
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight font-zalando">
                  What ATS Systems <br /> Actually Look For
                </h2>
                <div className="w-20 h-1.5 bg-indigo-600 rounded-full mb-8"></div>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">
                  Applicant Tracking Systems (ATS) are essentially databases for recruiters. They don't "read" your resume like a human—they parse it for specific data points.
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  { id: "01", title: "Formatting", desc: "Clean, standard layouts that can be reliably parsed into structured text fields without data loss." },
                  { id: "02", title: "Keywords", desc: "Hard skills, methodologies, and specific tools mentioned in the JD that act as primary search filters." },
                  { id: "03", title: "Seniority Signal", desc: "Duration of experience and complexity of responsibilities mapped against the role requirements." }
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

            {/* Why Keyword Mismatch Happens */}
            <div className="relative p-1 bg-slate-900 rounded-[3rem] overflow-hidden">
               <div className="relative p-12 md:p-20 bg-slate-900 rounded-[2.8rem] border border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                  <svg className="w-32 h-32 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                </div>
                
                <h2 className="text-4xl font-black text-white mb-8 tracking-tight font-zalando max-w-xl">
                  Why Keyword <span className="text-indigo-400">Mismatch</span> Happens
                </h2>
                <p className="text-slate-400 mb-12 text-lg leading-relaxed max-w-2xl font-medium">
                  Even top-tier candidates get rejected due to "semantic gaps"—where your experience doesn't use the exact terminology the system is programmed to find.
                </p>
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <h4 className="font-bold text-white text-xl mb-4 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Synonym Confusion
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      You wrote "Interface Design," but the JD says "UI/UX." A human knows they are identical, but an older ATS treats them as entirely different concepts.
                    </p>
                  </div>
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <h4 className="font-bold text-white text-xl mb-4 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Implicit vs Explicit
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      You assumed your Project Lead role implied "Team Management," but you didn't explicitly list it. If the bot isn't looking for the title, you miss the credit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Myths vs Reality */}
            <div>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight font-zalando">Resume Myths vs Reality</h2>
                <p className="text-slate-500 font-medium">Cutting through the noise of traditional career advice.</p>
              </div>
              
              <div className="grid gap-6">
                {[
                  { myth: "Resumes must be 1 page.", reality: "Quality and relevance beat length. For mid-to-senior roles, 2 pages is the industry standard for depth." },
                  { myth: "Use fancy graphics to stand out.", reality: "Graphics often break ATS parsers and confuse the AI. Stick to clean, typography-first designs." },
                  { myth: "Quantity over quality.", reality: "Applying to 100 jobs with one resume is 10x less effective than applying to 10 jobs with tailored, analyzed resumes." }
                ].map((item, i) => (
                  <div key={i} className="group flex flex-col md:flex-row gap-4 items-stretch">
                    <div className="w-full md:w-1/2 p-10 bg-red-50/50 border border-red-100 rounded-3xl transition-colors group-hover:bg-red-50">
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-[10px] font-black text-red-600 uppercase mb-4 tracking-widest">Myth</span>
                      <p className="text-xl font-bold text-slate-900 font-zalando leading-tight">{item.myth}</p>
                    </div>
                    <div className="hidden md:flex items-center text-slate-200">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div className="w-full md:w-1/2 p-10 bg-emerald-50/50 border border-emerald-100 rounded-3xl transition-colors group-hover:bg-emerald-50">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-[10px] font-black text-emerald-600 uppercase mb-4 tracking-widest">Reality</span>
                      <p className="text-slate-700 font-medium text-lg leading-relaxed">{item.reality}</p>
                    </div>
                  </div>
                ))}
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
               Ready to beat the <br /> <span className="text-indigo-400 italic">ATS bot?</span>
             </h2>
             <p className="text-slate-400 mb-12 text-lg max-w-xl mx-auto font-medium relative">
               Get a real-time analysis of your resume alignment before you hit the apply button.
             </p>
             <button className="relative bg-white text-slate-900 px-12 py-5 rounded-full font-black text-lg hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95 font-zalando cursor-pointer">
               Start Analysis Now
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeCenterPage;
