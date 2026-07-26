'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, getWebSocketUrl } from '@/lib/api';
import useAuthAndUser from '@/hooks/useAuthAndUser';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { Loader2, Search, User, MessageSquare, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

function playNotificationSound() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(783.99, now);
        gain1.gain.setValueAtTime(0.08, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.50, now + 0.08);
        gain2.gain.setValueAtTime(0.08, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.3);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.38);
    } catch (e) {
        console.warn('Could not play notification sound:', e);
    }
}

function SellerRow({ thread, isActive, onClick }) {
    const seller = thread?.seller;
    const service = thread?.service;
    const project = thread?.project;
    const last = thread?.last_message;
    const sellerName = seller?.name || 'Dr. Python';
    const sellerLevel = seller?.level || 'Top Rated Seller';
    const avatarUrl = seller?.avatar;

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-3.5 transition-all hover:bg-white/5 border-b border-white/5 last:border-0 ${isActive ? 'bg-brand-teal/10 border-l-2 border-l-brand-teal' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center overflow-hidden">
                        {avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={avatarUrl} alt={sellerName} className="w-full h-full object-cover" />
                        ) : (
                            <User size={18} className="text-brand-teal" />
                        )}
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-white text-xs font-black truncate">{sellerName}</span>
                        {thread.unread_count > 0 && (
                            <span className="px-1.5 py-0.5 bg-brand-teal rounded-full text-[9px] font-black text-slate-950 shrink-0">
                                {thread.unread_count}
                            </span>
                        )}
                    </div>
                    <div className="text-[10px] text-brand-teal font-bold truncate mb-1">
                        {service ? `Service: ${service.title}` : project ? `Project: ${project.title}` : thread.subject || sellerLevel}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                        {last?.text || 'No messages yet'}
                    </div>
                </div>
            </div>
        </button>
    );
}

export default function Communications({ missions = [] }) {
    const { currentUser, loading: userLoading } = useAuthAndUser();
    const [messageText, setMessageText] = useState('');
    const [files, setFiles] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [threads, setThreads] = useState([]);
    const [activeThreadId, setActiveThreadId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileList, setShowMobileList] = useState(true);

    // Real-time states
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const [isAdminTyping, setIsAdminTyping] = useState(false);

    const ws = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isCurrentlyTypingRef = useRef(false);

    // Read thread ID from URL query params
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tId = params.get('thread') || params.get('thread_id');
            if (tId) {
                setActiveThreadId(tId);
                setShowMobileList(false);
            }
        }
    }, []);

    // Load available client threads
    useEffect(() => {
        if (!currentUser || userLoading) return;
        api.getClientChatThreads().then(res => {
            const list = Array.isArray(res) ? res : res.results || [];
            setThreads(list);
            if (!activeThreadId && list.length > 0) {
                setActiveThreadId(list[0].id);
            }
        }).catch(() => {});
    }, [currentUser, userLoading, activeThreadId]);

    const activeThread = useMemo(() => {
        return threads.find(t => String(t.id) === String(activeThreadId)) || threads[0] || null;
    }, [threads, activeThreadId]);

    const filteredThreads = useMemo(() => {
        if (!searchQuery.trim()) return threads;
        const q = searchQuery.toLowerCase().trim();
        return threads.filter(t => {
            const sName = t.seller?.name || '';
            const sTitle = t.service?.title || '';
            const pTitle = t.project?.title || '';
            const subj = t.subject || '';
            return sName.toLowerCase().includes(q) ||
                sTitle.toLowerCase().includes(q) ||
                pTitle.toLowerCase().includes(q) ||
                subj.toLowerCase().includes(q);
        });
    }, [threads, searchQuery]);

    const handleSelectThread = (threadId) => {
        setActiveThreadId(threadId);
        setShowMobileList(false);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('thread', threadId);
            window.history.replaceState({}, '', url.toString());
        }
    };

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

        const threadId = activeThreadId || activeThread?.id || currentUser.chat_thread_id;
        if (!threadId) {
            setMessages([]);
            setMessagesLoading(false);
            return;
        }

        async function loadChatLog() {
            setMessagesLoading(true);
            try {
                const chatLog = await api.getClientThreadMessages(threadId);
                setMessages((Array.isArray(chatLog) ? chatLog : []).map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) })));
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
                if (!data.message.from_client) {
                    playNotificationSound();
                }
                setMessages(prev => {
                    const existsIdx = prev.findIndex(m => m.id === data.message.id || (m.isOptimistic && m.text === data.message.text));
                    if (existsIdx !== -1) {
                        const updated = [...prev];
                        updated[existsIdx] = { ...data.message, timestamp: new Date(data.message.timestamp) };
                        return updated;
                    }
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
    }, [currentUser, userLoading, activeThreadId, activeThread?.id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedText = messageText.trim();
        if (!trimmedText && files.length === 0) return;
        if (isSending) return;
        if (!currentUser) return;

        const tempId = `temp-${Date.now()}`;
        const optimisticMsg = {
            id: tempId,
            text: trimmedText,
            from_client: true,
            is_read: false,
            timestamp: new Date(),
            isOptimistic: true,
        };

        try {
            setIsSending(true);
            setMessages(prev => [...prev, optimisticMsg]);
            setMessageText('');

            if (files.length > 0) {
                const formData = new FormData();
                formData.append('text', trimmedText);
                formData.append('attachment', files[0]);
                formData.append('thread_id', activeThreadId || activeThread?.id);
                const res = await api.sendClientThreadMessage(formData);
                setFiles([]);
                setMessages(prev => prev.map(m => m.id === tempId ? { ...res, timestamp: new Date(res.timestamp) } : m));
            } else if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                sendTypingStatus(false);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                ws.current.send(JSON.stringify({ message: trimmedText }));
            } else {
                const res = await api.sendClientThreadMessage({
                    text: trimmedText,
                    thread_id: activeThreadId || activeThread?.id
                });
                setMessages(prev => prev.map(m => m.id === tempId ? { ...res, timestamp: new Date(res.timestamp) } : m));
            }
        } catch (err) {
            console.error('Transmission failed:', err);
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setIsSending(false);
        }
    };

    return (
        <motion.div
            key="comms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[100px] bottom-0 left-0 lg:left-64 right-0 flex flex-col bg-[#020617] overflow-hidden"
        >
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-3 lg:p-6 pt-0 lg:pt-4">
                <div className="glass border border-white/5 rounded-xl flex-1 flex min-h-0 overflow-hidden bg-[#060814]/40">

                    {/* Left Sidebar: Sellers Roster */}
                    <div className={`${showMobileList ? 'flex' : 'hidden lg:flex'} w-full lg:w-80 border-r border-white/10 bg-white/[0.01] flex-col h-full min-h-0 shrink-0`}>
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <span>Sellers</span>
                                    <span className="px-2 py-0.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-[10px] font-black text-brand-teal">
                                        {threads.length}
                                    </span>
                                </div>
                            </div>

                            {/* Search Filter */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Filter sellers or inquiries..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-teal"
                                />
                                <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500 pointer-events-none" />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-slate-500 hover:text-white">
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Roster List */}
                        <div className="overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                            {filteredThreads.map(thread => (
                                <SellerRow
                                    key={thread.id}
                                    thread={thread}
                                    isActive={String(thread.id) === String(activeThreadId || activeThread?.id)}
                                    onClick={() => handleSelectThread(thread.id)}
                                />
                            ))}

                            {filteredThreads.length === 0 && (
                                <div className="p-8 text-center text-slate-500 text-xs">
                                    No seller conversations found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Workspace: Chat Stream */}
                    <div className={`${!showMobileList ? 'flex' : 'hidden lg:flex'} flex-1 flex-col min-h-0 overflow-hidden`}>
                        {activeThread ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setShowMobileList(true)}
                                        className="lg:hidden ml-3 p-2 bg-white/5 text-slate-400 hover:text-white rounded-lg"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                    <div className="flex-1">
                                        <ChatHeader
                                            isAdminOnline={isAdminOnline}
                                            activeThread={activeThread}
                                            threads={threads}
                                            onSelectThread={(tId) => handleSelectThread(tId)}
                                        />
                                    </div>
                                </div>

                                {/* Messages Stream */}
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

                                {/* Chat Input Footer */}
                                <ChatFooter
                                    messageText={messageText}
                                    setMessageText={handleInputChange}
                                    files={files}
                                    setFiles={setFiles}
                                    isSending={isSending}
                                    onSubmit={handleSendMessage}
                                />
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal">
                                    <MessageSquare size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">No Seller Conversations Yet</h3>
                                    <p className="text-slate-400 text-xs mt-1 max-w-sm">
                                        You haven&apos;t started any chats with sellers yet. Browse our service marketplace to contact a seller directly.
                                    </p>
                                </div>
                                <Link
                                    href="/services"
                                    className="px-5 py-2.5 bg-brand-teal text-slate-950 font-black uppercase tracking-wider text-xs rounded-xl shadow-glow-teal hover:-translate-y-0.5 transition-all"
                                >
                                    Explore Services
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}