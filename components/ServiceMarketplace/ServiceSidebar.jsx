'use client';

import React from 'react';
import { ChevronDown, Search } from 'lucide-react';

export default function ServiceSidebar({ filters, setFilters, searchQuery, setSearchQuery }) {
  const filterGroups = [
    {
      id: 'sort',
      title: 'Sort By',
      type: 'select',
      options: ['Best selling', 'Newest arrivals', 'Price: Low to High', 'Price: High to Low']
    },
    {
      id: 'category',
      title: 'Category',
      type: 'select',
      options: ['All categories', 'Development', 'Design', 'Infrastructure', 'Content', 'Security', 'Cloud']
    },
    {
      id: 'deliveryTime',
      title: 'Delivery Time',
      type: 'select',
      options: ['Any delivery', '24 hours', 'Up to 3 days', 'Up to 7 days']
    },
    {
      id: 'budget',
      title: 'Budget',
      type: 'select',
      options: ['Any budget', 'Under $25', '$25 - $50', '$50 - $100', '$100 - $300', '$300+']
    }
  ];

  const handleFilterChange = (groupId, value) => {
    setFilters(prev => ({
      ...prev,
      [groupId]: value
    }));
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="sticky top-32 space-y-8">
        <div className="hidden lg:block">
          <h2 className="text-2xl font-black text-white mb-6">Filters</h2>
        </div>
        <div>
          
          {/* Search Input in Sidebar */}
          <div className="relative group mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-teal transition-colors" />
            <input 
              type="text" 
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-900 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-teal/50 transition-all shadow-lg"
            />
          </div>
        </div>
        
        {filterGroups.map((group, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {group.title}
            </h3>
            
            <div className="relative group">
              <select 
                value={filters[group.id]}
                onChange={(e) => handleFilterChange(group.id, e.target.value)}
                className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none cursor-pointer hover:border-brand-teal/50 transition-colors focus:outline-none focus:border-brand-teal"
              >
                {group.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-hover:text-brand-teal transition-colors" />
            </div>
          </div>
        ))}

        <button 
          onClick={() => {
            setFilters({ 
              sort: 'Best selling', 
              category: 'All categories', 
              deliveryTime: 'Any delivery', 
              budget: 'Any budget' 
            });
            setSearchQuery('');
          }}
          className="w-full py-4 text-sm font-bold text-slate-500 hover:text-brand-teal transition-colors border border-dashed border-white/10 rounded-2xl hover:border-brand-teal/30"
        >
          Reset All Filters
        </button>
      </div>
    </aside>
  );
}
