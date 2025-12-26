'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);

  // Coordenadas do mouse (MotionValues para performance)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Física de mola para o anel externo (atraso suave)
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16); // Centraliza o anel (32px / 2)
      mouseY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    // Detecta elementos interativos
    const attachListeners = () => {
      const interactives = document.querySelectorAll('a, button, .interactive');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    // Detecção de Tema (Hacker Mode)
    const checkSecretMode = () => {
      if (document.body.classList.contains('secret-active')) {
        setIsSecretMode(true);
      } else {
        setIsSecretMode(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    // Observer para links dinâmicos e mudança de tema
    const observer = new MutationObserver(() => {
      attachListeners();
      checkSecretMode();
    });
    
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    attachListeners();
    checkSecretMode();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, [mouseX, mouseY, isVisible]);

  // Cores baseadas no tema
  const cursorColor = isSecretMode ? 'bg-pink-500' : 'bg-emerald-500';
  const ringBorder = isSecretMode ? 'border-pink-500' : 'border-emerald-500';

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden mix-blend-difference hidden md:block">
      {/* Ponto Central (Segue o mouse instantaneamente) */}
      <motion.div
        className={`fixed top-0 left-0 w-2 h-2 rounded-full ${cursorColor}`}
        style={{
          x: mouseX, // Usa o valor direto, mas ajustado para centralizar dentro do anel
          y: mouseY,
          translateX: 12, // Ajuste fino para centro
          translateY: 12
        }}
      />

      {/* Anel Externo (Segue com delay/mola) */}
      <motion.div
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border ${ringBorder} transition-all duration-200`}
        style={{ x: cursorX, y: cursorY }}
        animate={{
          scale: isHovering ? 2.5 : 1, // Expande ao passar sobre links
          opacity: isHovering ? 0.8 : 0.5,
          backgroundColor: isHovering ? (isSecretMode ? 'rgba(236, 72, 153, 0.1)' : 'rgba(16, 185, 129, 0.1)') : 'transparent'
        }}
      />
    </div>
  );
}
