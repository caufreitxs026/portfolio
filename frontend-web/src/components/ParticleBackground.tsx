'use client';

import { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; 
import type { Engine } from "tsparticles-engine";

export default function ParticleBackground() {
  const [isSecretMode, setIsSecretMode] = useState(false);

  // Inicialização da Engine
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // Detecta mudança de tema para atualizar cor das partículas
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

  // Cores dinâmicas
  const color = isSecretMode ? "#ec4899" : "#10b981"; // Pink-500 vs Emerald-500

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none"
      options={{
        fullScreen: { enable: true, zIndex: -1 }, // Garante que fique atrás de tudo
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab", // Efeito de teia ao passar o mouse
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
                color: color // Link reativo
              },
            },
          },
        },
        particles: {
          color: {
            value: color, // Partícula reativa
          },
          links: {
            color: color, // Linha reativa
            distance: 150,
            enable: true,
            opacity: 0.15,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 0.8, // Movimento lento e elegante
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000, // Menos denso para visual clean
            },
            value: 40,
          },
          opacity: {
            value: 0.3,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 2 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
