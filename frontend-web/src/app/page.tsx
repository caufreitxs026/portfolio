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
  
  // Se não tiver URL (ex: build time sem env), retorna vazio para não quebrar
  if (!API_URL) {
    console.warn("Aviso: NEXT_PUBLIC_API_URL não definida. Retornando dados vazios.");
    return { projects: [], experiences: [] };
  }

  try {
    console.log(`Buscando dados de: ${API_URL}`);
    
    // Adicionei um timeout para não travar o build se a API demorar
    const fetchWithTimeout = (url: string) => 
        fetch(url, { next: { revalidate: 3600 } }).catch(err => {
            console.error(`Erro fetch ${url}:`, err);
            return null;
        });

    const [projectsRes, expRes] = await Promise.all([
      fetchWithTimeout(`${API_URL}/projects`),
      fetchWithTimeout(`${API_URL}/experiences`)
    ]);

    let projects: Project[] = [];
    let experiences: Experience[] = [];

    if (projectsRes && projectsRes.ok) {
        const data = await projectsRes.json();
        // Garante que é um array antes de atribuir
        if (Array.isArray(data)) projects = data;
    }

    if (expRes && expRes.ok) {
        const data = await expRes.json();
        if (Array.isArray(data)) experiences = data;
    }

    return { projects, experiences };
  } catch (error) {
    console.error("Erro crítico ao buscar dados:", error);
    return { projects: [], experiences: [] };
  }
}

export default async function Page() {
  const data = await getPortfolioData();
  
  // Segurança extra: Garante que nunca passa undefined para o cliente
  const safeProjects = Array.isArray(data?.projects) ? data.projects : [];
  const safeExperiences = Array.isArray(data?.experiences) ? data.experiences : [];
  
  return <HomeClient projects={safeProjects} experiences={safeExperiences} />;
}
