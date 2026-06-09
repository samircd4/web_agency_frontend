'use client';

import { ArrowLeft } from 'lucide-react';

export default function ChatHeader({ selectedClient, onBack, isClientOnline = false }) {
    return (
        <div className="p-4 border-b border-white/10 bg-white/[0.01] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="lg:hidden p-2 text-slate-400 hover:text-white">
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
                        <span className={`w-1.5 h-1.5 rounded-full ${isClientOnline ? 'bg-brand-teal animate-pulse' : 'bg-slate-500'}`} />
                        {isClientOnline ? 'Online' : 'Offline'}
                    </div>
                </div>
            </div>
        </div>
    );
}