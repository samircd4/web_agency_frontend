'use client';

import React, { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DashboardProvider } from '@/hooks/useDashboard';
import useDashboard from '@/hooks/useDashboard';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardTopbar from '@/components/dashboard/Topbar';

// Inner layout reads from the shared context provided by DashboardProvider above.
function DashboardLayoutInner({ children }) {
    const {
        isSidebarOpen,
        setIsSidebarOpen,
        currentUser,
        handleLogout,
        pendingInvoiceCount,
        pendingProposalCount,
    } = useDashboard();

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
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
                pendingInvoiceCount={pendingInvoiceCount}
                pendingProposalCount={pendingProposalCount}
            />

            <div className="fixed top-0 right-0 left-0 lg:left-[256px] z-30 bg-[#020617] px-3 lg:px-6 py-3">
                <DashboardTopbar
                    setIsSidebarOpen={setIsSidebarOpen}
                    currentUser={currentUser}
                />
            </div>

            <main className="lg:pl-[256px] min-h-screen flex flex-col p-0 lg:p-0 mt-[100px]">
                {children}
            </main>
        </div>
    );
}

// Outer layout provides the single shared state for the entire dashboard subtree.
export default function DashboardLayout({ children }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-500">Loading dashboard...</div>}>
            <DashboardProvider>
                <DashboardLayoutInner>
                    {children}
                </DashboardLayoutInner>
            </DashboardProvider>
        </Suspense>
    );
}
