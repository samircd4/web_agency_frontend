'use client';

import { Check, CheckCheck, Trash2 } from 'lucide-react';

export default function ClientRow({ client, isActive, onClick, onDelete }) {
    const nameStr = client.display_name || client.name || (client.first_name && client.last_name
        ? `${client.first_name} ${client.last_name}`
        : client.username || 'User');

    const initials = (nameStr || 'US').slice(0, 2).toUpperCase();

    const lastMsg = client.last_message;
    const formattedTime = lastMsg && lastMsg.timestamp
        ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <div className={`group relative flex items-center hover:bg-white/5 transition-all border-b border-white/5 last:border-0 ${
            isActive ? 'bg-brand-teal/10 border-l-2 border-l-brand-teal' : ''
        }`}>
            <button
                onClick={onClick}
                className="flex-grow p-4 flex items-center gap-3 text-left min-w-0"
            >
                <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center font-black text-white text-xs border border-white/10">
                        {initials}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#060814] ${client.is_online ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                </div>
                
                <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white truncate">
                            {nameStr}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                            {formattedTime && (
                                <span className="text-[8px] font-bold text-slate-600">
                                    {formattedTime}
                                </span>
                            )}
                            {client.unread_count > 0 && (
                                <span className="w-5 h-5 bg-brand-teal rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                    {client.unread_count > 9 ? '9+' : client.unread_count}
                                </span>
                            )}
                        </div>
                    </div>
                    {client.is_typing ? (
                        <p className="text-[10px] text-brand-teal font-medium animate-pulse mt-0.5">
                            is typing...
                        </p>
                    ) : (
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500 min-w-0">
                            {lastMsg && !lastMsg.from_client && (
                                <span className="shrink-0">
                                    {lastMsg.is_read ? (
                                        <CheckCheck className="w-3 h-3 text-brand-teal" />
                                    ) : (
                                        <Check className="w-3 h-3 text-slate-600" />
                                    )}
                                </span>
                            )}
                            <span className="truncate flex-grow">
                                {lastMsg ? lastMsg.text : 'No messages yet'}
                            </span>
                        </div>
                    )}
                </div>
            </button>

            {/* Delete button — visible on hover */}
            {onDelete && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(client); }}
                    title="Delete conversation"
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 mr-3 p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    );
}