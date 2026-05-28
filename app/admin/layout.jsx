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
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans overflow-x-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AdminSidebar
        pathname={pathname}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      <main className="lg:pl-[272px] min-h-screen relative p-6 pr-8">
        <AdminTopbar
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
        />
        {children}
      </main>
    </div>
  );
}
