'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight, X, Cpu, Terminal } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import VideoEmbed from '@/components/VideoEmbed';

interface Project {
  id: string;
  title: string;
  description: string;
  media_url?: string;
  video_url?: string;
  media_type?: 'image' | 'video';
  repo_link?: string;
  deploy_url?: string;
  tech_stack: string[];
}

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const styles = theme === 'dark' ? {
    primary: isSecretMode ? 'text-pink-400' : 'text-indigo-400',
    bgPrimary: isSecretMode ? 'bg-pink-500' : 'bg-indigo-500',
    border: isSecretMode ? 'border-pink-500/30' : 'border-indigo-500/30',
    buttonPrimary: isSecretMode ? 'bg-pink-600 hover:bg-pink-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white',
    buttonSecondary: 'text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white bg-slate-800/50',
    gradient: isSecretMode ? 'from-pink-500/10 to-transparent' : 'from-indigo-500/10 to-transparent',
    badge: isSecretMode ? 'bg-pink-500/10 text-pink-300 border-pink-500/20' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    modalBg: 'bg-slate-900',
    modalBorder: 'border-slate-800',
    cardBg: 'bg-slate-900/90 border-slate-800',
    textTitle: 'text-white',
    textDesc: 'text-slate-300',
    closeBtn: isSecretMode ? 'hover:bg-pink-500/20 text-pink-400' : 'hover:bg-indigo-500/20 text-indigo-400',
    scanColor: isSecretMode ? 'via-pink-500/20' : 'via-indigo-500/20',
    navBtn: 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-white',
    techFallbackBg: 'bg-slate-950',
    footerBg: 'bg-slate-900 border-slate-800',
    fadeGradient: 'from-slate-900',
  } : {
    primary: 'text-indigo-600',
    bgPrimary: 'bg-indigo-500',
    border: 'border-slate-200',
    buttonPrimary: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md',
    buttonSecondary: 'text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50 bg-white',
    gradient: 'from-indigo-500/5 to-transparent',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    modalBg: 'bg-white',
    modalBorder: 'border-slate-200',
    cardBg: 'bg-white/95 border-slate-200 shadow-xl',
    textTitle: 'text-slate-900',
    textDesc: 'text-slate-600',
    closeBtn: 'hover:bg-slate-100 text-slate-500',
    scanColor: 'via-indigo-500/10',
    navBtn: 'bg-white/90 border-slate-200 text-slate-500 hover:text-indigo-600 shadow-sm',
    techFallbackBg: 'bg-slate-50',
    footerBg: 'bg-white border-slate-100',
    fadeGradient: 'from-white',
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 30 : -30, opacity: 0 })
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10">
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.gradient} opacity-30 -z-10 rounded-full scale-90`}></div>

      {/* --- CARROSSEL PRINCIPAL --- */}
      <div className="relative h-auto min-h-[550px] md:h-[450px]">
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
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              className={`absolute inset-0 flex flex-col md:flex-row overflow-hidden rounded-2xl border shadow-xl cursor-grab active:cursor-grabbing group ${styles.cardBg}`}
              onClick={() => setSelectedId(project.id)}
            >
              {/* Mídia */}
              <motion.div layoutId={`media-${project.id}`} className="w-full md:w-1/2 h-56 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r">
                {project.media_url && project.media_type !== 'video' ? (
                  <img src={project.media_url} alt={project.title} className="w-full h-full object-cover pointer-events-none" />
                ) : project.video_url ? (
                  <div className="w-full h-full flex items-center justify-center bg-black pointer-events-none">
                    <VideoEmbed url={project.video_url} title={project.title} thumbnailUrl={project.media_url} />
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center"><Terminal className={styles.primary} /></div>
                )}
              </motion.div>

              {/* Conteúdo */}
              <div className="w-full md:w-1/2 flex flex-col p-5 md:p-10 pointer-events-none">
                <motion.h3 layoutId={`title-${project.id}`} className={`text-xl md:text-3xl font-bold mb-3 ${styles.textTitle}`}>
                  {project.title}
                </motion.h3>
                <motion.p layoutId={`desc-${project.id}`} className={`leading-relaxed mb-4 text-sm md:text-base line-clamp-4 md:line-clamp-3 ${styles.textDesc}`}>
                  {project.description}
                </motion.p>
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech_stack?.slice(0, 3).map((tech) => (
                    <span key={tech} className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-mono border ${styles.badge}`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- MODAL EXPANDIDO --- */}
      <AnimatePresence>
        {selectedId !== null && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-slate-950/95"
            />

            <motion.div
              layoutId={`card-${selectedId}`}
              className={`relative w-full max-w-[1400px] h-[92vh] md:h-[85vh] flex flex-col md:flex-row rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl border-t md:border ${styles.modalBg} ${styles.modalBorder}`}
            >
              <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 border border-white/10 text-white"><X size={24} /></button>

              {/* Mídia Modal */}
              <motion.div layoutId={`media-${selectedId}`} className="w-full md:w-[60%] h-[35vh] md:h-full bg-black relative shrink-0">
                {projects.find(p => p.id === selectedId)?.video_url ? (
                  <VideoEmbed url={projects.find(p => p.id === selectedId)!.video_url!} title="Project Video" thumbnailUrl={projects.find(p => p.id === selectedId)?.media_url} />
                ) : (
                  <img src={projects.find(p => p.id === selectedId)?.media_url || ''} className="w-full h-full object-cover" />
                )}
              </motion.div>

              {/* Info Modal */}
              <div className="w-full md:w-[40%] flex flex-col p-6 md:p-10 overflow-y-auto">
                <motion.h2 layoutId={`title-${selectedId}`} className={`text-2xl md:text-4xl font-extrabold mb-6 ${styles.textTitle}`}>{projects.find(p => p.id === selectedId)?.title}</motion.h2>
                <motion.p layoutId={`desc-${selectedId}`} className={`leading-relaxed text-sm md:text-lg ${styles.textDesc}`}>{projects.find(p => p.id === selectedId)?.description}</motion.p>

                {/* Botões de Ação */}
                <div className="mt-auto pt-10 flex gap-4">
                  <a href={projects.find(p => p.id === selectedId)?.deploy_url} className={`flex-1 text-center py-4 rounded-xl font-bold ${styles.buttonPrimary}`}>Ver Online</a>
                  <a href={projects.find(p => p.id === selectedId)?.repo_link} className={`flex-1 text-center py-4 rounded-xl font-bold border ${styles.buttonSecondary}`}>GitHub</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}