"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Loader2, Save, X, Plus, Search, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

interface Experience {
    id: string;
    role: string;
    company: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
    is_current: boolean;
}

export default function ExperiencesManagementPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const initialFormState = { role: "", company: "", start_date: "", end_date: "", description: "", is_current: false };
    const [newFormData, setNewFormData] = useState(initialFormState);
    const [isCreating, setIsCreating] = useState(false);

    const [editFormData, setEditFormData] = useState<Experience | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("portfolio_experiences")
                .select("*")
                .order("is_current", { ascending: false })
                .order("start_date", { ascending: false });

            if (error) throw new Error(error.message);
            setExperiences(data || []);
        } catch (err: any) {
            Swal.fire("Erro", "Falha ao buscar experiências.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFormData.role || !newFormData.company || !newFormData.start_date) return;

        setIsCreating(true);
        try {
            const payload = {
                ...newFormData,
                end_date: newFormData.is_current ? null : (newFormData.end_date || null),
                description: newFormData.description || null
            };

            const { data, error } = await supabase
                .from("portfolio_experiences")
                .insert([payload])
                .select()
                .single();

            if (error) throw new Error(error.message);

            setExperiences((prev) => [data, ...prev].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()));
            setNewFormData(initialFormState);
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
            const payload = {
                role: editFormData.role,
                company: editFormData.company,
                start_date: editFormData.start_date,
                end_date: editFormData.is_current ? null : (editFormData.end_date || null),
                description: editFormData.description || null,
                is_current: editFormData.is_current
            };

            const { error } = await supabase
                .from("portfolio_experiences")
                .update(payload)
                .eq("id", editFormData.id);

            if (error) throw new Error(error.message);

            setExperiences((prev) => prev.map((e) => (e.id === editFormData.id ? { ...editFormData, ...payload } : e)));
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
                const { error } = await supabase.from("portfolio_experiences").delete().eq("id", id);
                if (error) throw new Error(error.message);
                setExperiences((prev) => prev.filter((exp) => exp.id !== id));
            } catch (err: any) {
                Swal.fire("Erro", err.message, "error");
            }
        }
    };

    const formatDateToMonthYear = (dateString: string | null) => {
        if (!dateString) return "";
        const [year, month] = dateString.split('-');
        return `${month}/${year}`;
    };

    const filteredExperiences = experiences.filter((exp) => {
        const term = searchTerm.toLowerCase();
        return (
            exp.role.toLowerCase().includes(term) ||
            exp.company.toLowerCase().includes(term) ||
            (exp.description && exp.description.toLowerCase().includes(term))
        );
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
            <style dangerouslySetInnerHTML={{
                __html: `
        .hover-scrollbar::-webkit-scrollbar { width: 6px; }
        .hover-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .hover-scrollbar::-webkit-scrollbar-thumb { background-color: transparent; border-radius: 20px; }
        .hover-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #334155; }
        .hover-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #475569; }
      `}} />

            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors">
                            <ArrowLeft size={20} className="text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Experiência Profissional</h1>
                            <p className="text-slate-500 text-sm mt-1">Gerencie a linha do tempo da sua carreira</p>
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Formulário SPI (Inserção Rápida) */}
                    <div className="lg:col-span-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-8 shadow-sm">
                            <h2 className="text-lg font-medium text-slate-200 flex items-center gap-2 mb-6">
                                <Briefcase size={18} className="text-emerald-400" /> Adicionar Nova
                            </h2>

                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Cargo</label>
                                    <input
                                        type="text" required value={newFormData.role} onChange={(e) => setNewFormData({ ...newFormData, role: e.target.value })}
                                        placeholder="Ex: Desenvolvedor Full Stack"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Empresa</label>
                                    <input
                                        type="text" required value={newFormData.company} onChange={(e) => setNewFormData({ ...newFormData, company: e.target.value })}
                                        placeholder="Ex: Mirasol"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Data de Início</label>
                                        <input
                                            type="date" required value={newFormData.start_date} onChange={(e) => setNewFormData({ ...newFormData, start_date: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-300 [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Data de Fim</label>
                                        <input
                                            type="date" disabled={newFormData.is_current} required={!newFormData.is_current} value={newFormData.end_date} onChange={(e) => setNewFormData({ ...newFormData, end_date: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-300 disabled:opacity-50 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer mt-2 w-fit">
                                    <input
                                        type="checkbox" checked={newFormData.is_current} onChange={(e) => setNewFormData({ ...newFormData, is_current: e.target.checked, end_date: "" })}
                                        className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/20"
                                    />
                                    <span className="text-sm text-slate-300">Este é o meu emprego atual</span>
                                </label>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Descrição das Atividades</label>
                                    <textarea
                                        rows={4} value={newFormData.description} onChange={(e) => setNewFormData({ ...newFormData, description: e.target.value })}
                                        placeholder="Descreva suas responsabilidades e conquistas..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                                    />
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <button type="submit" disabled={isCreating} className="w-full py-2.5 text-white rounded-lg font-medium flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/10">
                                        <Save size={16} /> {isCreating ? "Salvando..." : "Adicionar Experiência"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Listagem Interativa */}
                    <div className="lg:col-span-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[750px] shadow-sm">
                            <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-3 shrink-0">
                                <Search size={18} className="text-slate-500" />
                                <input
                                    type="text" placeholder="Buscar por cargo, empresa ou descrição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent border-none focus:outline-none text-sm text-slate-200 w-full placeholder:text-slate-600"
                                />
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center flex-1">
                                    <Loader2 size={32} className="text-indigo-500 animate-spin" />
                                </div>
                            ) : experiences.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
                                    <p>Nenhuma experiência cadastrada.</p>
                                </div>
                            ) : filteredExperiences.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
                                    <p>Nenhum resultado encontrado para "{searchTerm}".</p>
                                </div>
                            ) : (
                                <div className="overflow-y-auto flex-1 hover-scrollbar">
                                    <table className="w-full text-left border-collapse relative">
                                        <thead className="sticky top-0 bg-slate-950/95 backdrop-blur-md z-10 shadow-sm border-b border-slate-800">
                                            <tr className="text-xs uppercase tracking-wider text-slate-400">
                                                <th className="p-4 font-medium">Cargo & Empresa</th>
                                                <th className="p-4 font-medium hidden md:table-cell">Período</th>
                                                <th className="p-4 font-medium text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {filteredExperiences.map((exp) => (
                                                <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="p-4">
                                                        <p className="font-medium text-slate-200">{exp.role}</p>
                                                        <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                                                            {exp.company}
                                                            {exp.is_current && <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">Atual</span>}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{exp.description}</p>
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell whitespace-nowrap text-sm text-slate-400">
                                                        {formatDateToMonthYear(exp.start_date)} - {exp.is_current ? "Presente" : formatDateToMonthYear(exp.end_date)}
                                                    </td>
                                                    <td className="p-4 text-right align-top">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => setEditFormData(exp)} className="p-2 text-slate-400 hover:text-indigo-400 transition-colors bg-slate-950 border border-slate-800 hover:border-indigo-500/30 rounded-lg">
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors bg-slate-950 border border-slate-800 hover:border-red-500/30 rounded-lg">
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

            {/* OVERLAY: Modal Contextual de Edição */}
            {editFormData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h3 className="font-medium text-slate-100 flex items-center gap-2">
                                <Pencil size={16} className="text-indigo-400" />
                                Editar Experiência
                            </h3>
                            <button onClick={() => setEditFormData(null)} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Cargo</label>
                                    <input type="text" required value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Empresa</label>
                                    <input type="text" required value={editFormData.company} onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Início</label>
                                    <input type="date" required value={editFormData.start_date} onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200 [color-scheme:dark]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Fim</label>
                                    <input type="date" disabled={editFormData.is_current} required={!editFormData.is_current} value={editFormData.end_date || ""} onChange={(e) => setEditFormData({ ...editFormData, end_date: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200 disabled:opacity-50 [color-scheme:dark]" />
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer w-fit">
                                <input type="checkbox" checked={editFormData.is_current} onChange={(e) => setEditFormData({ ...editFormData, is_current: e.target.checked, end_date: e.target.checked ? null : editFormData.end_date })} className="rounded border-slate-700 bg-slate-900 text-indigo-500" />
                                <span className="text-sm text-slate-300">Trabalho atual</span>
                            </label>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Descrição</label>
                                <textarea rows={4} value={editFormData.description || ""} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200 resize-none" />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setEditFormData(null)} disabled={isUpdating} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={isUpdating} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium flex justify-center items-center gap-2">
                                    {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}