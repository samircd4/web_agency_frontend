'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Headphones, Wifi, WifiOff, Check, CheckCheck } from 'lucide-react';
import { isAuthenticated, getWebSocketUrl, getGuestWebSocketUrl } from '@/lib/api';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns the UUID that identifies this anonymous browser session.
 * Creates and persists one in localStorage on first visit.
 */
function getOrCreateGuestSessionId() {
    if (typeof window === 'undefined') return null;
    let id = localStorage.getItem('guest_chat_session_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('guest_chat_session_id', id);
    }
    return id;
}

/** Returns the current page pathname for the "identify" packet. */
function getCurrentPage() {
    if (typeof window === 'undefined') return '';
    return window.location.pathname;
}

// ─── Typing dots sub-component ───────────────────────────────────────────────

function TypingDots() {
    return (
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
    );
}

// ─── Main Chatbot component ───────────────────────────────────────────────────

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);

    // Auth detection (client-side only)
    const [authChecked, setAuthChecked] = useState(false);
    const [userIsAuth, setUserIsAuth] = useState(false);
    const [threadId, setThreadId] = useState(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const [isAdminTyping, setIsAdminTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasOpened, setHasOpened] = useState(false);

    const ws = useRef(null);
    const scrollRef = useRef(null);
    const chatRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);
    const reconnectTimerRef = useRef(null);
    const guestSessionId = useRef(null);
    const isOpenRef = useRef(false);

    // ── Auth check (once, client-side) ──────────────────────────────────────
    useEffect(() => {
        const authed = isAuthenticated();
        setUserIsAuth(authed);

        if (authed) {
            // Pull thread ID from the stored JWT payload or localStorage
            const stored = localStorage.getItem('chat_thread_id');
            if (stored) {
                setThreadId(stored);
            } else {
                // Fetch the user profile to get chat_thread_id
                import('@/lib/api').then(({ api }) => {
                    api.getMe().then(me => {
                        if (me?.chat_thread_id) {
                            setThreadId(me.chat_thread_id);
                            localStorage.setItem('chat_thread_id', String(me.chat_thread_id));
                        }
                    }).catch(() => {});
                });
            }
        } else {
            guestSessionId.current = getOrCreateGuestSessionId();
        }
        setAuthChecked(true);
    }, []);

    // ── Load Authenticated Client Chat History ────────────────────────────────
    useEffect(() => {
        if (userIsAuth && threadId) {
            import('@/lib/api').then(({ api }) => {
                api.getChatMessages(threadId, false)
                    .then(chatLog => {
                        const history = (chatLog || []).map(m => ({
                            id: m.id,
                            text: m.text,
                            fromMe: m.from_client,
                            timestamp: new Date(m.timestamp),
                            is_read: m.is_read
                        }));
                        setMessages(history);
                    })
                    .catch(err => console.error('[Chatbot] Failed to load history:', err));
            });
        }
    }, [userIsAuth, threadId]);

    // ── Auto-scroll ──────────────────────────────────────────────────────────
    useEffect(() => {
        const scrollToBottom = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
            }
        };
        scrollToBottom();
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isAdminTyping]);

    // ── WebSocket lifecycle ──────────────────────────────────────────────────
    const connectWebSocket = useCallback(() => {
        if (!authChecked) return;
        if (ws.current && ws.current.readyState <= WebSocket.OPEN) return;

        let url;
        if (userIsAuth && threadId) {
            const token = localStorage.getItem('access_token') || '';
            url = `${getWebSocketUrl(threadId)}?token=${token}`;
        } else if (!userIsAuth && guestSessionId.current) {
            url = getGuestWebSocketUrl(guestSessionId.current);
        } else {
            return; // Nothing to connect to yet
        }

        console.log('[Chatbot] Connecting WebSocket:', url);
        const socket = new WebSocket(url);
        ws.current = socket;

        socket.onopen = () => {
            console.log('[Chatbot] WebSocket connected');
            setIsConnected(true);

            // Announce our presence
            socket.send(JSON.stringify({ type: 'presence', status: 'online' }));

            // If we are currently open, send read receipt immediately
            if (isOpenRef.current) {
                socket.send(JSON.stringify({ type: 'read_receipt' }));
            }

            // For guests: send identify packet so admin sees context
            if (!userIsAuth) {
                socket.send(JSON.stringify({
                    type: 'identify',
                    page: getCurrentPage(),
                }));
            }
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('[Chatbot] Message:', data);

            if (data.type === 'history') {
                // Full message history received on connect
                const history = (data.messages || []).map(m => ({
                    id: m.id,
                    text: m.text,
                    fromMe: userIsAuth ? m.from_client : m.from_guest,
                    timestamp: new Date(m.timestamp),
                    is_read: m.is_read,
                }));
                setMessages(history);
                return;
            }

            if (data.type === 'message' || data.message) {
                const raw = data.message || data;
                const isFromMe = userIsAuth
                    ? raw.from_client === true
                    : raw.from_guest === true;

                const msg = {
                    id: raw.id || Date.now(),
                    text: raw.text,
                    fromMe: isFromMe,
                    timestamp: raw.timestamp ? new Date(raw.timestamp) : new Date(),
                    is_read: raw.is_read,
                };

                setMessages(prev => {
                    // Deduplicate by id
                    if (prev.some(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });

                // Send read receipt back if we are currently open and message is from admin
                if (!isFromMe) {
                    if (isOpenRef.current) {
                        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                            ws.current.send(JSON.stringify({ type: 'read_receipt' }));
                        }
                    } else {
                        // For guests: auto-open the chat window so they see the reply
                        if (!userIsAuth) {
                            setIsOpen(true);
                        } else {
                            // For authenticated clients: just increment the badge
                            setUnreadCount(c => c + 1);
                        }
                    }
                }
                return;
            }

            if (data.type === 'read_receipt') {
                // Admin read our messages
                setMessages(prev => prev.map(m =>
                    m.fromMe ? { ...m, is_read: true } : m
                ));
                return;
            }

            if (data.type === 'typing') {
                const isStaff = data.is_staff;
                const isOtherParty = userIsAuth ? isStaff : !data.from_guest;
                if (isOtherParty || isStaff) {
                    setIsAdminTyping(data.is_typing);
                }
                return;
            }

            if (data.type === 'presence') {
                const isStaff = data.is_staff || !data.from_guest;
                if (isStaff) {
                    setIsAdminOnline(data.status === 'online');
                    // Clear typing indicator when admin goes offline
                    if (data.status === 'offline') {
                        setIsAdminTyping(false);
                    }
                    if (data.status === 'online' && socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({ type: 'presence', status: 'online' }));
                    }
                }
                return;
            }
        };

        socket.onerror = (e) => {
            console.warn('[Chatbot] WebSocket error:', e);
        };

        socket.onclose = () => {
            console.log('[Chatbot] WebSocket closed');
            setIsConnected(false);
            setIsAdminOnline(false);
            // Reconnect after 5 seconds
            reconnectTimerRef.current = setTimeout(() => {
                ws.current = null;
                connectWebSocket();
            }, 5000);
        };
    }, [authChecked, userIsAuth, threadId]);

    // Connect as soon as we know who the user is
    useEffect(() => {
        if (authChecked) {
            connectWebSocket();
        }
        return () => {
            clearTimeout(reconnectTimerRef.current);
            if (ws.current) {
                if (ws.current.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ type: 'presence', status: 'offline' }));
                }
                ws.current.close();
                ws.current = null;
            }
        };
    }, [authChecked, connectWebSocket]);

    // Keep isOpenRef in sync with isOpen state
    useEffect(() => {
        isOpenRef.current = isOpen;
        if (isOpen) {
            setUnreadCount(0);
            setHasOpened(true);
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: 'read_receipt' }));
            }
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
                }
            }, 100);
        }
    }, [isOpen]);

    // ── Typing status ────────────────────────────────────────────────────────
    const sendTypingStatus = useCallback((typing) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        if (isTypingRef.current === typing) return;
        isTypingRef.current = typing;
        ws.current.send(JSON.stringify({ type: 'typing', is_typing: typing }));
    }, []);

    const handleInputChange = (e) => {
        setInput(e.target.value);
        sendTypingStatus(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => sendTypingStatus(false), 1500);
    };

    // ── Send message ─────────────────────────────────────────────────────────
    const handleSend = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || isSending) return;

        // Stop typing indicator
        sendTypingStatus(false);
        clearTimeout(typingTimeoutRef.current);

        setIsSending(true);
        try {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ message: text }));
                setInput('');
            } else {
                // Socket not open — try reconnecting and queue the message
                console.warn('[Chatbot] WebSocket not open, attempting reconnect...');
                ws.current = null;
                connectWebSocket();
                // Wait briefly for connection, then retry once
                await new Promise(resolve => setTimeout(resolve, 1500));
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ message: text }));
                    setInput('');
                } else {
                    console.error('[Chatbot] Failed to send: WebSocket still not connected');
                }
            }
        } catch (err) {
            console.error('[Chatbot] Send error:', err);
        } finally {
            setIsSending(false);
        }
    };

    // ── Close on outside click ───────────────────────────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if (isOpen &&
                chatRef.current &&
                !chatRef.current.contains(e.target) &&
                !e.target.closest('.chatbot-toggle')
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            const t = setTimeout(() => document.addEventListener('click', handler), 0);
            return () => { clearTimeout(t); document.removeEventListener('click', handler); };
        }
    }, [isOpen]);

    // ── Status label ─────────────────────────────────────────────────────────
    const statusLabel = isAdminTyping
        ? 'Team is typing…'
        : isAdminOnline
            ? 'Support online'
            : isConnected
                ? 'Connected — reply soon'
                : 'Connecting…';

    const statusColor = isAdminOnline || isAdminTyping ? 'text-emerald-400' : 'text-slate-500';
    const dotColor = isAdminOnline || isAdminTyping ? 'bg-emerald-400' : isConnected ? 'bg-amber-400' : 'bg-slate-600';

    return (
        <>
            {/* ── Chat Window ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={chatRef}
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="fixed bottom-0 right-0 sm:right-8 z-[110] w-full sm:w-[400px] h-[600px] sm:h-[640px] flex flex-col rounded-t-[2rem] sm:rounded-[2rem] sm:mb-8 overflow-hidden"
                        style={{
                            background: 'linear-gradient(145deg, #0a0f1e 0%, #060d1a 100%)',
                            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
                        }}
                    >
                        {/* Header */}
                        <div
                            className="flex-shrink-0 px-5 py-4 flex items-center justify-between border-b border-white/5"
                            style={{ background: 'rgba(255,255,255,0.02)' }}
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar with pulse ring */}
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal/30 to-cyan-500/10 border border-brand-teal/20 flex items-center justify-center">
                                        <Headphones size={20} className="text-brand-teal" />
                                    </div>
                                    {(isAdminOnline || isAdminTyping) && (
                                        <motion.div
                                            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full"
                                        />
                                    )}
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-[#060d1a] ${dotColor}`} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm leading-tight">Support Team</h3>
                                    <div className={`flex items-center gap-1 mt-0.5 ${statusColor}`}>
                                        <motion.div
                                            animate={isAdminTyping ? { opacity: [0.5, 1, 0.5] } : {}}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
                                        />
                                        <span className="text-[10px] font-semibold uppercase tracking-wider">{statusLabel}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {isConnected
                                    ? <Wifi size={14} className="text-brand-teal/60" />
                                    : <WifiOff size={14} className="text-slate-600 animate-pulse" />
                                }
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 hover:rotate-90 transition-all duration-300"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Welcome banner (first time opening) */}
                        <AnimatePresence>
                            {messages.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex-shrink-0 mx-4 mt-4 p-4 rounded-2xl border border-brand-teal/15 bg-brand-teal/5"
                                >
                                    <p className="text-xs text-brand-teal font-semibold mb-1">👋 Welcome!</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Ask us anything about your project, pricing, or timeline. We typically reply within minutes.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 scrollbar-thin"
                        >
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.22 }}
                                        className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
                                                msg.fromMe
                                                    ? 'bg-brand-teal text-white rounded-tr-sm shadow-lg shadow-brand-teal/15'
                                                    : 'bg-white/5 text-slate-200 border border-white/6 rounded-tl-sm'
                                            }`}
                                        >
                                            {msg.text}
                                            <div className="flex items-center justify-end gap-1 mt-1 text-[10px]">
                                                <span className={msg.fromMe ? 'text-white/50' : 'text-slate-500'}>
                                                    {msg.timestamp instanceof Date
                                                        ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                        : ''}
                                                </span>
                                                {msg.fromMe && (
                                                    <span className="shrink-0">
                                                        {msg.is_read ? (
                                                            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                                        ) : (
                                                            <Check className="w-3.5 h-3.5 text-white/40" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Admin typing indicator */}
                            <AnimatePresence>
                                {isAdminTyping && <TypingDots />}
                            </AnimatePresence>
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSend}
                            className="flex-shrink-0 flex gap-2 p-4 border-t border-white/5"
                            style={{ background: 'rgba(255,255,255,0.015)' }}
                        >
                            <input
                                id="chatbot-message-input"
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                placeholder={isConnected ? 'Type your message…' : 'Connecting…'}
                                disabled={!isConnected}
                                className="flex-1 bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-brand-teal/40 transition-all disabled:opacity-40"
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.93 }}
                                disabled={!isConnected || isSending || !input.trim()}
                                className="w-10 h-10 flex-shrink-0 bg-brand-teal text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-teal/25 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                            >
                                <Send size={16} />
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Toggle Button ── */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                        className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-[100]"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.88 }}
                            onClick={() => setIsOpen(true)}
                            className="chatbot-toggle relative w-14 h-14 sm:w-16 sm:h-16 bg-brand-teal text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-teal/40 border border-white/10"
                        >
                            {/* Glow */}
                            <div className="absolute inset-0 bg-brand-teal rounded-2xl blur-xl opacity-25" />

                            {/* Online pulse ring */}
                            <motion.div
                                animate={{ scale: [1, 1.8], opacity: [0.35, 0] }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                                className="absolute inset-0 bg-brand-teal rounded-2xl"
                            />

                            <MessageSquare size={24} className="relative z-10" />

                            {/* Unread badge */}
                            <AnimatePresence>
                                {unreadCount > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#060814] z-20"
                                    >
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Status dot */}
                            <div className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-[#060814] z-20 ${dotColor}`} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
