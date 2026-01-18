'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div 
      className={`
        min-h-screen transition-colors duration-700 ease-in-out relative overflow-hidden
        ${theme === 'dark' 
          ? 'bg-[#020617] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200' 
          : 'bg-[#f8fafc] text-slate-800 selection:bg-indigo-500/20 selection:text-indigo-600'}
      `}
    >
      {/* --- GALÁXIA ESCURA (AURORA) --- */}
      <div 
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
      >
         <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,rgba(0,0,0,0)_70%)] blur-[100px]"></div>
         <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.06)_0%,rgba(0,0,0,0)_70%)] blur-[120px]"></div>
         {/* Vinheta Escura */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.5)_100%)]"></div>
      </div>

      {/* --- GALÁXIA CLARA (NEBULA) --- */}
      <div 
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}
      >
         {/* Luz suave superior */}
         <div className="absolute -top-[10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,rgba(255,255,255,0)_70%)] blur-[80px]"></div>
         {/* Luz suave inferior */}
         <div className="absolute -bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,rgba(255,255,255,0)_70%)] blur-[90px]"></div>
         {/* Padrão de Grid Sutil para dar textura técnica */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Conteúdo da Página */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
