'use client';

import { Loader2 } from 'lucide-react';
import SearchInput from './SearchInput';
import ClientRow from './ClientRow';

export default function ClientListPanel({ clients, loading, selectedClient, setSelectedClient, searchQuery, setSearchQuery }) {
    return (
        <div className={`${selectedClient ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 border-r border-white/10 bg-white/[0.01] flex-col h-full min-h-0 shrink-0`}>
            <SearchInput query={searchQuery} setQuery={setSearchQuery} />
            
            <div className="overflow-y-auto flex-1 min-h-0 divide-y divide-white/5 custom-scrollbar">
                {loading ? (
                    <div className="p-8 text-center">
                        <Loader2 size={24} className="animate-spin text-brand-teal mx-auto" />
                    </div>
                ) : clients.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No clients found.
                    </div>
                ) : (
                    clients.map((client) => (
                        <ClientRow 
                            key={client.id}
                            client={client}
                            isActive={selectedClient?.id === client.id}
                            onClick={() => setSelectedClient(client)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}