'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api, getWebSocketUrl, getGuestWebSocketUrl, getGuestWatchWebSocketUrl } from '@/lib/api';
import useAuthAndUser from '@/hooks/useAuthAndUser';

import ClientListPanel from '@/components/admin/ClientListPanel';
import ChatWindow from '@/components/admin/ChatWindow';
import EmptyChatState from '@/components/admin/EmptyChatState';
import { Users, Globe, Wifi, MessageSquare, Send, X, ArrowLeft, Circle, Check, CheckCheck } from 'lucide-react';

// ─── Guest Session List Row ──────────────────────────────────────────────────

function GuestRow({ session, isActive, onClick }) {
    const last = session.last_message;
    const name = session.name && session.name !== 'Guest' ? session.name : (session.email || `Visitor ${String(session.id).slice(0, 8)}`);
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-3 transition-all hover:bg-white/5 border-b border-white/5 last:border-0 ${isActive ? 'bg-brand-teal/10 border-l-2 border-l-brand-teal' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Globe size={16} className="text-violet-400" />
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#060814] ${session.is_online ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium truncate">{name}</span>
                        {session.unread_count > 0 && (
                            <span className="ml-2 w-5 h-5 bg-brand-teal rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0">
                                {session.unread_count > 9 ? '9+' : session.unread_count}
                            </span>
                        )}
                    </div>
                    {session.is_typing ? (
                        <p className="text-brand-teal text-xs font-medium animate-pulse mt-0.5">
                            is typing...
                        </p>
                    ) : (
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 min-w-0">
                            {last && !last.from_guest && (
                                <span className="shrink-0">
                                    {last.is_read ? (
                                        <CheckCheck className="w-3.5 h-3.5 text-brand-teal" />
                                    ) : (
                                        <Check className="w-3.5 h-3.5 text-slate-600" />
                                    )}
                                </span>
                            )}
                            <span className="truncate flex-grow">
                                {last ? last.text : 'No messages yet'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
}

// ─── Guest Chat Window ───────────────────────────────────────────────────────

function GuestChatWindow({
    session,
    messages,
    isGuestOnline,
    isGuestTyping,
    onSendMessage,
    onTypingStatusChange,
    onBack
}) {
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);
    const inputRef = useRef(null);

    const sessionId = String(session.id);
    const name = session.name && session.name !== 'Guest' ? session.name : (session.email || `Visitor ${sessionId.slice(0, 8)}`);

    useEffect(() => {
        // Reset local typing state on session change
        isTypingRef.current = false;
        setInput('');
        return () => {
            clearTimeout(typingTimeoutRef.current);
            if (isTypingRef.current && onTypingStatusChange) {
                onTypingStatusChange(false);
            }
        };
    }, [sessionId, onTypingStatusChange]);

    useEffect(() => {
        const scrollToBottom = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
            }
        };
        scrollToBottom();
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isGuestTyping]);

    const sendTypingStatus = (typing) => {
        if (!onTypingStatusChange) return;
        if (isTypingRef.current === typing) return;
        isTypingRef.current = typing;
        onTypingStatusChange(typing);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        sendTypingStatus(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => sendTypingStatus(false), 1500);
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || isSending) return;
        
        sendTypingStatus(false);
        clearTimeout(typingTimeoutRef.current);

        setIsSending(true);
        try {
            await onSendMessage(text);
            setInput('');
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        } catch (err) {
            console.error('Guest reply failed:', err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="flex-grow flex flex-col h-full min-h-0 overflow-hidden"
        >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 border-b border-white/8 bg-white/[0.01]">
                <button onClick={onBack} className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    <ArrowLeft size={18} className="text-slate-400" />
                </button>
                <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Globe size={16} className="text-violet-400" />
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#060814] ${isGuestOnline ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                </div>
                <div>
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isGuestOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                        <span className="text-xs text-slate-500">{isGuestOnline ? 'Currently on site' : 'Left site'}</span>
                        {session.page_url && (
                            <span className="text-xs text-slate-600 truncate max-w-[120px]">· {session.page_url}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-[#060814]">
                {messages.length === 0 && (
                    <div className="text-center text-slate-600 text-sm pt-8">No messages yet</div>
                )}
                {messages.map(msg => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.fromGuest ? 'justify-start' : 'justify-end'}`}
                    >
                        <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.fromGuest
                                ? 'bg-white/5 text-slate-200 border border-white/8 rounded-tl-sm'
                                : 'bg-brand-teal/10 border border-brand-teal/20 text-slate-200 rounded-tr-sm'
                        }`}>
                            {msg.text}
                            <div className="flex items-center justify-end gap-1 mt-1 text-[10px]">
                                <span className="text-slate-500 font-bold">
                                    {msg.timestamp instanceof Date
                                        ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : ''}
                                </span>
                                {!msg.fromGuest && (
                                    <span className="shrink-0 flex items-center">
                                        {msg.is_read ? (
                                            <CheckCheck className="w-3.5 h-3.5 text-brand-teal stroke-[2.5]" />
                                        ) : (
                                            <Check className="w-3.5 h-3.5 text-slate-500 stroke-[2.5]" />
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Visitor Typing Indicator */}
                {isGuestTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/8 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                            {[0, 0.2, 0.4].map((delay, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                                    transition={{ repeat: Infinity, duration: 1, delay }}
                                    className="w-1.5 h-1.5 bg-brand-teal rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Reply input */}
            <form onSubmit={handleSendReply} className="flex-shrink-0 flex gap-2 p-4 border-t border-white/8 bg-white/[0.01]">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Reply to guest…"
                    className="flex-1 bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-brand-teal/40 transition-all"
                />
                <button
                    type="submit"
                    disabled={isSending || !input.trim()}
                    className="w-10 h-10 bg-brand-teal text-white rounded-xl flex items-center justify-center disabled:opacity-30 transition-opacity hover:bg-brand-teal/80"
                >
                    <Send size={16} />
                </button>
            </form>
        </motion.div>
    );
}

// ─── Main Admin Communications Page ─────────────────────────────────────────

export default function AdminCommunications() {
    const { currentUser: user } = useAuthAndUser();
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('admin_active_tab') || 'clients';
        }
        return 'clients';
    });

    // ── Client chat state ────────────────────────────────────────────────────
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const ws = useRef(null);
    const wsReconnectTimer = useRef(null);
    const wsReconnectAttempts = useRef(0);
    const [isClientOnline, setIsClientOnline] = useState(false);
    const [isClientTyping, setIsClientTyping] = useState(false);

    // Track the persisted client ID for restore-on-refresh
    const [pendingClientId, setPendingClientId] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('admin_selected_client_id') || null;
        }
        return null;
    });

    // Track the persisted guest ID for restore-on-refresh
    const [pendingGuestId, setPendingGuestId] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('admin_selected_guest_id') || null;
        }
        return null;
    });

    const [totalClientUnread, setTotalClientUnread] = useState(0);
    const selectedClientRef = useRef(selectedClient);

    useEffect(() => {
        selectedClientRef.current = selectedClient;
        if (selectedClient) {
            setClients(prev => prev.map(c => 
                c.id === selectedClient.id ? { ...c, unread_count: 0 } : c
            ));
        }
    }, [selectedClient]);

    // Count total unread across all clients
    useEffect(() => {
        const total = clients.reduce((sum, c) => sum + (c.unread_count || 0), 0);
        setTotalClientUnread(total);
    }, [clients]);


    // ── Guest session state ──────────────────────────────────────────────────
    const [guestSessions, setGuestSessions] = useState([]);
    const [guestLoading, setGuestLoading] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [totalGuestUnread, setTotalGuestUnread] = useState(0);

    const [guestMessages, setGuestMessages] = useState([]);
    const [isGuestOnline, setIsGuestOnline] = useState(false);
    const [isGuestTyping, setIsGuestTyping] = useState(false);
    const guestWatchWs = useRef(null);
    const selectedGuestRef = useRef(selectedGuest);

    useEffect(() => {
        selectedGuestRef.current = selectedGuest;
    }, [selectedGuest]);

    // 1. Load clients
    useEffect(() => {
        async function fetchClients() {
            try {
                const data = await api.getAdminClients();
                const clientList = Array.isArray(data) ? data : data.results || [];
                setClients(clientList);

                // Restore selectedClient from sessionStorage after clients load
                if (pendingClientId && !selectedClient) {
                    const restored = clientList.find(c => String(c.id) === String(pendingClientId));
                    if (restored) {
                        setSelectedClient(restored);
                    }
                    setPendingClientId(null);
                }
            } catch (err) {
                console.error('Failed to fetch clients:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchClients();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Persist selectedClient ID to sessionStorage
    useEffect(() => {
        if (selectedClient) {
            sessionStorage.setItem('admin_selected_client_id', String(selectedClient.id));
        } else {
            sessionStorage.removeItem('admin_selected_client_id');
        }
    }, [selectedClient]);

    // Persist selectedGuest ID to sessionStorage
    useEffect(() => {
        if (selectedGuest) {
            sessionStorage.setItem('admin_selected_guest_id', String(selectedGuest.id));
        } else {
            sessionStorage.removeItem('admin_selected_guest_id');
        }
    }, [selectedGuest]);

    // Persist activeTab to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('admin_active_tab', activeTab);
    }, [activeTab]);

    // 2. Load guest sessions
    useEffect(() => {
        async function fetchGuests() {
            setGuestLoading(true);
            try {
                const data = await api.getGuestSessions();
                const sessionList = Array.isArray(data) ? data : data.results || [];
                setGuestSessions(sessionList);

                // Restore selectedGuest from sessionStorage after guests load
                if (pendingGuestId && !selectedGuest) {
                    const restored = sessionList.find(s => String(s.id) === String(pendingGuestId));
                    if (restored) {
                        setSelectedGuest(restored);
                    }
                    setPendingGuestId(null);
                }
            } catch (err) {
                console.error('Failed to fetch guest sessions:', err);
            } finally {
                setGuestLoading(false);
            }
        }
        fetchGuests();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Count total unread across all guest sessions
    useEffect(() => {
        const total = guestSessions.reduce((sum, s) => sum + (s.unread_count || 0), 0);
        setTotalGuestUnread(total);
    }, [guestSessions]);

    // 2b. Guest session detail loader
    useEffect(() => {
        if (!selectedGuest) {
            setGuestMessages([]);
            setIsGuestOnline(false);
            setIsGuestTyping(false);
            return;
        }

        setIsGuestOnline(selectedGuest.is_online);
        setIsGuestTyping(false);

        async function loadGuestDetail() {
            try {
                const data = await api.getGuestSessionDetail(selectedGuest.id);
                setGuestSessions(prev => prev.map(s => 
                    s.id === selectedGuest.id ? { ...s, unread_count: 0 } : s
                ));
                
                const history = (data.messages || []).map(m => ({
                    id: m.id,
                    text: m.text,
                    fromGuest: m.from_guest,
                    timestamp: new Date(m.timestamp),
                    is_read: m.is_read
                }));
                setGuestMessages(history);

                // Send read receipt via guestWatchWs
                if (guestWatchWs.current && guestWatchWs.current.readyState === WebSocket.OPEN) {
                    guestWatchWs.current.send(JSON.stringify({
                        type: 'read_receipt',
                        session_id: selectedGuest.id
                    }));
                }
            } catch (err) {
                console.error('Failed to load guest detail:', err);
            }
        }
        loadGuestDetail();
    }, [selectedGuest]);

    // 2c. Guest watch WebSocket lifecycle
    useEffect(() => {
        if (!user || !user.is_staff) return;

        if (guestWatchWs.current) {
            guestWatchWs.current.close();
            guestWatchWs.current = null;
        }

        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const socketUrl = `${getGuestWatchWebSocketUrl()}?token=${accessToken}`;
        
        console.log('[GuestWatchWS] Connecting:', socketUrl);
        const wsSocket = new WebSocket(socketUrl);
        guestWatchWs.current = wsSocket;

        wsSocket.onopen = () => {
            console.log('[GuestWatchWS] Connected');
        };

        wsSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('[GuestWatchWS] Message received:', data);

            // ─── Guest / Visitor Events ──────────────────────────────────────
            if (data.type === 'presence') {
                const { session_id, status } = data;
                const isOnline = status === 'online';
                setGuestSessions(prev => prev.map(s => 
                    s.id === session_id ? { ...s, is_online: isOnline, ...(isOnline ? {} : { is_typing: false }) } : s
                ));
                if (selectedGuestRef.current && selectedGuestRef.current.id === session_id) {
                    setIsGuestOnline(isOnline);
                    // Clear typing when guest goes offline
                    if (!isOnline) setIsGuestTyping(false);
                }
            } else if (data.type === 'typing') {
                const { session_id, is_typing } = data;
                setGuestSessions(prev => prev.map(s => 
                    s.id === session_id ? { ...s, is_typing: is_typing } : s
                ));
                if (selectedGuestRef.current && selectedGuestRef.current.id === session_id) {
                    setIsGuestTyping(is_typing);
                }
            } else if (data.type === 'new_message') {
                const { session_id, session_name, message } = data;
                const activeId = selectedGuestRef.current?.id;

                const formattedMsg = {
                    id: message.id,
                    text: message.text,
                    fromGuest: message.from_guest,
                    timestamp: new Date(message.timestamp),
                    is_read: message.is_read
                };

                if (activeId === session_id) {
                    setGuestMessages(prev => {
                        if (prev.some(m => m.id === message.id)) return prev;
                        return [...prev, formattedMsg];
                    });
                    if (message.from_guest) {
                        api.markGuestSessionRead(session_id).catch(() => {});
                        // Send read receipt via guestWatchWs
                        if (guestWatchWs.current && guestWatchWs.current.readyState === WebSocket.OPEN) {
                            guestWatchWs.current.send(JSON.stringify({
                                type: 'read_receipt',
                                session_id: session_id
                            }));
                        }
                    }
                }

                setGuestSessions(prev => {
                    const exists = prev.some(s => s.id === session_id);
                    if (exists) {
                        return prev.map(s => {
                            if (s.id === session_id) {
                                return {
                                    ...s,
                                    last_message: message,
                                    unread_count: (activeId === session_id) 
                                        ? 0 
                                        : (message.from_guest ? (s.unread_count || 0) + 1 : s.unread_count)
                                };
                            }
                            return s;
                        }).sort((a, b) => {
                            if (a.id === session_id) return -1;
                            if (b.id === session_id) return 1;
                            return 0;
                        });
                    } else {
                        const newSession = {
                            id: session_id,
                            name: session_name,
                            last_message: message,
                            unread_count: (activeId === session_id) ? 0 : 1,
                            is_online: true,
                            messages: [message]
                        };
                        return [newSession, ...prev];
                    }
                });
            } else if (data.type === 'read_receipt') {
                const { session_id, from_guest } = data;
                const activeId = selectedGuestRef.current?.id;
                if (activeId === session_id) {
                    setGuestMessages(prev => prev.map(m => {
                        if (from_guest && !m.fromGuest) {
                            return { ...m, is_read: true };
                        } else if (!from_guest && m.fromGuest) {
                            return { ...m, is_read: true };
                        }
                        return m;
                    }));
                }

                setGuestSessions(prev => prev.map(s => {
                    if (s.id === session_id) {
                        return {
                            ...s,
                            unread_count: from_guest ? s.unread_count : 0,
                            last_message: s.last_message ? {
                                ...s.last_message,
                                is_read: true
                            } : null
                        };
                    }
                    return s;
                }));
            }
            
            // ─── Client Events ──────────────────────────────────────────────
            else if (data.type === 'client_presence') {
                const { client_id, status } = data;
                const isOnline = status === 'online';
                setClients(prev => prev.map(c => 
                    c.user_id === client_id ? { ...c, is_online: isOnline, ...(isOnline ? {} : { is_typing: false }) } : c
                ));
                if (selectedClientRef.current && selectedClientRef.current.user_id === client_id) {
                    setIsClientOnline(isOnline);
                    // Clear typing when client goes offline
                    if (!isOnline) setIsClientTyping(false);
                }
            } else if (data.type === 'client_typing') {
                const { client_id, is_typing } = data;
                setClients(prev => prev.map(c => 
                    c.user_id === client_id ? { ...c, is_typing: is_typing } : c
                ));
                if (selectedClientRef.current && selectedClientRef.current.user_id === client_id) {
                    setIsClientTyping(is_typing);
                }
            } else if (data.type === 'client_message') {
                const { client_id, message } = data;
                const activeId = selectedClientRef.current?.user_id;

                const formattedMsg = {
                    id: message.id,
                    text: message.text,
                    from_client: message.from_client,
                    timestamp: new Date(message.timestamp),
                    is_read: message.is_read
                };

                if (activeId === client_id) {
                    setMessages(prev => {
                        if (prev.some(m => m.id === message.id)) return prev;
                        return [...prev, formattedMsg];
                    });
                    if (message.from_client) {
                        // Send read receipt via client-specific socket
                        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                            ws.current.send(JSON.stringify({ type: 'read_receipt' }));
                        }
                    }
                }

                setClients(prev => {
                    return prev.map(c => {
                        if (c.user_id === client_id) {
                            return {
                                ...c,
                                last_message: {
                                    text: message.text,
                                    timestamp: message.timestamp,
                                    from_client: message.from_client,
                                    is_read: message.is_read
                                },
                                unread_count: (activeId === client_id) 
                                    ? 0 
                                    : (message.from_client ? (c.unread_count || 0) + 1 : c.unread_count)
                            };
                        }
                        return c;
                    }).sort((a, b) => {
                        if (a.user_id === client_id) return -1;
                        if (b.user_id === client_id) return 1;
                        return 0;
                    });
                });
            } else if (data.type === 'client_read_receipt') {
                const { client_id, is_staff } = data;
                setClients(prev => prev.map(c => {
                    if (c.user_id === client_id) {
                        return {
                            ...c,
                            unread_count: is_staff ? 0 : c.unread_count,
                            last_message: c.last_message ? {
                                ...c.last_message,
                                is_read: true
                            } : null
                        };
                    }
                    return c;
                }));
            }
        };

        wsSocket.onerror = (e) => console.error('[GuestWatchWS] Error:', e);
        wsSocket.onclose = () => console.log('[GuestWatchWS] Connection closed');

        return () => {
            if (guestWatchWs.current) {
                guestWatchWs.current.close();
                guestWatchWs.current = null;
            }
        };
    }, [user]);

    const handleSendGuestReply = async (text) => {
        if (!selectedGuest) return;
        try {
            const msg = await api.sendGuestReply(selectedGuest.id, text);
            setGuestMessages(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, {
                    id: msg.id,
                    text: msg.text,
                    fromGuest: false,
                    timestamp: new Date(msg.timestamp),
                    is_read: msg.is_read
                }];
            });
            setGuestSessions(prev => prev.map(s => {
                if (s.id === selectedGuest.id) {
                    return { ...s, last_message: msg };
                }
                return s;
            }));
        } catch (err) {
            console.error('Failed to send guest reply:', err);
            throw err;
        }
    };

    const handleGuestTypingStatusChange = (isTyping) => {
        if (guestWatchWs.current && guestWatchWs.current.readyState === WebSocket.OPEN) {
            guestWatchWs.current.send(JSON.stringify({
                type: 'typing',
                session_id: selectedGuest?.id,
                is_typing: isTyping
            }));
        }
    };

    // 3. Client WebSocket management
    const [wsRetryTrigger, setWsRetryTrigger] = useState(0);

    useEffect(() => {
        setIsClientOnline(false);
        setIsClientTyping(false);

        if (!selectedClient || !user) {
            if (ws.current) { ws.current.close(); ws.current = null; }
            setMessages([]);
            return;
        }

        if (ws.current) ws.current.close();

        const threadId = selectedClient.chat_thread_id;
        if (!threadId) { setMessages([]); return; }

        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const socketUrl = `${getWebSocketUrl(threadId)}?token=${accessToken}`;
        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
            console.log('[Admin WS] Connected');
            wsReconnectAttempts.current = 0;
            ws.current.send(JSON.stringify({ type: 'presence', status: 'online' }));
            ws.current.send(JSON.stringify({ type: 'read_receipt' }));
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.message) {
                setMessages(prev => {
                    // Deduplicate: skip if message ID already exists
                    if (prev.some(m => m.id === data.message.id)) return prev;
                    return [...prev, { ...data.message, timestamp: new Date(data.message.timestamp) }];
                });
                if (data.message.from_client) {
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
            } else if (data.type === 'typing' && !data.is_staff) {
                setIsClientTyping(data.is_typing);
            } else if (data.type === 'presence' && !data.is_staff) {
                setIsClientOnline(data.status === 'online');
                if (data.status === 'online') {
                    ws.current?.send(JSON.stringify({ type: 'presence', status: 'online' }));
                }
            }
        };

        ws.current.onerror = () => {
            console.warn('[Admin WS] Connection error — will retry');
        };

        ws.current.onclose = () => {
            console.log('[Admin WS] Closed');
            // Auto-reconnect with exponential backoff (up to 5 attempts)
            if (wsReconnectAttempts.current < 5) {
                const delay = Math.min(2000 * (wsReconnectAttempts.current + 1), 10000);
                console.log(`[Admin WS] Reconnecting in ${delay}ms (attempt ${wsReconnectAttempts.current + 1})`);
                wsReconnectTimer.current = setTimeout(() => {
                    wsReconnectAttempts.current += 1;
                    // Trigger re-run of the entire effect to get fresh closures
                    setWsRetryTrigger(prev => prev + 1);
                }, delay);
            }
        };

        return () => {
            clearTimeout(wsReconnectTimer.current);
            if (ws.current) {
                // Prevent the onclose handler from triggering a reconnect during cleanup
                ws.current.onclose = null;
                if (ws.current.readyState === WebSocket.OPEN) {
                    try { ws.current.send(JSON.stringify({ type: 'presence', status: 'offline' })); } catch (_) {}
                }
                ws.current.close();
                ws.current = null;
            }
        };
    }, [selectedClient, user, wsRetryTrigger]);

    // 4. Load client message history
    useEffect(() => {
        if (!selectedClient) { setMessages([]); return; }
        async function loadChatLog() {
            setMessagesLoading(true);
            try {
                const chatLog = await api.getChatMessages(selectedClient.chat_thread_id, true);
                setMessages(chatLog.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
            } catch (err) {
                console.error('Error loading chat log:', err);
                setMessages([]);
            } finally {
                setMessagesLoading(false);
            }
        }
        loadChatLog();
    }, [selectedClient]);

    const handleSendMessage = (text) => {
        if (!selectedClient || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        ws.current.send(JSON.stringify({ message: text }));
    };

    const handleTypingStatusChange = (isTyping) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'typing', is_typing: isTyping }));
        }
    };

    const filteredClients = clients.filter(c =>
        `${c.first_name || ''} ${c.last_name || ''} ${c.username || ''}`
            .toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="absolute top-20 bottom-0 left-0 lg:left-64 right-0 flex flex-col bg-[#060814] text-white overflow-hidden">

            {/* Tab Bar */}
            <div className="flex-shrink-0 flex items-center gap-1 px-4 pt-3 pb-0 border-b border-white/8">
                <button
                    onClick={() => { setActiveTab('clients'); setSelectedGuest(null); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all relative ${
                        activeTab === 'clients'
                            ? 'bg-white/5 text-white border-t border-x border-white/10'
                            : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                    <Users size={15} />
                    Clients
                    {totalClientUnread > 0 && (
                        <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {totalClientUnread > 9 ? '9+' : totalClientUnread}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => { setActiveTab('guests'); setSelectedClient(null); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all relative ${
                        activeTab === 'guests'
                            ? 'bg-white/5 text-white border-t border-x border-white/10'
                            : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                    <Globe size={15} />
                    Visitors
                    {totalGuestUnread > 0 && (
                        <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {totalGuestUnread > 9 ? '9+' : totalGuestUnread}
                        </span>
                    )}
                </button>
            </div>

            <div className="flex flex-grow min-h-0 overflow-hidden w-full h-full">

                {/* ── Client Tab ── */}
                {activeTab === 'clients' && (
                    <>
                        <ClientListPanel
                            clients={filteredClients}
                            loading={loading}
                            selectedClient={selectedClient}
                            setSelectedClient={setSelectedClient}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                        <AnimatePresence mode="wait">
                            {selectedClient ? (
                                <ChatWindow
                                    key={selectedClient.id}
                                    selectedClient={selectedClient}
                                    setSelectedClient={setSelectedClient}
                                    messages={messages}
                                    messagesLoading={messagesLoading}
                                    onSendMessage={handleSendMessage}
                                    isClientOnline={isClientOnline}
                                    isClientTyping={isClientTyping}
                                    onTypingStatusChange={handleTypingStatusChange}
                                />
                            ) : (
                                <EmptyChatState />
                            )}
                        </AnimatePresence>
                    </>
                )}

                {/* ── Guest Tab ── */}
                {activeTab === 'guests' && (
                    <>
                        {/* Guest list */}
                        <div className={`${selectedGuest ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 border-r border-white/10 bg-white/[0.01] flex-col h-full min-h-0 shrink-0`}>
                            <div className="px-4 py-3 border-b border-white/8">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Landing Page Visitors</p>
                            </div>
                            <div className="overflow-y-auto flex-1 min-h-0">
                                {guestLoading ? (
                                    <div className="p-8 text-center text-slate-500 text-sm">Loading…</div>
                                ) : guestSessions.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Globe size={32} className="text-slate-700 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">No visitor chats yet</p>
                                        <p className="text-slate-600 text-xs mt-1">Messages from the landing page will appear here</p>
                                    </div>
                                ) : (
                                    guestSessions.map(session => (
                                        <GuestRow
                                            key={session.id}
                                            session={session}
                                            isActive={selectedGuest?.id === session.id}
                                            onClick={() => {
                                                setSelectedGuest(session);
                                                // Update local unread count
                                                setGuestSessions(prev => prev.map(s =>
                                                    s.id === session.id ? { ...s, unread_count: 0 } : s
                                                ));
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Guest chat window */}
                        <AnimatePresence mode="wait">
                            {selectedGuest ? (
                                <GuestChatWindow
                                    key={selectedGuest.id}
                                    session={selectedGuest}
                                    messages={guestMessages}
                                    isGuestOnline={isGuestOnline}
                                    isGuestTyping={isGuestTyping}
                                    onSendMessage={handleSendGuestReply}
                                    onTypingStatusChange={handleGuestTypingStatusChange}
                                    onBack={() => setSelectedGuest(null)}
                                />
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-grow flex flex-col items-center justify-center bg-[#060814] text-slate-600"
                                >
                                    <Globe size={48} className="mb-4 text-slate-700" />
                                    <p className="text-slate-500 font-medium">Select a visitor session</p>
                                    <p className="text-slate-600 text-sm mt-1">to view their messages and reply</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
}
