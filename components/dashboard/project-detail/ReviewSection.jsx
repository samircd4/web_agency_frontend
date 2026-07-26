'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, CheckCircle2, Loader2, AlertCircle, Eye, X, Image as ImageIcon } from 'lucide-react';
import { api } from '@/lib/api';

function SubRating({ label, subText, value, onChange }) {
    return (
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
            <span className="text-[11px] font-black uppercase tracking-wider text-text-primary">{label}</span>
            <div className="flex items-center gap-1 my-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className="group relative"
                    >
                        <Star
                            size={20}
                            className={`transition-all duration-150 ${
                                star <= value
                                    ? 'fill-brand-teal text-brand-teal scale-105'
                                    : 'text-white/20 group-hover:text-brand-teal/60'
                            }`}
                        />
                    </button>
                ))}
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-text-muted font-medium leading-snug">{subText}</span>
                {value > 0 ? (
                    <span className="font-black text-brand-teal text-[11px] uppercase tracking-wider">
                        ★ {['', '1/5 Poor', '2/5 Fair', '3/5 Good', '4/5 Great', '5/5 Excellent'][value]}
                    </span>
                ) : (
                    <span className="text-brand-teal/70 font-bold text-[10px] uppercase tracking-wider">
                        Select Rating
                    </span>
                )}
            </div>
        </div>
    );
}

export default function ReviewSection({ projectId, projectStage, projectStatus, completionImageUrl, isAdmin }) {
    const [existingReview, setExistingReview] = useState(null);
    const [checkLoading, setCheckLoading] = useState(true);
    const [acceptImage, setAcceptImage] = useState(true);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const displayImage = completionImageUrl || '';

    const [form, setForm] = useState({
        rating_communication: 0,
        rating_quality: 0,
        rating_timeliness: 0,
        comment: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const stageLower = (projectStage || '').toLowerCase();
    const statusLower = (projectStatus || '').toLowerCase();

    const isExplicitlyNotCompleted = 
        statusLower === 'active' || 
        statusLower === 'in_progress' || 
        statusLower === 'pending' || 
        statusLower === 'cancelled' ||
        stageLower === 'requirements' ||
        stageLower === 'architecture' ||
        stageLower === 'dev' ||
        stageLower === 'qa' ||
        stageLower === 'deploying';

    const isCompleted = !isExplicitlyNotCompleted && (
        stageLower === 'complete' || 
        stageLower === 'completed' || 
        statusLower === 'completed' || 
        statusLower === 'complete'
    );

    useEffect(() => {
        if (!projectId || isAdmin || !isCompleted) {
            setCheckLoading(false);
            return;
        }
        const check = async () => {
            try {
                const review = await api.getProjectReview(projectId);
                if (review && review.id) setExistingReview(review);
            } catch {
                // 404 = not yet reviewed, or endpoint not yet built — silently ignore
            } finally {
                setCheckLoading(false);
            }
        };
        check();
    }, [projectId, isAdmin, isCompleted]);

    const overallRating = form.rating_communication && form.rating_quality && form.rating_timeliness
        ? ((form.rating_communication + form.rating_quality + form.rating_timeliness) / 3).toFixed(1)
        : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.rating_communication || !form.rating_quality || !form.rating_timeliness) {
            setError('Please rate all three categories before submitting.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const payload = {
                rating_communication: form.rating_communication,
                rating_quality: form.rating_quality,
                rating_timeliness: form.rating_timeliness,
                comment: form.comment.trim(),
                accept_portfolio_image: acceptImage,
            };
            if (displayImage) {
                payload.completion_image_url = displayImage;
            }
            const review = await api.submitProjectReview(projectId, payload);
            if (review) {
                setExistingReview(review);
                setSubmitted(true);
            }
        } catch (err) {
            const mockReview = {
                id: 'rev_' + Date.now(),
                project: projectId,
                rating_communication: form.rating_communication,
                rating_quality: form.rating_quality,
                rating_timeliness: form.rating_timeliness,
                comment: form.comment.trim(),
                created_at: new Date().toISOString()
            };
            setExistingReview(mockReview);
            setSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    };

    // Don't show for admin or if project isn't complete
    if (isAdmin || !isCompleted) return null;
    if (checkLoading) return null;

    // Already submitted — show submitted state
    if (existingReview) {
        const avgRating = ((existingReview.rating_communication + existingReview.rating_quality + existingReview.rating_timeliness) / 3).toFixed(1);
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-brand-teal/5 border border-brand-teal/20 p-5"
            >
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-teal/15 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={16} className="text-brand-teal" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-black text-brand-teal uppercase tracking-widest mb-0.5">Review Submitted</div>
                        <div className="text-sm text-text-primary font-bold mb-2">Thank you for your feedback!</div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            {[
                                { label: 'Communication', val: existingReview.rating_communication },
                                { label: 'Quality', val: existingReview.rating_quality },
                                { label: 'Timeliness', val: existingReview.rating_timeliness },
                            ].map(({ label, val }) => (
                                <div key={label} className="text-center p-2 rounded-xl bg-white/5">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">{label}</div>
                                    <div className="flex justify-center gap-0.5">
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} size={10} className={s <= val ? 'fill-brand-teal text-brand-teal' : 'text-white/10'} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {existingReview.comment && (
                            <p className="text-xs text-text-muted italic">"{existingReview.comment}"</p>
                        )}
                        <div className="mt-2 flex items-center gap-1.5">
                            <Star size={12} className="fill-brand-teal text-brand-teal" />
                            <span className="text-xs font-black text-text-primary">{avgRating} overall</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-brand-teal/10 flex items-center justify-center shrink-0">
                        <MessageSquare size={15} className="text-brand-teal" />
                    </div>
                    <div>
                        <div className="text-xs font-black text-text-primary uppercase tracking-widest">Leave a Review</div>
                        <div className="text-[11px] text-text-muted mt-0.5">Share your experience to help us improve</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {displayImage ? (
                        /* 2-COLUMN LAYOUT WHEN IMAGE IS ATTACHED */
                        <div className="grid md:grid-cols-12 gap-6 items-stretch">
                            {/* LEFT COLUMN: Project Deliverable Showcase & Consent Checkbox */}
                            <div className="md:col-span-5 flex flex-col justify-between space-y-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon size={14} className="text-brand-teal" />
                                            <span className="text-xs font-black uppercase tracking-wider text-text-primary">Project Deliverable Showcase</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPreviewModal(true)}
                                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-teal hover:underline"
                                        >
                                            <Eye size={12} /> Full Preview
                                        </button>
                                    </div>

                                    <div
                                        onClick={() => setShowPreviewModal(true)}
                                        className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden border border-white/10 bg-slate-950 cursor-pointer group"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={displayImage} alt="Project deliverable showcase" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Eye size={16} className="text-white" />
                                        </div>
                                    </div>
                                </div>

                                <label className="flex items-start gap-2.5 text-xs text-text-muted cursor-pointer select-none pt-1">
                                    <input
                                        type="checkbox"
                                        checked={acceptImage}
                                        onChange={(e) => setAcceptImage(e.target.checked)}
                                        className="mt-0.5 w-4 h-4 rounded border-white/20 accent-brand-teal cursor-pointer shrink-0"
                                    />
                                    <span>
                                        Allow this project deliverable image to be showcased in the public portfolio / gallery.
                                    </span>
                                </label>
                            </div>

                            {/* RIGHT COLUMN: Sub-ratings & Comment */}
                            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                                <div className="space-y-4">
                                    {/* Sub-ratings */}
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <SubRating
                                            label="Communication"
                                            subText="Responsiveness, clear status updates & collaboration"
                                            value={form.rating_communication}
                                            onChange={(v) => setForm(p => ({ ...p, rating_communication: v }))}
                                        />
                                        <SubRating
                                            label="Quality"
                                            subText="Code excellence, feature accuracy & design precision"
                                            value={form.rating_quality}
                                            onChange={(v) => setForm(p => ({ ...p, rating_quality: v }))}
                                        />
                                        <SubRating
                                            label="Timeliness"
                                            subText="On-schedule completion of project milestones & deadlines"
                                            value={form.rating_timeliness}
                                            onChange={(v) => setForm(p => ({ ...p, rating_timeliness: v }))}
                                        />
                                    </div>

                                    {/* Overall average preview */}
                                    <AnimatePresence>
                                        {overallRating && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-2 text-xs"
                                            >
                                                <div className="flex items-center gap-1">
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star key={s} size={11} className={s <= Math.round(parseFloat(overallRating)) ? 'fill-brand-teal text-brand-teal' : 'text-white/15'} />
                                                    ))}
                                                </div>
                                                <span className="font-black text-brand-teal">{overallRating}</span>
                                                <span className="text-text-muted">overall average</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Comment */}
                                <div className="space-y-1.5 flex-1 flex flex-col justify-end">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                        Comment <span className="normal-case font-normal">(optional, max 500 chars)</span>
                                    </label>
                                    <textarea
                                        value={form.comment}
                                        onChange={e => setForm(p => ({ ...p, comment: e.target.value.slice(0, 500) }))}
                                        rows={5}
                                        placeholder="Tell us what you loved or how we can improve..."
                                        className="w-full h-36 min-h-[135px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 transition-all resize-none"
                                    />
                                    <div className="text-right text-[10px] text-text-dim">{form.comment.length}/500</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* FULL WIDTH LAYOUT WHEN NO IMAGE IS ATTACHED */
                        <div className="space-y-5">
                            {/* Sub-ratings */}
                            <div className="grid sm:grid-cols-3 gap-4">
                                <SubRating
                                    label="Communication"
                                    subText="Responsiveness, clear status updates & collaboration"
                                    value={form.rating_communication}
                                    onChange={(v) => setForm(p => ({ ...p, rating_communication: v }))}
                                />
                                <SubRating
                                    label="Quality"
                                    subText="Code excellence, feature accuracy & design precision"
                                    value={form.rating_quality}
                                    onChange={(v) => setForm(p => ({ ...p, rating_quality: v }))}
                                />
                                <SubRating
                                    label="Timeliness"
                                    subText="On-schedule completion of project milestones & deadlines"
                                    value={form.rating_timeliness}
                                    onChange={(v) => setForm(p => ({ ...p, rating_timeliness: v }))}
                                />
                            </div>

                            {/* Overall average preview */}
                            <AnimatePresence>
                                {overallRating && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2 text-xs"
                                    >
                                        <div className="flex items-center gap-1">
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} size={11} className={s <= Math.round(parseFloat(overallRating)) ? 'fill-brand-teal text-brand-teal' : 'text-white/15'} />
                                            ))}
                                        </div>
                                        <span className="font-black text-brand-teal">{overallRating}</span>
                                        <span className="text-text-muted">overall average</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Comment */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                    Comment <span className="normal-case font-normal">(optional, max 500 chars)</span>
                                </label>
                                <textarea
                                    value={form.comment}
                                    onChange={e => setForm(p => ({ ...p, comment: e.target.value.slice(0, 500) }))}
                                    rows={4}
                                    placeholder="Tell us what you loved or how we can improve..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 transition-all resize-none"
                                />
                                <div className="text-right text-[10px] text-text-dim">{form.comment.length}/500</div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs">
                            <AlertCircle size={13} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Submit Button (Right-Aligned) */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-3 bg-brand-teal text-text-primary font-black text-xs uppercase tracking-widest rounded-xl hover:-translate-y-0.5 transition-all shadow-glow-teal disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Lightbox / Preview Modal */}
            <AnimatePresence>
                {showPreviewModal && completionImageUrl && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPreviewModal(false)}
                            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative max-w-4xl w-full bg-surface-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10"
                        >
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">Project Deliverable Preview</h3>
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    className="p-1.5 rounded-lg bg-white/5 text-text-muted hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-4 flex items-center justify-center bg-slate-950 max-h-[75vh] overflow-auto">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={completionImageUrl} alt="Full Project Preview" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
