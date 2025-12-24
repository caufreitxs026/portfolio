'use client';

import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [isSecretMode, setIsSecretMode] = useState(false);

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

  const accentColor = isSecretMode ? 'text-pink-500' : 'text-emerald-400';
  const buttonPrimary = isSecretMode 
    ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-500/20' 
    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20';
  
  const buttonSecondary = isSecretMode
    ? 'border-pink-500/30 hover:bg-pink-500/10 text-pink-400'
    : 'border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400';

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute top-20 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 opacity-20 pointer-events-none ${isSecretMode ? 'bg-pink-900' : 'bg-emerald-900'}`}></div>
      <div className="absolute top-40 left-0 w-[300px] h-[300px] rounded-full bg-blue-900/20 blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Lado Esquerdo: Texto */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium mb-6 ${accentColor}`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSecretMode ? 'bg-pink-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSecretMode ? 'bg-pink-500' : 'bg-emerald-500'}`}></span>
            </span>
            Open to Work
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-slate-100 leading-tight mb-6">
            Olá, sou <span className={accentColor}>Cauã</span>.
          </h1>
          
          <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
            Desenvolvedor Full Stack e Analista de Dados focado em construir aplicações performáticas e dashboards estratégicos que geram valor real para o negócio.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link 
              href="#projetos"
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${buttonPrimary}`}
            >
              Ver Projetos <ArrowRight size={18} />
            </Link>
            
            <a 
              href="/curriculo.pdf" 
              target="_blank"
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border transition-all ${buttonSecondary}`}
            >
              Currículo <Download size={18} />
            </a>
          </div>
        </motion.div>

        {/* Lado Direito: Code Snippet (Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative group"
        >
          <div className={`absolute -inset-1 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${isSecretMode ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'bg-gradient-to-r from-emerald-600 to-cyan-600'}`}></div>
          
          <div className="relative rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Barra de Título do Editor */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Terminal size={12} />
                profile.py
              </div>
            </div>

            {/* Conteúdo do Código */}
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed">
                <code className="text-slate-300">
                  <span className="text-purple-400">from</span> developer <span className="text-purple-400">import</span> Caua<br/><br/>
                  <span className="text-slate-500"># Inicializando perfil...</span><br/>
                  <span className="text-purple-400">class</span> <span className="text-yellow-300">Profile</span>:<br/>
                  &nbsp;&nbsp;stack = [<span className="text-green-400">'Python'</span>, <span className="text-green-400">'Django'</span>, <span className="text-green-400">'React'</span>, <span className="text-green-400">'Node.js'</span>, <span className="text-green-400">'Java'</span>, <span className="text-green-400">'SQL'</span>]<br/>
                  &nbsp;&nbsp;current_role = <span className="text-green-400">'Analista de Suporte Computacional'</span> | <span className="text-green-400">'Desenvolvedor Pleno'</span> <br/>
                  &nbsp;&nbsp;location = <span className="text-green-400">'Feira de Santana, BA'</span><br/><br/>
                  <span className="text-blue-400">&gt;</span> <span className="text-purple-400">print</span>(Profile.stack)<br/>
                  <span className="text-slate-400">['Python', 'Django', 'React', 'Node.js', 'Java', 'SQL']</span>
                </code>
              </pre>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
