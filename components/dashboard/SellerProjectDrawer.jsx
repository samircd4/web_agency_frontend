'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    X, CheckCircle2, Circle, Trash2, Plus, Upload, FileText,
    Receipt, CheckCheck, ChevronRight, AlertCircle, Loader2, Send
} from 'lucide-react';
import { api } from '@/lib/api';

// ─── Status Pill ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
    pending:    'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    in_progress:'bg-blue-500/15 text-blue-300 border-blue-500/30',
    in_review:  'bg-purple-500/15 text-purple-300 border-purple-500/30',
    completed:  'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    cancelled:  'bg-red-500/15 text-red-300 border-red-500/30',
};

function StatusPill({ status }) {
    return (
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border ${STATUS_STYLES[status] || STATUS_STYLES['pending']}`}>
            {status?.replace('_', ' ')}
        </span>
    );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="rounded-2xl bg-slate-900/60 border border-white/8 overflow-hidden">
            <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors cursor-pointer"
                onClick={() => setOpen(o => !o)}
            >
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300">
                    <Icon size={14} className="text-purple-400" /> {title}
                </div>
                <ChevronRight size={14} className={`text-slate-500 transition-transform ${open ? 'rotate-90' : ''}`} />
            </button>
            {open && <div className="px-5 pb-5 space-y-3">{children}</div>}
        </div>
    );
}

export default function SellerProjectDrawer({ project, onClose, onProjectUpdated }) {
    const [milestones, setMilestones] = useState(project?.milestones || []);
    const [files, setFiles]           = useState(project?.files || []);
    const [newMilestoneName, setNewMilestoneName] = useState('');
    const [proposalText, setProposalText] = useState('');
    const [invoiceItems, setInvoiceItems] = useState([{ description: 'Project Delivery', amount: 0 }]);
    const [invoiceNote, setInvoiceNote] = useState('');
    const [submitting, setSubmitting] = useState('');
    const [completionNote, setCompletionNote] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (project) {
            setMilestones(project.milestones || []);
            setFiles(project.files || []);
        }
    }, [project]);

    if (!project) return null;

    const pid = project.id;

    // ─── Milestones ──────────────────────────────────────────────────────────
    const handleToggleMilestone = async (m) => {
        const updated = { completed: !m.completed };
        try {
            await api.updateSellerMilestone(pid, m.id, updated);
            setMilestones(prev => prev.map(x => x.id === m.id ? { ...x, completed: !x.completed } : x));
        } catch (err) { console.error(err); }
    };

    const handleAddMilestone = async () => {
        if (!newMilestoneName.trim()) return;
        setSubmitting('milestone');
        try {
            const res = await api.addSellerMilestone(pid, { name: newMilestoneName, completed: false });
            setMilestones(prev => [...prev, res]);
            setNewMilestoneName('');
        } catch (err) { console.error(err); }
        finally { setSubmitting(''); }
    };

    const handleDeleteMilestone = async (id) => {
        try {
            await api.deleteSellerMilestone(pid, id);
            setMilestones(prev => prev.filter(m => m.id !== id));
        } catch (err) { console.error(err); }
    };

    // ─── File Upload ─────────────────────────────────────────────────────────
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSubmitting('file');
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('label', file.name);
            const res = await api.uploadSellerProjectFile(pid, formData);
            setFiles(prev => [...prev, res]);
        } catch (err) { console.error(err); }
        finally { setSubmitting(''); }
    };

    const handleDeleteFile = async (fileId) => {
        try {
            await api.deleteSellerProjectFile(pid, fileId);
            setFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (err) { console.error(err); }
    };

    // ─── Proposal ────────────────────────────────────────────────────────────
    const handleSendProposal = async () => {
        if (!proposalText.trim()) return;
        setSubmitting('proposal');
        try {
            await api.sendSellerProposal(pid, { content: proposalText });
            setProposalText('');
            alert('✅ Proposal sent to the client successfully!');
        } catch (err) { console.error(err); }
        finally { setSubmitting(''); }
    };

    // ─── Invoice ─────────────────────────────────────────────────────────────
    const invoiceTotal = invoiceItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    const handleSendInvoice = async () => {
        if (!invoiceItems.length) return;
        setSubmitting('invoice');
        try {
            await api.sendSellerInvoice(pid, {
                items: invoiceItems,
                notes: invoiceNote,
                total_amount: invoiceTotal,
            });
            setInvoiceItems([{ description: 'Project Delivery', amount: 0 }]);
            setInvoiceNote('');
            alert('✅ Invoice sent to the client!');
        } catch (err) { console.error(err); }
        finally { setSubmitting(''); }
    };

    // ─── Project Completion ───────────────────────────────────────────────────
    const handleMarkComplete = async () => {
        if (!confirm("Mark this project as complete? This will notify the client.")) return;
        setSubmitting('complete');
        try {
            await api.updateSellerProject(pid, { status: 'completed', completion_note: completionNote });
            onProjectUpdated?.({ ...project, status: 'completed' });
            onClose();
        } catch (err) { console.error(err); }
        finally { setSubmitting(''); }
    };

    const completedMilestones = milestones.filter(m => m.completed).length;
    const progressPct = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="relative z-10 w-full max-w-2xl h-full bg-slate-950 border-l border-white/10 flex flex-col shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex-shrink-0 px-6 py-5 border-b border-white/10 bg-gradient-to-r from-purple-950/40 to-slate-950">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <StatusPill status={project.status} />
                                <span className="text-[10px] font-bold text-slate-500">#{project.project_id || project.id}</span>
                            </div>
                            <h2 className="text-lg font-black text-white truncate">{project.name}</h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Client: <span className="text-white font-bold">{project.client_profile?.company_name || project.client_profile?.contact_name || 'Unknown'}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    {milestones.length > 0 && (
                        <div className="mt-4 space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span>Milestone Progress</span>
                                <span className="text-purple-300">{completedMilestones}/{milestones.length} · {progressPct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-400 transition-all"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">

                    {/* ── Milestones ── */}
                    <Section title="Milestones" icon={CheckCheck}>
                        <div className="space-y-2">
                            {milestones.map(m => (
                                <div
                                    key={m.id}
                                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/5 group"
                                >
                                    <button
                                        onClick={() => handleToggleMilestone(m)}
                                        className="flex items-center gap-2 flex-1 text-left text-xs font-bold cursor-pointer"
                                    >
                                        {m.completed
                                            ? <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                                            : <Circle size={16} className="text-slate-500 flex-shrink-0" />}
                                        <span className={m.completed ? 'line-through text-slate-500' : 'text-white'}>{m.name}</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMilestone(m.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Milestone */}
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                value={newMilestoneName}
                                onChange={e => setNewMilestoneName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddMilestone()}
                                placeholder="Add new milestone..."
                                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                            />
                            <button
                                onClick={handleAddMilestone}
                                disabled={submitting === 'milestone'}
                                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1"
                            >
                                {submitting === 'milestone' ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                                Add
                            </button>
                        </div>
                    </Section>

                    {/* ── Deliverable Files ── */}
                    <Section title="Deliverable Files" icon={Upload}>
                        <div className="space-y-2">
                            {files.length === 0 && (
                                <p className="text-xs text-slate-500 text-center py-2">No files uploaded yet</p>
                            )}
                            {files.map(f => (
                                <div key={f.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/5 group">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileText size={14} className="text-purple-400 flex-shrink-0" />
                                        <span className="text-xs font-bold text-white truncate">{f.label || f.file?.split('/').pop()}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteFile(f.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={submitting === 'file'}
                            className="w-full py-3 rounded-xl border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 text-purple-400 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-purple-500/5"
                        >
                            {submitting === 'file'
                                ? <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                                : <><Upload size={14} /> Click to Upload Deliverable File</>}
                        </button>
                    </Section>

                    {/* ── Send Proposal ── */}
                    <Section title="Send Proposal to Client" icon={FileText}>
                        <textarea
                            rows={5}
                            value={proposalText}
                            onChange={e => setProposalText(e.target.value)}
                            placeholder={`Dear ${project.client_profile?.contact_name || 'Client'},\n\nThank you for your project. Here is my proposal for...\n\nBest regards`}
                            className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-white/10 text-white text-xs outline-none focus:border-purple-500 font-mono resize-none"
                        />
                        <button
                            onClick={handleSendProposal}
                            disabled={submitting === 'proposal' || !proposalText.trim()}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                        >
                            {submitting === 'proposal'
                                ? <><Loader2 size={14} className="animate-spin" /> Sending...</>
                                : <><Send size={14} /> Send Proposal</>}
                        </button>
                    </Section>

                    {/* ── Send Invoice ── */}
                    <Section title="Create & Send Invoice" icon={Receipt}>
                        <div className="space-y-2">
                            {invoiceItems.map((item, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={e => setInvoiceItems(prev => prev.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))}
                                        placeholder="Description"
                                        className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs outline-none"
                                    />
                                    <div className="relative w-28">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">$</span>
                                        <input
                                            type="number"
                                            value={item.amount}
                                            onChange={e => setInvoiceItems(prev => prev.map((x, i) => i === idx ? { ...x, amount: e.target.value } : x))}
                                            placeholder="0"
                                            className="w-full pl-6 pr-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs outline-none"
                                        />
                                    </div>
                                    {invoiceItems.length > 1 && (
                                        <button onClick={() => setInvoiceItems(prev => prev.filter((_, i) => i !== idx))} className="text-red-400 cursor-pointer">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setInvoiceItems(prev => [...prev, { description: '', amount: 0 }])}
                            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                        >
                            <Plus size={12} /> Add line item
                        </button>

                        <textarea
                            rows={2}
                            value={invoiceNote}
                            onChange={e => setInvoiceNote(e.target.value)}
                            placeholder="Optional notes to the client..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs outline-none"
                        />

                        <div className="flex items-center justify-between">
                            <div className="text-xs font-black text-white">
                                Total: <span className="text-purple-300">${invoiceTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleSendInvoice}
                                disabled={submitting === 'invoice' || invoiceTotal <= 0}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                            >
                                {submitting === 'invoice'
                                    ? <><Loader2 size={14} className="animate-spin" /> Sending...</>
                                    : <><Receipt size={14} /> Send Invoice</>}
                            </button>
                        </div>
                    </Section>

                    {/* ── Mark Complete ── */}
                    {project.status !== 'completed' && (
                        <Section title="Mark Project Complete" icon={CheckCircle2}>
                            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                                <div className="flex items-start gap-2 text-xs text-emerald-300">
                                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                                    <span>Marking as complete will notify the client for acceptance. Ensure all milestones and files are uploaded before proceeding.</span>
                                </div>
                                <textarea
                                    rows={2}
                                    value={completionNote}
                                    onChange={e => setCompletionNote(e.target.value)}
                                    placeholder="Optional completion note to the client..."
                                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs outline-none"
                                />
                                <button
                                    onClick={handleMarkComplete}
                                    disabled={submitting === 'complete'}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/20 cursor-pointer"
                                >
                                    {submitting === 'complete'
                                        ? <><Loader2 size={14} className="animate-spin" /> Updating...</>
                                        : <><CheckCircle2 size={16} /> Mark Project as Completed</>}
                                </button>
                            </div>
                        </Section>
                    )}

                    {project.status === 'completed' && (
                        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 text-xs font-bold">
                            <CheckCircle2 size={18} />
                            This project has been marked as completed.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
