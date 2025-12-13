'use client';

import { useCallback } from 'react';

// Sons em Base64 (Pequenos e leves, não requerem download externo)
const SOUNDS = {
  // Um "tick" sutil para hover
  hover: "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...", 
  // Nota: Para não deixar o código gigante, vou usar um som sintético curto via Web Audio API, que é mais moderno e leve.
};

export function useSoundEffects() {
  
  const playSound = useCallback((type: 'hover' | 'click' | 'success' | 'on') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'hover') {
        // Tick agudo e muito curto
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } 
      else if (type === 'click') {
        // Blip mecânico
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
      else if (type === 'success') {
        // Power up (para o Easter Egg)
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
      else if (type === 'on') {
        // Ativação suave
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }

    } catch (e) {
      console.error("Audio error", e);
    }
  }, []);

  return { playSound };
}
