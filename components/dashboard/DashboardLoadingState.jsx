'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardTopbar from '@/components/dashboard/Topbar';
import { Loader2 } from 'lucide-react';

export default function DashboardLoadingState({
    isSidebarOpen,
    setIsSidebarOpen,
    handleLogout,
    searchQuery,
    setSearchQuery,
}) {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden">
            <AnimatePresence>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <DashboardSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                handleLogout={handleLogout}
                pendingInvoiceCount={0}
                pendingProposalCount={0}
            />

            {/* Fixed Topbar */}
            <div className="fixed top-0 right-0 left-0 lg:left-[256px] z-30 bg-[#020617] px-3 lg:px-6 py-3">
                <DashboardTopbar
                    setIsSidebarOpen={setIsSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentUser={null} // No current user during initial loading
                />
            </div>

            {/* Main Content with Padding for Fixed Topbar */}
            <main className="lg:pl-[256px] min-h-screen flex flex-col p-0 lg:p-0 pt-[120px]">
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-brand-teal" />
                </div>
            </main>
        </div>
    );
}
