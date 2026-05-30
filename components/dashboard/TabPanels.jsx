import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Box,
    FileText,
    Download,
    ChevronRight,
    CheckCircle2,
    Clock,
    CreditCard,
} from 'lucide-react';
import Communications from './Communications';
import Settings from './Settings';

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

const bytesToMB = (bytes) => {
    const value = Number(bytes || 0) / (1024 * 1024);
    return value.toFixed(2);
};

function ProjectsTab({
    filteredProjects,
    totalInvestment,
    activeProjectsCount,
    deliverablesCount,
    searchQuery,
}) {
    return (
        <motion.div key="projects" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">My Projects</h1>
                    <p className="text-muted text-xs">Track your active projects and deliverables.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/contact" className="px-5 py-2 bg-brand-teal text-primary rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-glow-teal hover:-translate-y-0.5 transition-all">
                        Request New Project <Zap size={12} />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Invested', value: `$${totalInvestment.toLocaleString()}`, icon: <CreditCard className="text-brand-teal" />, sub: 'Aggregated project value' },
                    { label: 'Active Projects', value: String(activeProjectsCount), icon: <Zap className="text-brand-red" />, sub: 'In Development / QA' },
                    { label: 'Secure Deliverables', value: String(deliverablesCount), icon: <Box className="text-brand-indigo" />, sub: 'Files in vault' },
                ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-xl glass border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            {React.cloneElement(stat.icon, { size: 24 })}
                        </div>
                        <div className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                        <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                        <div className="text-[9px] font-bold text-brand-teal">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                {filteredProjects.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-xl text-muted text-sm">
                        No active projects matching your query.
                    </div>
                ) : (
                    filteredProjects.map((project) => {
                        const statusStageMap = { Requirements: 1, Architecture: 1, Dev: 2, QA: 3, Deploying: 4, Complete: 5 };
                        const stageIdx = statusStageMap[project.stage] ?? 2;
                        const milestones = project.milestones || [];
                        const projectTags = project.tags || [];

                        return (
                            <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
                                <div className="rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-teal/20 transition-all group overflow-hidden cursor-pointer">
                                    <div className="p-5">
                                        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                                            <div className="lg:w-[38%]">
                                                <div className="text-[9px] font-black text-brand-teal uppercase tracking-widest mb-1">{project.id}</div>
                                                <h3 className="text-sm font-black text-white group-hover:text-brand-teal transition-colors mb-2 uppercase leading-tight">{project.title}</h3>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[7px] font-black text-muted uppercase tracking-widest">{project.priority || 'Standard'} Priority</span>
                                                    {projectTags.slice(0, 3).map((tag) => (
                                                        <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[7px] font-black text-secondary uppercase tracking-widest">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex-grow">
                                                <div className="hidden md:flex items-center mb-2">
                                                    {['Requirements', 'Architecture', 'Development', 'QA', 'Deployment', 'Complete'].map((s, si, arr) => (
                                                        <div key={s} className="flex items-center flex-1 min-w-0">
                                                            <div className={`shrink-0 w-2.5 h-2.5 rounded-full border-2 ${si < stageIdx ? 'bg-brand-teal border-brand-teal' : si === stageIdx ? 'bg-brand-teal/30 border-brand-teal animate-pulse' : 'bg-white/5 border-white/10'}`} />
                                                            {si < arr.length - 1 && <div className={`flex-1 h-px ${si < stageIdx ? 'bg-brand-teal' : 'bg-white/10'}`} />}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between mb-1.5">
                                                    <span className="text-[8px] font-black text-brand-teal uppercase tracking-widest">Stage: {project.stage}</span>
                                                    <span className="text-[8px] font-black text-white">{project.progress}%</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`} />
                                                </div>
                                            </div>

                                            <div className="lg:w-36 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2">
                                                <div className="text-right">
                                                    <div className="text-xs font-black text-brand-teal">${Number(project.value || 0).toLocaleString()}</div>
                                                    <div className="text-[8px] text-muted font-bold uppercase tracking-widest">Deadline: {project.deadline || 'Flexible'}</div>
                                                </div>
                                                <button
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-primary rounded-lg text-[8px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Details <ChevronRight size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {milestones.length > 0 && (
                                        <div className="border-t border-white/5 px-5 py-3 flex gap-2 overflow-x-auto bg-white/[0.01]">
                                            {milestones.slice(0, 5).map((m, mi) => (
                                                <div key={mi} className={`flex items-center gap-1.5 shrink-0 text-[7px] font-black uppercase tracking-widest ${m.done ? 'text-emerald-400' : 'text-dim'}`}>
                                                    {m.done ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                                    {m.label}
                                                    {mi < milestones.slice(0, 5).length - 1 && <span className="ml-1 text-slate-800">›</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
}

function VaultTab({ vaultFiles }) {
    return (
        <motion.div key="vault" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="mb-6">
                <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">Secure Vault</h1>
                <p className="text-muted text-xs">Encrypted storage for briefings and project deliverables.</p>
            </div>

            <div className="grid gap-2">
                {vaultFiles.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-xl text-muted text-sm">
                        No files stored in this vault workspace.
                    </div>
                ) : (
                    vaultFiles.map((file, i) => (
                        <div key={i} className="p-4 rounded-xl glass border border-white/5 flex items-center justify-between group hover:border-brand-teal/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-muted group-hover:text-brand-teal transition-colors">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-0.5">{file.name}</h4>
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] font-black uppercase tracking-widest text-secondary">
                                        <span>Size: {bytesToMB(file.size)} MB</span>
                                        <span>Project: {file.projectName}</span>
                                        {file.uploaded_at && <span>Added: {new Date(file.uploaded_at).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                            </div>
                            <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 text-muted hover:text-white hover:bg-brand-teal transition-all">
                                <Download size={14} />
                            </a>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
}

function BillingTab({
    billingNotice,
    billingView,
    setBillingView,
    clientInvoices,
    clientProposals,
    billingDocsLoading,
    billingDocsError,
    onViewInvoice,
    onPrintInvoice,
    onPayInvoice,
    onViewProposal,
}) {
    const pendingCount = clientProposals.filter((p) => p.status === 'sent').length;

    return (
        <motion.div key="billing" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="mb-6">
                <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">Billing Ledger</h1>
                <p className="text-muted text-xs">Invoices and proposals.</p>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setBillingView('invoices')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${billingView === 'invoices'
                        ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal'
                        : 'bg-white/5 border-white/10 text-muted hover:text-white hover:bg-white/10'}
        `}
                >
                    Invoices
                    {clientInvoices.filter((inv) => inv.status !== 'paid' && inv.status !== 'void').length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[8px] font-black bg-brand-teal/20 text-brand-teal border border-brand-teal/30 animate-pulse">
                            {clientInvoices.filter((inv) => inv.status !== 'paid' && inv.status !== 'void').length}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setBillingView('proposals')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${billingView === 'proposals'
                        ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal'
                        : 'bg-white/5 border-white/10 text-muted hover:text-white hover:bg-white/10'}
        `}
                >
                    Proposals
                    {pendingCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[8px] font-black bg-brand-teal/20 text-brand-teal border border-brand-teal/30 animate-pulse">
                            {pendingCount}
                        </span>
                    )}
                </button>
                {billingDocsLoading && <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted">Loading…</span>}
                {billingDocsError && <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-brand-red">{billingDocsError}</span>}
            </div>

            {billingView === 'invoices' ? (
                <div className="glass border-white/5 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-[980px] w-full text-left">
                            <thead>
                                <tr className="bg-slate-950/60 text-[10px] font-black uppercase tracking-[0.16em] text-primary border-b border-white/10 sticky top-0 z-10 backdrop-blur">
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
                                        <td colSpan="7" className="px-6 py-10 text-center text-secondary text-sm">
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
                                                <td className="px-6 py-4 text-primary text-xs uppercase font-bold">{inv._projectTitle || inv.project}</td>
                                                <td className="px-6 py-4 text-primary text-xs font-bold">USD {valueToMoney(inv._projectValue)}</td>
                                                <td className="px-6 py-4 text-secondary text-xs">{issued ? new Date(issued).toLocaleDateString() : '—'}</td>
                                                <td className="px-6 py-4 font-black text-brand-teal text-xs">{(inv.currency || 'usd').toUpperCase()} {centsToMoney(inv.amount_total_cents)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.14em] border ${paymentLabel === 'Paid'
                                                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                                        : 'bg-white/5 text-primary border-white/10'}`}>
                                                        {paymentLabel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => onViewInvoice(inv)}
                                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-white/10 transition-all"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => onPrintInvoice(inv)}
                                                            className="px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/25 text-xs font-black uppercase tracking-[0.14em] text-brand-teal hover:bg-brand-teal/15 transition-all"
                                                        >
                                                            Print
                                                        </button>
                                                        {showPayNow ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => onPayInvoice(inv)}
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
                <>
                    {pendingCount > 0 && (
                        <div className="mb-4 p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 text-amber-200">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="font-black uppercase tracking-widest text-[10px] mb-1">Awaiting Your Approval</div>
                                    <div className="text-xs">{pendingCount} {pendingCount === 1 ? 'proposal' : 'proposals'} awaiting your response.</div>
                                </div>
                                <span className="px-3 py-1 rounded-lg bg-amber-500 text-amber-950 font-black uppercase tracking-widest text-[9px] whitespace-nowrap">{pendingCount}</span>
                            </div>
                        </div>
                    )}
                    <div className="glass border-white/5 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-[900px] w-full text-left">
                                <thead>
                                    <tr className="bg-slate-950/60 text-[10px] font-black uppercase tracking-[0.16em] text-primary border-b border-white/10 sticky top-0 z-10 backdrop-blur">
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
                                            <td colSpan="6" className="px-6 py-10 text-center text-secondary text-sm">No proposals yet.</td>
                                        </tr>
                                    ) : (
                                        clientProposals.map((p, idx) => (
                                            <tr key={`${p._projectId}-${p.id}`} className={`${idx % 2 === 0 ? 'bg-white/[0.01]' : ''} hover:bg-white/[0.04] transition-colors`}>
                                                <td className="px-6 py-4 font-black text-white text-xs">{p.title || `#${p.id}`}</td>
                                                <td className="px-6 py-4 text-primary text-xs uppercase font-bold">{p._projectTitle || p.project}</td>
                                                <td className="px-6 py-4 text-primary text-xs font-bold">USD {valueToMoney(p._projectValue)}</td>
                                                <td className="px-6 py-4 text-secondary text-xs">{p.sent_at ? new Date(p.sent_at).toLocaleDateString() : '—'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.14em] border ${p.status === 'draft' ? 'bg-slate-500/10 text-slate-300 border-slate-500/20' : p.status === 'sent' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : p.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : p.status === 'rejected' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-white/5 text-primary border-white/10'}`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => onViewProposal(p)}
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
                </>
            )}
        </motion.div>
    );
}



export default function DashboardTabPanels(props) {
    return (
        <AnimatePresence mode="wait">
            {props.activeTab === 'projects' && (
                <div className="h-full overflow-y-auto">
                    <ProjectsTab
                        filteredProjects={props.filteredProjects}
                        totalInvestment={props.totalInvestment}
                        activeProjectsCount={props.activeProjectsCount}
                        deliverablesCount={props.deliverablesCount}
                        searchQuery={props.searchQuery}
                    />
                </div>
            )}
            {props.activeTab === 'vault' && (
                <div className="h-full overflow-y-auto">
                    <VaultTab vaultFiles={props.vaultFiles} />
                </div>
            )}
            {props.activeTab === 'comms' && (
                <Communications missions={props.projects} />
            )}
            {props.activeTab === 'billing' && (
                <div className="h-full overflow-y-auto">
                    <BillingTab
                        billingNotice={props.billingNotice}
                        billingView={props.billingView}
                        setBillingView={props.setBillingView}
                        clientInvoices={props.clientInvoices}
                        clientProposals={props.clientProposals}
                        billingDocsLoading={props.billingDocsLoading}
                        billingDocsError={props.billingDocsError}
                        onViewInvoice={props.onViewInvoice}
                        onPrintInvoice={props.onPrintInvoice}
                        onPayInvoice={props.onPayInvoice}
                        onViewProposal={props.onViewProposal}
                    />
                </div>
            )}
            {props.activeTab === 'settings' && (
                <div className="h-full overflow-y-auto">
                    <Settings
                        currentUser={props.currentUser}
                        userInitials={props.userInitials}
                        settingsView={props.settingsView}
                        setSettingsView={props.setSettingsView}
                        firstName={props.firstName}
                        setFirstName={props.setFirstName}
                        lastName={props.lastName}
                        setLastName={props.setLastName}
                        username={props.username}
                        setUsername={props.setUsername}
                        email={props.email}
                        setEmail={props.setEmail}
                        handleSaveSettings={props.handleSaveSettings}
                        isSaving={props.isSaving}
                        saveSuccess={props.saveSuccess}
                        handleAvatarChange={props.handleAvatarChange}
                        usernameStatus={props.usernameStatus}
                        usernameCheckLoading={props.usernameCheckLoading}
                    />
                </div>
            )}
        </AnimatePresence>
    );
}
