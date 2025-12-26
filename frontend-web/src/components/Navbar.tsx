'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Terminal, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Detecção inicial e contínua do tema
    const checkSecretMode = () => {
        if (typeof document !== 'undefined') {
          setIsSecretMode(document.body.classList.contains('secret-active'));
        }
    };
    checkSecretMode();
    
    // Observer para garantir reatividade instantânea ao tema
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            checkSecretMode();
          }
        });
    });
    
    if (typeof document !== 'undefined') {
        observer.observe(document.body, { attributes: true });
    }

    return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
    }
  }, []);

  const theme = isSecretMode ? {
    text: 'text-pink-400',
    hover: 'hover:text-pink-300',
    border: 'border-pink-500/20',
    bg: 'bg-black/80',
    mobileBg: 'bg-black/95',
    activeLang: 'text-pink-400 font-bold',
    inactiveLang: 'text-slate-600 font-normal hover:text-pink-400/70',
    separator: 'text-slate-700',
    button: 'hover:bg-pink-500/10 text-pink-400 border-pink-500/30'
  } : {
    text: 'text-emerald-400',
    hover: 'hover:text-emerald-300',
    border: 'border-emerald-500/20',
    bg: 'bg-slate-950/80',
    mobileBg: 'bg-slate-950/95',
    activeLang: 'text-emerald-400 font-bold',
    inactiveLang: 'text-slate-600 font-normal hover:text-emerald-400/70',
    separator: 'text-slate-700',
    button: 'hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  const navLinks = [
    { name: t.nav.projects, href: '#projetos' },
    { name: t.nav.experience, href: '#experiencia' },
    { name: t.nav.contact, href: '#contato' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? `${theme.bg} backdrop-blur-md shadow-lg ${theme.border}` : 'bg-transparent border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
            <div className={`p-2 rounded-lg border transition-all duration-300 ${theme.border} group-hover:scale-110 bg-white/5`}>
                <Terminal size={20} className={theme.text} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-200 group-hover:text-white transition-colors">
                Cauã<span className={theme.text}>.dev</span>
            </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium text-slate-400 transition-colors ${theme.hover}`}
            >
              {link.name}
            </Link>
          ))}

          <div className="h-4 w-[1px] bg-slate-700/50"></div>

          {/* Botão Translate Desktop (Discreto) */}
          <button
            onClick={toggleLanguage}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-xs font-mono font-bold
                ${theme.button}
            `}
          >
            <Globe size={14} />
            <span>{language === 'pt' ? 'EN' : 'PT'}</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-300 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-b ${theme.mobileBg} ${theme.border} backdrop-blur-xl overflow-hidden shadow-2xl`}
          >
            <div className="flex flex-col p-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-slate-300 hover:text-white font-medium py-3 border-b border-white/5 last:border-0"
                >
                  {link.name}
                  <ChevronRight size={16} className="text-slate-600" />
                </Link>
              ))}
              
              <div className="pt-4 flex justify-between items-center mt-2">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Language</span>
                
                {/* Seletor Mobile Minimalista */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                >
                    <Globe size={16} className={theme.text} />
                    <div className="flex items-center text-sm font-mono tracking-wider">
                        <span className={language === 'pt' ? theme.activeLang : theme.inactiveLang}>PT</span>
                        <span className={`mx-2 ${theme.separator}`}>|</span>
                        <span className={language === 'en' ? theme.activeLang : theme.inactiveLang}>EN</span>
                    </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
