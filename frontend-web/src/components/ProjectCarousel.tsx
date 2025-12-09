'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard3D from './ProjectCard3D'; // Importa o novo card

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string;
  repo_link: string;
}

interface ProjectCarouselProps {
  projects: Project[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!projects || projects.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full max-w-lg mx-auto py-10 perspective-1000"> {/* Max-w ajustado para focar no card 3D */}
      
      <div className="relative min-h-[450px] flex items-center justify-center">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="w-full h-[450px]" // Altura fixa para o efeito 3D
          >
            <ProjectCard3D project={projects[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {projects.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 md:-left-16 -translate-y-1/2 p-3 bg-slate-800/80 hover:bg-emerald-600 text-white rounded-full transition shadow-lg border border-slate-700 z-10 hover:scale-110 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 md:-right-16 -translate-y-1/2 p-3 bg-slate-800/80 hover:bg-emerald-600 text-white rounded-full transition shadow-lg border border-slate-700 z-10 hover:scale-110 cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex justify-center gap-3 mt-8">
            {projects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-emerald-400 w-8' : 'bg-slate-700 w-2 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
