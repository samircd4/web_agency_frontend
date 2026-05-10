'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Heart, Share2, Clock, RotateCcw, Check, ShieldCheck, ChevronDown, MessageCircle, ArrowRight, User, Calendar, DollarSign, Timer, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { mockServices } from '@/data/services';
import OrderModal from '@/components/ServiceMarketplace/OrderModal';
import ScrollReveal from '@/components/ScrollReveal';

export default function ServiceDetailPage() {
    const { id } = useParams();
    const service = mockServices.find(s => s.id === id) || mockServices[0];
    const [activeTier, setActiveTier] = useState('basic');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const tier = service.tiers?.[activeTier] || {
        price: service.price,
        title: 'Service Pack',
        desc: 'Standard service offering',
        delivery: service.delivery,
        revisions: '2',
        features: ["Standard Implementation", "Quality Audit", "Source Delivery"]
    };

    return (
        <main className="pt-24 pb-16 bg-background min-h-screen">
            <div className="container mx-auto px-6">
                <div className="flex flex-col gap-8">

                    {/* Left Content Column */}
                    <div className="w-full">
                        {/* Back Button */}
                        <Link href="/services" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-teal transition-colors mb-4 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-black uppercase tracking-widest">Back to Marketplace</span>
                        </Link>

                        {/* Title & Seller Header */}
                        <div className="mb-4">
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight tracking-tight">
                                {service.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue overflow-hidden relative border border-white/10">
                                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white">
                                            {service.seller.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold">{service.seller.name}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase text-brand-teal tracking-widest">
                                                {service.seller.level || 'Pro Seller'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="w-3 h-3 text-brand-teal fill-brand-teal" />
                                            <span className="text-xs font-bold text-white">{service.rating.toFixed(1)}</span>
                                            <span className="text-[10px] text-slate-500">({service.reviews} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-8 w-px bg-white/10 hidden md:block" />

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        <Heart className={`w-4 h-4 ${isFavorite ? 'text-brand-red fill-brand-red' : ''}`} />
                                        <span>{isFavorite ? 'Saved' : 'Save'}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                                        <Share2 className="w-4 h-4" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="relative aspect-video rounded-[3.5rem] overflow-hidden border border-white/10 mb-8 shadow-2xl group">
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </div>

                        {/* Order Card */}
                        <div className="w-full lg:max-w-md">
                            <div className="rounded-[3rem] overflow-hidden border border-white/10 glass shadow-2xl">
                                {/* Tier Tabs */}
                                <div className="flex border-b border-white/5">
                                    {['basic', 'standard', 'premium'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setActiveTier(t)}
                                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTier === t
                                                    ? 'bg-white/5 text-brand-teal border-b-2 border-brand-teal'
                                                    : 'text-slate-500 hover:text-white'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                {/* Tier Details */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-black text-white">{tier.title}</h3>
                                        <span className="text-2xl font-black text-brand-teal">${tier.price}</span>
                                    </div>

                                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                                        {tier.desc}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-2 text-white/70 text-[10px] font-black uppercase tracking-widest">
                                            <Clock size={14} className="text-brand-teal" />
                                            <span>{tier.delivery}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/70 text-[10px] font-black uppercase tracking-widest">
                                            <RotateCcw size={14} className="text-brand-teal" />
                                            <span>{tier.revisions} Rev.</span>
                                        </div>
                                    </div>

                                    {/* Tier Features List */}
                                    {tier.features && (
                                        <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                                            {tier.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <Check size={14} className="text-brand-teal" />
                                                    <span className="text-xs text-slate-300 font-medium">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full py-5 bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-glow-red hover:-translate-y-1 transition-all mb-4"
                                    >
                                        Continue to Order
                                    </button>

                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full py-4 glass text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        Contact Seller <MessageCircle size={14} />
                                    </button>
                                </div>

                                {/* Trust Footer */}
                                <div className="p-6 bg-black/20 border-t border-white/5 text-center">
                                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <ShieldCheck size={14} className="text-brand-teal" />
                                        <span>Secured by Dr. Python Engine</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About This Service (Markdown Support) */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Mission Briefing</h2>
                            <div className="prose prose-invert prose-brand max-w-none">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-3xl font-black text-white mb-6 mt-12 first:mt-0 uppercase tracking-tighter" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-black text-white mb-4 mt-10 uppercase tracking-tight" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-brand-teal mb-4 mt-8" {...props} />,
                                        p: ({ node, ...props }) => <p className="text-slate-400 text-lg leading-relaxed mb-6" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="space-y-4 mb-8 list-none pl-0" {...props} />,
                                        li: ({ node, ...props }) => (
                                            <li className="flex items-start gap-3 text-slate-300 text-lg" {...props}>
                                                <div className="w-2 h-2 rounded-full bg-brand-teal mt-2.5 flex-shrink-0" />
                                                <span>{props.children}</span>
                                            </li>
                                        ),
                                        hr: ({ node, ...props }) => <hr className="border-white/5 my-12" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="text-white font-black" {...props} />,
                                    }}
                                >
                                    {service.longDescription || service.description}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Technical Highlights</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(service.features || ["Performance Tuning", "Security Audit", "API Integration"]).map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-5 rounded-3xl glass border border-white/5">
                                        <div className="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal flex-shrink-0">
                                            <Check size={14} />
                                        </div>
                                        <span className="text-slate-300 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Service Delivery Roadmap */}
                        {service.roadmap && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Delivery Roadmap</h2>
                                <div className="relative space-y-6">
                                    {service.roadmap.map((item, i) => (
                                        <div key={i} className="flex gap-6 relative group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-full bg-surface-900 border border-white/10 flex items-center justify-center text-sm font-black text-brand-teal group-hover:border-brand-teal transition-colors">
                                                    {item.step}
                                                </div>
                                                {i !== service.roadmap.length - 1 && (
                                                    <div className="w-px h-full bg-white/10 mt-2" />
                                                )}
                                            </div>
                                            <div className="pb-8">
                                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-slate-500 text-sm">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Client Reviews Section */}
                        {service.clientReviews && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Client Reviews</h2>

                                {/* Review Summary Header */}
                                <div className="p-10 rounded-[3rem] glass border border-white/5 mb-10">
                                    <div className="flex flex-col md:flex-row gap-12 items-center">
                                        <div className="text-center md:border-r md:border-white/10 md:pr-12">
                                            <div className="text-6xl font-black text-white mb-2">{service.rating.toFixed(1)}</div>
                                            <div className="flex justify-center gap-1 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} className={i < Math.floor(service.rating) ? "text-brand-teal fill-brand-teal" : "text-white/10"} />
                                                ))}
                                            </div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{service.reviews} total reviews</div>
                                        </div>

                                        <div className="flex-grow space-y-3 w-full">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const percentage = star === 5 ? 85 : star === 4 ? 10 : 5;
                                                return (
                                                    <div key={star} className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2 w-12 flex-shrink-0">
                                                            <span className="text-xs font-bold text-white">{star}</span>
                                                            <Star size={10} className="text-white/30 fill-white/30" />
                                                        </div>
                                                        <div className="flex-grow h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${percentage}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 1, delay: 0.2 }}
                                                                className="h-full bg-brand-teal"
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-500 w-8">{percentage}%</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Individual Reviews */}
                                <div className="grid gap-6">
                                    {service.clientReviews.map((review, i) => (
                                        <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-colors">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-slate-400 font-bold border border-white/5">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{review.name}</div>
                                                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Verified Client</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1 mb-1">
                                                        {[...Array(5)].map((_, starI) => (
                                                            <Star key={starI} size={10} className={starI < review.rating ? "text-brand-teal fill-brand-teal" : "text-white/5"} />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600">{review.date}</span>
                                                </div>
                                            </div>

                                            <p className="text-slate-400 italic leading-relaxed mb-6 pl-1">
                                                &quot;{review.text}&quot;
                                            </p>

                                            {/* Review Image */}
                                            {review.image && (
                                                <div className="mb-6 rounded-2xl overflow-hidden border border-white/5 relative aspect-video max-w-sm">
                                                    <Image src={review.image} alt="Work Proof" fill className="object-cover" />
                                                </div>
                                            )}

                                            {/* Review Metadata Bar */}
                                            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    <DollarSign size={12} className="text-brand-teal" />
                                                    <span>Price: <span className="text-white">{review.budget}</span></span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    <Timer size={12} className="text-brand-teal" />
                                                    <span>Delivery: <span className="text-white">{review.duration}</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FAQ Section */}
                        {service.faqs && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Common Questions</h2>
                                <div className="space-y-4">
                                    {service.faqs.map((faq, i) => (
                                        <div key={i} className="rounded-3xl border border-white/5 bg-surface-900/30 overflow-hidden">
                                            <button
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                                            >
                                                <span className="font-bold text-white">{faq.q}</span>
                                                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {openFaq === i && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: 'auto' }}
                                                        exit={{ height: 0 }}
                                                        className="px-6 pb-6"
                                                    >
                                                        <p className="text-slate-400 text-sm leading-relaxed pt-2 border-t border-white/5">
                                                            {faq.a}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>



                </div>
            </div>

            <OrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={service}
                tier={tier}
            />
        </main>
    );
}
