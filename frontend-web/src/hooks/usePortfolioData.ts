import useSWR from 'swr';
import { supabase } from '@/lib/supabase';

const fetchSupabaseProjects = async () => {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Supabase Error: ${error.message}`);
  return data;
};

const fetchSupabaseSkills = async () => {
  const { data, error } = await supabase
    .from('portfolio_skills')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });
  if (error) throw new Error(`Supabase Error: ${error.message}`);
  return data;
};

const fetchSupabaseExperiences = async () => {
  const { data, error } = await supabase
    .from('portfolio_experiences')
    .select('*')
    .order('is_current', { ascending: false })
    .order('start_date', { ascending: false });
  if (error) throw new Error(`Supabase Error: ${error.message}`);
  return data;
};

const fetchSupabaseCertificates = async () => {
  const { data, error } = await supabase
    .from('portfolio_certificates')
    .select('*')
    .order('display_order', { ascending: true })
    .order('issue_date', { ascending: false });
  if (error) throw new Error(`Supabase Error: ${error.message}`);
  return data;
};

export function usePortfolioData() {
  const swrConfig = {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    shouldRetryOnError: true,
  };

  const { data: projects, isLoading: pLoading } = useSWR('supabase_projects', fetchSupabaseProjects, swrConfig);
  const { data: skills, isLoading: sLoading } = useSWR('supabase_skills', fetchSupabaseSkills, swrConfig);
  const { data: experiences, isLoading: eLoading } = useSWR('supabase_experiences', fetchSupabaseExperiences, swrConfig);
  const { data: certificates, isLoading: cLoading } = useSWR('supabase_certificates', fetchSupabaseCertificates, swrConfig);

  return {
    projects: projects || [],
    experiences: experiences || [],
    skills: skills || [],
    certificates: certificates || [],
    loading: pLoading || eLoading || sLoading || cLoading
  };
}