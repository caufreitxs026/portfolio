'use client';

import { useEffect } from 'react';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export default function EffectsWrapper() {
  const isSecretMode = useKonamiCode();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    // Busca o elemento principal de conteúdo
    const mainContent = document.getElementById('main-content');
    
    if (isSecretMode) {
      // Aplica o filtro apenas no conteúdo, não no body inteiro
      mainContent?.classList.add('secret-mode-content');
      // Adiciona uma classe no body apenas para controle de estado (sem estilo visual que quebre layout)
      document.body.classList.add('secret-active'); 
      playSound('success'); 
    } else {
      mainContent?.classList.remove('secret-mode-content');
      document.body.classList.remove('secret-active');
    }
  }, [isSecretMode, playSound]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        playSound('click');
      }
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [playSound]);

  return null;
}
