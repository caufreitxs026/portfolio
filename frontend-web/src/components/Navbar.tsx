'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);
  
  // Hook de Idioma
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Check inicial do modo secreto
    if (typeof document !== 'undefined') {
        setIsSecretMode(document.body.classList.contains('secret-active'));
    }

    // Observer para mudança dinâmica de tema (igual aos outros componentes)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            setIsSecretMode(document.body.classList.contains('secret-active'));
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
    button: 'hover:bg-pink-500/10 text-pink-400 border-pink-500/30'
  } : {
    text: 'text-emerald-400',
    hover: 'hover:text-emerald-300',
    border: 'border-emerald-500/20',
    bg: 'bg-slate-950/80',
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
        
        {/* Logo / Brand */}
        <Link href="/" className="group flex items-center gap-2">
            <div className={`p-2 rounded-lg border transition-all duration-300 ${theme.border} group-hover:scale-110`}>
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

          {/* Separador */}
          <div className="h-4 w-[1px] bg-slate-700/50"></div>

          {/* Translate Button */}
          <button
            onClick={toggleLanguage}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-xs font-mono font-bold
                ${theme.button}
            `}
            title="Switch Language"
          >
            <Globe size={14} />
            <span>{language === 'pt' ? 'EN' : 'PT'}</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-300" onClick={() => setIsOpen(!isOpen)}>
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
            className={`md:hidden border-b ${theme.bg} ${theme.border} backdrop-blur-xl overflow-hidden`}
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white font-medium py-2"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-[1px] w-full bg-slate-800 my-2"></div>
              
              <button
                onClick={() => {
                    toggleLanguage();
                    setIsOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg border ${theme.button}`}
              >
                <Globe size={16} />
                Mudar para {language === 'pt' ? 'Inglês' : 'Português'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
