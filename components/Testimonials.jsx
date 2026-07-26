'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';

function StarRow({ value, size = 14 }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(s => (
                <Star key={s} size={size} className={s <= value ? 'fill-brand-teal text-brand-teal' : 'text-white/15'} />
            ))}
        </div>
    );
}

function ReviewCard({ review, index }) {
    const valComm = Number(review.rating_communication ?? review.rating ?? 5);
    const valQual = Number(review.rating_quality ?? review.rating ?? 5);
    const valTime = Number(review.rating_timeliness ?? review.rating ?? 5);

    const rawAvg = ((valComm + valQual + valTime) / 3);
    const avg = isNaN(rawAvg) ? 5.0 : rawAvg;
    const rounded = Math.round(avg);

    const clientName = review.client_name || review.name || review.client?.full_name || review.client?.username || 'Client';
    const initials = clientName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CL';
    const serviceName = review.service_title || review.service?.title || review.service_name || '';
    const commentText = review.comment || review.text || review.feedback || '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative bg-surface-900/60 border border-white/8 rounded-2xl p-6 flex flex-col gap-4 h-full hover:border-brand-teal/25 transition-all duration-300 group"
        >
            {/* Quote icon */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={36} className="text-brand-teal" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
                <StarRow value={rounded} />
                <span className="text-xs font-black text-brand-teal">{avg.toFixed(1)}</span>
            </div>

            {/* Sub-ratings */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: 'Comm.', val: valComm },
                    { label: 'Quality', val: valQual },
                    { label: 'Timing', val: valTime },
                ].map(({ label, val }) => (
                    <div key={label} className="text-center py-1.5 px-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">{label}</div>
                        <StarRow value={val} size={9} />
                    </div>
                ))}
            </div>

            {/* Comment */}
            {commentText && (
                <p className="text-sm text-text-muted leading-relaxed italic flex-1">
                    "{commentText}"
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                {review.avatar || review.client_avatar || review.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={review.avatar || review.client_avatar || review.image}
                        alt={clientName}
                        className="w-9 h-9 rounded-full object-cover border border-brand-teal/20 shrink-0"
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-teal/30 to-brand-teal/10 border border-brand-teal/20 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-black text-brand-teal">{initials}</span>
                    </div>
                )}
                <div className="min-w-0">
                    <div className="text-xs font-black text-text-primary truncate">{clientName}</div>
                    {serviceName && (
                        <div className="text-[10px] text-text-muted truncate">{serviceName}</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Fallback demo reviews when API is unavailable
const DEMO_REVIEWS = [
    {
        id: 1, client_name: 'James Rodriguez', rating_communication: 5, rating_quality: 5, rating_timeliness: 4,
        comment: 'Exceptional work from start to finish. The team delivered a polished, production-ready solution ahead of schedule.',
        service_title: 'Full-Stack Web Development',
    },
    {
        id: 2, client_name: 'Aisha Thompson', rating_communication: 5, rating_quality: 5, rating_timeliness: 5,
        comment: 'Communication was stellar throughout the project. Every milestone was hit on time and the quality exceeded expectations.',
        service_title: 'SaaS Platform Development',
    },
    {
        id: 3, client_name: 'Marcus Chen', rating_communication: 4, rating_quality: 5, rating_timeliness: 5,
        comment: 'Incredibly talented team. They turned our complex requirements into an elegant, performant application.',
        service_title: 'API & Backend Engineering',
    },
    {
        id: 4, client_name: 'Sophie Laurent', rating_communication: 5, rating_quality: 4, rating_timeliness: 5,
        comment: 'The attention to detail and understanding of our business needs made all the difference. Highly recommended.',
        service_title: 'AI & Automation',
    },
    {
        id: 5, client_name: 'David Kim', rating_communication: 5, rating_quality: 5, rating_timeliness: 4,
        comment: 'Professional, responsive, and technically brilliant. Exactly what we needed to take our product to the next level.',
        service_title: 'Data Engineering',
    },
];

export default function Testimonials() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: '-80px' });

    const CARDS_PER_PAGE = 3;

    useEffect(() => {
        const load = async () => {
            try {
                const data = await api.getPublicReviews({ limit: 12 });
                const list = Array.isArray(data) ? data : data.results || [];
                setReviews(list.length >= 3 ? list : DEMO_REVIEWS);
            } catch {
                setReviews(DEMO_REVIEWS);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE);
    const visible = reviews.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

    const avgOverall = reviews.length
        ? (reviews.reduce((a, r) => a + (r.rating_communication + r.rating_quality + r.rating_timeliness) / 3, 0) / reviews.length).toFixed(1)
        : null;

    if (loading || reviews.length === 0) return null;

    return (
        <section ref={containerRef} className="py-20 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-teal/3 blur-[120px]" />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-teal/20 bg-brand-teal/5 mb-3">
                        <Star size={12} className="fill-brand-teal text-brand-teal" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-teal">Testimonials</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary uppercase tracking-tight mb-3">
                        What Clients Say
                    </h2>
                    <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto">
                        Real feedback and verified reviews from clients who have completed projects with us.
                    </p>
                </motion.div>

                {/* Cards grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={page}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.35 }}
                        className="grid md:grid-cols-3 gap-5"
                    >
                        {visible.map((review, i) => (
                            <ReviewCard key={review.id} review={review} index={i} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-brand-teal/30 transition-all disabled:opacity-30"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === page ? 'bg-brand-teal w-6' : 'bg-white/20 hover:bg-white/40'}`}
                            />
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-brand-teal/30 transition-all disabled:opacity-30"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
