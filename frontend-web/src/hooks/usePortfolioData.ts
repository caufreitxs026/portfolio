import useSWR from 'swr';

// Fetcher simples para o SWR usar
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar dados');
  return res.json();
};

export function usePortfolioData() {
  // Pega a URL pública (definida na Vercel) ou usa localhost
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  // Configuração do SWR
  const swrConfig = {
    revalidateOnFocus: false, // Não recarrega ao mudar de aba
    dedupingInterval: 60000,  // Cache de 1 minuto
    shouldRetryOnError: true, // Tenta de novo se o Render estiver dormindo
  };

  const { data: projects, error: projectsError, isLoading: projectsLoading } = useSWR(
    `${API_URL}/projects`,
    fetcher,
    swrConfig
  );

  const { data: experiences, error: experiencesError, isLoading: experiencesLoading } = useSWR(
    `${API_URL}/experiences`,
    fetcher,
    swrConfig
  );

  return {
    projects: projects || [],
    experiences: experiences || [],
    loading: projectsLoading || experiencesLoading,
    error: projectsError || experiencesError
  };
}
