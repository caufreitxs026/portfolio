'use client';

import { motion } from 'framer-motion';
import { Cpu, Award, ShieldCheck, Terminal, ExternalLink } from 'lucide-react';

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
  const hardSkills = skills.filter(s => s.category === 'hard');
  const softSkills = skills.filter(s => s.category === 'soft');

  const primaryColor = isSecretMode ? 'text-pink-500' : 'text-emerald-400';
  const barColor = isSecretMode ? 'bg-pink-600' : 'bg-emerald-600';
  const borderColor = isSecretMode ? 'border-pink-500/30' : 'border-emerald-500/30';
  const hoverBorder = isSecretMode ? 'hover:border-pink-500/60' : 'hover:border-emerald-500/60';

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        
        {/* --- COLUNA 1: SKILLS & DIAGNÓSTICO --- */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <Cpu className={primaryColor} size={32} />
            <h2 className="text-3xl font-bold text-white">System Skills</h2>
          </div>

          <div className="space-y-8">
            {/* Hard Skills (Barras de Progresso Tech) */}
            <div className={`p-6 rounded-2xl bg-slate-900/40 border ${borderColor} backdrop-blur-sm`}>
              <h3 className={`text-sm font-mono mb-6 uppercase tracking-widest ${primaryColor} border-b border-white/5 pb-2`}>
                &gt; Hard_Skills_Module
              </h3>
              <div className="space-y-5">
                {hardSkills.map((skill, i) => (
                  <div key={skill.id} className="relative">
                    <div className="flex justify-between text-sm font-bold text-slate-300 mb-1">
                      <span>{skill.name}</span>
                      <span className="font-mono text-xs opacity-60">Lv.{skill.level}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        className={`h-full ${barColor} relative`}
                      >
                         <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_10px_white]"></div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills (Tags de Atributos) */}
            <div className={`p-6 rounded-2xl bg-slate-900/40 border ${borderColor} backdrop-blur-sm`}>
               <h3 className={`text-sm font-mono mb-6 uppercase tracking-widest ${primaryColor} border-b border-white/5 pb-2`}>
                &gt; Core_Attributes
              </h3>
              <div className="flex flex-wrap gap-3">
                {softSkills.map((skill, i) => (
                  <motion.span 
                    key={skill.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-semibold cursor-default
                      bg-slate-800 text-slate-200 border border-slate-700/50 hover:border-white/20 transition-colors
                    `}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- COLUNA 2: CERTIFICADOS (DIGITAL VAULT) --- */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <Award className={primaryColor} size={32} />
            <h2 className="text-3xl font-bold text-white">Digital Vault</h2>
          </div>

          <div className="grid gap-4">
             {certificates.map((cert, index) => (
               <motion.a
                  key={cert.id}
                  href={cert.credential_url || '#'}
                  target="_blank"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    group relative block p-5 rounded-xl bg-slate-900/60 border border-slate-800 
                    transition-all duration-300 hover:bg-slate-800 ${hoverBorder}
                  `}
               >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Terminal size={14} className={isSecretMode ? 'text-pink-500' : 'text-emerald-500'} />
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wide">
                          {cert.issue_date} • {cert.issuer}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                        {cert.name}
                      </h3>
                    </div>
                    
                    <div className={`
                      p-2 rounded-full opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300
                      ${isSecretMode ? 'bg-pink-500/20 text-pink-400' : 'bg-emerald-500/20 text-emerald-400'}
                    `}>
                      <ExternalLink size={18} />
                    </div>
                  </div>

                  {/* Efeito de Scan (Linha passando) */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl pointer-events-none">
                    <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shine" />
                  </div>
               </motion.a>
             ))}
          </div>
        </div>

      </div>
    </section>
  );
}
