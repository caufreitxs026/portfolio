'use client';

import dynamic from 'next/dynamic';
import CertificatesHUD from './NeuralNexus/CertificatesHUD';

// Importação dinâmica para o Canvas 3D
const NeuralScene = dynamic(() => import('./NeuralNexus/Scene'), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-slate-900/20 rounded-2xl border border-slate-800">
             <span className="text-emerald-500 font-mono text-xs animate-pulse">INITIALIZING NEURAL LINK...</span>
        </div>
    )
});

interface Skill {
  id: number;
  name: string;
  category: 'hard' | 'soft';
  level: number;
}

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
}

interface Props {
  skills: Skill[];
  certificates: Certificate[];
  isSecretMode: boolean;
}

export default function CompetenceSection({ skills, certificates, isSecretMode }: Props) {
  return (
    <section className="py-24 relative w-full overflow-hidden z-20">
        {/* Background Decorativo para ambientação */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] -z-10 opacity-10 pointer-events-none ${isSecretMode ? 'bg-pink-900' : 'bg-emerald-900'}`}></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
            
            {/* Grid ajustado: h-auto permite que o grid cresça conforme os filhos, evitando colapso. */}
            <div className="grid lg:grid-cols-3 gap-8 h-auto">
                
                {/* ÁREA 3D (Neural Nexus) 
                    Definimos a altura fixa AQUI (h-[600px] mobile, lg:h-[700px] desktop).
                    Isso garante que o espaço seja reservado fisicamente.
                */}
                <div className="lg:col-span-2 h-[600px] lg:h-[700px] w-full relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/50 shadow-2xl backdrop-blur-sm group">
                    <div className="absolute top-5 left-6 z-10 pointer-events-none select-none">
                        <h2 className={`text-2xl font-bold font-mono tracking-tighter ${isSecretMode ? 'text-pink-500' : 'text-emerald-400'}`}>
                            NEURAL NEXUS
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                           <span className={`w-2 h-2 rounded-full ${isSecretMode ? 'bg-pink-500' : 'bg-emerald-500'} animate-pulse`}></span>
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest">Interactive Skill Map</p>
                        </div>
                    </div>
                    
                    {/* O Canvas 3D */}
                    <div className="absolute inset-0 cursor-move z-0">
                        <NeuralScene skills={skills} isSecretMode={isSecretMode} />
                    </div>

                    {/* Instruções de Uso */}
                    <div className="absolute bottom-4 right-6 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-10">
                        <p className="text-[10px] text-slate-500 font-mono uppercase bg-slate-900/80 px-2 py-1 rounded border border-white/5">
                            Drag to Rotate • Scroll to Zoom
                        </p>
                    </div>
                </div>

                {/* HUD DE DADOS (Certificados) 
                    Também definimos a altura fixa AQUI para alinhar com o 3D.
                    O componente CertificatesHUD usará h-full e ativará o scroll interno.
                */}
                <div className="h-[600px] lg:h-[700px] w-full">
                    <CertificatesHUD certificates={certificates} isSecretMode={isSecretMode} />
                </div>

            </div>
        </div>
    </section>
  );
}
