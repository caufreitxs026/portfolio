'use client';

import { useState } from 'react';
import { Code, Server, Gamepad2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Componentes
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExperienceItem from '@/components/ExperienceItem';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ProjectCarousel from '@/components/ProjectCarousel';
import TechWordle from '@/components/TechWordle'; // Jogo Novo
import { ProjectSkeleton, ExperienceSkeleton } from '@/components/Skeletons';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function Home() {
  // Usa o Hook com SWR (garante dados ou loading)
  const { projects, experiences, loading } = usePortfolioData();
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <main className="min-h-screen text-slate-300 selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      <Navbar />
      <Hero />

      {/* Botão Flutuante do Jogo */}
      <button
        onClick={() => setIsGameOpen(true)}
        className="fixed bottom-24 right-8 p-3 bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-full shadow-lg z-40 transition-all duration-300 border border-emerald-500/30 backdrop-blur-md group"
        title="Hack the System (Jogar)"
      >
        <Gamepad2 size={24} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Modal do Jogo */}
      <AnimatePresence>
        {isGameOpen && <TechWordle onClose={() => setIsGameOpen(false)} />}
      </AnimatePresence>

      {/* Seção de Projetos */}
      <section id="projetos" className="py-20 bg-slate-800/50 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
             <Code className="text-emerald-400"/> Projetos em Destaque
          </h2>
          <p className="text-slate-400 mb-12">
            Casos reais onde apliquei tecnologia para gerar valor.
          </p>

          {loading ? (
             <div className="max-w-4xl mx-auto">
               <ProjectSkeleton />
             </div>
          ) : projects.length > 0 ? (
            <ProjectCarousel projects={projects} />
          ) : (
            <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
              <p>Carregando dados do servidor...</p>
              {/* Se demorar muito, o usuário sabe que está tentando */}
            </div>
          )}
        </div>
      </section>

      {/* Seção de Experiência */}
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
              <div className="space-y-12">
                <ExperienceSkeleton />
                <ExperienceSkeleton />
              </div>
            ) : (
              experiences.map((exp: any, index: number) => (
                <ExperienceItem key={exp.id} experience={exp} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      <section id="contato" className="py-20 bg-slate-800/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Vamos Conversar?</h2>
          <p className="text-slate-400 mb-12">
            Estou disponível para novos desafios. Envie uma mensagem.
          </p>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
