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

  const color = isSecretMode ? "#ec4899" : "#10b981"; // Pink vs Emerald

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none"
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: { value: "transparent" } },
        fpsLimit: 60, // Trava em 60 FPS para consistência
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: {
              enable: true,
              mode: "grab", // Conecta partículas ao mouse
            },
            onClick: {
              enable: true,
              mode: "push", // Adiciona partículas ao clicar (Explosão criativa)
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 180,
              links: {
                opacity: 0.4,
                color: color
              },
            },
            push: {
              quantity: 3, // Adiciona poucas por vez para não pesar
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            }
          },
        },
        particles: {
          color: { value: color },
          links: {
            enable: true,
            distance: 150,
            color: color,
            opacity: 0.12, // Transparência sutil para elegância
            width: 1,
            triangles: {
              enable: false, // Mantém limpo, sem preenchimento triangular
            }
          },
          collisions: {
            enable: false, // Desativa colisão entre partículas para performance
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" }, // Partículas saem e reaparecem (fluxo contínuo)
            random: true,
            speed: 0.6, // Movimento lento e "premium"
            straight: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          },
          number: {
            density: {
              enable: true,
              area: 1200, // Espalhamento amplo
            },
            value: 40, // Quantidade ideal para telas modernas
          },
          opacity: {
            value: 0.3,
            random: true, // Variedade visual
            animation: {
              enable: true,
              speed: 0.8,
              minimumValue: 0.1,
              sync: false
            }
          },
          shape: { type: "circle" },
          size: {
            value: { min: 1, max: 3 }, // Tamanhos variados para profundidade
            random: true,
            animation: {
              enable: true,
              speed: 2,
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
