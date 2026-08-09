'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { api, getWebSocketUrl } from '@/lib/api';

export default function useBuyerCommsUnread(currentUser) {
    const pathname = usePathname();
    const [hasUnreadComms, setHasUnreadComms] = useState(false);
    const wsRef = useRef(null);

    const isCommsPage = pathname === '/dashboard/comms';

    // 1. Initial check of unread messages when user/thread is ready
    useEffect(() => {
        if (!currentUser) return;
        const threadId = currentUser.chat_thread_id || localStorage.getItem('chat_thread_id');
        if (!threadId) return;

        api.getChatMessages(threadId, false)
            .then(chatLog => {
                const unread = (chatLog || []).filter(m => !m.from_client && !m.is_read);
                if (unread.length > 0 && !isCommsPage) {
                    setHasUnreadComms(true);
                }
            })
            .catch(() => {});
    }, [currentUser, isCommsPage]);

    // 2. Clear red dot when user navigates to comms page
    useEffect(() => {
        if (isCommsPage) {
            setHasUnreadComms(false);
        }
    }, [isCommsPage]);

    // 3. Real-time WebSocket listener for incoming messages from staff
    useEffect(() => {
        if (!currentUser) return;
        const threadId = currentUser.chat_thread_id || localStorage.getItem('chat_thread_id');
        if (!threadId) return;

        const token = typeof window !== 'undefined' ? (localStorage.getItem('access_token') || '') : '';
        const url = `${getWebSocketUrl(threadId)}?token=${token}`;
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'message' || data.message) {
                    const raw = data.message || data;
                    if (!raw.from_client) {
                        if (window.location.pathname !== '/dashboard/comms') {
                            setHasUnreadComms(true);
                        }
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
