'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

import ClientListPanel from '@/components/admin/ClientListPanel';
import ChatWindow from '@/components/admin/ChatWindow';
import EmptyChatState from '@/components/admin/EmptyChatState';

export default function AdminCommunications() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Live operational message states
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    // 1. Load Client List Panel on component mount
    useEffect(() => {
        async function fetchClients() {
            try {
                const data = await api.getAdminClients();
                const realClients = Array.isArray(data) ? data : data.results || [];
                setClients(realClients);
            } catch (err) {
                console.error('Failed to fetch clients:', err);
                setClients([]);
            } finally {
                setLoading(false);
            }
        }
        fetchClients();
    }, []);

    // 2. Fetch thread log streams whenever the user shifts client row focus
    useEffect(() => {
        if (!selectedClient) {
            setMessages([]);
            return;
        }

        async function loadChatLog() {
            setMessagesLoading(true);
            try {
                const chatLog = await api.getChatMessages(selectedClient.id);
                
                // Convert timestamp strings back to native Date objects for UI formatting
                const formattedLog = chatLog.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                
                setMessages(formattedLog);
            } catch (err) {
                console.error('Error loading client chat logs:', err);
                setMessages([]);
            } finally {
                setMessagesLoading(false);
            }
        }

        loadChatLog();
    }, [selectedClient]);

    // 3. Post Message Action Handler passed down to footer components
    const handleSendMessage = async (text) => {
        if (!selectedClient) return;
        
        try {
            const newMsgJson = await api.sendChatMessage(selectedClient.id, text);
            
            // Append newly created database record to the layout feed list block
            setMessages(prev => [
                ...prev, 
                { 
                    ...newMsgJson, 
                    timestamp: new Date(newMsgJson.timestamp) 
                }
            ]);
        } catch (err) {
            console.error('Message delivery tracking fault:', err);
        }
    };

    const filteredClients = clients.filter((client) =>
        `${client.first_name || ''} ${client.last_name || ''} ${client.username || ''}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <div className="absolute top-20 bottom-0 left-0 lg:left-64 right-0 flex flex-col bg-[#060814] text-white overflow-hidden">
            <div className="flex flex-grow min-h-0 overflow-hidden w-full h-full">
                
                <ClientListPanel 
                    clients={filteredClients}
                    loading={loading}
                    selectedClient={selectedClient}
                    setSelectedClient={setSelectedClient}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <AnimatePresence mode="wait">
                    {selectedClient ? (
                        <ChatWindow 
                            key={selectedClient.id}
                            selectedClient={selectedClient}
                            setSelectedClient={setSelectedClient}
                            messages={messages}
                            messagesLoading={messagesLoading}
                            onSendMessage={handleSendMessage}
                        />
                    ) : (
                        <EmptyChatState />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}