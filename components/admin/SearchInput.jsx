'use client';

import { Search } from 'lucide-react';

export default function SearchInput({ query, setQuery }) {
    return (
        <div className="p-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-2">
                <Search size={14} className="text-slate-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search clients..."
                    className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-700 w-full font-bold"
                />
            </div>
        </div>
    );
}