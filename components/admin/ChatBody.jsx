import { useEffect, useRef } from 'react';
import { Check, CheckCheck } from 'lucide-react';

export default function ChatBody({ messages, isClientTyping = false }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        const scrollToBottom = () => {
            if (bottomRef.current) {
                bottomRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        };
        scrollToBottom();
        const timeoutId = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isClientTyping]);

    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0 bg-[#060814] custom-scrollbar">
            {messages.map((msg) => {
                const messageDate = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
                
                return (
                    <div key={msg.id} className={`flex gap-4 ${msg.from_client ? '' : 'flex-row-reverse'}`}>
                        {/* Avatar Badge */}
                        <div className="w-9 h-9 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-xs font-black shrink-0 mt-1">
                            {msg.from_client ? 'CL' : 'AD'}
                        </div>
                        
                        {/* Message Bubble Container */}
                        <div className={`max-w-[70%] p-4 rounded-xl shadow-sm ${
                            msg.from_client
                                ? 'bg-white/5 border border-white/5 rounded-tl-none'
                                : 'bg-brand-teal/10 border border-brand-teal/20 rounded-tr-none'
                        }`}>
                            {/* Bumped message text size up to text-sm/text-base for greater legibility */}
                            <p className="text-sm md:text-base leading-relaxed text-slate-200 whitespace-pre-wrap break-words font-medium">
                                {msg.text}
                            </p>
                            
                            {/* Meta Metrics Bar (Timestamp & Delivery Status) */}
                            <div className="flex items-center justify-end gap-1.5 mt-2 select-none">
                                <span className="text-[10px] font-bold text-slate-500">
                                    {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                
                                {/* Status Checkmarks only show for messages sent OUTBOUND from the admin */}
                                {!msg.from_client && (
                                    <div className="flex items-center">
                                        {msg.is_read ? (
                                            // Message read: Double checkmark in brand teal color
                                            <CheckCheck size={15} className="text-brand-teal stroke-[2.5]" />
                                        ) : (
                                            // Message sent but unread: Single checkmark in grey
                                            <Check size={15} className="text-slate-500 stroke-[2.5]" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Typing Indicator */}
            {isClientTyping && (
                <div className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-xs font-black shrink-0 mt-1">
                        CL
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl rounded-tl-none max-w-[70%] shadow-sm">
                        <div className="flex items-center gap-1.5 py-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}