import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePortfolioData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const { data: projects, error: projectsError, isLoading: projectsLoading } = useSWR(
    `${API_URL}/projects`,
    fetcher,
    { 
      revalidateOnFocus: false, // Não recarrega ao trocar de aba (economiza recursos)
      dedupingInterval: 60000, // Cache de 1 minuto
    }
  );

  const { data: experiences, error: experiencesError, isLoading: experiencesLoading } = useSWR(
    `${API_URL}/experiences`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    projects: projects || [],
    experiences: experiences || [],
    loading: projectsLoading || experiencesLoading,
    error: projectsError || experiencesError
  };
}
