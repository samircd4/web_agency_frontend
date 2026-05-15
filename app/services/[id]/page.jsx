'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Heart, Share2, Clock, RotateCcw, Check, ShieldCheck, ChevronDown, MessageCircle, ArrowRight, User, Calendar, DollarSign, Timer, ArrowLeft, Zap, Award, Activity, Layers, TrendingUp, Search, Cloud, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const [activeImage, setActiveImage] = useState(0);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [reviewFilter, setReviewFilter] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    React.useEffect(() => {
        const handleScroll = () => setShowStickyBar(window.scrollY > 600);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const gallery = service.gallery || [service.image];

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
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-teal/10 border border-brand-teal/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                                                <span className="text-[8px] font-black uppercase text-brand-teal tracking-widest">Agent Online</span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase text-slate-400 tracking-widest">
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



                        {/* Mission Success Stats Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-8">
                            {[
                                { label: 'Missions Done', value: '1,240+', icon: Zap, color: 'text-brand-teal' },
                                { label: 'Success Rate', value: '99.8%', icon: Activity, color: 'text-brand-blue' },
                                { label: 'Client Rating', value: '5.0/5.0', icon: Star, color: 'text-brand-teal' },
                                { label: 'Awarded Pro', value: 'Verified', icon: Award, color: 'text-purple-500' },
                            ].map((stat, i) => (
                                <div key={i} className="p-3 md:p-4 rounded-xl glass border border-white/5 flex items-center gap-3 group hover:border-white/10 transition-colors">
                                    <div className={`p-2 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm md:text-lg font-black text-white leading-none mb-1">{stat.value}</div>
                                        <div className="text-[9px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12 items-start">
                            {/* Image & Gallery Container */}
                            <div className="col-span-1 md:col-span-2">
                                <div className="space-y-4">
                                    <div className="relative aspect-square md:aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-lg md:shadow-2xl group bg-surface-900">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeImage}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                className="absolute inset-0"
                                            >
                                                <Image
                                                    src={gallery[activeImage]}
                                                    alt={service.title}
                                                    className="object-cover"
                                                    priority
                                                    fill
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                        {/* Navigation Arrows */}
                                        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
                                                }}
                                                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-brand-teal hover:border-brand-teal transition-all"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
                                                }}
                                                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-brand-teal hover:border-brand-teal transition-all"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>

                                        {/* Bottom Progress Indicator */}
                                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
                                            <div className="flex gap-1">
                                                {gallery.map((_, i) => (
                                                    <div 
                                                        key={i} 
                                                        className={`h-1 rounded-full transition-all duration-300 ${activeImage === i ? 'w-6 bg-brand-teal' : 'w-2 bg-white/20'}`}
                                                    />
                                                ))}
                                            </div>
                                            
                                            {/* Image Counter Badge */}
                                            <div className="px-3 py-1.5 rounded-full glass border border-white/10 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                                                {activeImage + 1} / {gallery.length}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    {gallery.length > 1 && (
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                            {gallery.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveImage(idx)}
                                                    className={`relative w-20 md:w-28 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-brand-teal' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                                >
                                                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pricing Column (Sticky on desktop) */}
                            <div className="col-span-1 md:col-span-1 md:row-span-2 md:sticky md:top-24">
                                <div className="rounded-xl md:rounded-2xl overflow-hidden border border-white/10 glass shadow-xl md:shadow-2xl">
                                    {/* Tier Tabs */}
                                    <div className="flex border-b border-white/5">
                                        {['basic', 'standard', 'premium'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setActiveTier(t)}
                                                className={`flex-1 py-2 md:py-3 text-[10px] md:text-xs font-black uppercase tracking-widest md:tracking-[0.15em] transition-all ${activeTier === t
                                                    ? 'bg-brand-teal/10 text-white border-b-2 border-brand-teal'
                                                    : 'text-white/60 hover:text-white'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tier Details */}
                                    <div className="p-3 md:p-5">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                            <h3 className="text-base md:text-lg font-black text-white truncate">{tier.title}</h3>
                                            <span className="text-2xl md:text-3xl font-black text-brand-teal">${tier.price}</span>
                                        </div>

                                        <p className="text-slate-400 text-xs md:text-base leading-relaxed mb-3 md:mb-4 line-clamp-2 md:line-clamp-none">
                                            {tier.desc}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-3 mb-3 md:mb-4">
                                            <div className="flex items-center gap-1 md:gap-2 text-white/70 text-[10px] md:text-xs font-black uppercase tracking-widest">
                                                <Clock size={14} className="text-brand-teal md:w-3.5 md:h-3.5" />
                                                <span>{tier.delivery}</span>
                                            </div>
                                            <div className="flex items-center gap-1 md:gap-2 text-white/70 text-[10px] md:text-xs font-black uppercase tracking-widest">
                                                <RotateCcw size={14} className="text-brand-teal md:w-3.5 md:h-3.5" />
                                                <span>{tier.revisions} Revisions</span>
                                            </div>
                                        </div>

                                        {/* Tier Features List */}
                                        {tier.features && (
                                            <div className="space-y-2 mb-4 pt-3 border-t border-white/5">
                                                {tier.features.map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <Check size={12} className="text-brand-teal" />
                                                        <span className="text-xs md:text-sm text-slate-300 font-medium">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full py-2 md:py-4 bg-brand-red text-white rounded-lg md:rounded-xl font-black uppercase tracking-widest text-[8px] md:text-xs shadow-glow-red hover:-translate-y-0.5 transition-all mb-2 md:mb-3"
                                        >
                                            Continue to Order
                                        </button>

                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full py-2 md:py-3 glass text-white rounded-lg md:rounded-xl font-black uppercase tracking-widest text-[7px] md:text-[9px] hover:bg-white/10 transition-all flex items-center justify-center gap-1 md:gap-2"
                                        >
                                            Contact Seller <MessageCircle size={10} className="md:w-3 md:h-3" />
                                        </button>
                                    </div>

                                    {/* Trust Footer */}
                                    <div className="hidden md:block p-4 bg-black/20 border-t border-white/5 text-center">
                                        <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            <ShieldCheck size={12} className="text-brand-teal" />
                                            <span>Secured by Dr. Python</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Column */}
                            <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
                                {/* About This Service */}
                                <div className="prose prose-invert prose-brand max-w-none pt-4 md:pt-0">
                                    <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tight not-prose">Mission Briefing</h2>
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-2xl font-black text-white mb-4 mt-8 first:mt-0 uppercase tracking-tighter" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-2xl font-black text-white mb-4 mt-8 uppercase tracking-tight" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-brand-teal mb-4 mt-6" {...props} />,
                                            p: ({ node, ...props }) => <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-6" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="space-y-3 mb-8 list-none pl-0" {...props} />,
                                            li: ({ node, ...props }) => (
                                                <li className="flex items-start gap-3 text-slate-300 text-lg md:text-xl" {...props}>
                                                    <div className="w-2 h-2 rounded-full bg-brand-teal mt-2.5 flex-shrink-0" />
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

                                {/* Features Grid */}
                                <div>
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
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Client Reviews</h2>
                                        </div>

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


                                        {/* Review Filter Dropdown (Moved Down) */}
                                        <div className="flex justify-end mb-6">
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-[10px] font-black uppercase text-white tracking-widest hover:border-brand-teal transition-all"
                                                >
                                                    {reviewFilter === 'all' ? 'All Reviews' : `${reviewFilter} Stars`}
                                                    <ChevronDown size={12} className={`text-brand-teal transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                
                                                <AnimatePresence>
                                                    {isFilterOpen && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute right-0 top-full mt-2 w-40 glass border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl"
                                                        >
                                                            {['all', 5, 4, 3].map((rating) => (
                                                                <button
                                                                    key={rating}
                                                                    onClick={() => {
                                                                        setReviewFilter(rating);
                                                                        setIsFilterOpen(false);
                                                                    }}
                                                                    className={`w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-left transition-colors flex items-center justify-between ${reviewFilter === rating ? 'bg-brand-teal/20 text-brand-teal' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                                                >
                                                                    {rating === 'all' ? 'All Reviews' : `${rating} Stars`}
                                                                    {reviewFilter === rating && <Check size={10} />}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Individual Reviews */}
                                        <div className="grid gap-4">
                                            {service.clientReviews
                                                .filter(r => reviewFilter === 'all' || r.rating === reviewFilter)
                                                .map((review, i) => (
                                                <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-colors">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-slate-400 text-xs font-bold border border-white/5">
                                                                {review.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-white">{review.name}</div>
                                                                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Verified Client</div>
                                                                <div className="text-base font-black text-white">{review.name}</div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex text-brand-teal">
                                                                        {[...Array(5)].map((_, starI) => (
                                                                            <Star key={starI} size={12} fill={starI < review.rating ? "currentColor" : "none"} />
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{review.date}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 md:mt-0 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-brand-teal uppercase tracking-widest">
                                                            Verified Client
                                                        </div>
                                                    </div>

                                                    <p className="text-slate-300 text-base md:text-lg leading-relaxed italic mb-4">
                                                        &quot;{review.text}&quot;
                                                    </p>

                                                    {/* Review Metadata Bar */}
                                                    <div className="flex flex-wrap gap-3 pt-3 border-t border-white/5">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                            <DollarSign size={12} className="text-brand-teal" />
                                                            <span>Price: <span className="text-white">{review.budget}</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                            <Timer size={12} className="text-brand-teal" />
                                                            <span>Delivery: <span className="text-white">{review.duration}</span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tier Comparison Matrix */}
                                 <div className="mb-12 overflow-hidden">
                                     <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Technical Comparison</h2>
                                     <div className="rounded-2xl border border-white/5 overflow-hidden glass">
                                         <div className="grid grid-cols-4 bg-white/5 border-b border-white/5">
                                             <div className="p-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Feature</div>
                                             {['Basic', 'Standard', 'Premium'].map(tierName => (
                                                 <div key={tierName} className={`p-4 text-xs md:text-sm font-black uppercase text-center tracking-widest ${activeTier.toLowerCase() === tierName.toLowerCase() ? 'text-brand-teal bg-brand-teal/5' : 'text-white'}`}>
                                                     {tierName}
                                                 </div>
                                             ))}
                                         </div>
                                         {[
                                             { label: 'Architecture', basic: 'Monolith', standard: 'Modular', premium: 'Microservices', icon: Layers },
                                             { label: 'Scalability', basic: 'Vertical', standard: 'Elastic', premium: 'Auto-Scaling', icon: TrendingUp },
                                             { label: 'SEO Package', basic: 'Essential', standard: 'Advanced', premium: 'Global Elite', icon: Search },
                                             { label: 'Security', basic: 'SSL + Basic', standard: 'WAF + Hardened', premium: 'Military-Grade', icon: ShieldCheck },
                                             { label: 'Deployment', basic: 'Manual', standard: 'CI/CD Pipeline', premium: 'Multi-Cloud IaC', icon: Cloud },
                                             { label: 'Dr. Support', basic: 'Full Support', standard: 'Full Support', premium: 'Full Support', icon: MessageCircle },
                                         ].map((row, i) => (
                                             <div key={i} className="grid grid-cols-4 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors">
                                                 <div className="p-4 text-xs md:text-sm font-bold text-slate-400 flex items-center gap-2">
                                                     <row.icon size={14} className="text-brand-teal flex-shrink-0" />
                                                     <span>{row.label}</span>
                                                 </div>
                                                 <div className="p-4 text-xs md:text-sm font-medium text-slate-300 text-center">{row.basic}</div>
                                                 <div className="p-4 text-xs md:text-sm font-medium text-slate-300 text-center">{row.standard}</div>
                                                 <div className="p-4 text-xs md:text-sm font-medium text-slate-300 text-center">{row.premium}</div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>

                                {/* FAQ Section */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Common Questions</h2>
                                    <div className="space-y-3">
                                        {(service.faqs || [
                                            { q: "Is this service customizable?", a: "Yes, we can tailor the mission to your specific requirements." },
                                            { q: "What is the typical turnaround time?", a: "Most missions are completed within 3-7 days depending on complexity." }
                                        ]).map((faq, i) => (
                                            <div key={i} className="rounded-xl border border-white/5 bg-surface-900/30 overflow-hidden">
                                                <button
                                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                    className="w-full p-4 md:p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <span className="text-sm md:text-lg font-bold text-white pr-8">{faq.q}</span>
                                                    <ChevronDown 
                                                        className={`text-brand-teal transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} 
                                                        size={20}
                                                    />
                                                </button>
                                                <AnimatePresence>
                                                    {openFaq === i && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-4 md:p-6 pt-0 text-slate-400 text-base md:text-lg leading-relaxed">
                                                                {faq.a}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <OrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={service}
                tier={tier}
            />

            {/* Sticky Mobile Action Bar */}
            <AnimatePresence>
                {showStickyBar && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-white/10 z-50 md:hidden flex items-center justify-between gap-4"
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{activeTier} Pack</span>
                            <span className="text-xl font-black text-brand-teal leading-none">${tier.price}</span>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex-grow py-3 bg-brand-red text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-glow-red active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Start Mission <ArrowRight size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
