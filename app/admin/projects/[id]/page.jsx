'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import ProjectSidebar from '@/components/dashboard/ProjectSidebar';
import ProjectStagePipeline from '@/components/dashboard/ProjectStagePipeline';
import ProjectBrief from '@/components/dashboard/ProjectBrief';
import ProjectMilestones from '@/components/dashboard/ProjectMilestones';
import ProjectTags from '@/components/dashboard/ProjectTags';
import ProjectActivityLog from '@/components/dashboard/ProjectActivityLog';
import ProjectProtocolFooter from '@/components/dashboard/ProjectProtocolFooter';

const STAGES = ['Analysis', 'Architecture', 'Dev', 'QA', 'Staging', 'Complete'];

export default function AdminProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [projectLoading, setProjectLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientInvoices, setClientInvoices] = useState([]);
    const [clientProposals, setClientProposals] = useState([]);

    useEffect(() => {
        if (!id) return;
        const loadProject = async () => {
            try {
                setProjectLoading(true);
                const [p, invoices, proposals] = await Promise.all([
                    api.getAdminProjectDetail(id),
                    api.getAdminProjectInvoices(id),
                    api.getAdminProjectProposals(id),
                ]);
                setProject(p);
                setClientInvoices(Array.isArray(invoices) ? invoices : invoices.results || []);
                setClientProposals(Array.isArray(proposals) ? proposals : proposals.results || []);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load project');
            } finally {
                setProjectLoading(false);
            }
        };
        loadProject();
    }, [id]);

    if (projectLoading) {
        return (
            <div className="w-full flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                    <span className="text-tiny font-black uppercase tracking-[0.2em] text-muted">
                        Loading Project...
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

    return (
        <div className="w-full mt-[80px]">
            {/* FIX 1: Removed `items-start` from this grid. 
              This allows the right-side grid column track to stretch all the way down to match the height of the left content card.
            */}
            <div className="grid md:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6">

                {/* Left Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass border border-white/10 rounded-2xl overflow-hidden w-full h-fit"
                >
                    {/* Header Layout */}
                    <div className="p-2 lg:p-4 border-b border-white/5 bg-white/[0.02]">
                        <div>
                            <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">
                                {project.id} • {project.priority || 'Standard'} Priority
                            </div>
                            <h1 className="text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight">
                                {project.title}
                            </h1>
                        </div>
                    </div>

                    <ProjectStagePipeline project={project} stages={STAGES} />

                    <div className="p-4 lg:p-6 space-y-6">
                        <ProjectBrief project={project} />
                        {milestones.length > 0 && (
                            <ProjectMilestones milestones={milestones} />
                        )}
                        <ProjectTags tags={project.tags} />
                        {activities.length > 0 && (
                            <ProjectActivityLog activities={activities} />
                        )}
                    </div>

                    <ProjectProtocolFooter />
                </motion.div>

                {/* FIX 2: Sticky Right Sidebar Wrap 
                  - We target desktop screens using `md:`.
                  - `h-fit` forces the *inner* content block to remain compact while it glides down the open grid track.
                  - Changed top offset to `md:top-[110px]` to leave space for your navigation header.
                */}
                <aside className="hidden md:block md:sticky md:top-0 h-fit space-y-4">
                    <ProjectSidebar
                        project={project}
                        clientInvoices={clientInvoices}
                        clientProposals={clientProposals}
                        files={files}
                    />
                </aside>

                {/* Mobile version fallback (renders below content stack normally) */}
                <div className="block md:hidden space-y-4">
                    <ProjectSidebar
                        project={project}
                        clientInvoices={clientInvoices}
                        clientProposals={clientProposals}
                        files={files}
                    />
                </div>

            </div>
        </div>
    );
}