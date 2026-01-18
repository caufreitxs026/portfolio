'use client';

import { motion } from 'framer-motion';
import { Calendar, Building2, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
// CORREÇÃO: Importando diretamente de ./SpotlightCard (sem /ui)
import SpotlightCard from './SpotlightCard';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();

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
    if (!dateString) return 'Momento Atual';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  const startDate = formatDate(experience.start_date);
  const endDate = experience.end_date ? formatDate(experience.end_date) : 'Momento Atual';
  const isCurrentRole = !experience.end_date;

  const styles = theme === 'dark' ? {
    iconColor: isSecretMode ? 'text-pink-400' : 'text-emerald-400',
    iconBg: isSecretMode ? 'bg-pink-500/10 border-pink-500/20' : 'bg-emerald-500/10 border-emerald-500/20',
    timelineDot: isSecretMode ? 'bg-pink-500' : 'bg-emerald-500',
    timelineGlow: isSecretMode ? 'shadow-[0_0_15px_rgba(236,72,153,0.6)]' : 'shadow-[0_0_15px_rgba(16,185,129,0.6)]',
    dateBadge: isSecretMode ? 'bg-pink-500/10 text-pink-300 border-pink-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    textMain: 'text-white',
    textSub: 'text-slate-300',
    textDesc: 'text-slate-400',
    border: 'border-slate-950',
    inactiveBadge: 'bg-slate-800/50 border-slate-700 text-slate-400'
  } : {
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 border-indigo-100',
    timelineDot: 'bg-indigo-500',
    timelineGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.4)]',
    dateBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    textMain: 'text-slate-900',
    textSub: 'text-slate-600',
    textDesc: 'text-slate-600',
    border: 'border-slate-100',
    inactiveBadge: 'bg-slate-100 border-slate-200 text-slate-500'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative mb-10 sm:mb-12 last:mb-0 pl-4 sm:pl-6 group"
    >
      <div className={`
        absolute -left-[39px] sm:-left-[41px] top-1 sm:top-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[3px] sm:border-4 ${styles.border} 
        ${styles.timelineDot} ${isCurrentRole ? `animate-pulse ${styles.timelineGlow}` : 'shadow-sm'} 
        z-10 transition-colors duration-500
      `}></div>

      <SpotlightCard isSecretMode={isSecretMode} className="p-5 sm:p-6 transition-transform duration-300 group-hover:-translate-y-1">
        
        <div className="flex flex-col gap-3 sm:gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div>
                    <h3 className={`text-lg sm:text-xl font-bold leading-tight ${styles.textMain}`}>
                        {experience.role}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <div className={`p-1.5 rounded-md border ${styles.iconBg} ${styles.iconColor}`}>
                            <Building2 size={14} />
                        </div>
                        <span className={`text-sm sm:text-base font-medium ${styles.textSub}`}>
                            {experience.company}
                        </span>
                    </div>
                </div>

                <div className={`
                    self-start flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold border whitespace-nowrap mt-1 sm:mt-0
                    ${isCurrentRole ? styles.dateBadge : styles.inactiveBadge}
                `}>
                    <Calendar size={12} />
                    <span className="uppercase tracking-wide">{startDate} — {endDate}</span>
                </div>
            </div>
        </div>

        <div className="relative">
            <p className={`${styles.textDesc} leading-relaxed text-sm sm:text-base border-t pt-4 mt-2 ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-100'}`}>
                {experience.description}
            </p>
        </div>

        {experience.location && (
            <div className={`mt-4 pt-3 flex items-center gap-2 text-xs font-mono border-t border-dashed ${theme === 'dark' ? 'text-slate-500 border-slate-800/30' : 'text-slate-400 border-slate-200'}`}>
                <MapPin size={12} className={styles.iconColor} />
                <span>{experience.location}</span>
            </div>
        )}

      </SpotlightCard>
    </motion.div>
  );
}
