'use client';

import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

export default function SpotlightCard({ children, className = "", isSecretMode }: { children: React.ReactNode, className?: string, isSecretMode: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Valores para o efeito 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Suavização do movimento 3D
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useSpring(useMotionValue(0), { damping: 15, stiffness: 150 });
  const rotateY = useSpring(useMotionValue(0), { damping: 15, stiffness: 150 });

  function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Posição para o Spotlight
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    // Cálculo para o Tilt 3D
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    
    // Define a rotação (limitada a +/- 10 graus para não exagerar)
    rotateX.set(yPct * -10); 
    rotateY.set(xPct * 10);
  }

  function handleMouseLeave() {
    // Reseta a rotação quando o mouse sai
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(0); // Opcional: move o spotlight para fora ou zera
    mouseY.set(0);
  }

  const spotlightColor = isSecretMode ? 'rgba(236, 72, 153, 0.15)' : 'rgba(16, 185, 129, 0.15)';

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`group relative border border-white/10 overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-sm transform transition-transform duration-200 ${className}`}
    >
      {/* Camada de Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Conteúdo com leve elevação Z para profundidade */}
      <div className="relative h-full z-20" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
