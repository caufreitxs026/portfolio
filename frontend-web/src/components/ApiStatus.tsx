'use client';

import { useState, useEffect } from 'react';
import { Activity, Wifi, WifiOff } from 'lucide-react';

export default function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Tenta bater na raiz da API com timeout curto
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch(`${API_URL}/`, { 
          signal: controller.signal,
          method: 'GET'
        });
        
        clearTimeout(timeoutId);

        if (res.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (error) {
        setStatus('offline');
      }
    };

    // Checa agora e a cada 30 segundos
    checkStatus();
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, [API_URL]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono shadow-sm">
      {status === 'checking' && (
        <>
          <Activity size={14} className="text-yellow-500 animate-pulse" />
          <span className="text-slate-400">Verificando...</span>
        </>
      )}
      
      {status === 'online' && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400">API Online</span>
        </>
      )}

      {status === 'offline' && (
        <>
          <WifiOff size={14} className="text-red-500" />
          <span className="text-red-400">API Offline</span>
        </>
      )}
    </div>
  );
}
