"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, ShieldCheck, FolderGit2, Code2, GraduationCap, Briefcase, ChevronRight, Activity } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 relative overflow-hidden">

            {/* Efeitos de Fundo Ambientes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-6xl mx-auto space-y-10 relative z-10">

                {/* Header do Admin */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-inner overflow-hidden group">
                            <div className="absolute inset-0 bg-indigo-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <ShieldCheck className="text-indigo-400 relative z-10" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
                                Nexus Admin
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">System Online // Authenticated</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all text-sm font-medium backdrop-blur-sm"
                    >
                        <LogOut size={16} />
                        Encerrar Sessão
                    </button>
                </header>

                <main className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800/50 pb-2">
                        <Activity size={18} className="text-indigo-500" />
                        <h2 className="text-sm font-medium uppercase tracking-wider">Módulos de Gestão</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Card: Projetos */}
                        <Link href="/admin/dashboard/projetos" className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 group overflow-hidden flex flex-col h-full shadow-lg shadow-black/20 hover:shadow-indigo-500/5 hover:-translate-y-1">
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500 pointer-events-none">
                                <FolderGit2 size={120} />
                            </div>
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl w-fit group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-colors mb-6 shadow-sm">
                                <FolderGit2 className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-200 mb-2">Projetos</h2>
                            <p className="text-sm text-slate-500 flex-1">Administre o seu portfólio de software, links de repositórios e mídias.</p>
                            <div className="mt-6 flex items-center text-xs font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                Acessar Módulo <ChevronRight size={14} className="ml-1" />
                            </div>
                        </Link>

                        {/* Card: Experiências */}
                        <Link href="/admin/dashboard/experiencias" className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:bg-slate-800/80 hover:border-emerald-500/50 transition-all duration-300 group overflow-hidden flex flex-col h-full shadow-lg shadow-black/20 hover:shadow-emerald-500/5 hover:-translate-y-1">
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500 pointer-events-none">
                                <Briefcase size={120} />
                            </div>
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl w-fit group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-colors mb-6 shadow-sm">
                                <Briefcase className="text-slate-400 group-hover:text-emerald-400 transition-colors" size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-200 mb-2">Experiências</h2>
                            <p className="text-sm text-slate-500 flex-1">Gerencie a linha do tempo da sua carreira, cargos e empresas.</p>
                            <div className="mt-6 flex items-center text-xs font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                Acessar Módulo <ChevronRight size={14} className="ml-1" />
                            </div>
                        </Link>

                        {/* Card: Habilidades */}
                        <Link href="/admin/dashboard/skills" className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:bg-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 group overflow-hidden flex flex-col h-full shadow-lg shadow-black/20 hover:shadow-cyan-500/5 hover:-translate-y-1">
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500 pointer-events-none">
                                <Code2 size={120} />
                            </div>
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl w-fit group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors mb-6 shadow-sm">
                                <Code2 className="text-slate-400 group-hover:text-cyan-400 transition-colors" size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-200 mb-2">Skills & Tech</h2>
                            <p className="text-sm text-slate-500 flex-1">Ajuste seus níveis de proficiência técnica e organize por categorias.</p>
                            <div className="mt-6 flex items-center text-xs font-medium text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                Acessar Módulo <ChevronRight size={14} className="ml-1" />
                            </div>
                        </Link>

                        {/* Card: Certificados */}
                        <Link href="/admin/dashboard/certificados" className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:bg-slate-800/80 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden flex flex-col h-full shadow-lg shadow-black/20 hover:shadow-purple-500/5 hover:-translate-y-1">
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500 pointer-events-none">
                                <GraduationCap size={120} />
                            </div>
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl w-fit group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-colors mb-6 shadow-sm">
                                <GraduationCap className="text-slate-400 group-hover:text-purple-400 transition-colors" size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-200 mb-2">Certificados</h2>
                            <p className="text-sm text-slate-500 flex-1">Registre novos diplomas, certificações e inclua links de validação.</p>
                            <div className="mt-6 flex items-center text-xs font-medium text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                Acessar Módulo <ChevronRight size={14} className="ml-1" />
                            </div>
                        </Link>

                    </div>
                </main>

            </div>
        </div>
    );
}