'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica de todos os efeitos
// Se algum componente estiver quebrando o build, comente a importação dele aqui também se necessário.
const SystemBoot = dynamic(() => import('./SystemBoot'), { ssr: false });
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });
const EffectsWrapper = dynamic(() => import('./EffectsWrapper'), { ssr: false });
const ParticleBackground = dynamic(() => import('./ParticleBackground'), { ssr: false });
const ScrollProgress = dynamic(() => import('./ScrollProgress'), { ssr: false });

export default function ClientEffects() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* 1. Componentes Leves (Provavelmente seguros) - Ativados */}
      <EffectsWrapper />
      <CustomCursor />
      <ScrollProgress />

      {/* 2. Componentes Pesados - Agora seguros para ativação */}
      <SystemBoot />
      <ParticleBackground />

      {/* Camada de Textura (Noise) */}
      <div 
        className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      {/* Camada de Vinheta */}
      <div className="fixed inset-0 z-[9997] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </>
  );
}
