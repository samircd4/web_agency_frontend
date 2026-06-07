'use client';

import { MessageSquare } from 'lucide-react';

export default function EmptyChatState() {
    return (
        <div className="flex-grow hidden lg:flex flex-col items-center justify-center h-full bg-[#060814]">
            <div className="text-center p-8">
                <MessageSquare size={48} className="text-slate-700 mx-auto mb-4" />
                <h3 className="text-sm font-black text-white mb-2">Select a client to start a conversation</h3>
                <p className="text-xs text-slate-500">Choose a client from the list to view and send messages</p>
            </div>
        </div>
    );
}