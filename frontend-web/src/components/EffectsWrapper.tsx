'use client';

import { useEffect } from 'react';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export default function EffectsWrapper() {
  const isSecretMode = useKonamiCode();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    // Gerencia a classe global no Body para que todos os componentes (Navbar, Hero, Particles) saibam o estado
    if (isSecretMode) {
      document.body.classList.add('secret-active'); 
      playSound('success'); 
    } else {
      document.body.classList.remove('secret-active');
    }
  }, [isSecretMode, playSound]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Toca som apenas em elementos interativos
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
