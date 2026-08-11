'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, getWebSocketUrl } from '@/lib/api';
import useAuthAndUser from '@/hooks/useAuthAndUser';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { Loader2, Users, Store, ShieldCheck } from 'lucide-react';

export default function Communications({ missions = [], isSellerMode = false }) {
    const { currentUser, loading: userLoading } = useAuthAndUser();
    const [activeChannel, setActiveChannel] = useState('support'); // 'support' | 'direct'
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

    // ── Generate profile list for Client / Seller tabs ─────────────────────
    const profileList = useMemo(() => {
        if (isSellerMode) {
            // Seller Mode -> Clients List
            const list = [];
            const seen = new Set();
            (missions || []).forEach((m, idx) => {
                const name = m.client_name || m.client?.full_name || m.client?.username;
                if (name && !seen.has(name)) {
                    seen.add(name);
                    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CL';
                    list.push({
                        id: m.client_id || m.client?.id || `client-${idx}`,
                        name: name,
                        subtitle: m.title ? `Order: ${m.title}` : 'Project Client Direct',
                        initials,
                        isOnline: true,
                    });
                }
            });
            if (list.length === 0) {
                list.push({
                    id: 'client-default',
                    name: 'Client Account',
                    subtitle: 'Project Client Direct',
                    initials: 'CA',
                    isOnline: true,
                });
            }
            return list;
        } else {
            // Buyer Mode -> Sellers List
            const list = [];
            const seen = new Set();
            (missions || []).forEach((m, idx) => {
                const name = m.assigned_to_name || m.seller?.full_name;
                if (name && !seen.has(name)) {
                    seen.add(name);
                    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SE';
                    list.push({
                        id: m.assigned_to_id || m.seller?.id || `seller-${idx}`,
                        name: name,
                        subtitle: m.title ? `Assigned to: ${m.title}` : 'Assigned Seller / Engineer',
                        initials,
                        isOnline: true,
                    });
                }
            });
            // Ensure standard seller profiles exist for selection
            const defaultSellers = [
                { id: 'seller-team', name: 'Dr. Python Team', subtitle: 'Platform Core Team', initials: 'DP', isOnline: true },
                { id: 'seller-lead', name: 'Lead Python Engineer', subtitle: 'Senior Backend Specialist', initials: 'PE', isOnline: true },
                { id: 'seller-ai', name: 'AI & Data Specialist', subtitle: 'Machine Learning Lead', initials: 'AI', isOnline: true },
            ];
            defaultSellers.forEach(ds => {
                if (!seen.has(ds.name)) {
                    list.push(ds);
                }
            });
            return list;
        }
    }, [missions, isSellerMode]);

    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        if (activeChannel === 'direct' && profileList.length > 0) {
            if (!selectedProfile || !profileList.some(p => p.id === selectedProfile.id)) {
                setSelectedProfile(profileList[0]);
            }
        }
    }, [activeChannel, profileList]);

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
            }
        };

        ws.current.onerror = (err) => console.error('WebSocket error:', err);
        ws.current.onclose = () => {};

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

    // Calculate participant info for header based on selection
    let participantTitle = 'Dr. Support';
    let participantSubtitle = 'Platform Admin Support';
    let participantInitials = 'DP';
    let participantOnline = isAdminOnline;

    if (activeChannel === 'direct') {
        const current = selectedProfile || profileList[0];
        if (current) {
            participantTitle = current.name;
            participantSubtitle = current.subtitle;
            participantInitials = current.initials;
            participantOnline = current.isOnline ?? true;
        }
    }

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
                {/* Communications Header Tab Bar */}
                <div className="flex-shrink-0 flex items-center gap-1 px-1 pb-0 mb-1 border-b border-white/10">
                    <button
                        type="button"
                        onClick={() => setActiveChannel('support')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-black uppercase tracking-wider transition-all relative ${
                            activeChannel === 'support'
                                ? 'bg-teal-950/60 text-brand-teal border-t border-x border-brand-teal/30'
                                : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        <ShieldCheck size={14} className="text-brand-teal" />
                        <span>Dr. Support</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveChannel('direct')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-xs font-black uppercase tracking-wider transition-all relative ${
                            activeChannel === 'direct'
                                ? isSellerMode
                                    ? 'bg-purple-950/60 text-purple-300 border-t border-x border-purple-500/30'
                                    : 'bg-teal-950/60 text-brand-teal border-t border-x border-brand-teal/30'
                                : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {isSellerMode ? (
                            <>
                                <Users size={14} className="text-purple-400" />
                                <span>Clients</span>
                            </>
                        ) : (
                            <>
                                <Store size={14} className="text-brand-teal" />
                                <span>Sellers</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="glass border border-white/5 rounded-xl flex-1 flex flex-row min-h-0 overflow-hidden bg-[#060814]/40">
                    {/* Left Side Panel for Direct Chat (Clients / Sellers) */}
                    {activeChannel === 'direct' && (
                        <div className="w-full sm:w-64 md:w-72 border-r border-white/10 flex flex-col min-h-0 shrink-0 bg-[#040612]/60">
                            <div className="p-3 border-b border-white/10 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    {isSellerMode ? 'Client List' : 'Seller List'}
                                </span>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-500">
                                    {profileList.length}
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                                {profileList.map((item) => {
                                    const isSelected = selectedProfile?.id === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setSelectedProfile(item)}
                                            className={`w-full p-3 flex items-center gap-3 text-left transition-all hover:bg-white/5 ${
                                                isSelected
                                                    ? isSellerMode
                                                        ? 'bg-purple-500/15 border-l-2 border-l-purple-400'
                                                        : 'bg-teal-500/15 border-l-2 border-l-brand-teal'
                                                    : ''
                                            }`}
                                        >
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border ${
                                                isSelected
                                                    ? isSellerMode ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-brand-teal/20 text-brand-teal border-brand-teal/40'
                                                    : 'bg-white/5 text-slate-300 border-white/10'
                                            }`}>
                                                {item.initials}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-bold text-white truncate">{item.name}</div>
                                                <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.subtitle}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Right Chat Area */}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        {/* Header — displays active participant name */}
                        <ChatHeader
                            title={participantTitle}
                            subtitle={participantSubtitle}
                            initials={participantInitials}
                            isOnline={participantOnline}
                            isSellerMode={isSellerMode && activeChannel === 'direct'}
                        />

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
            </div>
        </motion.div>
    );
}