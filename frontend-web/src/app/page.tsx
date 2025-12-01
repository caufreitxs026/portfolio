'use client';

import { Code, Server } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExperienceItem from '@/components/ExperienceItem';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ProjectCarousel from '@/components/ProjectCarousel';
import { ProjectSkeleton, ExperienceSkeleton } from '@/components/Skeletons';
import { useCachedData } from '@/hooks/useCachedData';

// Interfaces
interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string;
  repo_link: string;
}

interface Experience {
  id: number;
  role: string;
  company: string;
  start_date: string;
  end_date?: string;
  description: string;
  is_current: boolean;
}

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // --- ALTERAÇÃO DE CACHE ---
  // Mudamos as chaves para '_v2'. Isso invalida o cache antigo no navegador do usuário
  // e força o download dos dados novos que você alterou no banco.
  const { data: projects, loading: loadingProjects } = useCachedData<Project[]>('portfolio_projects_v2', `${API_URL}/projects`);
  const { data: experiences, loading: loadingExperience } = useCachedData<Experience[]>('portfolio_experience_v2', `${API_URL}/experiences`);

  return (
    <main className="min-h-screen text-slate-300 selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      <Navbar />
      <Hero />

      {/* Seção de Projetos */}
      <section id="projetos" className="py-20 bg-slate-800/50 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
             <Code className="text-emerald-400"/> Projetos em Destaque
          </h2>
          <p className="text-slate-400 mb-12">
            Casos reais onde apliquei tecnologia para gerar valor.
          </p>

          {(loadingProjects && !projects) ? (
             // Só mostra Skeleton se estiver carregando E não tiver dados no cache
             <div className="max-w-4xl mx-auto">
               <ProjectSkeleton />
             </div>
          ) : (
            <ProjectCarousel projects={projects || []} />
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
            
            {(loadingExperience && !experiences) ? (
              // Só mostra Skeleton se estiver carregando E não tiver dados no cache
              <div className="space-y-12">
                <ExperienceSkeleton />
                <ExperienceSkeleton />
                <ExperienceSkeleton />
              </div>
            ) : (
              (experiences || []).map((exp, index) => (
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
