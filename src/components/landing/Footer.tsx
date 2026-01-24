import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white text-lg">
            J
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">Applivize</span>
        </div>
        <div className="text-slate-400 text-sm">
          © {new Date().getFullYear()} Applivize. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
