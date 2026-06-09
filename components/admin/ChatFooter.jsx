'use client';

import { useState, useRef } from 'react';
import { Paperclip, Smile, Send, Loader2 } from 'lucide-react';

export default function ChatFooter({ onSendMessage, onTypingStatusChange }) {
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const isCurrentlyTypingRef = useRef(false);
    const typingTimeoutRef = useRef(null);
    const inputRef = useRef(null);

    const sendTypingStatus = (isTyping) => {
        if (onTypingStatusChange) {
            onTypingStatusChange(isTyping);
        }
        isCurrentlyTypingRef.current = isTyping;
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setMessageText(val);

        // Notify typing = true when user starts typing
        if (!isCurrentlyTypingRef.current) {
            sendTypingStatus(true);
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to notify typing = false after 1.5 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingStatus(false);
        }, 1500);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedMessage = messageText.trim();
        if (!trimmedMessage || isSending) return;

        try {
            setIsSending(true);
            
            // Stop typing status
            sendTypingStatus(false);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Fire API dispatch through page.jsx callback
            await onSendMessage(trimmedMessage);
            // Clear input box on successful transmission
            setMessageText('');
        } catch (error) {
            console.error("Failed to transmit text block layout:", error);
        } finally {
            setIsSending(false);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div className="p-4 border-t border-white/10 bg-white/[0.01] shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <button 
                     type="button" 
                     className="p-2.5 rounded-lg bg-white/5 text-slate-500 hover:text-white border border-white/5"
                >
                     <Paperclip size={16} />
                </button>
                <button 
                     type="button" 
                     className="p-2.5 rounded-lg bg-white/5 text-slate-500 hover:text-white border border-white/5"
                >
                     <Smile size={16} />
                </button>
                 
                <div className="flex-grow bg-white/5 border border-white/5 rounded-lg px-4 py-2">
                     <input
                         ref={inputRef}
                         type="text"
                         value={messageText}
                         onChange={handleInputChange}
                         disabled={isSending}
                         placeholder={isSending ? "Sending message..." : "Type a message..."}
                         className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-700 w-full font-bold disabled:opacity-50"
                     />
                </div>
 
                 <button
                     type="submit"
                     disabled={!messageText.trim() || isSending}
                     className="p-2.5 rounded-lg bg-brand-teal text-text-primary hover:bg-brand-teal/90 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[42px]"
                 >
                     {isSending ? (
                         <Loader2 size={16} className="animate-spin" />
                     ) : (
                         <Send size={16} />
                     )}
                 </button>
             </form>
         </div>
     );
}