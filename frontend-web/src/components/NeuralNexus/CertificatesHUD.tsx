'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Database, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
}

export default function CertificatesHUD({ certificates, isSecretMode }: { certificates: Certificate[], isSecretMode: boolean }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const { theme } = useTheme();

  // Adaptação de cores
  const styles = theme === 'dark' ? {
    container: 'bg-slate-900/40 border-slate-800',
    border: isSecretMode ? 'border-pink-500/30' : 'border-emerald-500/30',
    accent: isSecretMode ? 'text-pink-500' : 'text-emerald-500',
    textMain: 'text-white',
    textSub: 'text-slate-500',
    cardBg: isSecretMode ? 'hover:bg-pink-900/20' : 'hover:bg-emerald-900/20',
    cardBorder: 'border-slate-800',
    cardTitle: 'text-slate-200',
    scrollThumb: isSecretMode ? 'scrollbar-thumb-pink-500/20' : 'scrollbar-thumb-emerald-500/20',
    highlight: isSecretMode ? 'bg-pink-500' : 'bg-emerald-500'
  } : {
    // TEMA CLARO
    container: 'bg-white/80 border-slate-300 shadow-xl',
    border: 'border-slate-300',
    accent: 'text-purple-600', // Roxo no claro
    textMain: 'text-slate-900',
    textSub: 'text-slate-600',
    cardBg: 'hover:bg-purple-50', // Fundo roxo suave no hover
    cardBorder: 'border-slate-200 bg-white',
    cardTitle: 'text-slate-900',
    scrollThumb: 'scrollbar-thumb-slate-400',
    highlight: 'bg-purple-600' // Marcador roxo
  };

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        setCanScroll(scrollRef.current.scrollHeight > scrollRef.current.clientHeight);
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [certificates]);

  return (
    <div className={`
      relative h-full flex flex-col p-5 rounded-2xl border backdrop-blur-md overflow-hidden
      ${styles.container} ${styles.border}
    `}>
      {/* Cabeçalho */}
      <div className={`flex-shrink-0 flex items-center justify-between mb-4 border-b pb-4 ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2">
            <Database size={18} className={styles.accent} />
            <div>
              <h3 className={`font-mono text-base font-bold tracking-wider leading-none ${styles.textMain}`}>DATA_VAULT</h3>
              <p className={`text-[10px] font-mono mt-1 ${styles.textSub}`}>SECURE ARCHIVE</p>
            </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-[10px] font-mono animate-pulse ${styles.textSub}`}>● SYSTEM ONLINE</span>
          <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>v.2.4.1</span>
        </div>
      </div>

      {/* Lista */}
      <div 
        ref={scrollRef}
        className={`
          flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar
          scrollbar-thin scrollbar-track-transparent ${styles.scrollThumb}
        `}
      >
        {certificates.map((cert, i) => (
          <motion.a
            key={cert.id}
            href={cert.credential_url || '#'}
            target="_blank"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onMouseEnter={() => setHoveredId(cert.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`
              block p-3 rounded-lg border transition-all duration-300 relative group
              ${styles.cardBorder} ${styles.cardBg}
            `}
          >
            {/* Marcador Lateral */}
            <div className={`
              absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg transition-all duration-300
              ${hoveredId === cert.id ? styles.highlight : 'bg-transparent'}
            `}></div>

            <div className="pl-2">
                <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded ${theme === 'dark' ? (isSecretMode ? 'bg-pink-500/10 text-pink-300' : 'bg-emerald-500/10 text-emerald-300') : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                      {cert.issuer}
                    </span>
                    <ExternalLink size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${styles.accent}`} />
                </div>
                <h4 className={`font-bold text-sm mt-2 transition-colors line-clamp-2 ${styles.cardTitle} group-hover:${theme === 'dark' ? 'text-white' : 'text-purple-900'}`}>
                  {cert.name}
                </h4>
                <div className={`flex justify-between items-end mt-2 border-t pt-2 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                    <span className={`text-[10px] font-mono ${styles.textSub}`}>Issued: {new Date(cert.issue_date).getFullYear()}</span>
                    <span className={`text-[9px] font-mono uppercase ${theme === 'dark' ? 'text-slate-700' : 'text-slate-400'}`}>ID: {cert.id.toString().padStart(4, '0')}</span>
                </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Footer Fixo */}
      <div className={`flex-shrink-0 mt-3 pt-3 border-t flex justify-between items-center text-[10px] font-mono ${theme === 'dark' ? 'border-white/5 text-slate-600' : 'border-slate-200 text-slate-500'}`}>
        <span>TOTAL: {certificates.length}</span>
        
        <div className="flex items-center gap-3">
          {canScroll && (
            <motion.div 
               animate={{ y: [0, 2, 0] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
               className={`flex items-center gap-1 ${theme === 'dark' ? 'text-slate-500' : 'text-purple-400'}`}
            >
               <span>SCROLL</span>
               <ChevronDown size={10} />
            </motion.div>
          )}
          <span>EOS</span>
        </div>
      </div>
    </div>
  );
}
