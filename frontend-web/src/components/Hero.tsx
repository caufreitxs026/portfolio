'use client';

import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 min-h-screen flex items-center relative overflow-hidden">
      {/* Fundo sutil igual ao preview */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-950 to-slate-950 -z-10"></div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
        
        {/* Lado Esquerdo: Texto de Apresentação */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-emerald-900 bg-emerald-400 rounded-full">
            OPEN TO WORK
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Olá, sou <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Cauã.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-lg leading-relaxed">
            Desenvolvedor Full Stack focado em resolver problemas reais. Especialista em transformar dados brutos em inteligência com Python e criar interfaces modernas com React.
          </p>
          <div className="flex gap-4">
            <a href="#projetos" className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-lg shadow-emerald-900/20 flex items-center gap-2">
              Ver Projetos 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </a>
            <a href="/curriculo.pdf" target="_blank" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition flex items-center gap-2 border border-slate-700 hover:border-emerald-500/50">
              <FileText size={20} />
              Baixar CV
            </a>
          </div>
        </motion.div>
        
        {/* Lado Direito: Terminal (Igual ao Preview.html) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-slate-950 rounded-xl border border-slate-800 p-6 shadow-2xl font-mono text-sm relative overflow-hidden group hover:border-emerald-500/50 transition duration-500"
        >
          {/* Botões da Janela */}
          <div className="flex gap-2 mb-6 border-b border-slate-900 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Código estático igual ao preview */}
          <div className="text-slate-400 space-y-2">
              <p><span className="text-purple-400">from</span> developer <span className="text-purple-400">import</span> Caua</p>
              <p className="text-slate-600"># Inicializando perfil...</p>
              <p><span className="text-blue-400">class</span> <span className="text-yellow-300">Profile</span>:</p>
              <p className="pl-4">stack = [<span className="text-green-400">'Python'</span>, <span className="text-green-400">'FastAPI'</span>, <span className="text-green-400">'React'</span>, <span className="text-green-400">'SQL'</span>]</p>
              <p className="pl-4">current_role = <span className="text-green-400">'Analista de Suporte Computacional'</span></p>
              <p className="pl-4">location = <span className="text-green-400">'Feira de Santana, BA'</span></p>
              <br/>
              <p>{'>'} print(Profile.stack)</p>
              <p className="text-emerald-400">['Python', 'FastAPI', 'React', 'SQL']<span className="animate-pulse inline-block w-2 h-4 bg-emerald-500 ml-1 align-middle"></span></p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}