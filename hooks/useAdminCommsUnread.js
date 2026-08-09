'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { api, getGuestWatchWebSocketUrl } from '@/lib/api';

export default function useAdminCommsUnread(currentUser) {
    const pathname = usePathname();
    const [hasUnreadComms, setHasUnreadComms] = useState(false);
    const wsRef = useRef(null);

    const isCommsPage = pathname === '/admin/communications';

    // 1. Initial check of clients & guest sessions unread count
    useEffect(() => {
        if (!currentUser?.is_staff) return;

        let isCancelled = false;

        const checkUnread = async () => {
            try {
                const [clients, guests] = await Promise.all([
                    api.getAdminClients().catch(() => []),
                    api.getGuestSessions().catch(() => []),
                ]);
                if (isCancelled) return;

                const clientUnread = (clients || []).reduce((sum, c) => sum + (c.unread_count || 0), 0);
                const guestUnread = (guests || []).reduce((sum, g) => sum + (g.unread_count || 0), 0);

                if ((clientUnread > 0 || guestUnread > 0) && !isCommsPage) {
                    setHasUnreadComms(true);
                }
            } catch (_) {}
        };

        checkUnread();

        return () => {
            isCancelled = true;
        };
    }, [currentUser, isCommsPage]);

    // 2. Clear red dot when admin views communications page
    useEffect(() => {
        if (isCommsPage) {
            setHasUnreadComms(false);
        }
    }, [isCommsPage]);

    // 3. Real-time GuestWatch WebSocket listener for incoming messages from clients/guests
    useEffect(() => {
        if (!currentUser?.is_staff) return;
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!accessToken) return;

        const socketUrl = `${getGuestWatchWebSocketUrl()}?token=${accessToken}`;
        const ws = new WebSocket(socketUrl);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const eventType = data.type;
                if (eventType === 'new_message' || eventType === 'client_message') {
                    if (window.location.pathname !== '/admin/communications') {
                        setHasUnreadComms(true);
                    }
                }
            } catch (_) {}
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [currentUser]);

    return hasUnreadComms;
}
