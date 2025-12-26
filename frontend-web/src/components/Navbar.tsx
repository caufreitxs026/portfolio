'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Terminal, ArrowRight, LayoutGrid, User, Mail } from 'lucide-react';
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
    
    const checkSecretMode = () => {
        if (typeof document !== 'undefined') {
          setIsSecretMode(document.body.classList.contains('secret-active'));
        }
    };
    checkSecretMode();
    
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

  // Bloqueia o scroll do body quando o menu está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const theme = isSecretMode ? {
    text: 'text-pink-400',
    hover: 'hover:text-pink-300',
    border: 'border-pink-500/20',
    bg: 'bg-black/80',
    activeLang: 'text-pink-400 font-bold',
    inactiveLang: 'text-slate-600 font-normal hover:text-pink-400/70',
    separator: 'text-slate-700',
    button: 'hover:bg-pink-500/10 text-pink-400 border-pink-500/30',
    menuOverlay: 'bg-black/60',
    menuPanel: 'bg-black',
    menuBorder: 'border-pink-500/20'
  } : {
    text: 'text-emerald-400',
    hover: 'hover:text-emerald-300',
    border: 'border-emerald-500/20',
    bg: 'bg-slate-950/80',
    activeLang: 'text-emerald-400 font-bold',
    inactiveLang: 'text-slate-600 font-normal hover:text-emerald-400/70',
    separator: 'text-slate-700',
    button: 'hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    menuOverlay: 'bg-slate-950/60',
    menuPanel: 'bg-slate-950',
    menuBorder: 'border-emerald-500/20'
  };

  const navLinks = [
    { name: t.nav.projects, href: '#projetos', icon: <LayoutGrid size={20} /> },
    { name: t.nav.experience, href: '#experiencia', icon: <User size={20} /> },
    { name: t.nav.contact, href: '#contato', icon: <Mail size={20} /> },
  ];

  // Variantes para animação do menu
  const menuVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({ 
      x: 0, 
      opacity: 1, 
      transition: { delay: i * 0.1 } 
    })
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? `${theme.bg} backdrop-blur-md shadow-lg ${theme.border}` : 'bg-transparent border-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 relative z-50">
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

          {/* Mobile Toggle Button */}
          <button 
            className="md:hidden text-slate-200 p-2 relative z-50 focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
               {isOpen ? (
                 <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={28} />
                 </motion.div>
               ) : (
                 <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={28} />
                 </motion.div>
               )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Sidebar Menu (Off-canvas) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className={`fixed inset-0 z-40 backdrop-blur-sm ${theme.menuOverlay}`}
            />

            {/* Side Panel */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-40 ${theme.menuPanel} border-l ${theme.menuBorder} shadow-2xl pt-24 px-8 pb-8 flex flex-col`}
            >
              
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Navegação</div>
                
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    custom={i}
                    variants={linkVariants}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between text-2xl font-bold text-slate-300 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${theme.text}`}>
                            {link.icon}
                        </span>
                        {link.name}
                      </div>
                      <ArrowRight className={`opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${theme.text}`} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Footer do Menu */}
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="pt-8 border-t border-white/10"
              >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Idioma</span>
                    
                    {/* Seletor Mobile Minimalista */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 active:scale-95 transition-transform"
                    >
                        <Globe size={18} className={theme.text} />
                        <div className="flex items-center text-sm font-mono tracking-wider">
                            <span className={language === 'pt' ? theme.activeLang : theme.inactiveLang}>PT</span>
                            <span className={`mx-2 ${theme.separator}`}>|</span>
                            <span className={language === 'en' ? theme.activeLang : theme.inactiveLang}>EN</span>
                        </div>
                    </button>
                </div>
              </motion.div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
