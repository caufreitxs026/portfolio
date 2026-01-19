'use client';

import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Download, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  const { t, language } = useLanguage();
  const { theme } = useTheme();

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

  const resumeUrl = language === 'pt' ? '/curriculo.pdf' : '/curriculo_en.pdf';

  // Configuração de Estilos por Tema
  const styles = theme === 'dark' ? {
    badge: 'bg-slate-900/80 border-slate-700/50 text-slate-300 hover:border-slate-600',
    titleMain: 'text-white',
    titleAccent: isSecretMode ? 'bg-gradient-to-r from-pink-300 via-pink-100 to-white' : 'bg-gradient-to-r from-emerald-300 via-emerald-100 to-white',
    desc: 'text-slate-400',
    btnPrimary: isSecretMode ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-pink-500/25' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25',
    btnSecondary: 'text-slate-300 border-slate-700/50 hover:border-slate-500 hover:bg-slate-800/50 hover:text-white',
    codeWindow: {
      bg: 'bg-[#0d1117]/95 border-slate-800/80',
      text: 'text-slate-300',
      comment: 'text-slate-500',
      keyword: 'text-purple-400',
      string: 'text-emerald-400',
      variable: 'text-yellow-200'
    }
  } : {
    // TEMA CLARO
    badge: 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-400 shadow-sm',
    titleMain: 'text-slate-900',
    titleAccent: 'bg-gradient-to-r from-indigo-600 to-violet-600',
    desc: 'text-slate-600 font-medium',
    btnPrimary: 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-xl shadow-slate-900/20',
    btnSecondary: 'text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 bg-white/50',
    codeWindow: {
      bg: 'bg-white/90 border-slate-200 shadow-xl',
      text: 'text-slate-700',
      comment: 'text-slate-400',
      keyword: 'text-purple-600',
      string: 'text-emerald-600',
      variable: 'text-orange-600'
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-transparent">
      
      {theme === 'dark' && (
        <>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20"></div>
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 -z-10 animate-pulse-slow ${isSecretMode ? 'bg-pink-600' : 'bg-emerald-600'}`}></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[100px] -z-10 opacity-30"></div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* COLUNA ESQUERDA - Alinhamento forçado para a esquerda */}
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
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md text-xs sm:text-sm font-medium mb-8 group cursor-default transition-all ${styles.badge}`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSecretMode ? 'bg-pink-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSecretMode ? 'bg-pink-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span>{t.hero.openToWork}</span>
            <ChevronRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 ${styles.titleMain}`}>
            {t.hero.greeting} <br className="hidden lg:block" />
            <span className={`bg-clip-text text-transparent ${styles.titleAccent}`}>
              Cauã Freitas.
            </span>
          </h1>
          
          <p className={`text-base sm:text-lg mb-10 max-w-xl leading-relaxed ${styles.desc}`}>
            {t.hero.description}
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-row gap-3 w-full justify-start">
            <Link 
              href="#projetos"
              className={`
                group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden
                ${styles.btnPrimary}
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
                flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base border transition-all duration-300 backdrop-blur-sm
                ${styles.btnSecondary}
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
          {theme === 'dark' && <div className={`absolute -inset-0.5 bg-gradient-to-tr ${isSecretMode ? 'from-pink-500/20 via-purple-500/20' : 'from-emerald-500/20 via-cyan-500/20'} to-transparent rounded-2xl blur-xl opacity-40 animate-pulse-slow`}></div>}
          
          <motion.div 
            className={`relative rounded-xl border shadow-2xl backdrop-blur-2xl overflow-hidden ring-1 ring-white/5 ${styles.codeWindow.bg}`}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <div className={`flex items-center justify-between px-4 py-3 border-b ${theme === 'dark' ? 'border-slate-800/50 bg-[#0d1117]' : 'border-slate-200 bg-slate-50'}`}>
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
                {/* Linhas de código atualizadas com novas infos e cores corrigidas */}
                <div className="flex">
                  <span className="text-slate-500 w-6 select-none text-right mr-4">1</span>
                  <div className="whitespace-nowrap">
                    <span className={styles.codeWindow.keyword}>from</span> <span className={styles.codeWindow.text}>universe</span> <span className={styles.codeWindow.keyword}>import</span> <span className={styles.codeWindow.variable}>Caua</span>
                  </div>
                </div>

                <div className="flex"><span className="text-slate-500 w-6 select-none text-right mr-4">2</span></div>

                <div className="flex">
                  <span className="text-slate-500 w-6 select-none text-right mr-4">3</span>
                  <div className="whitespace-nowrap">
                    <span className={`${styles.codeWindow.comment} italic`}>{t.hero.codeComment}</span>
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-500 w-6 select-none text-right mr-4">4</span>
                  <div className="whitespace-nowrap">
                    <span className={styles.codeWindow.keyword}>class</span> <span className="text-yellow-500">Profile</span>:
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-500 w-6 select-none text-right mr-4">5</span>
                  <div className="whitespace-nowrap pl-4">
                     <span className="text-blue-500">stack</span> = [
                  </div>
                </div>

                {/* Stacks Atualizadas */}
                <div className="flex">
                  <span className="text-slate-500 w-6 select-none text-right mr-4">6</span>
                  <div className="whitespace-nowrap pl-8">
                    <span className={styles.codeWindow.string}>'Python'</span>, <span className={styles.codeWindow.string}>'Django'</span>, <span className={styles.codeWindow.string}>'React'</span>, <span className={styles.codeWindow.string}>'Vue.js'</span>,
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-500 w-6 select-none text-right mr-4">7</span>
                  <div className="whitespace-nowrap pl-8">
                    <span className={styles.codeWindow.string}>'Node.js'</span>, <span className={styles.codeWindow.string}>'Java'</span>, <span className={styles.codeWindow.string}>'SQL'</span>,
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-500 w-6 select-none text-right mr-4">8</span>
                  <div className="whitespace-nowrap pl-8">
                    <span className={styles.codeWindow.string}>'Docker'</span>, <span className={styles.codeWindow.string}>'SaaS'</span>
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-500 w-6 select-none text-right mr-4">9</span>
                  <div className="whitespace-nowrap pl-4">
                     ]
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-500 w-6 select-none text-right mr-4">10</span>
                  <div className="whitespace-nowrap pl-4">
                    <span className="text-blue-500">role</span> = <span className="text-orange-500">'{t.hero.codeRole}'</span>
                  </div>
                </div>

                <div className="flex">
                  <span className="text-slate-500 w-6 select-none text-right mr-4">11</span>
                  <div className="whitespace-nowrap pl-4">
                    <span className="text-blue-500">location</span> = <span className="text-orange-500">'{t.hero.codeLocation}'</span>
                  </div>
                </div>

                <div className="flex">
                   <span className="text-slate-500 w-6 select-none text-right mr-4">12</span>
                   <div className="whitespace-nowrap pl-4">
                     <span className="text-blue-500">availability</span> = <span className="text-orange-500">'{t.hero.codeAvailability}'</span>
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
