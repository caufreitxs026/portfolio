'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, ExternalLink, Github } from 'lucide-react';
import VideoEmbed from './VideoEmbed';

export default function ProjectCarousel({ projects }: { projects: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const project = projects[currentIndex];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {selectedId === null && (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col md:flex-row bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl min-h-[500px] cursor-pointer"
            onClick={() => setSelectedId(project.id)}
          >
            {/* Área da Mídia - Otimizada para não quebrar layout */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-black shrink-0">
              {project.video_url ? (
                <VideoEmbed
                  url={project.video_url}
                  title={project.title}
                  thumbnailUrl={project.media_url}
                />
              ) : (
                <img src={project.media_url} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Conteúdo - Flexível para o texto não cortar */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{project.title}</h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech_stack?.map((tech: string) => (
                  <span key={tech} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md text-xs font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Otimizado para Performance Mobile (Sem Blur pesado) */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95" onClick={() => setSelectedId(null)}
            />
            <motion.div
              layoutId={`card-${selectedId}`}
              className="relative w-full max-w-6xl h-[95vh] md:h-auto md:max-h-[85vh] bg-slate-900 border-t md:border border-slate-800 rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row"
            >
              <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 z-[110] p-2 bg-black/50 rounded-full text-white"><X /></button>

              <div className="w-full md:w-[60%] h-[40vh] md:h-full bg-black">
                <VideoEmbed
                  url={projects.find(p => p.id === selectedId)?.video_url}
                  title="Demo"
                  thumbnailUrl={projects.find(p => p.id === selectedId)?.media_url}
                />
              </div>

              <div className="w-full md:w-[40%] p-6 md:p-10 overflow-y-auto">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
                  {projects.find(p => p.id === selectedId)?.title}
                </h2>
                <p className="text-slate-300 leading-relaxed text-base md:text-lg mb-8">
                  {projects.find(p => p.id === selectedId)?.description}
                </p>
                {/* Botões fixos no rodapé do modal mobile */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <a href={projects.find(p => p.id === selectedId)?.deploy_url} className="flex-1 py-4 bg-indigo-600 text-white text-center rounded-xl font-bold">Acessar</a>
                  <a href={projects.find(p => p.id === selectedId)?.repo_link} className="flex-1 py-4 border border-slate-700 text-white text-center rounded-xl font-bold">GitHub</a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}