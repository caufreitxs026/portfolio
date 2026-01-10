'use client';

import { useState, useEffect } from 'react';
import { Code, Server, Gamepad2, ChevronDown, ChevronUp, History } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Componentes
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExperienceItem from '@/components/ExperienceItem';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ProjectCarousel from '@/components/ProjectCarousel';
import TechWordle from '@/components/TechWordle';
import CompetenceSection from '@/components/CompetenceSection';
import { ProjectSkeleton, ExperienceSkeleton } from '@/components/Skeletons';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { projects, experiences, skills, certificates, loading } = usePortfolioData();
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Estado para controlar a expansão da experiência
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const INITIAL_EXP_COUNT = 3;
  
  // Hook de Tradução
  const { t } = useLanguage();

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

  if (!mounted) return null;

  // Definição de Tema para o Botão "Ver Mais"
  const theme = isSecretMode ? {
    buttonExp: 'bg-pink-900/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/10 hover:border-pink-500/60',
    iconExp: 'text-pink-500'
  } : {
    buttonExp: 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/60',
    iconExp: 'text-emerald-500'
  };

  const displayedExperiences = showAllExperiences 
    ? experiences 
    : experiences.slice(0, INITIAL_EXP_COUNT);

  return (
    <main className="min-h-screen text-slate-300 selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      <Navbar />
      <Hero />

      {/* --- BOTÃO FLUTUANTE DO JOGO --- */}
      <AnimatePresence>
        {!isGameOpen && (
          <motion.button
            key="game-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsGameOpen(true)}
            className={`
              fixed bottom-28 right-8 p-3 w-14 h-14 flex items-center justify-center rounded-full shadow-2xl z-[90] transition-colors duration-300 border backdrop-blur-md group cursor-pointer
              ${isSecretMode 
                ? 'bg-black/90 border-pink-500 text-pink-500 hover:bg-pink-600 hover:text-white shadow-pink-500/40 ring-1 ring-pink-500/30' 
                : 'bg-slate-900/90 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white shadow-emerald-500/40 ring-1 ring-emerald-500/30'}
            `}
            title={isSecretMode ? "SYSTEM HACK" : "Jogar Code Breaker"}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <Gamepad2 size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGameOpen && <TechWordle onClose={() => setIsGameOpen(false)} />}
      </AnimatePresence>

      {/* --- SEÇÃO DE PROJETOS --- */}
      <section id="projetos" className="py-20 bg-slate-800/50 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
             <Code className="text-emerald-400"/> {t.home.projectsTitle}
          </h2>
          <p className="text-slate-400 mb-12">{t.home.projectsSubtitle}</p>

          {loading ? (
             <div className="max-w-4xl mx-auto">
               <ProjectSkeleton />
             </div>
          ) : projects.length > 0 ? (
            <ProjectCarousel projects={projects} />
          ) : (
            <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
              <p>{t.home.loading}</p>
            </div>
          )}
        </div>
      </section>

      {/* --- SEÇÃO: COMPETÊNCIAS E CERTIFICADOS --- */}
      <CompetenceSection 
        skills={skills} 
        certificates={certificates} 
        isSecretMode={isSecretMode} 
      />

      {/* --- SEÇÃO DE EXPERIÊNCIA --- */}
      <section id="experiencia" className="py-20 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
             <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <Server className="text-emerald-400"/> {t.home.experienceTitle}
             </h2>
          </div>
          
          <div className="ml-3 pl-8 relative">
             {/* Linha Vertical Contínua */}
             <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-slate-800/50"></div>
            
            {loading ? (
              <div className="space-y-12">
                <ExperienceSkeleton />
                <ExperienceSkeleton />
              </div>
            ) : (
              <>
                {displayedExperiences.map((exp: any, index: number) => (
                  <ExperienceItem key={exp.id} experience={exp} index={index} />
                ))}

                {/* Botão de Expandir/Recolher (Só aparece se houver mais itens que o limite) */}
                {experiences.length > INITIAL_EXP_COUNT && (
                  <div className="mt-8 relative z-20 flex justify-center md:justify-start pl-6">
                    <motion.button
                      onClick={() => setShowAllExperiences(!showAllExperiences)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        group flex items-center gap-3 px-6 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 font-mono text-sm font-bold uppercase tracking-wider
                        ${theme.buttonExp}
                      `}
                    >
                      <div className={`p-1 rounded-full border bg-slate-950 ${isSecretMode ? 'border-pink-500/50' : 'border-emerald-500/50'}`}>
                        {showAllExperiences ? <ChevronUp size={16} /> : <History size={16} />}
                      </div>
                      
                      <span>
                        {showAllExperiences ? t.home.collapseTimeline : t.home.loadTimeline}
                      </span>
                      
                      {!showAllExperiences && (
                        <span className={`text-xs opacity-60 ml-1 ${theme.iconExp}`}>
                          (+{experiences.length - INITIAL_EXP_COUNT})
                        </span>
                      )}
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section id="contato" className="py-20 bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{t.home.contactTitle}</h2>
          <p className="text-slate-400 mb-12">
            {t.home.contactSubtitle}
          </p>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
