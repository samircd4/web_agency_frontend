'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search, Loader2, Heart, Layers } from 'lucide-react';
import ServiceSidebar from './ServiceSidebar';
import ServiceCard from './ServiceCard';
import {
    fetchPublicServices,
    isServiceSaved,
    getSavedServices,
    fetchUserFavoriteServicesAPI
} from '@/lib/services';

export default function ServiceMarketplace() {
    const [servicesList, setServicesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('all'); // 'all' | 'saved'
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [filters, setFilters] = useState({
        sort: 'Best selling',
        category: 'All categories',
        deliveryTime: 'Any delivery',
        budget: 'Any budget'
    });

    const [isMounted, setIsMounted] = useState(false);
    const [savedVersion, setSavedVersion] = useState(0);

    useEffect(() => {
        setIsMounted(true);
        const handleSavedChange = () => setSavedVersion(v => v + 1);
        window.addEventListener('savedServicesChanged', handleSavedChange);
        return () => window.removeEventListener('savedServicesChanged', handleSavedChange);
    }, []);

    useEffect(() => {
        let isMounted = true;
        async function loadServices() {
            setLoading(true);
            setError(null);
            try {
                const [data] = await Promise.all([
                    fetchPublicServices(),
                    fetchUserFavoriteServicesAPI() // Sync remote favorites from backend if logged in
                ]);
                if (isMounted) {
                    setServicesList(data || []);
                }
            } catch (err) {
                console.error("Error loading services from backend:", err);
                if (isMounted) setError("Unable to connect to backend API.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        loadServices();
        return () => { isMounted = false; };
    }, []);

    const savedCount = useMemo(() => {
        if (!isMounted) return 0;
        const savedIds = getSavedServices();
        return savedIds.length;
    }, [isMounted, savedVersion]);

    const getServicePrice = (s) => {
        if (typeof s.price === 'number') return s.price;
        const basicPrice = s.tiers?.basic?.price;
        if (basicPrice) return parseFloat(strToNum(basicPrice));
        const stdPrice = s.tiers?.standard?.price;
        if (stdPrice) return parseFloat(strToNum(stdPrice));
        return 0;
    };

    const strToNum = (val) => String(val).replace(/[^0-9.]/g, '');

    const filteredServices = useMemo(() => {
        let result = [...servicesList];

        // Filter by Saved View Tab
        if (viewMode === 'saved') {
            if (!isMounted) return [];
            result = result.filter(s => isServiceSaved(s.id));
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s =>
                (s.title && s.title.toLowerCase().includes(query)) ||
                (s.seller?.name && s.seller.name.toLowerCase().includes(query))
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
                const price = getServicePrice(s);
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
            result.sort((a, b) => getServicePrice(a) - getServicePrice(b));
        } else if (filters.sort === 'Price: High to Low') {
            result.sort((a, b) => getServicePrice(b) - getServicePrice(a));
        } else if (filters.sort === 'Newest arrivals') {
            result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        }

        return result;
    }, [servicesList, searchQuery, filters, viewMode, savedVersion, isMounted]);

    return (
        <div className="container mx-auto px-4 pt-2 pb-12">
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
                                />
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Main Content & Grid Area */}
                <div className="flex-grow">
                    {/* Prominent Tab Switcher & Search Bar Header */}
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow">
                            {/* View Mode Toggle Buttons */}
                            <div className="flex items-center p-1.5 bg-surface-900/80 border border-white/10 rounded-2xl gap-1 flex-shrink-0">
                                <button
                                    onClick={() => setViewMode('all')}
                                    className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                        viewMode === 'all'
                                            ? 'bg-brand-teal text-slate-950 shadow-glow-teal'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <Layers size={14} />
                                    <span>Services</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                        viewMode === 'all' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/5 text-slate-400'
                                    }`}>
                                        {servicesList.length}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setViewMode('saved')}
                                    className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                        viewMode === 'saved'
                                            ? 'bg-brand-red text-white shadow-glow-red'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <Heart size={14} className={savedCount > 0 ? "fill-current text-white" : ""} />
                                    <span>Saved Services</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                        viewMode === 'saved' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                                    }`}>
                                        {savedCount}
                                    </span>
                                </button>
                            </div>

                            {/* Search Input (Placed after Saved Services and before Filter button on mobile) */}
                            <div className="flex-grow flex items-center gap-3">
                                <div className="relative group w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-teal transition-colors" />
                                    <input 
                                        type="text" 
                                        placeholder="Search services..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-surface-900 border border-white/10 rounded-2xl py-2.5 pl-11 pr-8 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-teal/50 transition-all shadow-lg"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Mobile Filter Button (Positioned after search input) */}
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-surface-900 border border-white/10 rounded-2xl text-white font-bold text-xs hover:border-brand-teal/50 transition-all flex-shrink-0"
                                >
                                    <Filter size={14} className="text-brand-teal" />
                                    <span>Filters</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Status Line */}
                    <div className="mb-6">
                        <p className="text-slate-400 text-xs md:text-sm">
                            {viewMode === 'saved' ? (
                                <>Displaying <span className="text-brand-red font-bold">{filteredServices.length}</span> saved favorite service{filteredServices.length === 1 ? '' : 's'}</>
                            ) : (
                                <>Found <span className="text-white font-bold">{loading ? '...' : filteredServices.length}</span> mission-critical services</>
                            )}
                        </p>
                    </div>

                    {/* Service Grid or Loading / Empty View */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-surface-900/20 rounded-[3rem] border border-dashed border-white/5 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Capabilities...</span>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredServices.map((service, index) => (
                                    <ServiceCard
                                        key={service.id || index}
                                        service={service}
                                        priority={index < 3}
                                    />
                                ))}
                            </div>

                            {filteredServices.length === 0 && (
                                <div className="text-center py-28 bg-surface-900/20 rounded-[3rem] border border-dashed border-white/5 p-8 space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-slate-500">
                                        {viewMode === 'saved' ? <Heart size={24} className="text-brand-red" /> : <Layers size={24} />}
                                    </div>
                                    <p className="text-slate-400 text-base font-medium">
                                        {viewMode === 'saved'
                                            ? "You haven't saved any services yet. Click the heart icon on any service card to bookmark it here!"
                                            : "No services found matching your criteria."
                                        }
                                    </p>
                                    <button
                                        onClick={() => {
                                            setViewMode('all');
                                            setSearchQuery('');
                                            setFilters({ sort: 'Best selling', category: 'All categories', deliveryTime: 'Any delivery', budget: 'Any budget' });
                                        }}
                                        className="text-brand-teal font-bold text-xs uppercase tracking-widest hover:underline"
                                    >
                                        {viewMode === 'saved' ? "Explore All Services" : "Clear all filters"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
