'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const styles = theme === 'dark' ? {
    bg: 'bg-slate-950 border-slate-800',
    textMain: 'text-slate-500',
    icon: 'text-slate-400 hover:text-white',
    textSub: 'text-slate-600'
  } : {
    bg: 'bg-slate-50 border-slate-200',
    textMain: 'text-slate-500',
    icon: 'text-slate-400 hover:text-indigo-600',
    textSub: 'text-slate-400'
  };

  return (
    <footer className={`border-t py-12 relative z-10 ${styles.bg}`}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className={`text-sm ${styles.textMain}`}>
          © {currentYear} Cauã Freitas. {t.footer.rights}
        </div>

        <div className="flex gap-6">
          <a href="https://github.com/caufreitxs026" target="_blank" className={`transition-colors ${styles.icon}`}>
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/cauafreitas" target="_blank" className={`transition-colors ${styles.icon}`}>
            <Linkedin size={20} />
          </a>
          <a href="mailto:cauafreitas026@gmail.com" className={`transition-colors ${styles.icon}`}>
            <Mail size={20} />
          </a>
        </div>

        <div className={`text-xs font-mono ${styles.textSub}`}>
          {t.footer.developed} Next.js & Supabase
        </div>
      </div>
    </footer>
  );
}
