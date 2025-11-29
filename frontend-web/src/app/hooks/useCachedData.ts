import { useState, useEffect } from 'react';

// Define o tempo de validade do cache (ex: 1 hora)
const CACHE_EXPIRY_MS = 60 * 60 * 1000; 

export function useCachedData<T>(key: string, url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Tenta carregar do cache local primeiro
      const cachedItem = localStorage.getItem(key);
      if (cachedItem) {
        try {
          const { value, timestamp } = JSON.parse(cachedItem);
          // Se o cache existir e for válido, usa ele imediatamente
          if (value) {
            setData(value);
            setLoading(false); // Já temos dados, não precisa mostrar loading
            
            // Se o cache for recente, não busca na API (opcional, aqui vamos buscar sempre para garantir atualização)
            // if (Date.now() - timestamp < CACHE_EXPIRY_MS) return; 
          }
        } catch (e) {
          console.error("Erro ao ler cache", e);
        }
      }

      // 2. Busca dados novos na API (Revalidação)
      try {
        const res = await fetch(url);
        if (res.ok) {
          const newValue = await res.json();
          // Atualiza o estado
          setData(newValue);
          // Salva no cache com timestamp
          localStorage.setItem(key, JSON.stringify({
            value: newValue,
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error(`Erro ao buscar ${url}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, url]);

  return { data, loading };
}