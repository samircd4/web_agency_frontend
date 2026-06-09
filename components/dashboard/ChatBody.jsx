import { useEffect, useRef } from 'react';
import { Check, CheckCheck } from 'lucide-react';

export default function ChatBody({ messages, isAdminTyping = false }) {
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
    }, [messages, isAdminTyping]);

    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0 bg-[#060814] custom-scrollbar">
            {messages.map((msg) => {
                const messageDate = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
                // from_client=true → this is the client's OWN message → align right
                const isMyMessage = msg.from_client === true;

                return (
                    <div key={msg.id} className={`flex gap-4 ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar Badge */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-1 ${
                            isMyMessage
                                ? 'bg-brand-teal/20 text-brand-teal'
                                : 'bg-white/10 text-slate-300'
                        }`}>
                            {isMyMessage ? 'ME' : 'AD'}
                        </div>

                        {/* Message Bubble Container */}
                        <div className={`max-w-[70%] p-4 rounded-xl shadow-sm ${
                            isMyMessage
                                ? 'bg-brand-teal/10 border border-brand-teal/20 rounded-tr-sm'
                                : 'bg-white/5 border border-white/5 rounded-tl-sm'
                        }`}>
                            <p className="text-sm md:text-base leading-relaxed text-slate-200 whitespace-pre-wrap break-words font-medium">
                                {msg.text}
                            </p>

                            {/* Meta bar: timestamp + read receipt (only on my sent messages) */}
                            <div className={`flex items-center gap-1.5 mt-2 select-none ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-[10px] font-bold text-slate-500">
                                    {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                {/* Read receipt ticks — only visible on MY outbound messages */}
                                {isMyMessage && (
                                    <div className="flex items-center">
                                        {msg.is_read ? (
                                            <CheckCheck size={14} className="text-brand-teal" title="Read" />
                                        ) : (
                                            <Check size={14} className="text-slate-500" title="Sent" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Admin typing indicator — shown on left (admin side) */}
            {isAdminTyping && (
                <div className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-300 text-xs font-black shrink-0 mt-1">
                        AD
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl rounded-tl-none max-w-[70%] shadow-sm">
                        <div className="flex items-center gap-1.5 py-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}