import { useState, useEffect } from 'react';

export function useKonamiCode() {
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [input, setInput] = useState<string[]>([]);
  
  // Sequência: Cima, Cima, Baixo, Baixo, Esquerda, Direita, Esquerda, Direita, B, A
  const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newInput = [...input, e.key];
      
      // Mantém o tamanho do input igual ao da sequência
      if (newInput.length > sequence.length) {
        newInput.shift();
      }
      setInput(newInput);

      // Verifica se a sequência bate
      if (newInput.join('') === sequence.join('')) {
        setIsSecretMode(prev => !prev);
        setInput([]); // Reseta após ativação
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return isSecretMode;
}
