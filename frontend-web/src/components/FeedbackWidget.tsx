'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, Send, MessageSquare, CheckCircle2, AlertCircle, Zap, Radio } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Category = 'usability' | 'design' | 'projects' | 'structure' | 'experience' | 'mechanics';

const CATEGORIES: Category[] = ['usability', 'design', 'projects', 'structure', 'experience', 'mechanics'];

export default function FeedbackWidget() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showCallout, setShowCallout] = useState(false);

  // --- LÓGICA DA NAVE (Física Robusta) ---
  const shipRef = useRef<HTMLButtonElement>(null);
  // Inicia fora da tela para evitar flicker antes do cálculo
  const position = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 1.5, y: 1.2 }); // Velocidade inicial suave
  const requestRef = useRef<number>();
  const isHovering = useRef(false);
  const isInitialized = useRef(false);

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

  const calloutMessages = [
    "Report Status?", 
    "System Feedback", 
    "Click to Log", 
    "Data Required"
  ];
  const [calloutIndex, setCalloutIndex] = useState(0);

  // Inicialização Segura da Posição
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized.current) {
        position.current = {
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 100)
        };
        // Garante velocidade aleatória para não ficar monótono
        velocity.current = {
            x: (Math.random() - 0.5) * 4, 
            y: (Math.random() - 0.5) * 4
        };
        isInitialized.current = true;
    }
  }, []);

  // Loop de Animação com Física Corrigida
  useEffect(() => {
    const loop = () => {
        if (!shipRef.current || isOpen || hasSubmitted) return;

        if (!isHovering.current) {
            // Atualiza posição
            position.current.x += velocity.current.x;
            position.current.y += velocity.current.y;

            const { innerWidth, innerHeight } = window;
            const size = 60; // Margem de segurança (tamanho da nave + padding)

            // Colisão Eixo X (Com Clamp para evitar prender na parede)
            if (position.current.x + size > innerWidth) {
                position.current.x = innerWidth - size; // Empurra de volta
                velocity.current.x *= -1; // Inverte
            } else if (position.current.x < 0) {
                position.current.x = 0; // Empurra de volta
                velocity.current.x *= -1;
            }

            // Colisão Eixo Y
            if (position.current.y + size > innerHeight) {
                position.current.y = innerHeight - size;
                velocity.current.y *= -1;
            } else if (position.current.y < 0) {
                position.current.y = 0;
                velocity.current.y *= -1;
            }
        }

        // Rotação Suave
        const rotation = (Math.atan2(velocity.current.y, velocity.current.x) * 180 / Math.PI) + 90;
        
        // Aplica transformações
        shipRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0) rotate(${rotation}deg)`;

        requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isOpen, hasSubmitted]); // Removemos dependências instáveis para evitar resets

  // Ciclo de Mensagens (Callout)
  useEffect(() => {
    if (isOpen || hasSubmitted) return;
    const interval = setInterval(() => {
        setCalloutIndex(prev => (prev + 1) % calloutMessages.length);
        setShowCallout(true);
        setTimeout(() => setShowCallout(false), 3000);
    }, 10000);
    return () => clearInterval(interval);
  }, [isOpen, hasSubmitted]);

  // Detector de Tema
  useEffect(() => {
    // REMOVIDO: localStorage para testes (Manter comentado para produção real se quiser persistência)
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
    if (typeof document !== 'undefined') observer.observe(document.body, { attributes: true });
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

      setTimeout(() => {
          setStatus('success');
          setHasSubmitted(true);
          // REMOVIDO: localStorage.setItem('portfolio_feedback_sent', 'true');
          
          setTimeout(() => {
            setIsOpen(false);
          }, 5000);
      }, 1500);

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
    pulse: 'bg-pink-500',
    successBg: 'bg-pink-500/10'
  } : {
    border: 'border-emerald-500/30',
    bg: 'bg-slate-900/90',
    text: 'text-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-500',
    glow: 'shadow-emerald-500/20',
    shipFill: 'fill-emerald-500',
    shipStroke: 'stroke-emerald-400',
    pulse: 'bg-emerald-500',
    successBg: 'bg-emerald-500/10'
  };

  return (
    <AnimatePresence>
      
      {/* --- NAVE ESPACIAL --- */}
      {!isOpen && !hasSubmitted && (
        <div 
            className="fixed top-0 left-0 z-[9990] pointer-events-none"
            style={{ 
                // Usando translate3d para forçar aceleração de hardware (GPU)
                transform: `translate3d(${position.current.x}px, ${position.current.y}px, 0)`,
            }}
        >
            {/* Callout (Balão de Fala) */}
            <AnimatePresence>
                {showCallout && !isHovering.current && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -40, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded bg-slate-900 border ${theme.border} text-[10px] font-mono font-bold text-white shadow-lg pointer-events-none z-20`}
                    >
                        {calloutMessages[calloutIndex]}
                        <div className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b ${theme.border} rotate-45`}></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                ref={shipRef}
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => { isHovering.current = true; setShowCallout(true); }}
                onMouseLeave={() => { isHovering.current = false; setShowCallout(false); }}
                className="w-14 h-14 flex items-center justify-center cursor-pointer transition-transform filter drop-shadow-lg active:scale-95 group pointer-events-auto"
                title="System Report"
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
        </div>
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
              w-[90vw] max-w-[420px] rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden
              ${theme.bg} ${theme.border}
              md:!transform-none
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50 bg-white/5">
              <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded bg-white/5 border ${theme.border}`}>
                    <Radio size={16} className={theme.text} />
                  </div>
                  <div>
                    <span className={`block text-xs font-bold font-mono uppercase tracking-wider ${theme.text}`}>{t.feedback.title}</span>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest">System V.3.0</span>
                  </div>
              </div>
              {!hasSubmitted && (
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
                    <X size={18} />
                </button>
              )}
            </div>

            {/* Corpo */}
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-6 text-center space-y-6"
                    >
                        {/* Ícone de Sucesso Animado */}
                        <div className={`relative p-6 rounded-full ${theme.successBg} border ${theme.border}`}>
                            <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                            >
                                <CheckCircle2 size={48} className={theme.text} />
                            </motion.div>
                            <div className={`absolute inset-0 rounded-full ${theme.border} animate-ping opacity-20`}></div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-white font-bold text-xl tracking-tight">UPLOAD COMPLETE</h3>
                            <p className="text-slate-400 text-sm max-w-[250px] mx-auto leading-relaxed">{t.feedback.successMsg}</p>
                        </div>

                        {/* Barra de Progresso Decorativa */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: "100%" }} 
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className={`h-full ${theme.pulse}`} 
                            />
                        </div>

                        <p className="text-slate-500 text-[10px] uppercase font-mono tracking-widest animate-pulse">
                            Closing Connection...
                        </p>
                    </motion.div>
                ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p className="text-xs text-slate-400 mb-6 text-center leading-relaxed border-b border-white/5 pb-4">
                            {t.feedback.intro}
                        </p>

                        <div className="space-y-5 mb-8">
                            {CATEGORIES.map((cat) => (
                                <div key={cat} className="flex items-center justify-between group">
                                    <span className="text-xs font-mono font-medium text-slate-300 uppercase flex-1 pr-4">
                                        {categoryLabels[cat]}
                                    </span>
                                    
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2, 3, 4].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setRatings(prev => ({ ...prev, [cat]: level }))}
                                                className={`
                                                    w-5 h-8 sm:w-6 sm:h-9 rounded-sm transition-all duration-200 
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
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-slate-500 resize-none h-24 placeholder:text-slate-600 shadow-inner"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={status === 'sending'}
                            className={`
                                w-full py-3.5 rounded-lg font-bold text-white text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all
                                ${theme.button} disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden
                            `}
                        >
                            {status === 'sending' ? (
                                <div className="flex items-center gap-2">
                                    <Zap size={16} className="animate-bounce" />
                                    <span>{t.feedback.btnSending}</span>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <Send size={16} className="relative z-10" />
                                    <span className="relative z-10">{t.feedback.btnSend}</span>
                                </>
                            )}
                        </button>
                        
                        {status === 'error' && (
                            <p className="text-red-400 text-xs text-center mt-3 flex items-center justify-center gap-1">
                                <AlertCircle size={12} /> {t.feedback.error}
                            </p>
                        )}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
