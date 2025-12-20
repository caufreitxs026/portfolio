import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar dados');
  return res.json();
};

export function usePortfolioData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const swrConfig = {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    shouldRetryOnError: true,
  };

  const { data: projects, isLoading: pLoading } = useSWR(`${API_URL}/projects`, fetcher, swrConfig);
  const { data: experiences, isLoading: eLoading } = useSWR(`${API_URL}/experiences`, fetcher, swrConfig);
  // Novos Fetchs
  const { data: skills, isLoading: sLoading } = useSWR(`${API_URL}/skills`, fetcher, swrConfig);
  const { data: certificates, isLoading: cLoading } = useSWR(`${API_URL}/certificates`, fetcher, swrConfig);

  return {
    projects: projects || [],
    experiences: experiences || [],
    skills: skills || [],
    certificates: certificates || [],
    loading: pLoading || eLoading || sLoading || cLoading
  };
}
