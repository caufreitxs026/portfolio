'use client';

import { useEffect } from 'react';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export default function EffectsWrapper() {
  const isSecretMode = useKonamiCode();
  const { playSound } = useSoundEffects();

  // Efeito do Konami Code
  useEffect(() => {
    if (isSecretMode) {
      document.body.classList.add('secret-mode');
      playSound('success'); 
    } else {
      document.body.classList.remove('secret-mode');
    }
  }, [isSecretMode, playSound]);

  // Efeito de Som Global
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) {
        playSound('click');
      }
    };

    // Opcional: Som de Hover (Tick)
    const handleHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const clickable = target.closest('a') || target.closest('button');
        // Adicionamos um atributo para evitar disparos repetidos se desejar
        if (clickable) {
             playSound('hover');
        }
    };

    window.addEventListener('click', handleClick);
    // window.addEventListener('mouseover', handleHover); // Descomente para ativar som no hover

    return () => {
      window.removeEventListener('click', handleClick);
      // window.removeEventListener('mouseover', handleHover);
    };
  }, [playSound]);

  return null;
}
