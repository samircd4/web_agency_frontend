'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export default function useAdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function initAdmin() {
      try {
        const me = await api.getMe();
        setCurrentUser(me);
      } catch (err) {
        console.error('Failed to get admin user:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      initAdmin();
    }
  }, [mounted, router]);

  const handleLogout = () => {
    api.logout();
    router.push('/admin/login');
  };

  return {
    pathname,
    sidebarOpen,
    setSidebarOpen,
    mounted,
    searchQuery,
    setSearchQuery,
    currentUser,
    loading,
    handleLogout,
  };
}
