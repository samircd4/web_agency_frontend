'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, Box, MessageSquare, CreditCard, Settings, 
  Bell, Search, User, Zap, Clock, CheckCircle2, AlertCircle, 
  ArrowUpRight, Download, Terminal, ChevronRight, Filter, ArrowLeft,
  Shield, FileText, Send, Lock, Globe, Database, X, Cpu, Server, Activity,
  Menu
} from 'lucide-react';

export default function DashboardView() {
  const [activeTab, setActiveTab] = useState('missions');
  const [selectedMission, setSelectedMission] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const missions = [
    { 
      id: "MSN-4029", 
      title: "Real-estate Data Extraction Engine", 
      status: "In Progress", 
      progress: 65, 
      deadline: "May 15, 2024", 
      tier: "Premium", 
      price: "$2,500", 
      type: "Web Scraping",
      details: "Building a distributed scraping network across 4 regions to extract real-time listing data from Zillow and Redfin.",
      tech: ["Python", "Playwright", "Redis", "AWS Lambda"],
      logs: [
        { time: "09:00", event: "Node clustering initialized" },
        { time: "11:30", event: "Anti-bot threshold reached - rotating proxy mesh" },
        { time: "14:15", event: "Data ingestion rate: 450 records/sec" }
      ]
    },
    { 
      id: "MSN-3911", 
      title: "Custom E-commerce API Hook", 
      status: "Testing", 
      progress: 90, 
      deadline: "Completed", 
      tier: "Standard", 
      price: "$850", 
      type: "Backend",
      details: "Developing a custom middleware to sync Shopify inventory with a localized ERP system.",
      tech: ["Django", "PostgreSQL", "Celery", "Shopify API"],
      logs: [
        { time: "Yesterday", event: "Inventory sync tested with 50k SKU batch" },
        { time: "Monday", event: "Webhook endpoint secured with SHA-256" }
      ]
    },
    { 
      id: "MSN-3882", 
      title: "Distributed Proxy Mesh Setup", 
      status: "Deploying", 
      progress: 100, 
      deadline: "Completed", 
      tier: "Enterprise", 
      price: "$4,200", 
      type: "Infrastructure",
      details: "Setting up a private proxy mesh using residential IP pools.",
      tech: ["Golang", "Docker", "Kubernetes", "Residential Proxies"],
      logs: [
        { time: "Last Week", event: "Cluster deployed to GCP" },
        { time: "2 Weeks Ago", event: "Architecture audit completed" }
      ]
    }
  ];

  const vaultFiles = [
    { name: "technical_specs_v2.pdf", size: "2.4 MB", date: "Apr 28, 2024", type: "PDF" },
    { name: "api_documentation_final.md", size: "12 KB", date: "Apr 25, 2024", type: "Markdown" },
    { name: "source_code_archive.zip", size: "45.8 MB", date: "Apr 20, 2024", type: "ZIP" },
    { name: "deployment_log_mission_3882.txt", size: "156 KB", date: "Apr 18, 2024", type: "LOG" }
  ];

  const invoices = [
    { id: "INV-8821", date: "May 01, 2024", amount: "$2,500", status: "Paid", method: "Stripe" },
    { id: "INV-8790", date: "Apr 15, 2024", amount: "$850", status: "Paid", method: "Stripe" },
    { id: "INV-8755", date: "Apr 10, 2024", amount: "$4,200", status: "Refunded", method: "Stripe" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans overflow-x-hidden">
      
      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed left-4 top-4 bottom-4 w-60 bg-slate-950/80 backdrop-blur-xl border border-white/5 z-[101] flex flex-col p-5 rounded-xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'} shadow-2xl shadow-black/50`}>
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-brand-teal/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full h-full glass rounded-lg flex items-center justify-center overflow-hidden border-white/10 group-hover:border-brand-teal/30">
                <Image src="/images/logo/logo.png" alt="Logo" fill sizes="32px" priority className="object-contain p-1" />
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
            className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all mb-4 border border-white/5"
            title="Back to Site"
          >
            <ArrowLeft size={14} />
          </Link>
          {[
            { id: 'missions', name: 'Active Missions', icon: <Zap size={16} /> },
            { id: 'vault', name: 'Secure Vault', icon: <Box size={16} /> },
            { id: 'comms', name: 'Communications', icon: <MessageSquare size={16} /> },
            { id: 'billing', name: 'Billing Ledger', icon: <CreditCard size={16} /> },
            { id: 'settings', name: 'System Config', icon: <Settings size={16} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20 shadow-glow-teal/5' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        {/* System Health */}
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
              <span className="text-white">12ms</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-[272px] min-h-screen relative p-6 pr-8">
        
        {/* Floating Top Header */}
        <header className="h-14 bg-slate-950/50 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-between px-5 mb-8 sticky top-6 z-40 shadow-xl shadow-black/20">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-1 text-slate-400 hover:text-white">
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg px-4 py-1.5 w-64 lg:w-96">
              <Search size={13} className="text-slate-500" />
              <input 
                type="text" 
                placeholder="Search mission protocols..." 
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
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-red rounded-full border border-slate-950" />
            </button>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <div className="flex items-center gap-3 ml-1">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-black text-white uppercase tracking-tight">Samir Labs</div>
                <div className="text-[7px] font-bold text-brand-teal uppercase tracking-widest">Enterprise Node</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center font-black text-white text-[10px] border border-white/10">
                SL
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="w-full">
          
          <AnimatePresence mode="wait">
            {activeTab === 'missions' && (
              <motion.div key="missions" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                {/* Welcome Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">Operational Command</h1>
                    <p className="text-slate-500 text-xs">Managing your active engineering mission and technical assets.</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 transition-all">
                      <Download size={12} /> Export
                    </button>
                    <Link href="/services" className="px-5 py-2 bg-brand-teal text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-glow-teal hover:-translate-y-0.5 transition-all">
                      New Mission <Zap size={12} />
                    </Link>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Total Invested', value: '$7,550', icon: <CreditCard className="text-brand-teal" />, growth: '+12.5%' },
                    { label: 'Active Missions', value: '3', icon: <Zap className="text-brand-red" />, growth: 'Stable' },
                    { label: 'Deliverables', value: '24', icon: <Box className="text-brand-indigo" />, growth: 'Ready' }
                  ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-xl glass border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        {React.cloneElement(stat.icon, { size: 24 })}
                      </div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{stat.label}</div>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-black text-white">{stat.value}</div>
                        <div className="text-[9px] font-bold text-brand-teal mb-0.5">{stat.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Missions List */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                      <Terminal size={16} className="text-brand-teal" /> Active Mission Protocols
                    </h2>
                  </div>
                  <div className="grid gap-3">
                    {missions.map((mission) => (
                      <div key={mission.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-teal/20 transition-all group">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                          <div className="lg:w-1/3">
                            <div className="text-[9px] font-black text-brand-teal uppercase tracking-widest mb-0.5">{mission.id}</div>
                            <h3 className="text-sm font-black text-white group-hover:text-brand-teal transition-colors mb-1 uppercase">{mission.title}</h3>
                            <div className="flex gap-2">
                              <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[7px] font-black text-slate-500 uppercase tracking-widest">{mission.type}</span>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-end mb-2">
                              <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Phase</div>
                              <div className="text-[10px] font-black text-white">{mission.progress}%</div>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${mission.progress}%` }} className="h-full bg-brand-teal" />
                            </div>
                          </div>
                          <div className="lg:w-40 text-right flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2">
                            <div className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-[8px] font-black text-white uppercase tracking-widest">{mission.status}</div>
                            <button 
                              onClick={() => setSelectedMission(mission)}
                              className="px-4 py-2 bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 group/btn"
                            >
                              View
                              <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'vault' && (
              <motion.div key="vault" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">Secure Vault</h1>
                  <p className="text-slate-500 text-xs">Encrypted storage for briefings and project deliverables.</p>
                </div>
                
                <div className="grid gap-2">
                  {vaultFiles.map((file, i) => (
                    <div key={i} className="p-4 rounded-xl glass border border-white/5 flex items-center justify-between group hover:border-brand-teal/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-teal transition-colors">
                          <FileText size={18} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-xs mb-0.5">{file.name}</h4>
                          <div className="flex gap-3 text-[8px] font-black uppercase tracking-widest text-slate-600">
                            <span>{file.size}</span>
                            <span>{file.date}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2.5 rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-brand-teal transition-all">
                        <Download size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'comms' && (
              <motion.div key="comms" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">Secure Comms</h1>
                    <p className="text-slate-500 text-xs">Direct encrypted channel to lead team.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('missions')}
                    className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-all"
                    title="Return to Command"
                  >
                    <ArrowLeft size={14} />
                  </button>
                </div>

                <div className="glass border-white/5 rounded-xl h-[500px] flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal font-black text-[10px]">DP</div>
                      <div>
                        <div className="text-[10px] font-black text-white uppercase tracking-widest">Lead Engineer</div>
                        <div className="text-[7px] font-bold text-brand-teal uppercase tracking-widest">Active</div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 text-slate-600"><Lock size={12} /></button>
                  </div>
                  
                  <div className="flex-grow p-5 space-y-4 overflow-y-auto">
                    <div className="flex gap-3 max-w-sm">
                      <div className="w-7 h-7 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-[8px] font-black shrink-0">DP</div>
                      <div className="p-4 rounded-xl rounded-tl-none bg-white/5 border border-white/5 text-xs leading-relaxed text-slate-300">
                        Mission MSN-4029 update: Bypassed behavioral detection. Scaling nodes.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    <div className="flex gap-2">
                      <input type="text" placeholder="Encrypted message..." className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 text-xs text-white focus:outline-none focus:border-brand-teal/50" />
                      <button className="p-3 bg-brand-teal text-white rounded-lg shadow-glow-teal"><Send size={16} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">Billing Ledger</h1>
                  <p className="text-slate-500 text-xs">Financial history.</p>
                </div>

                <div className="glass border-white/5 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 border-b border-white/5">
                        <th className="px-6 py-4">Invoice</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4 font-black text-white text-[10px]">{inv.id}</td>
                          <td className="px-6 py-4 text-slate-600 text-[10px]">{inv.date}</td>
                          <td className="px-6 py-4 font-bold text-white text-[10px]">{inv.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${
                              inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-brand-red/10 text-brand-red'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 rounded-lg bg-white/5 text-slate-600 hover:text-white transition-all"><Download size={12} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">System Config</h1>
                  <p className="text-slate-500 text-xs">Operational preferences.</p>
                </div>

                <div className="max-w-2xl glass border-white/5 rounded-xl p-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-600 ml-2">Name</label>
                        <input type="text" defaultValue="Samir Labs" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-600 ml-2">Email Hook</label>
                        <input type="email" defaultValue="ops@samirlabs.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50" />
                      </div>
                    </div>
                    <button className="px-5 py-2 bg-brand-teal text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-glow-teal hover:-translate-y-0.5 transition-all">
                      Save System Config
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Mission Detail Modal */}
      <AnimatePresence>
        {selectedMission && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMission(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden glass border border-white/10 rounded-xl bg-slate-900 shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-0.5">{selectedMission.id} PROTOCOL</div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">{selectedMission.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedMission(null)}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand-red/20 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-grow overflow-y-auto p-6 md:p-8">
                <div className="grid md:grid-cols-[1fr_240px] gap-8">
                  
                  {/* Briefing Content */}
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Terminal size={12} className="text-brand-teal" /> Mission Briefing
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed italic">
                        &quot;{selectedMission.details}&quot;
                      </p>
                    </section>

                    <section>
                      <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Cpu size={12} className="text-brand-red" /> Stack
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMission.tech.map(t => (
                          <span key={t} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[8px] font-bold text-white uppercase tracking-widest">
                            {t}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Activity size={12} className="text-brand-indigo" /> Logs
                      </h4>
                      <div className="space-y-3 border-l border-white/5 ml-1.5 pl-4">
                        {selectedMission.logs.map((log, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[21px] top-1 w-1.5 h-1.5 rounded-full bg-brand-teal shadow-glow-teal" />
                            <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-0.5">{log.time}</div>
                            <div className="text-[10px] text-slate-500">{log.event}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Sidebar Metadata */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-3">Status</div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                          <Zap size={20} />
                        </div>
                        <div>
                          <div className="text-lg font-black text-white">{selectedMission.progress}%</div>
                          <div className="text-[8px] font-black text-brand-teal uppercase tracking-widest">{selectedMission.status}</div>
                        </div>
                      </div>
                      <div className="space-y-3 border-t border-white/5 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Deadline</span>
                          <span className="text-[9px] font-bold text-white uppercase">{selectedMission.deadline}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Price</span>
                          <span className="text-[9px] font-bold text-brand-teal uppercase">{selectedMission.price}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setActiveTab('comms');
                        setSelectedMission(null);
                      }}
                      className="w-full py-3 bg-brand-teal text-white rounded-lg font-black uppercase tracking-widest text-[9px] shadow-glow-teal hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                      Secure Channel <MessageSquare size={14} />
                    </button>
                    <button className="w-full py-3 glass text-white rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                      Report <Download size={14} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                <div className="flex items-center justify-center gap-2 text-[7px] font-black text-slate-700 uppercase tracking-[0.3em]">
                  <Shield size={10} className="text-brand-teal" /> Protected Protocol
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
