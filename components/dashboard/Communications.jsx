'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, getWebSocketUrl } from '@/lib/api';
import useAuthAndUser from '@/hooks/useAuthAndUser';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { Loader2 } from 'lucide-react';

export default function Communications({ missions = [] }) {
    const { currentUser, loading: userLoading } = useAuthAndUser();
    const [messageText, setMessageText] = useState('');
    const [files, setFiles] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);

    // Real-time states
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const [isAdminTyping, setIsAdminTyping] = useState(false);

    const ws = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isCurrentlyTypingRef = useRef(false);

    // Send typing status to WebSocket
    const sendTypingStatus = (isTyping) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'typing', is_typing: isTyping }));
            isCurrentlyTypingRef.current = isTyping;
        }
    };

    const handleInputChange = (value) => {
        setMessageText(value);
        if (!isCurrentlyTypingRef.current) {
            sendTypingStatus(true);
        }
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingStatus(false);
        }, 1500);
    };

    // Fetch messages and establish WebSocket
    useEffect(() => {
        if (!currentUser || userLoading) {
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
            setMessages([]);
            setMessagesLoading(false);
            return;
        }

        const threadId = currentUser.chat_thread_id;
        if (!threadId) {
            console.warn('No chat thread ID found for current user.');
            setMessages([]);
            setMessagesLoading(false);
            return;
        }

        async function loadChatLog() {
            setMessagesLoading(true);
            try {
                const chatLog = await api.getChatMessages(threadId, false);
                setMessages(chatLog.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) })));
            } catch (err) {
                console.error('Error loading client chat logs:', err);
                setMessages([]);
            } finally {
                setMessagesLoading(false);
            }
        }

        loadChatLog();

        if (ws.current) {
            ws.current.close();
        }

        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const socketUrl = accessToken
            ? `${getWebSocketUrl(threadId)}?token=${accessToken}`
            : getWebSocketUrl(threadId);
        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: 'presence', status: 'online' }));
            ws.current.send(JSON.stringify({ type: 'read_receipt' }));
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.message) {
                // Deduplicate: skip if message ID already exists
                setMessages(prev => {
                    if (prev.some(m => m.id === data.message.id)) return prev;
                    return [...prev, { ...data.message, timestamp: new Date(data.message.timestamp) }];
                });
                if (!data.message.from_client) {
                    ws.current?.send(JSON.stringify({ type: 'read_receipt' }));
                }
            } else if (data.type === 'read_receipt') {
                const isStaffReader = data.is_staff;
                setMessages(prev => prev.map(m => {
                    if (isStaffReader && m.from_client) {
                        return { ...m, is_read: true };
                    } else if (!isStaffReader && !m.from_client) {
                        return { ...m, is_read: true };
                    }
                    return m;
                }));
            } else if (data.type === 'typing' && data.is_staff) {
                setIsAdminTyping(data.is_typing);
            } else if (data.type === 'presence' && data.is_staff) {
                setIsAdminOnline(data.status === 'online');
                if (data.status === 'online') {
                    ws.current?.send(JSON.stringify({ type: 'presence', status: 'online' }));
                }
            }
        };

        ws.current.onerror = (err) => console.error('WebSocket error:', err);
        ws.current.onclose = () => console.log('WebSocket disconnected for thread:', threadId);

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            if (ws.current) {
                if (ws.current.readyState === WebSocket.OPEN) {
                    try {
                        ws.current.send(JSON.stringify({ type: 'presence', status: 'offline' }));
                    } catch (_) { /* ignore */ }
                }
                ws.current.close();
                ws.current = null;
            }
        };
    }, [currentUser, userLoading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedText = messageText.trim();
        if (!trimmedText && files.length === 0) return;
        if (isSending) return;
        if (!currentUser || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

        try {
            setIsSending(true);
            sendTypingStatus(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            ws.current.send(JSON.stringify({ message: trimmedText }));
            setMessageText('');
            setFiles([]);
        } catch (err) {
            console.error('Transmission failed:', err);
        } finally {
            setIsSending(false);
        }
    };

    // ─── Layout approach: fixed positioning ──────────────────────────────────
    //
    // The dashboard layout.jsx uses `min-h-screen` (not a bounded height), which
    // means flex children with `h-full` have no reference point and grow infinitely,
    // causing a full-page scrollbar. Using `position: fixed` with explicit viewport
    // anchors bypasses this entirely — identical to how the admin comms page works.
    //
    //   top-[100px]   → below the fixed topbar (height ~100px)
    //   left-0 lg:left-64 → beside the sidebar on desktop (256px = 64 * 4)
    //   bottom-0 right-0  → fills to screen edges
    //
    return (
        <motion.div
            key="comms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[100px] bottom-0 left-0 lg:left-64 right-0 flex flex-col bg-[#020617] overflow-hidden"
        >
            {/* Padded inner wrapper */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-3 lg:p-6 pt-0 lg:pt-4">
                <div className="glass border border-white/5 rounded-xl flex-1 flex flex-col min-h-0 overflow-hidden bg-[#060814]/40">

                    {/* Header — always visible at top */}
                    <ChatHeader isAdminOnline={isAdminOnline} />

                    {/* Messages area — only this section scrolls */}
                    <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                        <AnimatePresence mode="wait">
                            {messagesLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex items-center justify-center"
                                >
                                    <Loader2 size={32} className="animate-spin text-brand-teal" />
                                </motion.div>
                            ) : (
                                <ChatBody
                                    key="messages"
                                    messages={messages}
                                    isAdminTyping={isAdminTyping}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer — always visible at bottom */}
                    <ChatFooter
                        messageText={messageText}
                        setMessageText={handleInputChange}
                        files={files}
                        setFiles={setFiles}
                        isSending={isSending}
                        onSubmit={handleSendMessage}
                    />
                </div>
            </div>
        </motion.div>
    );
}