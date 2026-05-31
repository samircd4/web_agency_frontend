import Link from "next/link";
import { Zap, FileText, Download, MessageSquare, DollarSign, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function ProjectStatusCard({ project }) {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!project.deadline) {
            setTimeLeft(null);
            return;
        }

        let deadlineDate;
        try {
            deadlineDate = new Date(project.deadline);
            if (isNaN(deadlineDate.getTime())) {
                setTimeLeft(null);
                return;
            }
        } catch {
            setTimeLeft(null);
            return;
        }

        const updateCountdown = () => {
            const now = new Date();
            const diff = deadlineDate - now;

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds, isOverdue: false });
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, [project.deadline]);

    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <div>
                <div className="text-xs font-black text-muted uppercase tracking-widest mb-1.5">
                    Project Status
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                        <Zap size={16} />
                    </div>
                    <div>
                        <div className="text-xl font-black text-white tracking-tight">{project.progress}%</div>
                        <div className="text-xs font-black text-brand-teal uppercase tracking-widest">
                            {project.stage}
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`}
                />
            </div>

            <div className="space-y-2.5 border-t border-white/5 pt-2.5">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-muted uppercase tracking-widest">
                            Due On
                        </span>
                        <span className="text-xs font-bold text-white uppercase tracking-wide truncate">
                            {project.deadline || 'Flexible'}
                        </span>
                    </div>
                    {timeLeft && (
                        <div className={`flex items-center justify-center gap-2 p-2 rounded-lg ${timeLeft.isOverdue ? 'bg-brand-red/10 border border-brand-red/30' : 'bg-white/5'}`}>
                            {timeLeft.isOverdue ? (
                                <span className="text-[11px] font-black uppercase tracking-widest text-brand-red">Overdue</span>
                            ) : (
                                <>
                                    {timeLeft.days > 0 && (
                                        <div className="flex flex-col items-center min-w-[32px]">
                                            <span className="text-[13px] font-black text-white">{timeLeft.days}</span>
                                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Days</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col items-center min-w-[28px]">
                                        <span className="text-[13px] font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Hrs</span>
                                    </div>
                                    <span className="text-[11px] font-black text-muted -translate-y-[6px]">:</span>
                                    <div className="flex flex-col items-center min-w-[28px]">
                                        <span className="text-[13px] font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Min</span>
                                    </div>
                                    <span className="text-[11px] font-black text-muted -translate-y-[6px]">:</span>
                                    <div className="flex flex-col items-center min-w-[28px]">
                                        <span className="text-[13px] font-black text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Sec</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-muted uppercase tracking-widest">
                        Investment
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                        ${Number(project.value || 0).toLocaleString()}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-muted uppercase tracking-widest">
                        Priority
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                        {project.priority || 'Standard'}
                    </span>
                </div>
            </div>
        </div>
    );
}

function TimeInfoCard({ isAdmin, clientTimezone }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <div>
                <div className="text-xs font-black text-muted uppercase tracking-widest mb-1.5">
                    {isAdmin ? "Client Timezone" : "System Time"}
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                        <Clock size={16} />
                    </div>
                    <div>
                        <div className="text-xl font-black text-white tracking-tight">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        {isAdmin && (
                            <div className="text-xs font-black text-brand-teal uppercase tracking-widest">
                                {clientTimezone || "Unknown"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentStatusCard({ project, clientInvoices, clientProposals }) {
    const pendingInvoices = clientInvoices.filter(inv => inv.status !== 'paid' && inv.status !== 'void');
    const pendingProposals = clientProposals.filter(prop => prop.status === 'sent');
    const totalBudget = Number(project.value || 0);
    // Calculate paid amount from invoices - assuming invoice amount is in dollars (same as budget)
    const paidAmount = clientInvoices.reduce((sum, inv) => {
        if (inv.status === 'paid') {
            return sum + Number(inv.amount || inv.amount_total_cents ? (inv.amount_total_cents / 100) : 0);
        }
        return sum;
    }, 0);
    const duePercentage = totalBudget > 0 ? Math.round((paidAmount / totalBudget) * 100) : 0;

    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <div>
                <div className="text-xs font-black text-muted uppercase tracking-widest mb-1.5">
                    Payment Status
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                        <DollarSign size={16} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="text-xl font-black text-white tracking-tight">{duePercentage}%</div>
                                <div className="text-xs font-black text-brand-teal uppercase tracking-widest">
                                    Paid
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[11px] font-bold text-white">${paidAmount.toLocaleString()}</div>
                                <div className="text-[11px] font-black text-muted uppercase tracking-widest">
                                    of ${totalBudget.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${duePercentage}%` }}
                    className={`h-full rounded-full ${duePercentage === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`}
                />
            </div>

            <div className="space-y-2.5 border-t border-white/5 pt-2.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-muted uppercase tracking-widest">
                        Pending Invoices
                    </span>
                    <span className="text-xs font-black text-brand-teal">
                        {pendingInvoices.length}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-muted uppercase tracking-widest">
                        Pending Proposals
                    </span>
                    <span className="text-xs font-black text-brand-teal">
                        {pendingProposals.length}
                    </span>
                </div>
            </div>

            {pendingInvoices.length > 0 && (
                <div className="pt-2.5 border-t border-white/5">
                    <div className="text-xs font-black text-muted uppercase tracking-widest mb-1.5">
                        Latest Invoice
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <div className="text-xs font-bold text-white truncate">
                            {pendingInvoices[0].id ? `Invoice #${pendingInvoices[0].id}` : 'New Invoice'}
                        </div>
                        <div className="text-[11px] text-muted mt-0.5">
                            ${Number(pendingInvoices[0].amount || pendingInvoices[0].amount_total_cents ? (pendingInvoices[0].amount_total_cents / 100) : 0).toLocaleString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DeliverablesCard({ files }) {
    if (!files || files.length === 0) return null;

    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs font-black text-muted uppercase tracking-widest mb-2.5">
                Deliverables
            </div>
            <div className="space-y-2">
                {files.map((f) => (
                    <div
                        key={f.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5"
                    >
                        <FileText size={12} className="text-brand-teal shrink-0" />
                        <div className="flex-grow min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                                {f.name}
                            </div>
                            <div className="text-[11px] text-muted mt-0.5">
                                {f.size ? `${(Number(f.size) / (1024 * 1024)).toFixed(2)} MB` : '—'}
                            </div>
                        </div>
                        <a
                            href={f.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white transition-all shrink-0"
                        >
                            <Download size={10} />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SecureChannelCTA() {
    return (
        <Link
            href="/dashboard?tab=comms"
            className="w-full py-2.5 bg-brand-teal text-primary rounded-xl font-black uppercase tracking-widest text-xs shadow-glow-teal hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
            Secure Channel <MessageSquare size={12} />
        </Link>
    );
}

export default function ProjectSidebar({ project, clientInvoices, clientProposals, files, isAdmin = false }) {
    return (
        <div className="space-y-3">
            <ProjectStatusCard project={project} />
            <PaymentStatusCard project={project} clientInvoices={clientInvoices} clientProposals={clientProposals} />
            <DeliverablesCard files={files} />
            <TimeInfoCard isAdmin={isAdmin} clientTimezone={project?.client?.timezone} />
            <SecureChannelCTA />
        </div>
    );
}
