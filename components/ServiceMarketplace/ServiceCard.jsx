import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Heart, Clock, Eye, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { isServiceSaved, toggleSavedService } from '@/lib/services';
import { getFullMediaUrl } from '@/lib/api';
import ShareModal from '@/components/ShareModal';

export default function ServiceCard({ service }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  const {
    id,
    title,
    seller,
    rating = 5.0,
    reviews,
    reviews_count,
    price,
    image,
    gallery = [],
    delivery,
    views,
  } = service;

  const reviewCount = reviews_count ?? reviews ?? service.clientReviews?.length ?? 0;

  useEffect(() => {
    if (id) {
      setIsFavorite(isServiceSaved(id));
    }
  }, [id]);

  const displayPrice = price || service.tiers?.basic?.price || service.tiers?.standard?.price || 0;
  const rawImages = gallery.length > 0 ? gallery : [image];
  const displayImages = rawImages.map(getFullMediaUrl);
  const hasMultipleImages = displayImages.length > 1;

  useEffect(() => {
    if (!hasMultipleImages) return;
    const interval = setInterval(() => {
      setDirection(1);
      setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [hasMultipleImages, displayImages.length]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedStatus = toggleSavedService(id);
    setIsFavorite(updatedStatus);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareOpen(true);
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(1);
    setActiveImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(-1);
    setActiveImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 1
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 1
    })
  };

  const targetUrl = service.slug || id;

  return (
    <div className="relative h-full group/card">
      {/* Link covers the entire card EXCEPT the buttons */}
      <Link href={`/services/${targetUrl}`} className="block h-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          className="bg-surface-900/50 rounded-3xl overflow-hidden border border-white/5 hover:border-brand-teal/30 transition-all flex flex-col h-full"
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden group/image">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeImageIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={displayImages[activeImageIndex]}
                  alt={title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                  priority={id < 3}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <div className="absolute inset-0 flex items-center justify-between p-2 z-10">
                <button 
                  onClick={handlePrevImage}
                  className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-teal hover:border-brand-teal transition-all shadow-lg"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-teal hover:border-brand-teal transition-all shadow-lg"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Tiny Thumbnail Strip */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1.5 z-10 py-1.5 px-2 bg-black/30 backdrop-blur-md rounded-xl border border-white/5 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                {displayImages.map((img, idx) => (
                  <div 
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDirection(idx > activeImageIndex ? 1 : -1);
                      setActiveImageIndex(idx);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveImageIndex(idx);
                      }
                    }}
                    className={`relative w-8 h-6 rounded-md overflow-hidden border transition-all cursor-pointer ${activeImageIndex === idx ? 'border-brand-teal scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image 
                      src={img} 
                      alt={`Thumb ${idx}`} 
                      fill 
                      unoptimized
                      sizes="32px"
                      className="object-cover" 
                      priority
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            {/* Seller Info & Delivery */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue overflow-hidden relative">
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white">
                    {seller?.name?.charAt(0) || 'D'}
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 group-hover/card:text-white transition-colors">
                  {seller?.name || 'Dr. Python'}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase text-slate-500 tracking-wider">
                <Clock size={10} className="text-brand-teal" />
                <span>{delivery}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm md:text-base font-semibold text-white mb-4 line-clamp-2 leading-snug group-hover/card:text-brand-teal transition-colors h-12">
              {title}
            </h3>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                {/* Styled Rating & Reviews */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-teal/10 border border-brand-teal/30">
                    <Star className="w-3 h-3 text-brand-teal fill-brand-teal" />
                    <span className="text-[11px] font-black text-white">{(rating || 5.0).toFixed(1)}</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-300">
                    ({reviewCount} Reviews) 
                  </span>
                </div>
                
                {/* Views */}
                <div className="flex items-center gap-1 text-slate-400" title="Real Service Views">
                  <Eye size={12} className="text-brand-teal" />
                  <span className="text-[11px] font-bold">{views || 0}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-300 block leading-none mb-0.5">Start From</span>
                <span className="text-lg font-black text-white">${displayPrice}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Action Buttons (Share & Favorite) - Positioned absolutely OUTSIDE the Link */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
        <button 
          onClick={handleShare}
          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/70 hover:border-brand-teal/50 transition-all text-slate-300 hover:text-white shadow-lg"
          title="Share Service"
        >
          <Share2 size={14} className="text-brand-teal" />
        </button>
        <button 
          onClick={toggleFavorite}
          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/70 transition-all shadow-lg"
          title={isFavorite ? "Saved" : "Save"}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isFavorite ? 'text-brand-red fill-brand-red' : 'text-white'}`} 
          />
        </button>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={title}
        description={service.description || service.aboutService || title}
        url={typeof window !== 'undefined' ? `${window.location.origin}/services/${targetUrl}` : ''}
        category={service.category || 'Service Capability'}
        image={displayImages[0]}
      />
    </div>
  );
}