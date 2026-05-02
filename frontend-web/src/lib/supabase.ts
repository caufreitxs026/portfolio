import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente Público: Sujeito às regras de RLS (Apenas Leitura)
// Removida a tipagem <Database> para evitar o colapso de inferência (type 'never')
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para criar um Cliente Admin: Ignora o RLS (Usar APENAS em funções Server-Side/API)
export const createAdminClient = () => {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
        console.warn("SUPABASE_SERVICE_ROLE_KEY não configurada. Operações de admin falharão.");
        return createClient(supabaseUrl, supabaseAnonKey);
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};