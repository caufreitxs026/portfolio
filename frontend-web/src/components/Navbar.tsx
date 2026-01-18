'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Terminal, ArrowRight, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloqueia scroll no mobile menu
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: t.nav.projects, href: '#projetos' },
    { name: t.nav.experience, href: '#experiencia' },
    { name: t.nav.contact, href: '#contato' },
  ];

  // Estilos baseados no tema
  const styles = theme === 'dark' ? {
    navBg: scrolled ? 'bg-slate-950/80' : 'bg-transparent',
    border: 'border-white/10',
    text: 'text-slate-300 hover:text-white',
    logo: 'text-emerald-400',
    logoBg: 'bg-white/5 border-white/10',
    button: 'border-white/10 hover:bg-white/5 text-slate-300',
    mobileBg: 'bg-slate-950',
  } : {
    navBg: scrolled ? 'bg-white/80' : 'bg-transparent',
    border: 'border-slate-200',
    text: 'text-slate-600 hover:text-slate-900',
    logo: 'text-indigo-600',
    logoBg: 'bg-slate-100 border-slate-200',
    button: 'border-slate-200 hover:bg-slate-100 text-slate-600',
    mobileBg: 'bg-white',
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b backdrop-blur-md ${styles.navBg} ${scrolled ? styles.border : 'border-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <a href="#" onClick={scrollToTop} className="group flex items-center gap-2 relative z-50">
              <div className={`p-2 rounded-lg border transition-all duration-300 group-hover:scale-110 ${styles.logoBg}`}>
                  <Terminal size={20} className={styles.logo} />
              </div>
              <span className={`font-bold text-lg tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Cauã<span className={styles.logo}>.dev</span>
              </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${styles.text}`}
              >
                {link.name}
              </Link>
            ))}

            <div className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>

            <div className="flex items-center gap-3">
              {/* Botao Idioma */}
              <button
                onClick={toggleLanguage}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-xs font-mono font-bold ${styles.button}`}
              >
                <Globe size={14} />
                <span>{language === 'pt' ? 'EN' : 'PT'}</span>
              </button>

              {/* Botao Tema */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full border transition-all duration-300 ${styles.button}`}
                title="Alternar Tema"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>

          {/* Mobile Actions (Tema + Toggle Menu) */}
          <div className="md:hidden flex items-center gap-3 relative z-50">
            {/* Botão de Tema no Mobile (Visível no Header) */}
            <button
                onClick={toggleTheme}
                className={`p-2 rounded-full border transition-all duration-300 ${styles.button}`}
                title="Alternar Tema"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Toggle do Menu */}
            <button 
              className={`p-2 focus:outline-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 backdrop-blur-sm bg-black/50"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-0 right-0 h-full w-[80%] max-w-sm z-40 ${styles.mobileBg} border-l ${styles.border} shadow-2xl pt-24 px-8 pb-8 flex flex-col`}
            >
              <div className="flex-1 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between text-lg font-bold py-3 border-b ${theme === 'dark' ? 'border-white/5 text-slate-300' : 'border-slate-100 text-slate-700'}`}
                  >
                    {link.name}
                    <ArrowRight size={16} className="opacity-50" />
                  </Link>
                ))}
              </div>

              <div className="pt-8 flex justify-between items-center">
                 <button
                    onClick={toggleLanguage}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${styles.button}`}
                  >
                    <Globe size={18} />
                    <span className="text-sm font-bold">{language === 'pt' ? 'PT-BR' : 'EN-US'}</span>
                  </button>

                  {/* Botão de Tema no Rodapé do Menu (Opcional, mas bom para consistência) */}
                  <button
                    onClick={toggleTheme}
                    className={`p-3 rounded-full border ${styles.button}`}
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
