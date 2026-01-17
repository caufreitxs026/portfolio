'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Check, Cpu, Wifi, Shield } from 'lucide-react';

export default function SystemBoot() {
  const [isVisible, setIsVisible] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Safe Storage Access
  const getStorage = (key: string) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const setStorage = (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    } catch (e) {
      // Ignora erro
    }
  };

  useEffect(() => {
    setIsClient(true);
    const hasBooted = getStorage('portfolio_booted');
    if (hasBooted) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!isVisible || !isClient) return;

    const bootSequence = [
        { text: "Initializing kernel...", time: 0 },
        { text: "Loading next.config.js modules...", time: 200 },
        { text: "Verifying integrity of React Server Components...", time: 400 },
        { text: "[ OK ] Connection to Edge Network established.", time: 800 },
        { text: "Mounting UI components...", time: 1000 },
        { text: "Hydrating static assets...", time: 1200 },
        { text: "Analyzing viewport metrics...", time: 1400 },
        { text: "Starting animation engine (Framer Motion)...", time: 1600 },
        { text: "Checking security protocols (HTTPS/SSL)... Secure.", time: 1900 },
        { text: ">> SYSTEM READY. WELCOME USER.", time: 2200 }
    ];

    let timeouts: NodeJS.Timeout[] = [];

    bootSequence.forEach(({ text, time }) => {
        const timeout = setTimeout(() => {
            setLogs(prev => [...prev, text]);
        }, time);
        timeouts.push(timeout);
    });

    // Finalização rápida após o último log
    const finishTimeout = setTimeout(() => {
        setIsVisible(false);
        setStorage('portfolio_booted', 'true');
    }, 2800);
    timeouts.push(finishTimeout);

    return () => {
        timeouts.forEach(clearTimeout);
    };
  }, [isVisible, isClient]);

  // Auto-scroll
  useEffect(() => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!isVisible || !isClient) return null;

  return (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }} // Saída sutil e profissional, sem borrões excessivos
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0a0a0a] font-mono text-sm cursor-wait"
            >
                <div className="w-full max-w-3xl px-6">
                    
                    {/* Header Minimalista */}
                    <div className="flex justify-between items-end border-b border-white/10 pb-2 mb-4 text-xs text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} />
                            <span>Boot Sequence v3.0</span>
                        </div>
                        <span>{new Date().toISOString().split('T')[0]}</span>
                    </div>

                    {/* Área de Logs Limpa */}
                    <div 
                        ref={scrollContainerRef}
                        className="h-64 overflow-hidden relative font-mono text-slate-300 space-y-1.5"
                    >
                        {logs.map((log, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <span className="text-emerald-500 shrink-0">➜</span>
                                <span className={`${log.includes("READY") ? "text-emerald-400 font-bold" : "text-slate-300"}`}>
                                    {log}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Barra de Status Inferior */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-600">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <Cpu size={14} />
                                <span>Core: Active</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Wifi size={14} />
                                <span>Net: 1Gbps</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield size={14} />
                                <span>Secure</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="animate-pulse bg-emerald-500 w-2 h-2 rounded-full"></span>
                            <span>Processing</span>
                        </div>
                    </div>

                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}
