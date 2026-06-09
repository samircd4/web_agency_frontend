'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { api } from '@/lib/api';

export default function useProjectsData(currentUser) {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [projectsLoading, setProjectsLoading] = useState(true);
    const mountedRef = useRef(false);

    // ── Initial data fetch for projects ─────────────────────────────────────────────────
    useEffect(() => {
        if (!currentUser || mountedRef.current) return;
        mountedRef.current = true;

        const initProjects = async () => {
            try {
                const compactProjects = await api.getClientProjects();

                const detailedProjects = await Promise.all(
                    compactProjects.map(async (p) => {
                        try {
                            return await api.getClientProjectDetail(p.id);
                        } catch (err) {
                            console.error(`Failed to fetch project detail for ${p.id}`, err);
                            return {
                                ...p,
                                description: 'Brief details retrieved from directory.',
                                tags: [],
                                milestones: [],
                                files: [],
                                activities: [],
                            };
                        }
                    })
                );
                setProjects(detailedProjects);
            } catch (err) {
                console.error('Failed to initialize projects:', err);
            } finally {
                setProjectsLoading(false);
            }
        };

        initProjects();
    }, [currentUser]);

    const filteredProjects = useMemo(() => {
        return projects.filter((p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projects, searchQuery]);

    const totalInvestment = useMemo(() => {
        return projects.reduce((sum, p) => sum + Number(p.value || 0), 0);
    }, [projects]);

    const activeProjectsCount = useMemo(() => {
        return projects.filter((p) => p.stage !== 'Complete').length;
    }, [projects]);

    const vaultFiles = useMemo(() => {
        return projects.flatMap((p) =>
            (p.files || []).map((f) => ({
                ...f,
                projectName: p.title,
                projectId: p.id,
            }))
        );
    }, [projects]);

    const deliverablesCount = useMemo(() => {
        return vaultFiles.length;
    }, [vaultFiles]);

    return {
        projects,
        setProjects,
        selectedProject,
        setSelectedProject,
        searchQuery,
        setSearchQuery,
        filteredProjects,
        totalInvestment,
        activeProjectsCount,
        deliverablesCount,
        vaultFiles,
        projectsLoading,
    };
}
