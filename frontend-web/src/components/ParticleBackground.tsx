'use client';

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; 
import type { Engine } from "tsparticles-engine";
import { useTheme } from "@/contexts/ThemeContext";

export default function ParticleBackground() {
  const { theme } = useTheme();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // Cores baseadas no tema
  const color = theme === 'dark' ? "#10b981" : "#64748b"; // Emerald vs Slate-500
  const opacity = theme === 'dark' ? 0.3 : 0.6; // Mais visível no claro

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
            onHover: { enable: true, mode: "grab" },
            resize: true,
          },
          modes: {
            grab: {
              distance: 180,
              links: { opacity: 0.4, color: color },
            },
          },
        },
        particles: {
          color: { value: color },
          links: {
            enable: true,
            distance: 150,
            color: color,
            opacity: theme === 'dark' ? 0.1 : 0.2, // Um pouco mais forte no claro
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.4, // Lento e suave
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
          number: {
            density: { enable: true, area: 1200 },
            value: 30, // Leveza
          },
          opacity: {
            value: opacity,
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
            value: { min: 1, max: 2.5 },
            random: true,
          },
        },
        detectRetina: true,
      }}
    />
  );
}
