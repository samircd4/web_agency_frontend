'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { 
  LayoutDashboard, Box, MessageSquare, CreditCard, Settings, 
  Bell, Search, User, Zap, Clock, CheckCircle2, AlertCircle, 
  ArrowUpRight, Download, Terminal, ChevronRight, ArrowLeft,
  Shield, FileText, Send, Lock, Globe, X, Cpu, Activity,
  Menu, LogOut, Loader2
} from 'lucide-react';
import { api } from '@/lib/api';

export default function DashboardView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('missions');
  const [selectedMission, setSelectedMission] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Live state
  const [currentUser, setCurrentUser] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sysConfigEmail, setSysConfigEmail] = useState('');
  const [sysConfigName, setSysConfigName] = useState('');
  const [billingView, setBillingView] = useState('invoices'); // invoices | proposals
  const [clientInvoices, setClientInvoices] = useState([]);
  const [clientProposals, setClientProposals] = useState([]);
  const [billingDocsLoading, setBillingDocsLoading] = useState(false);
  const [billingDocsError, setBillingDocsError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleLogout = async () => {
    await api.logout();
    router.push('/admin/login');
  };

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const initDashboard = async () => {
      // Pre-check for presence of access_token to prevent unauthenticated console fetch errors
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        router.push('/admin/login?from=/dashboard');
        return;
      }

      try {
        // 1. Fetch current profile
        const me = await api.getMe();
        setCurrentUser(me);
        setSysConfigEmail(me.email || '');
        setSysConfigName(`${me.first_name || ''} ${me.last_name || ''}`.trim() || me.username);

        // 2. Fetch projects
        const compactProjects = await api.getClientProjects();
        
        // 3. Resolve details for each project (to get milestones, files, activity)
        const detailedProjects = await Promise.all(
          compactProjects.map(async (p) => {
            try {
              return await api.getClientProjectDetail(p.id);
            } catch (err) {
              console.error(`Failed to fetch project detail for ${p.id}`, err);
              // Fallback to compact layout if detail fetch fails
              return {
                ...p,
                description: 'Brief details retrieved from directory.',
                tags: [],
                milestones: [],
                files: [],
                activities: []
              };
            }
          })
        );
        setMissions(detailedProjects);
      } catch (err) {
        console.error('Failed to initialize dashboard:', err);
        // Unauthenticated -> redirect to login page
        router.push('/admin/login?from=/dashboard');
      } finally {
        setLoading(false);
      }
    };

    initDashboard();

    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  // Aggregate Vault Files from all projects
  const vaultFiles = missions.flatMap(m => 
    (m.files || []).map(f => ({
      ...f,
      projectName: m.title,
      projectId: m.id
    }))
  );

  // Filtering missions by search query
  const filteredMissions = missions.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats computed dynamically
  const totalInvestment = missions.reduce((sum, m) => sum + Number(m.value || 0), 0);
  const activeMissionsCount = missions.filter(m => m.stage !== 'Complete').length;
  const deliverablesCount = vaultFiles.length;

  const centsToMoney = (cents) => {
    const value = Number(cents || 0) / 100;
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const valueToMoney = (value) => {
    const numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return '0.00';
    return numeric.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const invoicePaymentLabel = (status) => (status === 'paid' ? 'Paid' : 'Unpaid');
  const canPayInvoice = (status) => status !== 'paid' && status !== 'void';

  const normalizeList = (res) => (Array.isArray(res) ? res : (res?.results || []));

  useEffect(() => {
    if (activeTab !== 'billing') return;
    if (!missions?.length) {
      setClientInvoices([]);
      setClientProposals([]);
      return;
    }

    let cancelled = false;
    const loadBillingDocs = async () => {
      try {
        setBillingDocsLoading(true);
        setBillingDocsError(null);

        const perProject = await Promise.all(
          missions.map(async (p) => {
            const [invRes, propRes] = await Promise.all([
              api.getClientProjectInvoices(p.id).catch(() => []),
              api.getClientProjectProposals(p.id).catch(() => []),
            ]);
            return {
              projectId: p.id,
              projectTitle: p.title,
              projectValue: p.value,
              invoices: normalizeList(invRes),
              proposals: normalizeList(propRes),
            };
          })
        );

        const mergedInvoices = perProject.flatMap(({ projectId, projectTitle, projectValue, invoices }) =>
          invoices.map(inv => ({ ...inv, _projectId: projectId, _projectTitle: projectTitle, _projectValue: projectValue }))
        );
        const mergedProposals = perProject.flatMap(({ projectId, projectTitle, projectValue, proposals }) =>
          proposals.map(prop => ({ ...prop, _projectId: projectId, _projectTitle: projectTitle, _projectValue: projectValue }))
        );

        if (cancelled) return;
        setClientInvoices(mergedInvoices);
        setClientProposals(mergedProposals);
      } catch (err) {
        if (cancelled) return;
        setBillingDocsError(err?.message || 'Failed to load billing documents');
      } finally {
        if (!cancelled) setBillingDocsLoading(false);
      }
    };

    loadBillingDocs();
    return () => { cancelled = true; };
  }, [activeTab, missions]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-brand-teal" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Decrypting Command Space...</span>
        </div>
      </div>
    );
  }

  // Get user initials for avatar badge
  const userInitials = currentUser.first_name && currentUser.last_name
    ? `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase()
    : currentUser.username.slice(0, 2).toUpperCase();

  const userDisplayName = currentUser.first_name && currentUser.last_name
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : currentUser.username;

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
            { id: 'missions', name: 'Active Projects', icon: <Zap size={16} /> },
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
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-red hover:bg-brand-red/5 border border-transparent hover:border-brand-red/20 transition-all"
          >
            <LogOut size={16} />
            Logout Node
          </button>
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
              <span className="text-white">14ms</span>
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
              {activeMissionsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-red rounded-full border border-slate-950" />
              )}
            </button>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <div className="flex items-center gap-3 ml-1">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-black text-white uppercase tracking-tight">{userDisplayName}</div>
                <div className="text-[7px] font-bold text-brand-teal uppercase tracking-widest">{currentUser.is_staff ? 'Staff Node' : 'Client Node'}</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center font-black text-white text-[10px] border border-white/10">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="w-full">
          
          <AnimatePresence mode="wait">
            {activeTab === 'missions' && (
              <motion.div key="missions" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">My Projects</h1>
                    <p className="text-slate-500 text-xs">Track your active projects and deliverables.</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/contact" className="px-5 py-2 bg-brand-teal text-text-primary rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-glow-teal hover:-translate-y-0.5 transition-all">
                      Request New Project <Zap size={12} />
                    </Link>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Total Invested', value: `$${totalInvestment.toLocaleString()}`, icon: <CreditCard className="text-brand-teal" />, sub: 'Aggregated project value' },
                    { label: 'Active Projects', value: String(activeMissionsCount), icon: <Zap className="text-brand-red" />, sub: 'In Development / QA' },
                    { label: 'Secure Deliverables', value: String(deliverablesCount), icon: <Box className="text-brand-indigo" />, sub: 'Files in vault' },
                  ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-xl glass border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        {React.cloneElement(stat.icon, { size: 24 })}
                      </div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                      <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                      <div className="text-[9px] font-bold text-brand-teal">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Projects List */}
                <div className="space-y-4">
                  {filteredMissions.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-xl text-slate-500 text-sm">
                      No active projects matching your query.
                    </div>
                  ) : (
                    filteredMissions.map((mission) => {
                      const stageSteps = ['Requirements', 'Architecture', 'Development', 'QA', 'Deployment', 'Complete'];
                      const statusStageMap = { 'Requirements': 1, 'Architecture': 1, 'Dev': 2, 'QA': 3, 'Deploying': 4, 'Complete': 5 };
                      const stageIdx = statusStageMap[mission.stage] ?? 2;
                      const milestones = mission.milestones || [];
                      
                      const projectTags = mission.tags || [];

                      return (
                        <div key={mission.id} className="rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-teal/20 transition-all group overflow-hidden">
                          {/* Card header */}
                          <div className="p-5">
                            <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                              <div className="lg:w-[38%]">
                                <div className="text-[9px] font-black text-brand-teal uppercase tracking-widest mb-1">{mission.id}</div>
                                <h3 className="text-sm font-black text-white group-hover:text-brand-teal transition-colors mb-2 uppercase leading-tight">{mission.title}</h3>
                                <div className="flex flex-wrap gap-1.5">
                                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[7px] font-black text-slate-500 uppercase tracking-widest">{mission.priority || 'Standard'} Priority</span>
                                  {projectTags.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[7px] font-black text-slate-400 uppercase tracking-widest">{tag}</span>
                                  ))}
                                </div>
                              </div>

                              {/* Stage pipeline */}
                              <div className="flex-grow">
                                <div className="hidden md:flex items-center mb-2">
                                  {stageSteps.map((s, si) => (
                                    <div key={s} className="flex items-center flex-1 min-w-0">
                                      <div className={`shrink-0 w-2.5 h-2.5 rounded-full border-2 ${si < stageIdx ? 'bg-brand-teal border-brand-teal' : si === stageIdx ? 'bg-brand-teal/30 border-brand-teal animate-pulse' : 'bg-white/5 border-white/10'}`} />
                                      {si < stageSteps.length - 1 && <div className={`flex-1 h-px ${si < stageIdx ? 'bg-brand-teal' : 'bg-white/10'}`} />}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex justify-between mb-1.5">
                                  <span className="text-[8px] font-black text-brand-teal uppercase tracking-widest">Stage: {mission.stage}</span>
                                  <span className="text-[8px] font-black text-white">{mission.progress}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${mission.progress}%` }} className={`h-full rounded-full ${mission.progress === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`} />
                                </div>
                              </div>

                              {/* Right column */}
                              <div className="lg:w-36 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2">
                                <div className="text-right">
                                  <div className="text-xs font-black text-brand-teal">${Number(mission.value || 0).toLocaleString()}</div>
                                  <div className="text-[8px] text-slate-600 font-bold uppercase">Deadline: {mission.deadline || 'Flexible'}</div>
                                </div>
                                <button onClick={() => setSelectedMission(mission)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-text-primary rounded-lg text-[8px] font-black uppercase tracking-widest transition-all">
                                  Details <ChevronRight size={10} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Milestone strip */}
                          {milestones.length > 0 && (
                            <div className="border-t border-white/5 px-5 py-3 flex gap-2 overflow-x-auto bg-white/[0.01]">
                              {milestones.slice(0, 5).map((m, mi) => (
                                <div key={mi} className={`flex items-center gap-1.5 shrink-0 text-[7px] font-black uppercase tracking-widest ${m.done ? 'text-emerald-400' : 'text-slate-700'}`}>
                                  {m.done ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                  {m.label}
                                  {mi < milestones.slice(0, 5).length - 1 && <span className="ml-1 text-slate-800">›</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
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
                  {vaultFiles.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-xl text-slate-500 text-sm">
                      No files stored in this vault workspace.
                    </div>
                  ) : (
                    vaultFiles.map((file, i) => (
                      <div key={i} className="p-4 rounded-xl glass border border-white/5 flex items-center justify-between group hover:border-brand-teal/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-teal transition-colors">
                            <FileText size={18} />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-xs mb-0.5">{file.name}</h4>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[8px] font-black uppercase tracking-widest text-slate-600">
                              <span>Size: {file.size || 'N/A'}</span>
                              <span>Project: {file.projectName}</span>
                              {file.uploaded_at && <span>Added: {new Date(file.uploaded_at).toLocaleDateString()}</span>}
                            </div>
                          </div>
                        </div>
                        <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-brand-teal transition-all">
                          <Download size={14} />
                        </a>
                      </div>
                    ))
                  )}
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
                        <div className="text-[7px] font-bold text-brand-teal uppercase tracking-widest">Active Node</div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 text-slate-600"><Lock size={12} /></button>
                  </div>
                  
                  <div className="flex-grow p-5 space-y-4 overflow-y-auto">
                    <div className="flex gap-3 max-w-sm">
                      <div className="w-7 h-7 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-[8px] font-black shrink-0">DP</div>
                      <div className="p-4 rounded-xl rounded-tl-none bg-white/5 border border-white/5 text-xs leading-relaxed text-slate-300">
                        Secure telemetry setup completed. Please upload project requirements and wireframes to the secure vault directly, or communicate here.
                      </div>
                    </div>

                    {missions.map(m => (m.activities || []).slice(0, 2).map((log, li) => (
                      <div key={log.id} className="flex gap-3 max-w-sm ml-auto flex-row-reverse">
                        <div className="w-7 h-7 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-[8px] font-black shrink-0">CL</div>
                        <div className="p-4 rounded-xl rounded-tr-none bg-brand-blue/5 border border-brand-blue/20 text-xs leading-relaxed text-slate-300">
                          {log.action_text} ({new Date(log.timestamp).toLocaleTimeString()})
                        </div>
                      </div>
                    )))}
                  </div>

                  <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    <form onSubmit={(e) => { e.preventDefault(); alert('Message sent through protected relay.'); }} className="flex gap-2">
                      <input type="text" placeholder="Encrypted message..." className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 text-xs text-white focus:outline-none focus:border-brand-teal/50" />
                      <button type="submit" className="p-3 bg-brand-teal text-text-primary rounded-lg shadow-glow-teal"><Send size={16} /></button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">Billing Ledger</h1>
                  <p className="text-slate-500 text-xs">Invoices and proposals.</p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setBillingView('invoices')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                      billingView === 'invoices'
                        ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal'
                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Invoices
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingView('proposals')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                      billingView === 'proposals'
                        ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal'
                        : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Proposals
                  </button>
                  {billingDocsLoading && (
                    <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-600">Loading…</span>
                  )}
                  {billingDocsError && (
                    <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-brand-red">{billingDocsError}</span>
                  )}
                </div>

                {billingView === 'invoices' ? (
                  <div className="glass border-white/5 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-[980px] w-full text-left">
                      <thead>
                        <tr className="bg-slate-950/60 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200 border-b border-white/10 sticky top-0 z-10 backdrop-blur">
                          <th className="px-6 py-4">Invoice</th>
                          <th className="px-6 py-4">Project</th>
                          <th className="px-6 py-4">Budget</th>
                          <th className="px-6 py-4">Issued</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {clientInvoices.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-10 text-center text-slate-400 text-sm">
                              No invoices yet.
                            </td>
                          </tr>
                        ) : (
                          clientInvoices.map((inv, idx) => {
                            const issued = inv.issued_at || inv.created_at;
                            const paymentLabel = invoicePaymentLabel(inv.status);
                            const showPayNow = canPayInvoice(inv.status);
                            return (
                              <tr key={`${inv._projectId}-${inv.id}`} className={`${idx % 2 === 0 ? 'bg-white/[0.01]' : ''} hover:bg-white/[0.04] transition-colors`}>
                                <td className="px-6 py-4 font-black text-white text-xs">{inv.number || `#${inv.id}`}</td>
                                <td className="px-6 py-4 text-slate-200 text-xs uppercase font-bold">{inv._projectTitle || inv.project}</td>
                                <td className="px-6 py-4 text-slate-200 text-xs font-bold">USD {valueToMoney(inv._projectValue)}</td>
                                <td className="px-6 py-4 text-slate-400 text-xs">{issued ? new Date(issued).toLocaleDateString() : '—'}</td>
                                <td className="px-6 py-4 font-black text-brand-teal text-xs">
                                  {(inv.currency || 'usd').toUpperCase()} {centsToMoney(inv.amount_total_cents)}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.14em] border ${
                                    paymentLabel === 'Paid'
                                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                      : 'bg-white/5 text-slate-200 border-white/10'
                                  }`}>
                                    {paymentLabel}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedInvoice(inv)}
                                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-white/10 transition-all"
                                    >
                                      View
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => window.open(`http://localhost:8000/api/client/projects/${inv._projectId}/invoices/${inv.id}/print/`, '_blank', 'noopener,noreferrer')}
                                      className="px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/25 text-xs font-black uppercase tracking-[0.14em] text-brand-teal hover:bg-brand-teal/15 transition-all"
                                    >
                                      Print
                                    </button>
                                    {showPayNow ? (
                                      <button
                                        type="button"
                                        onClick={() => router.push(`/contact?pay_invoice=${encodeURIComponent(inv.number || String(inv.id))}`)}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs font-black uppercase tracking-[0.14em] text-emerald-300 hover:bg-emerald-500/15 transition-all"
                                      >
                                        Pay Now
                                      </button>
                                    ) : null}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="glass border-white/5 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-[900px] w-full text-left">
                      <thead>
                        <tr className="bg-slate-950/60 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200 border-b border-white/10 sticky top-0 z-10 backdrop-blur">
                          <th className="px-6 py-4">Proposal</th>
                          <th className="px-6 py-4">Project</th>
                          <th className="px-6 py-4">Budget</th>
                          <th className="px-6 py-4">Sent</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {clientProposals.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-10 text-center text-slate-400 text-sm">
                              No proposals yet.
                            </td>
                          </tr>
                        ) : (
                          clientProposals.map((p, idx) => (
                            <tr key={`${p._projectId}-${p.id}`} className={`${idx % 2 === 0 ? 'bg-white/[0.01]' : ''} hover:bg-white/[0.04] transition-colors`}>
                              <td className="px-6 py-4 font-black text-white text-xs">{p.title || `#${p.id}`}</td>
                              <td className="px-6 py-4 text-slate-200 text-xs uppercase font-bold">{p._projectTitle || p.project}</td>
                              <td className="px-6 py-4 text-slate-200 text-xs font-bold">USD {valueToMoney(p._projectValue)}</td>
                              <td className="px-6 py-4 text-slate-400 text-xs">{p.sent_at ? new Date(p.sent_at).toLocaleDateString() : '—'}</td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.14em] bg-white/5 text-slate-200 border border-white/10">
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedProposal(p)}
                                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-white/10 transition-all"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      </table>
                    </div>
                  </div>
                )}
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
                        <input 
                          type="text" 
                          value={sysConfigName} 
                          onChange={(e) => setSysConfigName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-600 ml-2">Email Hook</label>
                        <input 
                          type="email" 
                          value={sysConfigEmail} 
                          onChange={(e) => setSysConfigEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50" 
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                      <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Account Specifications</div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Username ID:</span>
                        <span className="font-mono text-white">{currentUser.username}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">Role Status:</span>
                        <span className="text-white font-bold">{currentUser.is_staff ? 'Staff Member' : 'Associated Client'}</span>
                      </div>
                      {currentUser.date_joined && (
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">Established:</span>
                          <span className="text-white">{new Date(currentUser.date_joined).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => alert('Profile update relay initialized.')}
                      className="px-5 py-2 bg-brand-teal text-text-primary rounded-lg text-[9px] font-black uppercase tracking-widest shadow-glow-teal hover:-translate-y-0.5 transition-all"
                    >
                      Save System Config
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedMission && (() => {
          const stageSteps = ['Requirements', 'Architecture', 'Development', 'QA', 'Deployment', 'Complete'];
          const statusStageMap = { 'Requirements': 1, 'Architecture': 1, 'Dev': 2, 'QA': 3, 'Deploying': 4, 'Complete': 5 };
          const stageIdx = statusStageMap[selectedMission.stage] ?? 2;
          const milestones = selectedMission.milestones || [];
          const completedCount = milestones.filter(m => m.done).length;
          const logs = selectedMission.activities || [];
          const tech = selectedMission.tags || [];
          const deliverables = selectedMission.files || [];

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedMission(null)}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden border border-white/10 rounded-2xl bg-[#080f1e] shadow-2xl flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                  <div>
                    <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-0.5">{selectedMission.id} &bull; {selectedMission.priority || 'Standard'} Priority</div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">{selectedMission.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedMission(null)}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand-red/20 transition-all shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Stage Pipeline */}
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center mb-2">
                    {stageSteps.map((s, si) => (
                      <div key={s} className="flex items-center flex-1 min-w-0">
                        <div title={s} className={`shrink-0 w-2.5 h-2.5 rounded-full border-2 transition-all ${si < stageIdx ? 'bg-brand-teal border-brand-teal' : si === stageIdx ? 'bg-brand-teal/40 border-brand-teal animate-pulse' : 'bg-white/5 border-white/10'}`} />
                        {si < stageSteps.length - 1 && <div className={`flex-1 h-px ${si < stageIdx ? 'bg-brand-teal' : 'bg-white/10'}`} />}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    {stageSteps.map((s, si) => (
                      <span key={s} className={`text-[6px] font-black uppercase tracking-widest flex-1 text-center ${si === stageIdx ? 'text-brand-teal' : si < stageIdx ? 'text-slate-600' : 'text-slate-800'}`}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Modal Body */}
                <div className="flex-grow overflow-y-auto p-6">
                  <div className="grid md:grid-cols-[1fr_220px] gap-6">

                    {/* Left column */}
                    <div className="space-y-6">
                      {/* Brief */}
                      <section>
                        <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Terminal size={11} className="text-brand-teal" /> Project Brief
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed italic">"{selectedMission.description || 'No detailed brief provided.'}"</p>
                      </section>

                      {/* Milestones */}
                      {milestones.length > 0 && (
                        <section>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                              <CheckCircle2 size={11} className="text-brand-indigo" /> Milestones
                            </h4>
                            <span className="text-[8px] font-black text-brand-teal">{completedCount}/{milestones.length} Done</span>
                          </div>
                          <div className="space-y-2">
                            {milestones.map((m, mi) => (
                              <div key={mi} className={`flex items-center gap-3 p-3 rounded-xl border ${m.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                                {m.done
                                  ? <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                                  : <Clock size={13} className="text-slate-700 shrink-0" />}
                                <span className={`text-xs font-bold ${m.done ? 'text-slate-600 line-through' : 'text-white'}`}>{m.label}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Tech Stack */}
                      {tech.length > 0 && (
                        <section>
                          <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Cpu size={11} className="text-brand-red" /> Tech Stack
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {tech.map(t => (
                              <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-white uppercase tracking-widest">{t}</span>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Activity Log */}
                      {logs.length > 0 && (
                        <section>
                          <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Activity size={11} className="text-brand-indigo" /> Activity Log
                          </h4>
                          <div className="space-y-3 border-l border-white/5 ml-1.5 pl-4">
                            {logs.map((log) => (
                              <div key={log.id} className="relative">
                                <div className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal" />
                                <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-0.5">
                                  {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                                </div>
                                <div className="text-[10px] text-slate-400">{log.action_text}</div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-3">
                      {/* Status card */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-3">Project Status</div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                            <Zap size={18} />
                          </div>
                          <div>
                            <div className="text-xl font-black text-white">{selectedMission.progress}%</div>
                            <div className="text-[8px] font-black text-brand-teal uppercase tracking-widest">{selectedMission.stage}</div>
                          </div>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${selectedMission.progress}%` }}
                            className={`h-full rounded-full ${selectedMission.progress === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`} />
                        </div>
                        <div className="space-y-2.5 border-t border-white/5 pt-3">
                          {[
                            ['Deadline', selectedMission.deadline || 'Flexible'],
                            ['Investment', selectedMission.value ? `$${Number(selectedMission.value).toLocaleString()}` : '$0.00'],
                            ['Priority', selectedMission.priority]
                          ].map(([l, v]) => (
                            <div key={l} className="flex justify-between items-center">
                              <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">{l}</span>
                              <span className="text-[9px] font-bold text-white uppercase">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables */}
                      {deliverables.length > 0 && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-3">Deliverables</div>
                          <div className="space-y-2">
                            {deliverables.map((f) => (
                              <div key={f.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                                <FileText size={11} className="text-brand-teal shrink-0" />
                                <div className="flex-grow min-w-0">
                                  <div className="text-[8px] font-bold text-white truncate">{f.name}</div>
                                  <div className="text-[7px] text-slate-700">{f.size || 'N/A'}</div>
                                </div>
                                <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="p-1 rounded-md bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white transition-all shrink-0">
                                  <Download size={10} />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA buttons */}
                      <button
                        onClick={() => { setActiveTab('comms'); setSelectedMission(null); }}
                        className="w-full py-3 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-[9px] shadow-glow-teal hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                      >
                        Secure Channel <MessageSquare size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-2">
                  <Shield size={10} className="text-brand-teal" />
                  <span className="text-[7px] font-black text-slate-700 uppercase tracking-[0.3em]">Protected Engineering Protocol</span>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Invoice Viewer Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvoice(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden border border-white/10 rounded-2xl bg-[#080f1e] shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                <div className="min-w-0">
                  <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-0.5 truncate">
                    {selectedInvoice._projectTitle || 'Project'} &bull; {selectedInvoice.number || `#${selectedInvoice.id}`}
                  </div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">Invoice</h2>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand-red/20 transition-all shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-2">Status</div>
                    <div className="text-xs font-black text-white uppercase tracking-widest">{invoicePaymentLabel(selectedInvoice.status)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-2">Issued</div>
                    <div className="text-xs font-black text-white uppercase tracking-widest">
                      {selectedInvoice.issued_at ? new Date(selectedInvoice.issued_at).toLocaleDateString() : '—'}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-2">Total</div>
                    <div className="text-xs font-black text-brand-teal uppercase tracking-widest">
                      {(selectedInvoice.currency || 'usd').toUpperCase()} {centsToMoney(selectedInvoice.amount_total_cents)}
                    </div>
                  </div>
                </div>

                {selectedInvoice.notes ? (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Notes</div>
                    <div className="text-xs text-slate-300 whitespace-pre-wrap">{selectedInvoice.notes}</div>
                  </div>
                ) : null}

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3">Items</div>
                  {(selectedInvoice.items || []).length === 0 ? (
                    <div className="text-xs text-slate-500">No items.</div>
                  ) : (
                    <div className="space-y-2">
                      {(selectedInvoice.items || []).map((it) => (
                        <div key={it.id} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="min-w-0">
                            <div className="text-xs font-black text-white">{it.description}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-1">
                              Qty {it.quantity} &bull; {(selectedInvoice.currency || 'usd').toUpperCase()} {centsToMoney(it.unit_amount_cents)} each
                            </div>
                          </div>
                          <div className="text-xs font-black text-brand-teal shrink-0">
                            {(selectedInvoice.currency || 'usd').toUpperCase()} {centsToMoney(it.amount_cents)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => window.open(`http://localhost:8000/api/client/projects/${selectedInvoice._projectId}/invoices/${selectedInvoice.id}/print/`, '_blank', 'noopener,noreferrer')}
                  className="px-4 py-2 bg-brand-teal/10 border border-brand-teal/20 text-brand-teal rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-teal/15 transition-all"
                >
                  Print
                </button>
                {canPayInvoice(selectedInvoice.status) ? (
                  <button
                    type="button"
                    onClick={() => router.push(`/contact?pay_invoice=${encodeURIComponent(selectedInvoice.number || String(selectedInvoice.id))}`)}
                    className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500/15 transition-all"
                  >
                    Pay Now
                  </button>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proposal Viewer Modal */}
      <AnimatePresence>
        {selectedProposal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProposal(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden border border-white/10 rounded-2xl bg-[#080f1e] shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                <div className="min-w-0">
                  <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-0.5 truncate">
                    {selectedProposal._projectTitle || 'Project'} &bull; #{selectedProposal.id}
                  </div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tight truncate">{selectedProposal.title || 'Proposal'}</h2>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-1">
                    {selectedProposal.status}{selectedProposal.sent_at ? ` • sent ${new Date(selectedProposal.sent_at).toLocaleDateString()}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand-red/20 transition-all shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6">
                <div className="prose prose-invert max-w-none prose-a:text-brand-teal prose-strong:text-white prose-p:text-slate-300">
                  <ReactMarkdown>{selectedProposal.body_md || ''}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
