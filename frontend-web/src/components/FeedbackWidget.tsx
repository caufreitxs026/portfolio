'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, Send, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Category = 'usability' | 'design' | 'projects' | 'structure' | 'experience' | 'mechanics';

const CATEGORIES: Category[] = ['usability', 'design', 'projects', 'structure', 'experience', 'mechanics'];

export default function FeedbackWidget() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // --- LÓGICA DA NAVE (Spaceship) ---
  const shipRef = useRef<HTMLButtonElement>(null);
  const position = useRef({ x: 100, y: 100 });
  const velocity = useRef({ x: 2, y: 1.5 }); // Velocidade inicial
  const requestRef = useRef<number>();
  const isHovering = useRef(false);

  // Ratings
  const [ratings, setRatings] = useState<Record<Category, number>>({
    usability: 3, design: 3, projects: 3, structure: 3, experience: 3, mechanics: 3
  });
  const [suggestion, setSuggestion] = useState('');

  const categoryLabels: Record<Category, string> = {
    usability: t.feedback.categories.usability,
    design: t.feedback.categories.design,
    projects: t.feedback.categories.projects,
    structure: t.feedback.categories.structure,
    experience: t.feedback.categories.experience,
    mechanics: t.feedback.categories.mechanics
  };

  // Animação da Nave
  const animateShip = useCallback(() => {
    if (!shipRef.current || isOpen || hasSubmitted) return;

    if (!isHovering.current) {
        position.current.x += velocity.current.x;
        position.current.y += velocity.current.y;

        const { innerWidth, innerHeight } = window;
        const size = 50;

        if (position.current.x + size > innerWidth || position.current.x < 0) {
            velocity.current.x = -velocity.current.x;
        }
        if (position.current.y + size > innerHeight || position.current.y < 0) {
            velocity.current.y = -velocity.current.y;
        }
    }

    const rotation = (Math.atan2(velocity.current.y, velocity.current.x) * 180 / Math.PI) + 90;
    shipRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px) rotate(${rotation}deg)`;

    requestRef.current = requestAnimationFrame(animateShip);
  }, [isOpen, hasSubmitted]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        position.current = {
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 100)
        };
    }

    requestRef.current = requestAnimationFrame(animateShip);

    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animateShip]);

  // Detector de Tema (LocalStorage removido para testes)
  useEffect(() => {
    // REMOVIDO: Verificação de localStorage para permitir testes contínuos
    // const localSubmitted = localStorage.getItem('portfolio_feedback_sent');
    // if (localSubmitted) setHasSubmitted(true);

    const checkSecretMode = () => {
      if (typeof document !== 'undefined') {
        setIsSecretMode(document.body.classList.contains('secret-active'));
      }
    };
    checkSecretMode();
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') checkSecretMode();
        });
    });
    
    if (typeof document !== 'undefined') {
        observer.observe(document.body, { attributes: true });
    }
    return () => observer.disconnect();
  }, []);

  const getBarColor = (index: number, rating: number) => {
    if (index > rating) return 'bg-slate-700/50';
    if (rating <= 1) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    if (rating === 2) return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]';
    if (isSecretMode) return 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]';
    return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  };

  const handleSubmit = async () => {
    setStatus('sending');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-acxt.onrender.com';
      const payload = { ...ratings, suggestion };

      const res = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao enviar feedback');

      setStatus('success');
      setHasSubmitted(true);
      // REMOVIDO: localStorage.setItem('portfolio_feedback_sent', 'true');
      
      setTimeout(() => {
        setIsOpen(false);
        // Reset opcional para testes: descomente abaixo se quiser que a nave volte na mesma sessão após enviar
        // setHasSubmitted(false); 
        // setStatus('idle');
      }, 4000);

    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  if (hasSubmitted && !isOpen) return null;

  const theme = isSecretMode ? {
    border: 'border-pink-500/30',
    bg: 'bg-black/90',
    text: 'text-pink-400',
    button: 'bg-pink-600 hover:bg-pink-500',
    glow: 'shadow-pink-500/20',
    shipFill: 'fill-pink-500',
    shipStroke: 'stroke-pink-400',
    pulse: 'bg-pink-500'
  } : {
    border: 'border-emerald-500/30',
    bg: 'bg-slate-900/90',
    text: 'text-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-500',
    glow: 'shadow-emerald-500/20',
    shipFill: 'fill-emerald-500',
    shipStroke: 'stroke-emerald-400',
    pulse: 'bg-emerald-500'
  };

  return (
    <AnimatePresence>
      
      {/* --- NAVE ESPACIAL --- */}
      {!isOpen && !hasSubmitted && (
        <button
          ref={shipRef}
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => { isHovering.current = true; }}
          onMouseLeave={() => { isHovering.current = false; }}
          className="fixed top-0 left-0 z-[9990] w-14 h-14 flex items-center justify-center cursor-pointer transition-colors filter drop-shadow-lg hover:scale-110 active:scale-95 group"
          style={{ willChange: 'transform' }} 
          title="Status Report Drone"
        >
            <svg viewBox="0 0 32 32" className={`w-full h-full ${theme.shipStroke} stroke-[1.5] fill-slate-950/80`}>
                <path d="M16 2 L20 10 L28 14 L20 18 L16 28 L12 18 L4 14 L12 10 Z" strokeLinejoin="round" />
                <path d="M16 8 L16 14" className="stroke-current opacity-50" />
                <circle cx="28" cy="14" r="1.5" className={`${theme.shipFill} animate-pulse`} />
                <circle cx="4" cy="14" r="1.5" className={`${theme.shipFill} animate-pulse`} />
                <circle cx="16" cy="16" r="2" className={`${theme.shipFill} opacity-80`} />
            </svg>
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-6 rounded-full blur-[3px] ${theme.pulse} opacity-50 group-hover:h-8 group-hover:opacity-80 transition-all duration-300`}></div>
            <div className={`absolute inset-0 rounded-full border ${theme.border} opacity-0 group-hover:animate-ping duration-1500`}></div>
        </button>
      )}

      {/* --- CARD EXPANDIDO --- */}
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.9, x: "-50%" }}
            animate={{ y: 0, opacity: 1, scale: 1, x: "-50%" }}
            exit={{ y: 50, opacity: 0, scale: 0.9, x: "-50%" }}
            style={{ x: "-50%" }} 
            className={`
              fixed bottom-6 left-1/2 md:translate-x-0 md:left-auto md:right-24 md:bottom-8 z-[9999]
              w-[90vw] max-w-[380px] rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden
              ${theme.bg} ${theme.border}
              md:!transform-none
            `}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50 bg-white/5">
              <div className="flex items-center gap-2">
                  <Activity size={18} className={theme.text} />
                  <span className={`text-sm font-bold font-mono uppercase tracking-wider ${theme.text}`}>{t.feedback.title}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1, rotate: 360 }} 
                        transition={{ type: 'spring', damping: 10 }}
                      >
                        <CheckCircle2 size={56} className={theme.text} />
                      </motion.div>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">SYSTEM OPTIMIZED</h3>
                        <p className="text-slate-400 text-sm">{t.feedback.successMsg}</p>
                        <p className="text-slate-500 text-xs mt-4 font-mono">Drone returning to base...</p>
                      </div>
                  </div>
              ) : (
                  <>
                      <p className="text-xs text-slate-400 mb-6 text-center leading-relaxed">
                          {t.feedback.intro}
                      </p>

                      <div className="space-y-4 mb-6">
                          {CATEGORIES.map((cat) => (
                              <div key={cat} className="flex items-center justify-between group">
                                  <span className="text-xs font-mono font-medium text-slate-300 uppercase w-24 truncate">
                                      {categoryLabels[cat]}
                                  </span>
                                  <div className="flex gap-1">
                                      {[0, 1, 2, 3, 4].map((level) => (
                                          <button
                                              key={level}
                                              onClick={() => setRatings(prev => ({ ...prev, [cat]: level }))}
                                              className={`
                                                  w-6 h-8 rounded-sm transition-all duration-200 
                                                  hover:opacity-80 active:scale-95
                                                  ${getBarColor(level, ratings[cat])}
                                              `}
                                              title={`Nível ${level}`}
                                          />
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div className="mb-6">
                          <label className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase mb-2">
                              <MessageSquare size={12} />
                              {t.feedback.suggestionLabel}
                          </label>
                          <textarea
                              value={suggestion}
                              onChange={(e) => setSuggestion(e.target.value)}
                              placeholder={t.feedback.suggestionPlaceholder}
                              className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-slate-500 resize-none h-20 placeholder:text-slate-600"
                          />
                      </div>

                      <button
                          onClick={handleSubmit}
                          disabled={status === 'sending'}
                          className={`
                              w-full py-3 rounded-lg font-bold text-white text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all
                              ${theme.button} disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                      >
                          {status === 'sending' ? (
                              <span className="animate-pulse">{t.feedback.btnSending}</span>
                          ) : (
                              <>
                                  <Send size={16} />
                                  {t.feedback.btnSend}
                              </>
                          )}
                      </button>
                      
                      {status === 'error' && (
                          <p className="text-red-400 text-xs text-center mt-3 flex items-center justify-center gap-1">
                              <AlertCircle size={12} /> {t.feedback.error}
                          </p>
                      )}
                  </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
