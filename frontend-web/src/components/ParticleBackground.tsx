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
        fpsLimit: 60, // Limita FPS para economizar bateria
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "bubble", // 'bubble' é mais leve que 'grab'
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 200,
              size: 4,
              duration: 2,
              opacity: 0.8,
            },
          },
        },
        particles: {
          color: { value: color },
          // DESATIVADO LINKS (LINHAS) PARA PERFORMANCE MÁXIMA E VISUAL MAIS LIMPO
          links: {
            enable: false, 
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: true,
            speed: 0.5, // Movimento bem lento e calmo
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 20, // Reduzido de 40 para 20 (menos é mais)
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
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  );
}
