import Link from "next/link";
import { Zap, Download, MessageSquare, DollarSign, Clock, Upload, Trash2, Plus, User, CheckCircle } from "lucide-react"; // Fixed: Added User import and CheckCircle
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// --- HELPERS ---
function formatBytes(bytes) {
    const n = Number(bytes);
    if (!Number.isFinite(n) || n <= 0) return '—';
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

// --- SUB-COMPONENTS ---
function ClientInformation({ project, isAdmin }) {
    const client = project?.client;

    const [currentTime, setCurrentTime] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = useMemo(() => {
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        if (isAdmin && client?.timezone) {
            try { return currentTime.toLocaleTimeString([], { ...options, timeZone: client.timezone }); }
            catch (e) { console.error("Invalid timezone layout string provided:", client.timezone); }
        }
        return currentTime.toLocaleTimeString([], options);
    }, [currentTime, isAdmin, client?.timezone]);

    if (!client) return null;

    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <div>
                <div className="text-xs font-black text-muted uppercase tracking-widest mb-1.5">
                    Client Details
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0 relative overflow-hidden">
                        {client?.avatar ? (
                            <img src={client.avatar} alt="Client Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User size={16} />
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-black text-white tracking-tight truncate">
                            {client?.name || 'Anonymous Client'}
                        </div>
                        <div className="text-[11px] font-black text-brand-teal uppercase tracking-widest truncate">
                            {client?.country || 'Global'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Time Display */}
            <div className="pt-2.5 border-t border-white/5">
                <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-black text-muted uppercase tracking-widest">Current Time</div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-brand-teal" />
                        <span className="text-xs font-bold text-white tabular-nums">{timeString}</span>
                    </div>
                </div>
                {isAdmin && client?.timezone && (
                    <div className="text-[11px] font-black text-right text-brand-teal uppercase tracking-widest truncate max-w-[180px]">{client.timezone}</div>
                )}
            </div>
        </div>
    );
}


function ProjectStatusCard({ project }) {
    return (
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between h-[105px]">
            <div className="space-y-1">
                <div className="text-[10px] font-black text-muted uppercase tracking-widest">
                    Project Status
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                        <Zap size={14} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-base font-black text-white tracking-tight leading-none">
                            {project?.progress || 0}%
                        </div>
                        <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest truncate mt-0.5">
                            {project?.stage || 'Discovery'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project?.progress || 0}%` }}
                        className={`h-full rounded-full ${(project?.progress || 0) === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`}
                    />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-muted uppercase tracking-wider">
                    <span>Priority:</span>
                    <span className="text-white truncate max-w-[60px] text-right">{project?.priority || 'Standard'}</span>
                </div>
            </div>
        </div>
    );
}

function PaymentStatusCard({ project, clientInvoices = [] }) {
    const totalBudget = Number(project?.value || 0);

    const paidAmount = useMemo(() => {
        return clientInvoices.reduce((sum, inv) => {
            if (inv.status === 'paid') {
                const amt = inv.amount ?? (inv.amount_total_cents ? inv.amount_total_cents / 100 : 0);
                return sum + Number(amt);
            }
            return sum;
        }, 0);
    }, [clientInvoices]);

    const duePercentage = totalBudget > 0 ? Math.min(Math.round((paidAmount / totalBudget) * 100), 100) : 0;

    return (
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between h-[105px]">
            <div className="space-y-1">
                <div className="text-[10px] font-black text-muted uppercase tracking-widest">
                    Payment Status
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                        <DollarSign size={14} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-base font-black text-white tracking-tight leading-none">
                            {duePercentage}%
                        </div>
                        <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest mt-0.5">
                            Paid
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${duePercentage}%` }}
                        className={`h-full rounded-full ${duePercentage === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`}
                    />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-muted uppercase tracking-wider">
                    <span>Total:</span>
                    <span className="text-white text-right">${totalBudget.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

function GeneralDetailsCard({ project, clientInvoices = [], clientProposals = [], isAdmin, onAddInvoice, onAddProposal }) {
    const [timeLeft, setTimeLeft] = useState(null);

    const pendingInvoices = useMemo(() => clientInvoices.filter(inv => inv.status !== 'paid' && inv.status !== 'void'), [clientInvoices]);
    const pendingProposals = useMemo(() => clientProposals.filter(prop => prop.status === 'sent'), [clientProposals]);
    const latestInvoice = pendingInvoices[0];

    useEffect(() => {
        if (!project?.deadline) {
            setTimeLeft(null);
            return;
        }
        const deadlineDate = new Date(project.deadline);
        if (isNaN(deadlineDate.getTime())) {
            setTimeLeft(null);
            return;
        }

        const updateCountdown = () => {
            const now = new Date();
            const diff = deadlineDate - now;
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true });
                return true;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
                isOverdue: false
            });
            return false;
        };

        const shouldStop = updateCountdown();
        if (shouldStop) return;

        const timer = setInterval(() => {
            const stop = updateCountdown();
            if (stop) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [project?.deadline]);

    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            {/* Deadline Tracking */}
            <div className="flex flex-col gap-1.5 pb-2.5 border-b border-white/5">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-muted uppercase tracking-widest">Due On</span>
                    <span className="text-xs font-bold text-white uppercase tracking-wide truncate">{project?.deadline || 'Flexible'}</span>
                </div>
                {timeLeft && (
                    <div className={`flex items-center justify-center gap-2 p-1.5 rounded-lg ${timeLeft.isOverdue ? 'bg-brand-red/10 border border-brand-red/30' : 'bg-white/5'}`}>
                        {timeLeft.isOverdue ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-red py-0.5">Overdue</span>
                        ) : (
                            <div className="flex items-center gap-1.5 text-white font-black text-xs tabular-nums">
                                <span>{timeLeft.days}d</span><span className="text-muted font-normal">:</span>
                                <span>{String(timeLeft.hours).padStart(2, '0')}h</span><span className="text-muted font-normal">:</span>
                                <span>{String(timeLeft.minutes).padStart(2, '0')}m</span><span className="text-muted font-normal">:</span>
                                <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Financial Actions */}
            <div className="space-y-2 text-xs font-black uppercase tracking-widest text-muted">
                <div className="flex items-center justify-between">
                    <span>Invoices Pending</span>
                    <div className="flex items-center gap-2">
                        <span className="text-brand-teal">{pendingInvoices.length}</span>
                        {isAdmin && onAddInvoice && (
                            <button onClick={onAddInvoice} className="p-1 rounded-lg bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white transition-all"><Plus size={12} /></button>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span>Proposals Pending</span>
                    <div className="flex items-center gap-2">
                        <span className="text-brand-teal">{pendingProposals.length}</span>
                        {isAdmin && onAddProposal && (
                            <button onClick={onAddProposal} className="p-1 rounded-lg bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white transition-all"><Plus size={12} /></button>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Statement Display */}
            {latestInvoice && (
                <div className="pt-2 border-t border-white/5">
                    <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-1.5">Latest Active Invoice</div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-xs font-bold text-white truncate max-w-[140px]">
                            {latestInvoice.id ? `Invoice #${latestInvoice.id}` : 'Draft Invoice'}
                        </span>
                        <span className="text-xs font-black text-brand-teal">
                            ${Number(latestInvoice.amount ?? (latestInvoice.amount_total_cents ? latestInvoice.amount_total_cents / 100 : 0)).toLocaleString()}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

function DeliverablesCard({ files = [], isAdmin = false, onUpload, onDelete }) {
    const fileInputRef = useRef(null);
    const [fileUploading, setFileUploading] = useState(false);

    const handleFileSelected = useCallback(async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file || !onUpload) return;

        setFileUploading(true);
        try { await onUpload(file); } catch (err) { console.error(err); } finally { setFileUploading(false); }
    }, [onUpload]);

    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-black text-muted uppercase tracking-widest">Deliverables</div>
                {isAdmin && (
                    <>
                        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={fileUploading}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50"
                        >
                            {fileUploading ? <div className="w-3.5 h-3.5 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" /> : <Upload size={12} />}
                            Upload
                        </button>
                    </>
                )}
            </div>

            {files.length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                    {files.map((f) => (
                        <div key={f.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.01] border border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                                <span className="text-[10px] font-black uppercase">
                                    {f.name?.split('.').pop()?.slice(0, 3).toUpperCase() || 'FILE'}
                                </span>
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="text-xs font-bold text-white truncate">{f.name}</div>
                                <div className="text-[10px] font-bold text-muted mt-0.5">{formatBytes(f.size)}</div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 text-muted hover:text-white hover:bg-white/10 transition-all" title="Download"><Download size={14} /></a>
                                {isAdmin && onDelete && (
                                    <button onClick={() => onDelete(f.id)} className="p-1.5 rounded-lg bg-white/5 text-muted hover:text-brand-red hover:bg-brand-red/10 transition-all" title="Delete"><Trash2 size={14} /></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-4 bg-white/[0.01] rounded-xl border border-dashed border-white/5">
                    <div className="text-xs text-muted font-bold">No files uploaded yet</div>
                </div>
            )}
        </div>
    );
}



function SecureChannelCTA() {
    return (
        <Link
            href="/dashboard/comms"
            className="w-full py-2.5 bg-brand-teal text-primary rounded-xl font-black uppercase tracking-widest text-xs shadow-glow-teal hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
            Secure Channel <MessageSquare size={12} />
        </Link>
    );
}

// --- MAIN WRAPPER CONTAINER ---

export default function ProjectSidebar({
    project,
    clientInvoices = [],
    clientProposals = [],
    files = [],
    isAdmin = false,
    onUpload,
    onDelete,
    onAddInvoice,
    onAddProposal,
    onCancelProject,
    onCompleteProject,
    onEditProject,
}) {
    return (
        <div className="space-y-3 w-full max-w-[340px]">
            {/* Fixed: Corrected project prop reference passing contract */}

            {/* Unified Metrics Top Row */}
            <div className="grid grid-cols-2 gap-2">
                <ProjectStatusCard project={project} />
                <PaymentStatusCard project={project} clientInvoices={clientInvoices} />
            </div>

            {/* General Operations Panel */}
            <GeneralDetailsCard
                project={project}
                clientInvoices={clientInvoices}
                clientProposals={clientProposals}
                isAdmin={isAdmin}
                onAddInvoice={onAddInvoice}
                onAddProposal={onAddProposal}
            />

            {/* Deliverables Manager */}
            <DeliverablesCard files={files} isAdmin={isAdmin} onUpload={onUpload} onDelete={onDelete} />

            <ClientInformation project={project} isAdmin={isAdmin} />

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
                {isAdmin && ( // Admin specific buttons
                    <div className="flex gap-2">
                        {onEditProject && (
                            <button
                                onClick={onEditProject}
                                className="flex-1 py-2.5 bg-brand-indigo/10 text-brand-indigo rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                Edit Project <Edit size={12} />
                            </button>
                        )}
                        {onCompleteProject && (
                            <button
                                onClick={onCompleteProject}
                                disabled={project?.status === 'cancelled' || project?.status === 'completed'}
                                className={`flex-1 py-2.5 text-emerald-500 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-2
                                    ${project?.status === 'completed'
                                        ? 'bg-emerald-500/10 opacity-50 cursor-not-allowed'
                                        : project?.status === 'cancelled'
                                            ? 'bg-emerald-500/10 opacity-50 cursor-not-allowed'
                                            : 'bg-emerald-500/10 hover:-translate-y-0.5 transition-all'
                                    }`}
                            >
                                {project?.status === 'completed' ? 'Completed' : 'Complete'} <CheckCircle size={12} />
                            </button>
                        )}
                    </div>
                )}
                {onCancelProject && project?.status !== 'cancelled' && project?.status !== 'completed' && ( // Client or Admin cancel button
                    <button
                        onClick={onCancelProject}
                        className="w-full py-2.5 bg-brand-red/10 text-brand-red rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        Cancel Project <Trash2 size={12} />
                    </button>
                )}
                {project?.status === 'cancelled' && (
                    <div className="w-full py-2.5 bg-brand-red/10 text-brand-red rounded-xl font-black uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                        Cancelled <Trash2 size={12} />
                    </div>
                )}
            </div>

            {/* Call to Actions */}
            <SecureChannelCTA />
        </div>
    );
}