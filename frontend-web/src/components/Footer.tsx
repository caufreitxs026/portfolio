'use client';

import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Lado Esquerdo: Marca e Copyright */}
        <div className="text-center md:text-left">
          <span className="font-mono text-xl font-bold text-emerald-400">
            &lt;Cauã.Dev /&gt;
          </span>
          <p className="text-slate-500 text-sm mt-2">
            &copy; {new Date().getFullYear()} Cauã Freitas. <br className="md:hidden"/>
            Ciência da Computação & Dados.
          </p>
        </div>

        {/* Lado Direito: Redes Sociais */}
        <div className="flex gap-6">
          <a 
            href="https://github.com/caufreitxs026" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-emerald-400 transition transform hover:scale-110"
            title="GitHub"
          >
            <Github size={24} />
          </a>
          <a 
            href="https://linkedin.com/in/cauafreitas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-400 transition transform hover:scale-110"
            title="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
          <a 
            href="mailto:cauafreitas026@gmail.com" 
            className="text-slate-400 hover:text-red-400 transition transform hover:scale-110"
            title="Email"
          >
            <Mail size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
