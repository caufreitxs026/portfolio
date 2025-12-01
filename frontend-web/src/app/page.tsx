'use client';

import { Code, Server } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExperienceItem from '@/components/ExperienceItem';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ProjectCarousel from '@/components/ProjectCarousel';

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

interface HomeClientProps {
  projects: Project[];
  experiences: Experience[];
}

export default function HomeClient({ projects, experiences }: HomeClientProps) {
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

          {/* Como os dados já vêm prontos do servidor, não precisamos de loading/skeletons aqui */}
          {projects.length > 0 ? (
            <ProjectCarousel projects={projects} />
          ) : (
            <p className="text-slate-500">Nenhum projeto encontrado no momento.</p>
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
            
            {experiences.map((exp, index) => (
              <ExperienceItem key={exp.id} experience={exp} index={index} />
            ))}
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
