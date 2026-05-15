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
        <main className="pt-36 pb-12 bg-background min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-4">

                    {/* Left Content Column */}
                    <div className="w-full">
                        {/* Back Button */}
                        <Link href="/services" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-teal transition-colors mb-2 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Back to Services</span>
                        </Link>

                        {/* Title & Seller Header */}
                        <div className="mb-4">
                            <h1 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight tracking-tight">
                                {service.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue overflow-hidden relative border border-white/10">
                                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                                            {service.seller.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-white font-bold">{service.seller.name}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase text-brand-teal tracking-widest">
                                                {service.seller.level || 'Pro'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Star className="w-3 h-3 text-brand-teal fill-brand-teal" />
                                            <span className="text-[10px] font-bold text-white">{service.rating.toFixed(1)}</span>
                                            <span className="text-[9px] text-slate-500">({service.reviews})</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-6 w-px bg-white/10 hidden md:block" />

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'text-brand-red fill-brand-red' : ''}`} />
                                        <span>{isFavorite ? 'Saved' : 'Save'}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors">
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* MOBILE ONLY: One line Image and Pricing */}
                        <div className="grid grid-cols-2 gap-3 mb-6 md:hidden">
                            <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg group">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    className="object-cover"
                                    fill
                                    priority
                                />
                            </div>
                            <div className="flex flex-col justify-between p-4 rounded-xl glass border border-white/10 shadow-lg">
                                <div>
                                    <h3 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">{activeTier}</h3>
                                    <div className="text-2xl font-black text-brand-teal">${tier.price}</div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-3 bg-brand-red text-white rounded-lg font-black uppercase tracking-widest text-[10px] shadow-glow-red"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>

                        {/* DESKTOP ONLY: Large Image Gallery */}
                        <div className="hidden md:block relative aspect-video rounded-2xl overflow-hidden border border-white/10 mb-6 shadow-2xl group">
                            <Image
                                src={service.image}
                                alt={service.title}
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                priority
                                fill
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Content Side */}
                            <div className="flex-grow order-2 lg:order-1">
                                {/* About This Service */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Mission Briefing</h2>
                                    <div className="prose prose-invert prose-brand max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                h1: ({ node, ...props }) => <h1 className="text-2xl font-black text-white mb-4 mt-8 first:mt-0 uppercase tracking-tighter" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-xl font-black text-white mb-3 mt-6 uppercase tracking-tight" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-brand-teal mb-3 mt-4" {...props} />,
                                                p: ({ node, ...props }) => <p className="text-slate-400 text-base leading-relaxed mb-4" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="space-y-2 mb-6 list-none pl-0" {...props} />,
                                                li: ({ node, ...props }) => (
                                                    <li className="flex items-start gap-2 text-slate-300 text-base" {...props}>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2 flex-shrink-0" />
                                                        <span>{props.children}</span>
                                                    </li>
                                                ),
                                                hr: ({ node, ...props }) => <hr className="border-white/5 my-8" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="text-white font-black" {...props} />,
                                            }}
                                        >
                                            {service.longDescription || service.description}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* Features Grid */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Technical Highlights</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {(service.features || ["Performance Tuning", "Security Audit", "API Integration"]).map((feature, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl glass border border-white/5">
                                                <div className="w-5 h-5 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal flex-shrink-0">
                                                    <Check size={12} />
                                                </div>
                                                <span className="text-slate-300 text-sm font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Content Side / Order Card (DESKTOP) or Full Details (MOBILE) */}
                            <div className="w-full lg:max-w-xs xl:max-w-sm order-1 lg:order-2">
                                <div className="rounded-2xl overflow-hidden border border-white/10 glass shadow-2xl sticky top-24">
                                    {/* Tier Tabs */}
                                    <div className="flex border-b border-white/5">
                                        {['basic', 'standard', 'premium'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setActiveTier(t)}
                                                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.15em] transition-all ${activeTier === t
                                                        ? 'bg-white/5 text-brand-teal border-b-2 border-brand-teal'
                                                        : 'text-slate-500 hover:text-white'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tier Details */}
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-base font-black text-white">{tier.title}</h3>
                                            <span className="text-xl font-black text-brand-teal">${tier.price}</span>
                                        </div>

                                        <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                                            {tier.desc}
                                        </p>

                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-white/70 text-[9px] font-black uppercase tracking-widest">
                                                <Clock size={12} className="text-brand-teal" />
                                                <span>{tier.delivery}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white/70 text-[9px] font-black uppercase tracking-widest">
                                                <RotateCcw size={12} className="text-brand-teal" />
                                                <span>{tier.revisions} Rev.</span>
                                            </div>
                                        </div>

                                        {/* Tier Features List */}
                                        {tier.features && (
                                            <div className="space-y-2 mb-4 pt-3 border-t border-white/5">
                                                {tier.features.map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <Check size={12} className="text-brand-teal" />
                                                        <span className="text-[11px] text-slate-300 font-medium">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full py-4 bg-brand-red text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-glow-red hover:-translate-y-0.5 transition-all mb-3"
                                        >
                                            Continue to Order
                                        </button>

                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full py-3 glass text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            Contact Seller <MessageCircle size={12} />
                                        </button>
                                    </div>

                                    {/* Trust Footer */}
                                    <div className="p-4 bg-black/20 border-t border-white/5 text-center">
                                        <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            <ShieldCheck size={12} className="text-brand-teal" />
                                            <span>Secured by Dr. Python</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Delivery Roadmap */}
                        {service.roadmap && (
                            <div className="mb-8">
                                <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Delivery Roadmap</h2>
                                <div className="relative space-y-4">
                                    {service.roadmap.map((item, i) => (
                                        <div key={i} className="flex gap-4 relative group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-surface-900 border border-white/10 flex items-center justify-center text-xs font-black text-brand-teal group-hover:border-brand-teal transition-colors">
                                                    {item.step}
                                                </div>
                                                {i !== service.roadmap.length - 1 && (
                                                    <div className="w-px h-full bg-white/10 mt-1" />
                                                )}
                                            </div>
                                            <div className="pb-6">
                                                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                                                <p className="text-slate-500 text-xs">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Client Reviews Section */}
                        {service.clientReviews && (
                            <div className="mb-8">
                                <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Client Reviews</h2>

                                {/* Review Summary Header */}
                                <div className="p-6 rounded-2xl glass border border-white/5 mb-6">
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <div className="text-center md:border-r md:border-white/10 md:pr-6">
                                            <div className="text-4xl font-black text-white mb-1">{service.rating.toFixed(1)}</div>
                                            <div className="flex justify-center gap-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < Math.floor(service.rating) ? "text-brand-teal fill-brand-teal" : "text-white/10"} />
                                                ))}
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{service.reviews} reviews</div>
                                        </div>

                                        <div className="flex-grow space-y-2 w-full">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const percentage = star === 5 ? 85 : star === 4 ? 10 : 5;
                                                return (
                                                    <div key={star} className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1.5 w-10 flex-shrink-0">
                                                            <span className="text-[10px] font-bold text-white">{star}</span>
                                                            <Star size={8} className="text-white/30 fill-white/30" />
                                                        </div>
                                                        <div className="flex-grow h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${percentage}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 1, delay: 0.2 }}
                                                                className="h-full bg-brand-teal"
                                                            />
                                                        </div>
                                                        <span className="text-[9px] font-bold text-slate-500 w-6">{percentage}%</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Individual Reviews */}
                                <div className="grid gap-4">
                                    {service.clientReviews.map((review, i) => (
                                        <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-slate-400 text-xs font-bold border border-white/5">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{review.name}</div>
                                                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Verified Client</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1 mb-0.5">
                                                        {[...Array(5)].map((_, starI) => (
                                                            <Star key={starI} size={8} className={starI < review.rating ? "text-brand-teal fill-brand-teal" : "text-white/5"} />
                                                        ))}
                                                    </div>
                                                    <span className="text-[9px] font-bold text-slate-600">{review.date}</span>
                                                </div>
                                            </div>

                                            <p className="text-slate-400 text-sm italic leading-relaxed mb-4 pl-1">
                                                &quot;{review.text}&quot;
                                            </p>

                                            {/* Review Metadata Bar */}
                                            <div className="flex flex-wrap gap-3 pt-3 border-t border-white/5">
                                                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-500">
                                                    <DollarSign size={10} className="text-brand-teal" />
                                                    <span>Price: <span className="text-white">{review.budget}</span></span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-500">
                                                    <Timer size={10} className="text-brand-teal" />
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
                            <div className="mb-8">
                                <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Common Questions</h2>
                                <div className="space-y-3">
                                    {service.faqs.map((faq, i) => (
                                        <div key={i} className="rounded-xl border border-white/5 bg-surface-900/30 overflow-hidden">
                                            <button
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                                            >
                                                <span className="text-sm font-bold text-white">{faq.q}</span>
                                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {openFaq === i && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: 'auto' }}
                                                        exit={{ height: 0 }}
                                                        className="px-4 pb-4"
                                                    >
                                                        <p className="text-slate-400 text-[13px] leading-relaxed pt-2 border-t border-white/5">
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
