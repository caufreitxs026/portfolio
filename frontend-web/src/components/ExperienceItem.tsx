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
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 pb-12 last:pb-0 group"
    >
      {/* Linha vertical personalizada */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-slate-800 group-last:h-auto group-last:bottom-0"></div>
      
      {/* Bolinha do timeline */}
      <div className={`absolute -left-[9px] top-1.5 w-5 h-5 rounded-full border-4 border-slate-900 transition-colors duration-300 z-10 ${
        experience.is_current ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-600 group-hover:bg-slate-400'
      }`}></div>

      <div className="relative">
        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
          {experience.role}
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 text-sm font-mono text-emerald-500/80 mb-3">
          <span>{experience.company}</span>
          <span>•</span>
          <span>
            {new Date(experience.start_date).getFullYear()} - {experience.is_current ? 'Atual' : new Date(experience.end_date!).getFullYear()}
          </span>
        </div>
        <p className="text-slate-400 max-w-2xl leading-relaxed text-sm md:text-base">
          {experience.description}
        </p>
      </div>
    </motion.div>
  );
}