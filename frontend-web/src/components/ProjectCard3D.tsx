'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, Code } from 'lucide-react';

interface ProjectProps {
  project: {
    id: number;
    title: string;
    description: string;
    tech_stack: string[];
    image_url: string;
    repo_link: string;
  };
}

export default function ProjectCard3D({ project }: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full w-full rounded-xl bg-slate-900 border border-slate-800 transition-all duration-200 ease-out hover:shadow-2xl hover:shadow-emerald-500/20 group perspective-1000"
    >
      <div 
        style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }} 
        className="absolute inset-4 grid place-content-center rounded-xl shadow-lg"
      >
        {/* Conteúdo do Card Flutuando */}
        <div className="h-full flex flex-col justify-between">
            <div className="relative h-40 w-full overflow-hidden rounded-lg mb-4 border border-slate-700/50">
                {project.image_url ? (
                    <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Code className="text-slate-600" size={40} />
                    </div>
                )}
                {/* Overlay com Botão */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                    {project.repo_link && (
                        <a 
                            href={project.repo_link} 
                            target="_blank"
                            className="p-3 bg-white text-slate-950 rounded-full hover:scale-110 transition-transform"
                            title="Ver Código"
                        >
                            <Github size={20} />
                        </a>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {project.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                    {project.description}
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech_stack?.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-emerald-400/80 border border-slate-700">
                        {tech}
                    </span>
                ))}
            </div>
        </div>
      </div>
      
      {/* Fundo do Card (Base) */}
      <div className="absolute inset-0 z-[-1] rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 opacity-50" />
    </motion.div>
  );
}
