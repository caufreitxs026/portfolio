"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ArrowLeft, Image as ImageIcon, Video, Pencil, Trash2, Loader2, Github, ImageOff, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

interface Project {
    id: string;
    title: string;
    description: string;
    media_url: string;
    media_type: "image" | "video";
    repo_link?: string;
    tech_stack?: string[];
    status: "active" | "draft";
    created_at: string;
}

export default function ProjectsManagementPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estado para Busca
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const { data, error: supabaseError } = await supabase
                .from("portfolio_projects")
                .select("*")
                .order("created_at", { ascending: false });

            if (supabaseError) throw new Error(supabaseError.message);
            setProjects(data || []);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar os projetos.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, mediaUrl: string) => {
        const { value: password } = await Swal.fire({
            title: "Confirmação de Segurança",
            text: "Insira a senha de administrador para autorizar a exclusão.",
            input: "password",
            inputPlaceholder: "••••••••",
            inputAttributes: {
                autocapitalize: "off",
                autocorrect: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Verificar e Excluir",
            cancelButtonText: "Cancelar",
            background: "#0f172a",
            color: "#f8fafc",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#334155",
            showLoaderOnConfirm: true,
            preConfirm: async (pwd) => {
                if (!pwd) {
                    Swal.showValidationMessage("A senha é obrigatória.");
                    return false;
                }

                try {
                    const res = await fetch("/api/auth/verify-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ password: pwd })
                    });

                    const data = await res.json();

                    if (!res.ok || !data.success) {
                        throw new Error(data.message || "Senha incorreta.");
                    }
                    return true;
                } catch (error: any) {
                    Swal.showValidationMessage(`Falha: ${error.message}`);
                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (password) {
            try {
                if (mediaUrl) {
                    const fileName = mediaUrl.split("/").pop();
                    if (fileName) {
                        await supabase.storage.from("portfolio-media").remove([fileName]);
                    }
                }

                const { error: deleteError } = await supabase
                    .from("portfolio_projects")
                    .delete()
                    .eq("id", id);

                if (deleteError) throw new Error(deleteError.message);

                setProjects((prev) => prev.filter((project) => project.id !== id));

                Swal.fire({
                    title: "Excluído!",
                    text: "O projeto foi apagado com sucesso.",
                    icon: "success",
                    background: "#0f172a",
                    color: "#f8fafc",
                    confirmButtonColor: "#4f46e5"
                });
            } catch (err: any) {
                Swal.fire({
                    title: "Erro Crítico",
                    text: err.message,
                    icon: "error",
                    background: "#0f172a",
                    color: "#f8fafc",
                });
            }
        }
    };

    // Filtro Profundo (Título, Descrição e Stack Tecnológica)
    const filteredProjects = projects.filter((project) => {
        const term = searchTerm.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(term);
        const matchDesc = project.description?.toLowerCase().includes(term);
        const matchTech = project.tech_stack?.some(tech => tech.toLowerCase().includes(term));

        return matchTitle || matchDesc || matchTech;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col h-screen overflow-hidden">
            {/* Injeção de CSS nativo para Scrollbar Inteligente */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .hover-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .hover-scrollbar::-webkit-scrollbar-thumb {
                    background-color: transparent;
                    border-radius: 20px;
                }
                .hover-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: #334155;
                }
                .hover-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #475569;
                }
            `}} />

            <div className="max-w-7xl mx-auto w-full flex flex-col h-full space-y-6">

                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard"
                            className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Gestão de Projetos</h1>
                            <p className="text-slate-500 text-sm mt-1">Administre os itens do seu portfólio</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* Barra de Busca */}
                        <div className="flex-1 sm:w-64 lg:w-80 p-2 px-3 border border-slate-800 bg-slate-900/50 rounded-xl flex items-center gap-2 shadow-sm focus-within:border-indigo-500/50 focus-within:bg-slate-900 transition-colors">
                            <Search size={16} className="text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar projeto ou tecnologia..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none focus:outline-none text-sm text-slate-200 w-full placeholder:text-slate-600"
                            />
                        </div>

                        <Link
                            href="/admin/dashboard/projetos/novo"
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-medium text-sm shadow-lg shadow-indigo-500/20 whitespace-nowrap"
                        >
                            <Plus size={18} />
                            Novo
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden flex flex-col relative pb-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 size={32} className="text-indigo-500 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                            {error}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                            <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                                <ImageIcon size={32} className="text-slate-500" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-300">Nenhum projeto encontrado</h3>
                            <p className="text-slate-500 text-sm mt-2 text-center max-w-sm">
                                Você ainda não possui projetos cadastrados. Clique no botão acima para criar o seu primeiro.
                            </p>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <p>Nenhum projeto encontrado para "{searchTerm}".</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto h-full hover-scrollbar pr-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                                {filteredProjects.map((project) => (
                                    <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group flex flex-col h-full">

                                        <div className="aspect-video relative bg-slate-950 border-b border-slate-800 overflow-hidden shrink-0">
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 z-0 bg-slate-900/50">
                                                <ImageOff size={32} className="mb-2" />
                                                <span className="text-[10px] font-mono tracking-widest">SEM MÍDIA</span>
                                            </div>

                                            {project.media_url && (
                                                project.media_type === "video" ? (
                                                    <video
                                                        src={project.media_url}
                                                        className="relative z-10 w-full h-full object-cover"
                                                        autoPlay muted loop playsInline
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={project.media_url}
                                                        alt={project.title}
                                                        className="relative z-10 w-full h-full object-cover"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                )
                                            )}

                                            {(project.media_url) && (
                                                <div className="absolute top-2 right-2 z-20 p-1.5 bg-black/60 backdrop-blur-sm rounded-md border border-white/10">
                                                    {project.media_type === "video" ? (
                                                        <Video size={14} className="text-slate-300" />
                                                    ) : (
                                                        <ImageIcon size={14} className="text-slate-300" />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5 flex flex-col flex-1">
                                            <h4 className="font-medium text-slate-200 line-clamp-1">{project.title}</h4>
                                            <p className="text-sm text-slate-500 mt-2 line-clamp-2 flex-1">{project.description}</p>

                                            {(project.tech_stack || project.repo_link) && (
                                                <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between gap-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {project.tech_stack?.slice(0, 2).map((tech, i) => (
                                                            <span key={i} className="text-[10px] px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {(project.tech_stack?.length || 0) > 2 && (
                                                            <span className="text-[10px] px-2 py-1 bg-slate-800 text-slate-400 rounded-md">
                                                                +{project.tech_stack!.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {project.repo_link && (
                                                        <a href={project.repo_link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Acessar Repositório">
                                                            <Github size={16} />
                                                        </a>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-end gap-2 mt-4 shrink-0">
                                                <Link
                                                    href={`/admin/dashboard/projetos/editar/${project.id}`}
                                                    className="p-2 text-slate-400 hover:text-indigo-400 transition-colors bg-slate-950 border border-slate-800 hover:border-indigo-500/30 rounded-lg flex items-center justify-center"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(project.id, project.media_url)}
                                                    className="p-2 text-slate-400 hover:text-red-400 transition-colors bg-slate-950 border border-slate-800 hover:border-red-500/30 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}