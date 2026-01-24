import React from 'react';

const TrustSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Trust is Earned Through Transparency</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6">
              <h3 className="font-bold text-slate-800 mb-2">Targeted Design</h3>
              <p className="text-slate-500 text-sm">Built specifically for developers, designers, and high-growth professionals.</p>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-800 mb-2">No Hype</h3>
              <p className="text-slate-500 text-sm">We don't use fake testimonials or inflated success metrics. We let the data speak.</p>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-800 mb-2">Privacy First</h3>
              <p className="text-slate-500 text-sm">Your resume data is processed securely and never sold to third parties.</p>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Active Analysis Engine v1.0</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
