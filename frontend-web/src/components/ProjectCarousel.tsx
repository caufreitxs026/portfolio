'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight, X, Cpu, Activity, Database, Layout, Code2 } from 'lucide-react';
import Image from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  repo_link?: string; // Atualizado para corresponder ao banco de dados
  deploy_url?: string;
  tech_stack: string[];
}

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  // Bloqueia scroll quando modal está aberto
  useEffect(() => {
    if (selectedId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedId]);

  const nextSlide = useCallback(() => {
    if (selectedId !== null) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1 === projects.length ? 0 : prev + 1));
  }, [selectedId, projects.length]);

  const prevSlide = useCallback(() => {
    if (selectedId !== null) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 < 0 ? projects.length - 1 : prev - 1));
  }, [selectedId, projects.length]);

  // Navegação por Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedId !== null) {
        if (e.key === 'Escape') setSelectedId(null);
      } else {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, nextSlide, prevSlide]);

  if (!mounted || !projects || projects.length === 0) return null;

  const project = projects[currentIndex];

  const theme = isSecretMode ? {
    primary: 'text-pink-400',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
    button: 'bg-pink-600 hover:bg-pink-500',
    gradient: 'from-pink-500/10 to-transparent',
    badge: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    modalBg: 'bg-black/95',
    statValue: 'text-pink-500',
    closeBtn: 'hover:bg-pink-500/20 text-pink-400'
  } : {
    primary: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
    button: 'bg-emerald-600 hover:bg-emerald-500',
    gradient: 'from-emerald-500/10 to-transparent',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    modalBg: 'bg-slate-950/95',
    statValue: 'text-emerald-400',
    closeBtn: 'hover:bg-emerald-500/20 text-emerald-400'
  };

  // Configuração do Swipe (Arrastar)
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  // Variantes do Carrossel
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
      
      {/* Background Decorativo */}
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} blur-3xl opacity-30 -z-10 rounded-full scale-90`}></div>

      {/* --- CARROSSEL PRINCIPAL --- */}
      <div className="relative h-[500px] md:h-[450px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {selectedId === null && (
            <motion.div
              key={project.id}
              layoutId={`card-${project.id}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              // Propriedades de Drag (Swipe)
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  nextSlide();
                } else if (swipe > swipeConfidenceThreshold) {
                  prevSlide();
                }
              }}
              className={`absolute inset-0 flex flex-col md:flex-row overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-2xl ring-1 ring-white/5 cursor-grab active:cursor-grabbing group`}
              onClick={() => setSelectedId(project.id)}
            >
              {/* Lado Esquerdo: Imagem */}
              <motion.div layoutId={`image-${project.id}`} className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden bg-black/40">
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 relative">
                      {isSecretMode && (
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                      )}
                      <div className={`p-8 rounded-full bg-slate-800/50 border border-slate-700 ${theme.primary}`}>
                          <Code2 size={48} className="opacity-50" />
                      </div>
                  </div>
                )}
                {/* Overlay de Clique */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/10">
                        Clique ou Arraste
                    </span>
                </div>
              </motion.div>

              {/* Lado Direito: Conteúdo Resumido */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center relative pointer-events-none">
                <motion.h3 layoutId={`title-${project.id}`} className={`text-3xl font-bold mb-4 text-white`}>
                  {project.title}
                </motion.h3>
                <motion.p layoutId={`desc-${project.id}`} className="text-slate-400 leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </motion.p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech_stack?.slice(0, 3).map((tech) => (
                    <span key={tech} className={`px-3 py-1 rounded-md text-xs font-medium border font-mono tracking-wide ${theme.badge}`}>
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack?.length > 3 && (
                      <span className="text-xs text-slate-500 self-center">+{project.tech_stack.length - 3}</span>
                  )}
                </div>
                <div className="mt-auto flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Cpu size={14} />
                    <span>SYSTEM READY // SWIPE NAV ENABLED</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controles de Navegação (Só aparecem se não houver modal aberto) */}
        {selectedId === null && (
            <>
                <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className={`absolute left-0 top-1/2 -translate-y-1/2 p-3 -ml-5 md:-ml-8 rounded-full bg-slate-900/50 border border-slate-700 text-slate-400 hover:text-white transition-all hover:scale-110 z-10 ${theme.border}`}>
                    <ChevronLeft size={24} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className={`absolute right-0 top-1/2 -translate-y-1/2 p-3 -mr-5 md:-mr-8 rounded-full bg-slate-900/50 border border-slate-700 text-slate-400 hover:text-white transition-all hover:scale-110 z-10 ${theme.border}`}>
                    <ChevronRight size={24} />
                </button>
            </>
        )}
      </div>

      {/* --- MODAL EXPANDIDO --- */}
      <AnimatePresence>
        {selectedId !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Cartão Expandido */}
            <motion.div
              layoutId={`card-${selectedId}`}
              className={`relative w-full max-w-4xl h-[85vh] md:h-[700px] overflow-y-auto custom-scrollbar rounded-2xl border ${theme.border} ${theme.modalBg} shadow-2xl flex flex-col md:flex-row overflow-hidden`}
            >
              <button
                onClick={() => setSelectedId(null)}
                className={`absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur border border-white/10 transition-colors ${theme.closeBtn}`}
              >
                <X size={20} />
              </button>

              {/* Coluna Esquerda: Visual & Stats */}
              <div className="w-full md:w-5/12 bg-slate-900/50 border-r border-slate-800 flex flex-col relative overflow-hidden">
                 <motion.div layoutId={`image-${selectedId}`} className="relative h-64 md:h-1/2 w-full overflow-hidden">
                    {projects.find(p => p.id === selectedId)?.image_url ? (
                        <Image
                            src={projects.find(p => p.id === selectedId)!.image_url!}
                            alt="Project Cover"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <Code2 size={64} className="text-slate-700" />
                        </div>
                    )}
                    {/* Efeito CRT no Modo Secreto */}
                    {isSecretMode && <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-50"></div>}
                    
                    {/* Shimmer Effect (Brilho que passa) */}
                    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_2s_infinite]"></div>
                    </div>
                 </motion.div>

                 {/* Painel de Métricas */}
                 <div className="p-6 flex-1 flex flex-col justify-center space-y-6">
                    <h4 className="text-xs font-mono uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-2">Project Metrics</h4>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-800"><Activity size={18} className="text-blue-400" /></div>
                            <span className="text-sm font-medium text-slate-300">Performance</span>
                        </div>
                        <span className={`text-lg font-bold font-mono ${theme.statValue}`}>98%</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-800"><Database size={18} className="text-purple-400" /></div>
                            <span className="text-sm font-medium text-slate-300">Database</span>
                        </div>
                        <span className={`text-lg font-bold font-mono ${theme.statValue}`}>Optimized</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-800"><Layout size={18} className="text-orange-400" /></div>
                            <span className="text-sm font-medium text-slate-300">Responsive</span>
                        </div>
                        <span className={`text-lg font-bold font-mono ${theme.statValue}`}>Mobile-1st</span>
                    </div>
                 </div>
              </div>

              {/* Coluna Direita: Detalhes */}
              <div className="w-full md:w-7/12 p-8 overflow-y-auto custom-scrollbar">
                 <motion.h2 layoutId={`title-${selectedId}`} className={`text-3xl md:text-4xl font-bold mb-6 text-white`}>
                    {projects.find(p => p.id === selectedId)?.title}
                 </motion.h2>

                 <div className="mb-8">
                    <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 ${theme.primary}`}>Visão Geral</h4>
                    <motion.p layoutId={`desc-${selectedId}`} className="text-slate-300 leading-relaxed text-lg">
                        {projects.find(p => p.id === selectedId)?.description}
                    </motion.p>
                 </div>

                 <div className="mb-8">
                    <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 ${theme.primary}`}>Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                        {projects.find(p => p.id === selectedId)?.tech_stack.map((tech) => (
                            <span key={tech} className={`px-4 py-2 rounded-lg text-sm font-medium border font-mono ${theme.badge}`}>
                                {tech}
                            </span>
                        ))}
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-800">
                    {projects.find(p => p.id === selectedId)?.deploy_url && (
                        <a
                            href={projects.find(p => p.id === selectedId)?.deploy_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-transform hover:-translate-y-1 ${theme.button}`}
                        >
                            <ExternalLink size={18} />
                            Ver Projeto Online
                        </a>
                    )}
                    {projects.find(p => p.id === selectedId)?.repo_link && (
                        <a
                            href={projects.find(p => p.id === selectedId)?.repo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition-colors bg-slate-800/50"
                        >
                            <Github size={18} />
                            Código Fonte
                        </a>
                    )}
                 </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Indicadores de Paginação */}
      <div className="flex justify-center gap-2 mt-6">
        {projects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
                if (selectedId === null) {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                }
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
