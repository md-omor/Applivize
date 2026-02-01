import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/logo3.png";

const GlobalFooter = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className=" h-8 sm:h-10">
            <Image
              src={logo}
              alt="Rielor logo"
              priority
              className="w-full h-full object-contain"
            />
          </div>
            <span className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tighter whitespace-nowrap">
              Rielor <span className="text-[10px] text-red-500">BETA</span>
            </span>
            </Link>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
              Empowering job seekers with Evidence-driven insights. Understand your alignment with any job description and optimize your resume for success.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/upload" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">Analyze Resume</Link></li>
              <li><Link href="/knowledge-center" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">Knowledge Center</Link></li>
              <li><Link href="/ai-assistant" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">AI Assistant</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Rielor. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 text-xs">Built for professionals</span>
            <div className="flex gap-4">
              {/* social icons could go here */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
