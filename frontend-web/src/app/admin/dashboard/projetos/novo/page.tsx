"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileVideo, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function NewProjectPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repoLink, setRepoLink] = useState("");
    const [techStack, setTechStack] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !file) {
            setError("Título e arquivo de mídia são obrigatórios.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Correção: Tipagem explícita (Literal Type)
            const mediaType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";

            const { error: uploadError } = await supabase.storage
                .from("portfolio-media")
                .upload(fileName, file);

            if (uploadError) throw new Error(`Falha no upload: ${uploadError.message}`);

            const { data: { publicUrl } } = supabase.storage
                .from("portfolio-media")
                .getPublicUrl(fileName);

            const techStackArray = techStack
                .split(",")
                .map((tech) => tech.trim())
                .filter((tech) => tech.length > 0);

            const { error: dbError } = await supabase
                .from("portfolio_projects")
                .insert([
                    {
                        title,
                        description,
                        media_url: publicUrl,
                        media_type: mediaType,
                        status: "active",
                        repo_link: repoLink,
                        video_url: videoUrl.trim() === "" ? null : videoUrl.trim(),
                        tech_stack: techStackArray
                    }
                ]);

            if (dbError) throw new Error(`Falha no banco de dados: ${dbError.message}`);

            if (previewUrl) URL.revokeObjectURL(previewUrl);
            router.push("/admin/dashboard/projetos");
            router.refresh();

        } catch (err: any) {
            setError(err.message || "Ocorreu um erro desconhecido durante o processamento.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-8">

                <header className="flex items-center gap-4 border-b border-slate-800 pb-6">
                    <Link
                        href="/admin/dashboard/projetos"
                        className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Novo Projeto</h1>
                        <p className="text-slate-500 text-sm mt-1">Adicione uma nova entrada ao seu portfólio</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Título do Projeto</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Ex: Sistema de Gestão Financeira"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Descrição Técnica</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                            placeholder="Detalhe a arquitetura, tecnologias e os desafios resolvidos..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Stack Tecnológica</label>
                            <input
                                type="text"
                                value={techStack}
                                onChange={(e) => setTechStack(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="Ex: React, Node.js, Python, Supabase"
                            />
                            <p className="text-xs text-slate-500">Separe as tecnologias por vírgula.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Link do Repositório</label>
                            <input
                                type="url"
                                value={repoLink}
                                onChange={(e) => setRepoLink(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="Ex: https://github.com/usuario/repo"
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
                        <p className="text-xs text-slate-500">Opcional. Link para a demonstração do projeto.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Imagem de Capa (Thumbnail)</label>

                        <div className="relative border-2 border-dashed border-slate-700 rounded-2xl bg-slate-950 hover:bg-slate-900/80 transition-colors overflow-hidden group">
                            {previewUrl ? (
                                <div className="relative w-full aspect-video flex items-center justify-center bg-black">
                                    {file?.type.startsWith("video/") ? (
                                        <video src={previewUrl} className="w-full h-full object-contain" autoPlay loop muted playsInline />
                                    ) : (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-medium flex items-center gap-2">
                                            <UploadCloud size={20} /> Trocar arquivo
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <div className="flex gap-2 mb-4">
                                        <ImageIcon size={32} className="text-slate-500" />
                                        <FileVideo size={32} className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-300 font-medium">Arraste uma imagem ou clique para selecionar</p>
                                    <p className="text-slate-500 text-sm mt-1">PNG, JPG ou WebP (Recomendado 16:9)</p>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSubmitting ? "Processando e Salvando..." : "Salvar Projeto"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}