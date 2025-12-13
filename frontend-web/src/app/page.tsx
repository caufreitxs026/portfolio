'use client';

import { useState, useEffect } from 'react';
import { Code, Server, Gamepad2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Componentes
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExperienceItem from '@/components/ExperienceItem';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ProjectCarousel from '@/components/ProjectCarousel';
import TechWordle from '@/components/TechWordle';
import { ProjectSkeleton, ExperienceSkeleton } from '@/components/Skeletons';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function Home() {
  const { projects, experiences, loading } = usePortfolioData();
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkSecretMode = () => {
      if (typeof document !== 'undefined') {
        setIsSecretMode(document.body.classList.contains('secret-active'));
      }
    };
    // Intervalo curto para reagir rápido à mudança de classe no body
    const interval = setInterval(checkSecretMode, 500);
    return () => clearInterval(interval);
  }, []);

  // Evita hidratação incorreta
  if (!mounted) return null;

  return (
    <main className="min-h-screen text-slate-300 selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      <Navbar />
      <Hero />

      {/* --- BOTÕES FLUTUANTES (Z-INDEX ALTO) --- */}
      
      {/* Botão do Jogo (GameHub) - Fica ACIMA do botão de scroll (bottom-24) */}
      <AnimatePresence>
        {!isGameOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsGameOpen(true)}
            className={`
              fixed bottom-24 right-8 p-3 w-12 h-12 flex items-center justify-center rounded-full shadow-2xl z-[100] transition-all duration-300 border backdrop-blur-md group
              ${isSecretMode 
                ? 'bg-black/80 border-pink-500 text-pink-500 hover:bg-pink-600 hover:text-white shadow-pink-500/40 ring-1 ring-pink-500/30' 
                : 'bg-slate-800/90 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white shadow-emerald-500/40 ring-1 ring-emerald-500/30'}
            `}
            title={isSecretMode ? "SYSTEM HACK" : "Jogar Code Breaker"}
          >
            <Gamepad2 size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal do Jogo */}
      <AnimatePresence>
        {isGameOpen && <TechWordle onClose={() => setIsGameOpen(false)} />}
      </AnimatePresence>

      <section id="projetos" className="py-20 bg-slate-800/50 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
             <Code className="text-emerald-400"/> Projetos em Destaque
          </h2>
          <p className="text-slate-400 mb-12">Casos reais onde apliquei tecnologia para gerar valor.</p>
          {loading ? (
             <div className="max-w-4xl mx-auto"><ProjectSkeleton /></div>
          ) : projects && projects.length > 0 ? (
            <ProjectCarousel projects={projects} />
          ) : (
            <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
              <p>Carregando dados do servidor...</p>
            </div>
          )}
        </div>
      </section>

      <section id="experiencia" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
             <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <Server className="text-emerald-400"/> Experiência Profissional
             </h2>
          </div>
          <div className="ml-3 pl-8 relative">
             <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-slate-800/50"></div>
            {loading ? (
              <div className="space-y-12"><ExperienceSkeleton /><ExperienceSkeleton /></div>
            ) : (
              (experiences || []).map((exp: any, index: number) => (
                <ExperienceItem key={exp.id} experience={exp} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      <section id="contato" className="py-20 bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Vamos Conversar?</h2>
          <p className="text-slate-400 mb-12">Estou disponível para novos desafios. Envie uma mensagem.</p>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
