'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

export default function ChatWindow({ 
    selectedClient, 
    setSelectedClient, 
    messages, 
    messagesLoading, 
    onSendMessage 
}) {
    return (
        <motion.main
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex flex-col h-full min-h-0 overflow-hidden"
        >
            <ChatHeader selectedClient={selectedClient} onBack={() => setSelectedClient(null)} />
            
            {messagesLoading ? (
                <div className="flex-1 flex items-center justify-center bg-[#060814]">
                    <Loader2 size={32} className="animate-spin text-brand-teal" />
                </div>
            ) : (
                <ChatBody messages={messages} />
            )}
            
            <ChatFooter onSendMessage={onSendMessage} />
        </motion.main>
    );
}