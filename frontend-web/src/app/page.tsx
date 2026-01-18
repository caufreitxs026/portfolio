'use client';

import { useState, useEffect } from 'react';
import { Code, Server, ChevronUp, History } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Componentes
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExperienceItem from '@/components/ExperienceItem';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ProjectCarousel from '@/components/ProjectCarousel';
import CompetenceSection from '@/components/CompetenceSection';
import { ProjectSkeleton, ExperienceSkeleton } from '@/components/Skeletons';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext'; // Usar tema para estilos condicionais

export default function Home() {
  const { projects, experiences, skills, certificates, loading } = usePortfolioData();
  const [mounted, setMounted] = useState(false);
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const INITIAL_EXP_COUNT = 3;
  
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const displayedExperiences = showAllExperiences 
    ? experiences 
    : experiences.slice(0, INITIAL_EXP_COUNT);

  // Estilos condicionais para cabeçalhos de seção
  const sectionHeaderClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const sectionSubClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const iconClass = theme === 'dark' ? 'text-emerald-400' : 'text-indigo-600';
  const buttonClass = theme === 'dark' 
    ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800' 
    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm';

  return (
    <main className="min-h-screen overflow-x-hidden">
      
      <Navbar />
      <Hero />

      {/* --- SEÇÃO DE PROJETOS --- */}
      <section id="projetos" className={`py-20 relative ${theme === 'dark' ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`text-3xl font-bold mb-2 flex items-center gap-2 ${sectionHeaderClass}`}>
             <Code className={iconClass}/> {t.home.projectsTitle}
          </h2>
          <p className={`mb-12 ${sectionSubClass}`}>{t.home.projectsSubtitle}</p>

          {loading ? (
             <div className="max-w-4xl mx-auto">
               <ProjectSkeleton />
             </div>
          ) : projects.length > 0 ? (
            <ProjectCarousel projects={projects} />
          ) : (
            <div className={`text-center py-20 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
              <p>{t.home.loading}</p>
            </div>
          )}
        </div>
      </section>

      {/* --- SEÇÃO: COMPETÊNCIAS E CERTIFICADOS --- */}
      <CompetenceSection 
        skills={skills} 
        certificates={certificates} 
        isSecretMode={theme === 'dark'} // Adaptação para usar o tema
      />

      {/* --- SEÇÃO DE EXPERIÊNCIA --- */}
      <section id="experiencia" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
             <h2 className={`text-3xl font-bold mb-2 flex items-center gap-2 ${sectionHeaderClass}`}>
                <Server className={iconClass}/> {t.home.experienceTitle}
             </h2>
          </div>
          
          <div className="ml-3 pl-8 relative">
             <div className={`absolute left-0 top-2 bottom-0 w-[2px] ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            
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

                {/* Botão de Expandir */}
                {experiences.length > INITIAL_EXP_COUNT && (
                  <div className="mt-8 relative z-20 flex justify-center md:justify-start pl-6">
                    <motion.button
                      onClick={() => setShowAllExperiences(!showAllExperiences)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group flex items-center gap-3 px-6 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 font-mono text-sm font-bold uppercase tracking-wider ${buttonClass}`}
                    >
                      {showAllExperiences ? <ChevronUp size={16} /> : <History size={16} />}
                      <span>
                        {showAllExperiences ? t.home.collapseTimeline : t.home.loadTimeline}
                      </span>
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section id="contato" className={`py-20 ${theme === 'dark' ? 'bg-slate-900/30' : 'bg-slate-100/50'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-6 ${sectionHeaderClass}`}>{t.home.contactTitle}</h2>
          <p className={`mb-12 ${sectionSubClass}`}>
            {t.home.contactSubtitle}
          </p>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
