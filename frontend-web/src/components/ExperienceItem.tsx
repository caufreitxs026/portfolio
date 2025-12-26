'use client';

import { motion } from 'framer-motion';
import { Calendar, Building2, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    // Sincronização rápida para garantir o tema correto
    const interval = setInterval(checkSecretMode, 500);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Presente';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  const startDate = formatDate(experience.start_date);
  const endDate = experience.end_date ? formatDate(experience.end_date) : 'Atual';

  // Configuração de Tema
  const theme = isSecretMode ? {
    border: 'border-pink-500/30',
    hoverBorder: 'hover:border-pink-500/60',
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-400',
    timelineLine: 'bg-pink-500/30',
    timelineDot: 'bg-pink-500',
    glow: 'shadow-[0_0_30px_-10px_rgba(236,72,153,0.15)]',
    badge: 'bg-pink-500/10 text-pink-300 border-pink-500/20'
  } : {
    border: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500/60',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    timelineLine: 'bg-emerald-500/30',
    timelineDot: 'bg-emerald-500',
    glow: 'shadow-[0_0_30px_-10px_rgba(16,185,129,0.15)]',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative mb-12 last:mb-0 pl-6 group"
    >
      {/* Nó da Timeline (O ponto na linha vertical) */}
      <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-slate-900 ${theme.timelineDot} shadow-[0_0_10px_currentColor] z-10 transition-colors duration-500`}></div>

      {/* Cartão Glassmorphism */}
      <div className={`
        relative p-6 rounded-2xl bg-slate-900/40 backdrop-blur-sm border ${theme.border} ${theme.hoverBorder} 
        transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-slate-900/60 ${theme.glow}
      `}>
        
        {/* Header do Card */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
                    {experience.role}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-slate-400 font-medium">
                    <Building2 size={16} className={theme.iconColor} />
                    <span>{experience.company}</span>
                </div>
            </div>

            {/* Badge de Data */}
            <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold w-fit
                bg-slate-800/80 border border-slate-700
            `}>
                <Calendar size={14} className="text-slate-400" />
                <span className="text-slate-300 uppercase">{startDate} - {endDate}</span>
            </div>
        </div>

        {/* Descrição */}
        <p className="text-slate-400 leading-relaxed text-sm md:text-base border-t border-slate-800/50 pt-4 mt-2">
            {experience.description}
        </p>

        {/* Localização (Se houver) */}
        {experience.location && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-mono">
                <div className={`w-2 h-2 rounded-full ${theme.timelineDot}`}></div>
                {experience.location}
            </div>
        )}

      </div>
    </motion.div>
  );
}
