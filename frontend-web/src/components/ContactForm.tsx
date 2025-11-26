'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', content: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Define a URL da API (usa a variável de ambiente ou o localhost como fallback)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      // Usa a URL dinâmica aqui
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', content: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
        console.error(error);
        setStatus('error');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 shadow-xl max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Nome</label>
                <input 
                  type="text" 
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="Seu nome"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email</label>
                <input 
                  type="email" 
                  required
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="seu@email.com"
                />
            </div>
        </div>
        
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Mensagem</label>
            <textarea 
              rows={4}
              required
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
              placeholder="Como posso ajudar no seu projeto?"
            ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={status === 'sending' || status === 'success'}
          className={`w-full font-bold py-4 rounded-lg transition-all flex justify-center items-center gap-2
            ${status === 'success' 
                ? 'bg-green-600 text-white' 
                : status === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg hover:shadow-emerald-900/20'
            }
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
        >
          {status === 'sending' && 'Enviando...'}
          {status === 'idle' && <><Send size={18} /> Enviar Mensagem</>}
          {status === 'success' && <><CheckCircle size={18} /> Mensagem Enviada!</>}
          {status === 'error' && <><AlertCircle size={18} /> Erro ao Enviar</>}
        </button>
      </form>
    </motion.div>
  );
}