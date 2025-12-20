'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Cpu, Award, Terminal, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

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

// Componente de Cartão Holográfico (Efeito Mouse Glow)
function HolographicCard({ children, className = "", isSecretMode }: { children: React.ReactNode, className?: string, isSecretMode: boolean }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const glowColor = isSecretMode ? 'rgba(236, 72, 153, 0.15)' : 'rgba(16, 185, 129, 0.15)'; // Pink vs Emerald

  return (
    <div
      className={`group relative border border-white/10 overflow-hidden rounded-xl bg-slate-900/40 backdrop-blur-md ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

export default function CompetenceSection({ skills, certificates, isSecretMode }: Props) {
  const [showAllCerts, setShowAllCerts] = useState(false);
  const hardSkills = skills.filter(s => s.category === 'hard');
  const softSkills = skills.filter(s => s.category === 'soft');

  // Limite inicial de certificados
  const INITIAL_CERT_LIMIT = 4;
  const visibleCertificates = showAllCerts ? certificates : certificates.slice(0, INITIAL_CERT_LIMIT);

  const primaryColor = isSecretMode ? 'text-pink-500' : 'text-emerald-400';
  const barColor = isSecretMode ? 'bg-pink-600' : 'bg-emerald-600';
  const buttonBg = isSecretMode ? 'bg-pink-600 hover:bg-pink-500' : 'bg-emerald-600 hover:bg-emerald-500';

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decorativo Sutil */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 opacity-20 pointer-events-none ${isSecretMode ? 'bg-pink-900' : 'bg-emerald-900'}`}></div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        
        {/* --- COLUNA 1: SKILLS (SISTEMA) --- */}
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <div className={`p-3 rounded-lg ${isSecretMode ? 'bg-pink-500/10' : 'bg-emerald-500/10'}`}>
              <Cpu className={primaryColor} size={28} />
            </div>
            <h2 className="text-3xl font-bold text-white">System Skills</h2>
          </motion.div>

          <div className="space-y-8">
            {/* Hard Skills */}
            <HolographicCard isSecretMode={isSecretMode} className="p-6">
              <h3 className={`text-xs font-mono mb-6 uppercase tracking-widest ${primaryColor} border-b border-white/10 pb-2 flex justify-between items-center`}>
                <span>&gt; Hard_Skills_Module</span>
                <span className="text-slate-500">v.2.0</span>
              </h3>
              <div className="space-y-5">
                {hardSkills.map((skill, i) => (
                  <div key={skill.id} className="relative group/bar">
                    <div className="flex justify-between text-sm font-bold text-slate-300 mb-1.5">
                      <span className="group-hover/bar:text-white transition-colors">{skill.name}</span>
                      <span className="font-mono text-xs opacity-50 group-hover/bar:opacity-100 transition-opacity">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.1, ease: "circOut" }}
                        className={`h-full ${barColor} relative shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                      >
                         <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/80"></div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </HolographicCard>

            {/* Soft Skills */}
            <HolographicCard isSecretMode={isSecretMode} className="p-6">
               <h3 className={`text-xs font-mono mb-6 uppercase tracking-widest ${primaryColor} border-b border-white/10 pb-2`}>
                &gt; Core_Attributes
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {softSkills.map((skill, i) => (
                  <motion.span 
                    key={skill.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`
                      px-3 py-1.5 rounded text-xs font-bold cursor-default border transition-all
                      ${isSecretMode 
                        ? 'bg-pink-500/10 text-pink-200 border-pink-500/20 hover:border-pink-500/50' 
                        : 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20 hover:border-emerald-500/50'}
                    `}
                  >
                    #{skill.name.replace(/\s+/g, '_').toLowerCase()}
                  </motion.span>
                ))}
              </div>
            </HolographicCard>
          </div>
        </div>

        {/* --- COLUNA 2: CERTIFICADOS (VAULT) --- */}
        <div className="flex flex-col h-full">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <div className={`p-3 rounded-lg ${isSecretMode ? 'bg-pink-500/10' : 'bg-emerald-500/10'}`}>
              <Award className={primaryColor} size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">Digital Vault</h2>
              <p className="text-slate-500 text-xs mt-1 font-mono uppercase tracking-wide">
                Total de Credenciais: <span className="text-white">{certificates.length}</span>
              </p>
            </div>
          </motion.div>

          <div className="space-y-3 relative flex-1">
             <AnimatePresence initial={false}>
               {visibleCertificates.map((cert, index) => (
                 <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                 >
                   <HolographicCard isSecretMode={isSecretMode} className="p-5 hover:border-white/20 transition-colors">
                      <a href={cert.credential_url || '#'} target="_blank" className="flex items-start justify-between group/link">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Terminal size={12} className={isSecretMode ? 'text-pink-500' : 'text-emerald-500'} />
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                              {cert.issuer} • {new Date(cert.issue_date).getFullYear()}
                            </span>
                          </div>
                          <h3 className="text-sm md:text-base font-bold text-slate-200 group-hover/link:text-white transition-colors leading-tight">
                            {cert.name}
                          </h3>
                        </div>
                        
                        <div className={`
                          p-2 rounded-full opacity-0 -translate-x-4 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300
                          ${isSecretMode ? 'bg-pink-500/20 text-pink-400' : 'bg-emerald-500/20 text-emerald-400'}
                        `}>
                          <ExternalLink size={16} />
                        </div>
                      </a>
                   </HolographicCard>
                 </motion.div>
               ))}
             </AnimatePresence>
            
            {/* Máscara de Fade (só aparece se tiver mais itens e estiver fechado) */}
            {!showAllCerts && certificates.length > INITIAL_CERT_LIMIT && (
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />
            )}
          </div>

          {/* Botão Ver Mais/Menos */}
          {certificates.length > INITIAL_CERT_LIMIT && (
            <motion.button
              onClick={() => setShowAllCerts(!showAllCerts)}
              className={`
                mt-6 w-full py-3 rounded-lg text-sm font-bold text-white shadow-lg transition-all
                flex items-center justify-center gap-2 z-20 relative
                ${buttonBg}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showAllCerts ? (
                <> <ChevronUp size={16} /> Recolher Dados </>
              ) : (
                <> <ChevronDown size={16} /> Carregar Mais (+{certificates.length - INITIAL_CERT_LIMIT}) </>
              )}
            </motion.button>
          )}
        </div>

      </div>
    </section>
  );
}
