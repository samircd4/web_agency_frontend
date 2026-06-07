'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

export default function Communications({ missions = [] }) {
    const [messageText, setMessageText] = useState('');
    const [files, setFiles] = useState([]);
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedText = messageText.trim();
        if (!trimmedText && files.length === 0) return;
        if (isSending) return;

        try {
            setIsSending(true);
            console.log("Transmitting text stream block:", { text: trimmedText, attachments: files });
            setMessageText('');
            setFiles([]);
        } catch (error) {
            console.error("Transmission failed:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <motion.div 
            key="comms" 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -5 }} 
            /* mt-6 adds the top margin you requested.
              max-h-[calc(100vh-4rem)] subtracts that layout space from the viewport 
              height so the footer never gets pushed past the bottom of the screen.
            */
            className="h-full max-h-[calc(100vh-4rem)] w-full flex flex-col min-h-0 overflow-hidden"
        >
            <div className="glass border-white/5 rounded-xl flex-1 flex flex-col min-h-0 overflow-hidden bg-[#060814]/40">
                {/* Header Block (Stays Fixed) */}
                <ChatHeader />
                
                {/* Scrollable Body Container */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <ChatBody missions={missions} />
                </div>
                
                {/* Footer Controls (Stays Fixed at bottom) */}
                <ChatFooter 
                    messageText={messageText}
                    setMessageText={setMessageText}
                    files={files}
                    setFiles={setFiles}
                    isSending={isSending}
                    onSubmit={handleSendMessage}
                />
            </div>
        </motion.div>
    );
}