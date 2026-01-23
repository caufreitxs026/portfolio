'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight, X, Cpu, Activity, Database, Layout, Code2, Terminal, Layers } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  repo_link?: string;
  deploy_url?: string;
  tech_stack: string[];
}

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const { theme } = useTheme();

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

  // Configuração de Estilos por Tema (Dark/Light/Secret)
  const styles = theme === 'dark' ? {
    primary: isSecretMode ? 'text-pink-400' : 'text-emerald-400',
    bgPrimary: isSecretMode ? 'bg-pink-500' : 'bg-emerald-500',
    border: isSecretMode ? 'border-pink-500/30' : 'border-emerald-500/30',
    glow: isSecretMode ? 'shadow-pink-500/20' : 'shadow-emerald-500/20',
    buttonPrimary: isSecretMode ? 'bg-pink-600 hover:bg-pink-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white',
    buttonSecondary: 'text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white bg-slate-800/50',
    gradient: isSecretMode ? 'from-pink-500/10 to-transparent' : 'from-emerald-500/10 to-transparent',
    badge: isSecretMode ? 'bg-pink-500/10 text-pink-300 border-pink-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    modalBg: 'bg-slate-950/95',
    cardBg: 'bg-slate-900/60 border-slate-800',
    textTitle: 'text-white',
    textDesc: 'text-slate-400',
    statValue: isSecretMode ? 'text-pink-500' : 'text-emerald-400',
    closeBtn: isSecretMode ? 'hover:bg-pink-500/20 text-pink-400' : 'hover:bg-emerald-500/20 text-emerald-400',
    scanColor: isSecretMode ? 'via-pink-500/20' : 'via-emerald-500/20',
    navBtn: 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-white',
    techFallbackBg: 'bg-slate-950',
    leftColBg: 'bg-slate-900/50 border-slate-800',
    metricsBg: 'bg-slate-900/30',
    metricIconBg: 'bg-slate-800',
  } : {
    // TEMA LIGHT (Clean Tech)
    primary: 'text-indigo-600',
    bgPrimary: 'bg-indigo-500',
    border: 'border-slate-200',
    glow: 'shadow-indigo-500/20',
    buttonPrimary: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-200',
    buttonSecondary: 'text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 bg-white',
    gradient: 'from-indigo-500/5 to-transparent',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    modalBg: 'bg-white/95',
    cardBg: 'bg-white/80 border-slate-200 shadow-xl',
    textTitle: 'text-slate-900',
    textDesc: 'text-slate-600',
    statValue: 'text-indigo-600',
    closeBtn: 'hover:bg-slate-100 text-slate-500',
    scanColor: 'via-indigo-500/10',
    navBtn: 'bg-white/80 border-slate-200 text-slate-500 hover:text-indigo-600 shadow-sm',
    techFallbackBg: 'bg-slate-50',
    leftColBg: 'bg-slate-50 border-slate-100',
    metricsBg: 'bg-white/50',
    metricIconBg: 'bg-white border border-slate-100',
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

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

  // Componente de Fallback Visual (Digital Blueprint)
  const TechFallback = () => (
    <div className={`w-full h-full relative overflow-hidden flex items-center justify-center group/tech ${styles.techFallbackBg}`}>
        {/* Grid Animado */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Scanner Laser Vertical */}
        <motion.div 
            className={`absolute inset-x-0 h-12 bg-gradient-to-b from-transparent ${styles.scanColor} to-transparent opacity-30`}
            animate={{ top: ['-20%', '120%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Núcleo Central */}
        <div className={`relative z-10 p-4 sm:p-8 rounded-2xl border backdrop-blur-xl shadow-lg flex flex-col items-center gap-4 sm:gap-6 transform transition-transform duration-500 group-hover/tech:scale-105 ${styles.cardBg}`}>
            {/* Ícone Brilhante */}
            <div className={`relative p-3 sm:p-5 rounded-full border shadow-lg ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-100'} ${styles.primary}`}>
                <div className={`absolute inset-0 rounded-full ${styles.bgPrimary} opacity-20 blur-md animate-pulse`}></div>
                <Terminal className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            {/* Dados Simulados */}
            <div className="space-y-2 sm:space-y-3 w-32 sm:w-40">
                <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    <span>Compiling</span>
                    <span>98%</span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <motion.div 
                        className={`h-full ${styles.bgPrimary}`} 
                        animate={{ width: ['0%', '100%'] }} 
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                    />
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10">
      
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.gradient} blur-3xl opacity-30 -z-10 rounded-full scale-90`}></div>

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
              className={`absolute inset-0 flex flex-col md:flex-row overflow-hidden rounded-2xl backdrop-blur-xl border shadow-2xl ring-1 ring-white/5 cursor-grab active:cursor-grabbing group ${styles.cardBg}`}
              onClick={() => setSelectedId(project.id)}
            >
              {/* Lado Esquerdo: Imagem ou Tech Fallback */}
              <motion.div layoutId={`image-${project.id}`} className={`w-full md:w-1/2 h-64 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r ${theme === 'dark' ? 'bg-black/40 border-slate-800/50' : 'bg-slate-50 border-slate-200'}`}>
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  />
                ) : (
                  <TechFallback />
                )}
                
                {/* Overlay de Clique */}
                {project.image_url && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/10">
                            Detalhes
                        </span>
                    </div>
                )}
              </motion.div>

              {/* Lado Direito: Conteúdo Resumido */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center relative pointer-events-none">
                <motion.h3 layoutId={`title-${project.id}`} className={`text-2xl sm:text-3xl font-bold mb-4 ${styles.textTitle}`}>
                  {project.title}
                </motion.h3>
                <motion.p layoutId={`desc-${project.id}`} className={`leading-relaxed mb-6 line-clamp-3 text-sm sm:text-base ${styles.textDesc}`}>
                  {project.description}
                </motion.p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech_stack?.slice(0, 3).map((tech) => (
                    <span key={tech} className={`px-3 py-1 rounded-md text-xs font-medium border font-mono tracking-wide ${styles.badge}`}>
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack?.length > 3 && (
                      <span className="text-xs text-slate-500 self-center">+{project.tech_stack.length - 3}</span>
                  )}
                </div>
                <div className="mt-auto flex items-center gap-2 text-[10px] sm:text-xs font-mono text-slate-500">
                    <Cpu size={14} />
                    <span>SYSTEM READY // SWIPE NAV ENABLED</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controles de Navegação */}
        {selectedId === null && (
            <>
                <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 sm:p-3 -ml-3 sm:-ml-8 rounded-full transition-all hover:scale-110 z-10 ${styles.navBtn}`}>
                    <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 sm:p-3 -mr-3 sm:-mr-8 rounded-full transition-all hover:scale-110 z-10 ${styles.navBtn}`}>
                    <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                </button>
            </>
        )}
      </div>

      {/* --- MODAL EXPANDIDO --- */}
      <AnimatePresence>
        {selectedId !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              layoutId={`card-${selectedId}`}
              className={`relative w-full max-w-4xl h-[85vh] md:h-[700px] overflow-y-auto custom-scrollbar rounded-2xl border shadow-2xl flex flex-col md:flex-row overflow-hidden ${styles.modalBg} ${styles.border}`}
            >
              <button
                onClick={() => setSelectedId(null)}
                className={`absolute top-4 right-4 z-50 p-2 rounded-full backdrop-blur border border-white/10 transition-colors bg-white/10 ${styles.closeBtn}`}
              >
                <X size={20} />
              </button>

              {/* Coluna Esquerda: Visual & Stats */}
              <div className={`w-full md:w-5/12 flex flex-col relative overflow-hidden shrink-0 border-r ${styles.leftColBg} ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                 <motion.div layoutId={`image-${selectedId}`} className="relative h-48 sm:h-64 md:h-1/2 w-full overflow-hidden">
                    {projects.find(p => p.id === selectedId)?.image_url ? (
                        <Image
                            src={projects.find(p => p.id === selectedId)!.image_url!}
                            alt="Project Cover"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <TechFallback />
                    )}
                    
                    {isSecretMode && <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-50"></div>}
                 </motion.div>

                 {/* Painel de Métricas */}
                 <div className={`p-4 sm:p-6 flex-1 flex flex-col justify-center space-y-4 sm:space-y-6 ${styles.metricsBg}`}>
                    <h4 className={`text-xs font-mono uppercase tracking-widest border-b pb-2 ${theme === 'dark' ? 'text-slate-500 border-slate-800' : 'text-slate-400 border-slate-200'}`}>Project Metrics</h4>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${styles.metricIconBg}`}><Activity size={16} className="text-blue-500" /></div>
                            <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Performance</span>
                        </div>
                        <span className={`text-sm sm:text-lg font-bold font-mono ${styles.statValue}`}>98%</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${styles.metricIconBg}`}><Database size={16} className="text-purple-500" /></div>
                            <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Database</span>
                        </div>
                        <span className={`text-sm sm:text-lg font-bold font-mono ${styles.statValue}`}>Optimized</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${styles.metricIconBg}`}><Layout size={16} className="text-orange-500" /></div>
                            <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Responsive</span>
                        </div>
                        <span className={`text-sm sm:text-lg font-bold font-mono ${styles.statValue}`}>Mobile-1st</span>
                    </div>
                 </div>
              </div>

              {/* Coluna Direita: Detalhes */}
              <div className="w-full md:w-7/12 p-5 sm:p-8 overflow-y-auto custom-scrollbar">
                 <motion.h2 layoutId={`title-${selectedId}`} className={`text-2xl md:text-4xl font-bold mb-4 sm:mb-6 ${styles.textTitle}`}>
                    {projects.find(p => p.id === selectedId)?.title}
                 </motion.h2>

                 <div className="mb-6 sm:mb-8">
                    <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 sm:mb-3 ${styles.primary}`}>Visão Geral</h4>
                    <motion.p layoutId={`desc-${selectedId}`} className={`leading-relaxed text-sm sm:text-lg ${styles.textDesc}`}>
                        {projects.find(p => p.id === selectedId)?.description}
                    </motion.p>
                 </div>

                 <div className="mb-6 sm:mb-8">
                    <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 sm:mb-3 ${styles.primary}`}>Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                        {projects.find(p => p.id === selectedId)?.tech_stack.map((tech) => (
                            <span key={tech} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border font-mono ${styles.badge}`}>
                                {tech}
                            </span>
                        ))}
                    </div>
                 </div>

                 <div className={`flex flex-col gap-3 mt-6 pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                    {projects.find(p => p.id === selectedId)?.deploy_url && (
                        <a
                            href={projects.find(p => p.id === selectedId)?.deploy_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1 text-sm sm:text-base ${styles.buttonPrimary}`}
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
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors text-sm sm:text-base ${styles.buttonSecondary}`}
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
                    ? `w-8 ${isSecretMode ? 'bg-pink-500' : (theme === 'dark' ? 'bg-emerald-500' : 'bg-indigo-500')}` 
                    : `w-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}
            `}
          />
        ))}
      </div>

    </div>
  );
}
