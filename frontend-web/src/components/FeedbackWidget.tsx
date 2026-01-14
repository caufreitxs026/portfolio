'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, Send, MessageSquare, CheckCircle2, AlertCircle, Zap, Radio, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSoundEffects } from '@/hooks/useSoundEffects';

type Category = 'usability' | 'design' | 'projects' | 'structure' | 'experience' | 'mechanics';

const CATEGORIES: Category[] = ['usability', 'design', 'projects', 'structure', 'experience', 'mechanics'];

export default function FeedbackWidget() {
  const { t } = useLanguage();
  const { playSound } = useSoundEffects();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [isReady, setIsReady] = useState(false);

  // --- LÓGICA DA NAVE (Physics Engine) ---
  const shipRef = useRef<HTMLButtonElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 1.5, y: 1.5 });
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

  // Inicialização Segura da Posição
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized.current) {
        position.current = {
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 100)
        };
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5;
        velocity.current = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        
        isInitialized.current = true;
        setTimeout(() => setIsReady(true), 200);
    }
  }, []);

  // Loop de Animação Otimizado
  const animateShip = useCallback(() => {
    if (!shipRef.current || isOpen || hasSubmitted) return;

    if (!isHovering.current) {
        // Atualiza posição
        position.current.x += velocity.current.x;
        position.current.y += velocity.current.y;

        const { innerWidth, innerHeight } = window;
        const size = 60;
        const MARGIN = 10;

        // Colisão X
        if (position.current.x + size + MARGIN > innerWidth) {
            position.current.x = innerWidth - size - MARGIN;
            velocity.current.x *= -1;
        } else if (position.current.x < MARGIN) {
            position.current.x = MARGIN;
            velocity.current.x *= -1;
        }

        // Colisão Y
        if (position.current.y + size + MARGIN > innerHeight) {
            position.current.y = innerHeight - size - MARGIN;
            velocity.current.y *= -1;
        } else if (position.current.y < MARGIN) {
            position.current.y = MARGIN;
            velocity.current.y *= -1;
        }

        // Zona Proibida (Canto Inferior Direito)
        const forbiddenZoneX = innerWidth - 140; 
        const forbiddenZoneY = innerHeight - 200; 

        if (position.current.x > forbiddenZoneX && position.current.y > forbiddenZoneY) {
            if (Math.abs(velocity.current.x) > Math.abs(velocity.current.y)) {
                velocity.current.x = -Math.abs(velocity.current.x); 
            } else {
                velocity.current.y = -Math.abs(velocity.current.y);
            }
        }

        const rotation = (Math.atan2(velocity.current.y, velocity.current.x) * 180 / Math.PI) + 90;
        shipRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0) rotate(${rotation}deg)`;
    }

    requestRef.current = requestAnimationFrame(animateShip);
  }, [isOpen, hasSubmitted]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateShip);
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animateShip]);

  // Detector de Tema
  useEffect(() => {
    const localSubmitted = localStorage.getItem('portfolio_feedback_sent');
    if (localSubmitted) {
       setHasSubmitted(true);
    }

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
    if (index > rating) return 'bg-slate-700/30 border border-slate-700/50';
    if (rating <= 1) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] border-red-400';
    if (rating === 2) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] border-yellow-400';
    if (isSecretMode) return 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)] border-pink-400';
    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] border-emerald-400';
  };

  const handleOpen = () => {
    playSound('click');
    setIsOpen(true);
  };

  const handleHoverShip = () => {
    isHovering.current = true;
    playSound('hover'); 
  };

  const handleSubmit = async () => {
    playSound('click');
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
          playSound('success'); 
          setHasSubmitted(true);
          localStorage.setItem('portfolio_feedback_sent', 'true');
          
          setTimeout(() => {
            setIsOpen(false);
          }, 3500);
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
    button: 'bg-pink-600 hover:bg-pink-500 shadow-pink-500/20',
    glow: 'shadow-pink-500/20',
    shipFill: 'fill-pink-500',
    shipStroke: 'stroke-pink-400',
    pulse: 'bg-pink-500',
    successBg: 'bg-pink-500/10',
    modalBorder: 'border-pink-500/40 shadow-pink-900/20'
  } : {
    border: 'border-emerald-500/30',
    bg: 'bg-slate-900/90',
    text: 'text-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20',
    glow: 'shadow-emerald-500/20',
    shipFill: 'fill-emerald-500',
    shipStroke: 'stroke-emerald-400',
    pulse: 'bg-emerald-500',
    successBg: 'bg-emerald-500/10',
    modalBorder: 'border-emerald-500/40 shadow-emerald-900/20'
  };

  const particles = Array.from({ length: 8 });

  return (
    <AnimatePresence>
      
      {/* --- NAVE ESPACIAL (Gatilho) --- */}
      {!isOpen && !hasSubmitted && (
        <div 
            className={`fixed top-0 left-0 z-[9990] pointer-events-none transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
                transform: `translate3d(${position.current.x}px, ${position.current.y}px, 0)`,
                willChange: 'transform'
            }}
        >
            <button
                ref={shipRef}
                onClick={handleOpen}
                onMouseEnter={handleHoverShip}
                onMouseLeave={() => { isHovering.current = false; }}
                className="w-14 h-14 flex items-center justify-center cursor-pointer transition-[filter,opacity,scale] duration-200 filter drop-shadow-lg hover:scale-110 active:scale-95 group pointer-events-auto relative"
                title="Enviar Feedback"
            >
                {/* SVG Nave Tech Customizada */}
                <svg viewBox="0 0 32 32" className={`w-full h-full ${theme.shipStroke} stroke-[1.5] fill-slate-950/90 relative z-10`}>
                    <path d="M16 2 L20 10 L28 14 L20 18 L16 28 L12 18 L4 14 L12 10 Z" strokeLinejoin="round" />
                    <path d="M16 8 L16 14" className="stroke-current opacity-50" />
                    <circle cx="28" cy="14" r="1.5" className={`${theme.shipFill} animate-pulse`} />
                    <circle cx="4" cy="14" r="1.5" className={`${theme.shipFill} animate-pulse`} />
                    <circle cx="16" cy="16" r="2" className={`${theme.shipFill} opacity-80`} />
                </svg>
                
                {/* Radar Rotativo (Ativo no Hover) */}
                <div className={`absolute -inset-4 rounded-full border-2 ${theme.border} border-t-transparent border-l-transparent opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-300 pointer-events-none`} style={{ animationDuration: '2s' }}></div>
                <div className={`absolute -inset-2 rounded-full border ${theme.border} border-dashed opacity-0 group-hover:opacity-40 group-hover:animate-[spin_4s_linear_infinite_reverse] transition-opacity duration-300 pointer-events-none`}></div>

                {/* Rastro de Partículas */}
                <div className="absolute top-[75%] left-1/2 -translate-x-1/2 w-4 h-12 pointer-events-none flex flex-col items-center justify-start group-hover:opacity-0 transition-opacity duration-300">
                    <div className={`w-1.5 h-6 rounded-full blur-[2px] ${theme.pulse} opacity-80 animate-pulse`}></div>
                    {particles.map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute top-0 w-1 h-1 rounded-full ${theme.shipFill}`}
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 0.8, 0], y: [0, 20 + Math.random() * 20], x: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 30], scale: [1, 0] }}
                            transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, ease: "easeOut", delay: Math.random() * 0.2 }}
                        />
                    ))}
                </div>
                
                {/* Ping de Radar (Padrão) */}
                <div className={`absolute inset-0 rounded-full border ${theme.border} opacity-0 group-hover:opacity-0 animate-ping duration-1500 pointer-events-none`}></div>
            </button>
        </div>
      )}

      {/* --- MODAL DE FEEDBACK --- */}
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, filter: 'blur(10px)' }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`
                    relative w-full max-w-[450px] rounded-2xl overflow-hidden shadow-2xl
                    ${theme.bg} border ${theme.modalBorder}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,6px_100%]"></div>

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-black/40 border ${theme.border}`}>
                            <BarChart3 size={18} className={theme.text} />
                        </div>
                        <div>
                            <span className={`block text-sm font-bold font-mono uppercase tracking-widest text-white shadow-black drop-shadow-md`}>{t.feedback.title}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${theme.pulse} animate-pulse`}></span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">System Online</span>
                            </div>
                        </div>
                    </div>
                    {!hasSubmitted && (
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Corpo */}
                <div className="relative z-10 p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-8 text-center space-y-6"
                            >
                                <div className="relative">
                                    <div className={`absolute inset-0 rounded-full blur-xl opacity-40 ${theme.pulse}`}></div>
                                    <div className={`relative p-6 rounded-full bg-black/40 border-2 ${theme.border}`}>
                                        <motion.div 
                                            initial={{ scale: 0, rotate: -180 }} 
                                            animate={{ scale: 1, rotate: 0 }} 
                                            transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                                        >
                                            <CheckCircle2 size={56} className={theme.text} />
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-white font-bold text-2xl tracking-tight uppercase">Upload Complete</h3>
                                    <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed">{t.feedback.successMsg}</p>
                                </div>

                                <div className="w-full max-w-[200px] bg-slate-800/50 h-1.5 rounded-full overflow-hidden mt-2 border border-slate-700">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: "100%" }} 
                                        transition={{ duration: 1.2, ease: "easeInOut" }}
                                        className={`h-full ${theme.pulse}`} 
                                    />
                                </div>

                                <p className="text-slate-500 text-[10px] uppercase font-mono tracking-widest animate-pulse pt-2">
                                    Disengaging Systems...
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <p className="text-sm text-slate-300 mb-8 text-center leading-relaxed font-light">
                                    {t.feedback.intro}
                                </p>

                                <div className="space-y-6 mb-8">
                                    {CATEGORIES.map((cat) => (
                                        <div key={cat} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 group">
                                            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">
                                                {categoryLabels[cat]}
                                            </span>
                                            <div className="flex gap-2 self-end sm:self-auto">
                                                {[0, 1, 2, 3, 4].map((level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => {
                                                            playSound('click');
                                                            setRatings(prev => ({ ...prev, [cat]: level }));
                                                        }}
                                                        className={`
                                                            w-8 h-8 sm:w-8 sm:h-8 rounded transition-all duration-300 transform border
                                                            ${getBarColor(level, ratings[cat])}
                                                            hover:scale-110 hover:brightness-110 active:scale-95
                                                        `}
                                                        title={`Nível ${level}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-8">
                                    <label className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase mb-3 font-bold">
                                        <MessageSquare size={14} className={theme.text} />
                                        {t.feedback.suggestionLabel}
                                    </label>
                                    <div className="relative group">
                                        <div className={`absolute -inset-0.5 rounded-lg opacity-30 group-hover:opacity-100 transition duration-500 blur ${theme.pulse}`}></div>
                                        <textarea
                                            value={suggestion}
                                            onChange={(e) => setSuggestion(e.target.value)}
                                            placeholder={t.feedback.suggestionPlaceholder}
                                            className="relative w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-slate-200 focus:outline-none focus:border-slate-500 resize-none h-28 placeholder:text-slate-600 shadow-inner custom-scrollbar"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={status === 'sending'}
                                    className={`
                                        w-full py-4 rounded-xl font-bold text-white text-sm uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:translate-y-0
                                        ${theme.button} disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden border border-white/10
                                    `}
                                >
                                    {status === 'sending' ? (
                                        <div className="flex items-center gap-2">
                                            <Zap size={18} className="animate-bounce" />
                                            <span>{t.feedback.btnSending}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                            <Send size={18} className="relative z-10" />
                                            <span className="relative z-10">{t.feedback.btnSend}</span>
                                        </>
                                    )}
                                </button>
                                
                                {status === 'error' && (
                                    <motion.p 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs text-center mt-4 flex items-center justify-center gap-2 bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                                    >
                                        <AlertCircle size={14} /> {t.feedback.error}
                                    </motion.p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
