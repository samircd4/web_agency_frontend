'use client';
import { Lock, User, ChevronDown, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ChatHeader({ isAdminOnline = false, activeThread = null, threads = [], onSelectThread = () => {} }) {
    const [isThreadDropdownOpen, setIsThreadDropdownOpen] = useState(false);

    const seller = activeThread?.seller;
    const service = activeThread?.service;
    const project = activeThread?.project;
    const subject = activeThread?.subject;

    const sellerName = seller?.name || 'Dr. Python';
    const sellerLevel = seller?.level || 'Top Rated Seller';
    const avatarUrl = seller?.avatar;

    return (
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0 relative">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center text-brand-teal font-black text-sm overflow-hidden shrink-0">
                        {avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={avatarUrl} alt={sellerName} className="w-full h-full object-cover" />
                        ) : (
                            <User size={18} />
                        )}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#060814] ${isAdminOnline ? 'bg-green-500' : 'bg-slate-500'}`} />
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <div className="text-xs font-black text-white uppercase tracking-widest">{sellerName}</div>
                        <span className="px-2 py-0.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-[9px] font-black text-brand-teal uppercase tracking-wider">{sellerLevel}</span>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
                        <span className={isAdminOnline ? 'text-brand-teal' : 'text-slate-500'}>
                            {isAdminOnline ? 'Online' : 'Offline'}
                        </span>
                        {(service || project || subject) && (
                            <>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-400 font-semibold truncate max-w-[200px] md:max-w-[300px]">
                                    {service ? `Inquiry: ${service.title}` : project ? `Project: ${project.title}` : subject}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 relative">
                {threads.length > 1 && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsThreadDropdownOpen(!isThreadDropdownOpen)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
                        >
                            <span>Switch Conversation ({threads.length})</span>
                            <ChevronDown size={14} className={`text-muted transition-transform ${isThreadDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isThreadDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-white/15 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                                <div className="text-[10px] font-black text-muted uppercase tracking-widest px-2 py-1">Active Conversations</div>
                                {threads.map(t => {
                                    const isSelected = t.id === activeThread?.id;
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => {
                                                onSelectThread(t.id);
                                                setIsThreadDropdownOpen(false);
                                            }}
                                            className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${isSelected ? 'bg-brand-teal/20 text-brand-teal' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <div className="truncate pr-2">
                                                <div className="truncate font-black">{t.seller?.name || 'Dr. Python'}</div>
                                                <div className="text-[9px] text-slate-400 truncate">{t.service?.title || t.project?.title || t.subject}</div>
                                            </div>
                                            {isSelected && <CheckCircle size={12} className="shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                <button type="button" className="p-2.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition-colors" title="Encrypted Channel">
                    <Lock size={14} />
                </button>
            </div>
        </div>
    );
}