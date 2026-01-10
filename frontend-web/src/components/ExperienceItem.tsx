'use client';

import { motion } from 'framer-motion';
import { Calendar, Building2, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import SpotlightCard from './ui/SpotlightCard';

interface ExperienceProps {
  experience: {
    id: number;
    company: string;
    role: string;
    start_date: string;
    end_date?: string;
    description: string;
    location?: string;
  };
  index: number;
}

export default function ExperienceItem({ experience, index }: ExperienceProps) {
  const [isSecretMode, setIsSecretMode] = useState(false);

  useEffect(() => {
    const checkSecretMode = () => {
      if (typeof document !== 'undefined') {
        setIsSecretMode(document.body.classList.contains('secret-active'));
      }
    };
    const interval = setInterval(checkSecretMode, 500);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Momento Atual'; // Texto mais fluido que "Presente"
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  const startDate = formatDate(experience.start_date);
  const endDate = experience.end_date ? formatDate(experience.end_date) : 'Momento Atual';
  const isCurrentRole = !experience.end_date;

  // Tema Dinâmico
  const theme = isSecretMode ? {
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/10 border-pink-500/20',
    timelineDot: 'bg-pink-500',
    timelineGlow: 'shadow-[0_0_15px_rgba(236,72,153,0.6)]',
    dateBadge: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    accentText: 'text-pink-300'
  } : {
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    timelineDot: 'bg-emerald-500',
    timelineGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.6)]',
    dateBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    accentText: 'text-emerald-300'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative mb-10 sm:mb-12 last:mb-0 pl-4 sm:pl-6 group"
    >
      {/* Nó da Timeline (Com efeito de pulso se for atual) */}
      <div className={`
        absolute -left-[39px] sm:-left-[41px] top-1 sm:top-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[3px] sm:border-4 border-slate-950 
        ${theme.timelineDot} ${isCurrentRole ? `animate-pulse ${theme.timelineGlow}` : 'shadow-[0_0_10px_rgba(0,0,0,0.5)]'} 
        z-10 transition-colors duration-500
      `}></div>

      {/* Wrapper com Efeito Spotlight e Tilt 3D */}
      <SpotlightCard isSecretMode={isSecretMode} className="p-5 sm:p-6 transition-transform duration-300 group-hover:-translate-y-1">
        
        {/* Header do Card */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4">
            
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                {/* Cargo e Empresa */}
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                        {experience.role}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-2">
                        <div className={`p-1.5 rounded-md border ${theme.iconBg} ${theme.iconColor}`}>
                            <Building2 size={14} />
                        </div>
                        <span className="text-sm sm:text-base font-medium text-slate-300">
                            {experience.company}
                        </span>
                    </div>
                </div>

                {/* Badge de Data (Design Compacto Mobile) */}
                <div className={`
                    self-start flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold border whitespace-nowrap mt-1 sm:mt-0
                    ${isCurrentRole ? theme.dateBadge : 'bg-slate-800/50 border-slate-700 text-slate-400'}
                `}>
                    <Calendar size={12} />
                    <span className="uppercase tracking-wide">{startDate} — {endDate}</span>
                </div>
            </div>

        </div>

        {/* Descrição */}
        <div className="relative">
            <p className="text-slate-400 leading-relaxed text-sm sm:text-base border-t border-slate-800/50 pt-4 mt-2">
                {experience.description}
            </p>
        </div>

        {/* Rodapé: Localização */}
        {experience.location && (
            <div className="mt-4 pt-3 flex items-center gap-2 text-xs font-mono text-slate-500 border-t border-slate-800/30 border-dashed">
                <MapPin size={12} className={theme.iconColor} />
                <span>{experience.location}</span>
            </div>
        )}

      </SpotlightCard>
    </motion.div>
  );
}
