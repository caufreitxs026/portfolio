'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

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

    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const theme = isSecretMode ? {
    bar: 'bg-pink-500',
    button: 'bg-pink-600 hover:bg-pink-500 border-pink-400/30'
  } : {
    bar: 'bg-emerald-500',
    button: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400/30'
  };

  return (
    <>
      {/* Barra de Progresso no Topo */}
      <motion.div
        className={`fixed top-0 left-0 right-0 h-1 origin-left z-[100] ${theme.bar}`}
        style={{ scaleX }}
      />

      {/* Botão Voltar ao Topo */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          scale: isVisible ? 1 : 0.5,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        onClick={scrollToTop}
        className={`
            fixed bottom-8 right-8 p-3 text-white rounded-full shadow-lg z-40 transition-colors duration-300 border backdrop-blur-sm
            ${theme.button}
        `}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp size={24} />
      </motion.button>
    </>
  );
}
