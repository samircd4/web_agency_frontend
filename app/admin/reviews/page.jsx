'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, MessageSquare, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

function StarDisplay({ value, size = 12 }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    size={size}
                    className={s <= value ? 'fill-brand-teal text-brand-teal' : 'text-white/10'}
                />
            ))}
        </div>
    );
}

function RatingBadge({ label, value }) {
    const color =
        value >= 4 ? 'text-emerald-400' :
        value >= 3 ? 'text-yellow-400' :
        'text-brand-red';
    return (
        <div className="flex flex-col items-center gap-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">{label}</span>
            <div className="flex items-center gap-0.5">
                <StarDisplay value={value} size={10} />
                <span className={`text-[10px] font-black ml-0.5 ${color}`}>{value}</span>
            </div>
        </div>
    );
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadReviews = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.getAdminReviews();
            setReviews(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            setError('Failed to load reviews: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadReviews(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this review? This cannot be undone.')) return;
        try {
            await api.deleteAdminReview(id);
            setReviews(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    const avgOf = (r) => ((r.rating_communication + r.rating_quality + r.rating_timeliness) / 3).toFixed(1);

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-black text-brand-teal uppercase tracking-[0.3em] mb-1">Admin / Reviews</p>
                    <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Client Reviews</h1>
                    <p className="text-text-muted text-sm mt-1">
                        All reviews submitted by clients on completed projects — published instantly.
                    </p>
                </div>
                <button
                    onClick={loadReviews}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all"
                >
                    <RefreshCw size={13} />
                    Refresh
                </button>
            </motion.div>

            {/* Stats strip */}
            {!loading && reviews.length > 0 && (() => {
                const avg = (reviews.reduce((a, r) => a + parseFloat(avgOf(r)), 0) / reviews.length).toFixed(1);
                const avgComm = (reviews.reduce((a, r) => a + r.rating_communication, 0) / reviews.length).toFixed(1);
                const avgQual = (reviews.reduce((a, r) => a + r.rating_quality, 0) / reviews.length).toFixed(1);
                const avgTime = (reviews.reduce((a, r) => a + r.rating_timeliness, 0) / reviews.length).toFixed(1);
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Overall', value: avg, icon: <Star size={14} className="fill-brand-teal text-brand-teal" /> },
                            { label: 'Communication', value: avgComm },
                            { label: 'Quality', value: avgQual },
                            { label: 'Timeliness', value: avgTime },
                        ].map(({ label, value, icon }) => (
                            <div key={label} className="glass border border-white/10 rounded-2xl p-4 text-center">
                                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">{label}</div>
                                <div className="flex items-center justify-center gap-1.5">
                                    {icon}
                                    <span className="text-xl font-black text-text-primary">{value}</span>
                                    <span className="text-text-muted text-xs">/5</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })()}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold">
                    <AlertCircle size={15} /> {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-muted">
                    <Loader2 size={32} className="animate-spin text-brand-teal" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Loading Reviews...</span>
                </div>
            ) : reviews.length === 0 ? (
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center py-24 gap-3">
                    <MessageSquare size={32} className="text-text-dim" />
                    <div className="text-center">
                        <div className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">No Reviews Yet</div>
                        <div className="text-sm text-text-dim">Reviews from completed projects will appear here.</div>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[760px]">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    {['Client / Project', 'Service', 'Ratings', 'Overall', 'Comment', 'Date', ''].map(h => (
                                        <th key={h} className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.25em] text-text-muted">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reviews.map((review, i) => (
                                    <motion.tr
                                        key={review.id}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        {/* Client + Project */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden font-black text-brand-teal text-xs">
                                                    {review.avatar || review.client_avatar ? (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img src={review.avatar || review.client_avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        ((review.client_name || review.name || 'CL')[0] || 'C').toUpperCase()
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-black text-sm text-text-primary group-hover:text-brand-teal transition-colors truncate">
                                                        {review.client_name || review.name || review.client?.full_name || review.client?.username || '—'}
                                                    </div>
                                                    <div className="text-[10px] text-text-muted mt-0.5 font-mono truncate">
                                                        {review.project_title || review.project?.title || `Project #${review.project}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Service */}
                                        <td className="px-4 py-4">
                                            {review.service_title || review.service?.title ? (
                                                <span className="px-2 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-text-muted">
                                                    {review.service_title || review.service?.title}
                                                </span>
                                            ) : (
                                                <span className="text-text-dim text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Sub-ratings */}
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <RatingBadge label="Comm." value={review.rating_communication} />
                                                <RatingBadge label="Quality" value={review.rating_quality} />
                                                <RatingBadge label="Time." value={review.rating_timeliness} />
                                            </div>
                                        </td>

                                        {/* Overall avg */}
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-2xl font-black text-text-primary">{avgOf(review)}</span>
                                                <StarDisplay value={Math.round(parseFloat(avgOf(review)))} size={11} />
                                            </div>
                                        </td>

                                        {/* Comment + Deliverable Image */}
                                        <td className="px-4 py-4 max-w-[240px]">
                                            {review.comment ? (
                                                <p className="text-xs text-text-muted italic line-clamp-3 mb-1.5">"{review.comment}"</p>
                                            ) : (
                                                <span className="text-text-dim text-xs block mb-1.5">No comment</span>
                                            )}
                                            {(review.review_image || review.completion_image_url) && (
                                                <div className="w-24 h-14 rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={review.review_image || review.completion_image_url} alt="Deliverable" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-4 text-[11px] text-text-muted font-bold whitespace-nowrap">
                                            {formatDate(review.created_at)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="p-1.5 rounded-lg bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white transition-all"
                                                title="Delete review"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
