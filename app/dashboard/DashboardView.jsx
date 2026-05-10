'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, Box, MessageSquare, CreditCard, Settings, 
  Bell, Search, User, Zap, Clock, CheckCircle2, AlertCircle, 
  ArrowUpRight, Download, Terminal, ChevronRight, Filter, ArrowLeft,
  Shield, FileText, Send, Lock, Globe, Database, X, Cpu, Server, Activity
} from 'lucide-react';

export default function DashboardView() {
  const [activeTab, setActiveTab] = useState('missions');
  const [selectedMission, setSelectedMission] = useState(null);

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
      details: "Building a distributed scraping network across 4 regions to extract real-time listing data from Zillow and Redfin. Implementing behavioral bypass for high-frequency extraction.",
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
      details: "Developing a custom middleware to sync Shopify inventory with a localized ERP system. Optimized for low-latency synchronization.",
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
      details: "Setting up a private proxy mesh using residential IP pools. Includes self-healing logic and automatic rotation.",
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
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-slate-950 border-r border-white/5 z-50 hidden lg:flex flex-col p-8">
        <Link href="/" className="flex items-center gap-3 mb-12 group">
          <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-brand-teal/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-full h-full glass rounded-xl flex items-center justify-center overflow-hidden border-white/10 group-hover:border-brand-teal/30">
              <Image src="/images/logo/logo.png" alt="Logo" fill sizes="40px" className="object-contain p-1.5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-tight leading-none uppercase">Dr.Python</span>
            <span className="text-[9px] font-bold text-brand-teal uppercase tracking-[0.2em] leading-none mt-1">Solutions</span>
          </div>
        </Link>

        <nav className="flex-grow space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all mb-4"
          >
            <ArrowLeft size={16} />
            Back to Site
          </Link>
          {[
            { id: 'missions', name: 'Active Missions', icon: <Zap size={18} /> },
            { id: 'vault', name: 'Secure Vault', icon: <Box size={18} /> },
            { id: 'comms', name: 'Communications', icon: <MessageSquare size={18} /> },
            { id: 'billing', name: 'Billing & Invoices', icon: <CreditCard size={18} /> },
            { id: 'settings', name: 'System Config', icon: <Settings size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        {/* System Health */}
        <div className="mt-auto p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Node Status</span>
            <span className="flex h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span>Uptime</span>
              <span className="text-white">99.99%</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span>Latency</span>
              <span className="text-white">12ms</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-72 min-h-screen relative">
        
        {/* Top Header Bar */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl px-6 py-3 w-96">
            <Search size={16} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search mission protocols..." 
              className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-600 w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('comms')}
              className="relative p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all group"
            >
              <MessageSquare size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-teal rounded-full border-2 border-slate-950" />
            </button>
            <button className="relative p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full border-2 border-slate-950" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-black text-white uppercase tracking-widest">Samir Labs</div>
                <div className="text-[8px] font-bold text-brand-teal uppercase tracking-widest">Enterprise Access</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center font-black text-white">
                SL
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-10 max-w-7xl mx-auto">
          
          <AnimatePresence mode="wait">
            {activeTab === 'missions' && (
              <motion.div key="missions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Welcome Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Operational Command</h1>
                    <p className="text-slate-500 text-sm">Managing your active engineering mission and technical assets.</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                      <Download size={14} /> Export Logs
                    </button>
                    <Link href="/services" className="px-6 py-3 bg-brand-teal text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-glow-teal hover:-translate-y-1 transition-all">
                      New Mission <Zap size={14} />
                    </Link>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {[
                    { label: 'Total Invested', value: '$7,550', icon: <CreditCard className="text-brand-teal" />, growth: '+12.5%' },
                    { label: 'Active Missions', value: '3', icon: <Zap className="text-brand-red" />, growth: 'Stable' },
                    { label: 'Deliverables', value: '24', icon: <Box className="text-brand-indigo" />, growth: 'Ready' }
                  ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] glass border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        {stat.icon}
                      </div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</div>
                      <div className="flex items-end gap-3">
                        <div className="text-3xl font-black text-white">{stat.value}</div>
                        <div className="text-[10px] font-bold text-brand-teal mb-1">{stat.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Missions List */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                      <Terminal size={20} className="text-brand-teal" /> Active Mission Protocols
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {missions.map((mission) => (
                      <div key={mission.id} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-brand-teal/20 transition-all group">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                          <div className="lg:w-1/3">
                            <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest mb-1">{mission.id}</div>
                            <h3 className="text-lg font-black text-white group-hover:text-brand-teal transition-colors mb-2 uppercase">{mission.title}</h3>
                            <div className="flex gap-2">
                              <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px] font-black text-slate-500 uppercase tracking-widest">{mission.type}</span>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-end mb-3">
                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phase</div>
                              <div className="text-xs font-black text-white">{mission.progress}%</div>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${mission.progress}%` }} className="h-full bg-brand-teal" />
                            </div>
                          </div>
                          <div className="lg:w-48 text-right flex flex-col items-end gap-3">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-white uppercase tracking-widest">{mission.status}</div>
                            <button 
                              onClick={() => setSelectedMission(mission)}
                              className="px-6 py-3 bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn"
                            >
                              View Details 
                              <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other tabs (Vault, Comms, Billing, Settings) remain unchanged but integrated in the same way */}
            {activeTab === 'vault' && (
               <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="mb-12">
                 <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Secure Vault</h1>
                 <p className="text-slate-500 text-sm">Encrypted storage for your technical briefings and project deliverables.</p>
               </div>
               
               <div className="grid gap-4">
                 {vaultFiles.map((file, i) => (
                   <div key={i} className="p-6 rounded-[2rem] glass border border-white/5 flex items-center justify-between group hover:border-brand-teal/30 transition-all">
                     <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-teal transition-colors">
                         <FileText size={20} />
                       </div>
                       <div>
                         <h4 className="text-white font-bold text-sm mb-1">{file.name}</h4>
                         <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                           <span>{file.size}</span>
                           <span>{file.date}</span>
                         </div>
                       </div>
                     </div>
                     <button className="p-4 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-brand-teal transition-all">
                       <Download size={18} />
                     </button>
                   </div>
                 ))}
               </div>
             </motion.div>
            )}

            {activeTab === 'comms' && (
              <motion.div key="comms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-12">
                  <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Secure Comms</h1>
                  <p className="text-slate-500 text-sm">Direct encrypted channel to your lead engineering team.</p>
                </div>

                <div className="glass border-white/5 rounded-[3rem] h-[600px] flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal font-black">DP</div>
                      <div>
                        <div className="text-xs font-black text-white uppercase tracking-widest">Dr. Python (Lead)</div>
                        <div className="text-[9px] font-bold text-brand-teal uppercase tracking-widest">Online</div>
                      </div>
                    </div>
                    <button className="p-3 rounded-xl bg-white/5 text-slate-500"><Lock size={16} /></button>
                  </div>
                  
                  <div className="flex-grow p-8 space-y-6 overflow-y-auto">
                    <div className="flex gap-4 max-w-md">
                      <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-[10px] font-black">DP</div>
                      <div className="p-5 rounded-3xl rounded-tl-none bg-white/5 border border-white/5 text-sm leading-relaxed">
                        Mission MSN-4029 update: We have successfully bypassed the behavioral detection on the target API. Scaling extraction nodes now.
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                    <div className="flex gap-4">
                      <input type="text" placeholder="Type your encrypted message..." className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 text-sm text-white focus:outline-none focus:border-brand-teal/50" />
                      <button className="p-4 bg-brand-teal text-white rounded-2xl shadow-glow-teal"><Send size={20} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-12">
                  <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Billing Ledger</h1>
                  <p className="text-slate-500 text-sm">Financial records and mission funding history.</p>
                </div>

                <div className="glass border-white/5 rounded-[3rem] overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
                        <th className="px-8 py-6">Invoice ID</th>
                        <th className="px-8 py-6">Date</th>
                        <th className="px-8 py-6">Amount</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-6 font-black text-white text-xs">{inv.id}</td>
                          <td className="px-8 py-6 text-slate-500 text-xs">{inv.date}</td>
                          <td className="px-8 py-6 font-bold text-white text-xs">{inv.amount}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-brand-red/10 text-brand-red'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all"><Download size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-12">
                  <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">System Config</h1>
                  <p className="text-slate-500 text-sm">Update your secure profile and operational preferences.</p>
                </div>

                <div className="max-w-3xl glass border-white/5 rounded-[3rem] p-12">
                  <div className="space-y-10">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Display Name</label>
                        <input type="text" defaultValue="Samir Labs" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Email Hook</label>
                        <input type="email" defaultValue="ops@samirlabs.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50" />
                      </div>
                    </div>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMission(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden glass border border-white/10 rounded-[3rem] bg-slate-900 shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">{selectedMission.id} PROTOCOL</div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedMission.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedMission(null)}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-brand-red/20 hover:border-brand-red/50 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-grow overflow-y-auto p-8 md:p-12">
                <div className="grid md:grid-cols-[1fr_300px] gap-12">
                  
                  {/* Briefing Content */}
                  <div className="space-y-12">
                    <section>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Terminal size={14} className="text-brand-teal" /> Mission Briefing
                      </h4>
                      <p className="text-slate-300 text-lg leading-relaxed italic">
                        &quot;{selectedMission.details}&quot;
                      </p>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Cpu size={14} className="text-brand-red" /> Technical Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMission.tech.map(t => (
                          <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white uppercase tracking-widest">
                            {t}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity size={14} className="text-brand-indigo" /> Live Event Log
                      </h4>
                      <div className="space-y-4 border-l border-white/5 ml-2 pl-6">
                        {selectedMission.logs.map((log, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-brand-teal shadow-glow-teal" />
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{log.time}</div>
                            <div className="text-xs text-slate-400">{log.event}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Sidebar Metadata */}
                  <div className="space-y-6">
                    <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5">
                      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Mission Status</div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                          <Zap size={24} />
                        </div>
                        <div>
                          <div className="text-xl font-black text-white">{selectedMission.progress}%</div>
                          <div className="text-[9px] font-black text-brand-teal uppercase tracking-widest">{selectedMission.status}</div>
                        </div>
                      </div>
                      <div className="space-y-4 border-t border-white/5 pt-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Deadline</span>
                          <span className="text-[10px] font-bold text-white uppercase">{selectedMission.deadline}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Funding</span>
                          <span className="text-[10px] font-bold text-brand-teal uppercase">{selectedMission.price}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security</span>
                          <span className="text-[10px] font-bold text-white uppercase">Encrypted</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-5 bg-brand-teal text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-glow-teal hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                      Open Secure Channel <MessageSquare size={16} />
                    </button>
                    <button className="w-full py-5 glass text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                      Download Report <Download size={16} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-white/[0.02] border-t border-white/5 text-center">
                <div className="flex items-center justify-center gap-2 text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">
                  <Shield size={12} className="text-brand-teal" /> Protected by Dr. Python Solutions Protocol
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
