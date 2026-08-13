'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft, GripVertical, CheckCircle2, Circle, Trash2, Plus,
    AlertCircle, Loader2, CheckCheck
} from 'lucide-react';
import { api } from '@/lib/api';
import useDashboard from '@/hooks/useDashboard';
import ProjectSidebar from '@/components/dashboard/ProjectSidebar';
import ProjectStagePipeline from '@/components/dashboard/ProjectStagePipeline';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';
import AdminModal from '@/components/AdminModal';

import ProjectDetailHeader from '@/components/dashboard/project-detail/ProjectDetailHeader';
import ProjectBriefSection from '@/components/dashboard/project-detail/ProjectBriefSection';
import ProjectMilestonesSection from '@/components/dashboard/project-detail/ProjectMilestonesSection';
import ProjectTechStackSection from '@/components/dashboard/project-detail/ProjectTechStackSection';
import ProjectActivityLogSection from '@/components/dashboard/project-detail/ProjectActivityLogSection';
import ProjectDetailFooter from '@/components/dashboard/project-detail/ProjectDetailFooter';
import ProjectCancelModal from '@/components/dashboard/project-detail/ProjectCancelModal';
import ProjectCompleteModal from '@/components/dashboard/project-detail/ProjectCompleteModal';
import ReviewSection from '@/components/dashboard/project-detail/ReviewSection';

export default function ClientProjectDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [projectLoading, setProjectLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const {
        loading,
        currentUser,
        activeRole,
        isSeller,
        clientInvoices,
        clientProposals,
    } = useDashboard();

    const isSellerView = activeRole === 'seller' && isSeller && !currentUser?.is_staff;

    // Seller-specific state
    const [milestones, setMilestones] = useState([]);
    const [files, setFiles] = useState([]);
    const [newMilestoneName, setNewMilestoneName] = useState('');
    const [submitting, setSubmitting] = useState('');

    // Seller admin-style modals
    const [createProposalOpen, setCreateProposalOpen] = useState(false);
    const [proposalForm, setProposalForm] = useState({ title: '', body_md: '' });
    const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({ due_date: '', notes: '', currency: 'usd', item_description: 'Project Delivery', item_amount: '' });

    // Milestone drag state
    const [msDragIndex, setMsDragIndex] = useState(null);
    const [msDragOverIndex, setMsDragOverIndex] = useState(null);

    const refreshSellerBilling = async () => {
        if (!id || !isSellerView) return;
        try {
            const p = await api.getSellerProjectDetail(id);
            setProject(p);
            setMilestones(p.milestones || []);
            setFiles(p.files || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!id) return;
        const loadProject = async () => {
            try {
                setProjectLoading(true);
                let p;
                if (isSellerView) {
                    p = await api.getSellerProjectDetail(id);
                } else {
                    p = await api.getClientProjectDetail(id);
                }
                setProject(p);
                if (isSellerView) {
                    setMilestones(p.milestones || []);
                    setFiles(p.files || []);
                    const clientName = p.client_profile?.contact_name || 'Client';
                    setProposalForm({
                        title: 'Project Proposal',
                        body_md: `Dear ${clientName},\n\nThank you for your project. Here is my proposal for...\n\nBest regards`,
                    });
                }
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load project');
            } finally {
                setProjectLoading(false);
            }
        };
        loadProject();
    }, [id, isSellerView]);

    const handleCancelProject = async () => {
        if (!project?.id) return;
        setIsCancelling(true);
        try {
            if (currentUser?.is_staff) {
                await api.cancelAdminProject(project.id);
            } else {
                await api.cancelClientProject(project.id);
            }
            router.push('/dashboard/projects');
        } catch (err) {
            console.error('Failed to cancel project:', err);
        } finally {
            setIsCancelling(false);
            setShowCancelModal(false);
        }
    };

    const handleCompleteProject = async (extraData = {}) => {
        if (!project?.id) return;
        setIsCompleting(true);
        try {
            await api.completeAdminProject(project.id, extraData);
            setProject(prev => ({ ...prev, stage: 'Complete', ...extraData }));
            router.push('/dashboard/projects');
        } catch (err) {
            console.error('Failed to complete project:', err);
        } finally {
            setIsCompleting(false);
            setShowCompleteModal(false);
        }
    };

    // ─── Seller Milestone Actions (with drag order save) ──────────────
    const handleToggleMilestone = async (m) => {
        if (!project?.id) return;
        const updated = { completed: !m.completed, done: !m.completed };
        try {
            await api.updateSellerMilestone(project.id, m.id, updated);
            setMilestones(prev => prev.map(x => x.id === m.id ? { ...x, completed: !x.completed, done: !x.done } : x));
        } catch (err) { console.error(err); }
    };

    const handleAddMilestone = async () => {
        if (!project?.id || !newMilestoneName.trim()) return;
        setSubmitting('milestone');
        try {
            const res = await api.addSellerMilestone(project.id, { name: newMilestoneName, completed: false, done: false, order_index: milestones.length });
            setMilestones(prev => [...prev, res]);
            setNewMilestoneName('');
        } catch (err) { console.error(err); }
        finally { setSubmitting(''); }
    };

    const handleDeleteMilestone = async (mid) => {
        if (!project?.id) return;
        try {
            await api.deleteSellerMilestone(project.id, mid);
            setMilestones(prev => prev.filter(m => m.id !== mid));
        } catch (err) { console.error(err); }
    };

    const handleMsDragStart = (idx) => {
        if (project?.status === 'completed') return;
        setMsDragIndex(idx);
    };
    const handleMsDragOver = (e, idx) => {
        e.preventDefault();
        if (project?.status === 'completed') return;
        setMsDragOverIndex(idx);
    };
    const handleMsDragLeave = () => setMsDragOverIndex(null);
    const handleMsDrop = async (dropIdx) => {
        if (project?.status === 'completed' || msDragIndex === null || msDragIndex === dropIdx) {
            setMsDragIndex(null);
            setMsDragOverIndex(null);
            return;
        }
        const newMs = [...milestones];
        const [moved] = newMs.splice(msDragIndex, 1);
        newMs.splice(dropIdx, 0, moved);
        setMilestones(newMs);
        setMsDragIndex(null);
        setMsDragOverIndex(null);
        try {
            await Promise.all(newMs.map((m, i) =>
                api.updateSellerMilestone(project.id, m.id, { order_index: i })
            ));
        } catch (err) {
            console.error('Failed to save milestone order:', err);
        }
    };
    const handleMsDragEnd = () => {
        setMsDragIndex(null);
        setMsDragOverIndex(null);
    };

    // ─── Seller File Actions ──────────────────────────────────────────
    const handleFileUpload = async (fileOrEvent) => {
        if (!project?.id) return;
        const file = fileOrEvent?.target?.files?.[0] || fileOrEvent;
        if (!file) return;
        setSubmitting('file');
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('label', file.name);
            const res = await api.uploadSellerProjectFile(project.id, formData);
            setFiles(prev => [...prev, res]);
        } catch (err) { console.error(err); }
        finally { setSubmitting(''); }
    };

    const handleDeleteFile = async (fileId) => {
        if (!project?.id) return;
        try {
            await api.deleteSellerProjectFile(project.id, fileId);
            setFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (err) { console.error(err); }
    };

    // ─── Seller Create Proposal (admin-style modal) ───────────────────
    const handleCreateProposal = async (e) => {
        e.preventDefault();
        if (!project?.id) return;
        const title = (proposalForm.title || '').trim();
        const bodyMd = proposalForm.body_md || '';
        if (!title) return;
        setSubmitting('proposal');
        try {
            try {
                await api.sendSellerProposal(project.id, { content: bodyMd, title });
            } catch {
                await api.sendSellerProposal(project.id, { content: bodyMd });
            }
            setCreateProposalOpen(false);
            setProposalForm({ title: '', body_md: '' });
            await refreshSellerBilling();
            if (typeof window !== 'undefined') {
                try {
                    const showToast = window.__showToast;
                    if (showToast) showToast('Proposal sent successfully', 'success');
                } catch { alert('✅ Proposal sent to the client successfully!'); }
            }
        } catch (err) { console.error(err); }
        finally { setSubmitting(''); }
    };

    // ─── Seller Create Invoice (admin-style modal) ────────────────────
    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        if (!project?.id) return;
        setSubmitting('invoice');
        try {
            const amount = Number(invoiceForm.item_amount);
            const items = [];
            if (Number.isFinite(amount) && amount > 0) {
                items.push({
                    description: (invoiceForm.item_description || 'Service').trim() || 'Service',
                    amount,
                });
            }
            try {
                await api.sendSellerInvoice(project.id, {
                    items: items.length > 0 ? items : [{ description: (invoiceForm.item_description || 'Service').trim() || 'Service', amount: 0 }],
                    notes: invoiceForm.notes || '',
                    total_amount: amount > 0 ? amount : 0,
                });
            } catch {
                await api.sendSellerInvoice(project.id, {
                    items: items.length > 0 ? items : [{ description: 'Service', amount: 0 }],
                    notes: invoiceForm.notes || '',
                    total_amount: amount > 0 ? amount : 0,
                });
            }
            setCreateInvoiceOpen(false);
            setInvoiceForm({ due_date: '', notes: '', currency: 'usd', item_description: 'Project Delivery', item_amount: '' });
            await refreshSellerBilling();
            if (typeof window !== 'undefined') {
                try {
                    const showToast = window.__showToast;
                    if (showToast) showToast('Invoice sent successfully', 'success');
                } catch { alert('✅ Invoice sent to the client!'); }
            }
        } catch (err) { console.error(err); }
        finally { setSubmitting(''); }
    };

    // ─── Seller Complete Project (uses confirm modal or inline) ──────
    const handleCompleteConfirm = async (extraData = {}) => {
        if (!project?.id) return;
        setIsCompleting(true);
        try {
            try {
                await api.updateSellerProject(project.id, { status: 'completed', ...extraData });
            } catch {
                await api.completeAdminProject(project.id, extraData);
            }
            setProject(prev => ({ ...prev, status: 'completed', ...extraData }));
            await refreshSellerBilling();
        } catch (err) { console.error('Failed to complete project:', err); }
        finally {
            setIsCompleting(false);
            setShowCompleteModal(false);
        }
    };

    if (loading || !currentUser || projectLoading) {
        return <DashboardLoadingState message={loading || !currentUser ? 'Decrypting Command Space...' : 'Loading Project...'} />;
    }

    if (error || !project) {
        return (
            <div className="flex-grow flex items-center justify-center px-3 lg:px-6 pb-3 lg:pb-6">
                <div className="text-center max-w-md px-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                        Error
                    </div>
                    <div className="text-sm text-slate-300 mb-4">
                        {error || 'Project not found'}
                    </div>
                    <Link
                        href="/dashboard/projects"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft size={12} />
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    const viewMilestones = isSellerView ? milestones : (project.milestones || []);
    const viewFiles = isSellerView ? files : (project.files || []);
    const activities = project.activities || [];
    const completedMilestones = viewMilestones.filter(m => m.completed || m.done).length;
    const progressPct = viewMilestones.length > 0 ? Math.round((completedMilestones / viewMilestones.length) * 100) : (project.progress || 0);
    const isProjectCompleted = (project?.status || '').toLowerCase() === 'completed';
    const pid = project.id;

    return (
        <div className="flex-grow px-3 lg:px-6 pb-3 lg:pb-6">
            <div className="w-full">
                <div className="grid md:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 items-start">
                    {/* Left Main Content Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${isSellerView ? 'glass' : 'glass'} border border-white/10 rounded-2xl overflow-hidden w-full order-2 md:order-1`}
                    >
                        {/* Seller Progress Banner — shown above header */}
                        {isSellerView && viewMilestones.length > 0 && (
                            <div className="px-5 py-3 border-b border-white/10 bg-gradient-to-r from-purple-950/40 to-slate-950">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                        <span>Milestone Progress</span>
                                        <span className="text-purple-300">{completedMilestones}/{viewMilestones.length} · {progressPct}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-400 transition-all"
                                            style={{ width: `${progressPct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Header */}
                        <ProjectDetailHeader project={project} />

                        {/* Stage Pipeline */}
                        <ProjectStagePipeline project={project} />

                        {/* Body */}
                        <div className="p-4 lg:p-6 space-y-6">
                            {/* Project brief section */}
                            <ProjectBriefSection description={project.description} />

                            {!isSellerView && (
                                <>
                                    {/* Client Read-Only Milestones */}
                                    <ProjectMilestonesSection milestones={viewMilestones} />

                                    {/* Tech stack tags */}
                                    <ProjectTechStackSection tags={project.tags} />

                                    {/* Activity log */}
                                    <ProjectActivityLogSection activities={activities} />

                                    {/* Review Section — only for clients on completed projects */}
                                    <ReviewSection
                                        projectId={project.id}
                                        projectStage={project.stage}
                                        projectStatus={project.status}
                                        completionImageUrl={
                                            project.completion_image_url ||
                                            project.portfolio_image ||
                                            ''
                                        }
                                        isAdmin={currentUser?.is_staff}
                                    />
                                </>
                            )}

                            {isSellerView && (
                                <>
                                    {/* ───── Seller: Interactive Milestones (with drag) ───── */}
                                    <div className="p-4 rounded-xl bg-purple-950/10 border border-purple-500/15 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300">
                                                <CheckCheck size={14} className="text-purple-400" />
                                                Project Milestones
                                            </div>
                                            {viewMilestones.length > 0 && (
                                                <span className="text-[10px] font-black text-purple-400">{completedMilestones}/{viewMilestones.length} Done</span>
                                            )}
                                        </div>

                                        {viewMilestones.length > 0 ? (
                                            <div className="space-y-2">
                                                {viewMilestones.map((m, mi) => {
                                                    const isDone = m.completed || m.done;
                                                    return (
                                                        <div
                                                            key={m.id || mi}
                                                            draggable={!isProjectCompleted}
                                                            onDragStart={() => handleMsDragStart(mi)}
                                                            onDragOver={(e) => handleMsDragOver(e, mi)}
                                                            onDragLeave={handleMsDragLeave}
                                                            onDrop={() => handleMsDrop(mi)}
                                                            onDragEnd={handleMsDragEnd}
                                                            className={`flex items-center gap-2 p-3 rounded-xl border group transition-all ${msDragOverIndex === mi && msDragIndex !== mi
                                                                ? 'bg-purple-500/10 border-purple-500/40 scale-[1.005]'
                                                                : msDragIndex === mi
                                                                    ? 'opacity-50 border-white/10 bg-white/[0.01]'
                                                                    : isDone
                                                                        ? 'bg-emerald-500/5 border-emerald-500/10'
                                                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                                                } ${!isProjectCompleted ? 'cursor-grab active:cursor-grabbing' : ''}`}
                                                        >
                                                            <GripVertical
                                                                size={12}
                                                                className={`shrink-0 ${isProjectCompleted ? 'text-slate-700' : 'text-slate-600 hover:text-slate-400'} ${msDragIndex === mi ? 'text-purple-400' : ''}`}
                                                            />
                                                            <button
                                                                onClick={() => handleToggleMilestone(m)}
                                                                disabled={isProjectCompleted}
                                                                className={`shrink-0 p-0.5 rounded-lg hover:bg-white/5 transition-all ${isDone ? 'text-emerald-400' : 'text-slate-500 hover:text-white'}`}
                                                            >
                                                                {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                                            </button>
                                                            <span className={`text-xs font-bold flex-grow select-none ${isDone ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                                {m.name || m.label}
                                                            </span>
                                                            {!isProjectCompleted && (
                                                                <button
                                                                    onClick={() => handleDeleteMilestone(m.id)}
                                                                    className="shrink-0 p-1.5 rounded-lg hover:bg-red-500/10 transition-all text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100"
                                                                    title="Delete milestone"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 italic">No milestones yet. Add your first milestone below.</p>
                                        )}

                                        {isProjectCompleted ? (
                                            <div className="pt-2.5 border-t border-white/5 text-[11px] font-bold text-emerald-400/80 italic text-center flex items-center justify-center gap-1.5">
                                                <CheckCircle2 size={13} className="text-emerald-400" /> Project completed — Milestones are locked.
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 pt-2 border-t border-white/5">
                                                <input
                                                    type="text"
                                                    value={newMilestoneName}
                                                    onChange={e => setNewMilestoneName(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleAddMilestone()}
                                                    placeholder="Add new milestone..."
                                                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                                                />
                                                <button
                                                    onClick={handleAddMilestone}
                                                    disabled={submitting === 'milestone' || !newMilestoneName.trim()}
                                                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all"
                                                >
                                                    {submitting === 'milestone' ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                                                    Add
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tech stack + activity */}
                                    <ProjectTechStackSection tags={project.tags} />
                                    <ProjectActivityLogSection activities={activities} />
                                </>
                            )}
                        </div>

                        {/* Footer Protocol bar */}
                        <ProjectDetailFooter />
                    </motion.div>

                    {/* Right Sidebar */}
                    <div className="space-y-4 md:sticky md:top-[96px] z-20 order-1 md:order-2">
                        <ProjectSidebar
                            project={project}
                            clientInvoices={clientInvoices}
                            clientProposals={clientProposals}
                            files={viewFiles}
                            isAdmin={currentUser?.is_staff}
                            isSeller={isSellerView}
                            onUpload={isSellerView ? handleFileUpload : null}
                            onDelete={isSellerView ? handleDeleteFile : null}
                            onAddInvoice={isSellerView ? () => setCreateInvoiceOpen(true) : null}
                            onAddProposal={isSellerView ? () => setCreateProposalOpen(true) : null}
                            onUpdateProjectImage={(url) => setProject(prev => ({ ...prev, completion_image_url: url }))}
                            onCancelProject={() => setShowCancelModal(true)}
                            onCompleteProject={() => setShowCompleteModal(true)}
                            onEditProject={isSellerView ? undefined : () => router.push(`/admin/projects/${id}`)}
                        />
                    </div>
                </div>
            </div>

            {/* Cancel Project Confirmation Modal */}
            <ProjectCancelModal
                open={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                loading={isCancelling}
                onConfirm={handleCancelProject}
            />

            {/* Complete Project Confirmation Modal (Admin) */}
            {currentUser?.is_staff && (
                <ProjectCompleteModal
                    open={showCompleteModal}
                    onClose={() => setShowCompleteModal(false)}
                    loading={isCompleting}
                    onConfirm={handleCompleteProject}
                />
            )}

            {/* Complete Project Confirmation Modal (Seller) */}
            {isSellerView && (
                <ProjectCompleteModal
                    open={showCompleteModal}
                    onClose={() => setShowCompleteModal(false)}
                    loading={isCompleting}
                    onConfirm={handleCompleteConfirm}
                />
            )}

            {/* Create Proposal Modal (Seller) */}
            <AnimatePresence>
                {isSellerView && createProposalOpen && (
                    <AdminModal
                        open
                        onClose={() => setCreateProposalOpen(false)}
                        title="Send Proposal to Client"
                        subtitle={`${project.id} • ${project.client_name || project.client_profile?.contact_name || '—'}`}
                        maxWidthClass="max-w-2xl">
                        <form onSubmit={handleCreateProposal} className="p-5 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Proposal Title</label>
                                <input
                                    value={proposalForm.title}
                                    onChange={(e) => setProposalForm(p => ({ ...p, title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold"
                                    placeholder="Project Proposal" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Proposal Message</label>
                                <textarea
                                    value={proposalForm.body_md}
                                    onChange={(e) => setProposalForm(p => ({ ...p, body_md: e.target.value }))}
                                    className="w-full min-h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-teal/50 font-bold resize-y"
                                    placeholder="Scope, timeline, milestones, revision policy…" />
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
                                    disabled={submitting === 'proposal'}
                                    className="px-4 py-2 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-sm shadow-glow-teal hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2">
                                    {submitting === 'proposal'
                                        ? <><Loader2 size={14} className="animate-spin" /> Sending...</>
                                        : 'Send Proposal'}
                                </button>
                            </div>
                        </form>
                    </AdminModal>
                )}
            </AnimatePresence>

            {/* Create Invoice Modal (Seller) */}
            <AnimatePresence>
                {isSellerView && createInvoiceOpen && (
                    <AdminModal
                        open
                        onClose={() => setCreateInvoiceOpen(false)}
                        title="Create & Send Invoice"
                        subtitle={`${project.id} • ${project.client_name || project.client_profile?.contact_name || '—'}`}
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
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Line Item</label>
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
                                    disabled={submitting === 'invoice'}
                                    className="px-4 py-2 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-sm shadow-glow-teal hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2">
                                    {submitting === 'invoice'
                                        ? <><Loader2 size={14} className="animate-spin" /> Sending...</>
                                        : 'Send Invoice'}
                                </button>
                            </div>
                        </form>
                    </AdminModal>
                )}
            </AnimatePresence>
        </div>
    );
}
