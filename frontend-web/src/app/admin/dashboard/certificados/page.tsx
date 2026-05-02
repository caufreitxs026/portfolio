"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Loader2, Save, X, Plus, Search, Award, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

interface Certificate {
    id: string;
    name: string;
    issuer: string;
    issue_date: string;
    credential_url: string | null;
    display_order: number;
}

export default function CertificatesManagementPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const initialFormState = { name: "", issuer: "", issue_date: "", credential_url: "", display_order: 0 };
    const [newFormData, setNewFormData] = useState(initialFormState);
    const [isCreating, setIsCreating] = useState(false);

    const [editFormData, setEditFormData] = useState<Certificate | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("portfolio_certificates")
                .select("*")
                .order("display_order", { ascending: true })
                .order("issue_date", { ascending: false });

            if (error) throw new Error(error.message);
            setCertificates(data || []);
        } catch (err: any) {
            Swal.fire("Erro", "Falha ao buscar certificados.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFormData.name || !newFormData.issuer || !newFormData.issue_date) return;

        setIsCreating(true);
        try {
            const payload = {
                ...newFormData,
                credential_url: newFormData.credential_url || null
            };

            const { data, error } = await supabase
                .from("portfolio_certificates")
                .insert([payload])
                .select()
                .single();

            if (error) throw new Error(error.message);

            setCertificates((prev) => [...prev, data].sort((a, b) => a.display_order - b.display_order));
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
                name: editFormData.name,
                issuer: editFormData.issuer,
                issue_date: editFormData.issue_date,
                credential_url: editFormData.credential_url || null,
                display_order: editFormData.display_order
            };

            const { error } = await supabase
                .from("portfolio_certificates")
                .update(payload)
                .eq("id", editFormData.id);

            if (error) throw new Error(error.message);

            setCertificates((prev) => prev.map((c) => (c.id === editFormData.id ? { ...editFormData, ...payload } : c)).sort((a, b) => a.display_order - b.display_order));
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
                const { error } = await supabase.from("portfolio_certificates").delete().eq("id", id);
                if (error) throw new Error(error.message);
                setCertificates((prev) => prev.filter((cert) => cert.id !== id));
            } catch (err: any) {
                Swal.fire("Erro", err.message, "error");
            }
        }
    };

    const formatDateToMonthYear = (dateString: string) => {
        if (!dateString) return "";
        const [year, month] = dateString.split('-');
        return `${month}/${year}`;
    };

    const filteredCertificates = certificates.filter((cert) => {
        const term = searchTerm.toLowerCase();
        return (
            cert.name.toLowerCase().includes(term) ||
            cert.issuer.toLowerCase().includes(term)
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
                            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Certificados & Cursos</h1>
                            <p className="text-slate-500 text-sm mt-1">Gerencie suas qualificações acadêmicas e técnicas</p>
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Formulário SPI (Inserção Rápida) */}
                    <div className="lg:col-span-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-8 shadow-sm">
                            <h2 className="text-lg font-medium text-slate-200 flex items-center gap-2 mb-6">
                                <Award size={18} className="text-emerald-400" /> Adicionar Novo
                            </h2>

                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Nome do Certificado</label>
                                    <input
                                        type="text" required value={newFormData.name} onChange={(e) => setNewFormData({ ...newFormData, name: e.target.value })}
                                        placeholder="Ex: AWS Certified Cloud Practitioner"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Instituição Emissora</label>
                                    <input
                                        type="text" required value={newFormData.issuer} onChange={(e) => setNewFormData({ ...newFormData, issuer: e.target.value })}
                                        placeholder="Ex: Amazon Web Services"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Data de Emissão</label>
                                        <input
                                            type="date" required value={newFormData.issue_date} onChange={(e) => setNewFormData({ ...newFormData, issue_date: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-300 [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Ordem de Exibição</label>
                                        <input
                                            type="number" required value={newFormData.display_order} onChange={(e) => setNewFormData({ ...newFormData, display_order: parseInt(e.target.value) })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">URL da Credencial (Opcional)</label>
                                    <input
                                        type="url" value={newFormData.credential_url} onChange={(e) => setNewFormData({ ...newFormData, credential_url: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 focus:outline-none focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <button type="submit" disabled={isCreating} className="w-full py-2.5 text-white rounded-lg font-medium flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/10">
                                        <Save size={16} /> {isCreating ? "Salvando..." : "Adicionar Certificado"}
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
                                    type="text" placeholder="Buscar por nome ou instituição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent border-none focus:outline-none text-sm text-slate-200 w-full placeholder:text-slate-600"
                                />
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center flex-1">
                                    <Loader2 size={32} className="text-indigo-500 animate-spin" />
                                </div>
                            ) : certificates.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
                                    <p>Nenhum certificado cadastrado.</p>
                                </div>
                            ) : filteredCertificates.length === 0 ? (
                                <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
                                    <p>Nenhum resultado encontrado para "{searchTerm}".</p>
                                </div>
                            ) : (
                                <div className="overflow-y-auto flex-1 hover-scrollbar">
                                    <table className="w-full text-left border-collapse relative">
                                        <thead className="sticky top-0 bg-slate-950/95 backdrop-blur-md z-10 shadow-sm border-b border-slate-800">
                                            <tr className="text-xs uppercase tracking-wider text-slate-400">
                                                <th className="p-4 font-medium">Certificado & Instituição</th>
                                                <th className="p-4 font-medium hidden md:table-cell">Emissão</th>
                                                <th className="p-4 font-medium text-center">Ordem</th>
                                                <th className="p-4 font-medium text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {filteredCertificates.map((cert) => (
                                                <tr key={cert.id} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="p-4">
                                                        <p className="font-medium text-slate-200 flex items-center gap-2">
                                                            {cert.name}
                                                            {cert.credential_url && (
                                                                <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300" aria-label="Ver Credencial">
                                                                    <ExternalLink size={14} />
                                                                </a>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-slate-400 mt-1">
                                                            {cert.issuer}
                                                        </p>
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell whitespace-nowrap text-sm text-slate-400">
                                                        {formatDateToMonthYear(cert.issue_date)}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className="font-mono text-slate-500 text-sm bg-slate-950 px-2 py-1 rounded border border-slate-800">{cert.display_order}</span>
                                                    </td>
                                                    <td className="p-4 text-right align-middle">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => setEditFormData(cert)} className="p-2 text-slate-400 hover:text-indigo-400 transition-colors bg-slate-950 border border-slate-800 hover:border-indigo-500/30 rounded-lg">
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete(cert.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors bg-slate-950 border border-slate-800 hover:border-red-500/30 rounded-lg">
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
                                Editar Certificado
                            </h3>
                            <button onClick={() => setEditFormData(null)} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Nome do Certificado</label>
                                <input type="text" required value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Instituição Emissora</label>
                                <input type="text" required value={editFormData.issuer} onChange={(e) => setEditFormData({ ...editFormData, issuer: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Data de Emissão</label>
                                    <input type="date" required value={editFormData.issue_date} onChange={(e) => setEditFormData({ ...editFormData, issue_date: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200 [color-scheme:dark]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Ordem de Exibição</label>
                                    <input type="number" required value={editFormData.display_order} onChange={(e) => setEditFormData({ ...editFormData, display_order: parseInt(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">URL da Credencial</label>
                                <input type="url" value={editFormData.credential_url || ""} onChange={(e) => setEditFormData({ ...editFormData, credential_url: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:border-indigo-500 text-sm text-slate-200" />
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