'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search } from 'lucide-react';
import ServiceSidebar from './ServiceSidebar';
import ServiceCard from './ServiceCard';
import { mockServices } from '@/data/services';

export default function ServiceMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'Best selling',
    category: 'All categories',
    deliveryTime: 'Any delivery',
    budget: 'Any budget'
  });

  const filteredServices = useMemo(() => {
    let result = [...mockServices];

    // Search filter
    if (searchQuery) {
      result = result.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'All categories') {
      result = result.filter(s => s.category === filters.category);
    }

    // Delivery Time filter
    if (filters.deliveryTime !== 'Any delivery') {
      result = result.filter(s => s.delivery === filters.deliveryTime);
    }

    // Budget filter
    if (filters.budget !== 'Any budget') {
      result = result.filter(s => {
        const price = s.price;
        if (filters.budget === 'Under $25') return price < 25;
        if (filters.budget === '$25 - $50') return price >= 25 && price <= 50;
        if (filters.budget === '$50 - $100') return price >= 50 && price <= 100;
        if (filters.budget === '$100 - $300') return price >= 100 && price <= 300;
        if (filters.budget === '$300+') return price >= 300;
        return true;
      });
    }

    // Sort
    if (filters.sort === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'Newest arrivals') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [searchQuery, filters]);

  return (
    <div className="container mx-auto px-6 pt-2 pb-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ServiceSidebar 
            filters={filters} 
            setFilters={setFilters} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {showMobileFilters && (
            <div className="fixed inset-0 z-[100] lg:hidden">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
              />
              
              {/* Drawer */}
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-surface-900 border-r border-white/10 p-8 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 rounded-full bg-white/5 text-slate-400">
                    <X size={20} />
                  </button>
                </div>

                <ServiceSidebar 
                  filters={filters} 
                  setFilters={setFilters} 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onFilterChange={() => {/* Could auto-close on mobile if desired */}}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Grid Area */}
        <div className="flex-grow">
          {/* Results Count & Mobile Filter */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <p className="text-slate-400 text-xs md:text-sm">
              Found <span className="text-white font-bold">{filteredServices.length}</span> mission-critical services
            </p>

            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-surface-900 border border-white/10 rounded-xl text-white font-bold text-xs"
            >
              <Filter size={14} className="text-brand-teal" />
              <span>Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-32 bg-surface-900/20 rounded-[3rem] border border-dashed border-white/5">
              <p className="text-slate-500 text-lg">No services found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ sort: 'Best selling', category: 'All categories', deliveryTime: 'Any delivery', budget: 'Any budget' });
                }}
                className="mt-4 text-brand-teal font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
