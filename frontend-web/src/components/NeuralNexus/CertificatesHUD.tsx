'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Database, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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

  const accentColor = isSecretMode ? 'text-pink-500' : 'text-emerald-500';
  const borderColor = isSecretMode ? 'border-pink-500/30' : 'border-emerald-500/30';
  const hoverBg = isSecretMode ? 'hover:bg-pink-900/20' : 'hover:bg-emerald-900/20';
  const scrollbarColor = isSecretMode ? 'scrollbar-thumb-pink-500/20' : 'scrollbar-thumb-emerald-500/20';

  // Verifica se há conteúdo suficiente para scroll
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
      relative h-full flex flex-col p-5 rounded-2xl border bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-xl
      ${borderColor}
    `}>
      {/* Cabeçalho do HUD */}
      <div className="flex-shrink-0 flex items-center justify-between mb-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
            <Database size={18} className={accentColor} />
            <div>
              <h3 className="text-white font-mono text-base font-bold tracking-wider leading-none">DATA_VAULT</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-1">SECURE ARCHIVE</p>
            </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-500 font-mono animate-pulse">● SYSTEM ONLINE</span>
          <span className="text-[10px] text-slate-600 font-mono">v.2.4.1</span>
        </div>
      </div>

      {/* Lista Rolável (Scroll Interno) */}
      <div 
        ref={scrollRef}
        className={`
          flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar
          scrollbar-thin scrollbar-track-transparent ${scrollbarColor}
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
              block p-3 rounded-lg border border-slate-800 transition-all duration-300 relative group
              ${hoverBg}
            `}
          >
            {/* Marcador Lateral Ativo */}
            <div className={`
              absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg transition-all duration-300
              ${hoveredId === cert.id ? (isSecretMode ? 'bg-pink-500' : 'bg-emerald-500') : 'bg-transparent'}
            `}></div>

            <div className="pl-2">
                <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded ${isSecretMode ? 'bg-pink-500/10 text-pink-300' : 'bg-emerald-500/10 text-emerald-300'}`}>
                      {cert.issuer}
                    </span>
                    <ExternalLink size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${accentColor}`} />
                </div>
                <h4 className="text-slate-200 font-bold text-sm mt-2 group-hover:text-white transition-colors line-clamp-2">
                  {cert.name}
                </h4>
                <div className="flex justify-between items-end mt-2 border-t border-white/5 pt-2">
                    <span className="text-[10px] text-slate-600 font-mono">Issued: {new Date(cert.issue_date).getFullYear()}</span>
                    <span className="text-[9px] text-slate-700 font-mono uppercase">ID: {cert.id.toString().padStart(4, '0')}</span>
                </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Rodapé Fixo (Sempre Visível) */}
      <div className="flex-shrink-0 mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-600 font-mono">
        <span>TOTAL ENTRIES: {certificates.length}</span>
        
        <div className="flex items-center gap-3">
          {canScroll && (
            <motion.div 
               animate={{ y: [0, 2, 0] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
               className={`flex items-center gap-1 ${isSecretMode ? 'text-pink-500/70' : 'text-emerald-500/70'}`}
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
