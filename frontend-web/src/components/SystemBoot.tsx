'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle2, Lock, Cpu, Wifi } from 'lucide-react';

export default function SystemBoot() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Inicialização Segura
  useEffect(() => {
    setIsClient(true);
    // Verificação segura de sessionStorage
    try {
      const hasBooted = sessionStorage.getItem('portfolio_booted');
      if (hasBooted) {
        setIsVisible(false);
      }
    } catch (e) {
      // Se falhar (ex: modo anônimo restrito), apenas segue o fluxo sem persistência
      console.warn("Storage access limited", e);
    }
  }, []);

  // Sequência de Boot e Tema
  useEffect(() => {
    if (!isVisible || !isClient) return;

    // Detecta tema
    const checkSecretMode = () => {
      if (typeof document !== 'undefined') {
        setIsSecretMode(document.body.classList.contains('secret-active'));
      }
    };
    checkSecretMode();

    const bootSequence = [
        "Initializing Portfolio Kernel v3.0.1...",
        "Mounting Virtual File System...",
        "Loading UI Modules (React/Next.js)...",
        "Connecting to Neural Nexus...",
        "Verifying Security Protocols...",
        "Decrypting User Experience Assets...",
        "Establishing Secure Connection...",
        "System Ready. Launching Interface."
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
        if (logIndex < bootSequence.length) {
            setLogs(prev => [...prev, bootSequence[logIndex]]);
            logIndex++;
        } else {
            clearInterval(logInterval);
        }
    }, 300);

    const progressInterval = setInterval(() => {
        setProgress(prev => {
            // Incremento aleatório para parecer processamento real
            const next = prev + (Math.random() * 10);
            if (next >= 100) {
                clearInterval(progressInterval);
                return 100;
            }
            return next;
        });
    }, 150);

    return () => {
        clearInterval(logInterval);
        clearInterval(progressInterval);
    };
  }, [isVisible, isClient]);

  // Efeito separado para lidar com a conclusão (Evita erro de state update during render)
  useEffect(() => {
    if (progress >= 100) {
        const timer = setTimeout(() => {
            setIsVisible(false);
            try {
                sessionStorage.setItem('portfolio_booted', 'true');
            } catch (e) {}
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!isVisible || !isClient) return null;

  const theme = isSecretMode ? {
    bg: 'bg-black',
    text: 'text-pink-500',
    bar: 'bg-pink-600',
    border: 'border-pink-500/30'
  } : {
    bg: 'bg-slate-950',
    text: 'text-emerald-500',
    bar: 'bg-emerald-500',
    border: 'border-emerald-500/30'
  };

  return (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center ${theme.bg} font-mono cursor-wait`}
            >
                <div className="w-full max-w-lg px-6">
                    
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <Terminal size={24} className={theme.text} />
                            <span className="text-white font-bold tracking-widest text-sm">SYSTEM_BOOT_SEQUENCE</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 animate-pulse"></div>
                        </div>
                    </div>

                    <div className="h-64 overflow-hidden relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-50"></div>
                        <div className="space-y-2 flex flex-col justify-end h-full pb-4">
                            {logs.map((log, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-xs sm:text-sm text-slate-300"
                                >
                                    <span className={theme.text}>➜</span>
                                    <span>{log}</span>
                                    {i === logs.length - 1 && logs.length < 8 && (
                                        <span className="animate-pulse">_</span>
                                    )}
                                    {i < logs.length - 1 && <CheckCircle2 size={12} className={theme.text} />}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex justify-between text-xs text-slate-500 mb-2 uppercase tracking-wider">
                            <span>Loading Resources</span>
                            <span>{Math.min(100, Math.round(progress))}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                className={`h-full ${theme.bar} shadow-[0_0_15px_currentColor]`}
                                style={{ width: `${Math.min(100, progress)}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-12 flex justify-between text-[10px] text-slate-600 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Cpu size={12} />
                            <span>Mem: OK</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wifi size={12} />
                            <span>Net: Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock size={12} />
                            <span>Auth: Guest</span>
                        </div>
                    </div>

                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}
