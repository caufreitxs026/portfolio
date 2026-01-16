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
        fpsLimit: 60,
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: {
              enable: true,
              mode: "grab", // Atração sutil
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 200,
              links: {
                opacity: 0.3, // Link mais forte perto do mouse
                color: color
              },
            },
          },
        },
        particles: {
          color: { value: color },
          links: {
            enable: true,
            distance: 150,
            color: color,
            opacity: 0.08, // Muito sutil no fundo
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: 0.4, // Movimento "flutuante" lento
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1200,
            },
            value: 50, // Quantidade equilibrada
          },
          opacity: {
            value: 0.4,
            random: true, // Cintilação
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false
            }
          },
          shape: { type: "circle" },
          size: {
            value: { min: 1, max: 2.5 }, // Tamanhos variados para profundidade 3D
            random: true,
          },
        },
        detectRetina: true,
      }}
    />
  );
}
