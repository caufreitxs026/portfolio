'use client';

import { motion } from 'framer-motion';
import { Award, ExternalLink, Database } from 'lucide-react';
import { useState } from 'react';

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
}

export default function CertificatesHUD({ certificates, isSecretMode }: { certificates: Certificate[], isSecretMode: boolean }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const accentColor = isSecretMode ? 'text-pink-500' : 'text-emerald-500';
  const borderColor = isSecretMode ? 'border-pink-500/30' : 'border-emerald-500/30';
  const hoverBg = isSecretMode ? 'hover:bg-pink-900/20' : 'hover:bg-emerald-900/20';

  return (
    <div className={`
      relative h-full flex flex-col p-6 rounded-2xl border bg-slate-900/40 backdrop-blur-md overflow-hidden
      ${borderColor}
    `}>
      {/* Cabeçalho do HUD */}
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
            <Database size={18} className={accentColor} />
            <h3 className="text-white font-mono text-lg font-bold tracking-wider">DATA_VAULT</h3>
        </div>
        <span className="text-xs text-slate-500 font-mono animate-pulse">● LIVE</span>
      </div>

      {/* Lista Rolável */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        {certificates.map((cert, i) => (
          <motion.a
            key={cert.id}
            href={cert.credential_url || '#'}
            target="_blank"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onMouseEnter={() => setHoveredId(cert.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`
              block p-4 rounded-lg border border-slate-800 transition-all duration-300 relative group
              ${hoverBg}
            `}
          >
            {/* Marcador Lateral */}
            <div className={`
              absolute left-0 top-0 bottom-0 w-1 transition-all duration-300
              ${hoveredId === cert.id ? (isSecretMode ? 'bg-pink-500' : 'bg-emerald-500') : 'bg-transparent'}
            `}></div>

            <div className="pl-3">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-slate-500 uppercase">{cert.issuer}</span>
                    <ExternalLink size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${accentColor}`} />
                </div>
                <h4 className="text-slate-200 font-bold text-sm mt-1 group-hover:text-white transition-colors">{cert.name}</h4>
                <p className="text-[10px] text-slate-600 font-mono mt-2 text-right">
                    {new Date(cert.issue_date).getFullYear()} // AUTH_CODE: {cert.id.toString().padStart(4, '0')}
                </p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Rodapé Decorativo */}
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-[10px] text-slate-600 font-mono">
        <span>TOTAL ENTRIES: {certificates.length}</span>
        <span>SYS.V.2.0</span>
      </div>
    </div>
  );
}
