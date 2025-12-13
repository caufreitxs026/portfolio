import HomeClient from '@/components/HomeClient';

// Cache (ISR) de 1 hora
export const revalidate = 3600; 

async function getPortfolioData() {
  // Tenta pegar a URL da API
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  // Se não tiver URL definida (ex: build time), retorna vazio
  if (!API_URL) {
    console.warn("[BUILD] Aviso: NEXT_PUBLIC_API_URL não definida. Usando dados vazios.");
    return { projects: [], experiences: [] };
  }

  try {
    console.log(`[BUILD] Tentando buscar dados de: ${API_URL}`);
    
    // Timeout agressivo de 10s para o build não travar esperando o Render
    const fetchWithTimeout = async (url: string) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 10000); 
        try {
            const res = await fetch(url, { 
                signal: controller.signal,
                next: { revalidate: 3600 } 
            });
            clearTimeout(id);
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            return await res.json();
        } catch (err) {
            clearTimeout(id);
            console.error(`[BUILD] Falha ao buscar ${url}:`, err);
            return []; // Retorna array vazio em caso de erro
        }
    };

    const [projectsData, experiencesData] = await Promise.all([
      fetchWithTimeout(`${API_URL}/projects`),
      fetchWithTimeout(`${API_URL}/experiences`)
    ]);

    // Garante que é array
    const projects = Array.isArray(projectsData) ? projectsData : [];
    const experiences = Array.isArray(experiencesData) ? experiencesData : [];

    return { projects, experiences };

  } catch (error) {
    console.error("[BUILD] Erro crítico:", error);
    // Fallback de segurança máxima
    return { projects: [], experiences: [] };
  }
}

export default async function Page() {
  const data = await getPortfolioData();
  
  // Passa dados seguros para o cliente (mesmo que vazios)
  return <HomeClient projects={data.projects} experiences={data.experiences} />;
}
