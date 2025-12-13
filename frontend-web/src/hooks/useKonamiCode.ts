'use client';

import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 
  'ArrowLeft', 'ArrowRight', 
  'b', 'a'
];

export function useKonamiCode() {
  const [input, setInput] = useState<string[]>([]);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      
      // Adiciona a tecla pressionada ao array
      const newInput = [...input, key];
      
      // Mantém o array do tamanho do código para comparar
      if (newInput.length > KONAMI_CODE.length) {
        newInput.shift();
      }
      
      setInput(newInput);

      // Verifica se a sequência bate
      if (JSON.stringify(newInput) === JSON.stringify(KONAMI_CODE)) {
        setIsActivated(prev => !prev); // Alterna (liga/desliga)
        setInput([]); // Reseta
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return isActivated;
}
