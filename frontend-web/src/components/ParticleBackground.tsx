'use client';

import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; 
import type { Engine } from "tsparticles-engine";

export default function ParticleBackground() {
  const [isSecretMode, setIsSecretMode] = useState(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const checkSecretMode = () => {
      if (typeof document !== 'undefined') {
        setIsSecretMode(document.body.classList.contains('secret-active'));
      }
    };
    checkSecretMode();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            checkSecretMode();
          }
        });
    });
    
    if (typeof document !== 'undefined') {
        observer.observe(document.body, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  // Cores: Emerald para Normal, Pink para Hacker
  const color = isSecretMode ? "#ec4899" : "#10b981";

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none"
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: { value: "transparent" } },
        fpsLimit: 60, // Otimização de bateria
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: {
              enable: true,
              mode: "grab", // Conecta partículas ao mouse suavemente
            },
            onClick: {
              enable: true,
              mode: "push", // Cria novas partículas ao clicar
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 180,
              links: {
                opacity: 0.5, // Linhas mais fortes perto do mouse
                color: color
              },
            },
            push: {
              quantity: 3,
            },
          },
        },
        particles: {
          color: { value: color },
          links: {
            enable: true,
            distance: 150,
            color: color,
            opacity: 0.1, // Linhas de fundo quase invisíveis para limpeza visual
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: 0.3, // Movimento ultra-lento para elegância ("Drift")
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000,
            },
            value: 35, // Quantidade equilibrada
          },
          // Efeito de Cintilação (Twinkle)
          opacity: {
            value: 0.5,
            random: true,
            animation: {
              enable: true,
              speed: 0.8, // Velocidade da cintilação
              minimumValue: 0.1,
              sync: false
            }
          },
          shape: { type: "circle" },
          // Efeito de Pulsação (Breathing)
          size: {
            value: { min: 1, max: 3 },
            random: true,
            animation: {
              enable: true,
              speed: 1.5, // Velocidade da pulsação de tamanho
              minimumValue: 0.5,
              sync: false
            }
          },
        },
        detectRetina: true,
      }}
    />
  );
}
