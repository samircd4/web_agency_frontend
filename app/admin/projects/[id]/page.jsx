'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import ProjectSidebar from '@/components/dashboard/ProjectSidebar';
import ProjectStagePipeline from '@/components/dashboard/ProjectStagePipeline';
import ProjectBrief from '@/components/dashboard/ProjectBrief';
import ProjectMilestones from '@/components/dashboard/ProjectMilestones';
import ProjectTags from '@/components/dashboard/ProjectTags';
import ProjectActivityLog from '@/components/dashboard/ProjectActivityLog';
import ProjectProtocolFooter from '@/components/dashboard/ProjectProtocolFooter';
import AdminModal from '@/components/AdminModal';
import ConfirmDangerModal from '@/components/ConfirmDangerModal';
import {
    Edit3, Loader2, Tag, CheckCircle2, Circle,
    Trash2, Upload, Download, Plus, AlertCircle,
    FileText, DollarSign, Calendar, User, X
} from 'lucide-react';

const STAGES = ['Analysis', 'Architecture', 'Dev', 'QA', 'Staging', 'Complete'];
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const STAGE_META = {
    'Analysis': { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    'Architecture': { color: 'text-brand-indigo', bg: 'bg-brand-indigo/10', border: 'border-brand-indigo/20' },
    'Dev': { color: 'text-brand-teal', bg: 'bg-brand-teal/10', border: 'border-brand-teal/20' },
    'QA': { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    'Staging': { color: 'text-brand-blue', bg: 'bg-brand-blue/10', border: 'border-brand-blue/20' },
    'Complete': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
};
const PRIORITY_DOT = { Critical: 'bg-brand-red', High: 'bg-orange-400', Medium: 'bg-yellow-400', Low: 'bg-slate-600' };

function formatBytes(bytes) {
    const n = Number(bytes);
    if (!Number.isFinite(n) || n <= 0) return '—';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
    const value = n / (1024 ** i);
    const decimals = i >= 2 ? 2 : 0;
    return `${value.toFixed(decimals)} ${units[i]}`;
}

function resolveBackendUrl(url) {
    if (!url) return '';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `${apiBaseUrl.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function AdminProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [projectLoading, setProjectLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientInvoices, setClientInvoices] = useState([]);
    const [clientProposals, setClientProposals] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(p => ({ ...p, show: false }));
        }, 4000);
    };

    const getStatusClasses = (status) => {
        switch (status?.toLowerCase()) {
            case 'cancelled':
                return 'text-xs px-3 py-1 rounded-full bg-brand-red/15 border border-brand-red/30 text-brand-red font-semibold capitalize';
            case 'completed':
                return 'text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-semibold capitalize';
            default: // Assuming 'active' or any other in-progress state
                return 'text-xs px-3 py-1 rounded-full bg-brand-teal/15 border border-brand-teal/30 text-brand-teal font-semibold capitalize';
        }
    };

    // Edit modal state
    const [isEditing, setIsEditing] = useState(false);

    // Edit form
    const [editLoading, setEditLoading] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        value: 0,
        deadline: '',
        priority: 'Medium',
        stage: 'Dev',
        tagsStr: ''
    });

    // Billing state
    const [billingTab, setBillingTab] = useState('invoices'); // invoices | proposals
    const [billingLoading, setBillingLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [proposals, setProposals] = useState([]);

    // Create modals
    const [createProposalOpen, setCreateProposalOpen] = useState(false);
    const [proposalForm, setProposalForm] = useState({ title: '', body_md: '' });
    const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({ due_date: '', notes: '', currency: 'usd', item_description: 'Deposit', item_amount: '' });
    const [addItemOpen, setAddItemOpen] = useState(false);
    const [addItemForm, setAddItemForm] = useState({ invoiceId: null, description: '', amount: '' });

    // Billing confirm
    const [billingConfirm, setBillingConfirm] = useState({ open: false, kind: null, invoice: null });
    const [billingActionLoading, setBillingActionLoading] = useState(false);

    // Danger confirm for general actions like milestone deletion
    const [dangerConfirm, setDangerConfirm] = useState({ open: false, kind: null, projectId: null, id: null, label: '' });
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [newMilestoneLabel, setNewMilestoneLabel] = useState('');

    const handleCancelProject = async () => {
        if (!project?.id) return;
        setIsCancelling(true);
        try {
            await api.cancelAdminProject(project.id);
            showToast('Project cancelled successfully', 'success');
            loadProject(); // Re-load project to update status
            setProject(prev => ({ ...prev, status: 'cancelled' })); // Optimistically update UI
        } catch (err) {
            console.error('Failed to cancel project:', err);
            showToast(err?.message || 'Failed to cancel project', 'error');
        } finally {
            setIsCancelling(false);
            setShowCancelModal(false);
        }
    };

    const handleCompleteProject = async () => {
        if (!project?.id) return;
        setIsCompleting(true);
        try {
            await api.completeAdminProject(project.id);
            showToast('Project marked as complete successfully', 'success');
            loadProject(); // Re-load project to update status
            setProject(prev => ({ ...prev, status: 'completed' })); // Optimistically update UI
        } catch (err) {
            console.error('Failed to complete project:', err);
            showToast(err?.message || 'Failed to complete project', 'error');
        } finally {
            setIsCompleting(false);
            setShowCompleteModal(false);
        }
    };

    const loadProject = useCallback(async () => {
        if (!id) return;
        try {
            setProjectLoading(true);
            const [p, invs, props] = await Promise.all([
                api.getAdminProjectDetail(id),
                api.getAdminProjectInvoices(id),
                api.getAdminProjectProposals(id),
            ]);
            setProject(p);
            setEditForm({
                title: p.title || '',
                description: p.description || '',
                value: p.value || 0,
                deadline: p.deadline || '',
                priority: p.priority || 'Medium',
                stage: p.stage || 'Dev',
                tagsStr: (p.tags || []).join(', ')
            });
            setClientInvoices(Array.isArray(invs) ? invs : invs.results || []);
            setClientProposals(Array.isArray(props) ? props : props.results || []);
            setInvoices(Array.isArray(invs) ? invs : invs.results || []);
            setProposals(Array.isArray(props) ? props : props.results || []);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load project');
        } finally {
            setProjectLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProject();
    }, [loadProject]);

    const refreshBilling = useCallback(async () => {
        if (!id) return;
        setBillingLoading(true);
        try {
            const [p, invs] = await Promise.all([
                api.getAdminProjectProposals(id),
                api.getAdminProjectInvoices(id),
            ]);
            setProposals(Array.isArray(p) ? p : p.results || []);
            setInvoices(Array.isArray(invs) ? invs : invs.results || []);
            setClientProposals(Array.isArray(p) ? p : p.results || []);
            setClientInvoices(Array.isArray(invs) ? invs : invs.results || []);
        } catch (err) {
            console.error(err);
        } finally {
            setBillingLoading(false);
        }
    }, [id]);

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setFormErrors({}); // Clear previous errors
        try {
            const updatedProject = await api.updateAdminProject(id, {
                ...editForm,
                tags: editForm.tagsStr.split(',').map(t => t.trim()).filter(t => t)
            });
            setProject(updatedProject);
            await loadProject(); // Refresh everything
            setIsEditing(false);
            showToast('Project updated successfully');
        } catch (err) {
            console.error('Failed to update project:', err);
            if (err.data) {
                if (err.data.deadline) {
                    setFormErrors(prev => ({ ...prev, deadline: err.data.deadline[0] }));
                    showToast(`Deadline: ${err.data.deadline[0]}`, 'error');
                } else if (err.data.detail) {
                    showToast(err.data.detail, 'error');
                } else {
                    showToast(err?.message || 'Failed to update project', 'error');
                }
            } else {
                showToast(err?.message || 'Failed to update project', 'error');
            }
        } finally {
            setEditLoading(false);
        }
    };

    const handleCreateProposal = async (e) => {
        e.preventDefault();
        const title = (proposalForm.title || '').trim();
        if (!title) return;
        try {
            await api.createAdminProjectProposal(id, {
                title,
                body_md: proposalForm.body_md || '',
                status: 'draft',
            });
            setCreateProposalOpen(false);
            setProposalForm({ title: '', body_md: '' });
            await refreshBilling();
            showToast('Proposal created successfully');
        } catch (err) {
            console.error(err);
            showToast(err?.message || 'Failed to create proposal', 'error');
        }
    };

    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        try {
            const inv = await api.createAdminProjectInvoice(id, {
                currency: invoiceForm.currency || 'usd',
                due_date: invoiceForm.due_date || null,
                notes: invoiceForm.notes || '',
                status: 'draft',
            });
            const amount = Number(invoiceForm.item_amount);
            if (Number.isFinite(amount) && amount > 0) {
                await api.createAdminInvoiceItem(id, inv.id, {
                    description: (invoiceForm.item_description || 'Service').trim() || 'Service',
                    quantity: 1,
                    unit_amount_cents: Math.round(amount * 100),
                });
            }
            setCreateInvoiceOpen(false);
            setInvoiceForm({ due_date: '', notes: '', currency: 'usd', item_description: 'Deposit', item_amount: '' });
            await refreshBilling();
            showToast('Invoice created successfully');
        } catch (err) {
            console.error(err);
            showToast(err?.message || 'Failed to create invoice', 'error');
        }
    };

    const handleAddInvoiceItem = async (e) => {
        e.preventDefault();
        const invoiceId = addItemForm.invoiceId;
        if (!invoiceId) return;
        const description = (addItemForm.description || '').trim();
        const amount = Number(addItemForm.amount);
        if (!description || !Number.isFinite(amount) || amount <= 0) return;
        try {
            await api.createAdminInvoiceItem(id, invoiceId, {
                description,
                quantity: 1,
                unit_amount_cents: Math.round(amount * 100),
            });
            setAddItemOpen(false);
            setAddItemForm({ invoiceId: null, description: '', amount: '' });
            await refreshBilling();
            showToast('Invoice item added successfully');
        } catch (err) {
            console.error(err);
            showToast(err?.message || 'Failed to add invoice item', 'error');
        }
    };

    const handleFileUpload = async (file) => {
        try {
            await api.uploadAdminProjectFile(id, file);
            await loadProject();
            showToast('File uploaded successfully');
        } catch (err) {
            console.error('Failed to upload file:', err);
            showToast(err?.message || 'Failed to upload file', 'error');
        }
    };

    const handleDeleteFile = async (fileId) => {
        try {
            await api.deleteAdminProjectFile(id, fileId);
            await loadProject();
            showToast('File deleted successfully');
        } catch (err) {
            console.error('Failed to delete file:', err);
            showToast(err?.message || 'Failed to delete file', 'error');
        }
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

    const centsToMoney = (cents) => {
        const n = Number(cents || 0) / 100;
        return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleAddNewMilestone = (e) => {
        e.preventDefault();
        if (!newMilestoneLabel.trim()) return;
        handleAddMilestone(project.id, newMilestoneLabel.trim());
        setNewMilestoneLabel('');
    };

    // Milestone Actions (ported from main admin projects page)
    async function handleToggleMilestone(projectId, milestoneId, currentDone) {
        try {
            const nextDone = !currentDone;
            await api.updateMilestone(projectId, milestoneId, { done: nextDone });
            const detail = await api.getAdminProjectDetail(projectId);
            setProject(detail); // Update the local project state
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
        setDeleteLoading(true);
        try {
            await api.deleteMilestone(projectId, milestoneId);
            const detail = await api.getAdminProjectDetail(projectId);
            setProject(detail); // Update the local project state
            setDangerConfirm({ open: false, kind: null, projectId: null, id: null, label: '' }); // Close modal
            showToast('Milestone deleted successfully');
        } catch (err) {
            console.error('Failed to delete milestone:', err);
            showToast(err?.message || 'Failed to delete milestone', 'error');
        } finally {
            setDeleteLoading(false);
        }
    }

    async function handleAddMilestone(projectId, label) {
        try {
            const order_index = project.milestones ? project.milestones.length : 0;
            await api.createMilestone(projectId, label, order_index);
            const detail = await api.getAdminProjectDetail(projectId);
            setProject(detail); // Update the local project state
            showToast('New milestone added successfully');
        } catch (err) {
            showToast(err.message || 'Failed to construct milestone', 'error');
        }
    }

    if (projectLoading) {
        return (
            <div className="w-full flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                    <span className="text-tiny font-black uppercase tracking-[0.2em] text-muted">
                        Loading Project…
                    </span>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="w-full flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-white">
                        {error || 'Project not found'}
                    </span>
                </div>
            </div>
        );
    }

    const milestones = project.milestones || [];
    const files = project.files || [];
    const activities = project.activities || [];
    const completedCount = milestones.filter(m => m.done).length;
    const meta = STAGE_META[project.stage] || { color: 'text-text-muted', bg: 'bg-white/5', border: 'border-white/5' };

    return (
        <div className="w-full">
            <div className="grid md:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 items-start">

                {/* Left Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass border border-white/10 rounded-2xl overflow-hidden w-full h-fit order-2 md:order-1">
                    {/* Header Layout */}
                    <div className="p-2 lg:p-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">
                                    {project.id} • {project.priority || 'Standard'} Priority
                                </div>
                                <h1 className="text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight">
                                    {project.title}
                                </h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={getStatusClasses(project.status)}>{project.status}</span>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 rounded-xl bg-brand-teal text-text-primary font-black uppercase tracking-widest text-xs hover:-translate-y-0.5 transition-all shadow-glow-teal flex items-center gap-2">
                                    <Edit3 size={12} /> Edit Project
                                </button>
                            </div>
                        </div>
                    </div>

                    <ProjectStagePipeline project={project} stages={STAGES} />

                    <div className="p-4 lg:p-6 space-y-6">
                        <ProjectBrief project={project} />

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
                                                onClick={() => handleToggleMilestone(project.id, m.id, m.done)}
                                                className={`shrink-0 p-0.5 rounded-lg hover:bg-white/5 transition-all text-left ${m.done ? 'text-emerald-400' : 'text-text-dim hover:text-text-primary'}`}
                                                title={m.done ? "Mark as Pending" : "Mark as Done"}
                                            >
                                                {m.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                            </button>
                                            <span className={`text-xs font-bold flex-grow ${m.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>{m.label}</span>
                                            <button
                                                onClick={() => handleDeleteMilestone(project.id, m.id, m.label)}
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

                        <ProjectTags tags={project.tags} />
                        {activities.length > 0 && (
                            <ProjectActivityLog activities={activities} />
                        )}
                    </div>

                    <ProjectProtocolFooter />
                </motion.div>

                {/* Sidebar (Sticky on desktop, stacks on top on mobile) */}
                <div className="space-y-4 md:sticky md:top-20 z-20 order-1 md:order-2">
                    <ProjectSidebar
                        project={project}
                        clientInvoices={clientInvoices}
                        clientProposals={clientProposals}
                        files={files}
                        isAdmin={true}
                        onUpload={handleFileUpload}
                        onDelete={handleDeleteFile}
                        onAddInvoice={() => setCreateInvoiceOpen(true)}
                        onAddProposal={() => setCreateProposalOpen(true)}
                        onCancelProject={() => setShowCancelModal(true)}
                        onCompleteProject={() => setShowCompleteModal(true)}
                    />
                </div>

            </div>

            {/* Edit Project Modal */}
            <AdminModal
                open={isEditing}
                onClose={() => setIsEditing(false)}
                title="Edit Project Protocols"
                subtitle={`${project.id} • ${project.client_name || '—'}`}
                maxWidthClass="max-w-4xl">
                <form onSubmit={handleSaveEdit} className="p-5 space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Title</label>
                        <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                            required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Project Brief</label>
                        <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows="6"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 resize-y font-bold" />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Investment Value ($)</label>
                            <input
                                type="number"
                                value={editForm.value}
                                onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                                required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Deadline Date</label>
                            <input
                                type="date"
                                value={editForm.deadline}
                                onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/10 font-mono font-bold" />
                            {formErrors.deadline && <p className="text-red-500 text-xs mt-1 ml-1">{formErrors.deadline}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Priority</label>
                            <select
                                value={editForm.priority}
                                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                                className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold">
                                {PRIORITIES.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Project Stage</label>
                            <select
                                value={editForm.stage}
                                onChange={(e) => setEditForm({ ...editForm, stage: e.target.value })}
                                className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold">
                                {STAGES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                            <Tag size={14} /> Tech Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={editForm.tagsStr}
                            onChange={(e) => setEditForm({ ...editForm, tagsStr: e.target.value })}
                            placeholder="Python, Django, PostgreSQL..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold" />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/5 justify-end">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3 bg-white/5 border border-white/5 text-text-primary rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editLoading}
                            className="px-6 py-3 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal disabled:opacity-50">
                            {editLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save Protocol Changes'}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {/* Create Proposal Modal */}
            <AnimatePresence>
                {createProposalOpen && (
                    <AdminModal
                        open
                        onClose={() => setCreateProposalOpen(false)}
                        title="Create Proposal"
                        subtitle={`${project.id} • ${project.client_name || '—'}`}
                        maxWidthClass="max-w-2xl">
                        <form onSubmit={handleCreateProposal} className="p-5 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Proposal Title</label>
                                <input
                                    value={proposalForm.title}
                                    onChange={(e) => setProposalForm(p => ({ ...p, title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                                    placeholder="Website Proposal" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Body (Markdown)</label>
                                <textarea
                                    value={proposalForm.body_md}
                                    onChange={(e) => setProposalForm(p => ({ ...p, body_md: e.target.value }))}
                                    className="w-full min-h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold resize-y"
                                    placeholder="Scope, timeline, milestones (50/30/20), revision policy…" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCreateProposalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-text-primary font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-sm shadow-glow-teal hover:-translate-y-0.5 transition-all">
                                    Create Proposal
                                </button>
                            </div>
                        </form>
                    </AdminModal>
                )}
            </AnimatePresence>

            {/* Create Invoice Modal */}
            <AnimatePresence>
                {createInvoiceOpen && (
                    <AdminModal
                        open
                        onClose={() => setCreateInvoiceOpen(false)}
                        title="Create Invoice"
                        subtitle={`${project.id} • ${project.client_name || '—'}`}
                        maxWidthClass="max-w-2xl">
                        <form onSubmit={handleCreateInvoice} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Currency</label>
                                    <select
                                        value={invoiceForm.currency}
                                        onChange={(e) => setInvoiceForm(i => ({ ...i, currency: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50">
                                        <option value="usd">USD</option>
                                        <option value="eur">EUR</option>
                                        <option value="gbp">GBP</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={invoiceForm.due_date}
                                        onChange={(e) => setInvoiceForm(i => ({ ...i, due_date: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 font-mono" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Optional First Item</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-500 ml-1">Description</label>
                                        <input
                                            value={invoiceForm.item_description}
                                            onChange={(e) => setInvoiceForm(i => ({ ...i, item_description: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-slate-500 ml-1">Amount</label>
                                        <input
                                            type="number"
                                            value={invoiceForm.item_amount}
                                            onChange={(e) => setInvoiceForm(i => ({ ...i, item_amount: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Notes</label>
                                <textarea
                                    value={invoiceForm.notes}
                                    onChange={(e) => setInvoiceForm(i => ({ ...i, notes: e.target.value }))}
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 resize-none" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCreateInvoiceOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-text-primary font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-sm shadow-glow-teal hover:-translate-y-0.5 transition-all">
                                    Create Invoice
                                </button>
                            </div>
                        </form>
                    </AdminModal>
                )}
            </AnimatePresence>

            {/* Add Invoice Item Modal */}
            <AnimatePresence>
                {addItemOpen && (
                    <AdminModal
                        open
                        onClose={() => setAddItemOpen(false)}
                        title="Add Invoice Item"
                        maxWidthClass="max-w-md">
                        <form onSubmit={handleAddInvoiceItem} className="p-5 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                                <input
                                    value={addItemForm.description}
                                    onChange={(e) => setAddItemForm(a => ({ ...a, description: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50"
                                    required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Amount</label>
                                <input
                                    type="number"
                                    value={addItemForm.amount}
                                    onChange={(e) => setAddItemForm(a => ({ ...a, amount: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50"
                                    required />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setAddItemOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-text-primary font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-sm shadow-glow-teal hover:-translate-y-0.5 transition-all">
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </AdminModal>
                )}
            </AnimatePresence>

            {/* Billing Confirm Modal */}
            <AnimatePresence>
                {billingConfirm.open && (
                    <ConfirmDangerModal
                        open
                        onClose={() => (billingActionLoading ? null : setBillingConfirm({ open: false, kind: null, invoice: null }))}
                        onConfirm={async () => {
                            setBillingActionLoading(true);
                            try {
                                const inv = billingConfirm.invoice;
                                if (!inv) return;
                                if (billingConfirm.kind === 'send_invoice') {
                                    await api.sendAdminInvoice(id, inv.id);
                                    showToast(inv.status === 'draft' ? 'Invoice marked as sent' : 'Invoice resent');
                                } else if (billingConfirm.kind === 'toggle_paid') {
                                    if (inv.status === 'paid') {
                                        await api.markAdminInvoiceUnpaid(id, inv.id);
                                        showToast('Invoice marked as unpaid');
                                    } else {
                                        await api.markAdminInvoicePaid(id, inv.id);
                                        showToast('Invoice marked as paid');
                                    }
                                }
                                await refreshBilling();
                                setBillingConfirm({ open: false, kind: null, invoice: null });
                            } catch (err) {
                                console.error(err);
                                showToast(err?.message || 'Action failed', 'error');
                            } finally {
                                setBillingActionLoading(false);
                            }
                        }}
                        title={billingConfirm.kind === 'send_invoice'
                            ? (billingConfirm.invoice?.status === 'draft' ? 'Send Invoice' : 'Resend Invoice')
                            : 'Update Payment Status'}
                        message={`Are you sure you want to ${billingConfirm.kind === 'send_invoice' ? 'send' : billingConfirm.invoice?.status === 'paid' ? 'mark as unpaid' : 'mark as paid'} this invoice?`}
                        confirmText={billingConfirm.kind === 'send_invoice' ? 'Send' : billingConfirm.invoice?.status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                        isLoading={billingActionLoading}
                    />
                )}
            </AnimatePresence>

            {/* Milestone Delete Confirm Modal */}
            <AnimatePresence>
                {dangerConfirm.open && dangerConfirm.kind === 'milestone' && (
                    <ConfirmDangerModal
                        open
                        onClose={() => (deleteLoading ? null : setDangerConfirm({ open: false, kind: null, projectId: null, id: null, label: '' }))}
                        onConfirm={async () => {
                            await doDeleteMilestone(dangerConfirm.projectId, dangerConfirm.id);
                        }}
                        title="Delete Milestone"
                        message={`Are you sure you want to delete the milestone \'${dangerConfirm.label}\'? This action cannot be undone.`}
                        confirmText="Delete Milestone"
                        isLoading={deleteLoading}
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

            {/* Cancel Project Confirmation Modal */}
            <ConfirmDangerModal
                open={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                title="Cancel Project"
                subtitle="This will mark the project as cancelled and cannot be undone."
                heading="Are you sure you want to cancel this project?"
                body="This action will set the project status to 'cancelled'."
                confirmText="Cancel Project"
                loading={isCancelling}
                onConfirm={handleCancelProject}
                modalIcon={AlertCircle}
                confirmIcon={Trash2}
                confirmColorClass="bg-brand-red/15 border border-brand-red/30 text-brand-red"
                bodyColorClass="bg-brand-red/10 border border-brand-red/20"
            />

            {/* Complete Project Confirmation Modal */}
            <ConfirmDangerModal
                open={showCompleteModal}
                onClose={() => setShowCompleteModal(false)}
                title="Complete Project"
                subtitle="This will mark the project as complete and cannot be undone."
                heading="Are you sure you want to mark this project as complete?"
                body="This action will set the project status to 'completed'."
                confirmText="Mark Complete"
                loading={isCompleting}
                onConfirm={handleCompleteProject}
                modalIcon={CheckCircle2}
                confirmIcon={CheckCircle2}
                confirmColorClass="bg-emerald-500/15 border border-emerald-500/30 text-emerald-500"
                bodyColorClass="bg-emerald-500/10 border border-emerald-500/20"
            />
        </div>
    );
}
