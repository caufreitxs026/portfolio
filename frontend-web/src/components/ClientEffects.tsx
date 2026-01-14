'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importação dinâmica de todos os efeitos
const SystemBoot = dynamic(() => import('./SystemBoot'), { ssr: false });
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });
const EffectsWrapper = dynamic(() => import('./EffectsWrapper'), { ssr: false });
const ParticleBackground = dynamic(() => import('./ParticleBackground'), { ssr: false });
const ScrollProgress = dynamic(() => import('./ScrollProgress'), { ssr: false });

export default function ClientEffects() {
  // Estado para garantir que estamos no navegador
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Se não estiver montado (ainda no servidor ou hidratando), não renderiza nada.
  // Isso elimina o erro de "client-side exception" causado por acesso prematuro a window/document.
  if (!isMounted) return null;

  return (
    <>
      <SystemBoot />
      <EffectsWrapper />
      <CustomCursor />
      <ScrollProgress />
      <ParticleBackground />
    </>
  );
}
