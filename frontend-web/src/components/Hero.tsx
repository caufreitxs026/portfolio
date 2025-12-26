'use client';

import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Download, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const { t, language } = useLanguage(); // Adicionado language aqui

  useEffect(() => {
    setMounted(true);
    const checkSecretMode = () => {
      if (typeof document !== 'undefined') {
        setIsSecretMode(document.body.classList.contains('secret-active'));
      }
    };
    const interval = setInterval(checkSecretMode, 500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  // Lógica para alternar o arquivo de currículo
  const resumeUrl = language === 'pt' ? '/curriculo.pdf' : '/curriculo_en.pdf';

  const theme = isSecretMode ? {
    textGradient: 'bg-gradient-to-r from-pink-300 via-pink-100 to-white',
    blob: 'bg-pink-600',
    button: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-pink-500/25',
    bgGradient: 'from-pink-500/20 via-purple-500/20 to-transparent'
  } : {
    textGradient: 'bg-gradient-to-r from-emerald-300 via-emerald-100 to-white',
    blob: 'bg-emerald-600',
    button: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25',
    bgGradient: 'from-emerald-500/20 via-cyan-500/20 to-transparent'
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-transparent">
      
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20"></div>
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 -z-10 animate-pulse-slow ${theme.blob}`}></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[100px] -z-10 opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* COLUNA ESQUERDA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start text-left z-10"
        >
          {/* Badge */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-md text-xs sm:text-sm font-medium mb-8 group cursor-default hover:border-slate-600 transition-colors shadow-lg shadow-black/20`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSecretMode ? 'bg-pink-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSecretMode ? 'bg-pink-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-slate-300">{t.hero.openToWork}</span>
            <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            {t.hero.greeting} <br className="hidden lg:block" />
            <span className={`bg-clip-text text-transparent ${theme.textGradient}`}>
              Cauã Freitas.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-xl leading-relaxed font-light">
            {t.hero.description}
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-row gap-3 w-full justify-start">
            <Link 
              href="#projetos"
              className={`
                group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden
                ${theme.button}
              `}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>
              <span className="relative whitespace-nowrap">{t.hero.btnProject}</span>
              <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a 
              href={resumeUrl} 
              target="_blank"
              className={`
                flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-300 text-sm sm:text-base border border-slate-700/50 hover:border-slate-500 hover:bg-slate-800/50 hover:text-white transition-all duration-300 backdrop-blur-sm
              `}
            >
              <span className="whitespace-nowrap">{t.hero.btnCv}</span>
              <Download size={16} />
            </a>
          </div>
        </motion.div>

        {/* COLUNA DIREITA (Visual Code) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative w-full max-w-[calc(100vw-2rem)] lg:max-w-none mx-auto mt-8 lg:mt-0"
        >
          <div className={`absolute -inset-0.5 bg-gradient-to-tr ${theme.bgGradient} rounded-2xl blur-xl opacity-40 animate-pulse-slow`}></div>
          
          <motion.div 
            className="relative rounded-xl bg-[#0d1117]/95 border border-slate-800/80 shadow-2xl backdrop-blur-2xl overflow-hidden ring-1 ring-white/5"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50 bg-[#0d1117]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-mono opacity-80">
                <Terminal size={12} />
                <span>developer_profile.py</span>
              </div>
              <div className="w-10"></div>
            </div>

            <div className="p-5 sm:p-6 overflow-x-auto custom-scrollbar">
              <div className="font-mono text-xs sm:text-sm leading-7">
                <div className="flex">
                  <span className="text-slate-700 w-6 select-none text-right mr-4">1</span>
                  <div className="whitespace-nowrap">
                    <span className="text-purple-400">from</span> <span className="text-slate-300">universe</span> <span className="text-purple-400">import</span> <span className="text-yellow-200">Caua</span>
                  </div>
                </div>

                <div className="flex"><span className="text-slate-700 w-6 select-none text-right mr-4">2</span></div>

                <div className="flex">
                  <span className="text-slate-700 w-6 select-none text-right mr-4">3</span>
                  <div className="whitespace-nowrap">
                    <span className="text-slate-500 italic">{t.hero.codeComment}</span>
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-700 w-6 select-none text-right mr-4">4</span>
                  <div className="whitespace-nowrap">
                    <span className="text-purple-400">class</span> <span className="text-yellow-400">Profile</span>:
                  </div>
                </div>

                 <div className="flex">
                  <span className="text-slate-700 w-6 select-none text-right mr-4">5</span>
                  <div className="whitespace-nowrap pl-4">
                     <span className="text-blue-300">stack</span> = [
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-700 w-6 select-none text-right mr-4">6</span>
                  <div className="whitespace-nowrap pl-8">
                    <span className="text-emerald-400">'Python'</span>, <span className="text-emerald-400">'Django'</span>, <span className="text-emerald-400">'React'</span>,
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-700 w-6 select-none text-right mr-4">7</span>
                  <div className="whitespace-nowrap pl-8">
                    <span className="text-emerald-400">'Node.js'</span>, <span className="text-emerald-400">'Java'</span>, <span className="text-emerald-400">'SQL'</span>
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-700 w-6 select-none text-right mr-4">8</span>
                  <div className="whitespace-nowrap pl-4">
                     ]
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-700 w-6 select-none text-right mr-4">9</span>
                  <div className="whitespace-nowrap pl-4">
                    <span className="text-blue-300">role</span> = <span className="text-orange-300">'Full Stack Developer e Analista de Suporte Computacional'</span>
                  </div>
                </div>

                 <div className="flex">
                  <span className="text-slate-700 w-6 select-none text-right mr-4">10</span>
                  <div className="whitespace-nowrap pl-4">
                    <span className="text-blue-300">location</span> = <span className="text-orange-300">'{t.hero.codeLocation}'</span>
                  </div>
                </div>

                <div className="flex mt-2">
                  <span className="text-slate-700 w-6 select-none text-right mr-4">11</span>
                  <div className="whitespace-nowrap">
                     <span className="text-purple-400">print</span>(<span className="text-blue-300">Profile</span>.stack)
                  </div>
                </div>

                <div className="flex mt-2 border-t border-slate-800/50 pt-2">
                  <span className="text-slate-700 w-6 select-none text-right mr-4"></span>
                  <div className="whitespace-nowrap flex items-center gap-2">
                     <span className="text-emerald-500">➜</span>
                     <span className="text-slate-400 text-[10px] sm:text-xs">['Python', 'Django', 'React', 'Node.js', 'Java', 'SQL']</span>
                     <span className="w-2 h-4 bg-slate-500 animate-pulse"></span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
