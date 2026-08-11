'use client';
import { Lock } from 'lucide-react';

export default function ChatHeader({
    title = 'Dr. Support',
    subtitle = 'Official Platform Admin',
    initials = 'DP',
    isOnline = false,
    isSellerMode = false,
}) {
    const isPurple = isSellerMode || title.toLowerCase().includes('client');
    const badgeColor = isOnline
        ? isPurple ? 'text-purple-400' : 'text-brand-teal'
        : 'text-slate-500';
    const avatarBg = isPurple
        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
        : 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30';

    return (
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${avatarBg}`}>
                        {initials}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#060814] ${isOnline ? 'bg-green-500' : 'bg-slate-500'}`} />
                </div>
                <div>
                    <div className="text-xs font-black text-white uppercase tracking-widest">
                        {title}
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                        <span className={badgeColor}>
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500">{subtitle}</span>
                    </div>
                </div>
            </div>
            <button type="button" className="p-2.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition-colors">
                <Lock size={14} />
            </button>
        </div>
    );
}