'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Database, ShieldCheck, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url?: string | null;
}

export default function CertificatesHUD({ certificates, isSecretMode }: { certificates: Certificate[], isSecretMode: boolean }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const { theme } = useTheme();

  // Ordenação: Do mais recente (novo) para o mais antigo
  const sortedCertificates = [...certificates].sort((a, b) =>
    new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime()
  );

  // Adaptação Dinâmica de Cores (Dark / Light / Secret)
  const styles = theme === 'dark' ? {
    container: 'bg-slate-950/60 border-slate-800',
    headerBorder: 'border-slate-800',
    accent: isSecretMode ? 'text-pink-500' : 'text-emerald-400',
    badgeText: isSecretMode ? 'text-pink-400' : 'text-emerald-400',
    badgeBg: isSecretMode ? 'bg-pink-500/10 border-pink-500/30' : 'bg-emerald-500/10 border-emerald-500/30',
    scanLine: isSecretMode ? 'via-pink-500/20' : 'via-emerald-500/20',
    cardBorderHover: isSecretMode ? 'hover:border-pink-500/50' : 'hover:border-emerald-500/50',
    textMain: 'text-slate-100',
    textSub: 'text-slate-500',
    cardBg: 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60',
    scrollThumb: isSecretMode ? 'scrollbar-thumb-pink-500/20' : 'scrollbar-thumb-emerald-500/20',
  } : {
    // TEMA CLARO
    container: 'bg-white/80 border-slate-300 shadow-xl',
    headerBorder: 'border-slate-200',
    accent: 'text-indigo-600',
    badgeText: 'text-indigo-700',
    badgeBg: 'bg-indigo-50 border-indigo-200',
    scanLine: 'via-indigo-500/10',
    cardBorderHover: 'hover:border-indigo-400',
    textMain: 'text-slate-900',
    textSub: 'text-slate-500',
    cardBg: 'bg-slate-50/50 border-slate-200 hover:bg-white shadow-sm hover:shadow-md',
    scrollThumb: 'scrollbar-thumb-slate-300',
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

  const formatCertDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    return `${month}/${year}`;
  };

  return (
    <div className={`
      relative h-full flex flex-col p-5 md:p-6 rounded-2xl border backdrop-blur-md overflow-hidden
      ${styles.container}
    `}>
      {/* Injeção de Scrollbar Customizada CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hud-scroll::-webkit-scrollbar { width: 4px; }
        .hud-scroll::-webkit-scrollbar-track { background: transparent; }
        .hud-scroll::-webkit-scrollbar-thumb { border-radius: 10px; background-color: ${theme === 'dark' ? '#334155' : '#cbd5e1'}; }
      `}} />

      {/* Cabeçalho do Cofre de Dados */}
      <div className={`flex-shrink-0 flex items-center justify-between mb-6 border-b pb-4 ${styles.headerBorder}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${styles.badgeBg}`}>
            <Database size={20} className={styles.accent} />
          </div>
          <div>
            <h3 className={`font-mono text-lg font-bold tracking-widest leading-none ${styles.textMain}`}>DATA_VAULT</h3>
            <p className={`text-xs font-mono mt-1 ${styles.textSub}`}>SECURE CREDENTIAL ARCHIVE</p>
          </div>
        </div>
        <div className="flex flex-col items-end hidden sm:flex">
          <span className={`text-[10px] font-mono animate-pulse ${styles.textSub}`}>● SYSTEM ONLINE</span>
          <span className={`text-[10px] font-mono ${styles.textSub}`}>v.2.4.1</span>
        </div>
      </div>

      {/* Grid de Credenciais */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 hud-scroll"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          {sortedCertificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onMouseEnter={() => setHoveredId(cert.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                    relative group p-5 rounded-xl border transition-all duration-300 flex flex-col h-full overflow-hidden
                    ${styles.cardBg} ${styles.cardBorderHover}
                `}
            >
              {/* Efeito Scanner a Laser (Framer Motion) ativo no Hover */}
              {hoveredId === cert.id && (
                <motion.div
                  className={`absolute inset-x-0 h-16 bg-gradient-to-b from-transparent ${styles.scanLine} to-transparent pointer-events-none z-0`}
                  animate={{ top: ['-30%', '130%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Topo do Card: Badge de Verificação e Data */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <span className={`flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${styles.badgeBg} ${styles.badgeText}`}>
                  <ShieldCheck size={12} />
                  Verified
                </span>
                <span className={`text-[11px] font-mono font-medium ${styles.textSub}`}>
                  {formatCertDate(cert.issue_date)}
                </span>
              </div>

              {/* Informações do Certificado */}
              <div className="relative z-10 flex-1">
                <h4 className={`font-bold text-sm sm:text-base mb-2 leading-snug line-clamp-2 ${styles.textMain}`}>
                  {cert.name}
                </h4>
                <p className={`text-[11px] sm:text-xs font-mono uppercase tracking-wide line-clamp-1 ${styles.textSub}`}>
                  {cert.issuer}
                </p>
              </div>

              {/* Rodapé do Card: ID e Link de Validação */}
              <div className={`flex justify-between items-end mt-5 pt-3 border-t relative z-10 ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-200'}`}>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${styles.textSub}`}>
                  ID: {cert.id.substring(0, 5).toUpperCase()}
                </span>

                {cert.credential_url ? (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-colors ${styles.accent} hover:opacity-70`}
                  >
                    Validate <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className={`text-[10px] font-mono uppercase tracking-wider opacity-40 ${styles.textSub}`}>
                    Internal
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Fixo */}
      <div className={`flex-shrink-0 mt-4 pt-4 border-t flex justify-between items-center text-[10px] font-mono uppercase tracking-widest ${styles.headerBorder} ${styles.textSub}`}>
        <span>TOTAL_RECORDS: {certificates.length}</span>

        <div className="flex items-center gap-3">
          {canScroll && (
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`flex items-center gap-1 ${styles.accent}`}
            >
              <span>SCROLL_DOWN</span>
              <ChevronDown size={12} />
            </motion.div>
          )}
          <span>[EOS]</span>
        </div>
      </div>
    </div>
  );
}