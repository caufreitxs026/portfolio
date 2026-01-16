'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);

  // Coordenadas do mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Física de Mola para o Anel ( atraso elegante )
  const springConfig = { damping: 20, stiffness: 150, mass: 0.8 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Efeito "Jelly" (Estica quando move rápido) - Opcional, mas dá um toque premium
  const velocityX = useSpring(0, { damping: 20, stiffness: 200 });
  const velocityY = useSpring(0, { damping: 20, stiffness: 200 });
  
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const moveCursor = (e: MouseEvent) => {
      // Atualiza posição alvo
      mouseX.set(e.clientX); 
      mouseY.set(e.clientY);
      
      // Calcula velocidade para distorção
      velocityX.set(e.clientX - lastX);
      velocityY.set(e.clientY - lastY);
      
      lastX = e.clientX;
      lastY = e.clientY;

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Detecta elementos interativos para o efeito "Magnético/Expandido"
    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    const attachListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, textarea, .interactive, .cursor-hover');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    // Detecta Tema
    const checkSecretMode = () => {
      if (document.body.classList.contains('secret-active')) {
        setIsSecretMode(true);
      } else {
        setIsSecretMode(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Observer para garantir que novos elementos também tenham o efeito
    const observer = new MutationObserver(() => {
      attachListeners();
      checkSecretMode();
    });
    
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    attachListeners();
    checkSecretMode();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      observer.disconnect();
    };
  }, [mouseX, mouseY, isVisible, velocityX, velocityY]);

  // Cores baseadas no tema
  const dotColor = isSecretMode ? 'bg-pink-500' : 'bg-emerald-400';
  const ringBorder = isSecretMode ? 'border-pink-500' : 'border-emerald-400';
  const hoverBg = isSecretMode ? 'bg-pink-500/20' : 'bg-emerald-400/20';

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden mix-blend-exclusion hidden md:block">
      
      {/* Ponto Central (Rápido e Preciso) */}
      <motion.div
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full ${dotColor} shadow-[0_0_10px_currentColor]`}
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovering ? 0 : 1 // Some quando está em hover para focar no anel
        }}
      />

      {/* Anel Externo (Fluido e Reativo) */}
      <motion.div
        className={`
            fixed top-0 left-0 rounded-full border transition-colors duration-300
            ${isHovering ? `${ringBorder} ${hoverBg} backdrop-blur-[1px]` : `${ringBorder} border-opacity-60`}
        `}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          width: isHovering ? 60 : (isClicking ? 20 : 32),
          height: isHovering ? 60 : (isClicking ? 20 : 32),
          borderWidth: isHovering ? 2 : 1.5,
          opacity: 1
        }}
        transition={{
            type: "spring",
            damping: 25,
            stiffness: 200,
            mass: 0.5
        }}
      />
    </div>
  );
}
