'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, Send, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Tipos das categorias
type Category = 'usability' | 'design' | 'projects' | 'structure' | 'experience' | 'mechanics';

const CATEGORIES: Category[] = ['usability', 'design', 'projects', 'structure', 'experience', 'mechanics'];

export default function FeedbackWidget() {
  const { t } = useLanguage(); // Precisaremos adicionar traduções depois
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Estado das avaliações (Inicializa tudo com 3 - "High")
  const [ratings, setRatings] = useState<Record<Category, number>>({
    usability: 3,
    design: 3,
    projects: 3,
    structure: 3,
    experience: 3,
    mechanics: 3
  });
  
  const [suggestion, setSuggestion] = useState('');

  // 1. Lógica de Gatilho e Tema
  useEffect(() => {
    // Verifica se já enviou anteriormente
    const localSubmitted = localStorage.getItem('portfolio_feedback_sent');
    if (localSubmitted) return;

    // Detecta tema
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
    observer.observe(document.body, { attributes: true });

    // Gatilho de Tempo (45 segundos)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 45000);

    // Gatilho de Scroll (50%)
    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (scrollPercent > 0.5) {
        setIsVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Cores dinâmicas baseadas na nota (0-4) e tema
  const getBarColor = (index: number, rating: number) => {
    if (index > rating) return 'bg-slate-700/50'; // Inativo
    
    // Cores ativas
    if (rating <= 1) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    if (rating === 2) return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]';
    // Nota 3 e 4 dependem do tema
    if (isSecretMode) return 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]';
    return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  };

  const handleSubmit = async () => {
    setStatus('sending');
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-acxt.onrender.com';
      
      const payload = {
        ...ratings,
        suggestion
      };

      const res = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao enviar feedback');

      setStatus('success');
      setHasSubmitted(true);
      localStorage.setItem('portfolio_feedback_sent', 'true');
      
      // Fecha após sucesso
      setTimeout(() => {
        setIsOpen(false);
        setIsVisible(false);
      }, 3000);

    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  if (!isVisible || hasSubmitted && !isOpen) return null;

  const theme = isSecretMode ? {
    border: 'border-pink-500/30',
    bg: 'bg-black/90',
    text: 'text-pink-400',
    button: 'bg-pink-600 hover:bg-pink-500',
    glow: 'shadow-pink-500/20'
  } : {
    border: 'border-emerald-500/30',
    bg: 'bg-slate-900/90',
    text: 'text-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-500',
    glow: 'shadow-emerald-500/20'
  };

  // Nomes das categorias para exibição (Fallback enquanto não atualizamos o contexto)
  const categoryLabels: Record<Category, string> = {
    usability: 'Usabilidade',
    design: 'Design & UI',
    projects: 'Qualidade Projetos',
    structure: 'Estrutura Info.',
    experience: 'UX Geral',
    mechanics: 'Mecânicas/Efeitos'
  };

  return (
    <AnimatePresence>
      {/* Botão Flutuante (Minimizado) */}
      {!isOpen && isVisible && !hasSubmitted && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => setIsOpen(true)}
          className={`
            fixed bottom-4 right-4 md:bottom-8 md:right-24 z-[90] 
            flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md shadow-2xl group
            ${theme.bg} ${theme.border} ${theme.glow}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Activity size={18} className={theme.text} />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase">System Report</span>
          <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse ${isSecretMode ? 'bg-pink-500' : 'bg-emerald-500'}`}></span>
        </motion.button>
      )}

      {/* Card Expandido (Formulário) */}
      {isOpen && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          className={`
            fixed bottom-4 right-4 md:bottom-8 md:right-24 z-[100]
            w-[calc(100vw-2rem)] md:w-[380px] rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden
            ${theme.bg} ${theme.border}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50 bg-white/5">
            <div className="flex items-center gap-2">
                <Activity size={18} className={theme.text} />
                <span className={`text-sm font-bold font-mono uppercase tracking-wider ${theme.text}`}>Diagnostic Log</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
            </button>
          </div>

          {/* Corpo */}
          <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <CheckCircle2 size={48} className={theme.text} />
                    <h3 className="text-white font-bold text-lg">Log Registrado!</h3>
                    <p className="text-slate-400 text-sm">Obrigado por contribuir com a evolução do sistema.</p>
                </div>
            ) : (
                <>
                    <p className="text-xs text-slate-400 mb-6 text-center leading-relaxed">
                        Avalie os parâmetros do sistema. Clique nas barras para definir o nível de estabilidade.
                    </p>

                    {/* Matriz de Avaliação */}
                    <div className="space-y-4 mb-6">
                        {CATEGORIES.map((cat) => (
                            <div key={cat} className="flex items-center justify-between group">
                                <span className="text-xs font-mono font-medium text-slate-300 uppercase w-28 truncate">
                                    {categoryLabels[cat]}
                                </span>
                                
                                {/* Seletor de Barras (0-4) */}
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

                    {/* Sugestão */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase mb-2">
                            <MessageSquare size={12} />
                            Patch Notes (Sugestões)
                        </label>
                        <textarea
                            value={suggestion}
                            onChange={(e) => setSuggestion(e.target.value)}
                            placeholder="Opcional: Algum bug ou melhoria?"
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-slate-500 resize-none h-20 placeholder:text-slate-600"
                        />
                    </div>

                    {/* Botão Enviar */}
                    <button
                        onClick={handleSubmit}
                        disabled={status === 'sending'}
                        className={`
                            w-full py-3 rounded-lg font-bold text-white text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all
                            ${theme.button} disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {status === 'sending' ? (
                            <span className="animate-pulse">Enviando Dados...</span>
                        ) : (
                            <>
                                <Send size={16} />
                                Upload Log
                            </>
                        )}
                    </button>
                    
                    {status === 'error' && (
                        <p className="text-red-400 text-xs text-center mt-3 flex items-center justify-center gap-1">
                            <AlertCircle size={12} /> Falha na conexão. Tente novamente.
                        </p>
                    )}
                </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
