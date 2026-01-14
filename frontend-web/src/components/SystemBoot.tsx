'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Adicionado ShieldCheck na importação
import { Terminal, CheckCircle2, Lock, Cpu, Wifi, HardDrive, Zap, ShieldCheck } from 'lucide-react';

export default function SystemBoot() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [rightPanelLogs, setRightPanelLogs] = useState<string[]>([]);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Safe Storage Access Helper
  const getStorage = (key: string) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch (e) {
      console.warn('Storage not available', e);
    }
    return null;
  };

  const setStorage = (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  };

  // Inicialização Segura
  useEffect(() => {
    setIsMounted(true);
    const hasBooted = getStorage('portfolio_booted');
    if (hasBooted) {
      setIsVisible(false);
    }
  }, []);

  // Sequência de Boot e Tema
  useEffect(() => {
    if (!isVisible || !isMounted) return;

    const checkSecretMode = () => {
      if (typeof document !== 'undefined') {
        setIsSecretMode(document.body.classList.contains('secret-active'));
      }
    };
    checkSecretMode();

    const bootSequence = [
        "BIOS DATE 01/14/26 19:37:00 VER 1.0.2",
        "CPU: Neural Quantum Core i9 @ 5.4GHz",
        "Memory Test: 65536K OK",
        "Detecting Primary Master ... CF-PORTFOLIO-V3",
        "Detecting Primary Slave  ... DATA-ANALYTICS-ENGINE",
        "Loading Kernel Modules...",
        "[ OK ] Mounted root filesystem.",
        "[ OK ] Started Network Manager.",
        "[ OK ] Reached target Graphical Interface.",
        "Initializing React Hydration Engine...",
        "Loading Next.js App Router...",
        "Connecting to Supabase Database...",
        "Fetching User Profile Data...",
        "Applying Tailwind CSS Styles...",
        "Security Protocols Verified.",
        "System Ready."
    ];

    const sysLogs = [
        "0x0040f: A4 F2 90 12",
        "0x00410: B2 C3 D4 E5",
        "0x00420: Loading...",
        "ALLOCATING VRAM...",
        "OPTIMIZING ASSETS...",
        "CALIBRATING SENSORS..."
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
        if (logIndex < bootSequence.length) {
            // FIX: Captura o valor ATUAL antes de entrar no callback do setLogs
            const currentLog = bootSequence[logIndex];

            if (currentLog) {
                setLogs(prev => {
                    const newLogs = [...prev, currentLog];
                    if (newLogs.length > 14) newLogs.shift(); 
                    return newLogs;
                });
            }
            
            if (Math.random() > 0.6) {
                 const randomSysLog = sysLogs[Math.floor(Math.random() * sysLogs.length)];
                 if (randomSysLog) {
                    setRightPanelLogs(prev => {
                        const newRight = [...prev, randomSysLog];
                        if (newRight.length > 8) newRight.shift();
                        return newRight;
                    });
                 }
            }

            logIndex++;
        } else {
            clearInterval(logInterval);
        }
    }, 200);

    const progressInterval = setInterval(() => {
        setProgress(prev => {
            const next = prev + (Math.random() * 8); 
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
  }, [isVisible, isMounted]);

  // Auto-scroll manual (mais seguro que scrollIntoView)
  useEffect(() => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Finalização e saída
  useEffect(() => {
    if (progress >= 100) {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setStorage('portfolio_booted', 'true');
        }, 1200);
        return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!isVisible || !isMounted) return null;

  const theme = isSecretMode ? {
    bg: 'bg-black',
    text: 'text-pink-500',
    textDim: 'text-pink-900',
    bar: 'bg-pink-600',
    border: 'border-pink-500/30',
    accent: 'text-pink-400'
  } : {
    bg: 'bg-slate-950',
    text: 'text-emerald-500',
    textDim: 'text-emerald-900',
    bar: 'bg-emerald-500',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-400'
  };

  return (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center ${theme.bg} font-mono cursor-wait overflow-hidden`}
            >
                {/* Background Grid Sutil */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" 
                     style={{ backgroundImage: `linear-gradient(to right, ${isSecretMode ? '#ec4899' : '#10b981'} 1px, transparent 1px), linear-gradient(to bottom, ${isSecretMode ? '#ec4899' : '#10b981'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
                </div>

                <div className="w-full max-w-4xl px-4 relative z-10">
                    
                    {/* Header do Sistema */}
                    <div className={`flex items-center justify-between mb-6 border-b ${theme.border} pb-4`}>
                        <div className="flex flex-col">
                            <h1 className={`text-xl md:text-2xl font-bold tracking-widest ${theme.text}`}>
                                CAUÃ_FREITAS_OS <span className="text-xs opacity-50">v3.0.1</span>
                            </h1>
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Full Stack & Data Analysis Environment</span>
                        </div>
                        <div className="hidden sm:flex gap-6 text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <Cpu size={14} className={theme.text} />
                                <span className="text-slate-400">CPU: <span className="text-white">12%</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HardDrive size={14} className={theme.text} />
                                <span className="text-slate-400">RAM: <span className="text-white">4.2GB</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Painel Principal de Logs */}
                        <div 
                            ref={scrollContainerRef}
                            className={`md:col-span-2 h-64 md:h-80 relative bg-black/40 rounded-lg border ${theme.border} p-4 overflow-hidden shadow-inner flex flex-col`}
                        >
                            {/* Overlay de Scanline suave */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10"></div>
                            
                            <div className="flex-1 flex flex-col justify-end space-y-1.5 z-0">
                                {logs.map((log, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        // FIX: Uso de optional chaining (log?) para evitar crash se log for undefined
                                        className={`flex items-start gap-2 text-xs sm:text-sm font-medium leading-tight ${log?.includes("OK") ? theme.accent : "text-slate-400"}`}
                                    >
                                        <span className="opacity-40 text-[10px] min-w-[50px]">
                                            [{new Date().toLocaleTimeString('pt-BR', { hour12: false })}]
                                        </span>
                                        <span>{log}</span>
                                    </motion.div>
                                ))}
                                {/* Cursor Piscante */}
                                <motion.div 
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className={`w-2.5 h-4 ${theme.bar} mt-1`}
                                />
                            </div>
                        </div>

                        {/* Painel Lateral de Status (Desktop) */}
                        <div className="hidden md:flex flex-col gap-4">
                            {/* Status Box */}
                            <div className={`flex-1 bg-black/40 rounded-lg border ${theme.border} p-4 flex flex-col`}>
                                <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                                    <span className={`text-xs font-bold ${theme.text}`}>MEMORY DUMP</span>
                                    <Zap size={12} className={theme.text} />
                                </div>
                                <div className="flex-1 font-mono text-[10px] text-slate-500 space-y-1 opacity-70">
                                    {rightPanelLogs.map((log, i) => (
                                        <div key={i}>{log}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Box */}
                            <div className={`h-24 bg-black/40 rounded-lg border ${theme.border} p-4 flex items-center justify-between`}>
                                <div>
                                    <span className="text-xs text-slate-400 block mb-1">ENCRYPTION</span>
                                    <span className={`text-lg font-bold ${theme.text} tracking-wider`}>AES-256</span>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className={`w-2 h-2 rounded-full ${theme.bar} animate-pulse`}></div>
                                        <span className="text-[10px] text-slate-500">ACTIVE</span>
                                    </div>
                                </div>
                                <ShieldCheck size={32} className={`${theme.text} opacity-50`} />
                            </div>
                        </div>

                    </div>

                    {/* Barra de Progresso Master */}
                    <div className="mt-8 relative">
                        <div className="flex justify-between items-end mb-2">
                            <span className={`text-xs font-bold uppercase tracking-widest ${theme.text} animate-pulse`}>
                                {progress < 100 ? "System Booting..." : "Boot Complete"}
                            </span>
                            <span className="text-2xl font-bold text-white font-mono">{Math.min(100, Math.round(progress))}%</span>
                        </div>
                        
                        {/* Barra */}
                        <div className="h-2 w-full bg-slate-900 rounded-sm overflow-hidden border border-white/10 relative">
                            {/* Background Striped Animado */}
                            <div className={`absolute inset-0 opacity-20 ${theme.bar}`} style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                            
                            <motion.div 
                                className={`h-full ${theme.bar} shadow-[0_0_20px_currentColor] relative`}
                                style={{ width: `${Math.min(100, progress)}%` }}
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/80 shadow-[0_0_10px_white]"></div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Rodapé */}
                    <div className="mt-4 flex justify-between text-[10px] text-slate-600 font-mono uppercase">
                        <span>Check: {isSecretMode ? "UNSECURED (HACKER MODE)" : "SECURE"}</span>
                        <span>UID: CF-2026-DEV</span>
                    </div>

                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}
