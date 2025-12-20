'use client';

import dynamic from 'next/dynamic';
import CertificatesHUD from './NeuralNexus/CertificatesHUD';

// Importação dinâmica para o Canvas 3D (essencial para Next.js não quebrar no server-side)
const NeuralScene = dynamic(() => import('./NeuralNexus/Scene'), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center text-emerald-500 font-mono animate-pulse">
            INITIALIZING NEURAL LINK...
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
    <section className="py-20 relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            
            <div className="grid lg:grid-cols-3 gap-8 h-[700px] lg:h-[600px]">
                
                {/* ÁREA 3D (Ocupa 2/3 da tela em desktop) */}
                <div className="lg:col-span-2 relative h-[400px] lg:h-full w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/50 shadow-2xl">
                    <div className="absolute top-4 left-6 z-10 pointer-events-none">
                        <h2 className={`text-2xl font-bold font-mono tracking-tighter ${isSecretMode ? 'text-pink-500' : 'text-emerald-400'}`}>
                            NEURAL NEXUS
                        </h2>
                        <p className="text-xs text-slate-500">INTERACTIVE SKILL MAP</p>
                    </div>
                    
                    {/* O Canvas 3D */}
                    <div className="absolute inset-0 cursor-move">
                        <NeuralScene skills={skills} isSecretMode={isSecretMode} />
                    </div>

                    {/* Instrução */}
                    <div className="absolute bottom-4 right-6 pointer-events-none">
                        <p className="text-[10px] text-slate-600 font-mono uppercase">
                            Drag to Rotate • Scroll to Zoom
                        </p>
                    </div>
                </div>

                {/* HUD DE DADOS (CERTIFICADOS) */}
                <div className="h-full">
                    <CertificatesHUD certificates={certificates} isSecretMode={isSecretMode} />
                </div>

            </div>
        </div>
    </section>
  );
}
