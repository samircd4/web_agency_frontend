'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! How can I help you with your next project?' }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        // Mock bot response
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                role: 'bot', 
                content: "Thank you for reaching out! One of our engineers will get back to you shortly. Feel free to leave your contact details." 
            }]);
        }, 2000);
    };

    return (
        <>
            {/* Chat Window Container */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-0 right-0 sm:right-8 z-[110] w-full sm:w-[380px] md:w-[420px] h-[550px] md:h-[650px] bg-background/95 backdrop-blur-2xl border-x border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] sm:mb-8 shadow-premium overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-base">System Assistant</h3>
                                    <p className="text-[10px] text-brand-teal font-bold uppercase tracking-widest">Active System</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-brand-red hover:rotate-90 transition-all duration-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-4 pr-2"
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-brand-teal text-white rounded-tr-none shadow-lg shadow-brand-teal/10' 
                                            : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white/5 text-slate-300 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 bg-white/[0.02] border-t border-white/5 flex gap-2">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Message..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-600"
                            />
                            <button 
                                type="submit"
                                className="p-3 bg-brand-teal text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-teal/20"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button Container */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-8 right-8 z-[100]"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(true)}
                            className="w-16 h-16 bg-brand-teal text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-teal/40 border border-white/10 relative group"
                        >
                            <div className="absolute inset-0 bg-brand-teal rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <MessageSquare size={28} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
