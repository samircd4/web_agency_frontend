'use client';

import { useState, useEffect } from 'react';

export default function ChatBody({ missions = [] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex-1 w-full p-5 space-y-5 overflow-y-auto min-h-0 custom-scrollbar">
            {/* System Welcome Message */}
            <div className="flex gap-4 max-w-[75%]">
                <div className="w-9 h-9 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-xs font-black shrink-0 mt-1">
                    DP
                </div>
                <div className="p-4 rounded-xl rounded-tl-none bg-white/5 border border-white/5 text-sm md:text-base leading-relaxed text-slate-200 font-medium shadow-sm">
                    Secure telemetry setup completed. Please upload project requirements and wireframes to the secure vault directly, or communicate here.
                </div>
            </div>

            {/* Loop Over Dynamic Telemetry Records */}
            {missions.map((m) => (m.activities || []).slice(0, 2).map((log) => (
                <div key={`${m.id}-${log.id}`} className="flex gap-4 max-w-[75%] ml-auto flex-row-reverse">
                    <div className="w-9 h-9 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-black shrink-0 mt-1">
                        CL
                    </div>
                    <div className="p-4 rounded-xl rounded-tr-none bg-brand-blue/10 border border-brand-blue/20 text-sm md:text-base leading-relaxed text-slate-200 font-medium shadow-sm">
                        {log.action_text}
                        <div className="text-[10px] text-slate-500 font-bold mt-2 text-right select-none min-h-[14px]">
                            {mounted ? (
                                new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            ) : (
                                "..."
                            )}
                        </div>
                    </div>
                </div>
            )))}
        </div>
    );
}