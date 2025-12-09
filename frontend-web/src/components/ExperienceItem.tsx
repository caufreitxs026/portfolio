'use client';

import { motion } from 'framer-motion';

interface ExperienceProps {
  experience: {
    id: number;
    role: string;
    company: string;
    start_date: string;
    end_date?: string;
    description: string;
    is_current: boolean;
  };
  index: number;
}

export default function ExperienceItem({ experience, index }: ExperienceProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative pl-8 pb-12 last:pb-0 group"
    >
      {/* Linha vertical (brilha ao passar o mouse) */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-slate-800 group-hover:bg-emerald-500/50 transition-colors duration-500 group-last:h-auto group-last:bottom-0"></div>
      
      {/* Bolinha Pulsante */}
      <div className={`absolute -left-[9px] top-1.5 w-5 h-5 rounded-full border-4 border-slate-950 transition-all duration-300 z-10 shadow-xl ${
        experience.is_current 
          ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110' 
          : 'bg-slate-600 group-hover:bg-emerald-400 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.4)]'
      }`}></div>

      {/* Card com Efeito Glassmorphism */}
      <div className="relative p-6 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 group-hover:border-emerald-500/30 group-hover:bg-slate-900/60 transition-all duration-300 hover:translate-x-2 hover:shadow-lg">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              {experience.role}
            </h3>
            <span className="text-emerald-500/90 font-mono text-sm block mt-1">
              {experience.company}
            </span>
          </div>

          {/* Badge de Data */}
          <div className="self-start sm:self-center px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300 whitespace-nowrap">
            {new Date(experience.start_date).getFullYear()} - {experience.is_current ? 'Atual' : new Date(experience.end_date!).getFullYear()}
          </div>
        </div>

        <p className="text-slate-400 leading-relaxed text-sm md:text-base group-hover:text-slate-300 transition-colors">
          {experience.description}
        </p>
      </div>
    </motion.div>
  );
}
