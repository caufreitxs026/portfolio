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

  const color = isSecretMode ? "#ec4899" : "#ffffff"; // Branco/Cinza no modo normal é mais pro

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
              mode: "grab", // Conexão sutil
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 150,
              links: {
                opacity: 0.2, // Muito sutil
                color: isSecretMode ? "#ec4899" : "#94a3b8" // Slate-400 no modo normal
              },
            },
          },
        },
        particles: {
          color: { value: isSecretMode ? "#ec4899" : "#cbd5e1" }, // Slate-300
          links: {
            enable: true,
            distance: 120,
            color: isSecretMode ? "#ec4899" : "#64748b", // Slate-500
            opacity: 0.05, // Quase invisível, apenas textura
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: 0.3, // Movimento extremamente lento e elegante
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1500, // Muito espaçado
            },
            value: 40,
          },
          opacity: {
            value: 0.3,
            random: true,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false
            }
          },
          shape: { type: "circle" },
          size: {
            value: { min: 1, max: 2 }, // Partículas pequenas e delicadas
          },
        },
        detectRetina: true,
      }}
    />
  );
}
