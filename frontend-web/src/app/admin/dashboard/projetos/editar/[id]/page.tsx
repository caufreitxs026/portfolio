"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileVideo, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

// Definição da interface local para garantir tipagem estrita no retorno do Supabase
interface ProjectData {
    id: string;
    title: string;
    description: string | null;
    media_url: string | null;
    media_type: "image" | "video" | null;
    repo_link: string | null;
    video_url: string | null;
    tech_stack: string[] | null;
}

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Estados do Formulário
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repoLink, setRepoLink] = useState("");
    const [techStack, setTechStack] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    // Estados de Mídia
    const [currentMediaUrl, setCurrentMediaUrl] = useState<string | null>(null);
    const [currentMediaType, setCurrentMediaType] = useState<"image" | "video" | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Busca os dados do projeto ao montar a tela
    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const { data, error: dbError } = await supabase
                    .from("portfolio_projects")
                    .select("*")
                    .eq("id", params.id)
                    .single();

                if (dbError) throw new Error(dbError.message);

                // Type Assertion para mapear o retorno dinâmico para a interface estrita
                const projectData = data as unknown as ProjectData;

                setTitle(projectData.title);
                setDescription(projectData.description || "");
                setRepoLink(projectData.repo_link || "");
                setVideoUrl(projectData.video_url || "");
                setCurrentMediaUrl(projectData.media_url);
                setCurrentMediaType(projectData.media_type);
                setPreviewUrl(projectData.media_url); // Mostra a mídia atual no preview

                // Transforma o array do banco ['React', 'Node'] na string 'React, Node' para o input
                if (projectData.tech_stack) {
                    setTechStack(projectData.tech_stack.join(", "));
                }
            } catch (err: any) {
                Swal.fire("Erro", "Não foi possível carregar os dados do projeto.", "error");
                router.push("/admin/dashboard/projetos");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (params.id) fetchProjectDetails();
    }, [params.id, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) {
            setError("O título é obrigatório.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            let finalMediaUrl = currentMediaUrl;

            // Variável intermediária com tipagem estrita requerida pelo payload
            let finalMediaType: "image" | "video" | null = currentMediaType;

            // Se o usuário selecionou um NOVO arquivo, fazemos a substituição
            if (file) {
                // 1. Apagar a mídia antiga do Storage para não gerar lixo digital (Orphan Files)
                if (currentMediaUrl) {
                    const oldFileName = currentMediaUrl.split("/").pop();
                    if (oldFileName) await supabase.storage.from("portfolio-media").remove([oldFileName]);
                }

                // 2. Fazer o upload da nova mídia
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                finalMediaType = file.type.startsWith("video/") ? "video" : "image";

                const { error: uploadError } = await supabase.storage
                    .from("portfolio-media")
                    .upload(fileName, file);

                if (uploadError) throw new Error(`Falha no upload: ${uploadError.message}`);

                const { data: { publicUrl } } = supabase.storage
                    .from("portfolio-media")
                    .getPublicUrl(fileName);

                finalMediaUrl = publicUrl;
            }

            // Tratamento do vetor de strings
            const techStackArray = techStack
                .split(",")
                .map((tech) => tech.trim())
                .filter((tech) => tech.length > 0);

            // 3. Atualizar (UPDATE) o registro relacional no PostgreSQL
            const { error: dbError } = await supabase
                .from("portfolio_projects")
                .update({
                    title,
                    description,
                    media_url: finalMediaUrl,
                    media_type: finalMediaType,
                    repo_link: repoLink,
                    video_url: videoUrl.trim() === "" ? null : videoUrl.trim(),
                    tech_stack: techStackArray
                })
                .eq("id", params.id);

            if (dbError) throw new Error(`Falha ao atualizar no banco: ${dbError.message}`);

            // Sucesso
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success', title: 'Projeto atualizado!',
                showConfirmButton: false, timer: 2000, background: "#0f172a", color: "#f8fafc"
            });

            router.push("/admin/dashboard/projetos");
            router.refresh();

        } catch (err: any) {
            setError(err.message || "Ocorreu um erro desconhecido.");
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 size={40} className="text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-8">

                <header className="flex items-center gap-4 border-b border-slate-800 pb-6">
                    <Link href="/admin/dashboard/projetos" className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors">
                        <ArrowLeft size={20} className="text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Editar Projeto</h1>
                        <p className="text-slate-500 text-sm mt-1">Atualize as informações do seu portfólio</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Título do Projeto</label>
                        <input
                            type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Descrição Técnica</label>
                        <textarea
                            value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Stack Tecnológica</label>
                            <input
                                type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Link do Repositório</label>
                            <input
                                type="url" value={repoLink} onChange={(e) => setRepoLink(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">URL do Vídeo (YouTube)</label>
                        <input
                            type="url"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Ex: https://www.youtube.com/watch?v=..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Imagem de Capa (Deixe vazio para manter a atual)</label>
                        <div className="relative border-2 border-dashed border-slate-700 rounded-2xl bg-slate-950 hover:bg-slate-900/80 transition-colors overflow-hidden group">
                            {previewUrl ? (
                                <div className="relative w-full aspect-video flex items-center justify-center bg-black">
                                    {(file ? file.type.startsWith("video/") : currentMediaType === "video") ? (
                                        <video src={previewUrl} className="w-full h-full object-contain" autoPlay loop muted playsInline />
                                    ) : (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <UploadCloud size={20} /> Substituir arquivo
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <div className="flex gap-2 mb-4">
                                        <ImageIcon size={32} className="text-slate-500" />
                                        <FileVideo size={32} className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-300 font-medium">Sem imagem de capa. Clique para adicionar.</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    </div>

                    {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit" disabled={isSubmitting}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? "Atualizando..." : "Salvar Alterações"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}