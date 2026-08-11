'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const VALID_TABS = ['projects', 'services', 'portfolio', 'blog', 'vault', 'comms', 'billing', 'settings'];

export default function useDashboardNavigation() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize directly from URL — no hardcoded default that races with the URL
    const [activeTab, setActiveTabState] = useState(() => {
        const urlTab = searchParams.get('tab');
        return VALID_TABS.includes(urlTab) ? urlTab : 'projects';
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Keep activeTab in sync when Next.js router searchParams change (e.g. browser back/forward)
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && VALID_TABS.includes(tab) && tab !== activeTab) {
            setActiveTabState(tab);
        }
    }, [searchParams]); // intentionally exclude activeTab to avoid circular updates

    const handleTabChange = (newTab) => {
        if (!VALID_TABS.includes(newTab)) return;
        setActiveTabState(newTab);
        router.replace(`/dashboard?tab=${newTab}`);
    };

    return {
        activeTab,
        setActiveTab: handleTabChange,
        isSidebarOpen,
        setIsSidebarOpen,
    };
}
