'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, X, Edit3, Calendar, User, Loader2, AlertCircle,
    CheckCircle2, Circle, ChevronRight, LayoutGrid, List, Plus, Tag, ChevronDown, SlidersHorizontal, Upload, Trash2, Download, Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import AdminModal from '@/components/AdminModal';
import ConfirmDangerModal from '@/components/ConfirmDangerModal';

const STAGES = ['Analysis', 'Architecture', 'Dev', 'QA', 'Staging', 'Complete'];

const STAGE_META = {
    'Analysis': { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    'Architecture': { color: 'text-brand-indigo', bg: 'bg-brand-indigo/10', border: 'border-brand-indigo/20' },
    'Dev': { color: 'text-brand-teal', bg: 'bg-brand-teal/10', border: 'border-brand-teal/20' },
    'QA': { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    'Staging': { color: 'text-brand-blue', bg: 'bg-brand-blue/10', border: 'border-brand-blue/20' },
    'Complete': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
};

const PRIORITY_DOT = { Critical: 'bg-brand-red', High: 'bg-orange-400', Medium: 'bg-yellow-400', Low: 'bg-slate-600' };
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];

function FilterSelect({ label, value, onChange, options, icon: Icon }) {
    return (
        <div className="group relative">
            <label className="sr-only">{label}</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon size={14} className="text-text-dim group-focus-within:text-brand-teal transition-colors" />
            </div>
            <select
                value={value}
                onChange={onChange}
                className="cursor-pointer appearance-none bg-surface-900/60 border border-border-subtle hover:border-border-light focus:border-brand-teal/50 focus:outline-none rounded-xl pl-9 pr-9 py-1.5 sm:py-2 text-[10px] sm:text-[11px] text-text-primary font-black uppercase tracking-widest transition-all backdrop-blur-md"
                aria-label={label}
            >
                {options.map(o => (
                    <option key={o.value} value={o.value} className="bg-surface-900 text-text-primary">
                        {o.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown size={14} className="text-text-dim group-focus-within:text-brand-teal transition-colors" />
            </div>
        </div>
    );
}

function formatBytes(bytes) {
    const n = Number(bytes);
    if (!Number.isFinite(n) || n <= 0) return '—';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
    const value = n / (1024 ** i);
    const decimals = i >= 2 ? 2 : 0;
    return `${value.toFixed(decimals)} ${units[i]}`;
}

const getStatusClasses = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
        case 'active':
            return 'bg-brand-teal/10 text-brand-teal border-brand-teal/20';
        case 'complete':
            return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
        case 'cancelled':
            return 'bg-brand-red/10 text-brand-red border-brand-red/20';
        default:
            return 'bg-white/5 text-primary border-white/10';
    }
};

// ─── Kanban Column ───────────────────────────────────────────────────────────
function KanbanColumn({ stage, projects }) {
    const meta = STAGE_META[stage] || { color: 'text-text-muted', bg: 'bg-white/5', border: 'border-white/5' };
    return (
        <div className="w-full min-w-0 sm:min-w-[240px] sm:flex-1">
            <div className={`flex items-center gap-2 mb-3 px-3 py-1.5 rounded-xl ${meta.bg} border ${meta.border}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${meta.color}`}>{stage}</span>
                <span className={`ml-auto text-[10px] font-black ${meta.color}`}>{projects.length}</span>
            </div>
            <div className="space-y-2">
                {projects.map(p => (
                    <Link key={p.id} href={`/admin/projects/${p.id}`}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 cursor-pointer group transition-all block">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[p.priority] || 'bg-slate-600'}`} />
                                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest truncate">{p.priority || 'Medium'}</span>
                            </div>
                            <span className="text-[9px] font-black text-text-dim uppercase shrink-0 flex items-center gap-1">
                                <span>{p.id}</span>
                                <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${getStatusClasses(p.status)}`}>
                                    {p.status}
                                </span>
                            </span>
                        </div>
                        <p className="text-xs font-black text-text-primary group-hover:text-brand-teal transition-colors leading-tight mb-2">{p.title}</p>
                        <div className="flex items-center gap-1.5 mb-2.5">
                            <User size={10} className="text-text-muted" />
                            <span className="text-[10px] text-text-muted font-bold">{p.client_name || '—'}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div style={{ width: `${p.progress || 0}%` }}
                                className={`h-full rounded-full transition-all duration-500 ease-out ${p.progress === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`} />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[9px] font-black text-text-dim">{p.progress || 0}%</span>
                            <span className="text-[9px] font-black text-brand-teal">${Number(p.value || 0).toLocaleString()}</span>
                        </div>
                    </Link>
                ))}
                {projects.length === 0 && (
                    <div className="flex items-center justify-center h-16 rounded-xl border border-dashed border-white/5 text-[10px] text-text-dim font-black uppercase tracking-widest">
                        Empty
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── List Row ────────────────────────────────────────────────────────────────
function MobileProjectCard({ p, i }) {
    const meta = STAGE_META[p.stage] || { color: 'text-text-muted', bg: 'bg-white/5', border: 'border-white/5' };
    return (
        <Link href={`/admin/projects/${p.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer block"
            >
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[p.priority] || 'bg-slate-600'}`} />
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{p.priority || 'Medium'}</span>
                        </div>
                        <div className="text-sm font-black text-text-primary leading-tight truncate">{p.title}</div>
                        <div className="text-[10px] text-text-muted font-bold truncate mt-0.5">{p.client_name || '—'}</div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                        <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest">{p.id}</div>
                        <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${meta.bg} ${meta.color} ${meta.border}`}>
                            {p.stage}
                        </div>
                        <div className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-white/5 text-text-muted border-white/5">
                            {p.priority || 'Medium'}
                        </div>
                    </div>
                </div>

                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progress || 0}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className={`h-full rounded-full ${(p.progress || 0) === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`}
                    />
                </div>
                <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] font-black text-text-dim uppercase">{p.progress || 0}%</span>
                    <span className="text-[10px] font-black text-brand-teal">${Number(p.value || 0).toLocaleString()}</span>
                </div>
            </motion.div>
        </Link>
    );
}

function ListRow({ p, i }) {
    const meta = STAGE_META[p.stage] || { color: 'text-text-muted', bg: 'bg-white/5', border: 'border-white/5' };
    const stageIndex = STAGES.indexOf(p.stage);
    const milestones = p.milestones || [];
    return (
        <Link href={`/admin/projects/${p.id}`} className="block">
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="lg:w-[35%]">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[p.priority] || 'bg-slate-600'}`} />
                            <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest">{p.id}</span>
                        </div>
                        <h3 className="text-base font-black text-text-primary group-hover:text-brand-teal transition-colors uppercase leading-tight mb-1.5">{p.title}</h3>
                        <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-black text-text-muted uppercase">{p.priority || 'Medium'}</span>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-black text-text-muted uppercase">{p.client_name || '—'}</span>
                        </div>
                    </div>

                    {/* Stage pipeline */}
                    <div className="flex-grow">
                        <div className="hidden md:flex items-center mb-2">
                            {STAGES.map((s, si) => (
                                <div key={s} className="flex items-center flex-1 min-w-0">
                                    <div className={`shrink-0 w-2.5 h-2.5 rounded-full border-2 ${si < stageIndex ? 'bg-brand-teal border-brand-teal' : si === stageIndex ? 'bg-brand-teal/30 border-brand-teal animate-pulse' : 'bg-white/5 border-white/10'}`} />
                                    {si < STAGES.length - 1 && <div className={`flex-1 h-px ${si < stageIndex ? 'bg-brand-teal' : 'bg-white/10'}`} />}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mb-1.5">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${meta.color}`}>{p.stage}</span>
                            <span className="text-[10px] font-black text-text-primary">{p.progress || 0}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress || 0}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                                className={`h-full rounded-full ${(p.progress || 0) === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`} />
                        </div>
                    </div>

                    <div className="lg:w-44 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3">
                        <div className="text-right">
                            <div className="text-sm font-black text-brand-teal">${Number(p.value || 0).toLocaleString()}</div>
                            <div className="flex items-center gap-1 justify-end mt-0.5">
                                <Calendar size={10} className="text-text-dim" />
                                <div className="text-[10px] font-black text-text-dim uppercase">{p.deadline || '—'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-text-primary text-[10px] font-black uppercase tracking-widest transition-all">
                            View <ChevronRight size={10} />
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/5 px-5 py-3 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex gap-2 overflow-x-auto">
                        {milestones.length > 0 ? (
                            milestones.slice(0, 5).map((m, mi) => (
                                <div key={mi} className={`flex items-center gap-1.5 shrink-0 text-[7px] font-black uppercase tracking-widest ${m.done ? 'text-emerald-400' : 'text-dim'}`}>
                                    {m.done ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                    {m.label}
                                    {mi < milestones.slice(0, 5).length - 1 && <span className="ml-1 text-slate-800">›</span>}
                                </div>
                            ))
                        ) : (
                            <span className="text-[7px] font-black uppercase tracking-widest text-muted">No Milestones</span>
                        )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${getStatusClasses(p.status)}`}>
                        {p.status}
                    </span>
                </div>
            </motion.div>
        </Link>
    );
}

// ─── Detail Drawer ───────────────────────────────────────────────────────────
function ProjectDrawer({ project, onClose, onToggleMilestone, onDeleteMilestone, onAddMilestone, onUpdateProject, onAddNote, onDeleteNote, onUploadFile, onDeleteFile, onToast }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [noteLoading, setNoteLoading] = useState(false);
    const [newMilestoneLabel, setNewMilestoneLabel] = useState('');
    const [fileUploading, setFileUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [billingTab, setBillingTab] = useState('invoices'); // invoices | proposals
    const [billingLoading, setBillingLoading] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [createProposalOpen, setCreateProposalOpen] = useState(false);
    const [proposalForm, setProposalForm] = useState({ title: '', body_md: '' });
    const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({ due_date: '', notes: '', currency: 'usd', item_description: 'Deposit', item_amount: '' });
    const [addItemOpen, setAddItemOpen] = useState(false);
    const [addItemForm, setAddItemForm] = useState({ invoiceId: null, description: '', amount: '' });
    const [billingConfirm, setBillingConfirm] = useState({ open: false, kind: null, invoice: null });
    const [billingActionLoading, setBillingActionLoading] = useState(false);

    const centsToMoney = (cents) => {
        const n = Number(cents || 0) / 100;
        return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const refreshBilling = useCallback(async () => {
        setBillingLoading(true);
        try {
            const [p, i] = await Promise.all([
                api.getAdminProjectProposals(project.id),
                api.getAdminProjectInvoices(project.id),
            ]);
            setProposals(Array.isArray(p) ? p : p.results || []);
            setInvoices(Array.isArray(i) ? i : i.results || []);
        } finally {
            setBillingLoading(false);
        }
    }, [project.id]);

    useEffect(() => {
        refreshBilling();
    }, [refreshBilling]);

    const handleCreateProposal = async (e) => {
        e?.preventDefault?.();
        const title = (proposalForm.title || '').trim();
        if (!title) return;
        try {
            await api.createAdminProjectProposal(project.id, {
                title,
                body_md: proposalForm.body_md || '',
                status: 'draft',
            });
            setCreateProposalOpen(false);
            setProposalForm({ title: '', body_md: '' });
            await refreshBilling();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateInvoice = async (e) => {
        e?.preventDefault?.();
        try {
            const inv = await api.createAdminProjectInvoice(project.id, {
                currency: invoiceForm.currency || 'usd',
                due_date: invoiceForm.due_date || null,
                notes: invoiceForm.notes || '',
                status: 'draft',
            });
            const amount = Number(invoiceForm.item_amount);
            if (Number.isFinite(amount) && amount > 0) {
                await api.createAdminInvoiceItem(project.id, inv.id, {
                    description: (invoiceForm.item_description || 'Service').trim() || 'Service',
                    quantity: 1,
                    unit_amount_cents: Math.round(amount * 100),
                });
            }
            setCreateInvoiceOpen(false);
            setInvoiceForm({ due_date: '', notes: '', currency: 'usd', item_description: 'Deposit', item_amount: '' });
            await refreshBilling();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddInvoiceItem = async (e) => {
        e?.preventDefault?.();
        const invoiceId = addItemForm.invoiceId;
        if (!invoiceId) return;
        const description = (addItemForm.description || '').trim();
        const amount = Number(addItemForm.amount);
        if (!description || !Number.isFinite(amount) || amount <= 0) return;
        try {
            await api.createAdminInvoiceItem(project.id, invoiceId, {
                description,
                quantity: 1,
                unit_amount_cents: Math.round(amount * 100),
            });
            setAddItemOpen(false);
            setAddItemForm({ invoiceId: null, description: '', amount: '' });
            await refreshBilling();
        } catch (err) {
            console.error(err);
        }
    };
    const [editForm, setEditForm] = useState({
        title: project.title || '',
        description: project.description || '',
        value: project.value || 0,
        deadline: project.deadline || '',
        priority: project.priority || 'Medium',
        stage: project.stage || 'Dev',
        tagsStr: (project.tags || []).join(', ')
    });

    const handleAddNewMilestone = (e) => {
        e.preventDefault();
        if (!newMilestoneLabel.trim()) return;
        onAddMilestone(project.id, newMilestoneLabel.trim());
        setNewMilestoneLabel('');
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        onUpdateProject(project.id, editForm);
        setIsEditing(false);
    };

    const handlePickFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        setFileUploading(true);
        try {
            await onUploadFile(project.id, file);
        } finally {
            setFileUploading(false);
        }
    };
    const getApiBaseUrl = () => {
        if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;
        if (typeof window !== "undefined") {
            const host = window.location.hostname;
            if (host === "drpythonsolutions.com" || host === "www.drpythonsolutions.com") {
                return "https://api.drpythonsolutions.com";
            }
        }
        return "http://localhost:8000";
    };
    const API_BASE_URL = getApiBaseUrl().replace(/\/$/, "");
    const resolveBackendUrl = (url) => {
        if (!url) return '';
        return url.startsWith('/') ? `${API_BASE_URL}${url}` : url;
    };

    const handleDownload = async (url, filename) => {
        const finalUrl = resolveBackendUrl(url);
        if (!finalUrl) return;
        try {
            const res = await fetch(finalUrl);
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = filename || 'download';
            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(objectUrl);
        } catch (e) {
            window.open(finalUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const handleSubmitNote = async (e) => {
        e.preventDefault();
        if (!noteText.trim()) return;
        setNoteLoading(true);
        await onAddNote(project.id, noteText.trim());
        setNoteText('');
        setIsAddingNote(false);
        setNoteLoading(false);
    };

    const meta = STAGE_META[project.stage] || { color: 'text-text-muted', bg: 'bg-white/5', border: 'border-white/5' };
    const milestones = project.milestones || [];
    const files = project.files || [];
    const activities = project.activities || [];
    const isNoteLog = (log) => (log?.action_text || '').includes('Note:');
    const notes = activities.filter(isNoteLog);
    const nonNoteActivities = activities.filter((log) => !isNoteLog(log));
    const tags = project.tags || [];
    const completedCount = milestones.filter(m => m.done).length;

    return (
        <AdminModal
            open
            onClose={onClose}
            title={isEditing ? 'Edit Project Protocols' : project.title}
            subtitle={`${project.id} • ${project.client_name || '—'}`}
            maxWidthClass="max-w-5xl"
            footer={
                !isEditing ? (
                    <div className="space-y-2">
                        {isAddingNote && (
                            <form onSubmit={handleSubmitNote} className="flex gap-2 pb-2">
                                <input
                                    type="text"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Type a note for the activity log..."
                                    autoFocus
                                    className="flex-grow bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50"
                                />
                                <button
                                    type="submit"
                                    disabled={noteLoading || !noteText.trim()}
                                    className="px-3.5 py-2 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-[10px] hover:-translate-y-0.5 transition-all shadow-glow-teal shrink-0 disabled:opacity-50"
                                >
                                    {noteLoading ? <Loader2 size={12} className="animate-spin" /> : 'Post'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsAddingNote(false); setNoteText(''); }}
                                    className="px-3 py-2 bg-white/5 border border-white/5 text-text-muted rounded-xl font-black text-[10px] hover:bg-white/10 transition-all shrink-0"
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setIsEditing(true)}
                                className="py-2.5 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal">
                                <Edit3 size={12} /> Edit Project
                            </button>
                            <button
                                onClick={() => setIsAddingNote(v => !v)}
                                className={`py-2.5 border text-text-primary rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${isAddingNote
                                    ? 'bg-brand-indigo/20 border-brand-indigo/30 text-brand-indigo'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <Plus size={12} /> Add Note
                            </button>
                        </div>
                    </div>
                ) : null
            }
        >
            <div className="flex flex-col">

                {/* Header */}
                <div className="p-5 border-b border-border-subtle sticky top-0 bg-surface-900 z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em]">{project.id}</span>
                            <h2 className="text-xl font-black text-text-primary uppercase leading-tight mt-1">
                                {isEditing ? 'Edit Project Protocols' : project.title}
                            </h2>
                            <p className="text-xs text-text-muted mt-1">{project.client_name || '—'}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">Protocol</span>
                        </div>
                    </div>
                    {/* Mini stats */}
                    {!isEditing && (
                        <div className="grid grid-cols-3 gap-2">
                            {[['Value', `$${Number(project.value || 0).toLocaleString()}`, 'text-brand-teal'], ['Deadline', project.deadline || '—', 'text-text-primary'], ['Progress', `${project.progress || 0}%`, 'text-text-primary']].map(([l, v, c]) => (
                                <div key={l} className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <div className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-0.5">{l}</div>
                                    <div className={`text-sm font-black ${c}`}>{v}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto p-5 space-y-5">
                    {isEditing ? (
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Title</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Project Brief</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    rows="4"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 resize-y font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Investment Value ($)</label>
                                    <input
                                        type="number"
                                        value={editForm.value}
                                        onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Deadline Date</label>
                                    <input
                                        type="date"
                                        value={editForm.deadline}
                                        onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Priority</label>
                                    <select
                                        value={editForm.priority}
                                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                        className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Project Stage</label>
                                    <select
                                        value={editForm.stage}
                                        onChange={(e) => setEditForm({ ...editForm, stage: e.target.value })}
                                        className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                                    >
                                        {STAGES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1.5">
                                    <Tag size={10} /> Tech Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={editForm.tagsStr}
                                    onChange={(e) => setEditForm({ ...editForm, tagsStr: e.target.value })}
                                    placeholder="Python, Django, PostgreSQL..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                                />
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-white/5">
                                <button type="submit"
                                    className="flex-grow py-2.5 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal">
                                    Save Protocol Changes
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)}
                                    className="px-5 py-2.5 bg-white/5 border border-white/5 text-text-primary rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            {/* Stage badge */}
                            <div className="flex flex-wrap gap-2">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-widest border ${meta.bg} ${meta.color} ${meta.border}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                    Current Stage: {project.stage}
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-widest border bg-white/5 text-text-primary border-white/10">
                                    <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[project.priority] || 'bg-slate-600'}`} />
                                    Priority: {project.priority || 'Medium'}
                                </div>
                            </div>

                            {/* Description */}
                            {project.description && (
                                <div>
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Brief</div>
                                    <p className="text-base text-text-secondary leading-relaxed italic">&ldquo;{project.description}&rdquo;</p>
                                </div>
                            )}

                            {/* Milestones */}
                            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Project Milestones</div>
                                    {milestones.length > 0 && (
                                        <span className="text-[10px] font-black text-brand-teal">{completedCount}/{milestones.length} Done</span>
                                    )}
                                </div>

                                {milestones.length > 0 ? (
                                    <div className="space-y-2">
                                        {milestones.map((m, mi) => (
                                            <div key={m.id || mi} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${m.done ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                                                <button
                                                    onClick={() => onToggleMilestone(project.id, m.id, m.done)}
                                                    className={`shrink-0 p-0.5 rounded-lg hover:bg-white/5 transition-all text-left ${m.done ? 'text-emerald-400' : 'text-text-dim hover:text-text-primary'}`}
                                                    title={m.done ? "Mark as Pending" : "Mark as Done"}
                                                >
                                                    {m.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                                </button>
                                                <span className={`text-xs font-bold flex-grow ${m.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>{m.label}</span>
                                                <button
                                                    onClick={() => onDeleteMilestone(project.id, m.id, m.label)}
                                                    className="shrink-0 p-1.5 rounded-lg hover:bg-white/5 transition-all text-text-dim hover:text-brand-red"
                                                    title="Delete milestone"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-text-dim italic mb-3 ml-1">No milestones established for this project.</p>
                                )}

                                {/* Add Milestone Form */}
                                <form onSubmit={handleAddNewMilestone} className="flex gap-2 pt-2 border-t border-white/5">
                                    <input
                                        type="text"
                                        value={newMilestoneLabel}
                                        onChange={(e) => setNewMilestoneLabel(e.target.value)}
                                        placeholder="Establish new milestone label..."
                                        className="flex-grow bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50"
                                    />
                                    <button
                                        type="submit"
                                        className="px-3.5 py-2 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-[10px] hover:-translate-y-0.5 transition-all shadow-glow-teal shrink-0"
                                    >
                                        Add
                                    </button>
                                </form>
                            </div>

                            {/* Tech stack */}
                            {tags.length > 0 && (
                                <div>
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Tech Stack</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.map(t => (
                                            <span key={t} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-text-primary uppercase tracking-widest">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Deliverables */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Deliverables</div>
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileSelected}
                                    />
                                    <button
                                        onClick={handlePickFile}
                                        disabled={fileUploading}
                                        className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary hover:border-border-light transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-60"
                                    >
                                        {fileUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                        Upload
                                    </button>
                                </div>
                            </div>
                            {files.length > 0 && (
                                <div>
                                    <div className="space-y-2 mb-3">
                                        {files.map((f, fi) => (
                                            <div key={f.id || fi} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                                                <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal text-[9px] font-black uppercase">
                                                    {f.name?.split('.').pop() || 'file'}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <div className="text-xs font-bold text-text-primary truncate">{f.name}</div>
                                                    <div className="text-[9px] font-black text-text-muted uppercase">{formatBytes(f.size)}</div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteFile?.(project.id, f.id, f.name)}
                                                    className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-brand-red transition-all"
                                                    title="Delete"
                                                    aria-label="Delete file"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDownload(f.file_url || f.file, f.name)}
                                                    className="p-2 rounded-lg bg-white/5 text-text-muted hover:text-text-primary transition-all"
                                                    title="Download"
                                                >
                                                    <Download size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {files.length === 0 && (
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-[10px] text-text-dim font-black uppercase tracking-widest">
                                    No files yet
                                </div>
                            )}

                            {/* Billing */}
                            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Billing</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => setBillingTab('invoices')}
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${billingTab === 'invoices' ? 'bg-brand-teal/20 text-brand-teal' : 'text-text-muted hover:text-text-primary'
                                                    }`}
                                            >
                                                Invoices
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setBillingTab('proposals')}
                                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${billingTab === 'proposals' ? 'bg-brand-teal/20 text-brand-teal' : 'text-text-muted hover:text-text-primary'
                                                    }`}
                                            >
                                                Proposals
                                            </button>
                                        </div>
                                        {billingTab === 'invoices' ? (
                                            <button
                                                type="button"
                                                onClick={() => setCreateInvoiceOpen(true)}
                                                className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary hover:border-border-light transition-all text-[10px] font-black uppercase tracking-widest"
                                            >
                                                + Invoice
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setCreateProposalOpen(true)}
                                                className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-primary hover:border-border-light transition-all text-[10px] font-black uppercase tracking-widest"
                                            >
                                                + Proposal
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {billingLoading ? (
                                    <div className="flex items-center gap-2 text-xs text-text-muted font-bold">
                                        <Loader2 size={14} className="animate-spin" /> Loading billing…
                                    </div>
                                ) : billingTab === 'invoices' ? (
                                    <div className="space-y-2">
                                        {invoices.length === 0 && (
                                            <div className="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-[10px] text-text-dim font-black uppercase tracking-widest">
                                                No invoices yet
                                            </div>
                                        )}
                                        {invoices.map(inv => (
                                            <div key={inv.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-black text-text-primary">{inv.number}</div>
                                                        <div className="text-[10px] font-black text-text-dim uppercase tracking-widest mt-0.5">
                                                            {inv.status} • {inv.currency?.toUpperCase?.() || 'USD'} {centsToMoney(inv.amount_total_cents)}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => setBillingConfirm({ open: true, kind: 'send_invoice', invoice: inv })}
                                                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-primary hover:bg-white/10 transition-all"
                                                            title={inv.status === 'draft' ? 'Mark as sent' : 'Resend'}
                                                        >
                                                            {inv.status === 'draft' ? 'Send' : 'Resend'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setBillingConfirm({ open: true, kind: 'toggle_paid', invoice: inv })}
                                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${inv.status === 'paid'
                                                                ? 'bg-brand-red/10 border border-brand-red/20 text-brand-red hover:bg-brand-red/15'
                                                                : 'bg-brand-teal/10 border border-brand-teal/20 text-brand-teal hover:bg-brand-teal/15'
                                                                }`}
                                                            title={inv.status === 'paid' ? 'Mark as unpaid' : 'Mark as paid'}
                                                        >
                                                            {inv.status === 'paid' ? 'Unpaid' : 'Paid'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setAddItemForm({ invoiceId: inv.id, description: '', amount: '' }) || setAddItemOpen(true)}
                                                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-primary hover:bg-white/10 transition-all"
                                                            title="Add item"
                                                        >
                                                            + Item
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => { const t = localStorage.getItem('access_token') || ''; const q = t ? `?token=${encodeURIComponent(t)}` : ''; window.open(resolveBackendUrl(`/admin/projects/${project.id}/invoices/${inv.id}/print/${q}`), '_blank', 'noopener,noreferrer'); }}
                                                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-primary hover:bg-white/10 transition-all"
                                                            title="Open printable invoice"
                                                        >
                                                            Print
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {proposals.length === 0 && (
                                            <div className="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-[10px] text-text-dim font-black uppercase tracking-widest">
                                                No proposals yet
                                            </div>
                                        )}
                                        {proposals.map(p => (
                                            <div key={p.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-black text-text-primary truncate">{p.title}</div>
                                                        <div className="text-[10px] font-black text-text-dim uppercase tracking-widest mt-0.5">{p.status}</div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <button
                                                            type="button"
                                                            onClick={async () => { await api.sendAdminProposal(p.id); await refreshBilling(); }}
                                                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-primary hover:bg-white/10 transition-all"
                                                            title="Mark as sent"
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <AdminModal
                                open={billingConfirm.open}
                                onClose={() => (billingActionLoading ? null : setBillingConfirm({ open: false, kind: null, invoice: null }))}
                                title={billingConfirm.kind === 'send_invoice'
                                    ? (billingConfirm.invoice?.status === 'draft' ? 'Send Invoice' : 'Resend Invoice')
                                    : 'Update Payment Status'}
                                subtitle={billingConfirm.invoice?.number || 'Are you sure?'}
                                icon={AlertCircle}
                                maxWidthClass="max-w-md"
                                footer={
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setBillingConfirm({ open: false, kind: null, invoice: null })}
                                            disabled={billingActionLoading}
                                            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all disabled:opacity-60"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            disabled={billingActionLoading}
                                            onClick={async () => {
                                                const inv = billingConfirm.invoice;
                                                if (!inv) return;
                                                try {
                                                    setBillingActionLoading(true);
                                                    if (billingConfirm.kind === 'send_invoice') {
                                                        await api.sendAdminInvoice(project.id, inv.id);
                                                        onToast?.(inv.status === 'draft' ? 'Invoice marked as sent' : 'Invoice resent');
                                                    } else if (billingConfirm.kind === 'toggle_paid') {
                                                        if (inv.status === 'paid') {
                                                            await api.markAdminInvoiceUnpaid(project.id, inv.id);
                                                            onToast?.('Invoice marked as unpaid');
                                                        } else {
                                                            await api.markAdminInvoicePaid(project.id, inv.id);
                                                            onToast?.('Invoice marked as paid');
                                                        }
                                                    }
                                                    await refreshBilling();
                                                    setBillingConfirm({ open: false, kind: null, invoice: null });
                                                } catch (err) {
                                                    onToast?.(err?.message || 'Action failed', 'error');
                                                } finally {
                                                    setBillingActionLoading(false);
                                                }
                                            }}
                                            className={`px-3.5 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 disabled:opacity-60 ${billingConfirm.kind === 'send_invoice'
                                                ? 'bg-brand-teal text-text-primary hover:-translate-y-0.5 shadow-glow-teal'
                                                : (billingConfirm.invoice?.status === 'paid'
                                                    ? 'bg-brand-red/15 border border-brand-red/30 text-brand-red hover:bg-brand-red/25'
                                                    : 'bg-brand-teal text-text-primary hover:-translate-y-0.5 shadow-glow-teal')
                                                }`}
                                        >
                                            {billingActionLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                                            {billingConfirm.kind === 'send_invoice'
                                                ? (billingConfirm.invoice?.status === 'draft' ? 'Send' : 'Resend')
                                                : 'Confirm'}
                                        </button>
                                    </div>
                                }
                            >
                                <div className="p-5">
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="text-xs font-bold text-text-secondary">
                                            {billingConfirm.kind === 'send_invoice'
                                                ? (billingConfirm.invoice?.status === 'draft'
                                                    ? 'This will set the invoice status to SENT and set the issued date. You can then share the Print link with the client.'
                                                    : 'This will resend the invoice. You can also share the Print link with the client.')
                                                : (billingConfirm.invoice?.status === 'paid'
                                                    ? 'This will mark the invoice as UNPAID (clears paid date).'
                                                    : 'This will mark the invoice as PAID (sets paid date).')}
                                        </div>
                                    </div>
                                </div>
                            </AdminModal>

                            {/* Activity log */}
                            {notes.length > 0 && (
                                <div>
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Notes</div>
                                    <div className="space-y-3">
                                        {notes.map((log, li) => {
                                            const raw = log.action_text || '';
                                            const text = raw.includes('Note:') ? raw.split('Note:').slice(1).join('Note:').trim() : raw;
                                            return (
                                                <div key={log.id || li} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">
                                                            {new Date(log.timestamp).toLocaleString()}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => onDeleteNote(project.id, log.id)}
                                                            className="shrink-0 p-1.5 rounded-lg hover:bg-white/5 transition-all text-text-dim hover:text-brand-red"
                                                            title="Delete note"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="text-xs text-text-secondary">{text}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Activity log */}
                            {nonNoteActivities.length > 0 && (
                                <div>
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Activity Log</div>
                                    <div className="space-y-3 border-l border-white/5 ml-2 pl-4">
                                        {nonNoteActivities.map((log, li) => (
                                            <div key={log.id || li} className="relative">
                                                <div className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal" />
                                                <div className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-0.5">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                                <div className="text-xs text-text-secondary">{log.action_text}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>

            <AdminModal
                open={createProposalOpen}
                onClose={() => setCreateProposalOpen(false)}
                title="New Proposal"
                subtitle={`${project.id} • ${project.client_name || '—'}`}
                maxWidthClass="max-w-2xl"
                footer={
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setCreateProposalOpen(false)}
                            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateProposal}
                            className="px-3.5 py-2 rounded-xl bg-brand-teal text-text-primary font-black uppercase tracking-widest text-[10px] hover:-translate-y-0.5 transition-all shadow-glow-teal"
                        >
                            Create
                        </button>
                    </div>
                }
            >
                <div className="p-5 space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-dim ml-1">Title</label>
                        <input
                            value={proposalForm.title}
                            onChange={(e) => setProposalForm(p => ({ ...p, title: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                            placeholder="Website Proposal"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-dim ml-1">Body (Markdown)</label>
                        <textarea
                            value={proposalForm.body_md}
                            onChange={(e) => setProposalForm(p => ({ ...p, body_md: e.target.value }))}
                            className="w-full min-h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                            placeholder="Scope, timeline, milestones (50/30/20), revision policy…"
                        />
                    </div>
                </div>
            </AdminModal>

            <AdminModal
                open={createInvoiceOpen}
                onClose={() => setCreateInvoiceOpen(false)}
                title="New Invoice"
                subtitle={`${project.id} • ${project.client_name || '—'}`}
                maxWidthClass="max-w-2xl"
                footer={
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setCreateInvoiceOpen(false)}
                            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateInvoice}
                            className="px-3.5 py-2 rounded-xl bg-brand-teal text-text-primary font-black uppercase tracking-widest text-[10px] hover:-translate-y-0.5 transition-all shadow-glow-teal"
                        >
                            Create
                        </button>
                    </div>
                }
            >
                <div className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-text-dim ml-1">Currency</label>
                            <select
                                value={invoiceForm.currency}
                                onChange={(e) => setInvoiceForm(f => ({ ...f, currency: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                            >
                                <option value="usd">USD</option>
                                <option value="bdt">BDT</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-text-dim ml-1">Due Date</label>
                            <input
                                type="date"
                                value={invoiceForm.due_date}
                                onChange={(e) => setInvoiceForm(f => ({ ...f, due_date: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-dim ml-1">Notes</label>
                        <textarea
                            value={invoiceForm.notes}
                            onChange={(e) => setInvoiceForm(f => ({ ...f, notes: e.target.value }))}
                            className="w-full min-h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                            placeholder="Payment terms, milestone details…"
                        />
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">First Item (optional)</div>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                value={invoiceForm.item_description}
                                onChange={(e) => setInvoiceForm(f => ({ ...f, item_description: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                                placeholder="Deposit 50%"
                            />
                            <input
                                value={invoiceForm.item_amount}
                                onChange={(e) => setInvoiceForm(f => ({ ...f, item_amount: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                                placeholder="Amount (e.g. 150)"
                                inputMode="decimal"
                            />
                        </div>
                    </div>
                </div>
            </AdminModal>

            <AdminModal
                open={addItemOpen}
                onClose={() => setAddItemOpen(false)}
                title="Add Invoice Item"
                subtitle={`${project.id} • ${project.client_name || '—'}`}
                maxWidthClass="max-w-lg"
                footer={
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setAddItemOpen(false)}
                            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAddInvoiceItem}
                            className="px-3.5 py-2 rounded-xl bg-brand-teal text-text-primary font-black uppercase tracking-widest text-[10px] hover:-translate-y-0.5 transition-all shadow-glow-teal"
                        >
                            Add
                        </button>
                    </div>
                }
            >
                <div className="p-5 space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-dim ml-1">Description</label>
                        <input
                            value={addItemForm.description}
                            onChange={(e) => setAddItemForm(f => ({ ...f, description: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                            placeholder="Build milestone (30%)"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-text-dim ml-1">Amount</label>
                        <input
                            value={addItemForm.amount}
                            onChange={(e) => setAddItemForm(f => ({ ...f, amount: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                            placeholder="Amount (e.g. 90)"
                            inputMode="decimal"
                        />
                    </div>
                </div>
            </AdminModal>
        </AdminModal>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminProjectsPage() {
    const [search, setSearch] = useState('');
    const [view, setView] = useState('kanban');
    const [stageFilter, setStageFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [selected, setSelected] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dangerConfirm, setDangerConfirm] = useState({ open: false, kind: null, projectId: null, id: null, label: '' });
    const [dangerLoading, setDangerLoading] = useState(false);

    useEffect(() => {
        // Default to list view on mobile to reduce horizontal density.
        if (typeof window === 'undefined') return;
        const isMobile = window.matchMedia?.('(max-width: 639px)')?.matches;
        if (isMobile) setView('list');
    }, []);

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(p => ({ ...p, show: false }));
        }, 4000);
    };

    // silent=true skips the full-page loading spinner so the drawer never unmounts
    const fetchProjects = useCallback(async (silent = false) => {
        // NOTE: This currently performs N+1 queries to fetch full project details (including milestones).
        // In a production scenario, the backend API `getAdminProjects` should be modified to return
        // all necessary details directly to avoid this performance overhead.
        try {
            if (!silent) setLoading(true);
            const summaryProjects = await api.getAdminProjects({
                stage: stageFilter || undefined,
                priority: priorityFilter || undefined,
            });
            const data = Array.isArray(summaryProjects) ? summaryProjects : summaryProjects.results || [];

            const detailedProjectsPromises = data.map(p =>
                api.getAdminProjectDetail(p.id)
            );
            const detailedProjects = await Promise.all(detailedProjectsPromises);

            setProjects(detailedProjects || []);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
            if (!silent) setError(err.message);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [stageFilter, priorityFilter]);

    useEffect(() => {
        const t = setTimeout(() => {
            fetchProjects();
        }, 0);
        return () => clearTimeout(t);
    }, [fetchProjects]);

    async function handleSelectForDetail(project) {
        try {
            const detail = await api.getAdminProjectDetail(project.id);
            setSelected(detail);
        } catch (err) {
            setSelected(project);
        }
    }

    async function handleToggleMilestone(projectId, milestoneId, currentDone) {
        try {
            const nextDone = !currentDone;
            await api.updateMilestone(projectId, milestoneId, { done: nextDone });
            const detail = await api.getAdminProjectDetail(projectId);
            setSelected(detail);
            await fetchProjects(true); // silent — keeps drawer open
            showToast(nextDone ? 'Milestone completed successfully' : 'Milestone marked as pending');
        } catch (err) {
            showToast(err.message || 'Failed to update milestone', 'error');
        }
    }

    function handleDeleteMilestone(projectId, milestoneId, milestoneLabel = '') {
        if (!milestoneId) return;
        setDangerConfirm({ open: true, kind: 'milestone', projectId, id: milestoneId, label: milestoneLabel || '' });
    }

    async function doDeleteMilestone(projectId, milestoneId) {
        await api.deleteMilestone(projectId, milestoneId);
        setSelected(prev => {
            if (!prev || prev.id !== projectId) return prev;
            const nextMilestones = Array.isArray(prev.milestones)
                ? prev.milestones.filter(m => String(m.id) !== String(milestoneId))
                : prev.milestones;
            return { ...prev, milestones: nextMilestones };
        });
        const detail = await api.getAdminProjectDetail(projectId);
        setSelected(detail);
        await fetchProjects(true);
        showToast('Milestone deleted successfully');
    }

    async function handleAddMilestone(projectId, label) {
        try {
            await api.createMilestone(projectId, label);
            const detail = await api.getAdminProjectDetail(projectId);
            setSelected(detail);
            await fetchProjects(true); // silent
            showToast('New milestone added successfully');
        } catch (err) {
            showToast(err.message || 'Failed to construct milestone', 'error');
        }
    }

    async function handleUpdateProject(projectId, formData) {
        try {
            // 1. Process tags (checks and creates if missing)
            const enteredTagNames = formData.tagsStr
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);

            const existingTags = await api.getAdminTags();
            const existingTagNamesLower = existingTags.map(t => t.name.toLowerCase());

            const finalTags = [];
            for (const name of enteredTagNames) {
                const index = existingTagNamesLower.indexOf(name.toLowerCase());
                if (index === -1) {
                    const newTag = await api.createAdminTag(name);
                    finalTags.push(newTag.name);
                } else {
                    finalTags.push(existingTags[index].name);
                }
            }

            // 2. Patch data
            const payload = {
                title: formData.title,
                description: formData.description,
                value: formData.value,
                deadline: formData.deadline || null,
                priority: formData.priority,
                stage: formData.stage,
                tags: finalTags
            };

            await api.updateAdminProject(projectId, payload);

            // Refresh detailed view & main projects list (silently — keep drawer open)
            const detail = await api.getAdminProjectDetail(projectId);
            setSelected(detail);
            await fetchProjects(true);
            showToast('Project updated successfully');
        } catch (err) {
            showToast(err.message || 'Failed to update project', 'error');
        }
    }

    async function handleAddNote(projectId, text) {
        try {
            const createdLog = await api.addProjectNote(projectId, text);
            setSelected(prev => {
                if (!prev || prev.id !== projectId) return prev;
                const nextActivities = Array.isArray(prev.activities) ? [createdLog, ...prev.activities] : [createdLog];
                return { ...prev, activities: nextActivities };
            });
            // Refresh drawer to show the new note in the activity log
            const detail = await api.getAdminProjectDetail(projectId);
            setSelected(detail);
            showToast('Note added to activity log');
        } catch (err) {
            showToast(err.message || 'Failed to add note', 'error');
        }
    }

    function handleDeleteNote(projectId, noteId) {
        if (!noteId) return;
        setDangerConfirm({ open: true, kind: 'note', projectId, id: noteId, label: '' });
    }

    async function doDeleteNote(projectId, noteId) {
        await api.deleteProjectNote(projectId, noteId);
        setSelected(prev => {
            if (!prev || prev.id !== projectId) return prev;
            const nextActivities = Array.isArray(prev.activities)
                ? prev.activities.filter(a => String(a.id) !== String(noteId))
                : prev.activities;
            return { ...prev, activities: nextActivities };
        });
        const detail = await api.getAdminProjectDetail(projectId);
        setSelected(detail);
        showToast('Note deleted successfully');
    }

    async function handleUploadFile(projectId, file) {
        try {
            const createdFile = await api.uploadAdminProjectFile(projectId, file);
            setSelected(prev => {
                if (!prev || prev.id !== projectId) return prev;
                const nextFiles = Array.isArray(prev.files) ? [createdFile, ...prev.files] : [createdFile];
                return { ...prev, files: nextFiles };
            });
            const detail = await api.getAdminProjectDetail(projectId);
            setSelected(detail);
            await fetchProjects(true);
            showToast('File uploaded successfully');
        } catch (err) {
            showToast(err.message || 'Failed to upload file', 'error');
            throw err;
        }
    }

    function handleDeleteFile(projectId, fileId, fileName = '') {
        if (!fileId) return;
        setDangerConfirm({ open: true, kind: 'file', projectId, id: fileId, label: fileName || '' });
    }

    async function doDeleteFile(projectId, fileId) {
        await api.deleteAdminProjectFile(projectId, fileId);
        setSelected(prev => {
            if (!prev || prev.id !== projectId) return prev;
            const nextFiles = Array.isArray(prev.files)
                ? prev.files.filter(f => String(f.id) !== String(fileId))
                : prev.files;
            return { ...prev, files: nextFiles };
        });
        const detail = await api.getAdminProjectDetail(projectId);
        setSelected(detail);
        await fetchProjects(true);
        showToast('File deleted successfully');
    }

    async function confirmDangerAction() {
        const { kind, projectId, id } = dangerConfirm || {};
        if (!kind || !projectId || !id) return;
        try {
            setDangerLoading(true);
            if (kind === 'file') await doDeleteFile(projectId, id);
            if (kind === 'note') await doDeleteNote(projectId, id);
            if (kind === 'milestone') await doDeleteMilestone(projectId, id);
            setDangerConfirm({ open: false, kind: null, projectId: null, id: null, label: '' });
        } catch (err) {
            showToast(err.message || 'Delete failed', 'error');
        } finally {
            setDangerLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={24} className="animate-spin text-brand-teal" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle size={24} className="text-admin-danger mx-auto mb-2" />
                    <p className="text-text-muted text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const filtered = projects.filter(p =>
        [p.title, p.client_name, p.id].some(s => (s || '').toLowerCase().includes(search.toLowerCase()))
    );

    const stageCounts = STAGES.reduce((acc, s) => {
        acc[s] = projects.filter(p => p.stage === s).length;
        return acc;
    }, {});

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-black text-brand-teal uppercase tracking-[0.3em] mb-1">Admin / Projects</p>
                    <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Project Management</h1>
                    <p className="text-text-muted text-sm mt-1">{projects.length} projects &bull; Track stages, milestones &amp; deliverables.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2 w-full sm:contents">
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 flex-1 min-w-0 sm:flex-none sm:w-80">
                            <Search size={12} className="text-text-muted shrink-0" />
                            <input type="text" placeholder="Search projects, Project ID, client name..." value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs text-text-primary placeholder:text-text-dim w-full font-bold min-w-0" />
                        </div>

                        {/* View toggle */}
                        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-xl shrink-0">
                            <button onClick={() => setView('list')}
                                className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-brand-teal/20 text-brand-teal' : 'text-text-muted hover:text-text-primary'}`}>
                                <List size={14} />
                            </button>
                            <button onClick={() => setView('kanban')}
                                className={`p-1.5 rounded-lg transition-all ${view === 'kanban' ? 'bg-brand-teal/20 text-brand-teal' : 'text-text-muted hover:text-text-primary'}`}>
                                <LayoutGrid size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 w-full sm:contents">
                        <div className="hidden md:flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white/[0.03] border border-border-subtle">
                            <SlidersHorizontal size={14} className="text-text-dim" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-text-dim">Filter</span>
                        </div>
                        <FilterSelect
                            label="Filter by stage"
                            value={stageFilter}
                            onChange={(e) => setStageFilter(e.target.value)}
                            icon={Circle}
                            options={[
                                { value: '', label: `All Stages (${projects.length})` },
                                ...STAGES.map(s => ({ value: s, label: `${s} (${stageCounts[s] || 0})` }))
                            ]}
                        />
                        <FilterSelect
                            label="Filter by priority"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            icon={Tag}
                            options={[
                                { value: '', label: 'All Priorities' },
                                ...PRIORITIES.map(p => ({ value: p, label: p }))
                            ]}
                        />
                        {(stageFilter || priorityFilter) && (
                            <button
                                onClick={() => { setStageFilter(''); setPriorityFilter(''); }}
                                className="p-2.5 rounded-xl bg-white/[0.03] border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-light transition-all"
                                aria-label="Clear filters"
                                title="Clear filters"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* (removed) Summary pills */}

            {/* List view */}
            {view === 'list' && (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:hidden">
                        {filtered.map((p, i) => <MobileProjectCard key={p.id} p={p} i={i} onSelect={handleSelectForDetail} />)}
                    </div>
                    <div className="hidden sm:block space-y-3">
                        {filtered.map((p, i) => <ListRow key={p.id} p={p} i={i} onSelect={handleSelectForDetail} />)}
                    </div>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-sm font-bold text-text-muted">No projects found.</div>
                    )}
                </div>
            )}

            {/* Kanban view */}
            {view === 'kanban' && (
                <div className="flex flex-col sm:flex-row gap-3 sm:overflow-x-auto pb-4">
                    {STAGES.map(s => (
                        <KanbanColumn key={s} stage={s}
                            projects={filtered.filter(p => p.stage === s)}
                            onSelect={handleSelectForDetail} />
                    ))}
                </div>
            )}

            {/* Detail Drawer */}
            <AnimatePresence>
                {selected && (
                    <ProjectDrawer
                        key={selected.id}
                        project={selected}
                        onClose={() => setSelected(null)}
                        onToggleMilestone={handleToggleMilestone}
                        onDeleteMilestone={handleDeleteMilestone}
                        onAddMilestone={handleAddMilestone}
                        onUpdateProject={handleUpdateProject}
                        onAddNote={handleAddNote}
                        onDeleteNote={handleDeleteNote}
                        onUploadFile={handleUploadFile}
                        onDeleteFile={handleDeleteFile}
                        onToast={showToast}
                    />
                )}
            </AnimatePresence>

            {/* Bottom Right Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`fixed bottom-6 right-6 z-[300] px-4 py-3 rounded-xl border flex items-center gap-2 shadow-2xl backdrop-blur-md ${toast.type === 'error'
                            ? 'bg-brand-red/10 border-brand-red/20 text-brand-red font-bold'
                            : 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal font-bold'
                            }`}
                    >
                        {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                        <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmDangerModal
                open={dangerConfirm.open}
                loading={dangerLoading}
                onClose={() => setDangerConfirm({ open: false, kind: null, projectId: null, id: null, label: '' })}
                onConfirm={confirmDangerAction}
                title={
                    dangerConfirm.kind === 'file'
                        ? 'Delete File'
                        : dangerConfirm.kind === 'milestone'
                            ? 'Delete Milestone'
                            : 'Delete Note'
                }
                subtitle={dangerConfirm.label || 'This action cannot be undone.'}
                body={
                    dangerConfirm.kind === 'file'
                        ? 'You are about to permanently delete this file from the project.'
                        : dangerConfirm.kind === 'milestone'
                            ? 'You are about to permanently delete this milestone from the project.'
                            : 'You are about to permanently delete this note from the activity log.'
                }
            />
        </div>
    );
}
