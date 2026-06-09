'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function useDashboardNavigation() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('projects');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Sync activeTab with URL query parameter
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        } else if (!tab && activeTab !== 'projects') {
            // If no tab in URL, default to 'projects'
            router.replace(`?tab=projects`);
        }
    }, [searchParams, activeTab, router]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        router.replace(`?tab=${newTab}`);
    };

    return {
        activeTab,
        setActiveTab: handleTabChange,
        isSidebarOpen,
        setIsSidebarOpen,
    };
}
