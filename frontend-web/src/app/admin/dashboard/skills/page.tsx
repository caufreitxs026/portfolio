"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Loader2, Save, X, Plus, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
    display_order: number;
}

export default function SkillsManagementPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estado para Busca
    const [searchTerm, setSearchTerm] = useState("");

    // Estado para Criação
    const [newFormData, setNewFormData] = useState({
        name: "", category: "", level: 50, display_order: 0,
    });
    const [isCreating, setIsCreating] = useState(false);

    // Estado para Edição (Modal)
    const [editFormData, setEditFormData] = useState<Skill | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("portfolio_skills")
                .select("*")
                .order("category", { ascending: true })
                .order("display_order", { ascending: true });

            if (error) throw new Error(error.message);
            setSkills(data || []);
        } catch (err: any) {
            Swal.fire("Erro", "Falha ao buscar competências.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFormData.name || !newFormData.category) return;

        setIsCreating(true);
        try {
            const { data, error } = await supabase
                .from("portfolio_skills")
                .insert([newFormData])
                .select()
                .single();

            if (error) throw new Error(error.message);

            setSkills((prev) => [...prev, data].sort((a, b) => a.display_order - b.display_order));
            setNewFormData({ name: "", category: "", level: 50, display_order: 0 });
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Adicionado!', showConfirmButton: false, timer: 1500, background: "#0f172a", color: "#f8fafc" });
        } catch (err: any) {
            Swal.fire("Erro", err.message, "error");
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editFormData) return;

        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from("portfolio_skills")
                .update({
                    name: editFormData.name,
                    category: editFormData.category,
                    level: editFormData.level,
                    display_order: editFormData.display_order,
                })
                .eq("id", editFormData.id);

            if (error) throw new Error(error.message);

            setSkills((prev) => prev.map((s) => (s.id === editFormData.id ? editFormData : s)).sort((a, b) => a.display_order - b.display_order));
            setEditFormData(null);
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Atualizado!', showConfirmButton: false, timer: 1500, background: "#0f172a", color: "#f8fafc" });
        } catch (err: any) {
            Swal.fire("Erro", err.message, "error");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: string) => {
        const { value: password } = await Swal.fire({
            title: "Confirmação de Segurança",
            text: "Insira a senha de administrador para excluir.",
            input: "password",
            inputAttributes: { autocapitalize: "off" },
            showCancelButton: true,
            confirmButtonText: "Excluir",
            cancelButtonText: "Cancelar",
            background: "#0f172a",
            color: "#f8fafc",
            confirmButtonColor: "#dc2626",
            showLoaderOnConfirm: true,
            preConfirm: async (pwd) => {
                if (!pwd) return Swal.showValidationMessage("A senha é obrigatória.");
                try {
                    const res = await fetch("/api/auth/verify-password", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ password: pwd })
                    });
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error("Senha incorreta.");
                    return true;
                } catch (error: any) {
                    return Swal.showValidationMessage(`Falha: ${error.message}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });

        if (password) {
            try {
                const { error } = await supabase.from("portfolio_skills").delete().eq("id", id);
                if (error) throw new Error(error.message);
                setSkills((prev) => prev.filter((skill) => skill.id !== id));
            } catch (err: any) {
                Swal.fire("Erro", err.message, "error");
            }
        }
    };

    // Filtra as competências com base no termo digitado
    const filteredSkills = skills.filter(
        (skill) =>
            skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
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
          background-color: #334155; /* Cor do Thumb no hover do container */
        }
        .hover-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #475569; /* Cor do Thumb ao ser focado */
        }
      `}} />

            <div className="max-w-7xl mx-auto space-y-8">

                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors">
                            <ArrowLeft size={20} className="text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Skills & Tech</h1>
                            <p className="text-slate-500 text-sm mt-1">Gerencie suas competências e níveis técnicos</p>
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-8">
                            <h2 className="text-lg font-medium text-slate-200 flex items-center gap-2 mb-6">
                                <Plus size={18} className="text-emerald-400" /> Adicionar Nova
                            </h2>

                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Nome da Tecnologia</label>
                                    <input
                                        type="text" required value={newFormData.name} onChange={(e) => setNewFormData({ ...newFormData, name: e.target.value })}
                                        placeholder="Ex: Next.js"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Categoria</label>
                                    <input
                                        type="text" required list="categories" value={newFormData.category} onChange={(e) => setNewFormData({ ...newFormData, category: e.target.value })}
                                        placeholder="Ex: Frontend"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                                    />
                                    <datalist id="categories">
                                        <option value="Frontend" />
                                        <option value="Backend" />
                                        <option value="Database" />
                                        <option value="DevOps" />
                                        <option value="Soft Skill" />
                                    </datalist>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-slate-400">Nível de Domínio</label>
                                        <span className="text-xs text-indigo-400 font-mono">{newFormData.level}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" step="5" value={newFormData.level} onChange={(e) => setNewFormData({ ...newFormData, level: parseInt(e.target.value) })}
                                        className="w-full accent-indigo-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Ordem de Exibição</label>
                                    <input
                                        type="number" required value={newFormData.display_order} onChange={(e) => setNewFormData({ ...newFormData, display_order: parseInt(e.target.value) })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                                    />
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <button type="submit" disabled={isCreating} className="w-full py-2.5 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/10">
                                        <Save size={16} /> {isCreating ? "Salvando..." : "Adicionar Competência"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-sm">

                            {/* Painel de Busca Fixo no Topo da Tabela */}
                            <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-3">
                                <Search size={18} className="text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar competência ou categoria..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent border-none focus:outline-none text-sm text-slate-200 w-full placeholder:text-slate-600"
                                />
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center flex-1">
                                    <Loader2 size={32} className="text-indigo-500 animate-spin" />
                                </div>
                            ) : skills.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
                                    <p>Nenhuma competência cadastrada.</p>
                                </div>
                            ) : filteredSkills.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
                                    <p>Nenhum resultado encontrado para "{searchTerm}".</p>
                                </div>
                            ) : (
                                <div className="overflow-y-auto flex-1 hover-scrollbar">
                                    <table className="w-full text-left border-collapse relative">
                                        <thead className="sticky top-0 bg-slate-950/95 backdrop-blur-md z-10 shadow-sm border-b border-slate-800">
                                            <tr className="text-xs uppercase tracking-wider text-slate-400">
                                                <th className="p-4 font-medium">Nome & Progresso</th>
                                                <th className="p-4 font-medium hidden sm:table-cell">Categoria</th>
                                                <th className="p-4 font-medium text-center">Ordem</th>
                                                <th className="p-4 font-medium text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {filteredSkills.map((skill) => (
                                                <tr key={skill.id} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="p-4">
                                                        <p className="font-medium text-slate-200">{skill.name}</p>
                                                        <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 max-w-[150px]">
                                                            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${skill.level}%` }}></div>
                                                        </div>
                                                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded mt-2 inline-block sm:hidden">
                                                            {skill.category}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 hidden sm:table-cell">
                                                        <span className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                                                            {skill.category}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className="font-mono text-slate-500 text-sm bg-slate-950 px-2 py-1 rounded border border-slate-800">{skill.display_order}</span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => setEditFormData(skill)} className="p-2 text-slate-400 hover:text-indigo-400 transition-colors bg-slate-950 border border-slate-800 hover:border-indigo-500/30 rounded-lg shadow-sm">
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete(skill.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors bg-slate-950 border border-slate-800 hover:border-red-500/30 rounded-lg shadow-sm">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {editFormData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h3 className="font-medium text-slate-100 flex items-center gap-2">
                                <Pencil size={16} className="text-indigo-400" />
                                Editar Competência
                            </h3>
                            <button onClick={() => setEditFormData(null)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Nome</label>
                                <input
                                    type="text" required value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Categoria</label>
                                    <input
                                        type="text" required list="categories" value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Ordem</label>
                                    <input
                                        type="number" required value={editFormData.display_order} onChange={(e) => setEditFormData({ ...editFormData, display_order: parseInt(e.target.value) })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-slate-400">Nível</label>
                                    <span className="text-xs text-indigo-400 font-mono">{editFormData.level}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="100" step="5" value={editFormData.level} onChange={(e) => setEditFormData({ ...editFormData, level: parseInt(e.target.value) })}
                                    className="w-full accent-indigo-500"
                                />
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button type="button" onClick={() => setEditFormData(null)} disabled={isUpdating} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={isUpdating} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium flex justify-center items-center gap-2">
                                    {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}