'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica com SSR desativado para componentes pesados
const SystemBoot = dynamic(() => import('./SystemBoot'), { ssr: false });
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });
const EffectsWrapper = dynamic(() => import('./EffectsWrapper'), { ssr: false });
const ParticleBackground = dynamic(() => import('./ParticleBackground'), { ssr: false });
const ScrollProgress = dynamic(() => import('./ScrollProgress'), { ssr: false });

export default function ClientEffects() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Garante que o código só rode no navegador após o carregamento inicial
    setIsMounted(true);
  }, []);

  // Se não estiver montado no cliente, retorna null (não renderiza nada)
  // Isso evita qualquer erro de "window is not defined" ou conflito de HTML
  if (!isMounted) return null;

  return (
    <>
      {/* Componentes Lógicos e Visuais */}
      <SystemBoot />
      <EffectsWrapper />
      <CustomCursor />
      <ScrollProgress />
      <ParticleBackground />

      {/* Camada de Textura (Noise) - Movida para cá para segurança */}
      <div 
        className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      {/* Camada de Vinheta - Movida para cá para segurança */}
      <div className="fixed inset-0 z-[9997] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </>
  );
}
