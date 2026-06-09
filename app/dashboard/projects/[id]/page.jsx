'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import useDashboard from '@/hooks/useDashboard';
import ProjectSidebar from '@/components/dashboard/ProjectSidebar';
import ProjectStagePipeline from '@/components/dashboard/ProjectStagePipeline';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';

import ProjectDetailHeader from '@/components/dashboard/project-detail/ProjectDetailHeader';
import ProjectBriefSection from '@/components/dashboard/project-detail/ProjectBriefSection';
import ProjectMilestonesSection from '@/components/dashboard/project-detail/ProjectMilestonesSection';
import ProjectTechStackSection from '@/components/dashboard/project-detail/ProjectTechStackSection';
import ProjectActivityLogSection from '@/components/dashboard/project-detail/ProjectActivityLogSection';
import ProjectDetailFooter from '@/components/dashboard/project-detail/ProjectDetailFooter';
import ProjectCancelModal from '@/components/dashboard/project-detail/ProjectCancelModal';
import ProjectCompleteModal from '@/components/dashboard/project-detail/ProjectCompleteModal';

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

    // ── All hooks called unconditionally ────────────────────────────────────
    const {
        loading,
        currentUser,
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

    const handleCompleteProject = async () => {
        if (!project?.id) return;
        setIsCompleting(true);
        try {
            await api.completeAdminProject(project.id);
            setProject(prev => ({ ...prev, stage: 'Complete' }));
            router.push('/dashboard/projects');
        } catch (err) {
            console.error('Failed to complete project:', err);
        } finally {
            setIsCompleting(false);
            setShowCompleteModal(false);
        }
    };

    // ── Conditional renders (after all hooks) ────────────────────────────────
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

    const milestones = project.milestones || [];
    const files = project.files || [];
    const activities = project.activities || [];

    return (
        <div className="flex-grow px-3 lg:px-6 pb-3 lg:pb-6">
            <div className="w-full">
                <div className="grid md:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 items-start">
                    {/* Left Main Content Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass border border-white/10 rounded-2xl overflow-hidden w-full order-2 md:order-1"
                    >
                        {/* Header */}
                        <ProjectDetailHeader project={project} />

                        {/* Stage Pipeline */}
                        <ProjectStagePipeline project={project} />

                        {/* Body */}
                        <div className="p-4 lg:p-6 space-y-6">
                            {/* Project brief section */}
                            <ProjectBriefSection description={project.description} />

                            {/* Milestones section */}
                            <ProjectMilestonesSection milestones={milestones} />

                            {/* Tech stack tags */}
                            <ProjectTechStackSection tags={project.tags} />

                            {/* Activity log */}
                            <ProjectActivityLogSection activities={activities} />
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
                            files={files}
                            isAdmin={currentUser?.is_staff}
                            onUpload={null}
                            onDelete={null}
                            onAddInvoice={null}
                            onAddProposal={null}
                            onCancelProject={() => setShowCancelModal(true)}
                            onCompleteProject={() => setShowCompleteModal(true)}
                            onEditProject={() => router.push(`/admin/projects/${id}`)}
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

            {/* Complete Project Confirmation Modal */}
            {currentUser?.is_staff && (
                <ProjectCompleteModal
                    open={showCompleteModal}
                    onClose={() => setShowCompleteModal(false)}
                    loading={isCompleting}
                    onConfirm={handleCompleteProject}
                />
            )}
        </div>
    );
}
