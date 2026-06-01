'use client';

import { Menu, Search, MessageSquare, Bell } from 'lucide-react';
import { getFullAvatarUrl, api } from '@/lib/api';
import NotificationDropdown from '@/components/NotificationDropdown';

import { useRouter } from 'next/navigation';
import UserAvatarDropdown from '@/components/UserAvatarDropdown';

export default function AdminTopbar({
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    currentUser,
    handleLogout, // Add handleLogout to props
}) {
    const router = useRouter();
    const userInitials =
        currentUser?.first_name && currentUser?.last_name
            ? `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase()
            : (currentUser?.username || 'SA').slice(0, 2).toUpperCase();

    const userDisplayName =
        currentUser?.first_name && currentUser?.last_name
            ? `${currentUser.first_name} ${currentUser.last_name}`
            : currentUser?.username || 'Samir';

    return (
        <header className="h-14 bg-slate-950/50 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-between px-4 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-1 text-slate-400 hover:text-white">
                    <Menu size={18} />
                </button>
                <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg px-4 py-1.5 w-64 lg:w-96">
                    <Search size={13} className="text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery?.(e.target.value)}
                        placeholder="Search leads, projects, clients..."
                        className="bg-transparent border-none outline-none text-[10px] text-white placeholder:text-slate-700 w-full font-bold"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="relative p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5">
                    <MessageSquare size={14} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-teal rounded-full border border-slate-950" />
                </button>
                <NotificationDropdown />
                <div className="h-4 w-px bg-white/10 mx-1" />
                <div className="flex items-center gap-3 ml-1">
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] font-black text-white uppercase tracking-tight">{userDisplayName}</div>
                        <div className="text-[7px] font-bold text-brand-teal uppercase tracking-widest">Superadmin</div>
                    </div>
                    <UserAvatarDropdown
                        currentUser={currentUser}
                        userDisplayName={userDisplayName}
                        userInitials={userInitials}
                        handleLogout={handleLogout}
                        router={router}
                    />
                </div>
            </div>
        </header>
    );
}
