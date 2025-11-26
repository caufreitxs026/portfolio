'use client';

import { useEffect, useState } from 'react';
import { Code, Server } from 'lucide-react';

// Importação dos Componentes Modulares
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import ExperienceItem from '@/components/ExperienceItem';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Define a URL da API (usa a variável de ambiente ou o localhost como fallback)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    async function fetchData() {
      try {
        // Usa a URL dinâmica nos fetches
        const [projectsRes, expRes] = await Promise.all([
            fetch(`${API_URL}/projects`),
            fetch(`${API_URL}/experiences`)
        ]);
        
        if (projectsRes.ok && expRes.ok) {
            setProjects(await projectsRes.json());
            setExperiences(await expRes.json());
        }
      } catch (error) {
        console.error("Erro ao conectar com API:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen text-slate-300 selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      <Navbar />
      <Hero />

      {/* Seção de Projetos */}
      <section id="projetos" className="py-20 bg-slate-800/50 relative">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Projetos em Destaque
          </h2>
          <p className="text-slate-400 mb-12">
            Casos reais onde apliquei tecnologia para gerar valor.
          </p>

          {loading ? (
             <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
             </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção de Experiência */}
      <section id="experiencia" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
             <h2 className="text-3xl font-bold text-white mb-2">
                Experiência Profissional
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

      {/* Seção de Contato */}
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