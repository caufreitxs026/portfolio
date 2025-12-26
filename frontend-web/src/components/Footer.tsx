'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-slate-500 text-sm">
          © {currentYear} Cauã Freitas. {t.footer.rights}
        </div>

        <div className="flex gap-6">
          <a href="https://github.com/caufreitxs026" target="_blank" className="text-slate-400 hover:text-white transition-colors">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/cauafreitas" target="_blank" className="text-slate-400 hover:text-white transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="mailto:cauafreitas026@gmail.com" className="text-slate-400 hover:text-white transition-colors">
            <Mail size={20} />
          </a>
        </div>

        <div className="text-slate-600 text-xs font-mono">
          {t.footer.developed} Next.js & Supabase
        </div>
      </div>
    </footer>
  );
}
