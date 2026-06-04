'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, FileText, Landmark, Clock, FileCheck2, Loader2, AlertCircle,
    Search, Plus, Eye, CheckCircle2, RefreshCw, Printer, Trash2, Send, XCircle, PlusCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import AdminModal from '@/components/AdminModal';
import ConfirmDangerModal from '@/components/ConfirmDangerModal';

const getApiBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;
    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host === "drpythonsolutions.com" || host === "www.drpythonsolutions.com") {
            return "https://api.drpythonsolutions.com";
        }
    }
    return "http://localhost:8000";
};
const API_BASE_URL = getApiBaseUrl().replace(/\/$/, "");

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

export default function AdminBillingDashboard() {
    // Tab tracking
    const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'proposals' | 'payments'

    // Data states
    const [stats, setStats] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [payments, setPayments] = useState([]);
    const [projects, setProjects] = useState([]); // for creating invoices

    // Loading & error
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    // Search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modals & Details
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
    const [isDeleteInvoiceOpen, setIsDeleteInvoiceOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);

    // Form state for new invoice
    const [newInvoiceData, setNewInvoiceData] = useState({
        project: '',
        currency: 'usd',
        due_date: '',
        notes: '',
    });
    const [invoiceItemForm, setInvoiceItemForm] = useState({
        description: '',
        quantity: 1,
        unit_amount_cents: 0,
    });
    const [activeInvoiceItems, setActiveInvoiceItems] = useState([]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsRes, invoicesRes, proposalsRes, paymentsRes, projectsRes] = await Promise.all([
                api.getAdminBillingStatsGlobal(),
                api.getAdminInvoicesGlobal(),
                api.getAdminProposalsGlobal(),
                api.getAdminPaymentsGlobal(),
                api.getAdminProjects(),
            ]);
            setStats(statsRes);
            setInvoices(invoicesRes || []);
            setProposals(proposalsRes || []);
            setPayments(paymentsRes || []);
            setProjects(projectsRes || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch billing data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Mutation handlers
    const handleMarkPaid = async (id) => {
        try {
            setActionLoading(true);
            const updated = await api.markAdminInvoicePaidGlobal(id);
            // Update local state
            setInvoices(invoices.map(inv => inv.id === id ? { ...inv, ...updated } : inv));
            if (selectedInvoice && selectedInvoice.id === id) {
                setSelectedInvoice({ ...selectedInvoice, ...updated });
            }
            // Reload stats and payments to reflect new state
            const [statsRes, paymentsRes] = await Promise.all([
                api.getAdminBillingStatsGlobal(),
                api.getAdminPaymentsGlobal(),
            ]);
            setStats(statsRes);
            setPayments(paymentsRes || []);
        } catch (err) {
            alert(err.message || 'Failed to mark invoice as paid');
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkUnpaid = async (id) => {
        try {
            setActionLoading(true);
            const updated = await api.markAdminInvoiceUnpaidGlobal(id);
            setInvoices(invoices.map(inv => inv.id === id ? { ...inv, ...updated } : inv));
            if (selectedInvoice && selectedInvoice.id === id) {
                setSelectedInvoice({ ...selectedInvoice, ...updated });
            }
            const [statsRes, paymentsRes] = await Promise.all([
                api.getAdminBillingStatsGlobal(),
                api.getAdminPaymentsGlobal(),
            ]);
            setStats(statsRes);
            setPayments(paymentsRes || []);
        } catch (err) {
            alert(err.message || 'Failed to mark invoice as unpaid');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendInvoice = async (id) => {
        try {
            setActionLoading(true);
            const updated = await api.sendAdminInvoiceGlobal(id);
            setInvoices(invoices.map(inv => inv.id === id ? { ...inv, ...updated } : inv));
            if (selectedInvoice && selectedInvoice.id === id) {
                setSelectedInvoice({ ...selectedInvoice, ...updated });
            }
            const statsRes = await api.getAdminBillingStatsGlobal();
            setStats(statsRes);
        } catch (err) {
            alert(err.message || 'Failed to send invoice');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSendProposal = async (id) => {
        try {
            setActionLoading(true);
            await api.sendAdminProposal(id);
            const proposalsRes = await api.getAdminProposalsGlobal();
            setProposals(proposalsRes || []);
            if (selectedProposal && selectedProposal.id === id) {
                setSelectedProposal(proposalsRes.find(p => p.id === id));
            }
            const statsRes = await api.getAdminBillingStatsGlobal();
            setStats(statsRes);
        } catch (err) {
            alert(err.message || 'Failed to send proposal');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteInvoice = async () => {
        if (!invoiceToDelete) return;
        try {
            setActionLoading(true);
            // Locate project_id for project context in API fallback if needed, or if invoice list has it
            await api.deleteAdminInvoice(invoiceToDelete.project, invoiceToDelete.id);
            setInvoices(invoices.filter(inv => inv.id !== invoiceToDelete.id));
            if (selectedInvoice && selectedInvoice.id === invoiceToDelete.id) {
                setSelectedInvoice(null);
            }
            setIsDeleteInvoiceOpen(false);
            setInvoiceToDelete(null);
            const statsRes = await api.getAdminBillingStatsGlobal();
            setStats(statsRes);
        } catch (err) {
            alert(err.message || 'Failed to delete invoice');
        } finally {
            setActionLoading(false);
        }
    };

    // New invoice form flow
    const handleCreateInvoiceSubmit = async (e) => {
        e.preventDefault();
        if (!newInvoiceData.project) {
            alert('Please select a project');
            return;
        }
        try {
            setActionLoading(true);
            // 1. Create Invoice
            const createdInvoice = await api.createAdminInvoiceGlobal({
                project: newInvoiceData.project,
                currency: newInvoiceData.currency,
                due_date: newInvoiceData.due_date || null,
                notes: newInvoiceData.notes,
            });

            // 2. Add Items
            for (const item of activeInvoiceItems) {
                await api.createAdminInvoiceItemGlobal(createdInvoice.id, {
                    description: item.description,
                    quantity: item.quantity,
                    unit_amount_cents: item.unit_amount_cents,
                });
            }

            // 3. Refresh and close
            await loadData();
            setIsCreateInvoiceOpen(false);
            setNewInvoiceData({ project: '', currency: 'usd', due_date: '', notes: '' });
            setActiveInvoiceItems([]);
        } catch (err) {
            alert(err.message || 'Failed to create invoice');
        } finally {
            setActionLoading(false);
        }
    };

    const addInvoiceItemToDraft = (e) => {
        e.preventDefault();
        if (!invoiceItemForm.description || invoiceItemForm.unit_amount_cents <= 0) {
            alert('Description and price are required.');
            return;
        }
        setActiveInvoiceItems([...activeInvoiceItems, { ...invoiceItemForm }]);
        setInvoiceItemForm({ description: '', quantity: 1, unit_amount_cents: 0 });
    };

    const removeInvoiceItemFromDraft = (index) => {
        setActiveInvoiceItems(activeInvoiceItems.filter((_, i) => i !== index));
    };

    // Inline modification of items on existing loaded invoice
    const handleAddRealItem = async (e) => {
        e.preventDefault();
        if (!selectedInvoice) return;
        if (!invoiceItemForm.description || invoiceItemForm.unit_amount_cents <= 0) {
            alert('Description and price are required.');
            return;
        }
        try {
            setActionLoading(true);
            const newItem = await api.createAdminInvoiceItemGlobal(selectedInvoice.id, {
                description: invoiceItemForm.description,
                quantity: invoiceItemForm.quantity,
                unit_amount_cents: invoiceItemForm.unit_amount_cents,
            });
            // Update local loaded details
            const updatedItems = [...(selectedInvoice.items || []), newItem];
            const updatedInvoice = { 
                ...selectedInvoice, 
                items: updatedItems,
                amount_total_cents: selectedInvoice.amount_total_cents + (newItem.quantity * newItem.unit_amount_cents)
            };
            setSelectedInvoice(updatedInvoice);
            setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
            setInvoiceItemForm({ description: '', quantity: 1, unit_amount_cents: 0 });
            // Refresh stats
            const statsRes = await api.getAdminBillingStatsGlobal();
            setStats(statsRes);
        } catch (err) {
            alert(err.message || 'Failed to add item to invoice');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteRealItem = async (itemId) => {
        if (!selectedInvoice) return;
        try {
            setActionLoading(true);
            await api.deleteAdminInvoiceItemGlobal(selectedInvoice.id, itemId);
            const itemToDelete = selectedInvoice.items.find(i => i.id === itemId);
            const updatedItems = selectedInvoice.items.filter(i => i.id !== itemId);
            const updatedInvoice = {
                ...selectedInvoice,
                items: updatedItems,
                amount_total_cents: Math.max(0, selectedInvoice.amount_total_cents - ((itemToDelete?.quantity || 1) * (itemToDelete?.unit_amount_cents || 0)))
            };
            setSelectedInvoice(updatedInvoice);
            setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
            // Refresh stats
            const statsRes = await api.getAdminBillingStatsGlobal();
            setStats(statsRes);
        } catch (err) {
            alert(err.message || 'Failed to delete item');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-admin-accent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px] px-4">
                <div className="text-center bg-admin-danger/10 border border-admin-danger/20 p-6 rounded-2xl max-w-md">
                    <AlertCircle size={32} className="text-admin-danger mx-auto mb-3" />
                    <p className="text-text-primary font-black uppercase tracking-widest text-sm mb-2">Error Loading Billing</p>
                    <p className="text-text-muted text-xs mb-4">{error}</p>
                    <button onClick={loadData} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest rounded-xl transition-all">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Filter calculations
    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = 
            (inv.number && inv.number.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (inv.project_title && inv.project_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (inv.client_name && inv.client_name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredProposals = proposals.filter(p => {
        const matchesSearch = 
            (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.project_title && p.project_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.client_name && p.client_name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredPayments = payments.filter(pay => {
        const matchesSearch = 
            (pay.invoice_number && pay.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (pay.project_title && pay.project_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (pay.client_name && pay.client_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (pay.provider_id && pay.provider_id.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || pay.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalCollected = (stats?.total_collected_cents || 0) / 100;
    const totalOutstanding = (stats?.total_outstanding_cents || 0) / 100;
    const totalPending = (stats?.total_pending_cents || 0) / 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div {...fadeIn()} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-black text-admin-accent uppercase tracking-[0.3em] mb-1">Admin</p>
                    <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Billing & Finance</h1>
                    <p className="text-text-muted text-sm mt-1">Manage invoice cycles, proposals, and track payment pipelines.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={loadData} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-text-secondary" title="Refresh Dashboard">
                        <RefreshCw size={14} className={actionLoading ? 'animate-spin' : ''} />
                    </button>
                    <button 
                        onClick={() => setIsCreateInvoiceOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-admin-accent/10 text-admin-accent hover:bg-admin-accent/20 border border-admin-accent/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                        <Plus size={14} /> New Invoice
                    </button>
                </div>
            </motion.div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between shadow-xl shadow-black/25">
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">Total Revenue Collected</span>
                        <span className="text-xl font-black text-emerald-400 font-mono">${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25">
                        <Landmark className="text-emerald-400" size={18} />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between shadow-xl shadow-black/25">
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">Outstanding Invoices</span>
                        <span className="text-xl font-black text-yellow-400 font-mono">${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/25">
                        <Clock className="text-yellow-400" size={18} />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between shadow-xl shadow-black/25">
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">Stripe Pending Transactions</span>
                        <span className="text-xl font-black text-brand-teal font-mono">${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center border border-brand-teal/25">
                        <DollarSign className="text-brand-teal" size={18} />
                    </div>
                </div>
            </div>

            {/* Navigation and Filters Control */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-900/40 p-4 border border-border-subtle rounded-2xl backdrop-blur-xl">
                {/* Tabs */}
                <div className="flex bg-white/5 p-1 rounded-xl w-full md:w-auto">
                    {[
                        { id: 'invoices', label: 'Invoices', icon: FileText },
                        { id: 'proposals', label: 'Proposals', icon: FileCheck2 },
                        { id: 'payments', label: 'Payments', icon: Landmark }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setStatusFilter('all'); }}
                                className={`flex items-center justify-center gap-2 flex-grow md:flex-grow-0 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    active ? 'bg-admin-accent text-white shadow-lg shadow-admin-accent/20' : 'text-text-muted hover:text-text-primary'
                                }`}
                            >
                                <Icon size={12} /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Filters Input */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-grow sm:max-w-xs">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-admin-accent/30 focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary transition-all font-bold"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-text-primary focus:outline-none cursor-pointer"
                    >
                        <option value="all" className="bg-surface-900 text-text-primary">All Statuses</option>
                        {activeTab === 'invoices' && (
                            <>
                                <option value="draft" className="bg-surface-900 text-text-primary">Draft</option>
                                <option value="sent" className="bg-surface-900 text-text-primary">Sent</option>
                                <option value="paid" className="bg-surface-900 text-text-primary">Paid</option>
                                <option value="void" className="bg-surface-900 text-text-primary">Void</option>
                            </>
                        )}
                        {activeTab === 'proposals' && (
                            <>
                                <option value="draft" className="bg-surface-900 text-text-primary">Draft</option>
                                <option value="sent" className="bg-surface-900 text-text-primary">Sent</option>
                                <option value="accepted" className="bg-surface-900 text-text-primary">Accepted</option>
                                <option value="rejected" className="bg-surface-900 text-text-primary">Rejected</option>
                            </>
                        )}
                        {activeTab === 'payments' && (
                            <>
                                <option value="pending" className="bg-surface-900 text-text-primary">Pending</option>
                                <option value="succeeded" className="bg-surface-900 text-text-primary">Succeeded</option>
                                <option value="failed" className="bg-surface-900 text-text-primary">Failed</option>
                                <option value="refunded" className="bg-surface-900 text-text-primary">Refunded</option>
                            </>
                        )}
                    </select>
                </div>
            </div>

            {/* List Containers */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
                {activeTab === 'invoices' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01] text-[9px] font-black uppercase tracking-widest text-text-dim">
                                    <th className="py-4 px-5">Invoice</th>
                                    <th className="py-4 px-5">Project & Client</th>
                                    <th className="py-4 px-5">Due Date</th>
                                    <th className="py-4 px-5">Amount</th>
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {filteredInvoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-white/[0.01] transition-all">
                                        <td className="py-4 px-5 font-black text-text-primary">{inv.number || `INV-${inv.id}`}</td>
                                        <td className="py-4 px-5">
                                            <p className="font-black text-text-secondary leading-none">{inv.project_title || 'N/A'}</p>
                                            <span className="text-[10px] text-text-muted mt-1 inline-block">{inv.client_name || 'N/A'}</span>
                                        </td>
                                        <td className="py-4 px-5 text-text-muted font-bold">{inv.due_date || '—'}</td>
                                        <td className="py-4 px-5 font-bold font-mono text-text-secondary">${((inv.amount_total_cents || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className="py-4 px-5">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest inline-block ${
                                                inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                inv.status === 'sent' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                inv.status === 'void' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedInvoice(inv)} 
                                                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-text-secondary transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={12} />
                                                </button>
                                                {inv.status === 'draft' && (
                                                    <button 
                                                        onClick={() => handleSendInvoice(inv.id)} 
                                                        className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all"
                                                        title="Send Invoice"
                                                    >
                                                        <Send size={12} />
                                                    </button>
                                                )}
                                                {inv.status === 'sent' && (
                                                    <button 
                                                        onClick={() => handleMarkPaid(inv.id)} 
                                                        className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-all"
                                                        title="Mark Paid"
                                                    >
                                                        <CheckCircle2 size={12} />
                                                    </button>
                                                )}
                                                {inv.status === 'paid' && (
                                                    <button 
                                                        onClick={() => handleMarkUnpaid(inv.id)} 
                                                        className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-all"
                                                        title="Mark Unpaid"
                                                    >
                                                        <XCircle size={12} />
                                                    </button>
                                                )}
                                                <a 
                                                    href={`${API_BASE_URL}/admin/projects/${inv.project}/invoices/${inv.id}/print/`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-text-secondary transition-all inline-block"
                                                    title="Print PDF"
                                                >
                                                    <Printer size={12} />
                                                </a>
                                                <button 
                                                    onClick={() => { setInvoiceToDelete(inv); setIsDeleteInvoiceOpen(true); }} 
                                                    className="p-1.5 bg-admin-danger/10 hover:bg-admin-danger/20 text-admin-danger rounded-lg transition-all"
                                                    title="Delete Invoice"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInvoices.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-text-dim font-black uppercase tracking-widest text-[10px]">
                                            No Invoices Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'proposals' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01] text-[9px] font-black uppercase tracking-widest text-text-dim">
                                    <th className="py-4 px-5">Proposal</th>
                                    <th className="py-4 px-5">Project & Client</th>
                                    <th className="py-4 px-5">Sent Date</th>
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {filteredProposals.map(p => (
                                    <tr key={p.id} className="hover:bg-white/[0.01] transition-all">
                                        <td className="py-4 px-5 font-black text-text-primary">{p.title}</td>
                                        <td className="py-4 px-5">
                                            <p className="font-black text-text-secondary leading-none">{p.project_title || 'N/A'}</p>
                                            <span className="text-[10px] text-text-muted mt-1 inline-block">{p.client_name || 'N/A'}</span>
                                        </td>
                                        <td className="py-4 px-5 text-text-muted font-bold">
                                            {p.sent_at ? new Date(p.sent_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest inline-block ${
                                                p.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                p.status === 'sent' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                p.status === 'rejected' ? 'bg-admin-danger/10 text-admin-danger border border-admin-danger/20' :
                                                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedProposal(p)} 
                                                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-text-secondary transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={12} />
                                                </button>
                                                {p.status === 'draft' && (
                                                    <button 
                                                        onClick={() => handleSendProposal(p.id)} 
                                                        className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all"
                                                        title="Send Proposal"
                                                    >
                                                        <Send size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProposals.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-text-dim font-black uppercase tracking-widest text-[10px]">
                                            No Proposals Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01] text-[9px] font-black uppercase tracking-widest text-text-dim">
                                    <th className="py-4 px-5">Stripe Session ID / Transaction</th>
                                    <th className="py-4 px-5">Invoice Number</th>
                                    <th className="py-4 px-5">Project & Client</th>
                                    <th className="py-4 px-5">Amount</th>
                                    <th className="py-4 px-5">Status</th>
                                    <th className="py-4 px-5">Logged Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {filteredPayments.map(pay => (
                                    <tr key={pay.id} className="hover:bg-white/[0.01] transition-all">
                                        <td className="py-4 px-5 font-mono text-[10px] text-text-dim">{pay.provider_id || pay.id}</td>
                                        <td className="py-4 px-5 font-black text-text-primary">{pay.invoice_number || `INV-${pay.invoice}`}</td>
                                        <td className="py-4 px-5">
                                            <p className="font-black text-text-secondary leading-none">{pay.project_title || 'N/A'}</p>
                                            <span className="text-[10px] text-text-muted mt-1 inline-block">{pay.client_name || 'N/A'}</span>
                                        </td>
                                        <td className="py-4 px-5 font-bold font-mono text-text-secondary">${((pay.amount_cents || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td className="py-4 px-5">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest inline-block ${
                                                pay.status === 'succeeded' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                pay.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                'bg-admin-danger/10 text-admin-danger border border-admin-danger/20'
                                            }`}>
                                                {pay.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5 text-text-muted font-bold">
                                            {pay.created_at ? new Date(pay.created_at).toLocaleString() : '—'}
                                        </td>
                                    </tr>
                                ))}
                                {filteredPayments.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-text-dim font-black uppercase tracking-widest text-[10px]">
                                            No Payments Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal: Create Invoice */}
            <AdminModal
                open={isCreateInvoiceOpen}
                onClose={() => setIsCreateInvoiceOpen(false)}
                title="Create Global Invoice"
                subtitle="Initialize a new draft invoice cycle and item billing parameters."
            >
                <form onSubmit={handleCreateInvoiceSubmit} className="p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-1">Target Project *</label>
                            <select
                                value={newInvoiceData.project}
                                onChange={(e) => setNewInvoiceData({ ...newInvoiceData, project: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-admin-accent/50 cursor-pointer"
                                required
                            >
                                <option value="" className="bg-surface-900">Select Project...</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id} className="bg-surface-900">
                                        {p.id} - {p.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-1">Due Date</label>
                            <input
                                type="date"
                                value={newInvoiceData.due_date}
                                onChange={(e) => setNewInvoiceData({ ...newInvoiceData, due_date: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-admin-accent/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-1">Internal Notes</label>
                        <textarea
                            rows="2"
                            value={newInvoiceData.notes}
                            onChange={(e) => setNewInvoiceData({ ...newInvoiceData, notes: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-admin-accent/50"
                            placeholder="Add details regarding client terms, milestones, etc."
                        />
                    </div>

                    <div className="border-t border-white/5 pt-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-text-primary mb-3">Add Invoice Items</h4>
                        <div className="flex flex-col sm:flex-row gap-3 items-end">
                            <div className="flex-grow">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">Description</label>
                                <input
                                    type="text"
                                    value={invoiceItemForm.description}
                                    onChange={(e) => setInvoiceItemForm({ ...invoiceItemForm, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none"
                                    placeholder="e.g. Phase 1 Development Milestone"
                                />
                            </div>
                            <div className="w-20">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">Qty</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={invoiceItemForm.quantity}
                                    onChange={(e) => setInvoiceItemForm({ ...invoiceItemForm, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none"
                                />
                            </div>
                            <div className="w-32">
                                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">Price (Cents)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={invoiceItemForm.unit_amount_cents}
                                    onChange={(e) => setInvoiceItemForm({ ...invoiceItemForm, unit_amount_cents: Math.max(0, parseInt(e.target.value) || 0) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none"
                                />
                            </div>
                            <button 
                                onClick={addInvoiceItemToDraft}
                                className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-text-primary transition-all flex items-center gap-1.5"
                            >
                                <PlusCircle size={14} /> Add
                            </button>
                        </div>

                        {/* Temp Draft Items List */}
                        {activeInvoiceItems.length > 0 && (
                            <div className="mt-4 bg-white/[0.01] border border-white/5 rounded-xl divide-y divide-white/5 overflow-hidden">
                                {activeInvoiceItems.map((item, idx) => (
                                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                                        <div>
                                            <p className="font-black text-text-primary">{item.description}</p>
                                            <span className="text-[10px] text-text-muted font-bold">Qty: {item.quantity} × ${(item.unit_amount_cents / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-black text-text-secondary">${((item.quantity * item.unit_amount_cents) / 100).toFixed(2)}</span>
                                            <button 
                                                type="button"
                                                onClick={() => removeInvoiceItemFromDraft(idx)}
                                                className="text-admin-danger hover:text-admin-danger/80 transition-colors"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/5 pt-4 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsCreateInvoiceOpen(false)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={actionLoading}
                            className="px-4 py-2 bg-admin-accent hover:bg-admin-accent/80 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5"
                        >
                            {actionLoading && <Loader2 size={12} className="animate-spin" />}
                            Create Invoice
                        </button>
                    </div>
                </form>
            </AdminModal>

            {/* Modal: Invoice Details & Item Modifier */}
            <AdminModal
                open={!!selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                title={`Invoice Details: ${selectedInvoice?.number || ''}`}
                subtitle="Inspect items, log offline state mutations, or append new invoice rows."
            >
                {selectedInvoice && (
                    <div className="p-5 space-y-5">
                        {/* Info summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">Project</span>
                                <span className="text-xs font-black text-text-primary leading-none block">{selectedInvoice.project_title}</span>
                                <span className="text-[10px] text-text-muted mt-1 block">ID: {selectedInvoice.project}</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">Client Account</span>
                                <span className="text-xs font-bold text-text-secondary">{selectedInvoice.client_name}</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">Created At</span>
                                <span className="text-xs font-bold text-text-secondary">{new Date(selectedInvoice.created_at).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">Status</span>
                                <span className="text-xs font-bold text-text-secondary capitalize">{selectedInvoice.status}</span>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-text-primary mb-3">Invoice Line Items</h4>
                            <div className="bg-white/[0.01] border border-white/5 rounded-xl divide-y divide-white/5 overflow-hidden">
                                {selectedInvoice.items && selectedInvoice.items.map(item => (
                                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                                        <div>
                                            <p className="font-black text-text-primary">{item.description}</p>
                                            <span className="text-[10px] text-text-muted font-bold">Qty: {item.quantity} × ${(item.unit_amount_cents / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono font-black text-text-secondary">${((item.quantity * item.unit_amount_cents) / 100).toFixed(2)}</span>
                                            {selectedInvoice.status === 'draft' && (
                                                <button 
                                                    type="button"
                                                    onClick={() => handleDeleteRealItem(item.id)}
                                                    className="text-admin-danger hover:text-admin-danger/80 transition-colors"
                                                    title="Remove Item"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {(!selectedInvoice.items || selectedInvoice.items.length === 0) && (
                                    <p className="p-4 text-center text-text-dim uppercase text-[10px] font-black tracking-widest">No Items Added Yet</p>
                                )}
                                <div className="p-3 flex justify-between bg-white/[0.02]">
                                    <span className="text-xs font-black uppercase tracking-widest text-text-primary">Total Sum</span>
                                    <span className="font-mono font-black text-brand-teal text-sm">${((selectedInvoice.amount_total_cents || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Form to append items inline if invoice is in DRAFT */}
                        {selectedInvoice.status === 'draft' && (
                            <form onSubmit={handleAddRealItem} className="border-t border-white/5 pt-4 space-y-3">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-text-primary">Append New Item</h5>
                                <div className="flex flex-col sm:flex-row gap-3 items-end">
                                    <div className="flex-grow">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={invoiceItemForm.description}
                                            onChange={(e) => setInvoiceItemForm({ ...invoiceItemForm, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none"
                                            placeholder="e.g. QA testing wrap-up"
                                        />
                                    </div>
                                    <div className="w-16">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">Qty</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={invoiceItemForm.quantity}
                                            onChange={(e) => setInvoiceItemForm({ ...invoiceItemForm, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="w-28">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">Price (Cents)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={invoiceItemForm.unit_amount_cents}
                                            onChange={(e) => setInvoiceItemForm({ ...invoiceItemForm, unit_amount_cents: Math.max(0, parseInt(e.target.value) || 0) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        className="px-3 py-2.5 bg-admin-accent/10 border border-admin-accent/20 rounded-xl text-xs font-black uppercase tracking-widest text-admin-accent hover:bg-admin-accent/20 transition-all flex items-center gap-1.5"
                                    >
                                        <PlusCircle size={14} /> Add Real
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                            <span className="text-[10px] text-text-dim font-bold font-mono">ID: {selectedInvoice.id}</span>
                            <div className="flex gap-3">
                                {selectedInvoice.status === 'draft' && (
                                    <button 
                                        onClick={() => handleSendInvoice(selectedInvoice.id)}
                                        className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                                    >
                                        Send Invoice
                                    </button>
                                )}
                                {selectedInvoice.status === 'sent' && (
                                    <button 
                                        onClick={() => handleMarkPaid(selectedInvoice.id)}
                                        className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                                    >
                                        Mark Paid
                                    </button>
                                )}
                                {selectedInvoice.status === 'paid' && (
                                    <button 
                                        onClick={() => handleMarkUnpaid(selectedInvoice.id)}
                                        className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                                    >
                                        Mark Unpaid
                                    </button>
                                )}
                                <button 
                                    onClick={() => setSelectedInvoice(null)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AdminModal>

            {/* Modal: Proposal Details Markdown view */}
            <AdminModal
                open={!!selectedProposal}
                onClose={() => setSelectedProposal(null)}
                title="Proposal Preview"
                subtitle={selectedProposal?.title || ''}
            >
                {selectedProposal && (
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-3 gap-3 bg-white/[0.01] border border-white/5 p-3 rounded-xl text-xs">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">Project</span>
                                <span className="font-bold text-text-secondary">{selectedProposal.project_title}</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">Client Profile</span>
                                <span className="font-bold text-text-secondary">{selectedProposal.client_name}</span>
                            </div>
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-text-dim block mb-1">Proposal Status</span>
                                <span className="font-bold text-text-secondary capitalize">{selectedProposal.status}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs overflow-y-auto max-h-60">
                            <label className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2 border-b border-white/5 pb-1">Markdown Body</label>
                            <pre className="font-mono text-text-primary whitespace-pre-wrap leading-relaxed">{selectedProposal.body_md || '* Empty Proposal Body *'}</pre>
                        </div>

                        <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                            <span className="text-[10px] text-text-dim font-mono font-bold">ID: {selectedProposal.id}</span>
                            <div className="flex gap-2">
                                {selectedProposal.status === 'draft' && (
                                    <button
                                        onClick={() => handleSendProposal(selectedProposal.id)}
                                        className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                                    >
                                        Send Proposal
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedProposal(null)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AdminModal>

            {/* Modal: Confirm Delete invoice */}
            <ConfirmDangerModal
                open={isDeleteInvoiceOpen}
                onClose={() => setIsDeleteInvoiceOpen(false)}
                onConfirm={handleDeleteInvoice}
                title="Delete Invoice Cycle"
                description={`Are you absolutely sure you want to delete invoice ${invoiceToDelete?.number || ''}? This will permanently wipe related payment transaction entries and item values.`}
            />
        </div>
    );
}
