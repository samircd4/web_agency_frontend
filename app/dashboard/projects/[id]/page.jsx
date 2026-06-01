'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
    Terminal, CheckCircle2, Activity, Cpu,
    ArrowLeft, Clock, Shield, Edit, CheckCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import useDashboard from '@/hooks/useDashboard';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardTopbar from '@/components/dashboard/Topbar';
import ProjectSidebar from '@/components/dashboard/ProjectSidebar';
import ProjectStagePipeline from '@/components/dashboard/ProjectStagePipeline';
import ConfirmDangerModal from '@/components/ConfirmDangerModal'; // Import ConfirmDangerModal

const STAGE_META = {
    'Requirements': { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    'Architecture': { color: 'text-brand-indigo', bg: 'bg-brand-indigo/10', border: 'border-brand-indigo/20' },
    'Dev': { color: 'text-brand-teal', bg: 'bg-brand-teal/10', border: 'border-brand-teal/20' },
    'QA': { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    'Deploying': { color: 'text-brand-blue', bg: 'bg-brand-blue/10', border: 'border-brand-blue/20' },
    'Complete': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
};

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

    const handleCancelProject = async () => {
        if (!project?.id) return;
        setIsCancelling(true);
        try {
            if (currentUser.is_staff) {
                await api.cancelAdminProject(project.id);
            } else {
                await api.cancelClientProject(project.id);
            }
            router.push('/dashboard?tab=projects'); // Redirect to projects list
        } catch (err) {
            console.error('Failed to cancel project:', err);
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
            setProject(prev => ({ ...prev, stage: 'Complete' })); // Optimistically update UI
            router.push('/dashboard?tab=projects'); // Redirect to projects list
        } catch (err) {
            console.error('Failed to complete project:', err);
        } finally {
            setIsCompleting(false);
            setShowCompleteModal(false);
        }
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

    const {
        isSidebarOpen,
        setIsSidebarOpen,
        loading,
        currentUser,
        projects,
        searchQuery,
        setSearchQuery,
        handleLogout,
        clientInvoices,
        clientProposals,
    } = useDashboard();

    useEffect(() => {
        if (!id) return;
        const loadProject = async () => {
            try {
                setProjectLoading(true);
                const p = await api.getClientProjectDetail(id);
                setProject(p);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load project');
            } finally {
                setProjectLoading(false);
            }
        };
        loadProject();
    }, [id]);

    if (loading || !currentUser) {
        return (
            <div className="min-h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden">
                <AnimatePresence>
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                <DashboardSidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    handleLogout={handleLogout}
                    pendingInvoiceCount={0}
                    pendingProposalCount={0}
                />

                {/* Fixed Topbar */}
                <div className="fixed top-0 right-0 left-0 lg:left-[256px] z-30 bg-[#020617] px-3 lg:px-6 py-3">
                    <DashboardTopbar
                        setIsSidebarOpen={setIsSidebarOpen}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        currentUser={null}
                    />
                </div>

                {/* Main Content with Padding for Fixed Topbar */}
                <main className="lg:pl-[256px] min-h-screen flex flex-col p-0 lg:p-0 pt-[88px] lg:pt-[96px]">
                    <div className="flex-grow flex items-center justify-center px-3 lg:px-6 pb-3 lg:pb-6">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                            <span className="text-tiny font-black uppercase tracking-[0.2em] text-muted">
                                Decrypting Command Space...
                            </span>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const pendingInvoiceCount = clientInvoices.filter(
        (inv) => inv.status !== 'paid' && inv.status !== 'void'
    ).length;
    const pendingProposalCount = clientProposals.filter(
        (prop) => prop.status === 'sent'
    ).length;

    if (projectLoading) {
        return (
            <div className="min-h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden">
                <AnimatePresence>
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                <DashboardSidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    handleLogout={handleLogout}
                    pendingInvoiceCount={pendingInvoiceCount}
                    pendingProposalCount={pendingProposalCount}
                />

                {/* Fixed Topbar */}
                <div className="fixed top-0 right-0 left-0 lg:left-[256px] z-30 bg-[#020617] px-3 lg:px-6 py-3">
                    <DashboardTopbar
                        setIsSidebarOpen={setIsSidebarOpen}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        currentUser={currentUser}
                    />
                </div>

                {/* Main Content with Padding for Fixed Topbar */}
                <main className="lg:pl-[256px] min-h-screen flex flex-col p-0 lg:p-0 pt-[88px] lg:pt-[96px]">
                    <div className="flex-grow flex items-center justify-center px-3 lg:px-6 pb-3 lg:pb-6">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                            <span className="text-tiny font-black uppercase tracking-[0.2em] text-muted">
                                Loading Project...
                            </span>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden">
                <AnimatePresence>
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                <DashboardSidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    handleLogout={handleLogout}
                    pendingInvoiceCount={pendingInvoiceCount}
                    pendingProposalCount={pendingProposalCount}
                />

                {/* Fixed Topbar */}
                <div className="fixed top-0 right-0 left-0 lg:left-[256px] z-30 bg-[#020617] px-3 lg:px-6 py-3">
                    <DashboardTopbar
                        setIsSidebarOpen={setIsSidebarOpen}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        currentUser={currentUser}
                    />
                </div>

                {/* Main Content with Padding for Fixed Topbar */}
                <main className="lg:pl-[256px] min-h-screen flex flex-col p-0 lg:p-0 pt-[88px] lg:pt-[96px]">
                    <div className="flex-grow flex items-center justify-center px-3 lg:px-6 pb-3 lg:pb-6">
                        <div className="text-center max-w-md px-4">
                            <div className="text-tiny font-black uppercase tracking-[0.2em] text-muted mb-2">
                                Error
                            </div>
                            <div className="text-sm text-slate-300 mb-4">
                                {error || 'Project not found'}
                            </div>
                            <Link
                                href="/dashboard?tab=projects"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-tiny font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all"
                            >
                                <ArrowLeft size={12} />
                                Back to Projects
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const milestones = project.milestones || [];
    const files = project.files || [];
    const activities = project.activities || [];
    const completedCount = milestones.filter(m => m.done).length;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
            <AnimatePresence>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <DashboardSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                handleLogout={handleLogout}
                pendingInvoiceCount={pendingInvoiceCount}
                pendingProposalCount={pendingProposalCount}
            />

            {/* Fixed Topbar */}
            <div className="fixed top-0 right-0 left-0 lg:left-[256px] z-30 bg-[#020617] px-3 lg:px-6 py-3">
                <DashboardTopbar
                    setIsSidebarOpen={setIsSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentUser={currentUser}
                />
            </div>

            {/* Main Content with Padding for Fixed Topbar */}
            <main className="lg:pl-[256px] min-h-screen flex flex-col p-0 lg:p-0 pt-[88px] lg:pt-[96px]">
                <div className="flex-grow px-3 lg:px-6 pb-3 lg:pb-6">
                    <div className="w-full">
                        <div className="grid md:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 items-start">
                            {/* Left Main Content Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass border border-white/10 rounded-2xl overflow-hidden w-full order-2 md:order-1"
                            >
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
                                        <span className={getStatusClasses(project.status)}>{project.status}</span>
                                    </div>
                                </div>

                                {/* Responsive Stage Pipeline tracking line */}
                                <ProjectStagePipeline project={project} />

                                {/* Body */}
                                <div className="p-4 lg:p-6 space-y-6">
                                    {/* Project brief section */}
                                    <section>
                                        <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Terminal size={12} className="text-brand-teal" />
                                            Project Brief
                                        </div>
                                        <div className="custom-markdown text-secondary">
                                            {project.description ? (
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({ ...props }) => <h1 className="text-xl font-black text-white mb-4 mt-0" {...props} />,
                                                        h2: ({ ...props }) => <h2 className="text-lg font-bold text-white mb-3 mt-4" {...props} />,
                                                        h3: ({ ...props }) => <h3 className="text-base font-bold text-brand-teal mb-2 mt-3" {...props} />,
                                                        p: ({ ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                                                        ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                                                        ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                                                        li: ({ ...props }) => <li className="text-secondary" {...props} />,
                                                        a: ({ ...props }) => <a className="text-brand-teal hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                        blockquote: ({ ...props }) => <blockquote className="border-l-4 border-brand-teal pl-4 italic text-secondary my-4" {...props} />,
                                                        code: ({ className, children, ...props }) => {
                                                            const match = /language-(\w+)/.exec(className || '');
                                                            return match ? (
                                                                <pre className="bg-white/5 border border-white/10 p-3 rounded-lg overflow-x-auto text-sm mb-3">
                                                                    <code className={className} {...props}>{children}</code>
                                                                </pre>
                                                            ) : (
                                                                <code className="bg-white/10 px-1 py-0.5 rounded text-brand-teal text-sm font-mono" {...props}>{children}</code>
                                                            );
                                                        },
                                                        hr: ({ ...props }) => <hr className="border-white/10 my-4" {...props} />,
                                                        strong: ({ ...props }) => <strong className="text-white font-bold" {...props} />,
                                                        em: ({ ...props }) => <em className="italic text-white/90" {...props} />,
                                                    }}
                                                >
                                                    {project.description}
                                                </ReactMarkdown>
                                            ) : (
                                                <p className="text-muted">No detailed brief provided.</p>
                                            )}
                                        </div>
                                    </section>

                                    {/* Responsive Milestones section */}
                                    {milestones.length > 0 && (
                                        <section>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                                                    <CheckCircle2 size={12} className="text-brand-indigo" />
                                                    Milestones
                                                </div>
                                                <span className="text-[10px] font-black text-brand-teal">
                                                    {completedCount}/{milestones.length} Done
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {milestones.map((m, mi) => (
                                                    <div
                                                        key={m.id || mi}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${m.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'
                                                            }`}
                                                    >
                                                        {m.done ? (
                                                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                                        ) : (
                                                            <Clock size={16} className="text-muted shrink-0" />
                                                        )}
                                                        <span className={`text-tiny font-bold flex-grow leading-normal ${m.done ? 'text-muted line-through' : 'text-white'
                                                            }`}>
                                                            {m.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Tech stack tags */}
                                    {project.tags?.length > 0 && (
                                        <section>
                                            <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Cpu size={12} className="text-brand-red" />
                                                Tech Stack
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {/* Fluid Activity log */}
                                    {activities.length > 0 && (
                                        <section>
                                            <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Activity size={12} className="text-brand-indigo" />
                                                Activity Log
                                            </div>
                                            <div className="max-h-[450px] overflow-y-auto space-y-4 border-l border-white/5 ml-1.5 pl-4 pr-2">
                                                {activities.map((log) => (
                                                    <div key={log.id} className="relative">
                                                        <div className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal" />
                                                        <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">
                                                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                                                        </div>
                                                        <div className="text-tiny text-secondary leading-normal">{log.action_text}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                {/* Footer Protocol bar */}
                                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-2">
                                    <Shield size={12} className="text-brand-teal" />
                                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">
                                        Protected Engineering Protocol
                                    </span>
                                </div>
                            </motion.div>

                            {/* Right Sidebar (Sticky - Wider) */}
                            <div className="space-y-4 md:sticky md:top-[96px] z-20 order-1 md:order-2">
                                <ProjectSidebar
                                    project={project}
                                    clientInvoices={clientInvoices}
                                    clientProposals={clientProposals}
                                    files={files}
                                    isAdmin={currentUser?.is_staff}
                                    onUpload={null}
                                    onDelete={null}
                                    onAddInvoice={null}
                                    onAddProposal={null}
                                    onCancelProject={() => setShowCancelModal(true)}
                                    onCompleteProject={() => setShowCompleteModal(true)}
                                    onEditProject={() => router.push(`/admin/projects/${id}`)} // Placeholder for now
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

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
            />

            {/* Complete Project Confirmation Modal */}
            {currentUser?.is_staff && (
                <ConfirmDangerModal
                    open={showCompleteModal}
                    onClose={() => setShowCompleteModal(false)}
                    title="Complete Project"
                    subtitle="This will mark the project as complete."
                    heading="Are you sure you want to mark this project as complete?"
                    confirmText="Complete Project"
                    loading={isCompleting}
                    onConfirm={handleCompleteProject}
                />
            )}
        </div>
    );
}
