'use client';

import { motion } from 'framer-motion';
import { Code, ExternalLink, Github } from 'lucide-react';

interface ProjectProps {
  project: {
    id: number;
    title: string;
    description: string;
    tech_stack: string[];
    image_url: string;
    repo_link: string;
  };
  index: number;
}

export default function ProjectCard({ project, index }: ProjectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }} // Efeito cascata
      whileHover={{ y: -5 }}
      className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-colors group flex flex-col shadow-lg hover:shadow-emerald-900/10"
    >
      <div className="h-48 bg-slate-800 flex items-center justify-center border-b border-slate-800 relative overflow-hidden">
        {project.image_url && !project.image_url.includes('placehold') ? (
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500 group-hover:scale-105" 
            />
        ) : (
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
              <Code size={48} className="text-emerald-500/30 group-hover:text-emerald-400 transition" />
            </div>
        )}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
           {/* Botões de ação rápida no card */}
           <a href={project.repo_link || '#'} target="_blank" className="p-2 bg-slate-950/80 rounded-full text-white hover:text-emerald-400 hover:bg-slate-900 border border-slate-700">
             <Github size={16} />
           </a>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-1 line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tech_stack && project.tech_stack.map((tech, i) => (
            <span 
              key={i} 
              className="px-2 py-1 text-xs font-mono rounded bg-slate-800 text-emerald-400/80 border border-slate-700/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}