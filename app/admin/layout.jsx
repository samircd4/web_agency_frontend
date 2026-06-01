'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import useAdminDashboard from '@/hooks/useAdminDashboard';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminTopbar from '@/components/admin/Topbar';

export default function AdminLayout({ children }) {
    const {
        pathname,
        sidebarOpen,
        setSidebarOpen,
        mounted,
        searchQuery,
        setSearchQuery,
        currentUser,
        loading,
        handleLogout,
    } = useAdminDashboard();

    if (pathname === '/admin/login' || pathname === '/admin/register') {
        return <>{children}</>;
    }

    if (loading || !mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
            <AnimatePresence>
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                handleLogout={handleLogout}
            />

            {/* Fixed Topbar */}
            <div className="fixed top-0 right-0 left-0 lg:left-[256px] z-30 bg-[#020617] px-3 lg:px-6 py-3">
                <AdminTopbar
                    setSidebarOpen={setSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentUser={currentUser}
                    handleLogout={handleLogout}
                />
            </div>

            {/* Main Content with Padding for Fixed Topbar */}
            <main className="lg:pl-[256px] min-h-screen flex flex-col p-0 lg:p-0 pt-[88px] lg:pt-[96px]">
                <div className="flex-grow px-3 lg:px-6 pb-3 lg:pb-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
