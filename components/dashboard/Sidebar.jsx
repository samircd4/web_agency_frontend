import Link from 'next/link';
import { ArrowLeft, Zap, Box, MessageSquare, CreditCard, Settings, LogOut, X } from 'lucide-react';

export default function DashboardSidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
  pendingInvoiceCount,
  pendingProposalCount,
}) {
  const items = [
    { id: 'missions', name: 'Active Projects', icon: <Zap size={16} /> },
    { id: 'vault', name: 'Secure Vault', icon: <Box size={16} /> },
    { id: 'comms', name: 'Communications', icon: <MessageSquare size={16} /> },
    {
      id: 'billing',
      name: 'Billing',
      icon: <CreditCard size={16} />,
      notificationDot: pendingProposalCount > 0 || pendingInvoiceCount > 0,
    },
    { id: 'settings', name: 'Settings', icon: <Settings size={16} /> },
  ];

  return (
    <aside className={`fixed left-4 top-4 bottom-4 w-60 bg-slate-950/80 backdrop-blur-xl border border-white/5 z-[101] flex flex-col p-5 rounded-xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'} shadow-2xl shadow-black/50`}>
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-brand-teal/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-full h-full glass rounded-lg flex items-center justify-center overflow-hidden border-white/10 group-hover:border-brand-teal/30">
              <div className="w-full h-full p-1 relative">
                <img src="/images/logo/logo.png" alt="Logo" className="object-contain w-full h-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-white tracking-tight leading-none uppercase">Dr.Python</span>
            <span className="text-[8px] font-bold text-brand-teal uppercase tracking-[0.2em] leading-none mt-1">Solutions</span>
          </div>
        </Link>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-grow space-y-1">
        <Link
          href="/"
          className="group flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-200 shadow-sm hover:shadow-md"
          title="Back to Website"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">Back to Website</span>
        </Link>

        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === item.id
              ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20 shadow-glow-teal/5'
              : 'text-slate-500 hover:text-white hover:bg-white/5'}
            `}
          >
            {item.icon}
            {item.name}
            {item.notificationDot && (
              <span className="absolute right-3 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-red hover:bg-brand-red/5 border border-transparent hover:border-brand-red/20 transition-all"
        >
          <LogOut size={16} />
          Logout Node
        </button>
      </nav>

      <div className="mt-auto p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">System</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[9px] font-bold">
            <span>Uptime</span>
            <span className="text-white">99.9%</span>
          </div>
          <div className="flex items-center justify-between text-[9px] font-bold">
            <span>Ping</span>
            <span className="text-white">14ms</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
