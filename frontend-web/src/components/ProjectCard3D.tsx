'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Code } from 'lucide-react';

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
        <div className="h-full flex flex-col justify-between">
            {/* Área da Imagem */}
            <div className="relative h-40 w-full overflow-hidden rounded-lg mb-4 border border-slate-700/50 group-image">
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
                
                {/* Botão GitHub - AGORA SEMPRE VISÍVEL E NO TOPO */}
                {project.repo_link && (
                    <div 
                        style={{ transform: "translateZ(100px)" }} 
                        className="absolute top-2 right-2 z-20"
                    >
                        <a 
                            href={project.repo_link} 
                            target="_blank"
                            className="flex items-center justify-center p-2 bg-slate-950/80 text-white rounded-full border border-slate-700 hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 transition-all shadow-lg backdrop-blur-sm cursor-pointer"
                            title="Ver Código no GitHub"
                            // Adicionamos stopPropagation para garantir que o clique no link funcione mesmo com o card mexendo
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Github size={18} />
                        </a>
                    </div>
                )}
            </div>

            {/* Título e Descrição */}
            <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {project.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                    {project.description}
                </p>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mt-auto content-start max-h-[80px] overflow-y-auto pr-1 scrollbar-hide">
                {project.tech_stack?.map((tech, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700 hover:bg-emerald-900/30 transition-colors">
                        {tech}
                    </span>
                ))}
            </div>
        </div>
      </div>
      
      <div className="absolute inset-0 z-[-1] rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 opacity-50" />
    </motion.div>
  );
}
