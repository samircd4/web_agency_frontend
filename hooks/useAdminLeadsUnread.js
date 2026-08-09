'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export default function useAdminLeadsUnread(currentUser) {
    const pathname = usePathname();
    const [hasUnreadLeads, setHasUnreadLeads] = useState(false);

    const isLeadsPage = pathname === '/admin/leads';

    useEffect(() => {
        if (!currentUser?.is_staff) return;

        let isCancelled = false;

        const checkLeads = async () => {
            try {
                const res = await api.getAdminLeads();
                if (isCancelled) return;
                const leads = Array.isArray(res) ? res : res.results || [];
                const seenCount = parseInt(localStorage.getItem('admin_seen_lead_count') || '0', 10);

                if (leads.length > seenCount && !isLeadsPage) {
                    setHasUnreadLeads(true);
                }

                if (isLeadsPage) {
                    localStorage.setItem('admin_seen_lead_count', String(leads.length));
                    setHasUnreadLeads(false);
                }
            } catch (_) {}
        };

        checkLeads();
        // Poll every 30 seconds for new leads
        const interval = setInterval(checkLeads, 30000);

        return () => {
            isCancelled = true;
            clearInterval(interval);
        };
    }, [currentUser, isLeadsPage]);

    useEffect(() => {
        if (isLeadsPage) {
            setHasUnreadLeads(false);
        }
    }, [isLeadsPage]);

    return hasUnreadLeads;
}
