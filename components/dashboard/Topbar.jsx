import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, MessageSquare, Bell } from 'lucide-react';

export default function DashboardTopbar({
    isDesktop,
    setIsSidebarOpen,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    activeProjectsCount,
    userDisplayName,
    userInitials,
    currentUser,
}) {
    return (
        <header className="h-14 bg-slate-950/50 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-between px-4 lg:px-5 mb-4 lg:mb-8 sticky top-4 lg:top-6 z-40 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-1 text-slate-400 hover:text-white">
                    <Menu size={18} />
                </button>
                
                {/* Logo & Brand Name on Mobile */}
                <Link href="/" className="lg:hidden flex items-center gap-2 group">
                    <div className="relative w-7 h-7 group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-brand-teal/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-full h-full glass rounded-lg flex items-center justify-center overflow-hidden border-white/10 group-hover:border-brand-teal/30">
                            <Image
                                src="/images/logo/logo.png"
                                alt="Logo"
                                fill
                                sizes="28px"
                                priority
                                className="object-contain p-1"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-white tracking-tight leading-none uppercase">Dr.Python</span>
                        <span className="text-[6px] font-bold text-brand-teal uppercase tracking-[0.2em] leading-none">Solutions</span>
                    </div>
                </Link>

                <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg px-4 py-1.5 w-64 lg:w-96">
                    <Search size={13} className="text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search projects..."
                        className="bg-transparent border-none outline-none text-[10px] text-white placeholder:text-slate-700 w-full font-bold"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setActiveTab('comms')}
                    className="relative p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5"
                >
                    <MessageSquare size={14} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-teal rounded-full border border-slate-950" />
                </button>
                <button className="relative p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5">
                    <Bell size={14} />
                    {activeProjectsCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-red rounded-full border border-slate-950" />
                    )}
                </button>
                <div className="h-4 w-px bg-white/10 mx-1" />
                <div className="flex items-center gap-3 ml-1">
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] font-black text-white uppercase tracking-tight">{userDisplayName}</div>
                        <div className="text-[7px] font-bold text-brand-teal uppercase tracking-widest">{isDesktop ? 'Client Node' : 'Client Node'}</div>
                    </div>
                    {currentUser?.avatar ? (
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                            <img
                                src={currentUser.avatar}
                                alt={userDisplayName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center font-black text-white text-[10px] border border-white/10">
                            {userInitials}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
