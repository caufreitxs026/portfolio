'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight, Layers, Code2 } from 'lucide-react';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  github_url?: string;
  deploy_url?: string;
  tech_stack: string[]; // Ex: ['React', 'Python']
}

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detecção do Modo Secreto (Mesma lógica do Hero)
  useEffect(() => {
    setMounted(true);
    const checkSecretMode = () => {
      if (typeof document !== 'undefined') {
        setIsSecretMode(document.body.classList.contains('secret-active'));
      }
    };
    const interval = setInterval(checkSecretMode, 500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !projects || projects.length === 0) return null;

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1 === projects.length ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 < 0 ? projects.length - 1 : prev - 1));
  };

  const project = projects[currentIndex];

  // Configuração de Tema (Premium)
  const theme = isSecretMode ? {
    primary: 'text-pink-400',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
    button: 'bg-pink-600 hover:bg-pink-500',
    gradient: 'from-pink-500/10 to-transparent',
    badge: 'bg-pink-500/10 text-pink-300 border-pink-500/20'
  } : {
    primary: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
    button: 'bg-emerald-600 hover:bg-emerald-500',
    gradient: 'from-emerald-500/10 to-transparent',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
  };

  // Variantes de Animação
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)'
    })
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10">
      
      {/* Background Decorativo atrás do Card */}
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} blur-3xl opacity-30 -z-10 rounded-full scale-90`}></div>

      {/* Container Principal */}
      <div className="relative overflow-hidden rounded-2xl min-h-[500px] md:min-h-[450px] bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-2xl ring-1 ring-white/5">
        
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 flex flex-col md:flex-row h-full"
          >
            
            {/* Lado Esquerdo: Imagem / Preview */}
            <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden group border-b md:border-b-0 md:border-r border-slate-800/50 bg-black/40">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <div className={`p-8 rounded-full bg-slate-800/50 border border-slate-700 ${theme.primary}`}>
                        <Code2 size={48} className="opacity-50" />
                    </div>
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                </div>
              )}
              
              {/* Overlay Gradiente na Imagem */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 md:opacity-40"></div>
            </div>

            {/* Lado Direito: Conteúdo */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center relative">
              
              {/* Contador / ID */}
              <div className="absolute top-6 right-6 font-mono text-xs text-slate-600">
                {(currentIndex + 1).toString().padStart(2, '0')} / {projects.length.toString().padStart(2, '0')}
              </div>

              {/* Título com Efeito Gradiente */}
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${isSecretMode ? 'from-pink-300 to-purple-400' : 'from-emerald-300 to-cyan-400'}`}
              >
                {project.title}
              </motion.h3>

              {/* Descrição */}
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 leading-relaxed mb-6 line-clamp-4"
              >
                {project.description || "Projeto desenvolvido com foco em performance e escalabilidade, utilizando as melhores práticas do mercado."}
              </motion.p>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech_stack?.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (i * 0.05) }}
                    className={`
                      px-3 py-1 rounded-md text-xs font-medium border font-mono tracking-wide
                      ${theme.badge}
                    `}
                  >
                    {tech}
                  </motion.span>
                ))}
                {(!project.tech_stack || project.tech_stack.length === 0) && (
                    <span className="text-xs text-slate-600 font-mono italic">Stack não especificada</span>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4 mt-auto">
                {project.deploy_url && (
                  <a
                    href={project.deploy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-transform hover:-translate-y-0.5 ${theme.button}`}
                  >
                    Live Demo <ExternalLink size={16} />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition-colors bg-slate-800/50"
                  >
                    Código <Github size={16} />
                  </a>
                )}
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controles de Navegação (Flutuantes) */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-16 flex items-center justify-center z-10 pointer-events-none">
            <button 
                onClick={prevSlide}
                className={`pointer-events-auto p-2 rounded-full bg-slate-900/50 backdrop-blur-sm border border-slate-700 text-slate-400 hover:text-white transition-all hover:scale-110 -ml-4 md:ml-4 ${theme.border} hover:bg-slate-800`}
                aria-label="Projeto Anterior"
            >
                <ChevronLeft size={24} />
            </button>
        </div>
        <div className="absolute inset-y-0 right-0 w-12 md:w-16 flex items-center justify-center z-10 pointer-events-none">
             <button 
                onClick={nextSlide}
                className={`pointer-events-auto p-2 rounded-full bg-slate-900/50 backdrop-blur-sm border border-slate-700 text-slate-400 hover:text-white transition-all hover:scale-110 -mr-4 md:mr-4 ${theme.border} hover:bg-slate-800`}
                aria-label="Próximo Projeto"
            >
                <ChevronRight size={24} />
            </button>
        </div>

      </div>

      {/* Indicadores de Paginação (Dots) */}
      <div className="flex justify-center gap-2 mt-6">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
            }}
            className={`
                h-1.5 rounded-full transition-all duration-300
                ${idx === currentIndex 
                    ? `w-8 ${isSecretMode ? 'bg-pink-500' : 'bg-emerald-500'}` 
                    : 'w-2 bg-slate-700 hover:bg-slate-600'}
            `}
          />
        ))}
      </div>

    </div>
  );
}
