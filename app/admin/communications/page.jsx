'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Send,
    User,
    MessageSquare,
    Clock,
    CheckCircle2,
    Paperclip,
    Smile,
    ArrowLeft,
    Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay },
});

const mockMessages = [
    {
        id: 1,
        text: 'Hi there! I wanted to discuss the project timeline.',
        fromClient: true,
        timestamp: new Date(Date.now() - 3600000),
        read: true,
    },
    {
        id: 2,
        text: 'Of course! We can schedule a call for tomorrow to go over everything.',
        fromClient: false,
        timestamp: new Date(Date.now() - 3500000),
        read: true,
    },
    {
        id: 3,
        text: 'That sounds perfect. What time works best for you?',
        fromClient: true,
        timestamp: new Date(Date.now() - 3400000),
        read: false,
    },
];

export default function AdminCommunications() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        async function fetchClients() {
            try {
                const data = await api.getAdminClients();
                setClients(Array.isArray(data) ? data : data.results || []);
            } catch (err) {
                console.error('Failed to fetch clients:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchClients();
    }, []);

    const filteredClients = clients.filter((client) =>
        `${client.first_name || ''} ${client.last_name || ''} ${client.username || ''}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;
        setMessageText('');
    };

    return (
        <div className="space-y-0">
            <div className="flex h-[calc(100vh-180px)]">
                {/* Client List */}
                <div className={`${selectedClient ? 'hidden lg:block' : 'w-full'} lg:w-80 border-r border-white/10 bg-white/[0.01]`}>
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-2">
                            <Search size={14} className="text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search clients..."
                                className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-700 w-full font-bold"
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto h-full pb-20">
                        {loading ? (
                            <div className="p-8 text-center">
                                <Loader2 size={24} className="animate-spin text-brand-teal mx-auto" />
                            </div>
                        ) : filteredClients.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                No clients found.
                            </div>
                        ) : (
                            filteredClients.map((client) => {
                                const initials =
                                    client.first_name && client.last_name
                                        ? `${client.first_name[0]}${client.last_name[0]}`.toUpperCase()
                                        : client.username.slice(0, 2).toUpperCase();

                                return (
                                    <button
                                        key={client.id}
                                        onClick={() => setSelectedClient(client)}
                                        className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all border-b border-white/5 ${selectedClient?.id === client.id ? 'bg-brand-teal/10' : ''
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center font-black text-white text-xs border border-white/10 shrink-0">
                                            {initials}
                                        </div>
                                        <div className="flex-grow min-w-0 text-left">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-white truncate">
                                                    {client.first_name && client.last_name
                                                        ? `${client.first_name} ${client.last_name}`
                                                        : client.username}
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-600">
                                                    {new Date().toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                                {client.email || 'No messages yet'}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Conversation Area */}
                <AnimatePresence>
                    {selectedClient ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex-grow flex flex-col"
                        >
                            {/* Conversation Header */}
                            <div className="p-4 border-b border-white/10 bg-white/[0.01] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSelectedClient(null)}
                                        className="lg:hidden p-2 text-slate-400 hover:text-white"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center font-black text-white text-xs border border-white/10">
                                        {(selectedClient.first_name && selectedClient.last_name
                                            ? `${selectedClient.first_name[0]}${selectedClient.last_name[0]}`
                                            : selectedClient.username.slice(0, 2)
                                        ).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-xs font-black text-white">
                                            {selectedClient.first_name && selectedClient.last_name
                                                ? `${selectedClient.first_name} ${selectedClient.last_name}`
                                                : selectedClient.username}
                                        </div>
                                        <div className="flex items-center gap-1 text-[8px] text-slate-500">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                                            Online
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                {mockMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.fromClient ? '' : 'flex-row-reverse'}`}
                                    >
                                        <div className="w-7 h-7 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-[8px] font-black shrink-0 mt-1">
                                            {msg.fromClient ? 'CL' : 'DP'}
                                        </div>
                                        <div
                                            className={`max-w-[70%] p-4 rounded-xl ${msg.fromClient
                                                ? 'bg-white/5 border border-white/5 rounded-tl-none'
                                                : 'bg-brand-teal/10 border border-brand-teal/20 rounded-tr-none'
                                                }`}
                                        >
                                            <p className="text-xs leading-relaxed text-slate-300">
                                                {msg.text}
                                            </p>
                                            <div className="flex items-center justify-end gap-1 mt-2">
                                                <span className="text-[7px] text-slate-600">
                                                    {msg.timestamp.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                                {!msg.fromClient && (
                                                    <CheckCircle2
                                                        size={10}
                                                        className={msg.read ? 'text-brand-teal' : 'text-slate-600'}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-white/10 bg-white/[0.01]">
                                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                    <button
                                        type="button"
                                        className="p-2.5 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all border border-white/5"
                                    >
                                        <Paperclip size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2.5 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all border border-white/5"
                                    >
                                        <Smile size={16} />
                                    </button>
                                    <div className="flex-grow bg-white/5 border border-white/5 rounded-lg px-4 py-2">
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="Type a message..."
                                            className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-700 w-full font-bold"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!messageText.trim()}
                                        className="p-2.5 rounded-lg bg-brand-teal text-text-primary transition-all hover:bg-brand-teal/90 disabled:opacity-50"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex-grow hidden lg:flex items-center justify-center">
                            <div className="text-center p-8">
                                <MessageSquare size={48} className="text-slate-700 mx-auto mb-4" />
                                <h3 className="text-sm font-black text-white mb-2">
                                    Select a client to start a conversation
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Choose a client from the list to view and send messages
                                </p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
