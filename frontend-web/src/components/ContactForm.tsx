'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2, Mail, User, MessageSquare, Terminal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const checkSecretMode = () => {
      if (typeof document !== 'undefined') {
        setIsSecretMode(document.body.classList.contains('secret-active'));
      }
    };
    const interval = setInterval(checkSecretMode, 500);
    return () => clearInterval(interval);
  }, []);

  // Configuração de Tema
  const theme = isSecretMode ? {
    borderFocus: 'border-pink-500/50',
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.15)]',
    button: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500',
    icon: 'text-pink-500',
    inputBg: 'bg-slate-900/80',
    label: 'text-pink-300'
  } : {
    borderFocus: 'border-emerald-500/50',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    button: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
    icon: 'text-emerald-500',
    inputBg: 'bg-slate-900/80',
    label: 'text-emerald-300'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.content) return;

    setStatus('loading');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-acxt.onrender.com';
      
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Falha no envio');

      setStatus('success');
      setFormData({ name: '', email: '', content: '' });
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <div className={`absolute -inset-1 rounded-2xl blur-xl opacity-20 transition-colors duration-500 ${isSecretMode ? 'bg-pink-600' : 'bg-emerald-600'}`}></div>

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-slate-950/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="space-y-6 relative z-10">
          
          <div className="relative group">
            <label className={`block text-xs font-mono font-bold uppercase mb-2 ml-1 transition-colors ${focusedField === 'name' ? theme.label : 'text-slate-500'}`}>
              {t.contact.nameLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className={`transition-colors duration-300 ${focusedField === 'name' ? theme.icon : 'text-slate-600'}`} />
              </div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`
                  w-full pl-12 pr-4 py-4 rounded-xl text-slate-200 placeholder-slate-600 outline-none border transition-all duration-300
                  ${theme.inputBg} 
                  ${focusedField === 'name' ? `${theme.borderFocus} ${theme.glow} ring-1 ring-white/5` : 'border-slate-800 hover:border-slate-700'}
                `}
                placeholder={t.contact.namePlaceholder}
              />
            </div>
          </div>

          <div className="relative group">
            <label className={`block text-xs font-mono font-bold uppercase mb-2 ml-1 transition-colors ${focusedField === 'email' ? theme.label : 'text-slate-500'}`}>
              {t.contact.emailLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className={`transition-colors duration-300 ${focusedField === 'email' ? theme.icon : 'text-slate-600'}`} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`
                  w-full pl-12 pr-4 py-4 rounded-xl text-slate-200 placeholder-slate-600 outline-none border transition-all duration-300
                  ${theme.inputBg}
                  ${focusedField === 'email' ? `${theme.borderFocus} ${theme.glow} ring-1 ring-white/5` : 'border-slate-800 hover:border-slate-700'}
                `}
                placeholder={t.contact.emailPlaceholder}
              />
            </div>
          </div>

          <div className="relative group">
            <label className={`block text-xs font-mono font-bold uppercase mb-2 ml-1 transition-colors ${focusedField === 'content' ? theme.label : 'text-slate-500'}`}>
              {t.contact.msgLabel}
            </label>
            <div className="relative">
              <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                <MessageSquare size={18} className={`transition-colors duration-300 ${focusedField === 'content' ? theme.icon : 'text-slate-600'}`} />
              </div>
              <textarea
                name="content"
                required
                rows={4}
                value={formData.content}
                onChange={handleChange}
                onFocus={() => setFocusedField('content')}
                onBlur={() => setFocusedField(null)}
                className={`
                  w-full pl-12 pr-4 py-4 rounded-xl text-slate-200 placeholder-slate-600 outline-none border transition-all duration-300 resize-none
                  ${theme.inputBg}
                  ${focusedField === 'content' ? `${theme.borderFocus} ${theme.glow} ring-1 ring-white/5` : 'border-slate-800 hover:border-slate-700'}
                `}
                placeholder={t.contact.msgPlaceholder}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={status === 'loading' || status === 'success'}
            className={`
              w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group
              ${status === 'success' ? 'bg-green-600' : status === 'error' ? 'bg-red-600' : theme.button}
              disabled:opacity-80 disabled:cursor-not-allowed
            `}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>

            <AnimatePresence mode="wait">
              {status === 'loading' ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 size={20} className="animate-spin" />
                  <span>{t.contact.btnSending}</span>
                </motion.div>
              ) : status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  <span>{t.contact.btnSuccess}</span>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <AlertCircle size={20} />
                  <span>{t.contact.btnError}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 relative z-10"
                >
                  <span>{t.contact.btnSend}</span>
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center text-[10px] text-slate-600 font-mono">
           <div className="flex items-center gap-1">
             <Terminal size={12} />
             <span>{t.contact.secure}</span>
           </div>
           <span>v.3.0.1</span>
        </div>

      </motion.form>
    </div>
  );
}
