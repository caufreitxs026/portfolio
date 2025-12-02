import HomeClient from '@/components/HomeClient';

// --- CONFIGURAÇÃO DE CACHE (ISR) ---
export const revalidate = 3600; 

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

async function getPortfolioData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  console.log(`[BUILD] Iniciando busca de dados. API_URL: ${API_URL}`);

  if (!API_URL) {
    console.warn("[BUILD] Aviso: NEXT_PUBLIC_API_URL não definida. Usando dados vazios.");
    return { projects: [], experiences: [] };
  }

  try {
    // AUMENTAMOS O TIMEOUT PARA 60 SEGUNDOS (Render Free Tier precisa disso)
    const fetchWithTimeout = async (url: string) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 60000); // 60s
        try {
            const res = await fetch(url, { 
                signal: controller.signal,
                next: { revalidate: 3600 } 
            });
            clearTimeout(id);
            return res.ok ? await res.json() : [];
        } catch (err) {
            clearTimeout(id);
            console.error(`[BUILD] Erro ao buscar ${url}:`, err);
            return [];
        }
    };

    const [projectsData, experiencesData] = await Promise.all([
      fetchWithTimeout(`${API_URL}/projects`),
      fetchWithTimeout(`${API_URL}/experiences`)
    ]);

    const projects = Array.isArray(projectsData) ? projectsData : [];
    const experiences = Array.isArray(experiencesData) ? experiencesData : [];

    console.log(`[BUILD] Sucesso! Projetos: ${projects.length}, Experiências: ${experiences.length}`);
    return { projects, experiences };

  } catch (error) {
    console.error("[BUILD] Erro crítico desconhecido:", error);
    return { projects: [], experiences: [] };
  }
}

export default async function Page() {
  const data = await getPortfolioData();
  
  const safeProjects = Array.isArray(data?.projects) ? data.projects : [];
  const safeExperiences = Array.isArray(data?.experiences) ? data.experiences : [];
  
  return <HomeClient projects={safeProjects} experiences={safeExperiences} />;
}
