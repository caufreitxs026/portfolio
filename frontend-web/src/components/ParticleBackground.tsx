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

  const color = isSecretMode ? "#ec4899" : "#10b981";

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none"
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: { value: "transparent" } },
        fpsLimit: 60, // Trava em 60 FPS para economia de bateria
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab", // Efeito de conectar ao cursor
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 180, // Distância que o cursor "pega" as partículas
              links: {
                opacity: 0.5, // Linhas do cursor são mais visíveis
                color: color
              },
            },
          },
        },
        particles: {
          color: { value: color },
          links: {
            enable: true, // Ativa conexões entre partículas para o visual "constelação"
            distance: 150,
            color: color,
            opacity: 0.15, // Bem sutil para não poluir (Claro)
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: true,
            speed: 0.8, // Movimento lento e suave (Calm Tech)
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000, // Área grande para espalhar bem
            },
            value: 30, // Quantidade baixa para performance (Otimizado)
          },
          opacity: {
            value: 0.3,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false
            }
          },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 2 } },
        },
        detectRetina: true,
      }}
    />
  );
}
