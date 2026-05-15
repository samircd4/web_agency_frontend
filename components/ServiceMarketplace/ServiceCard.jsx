import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Heart, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ServiceCard({ service }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const {
    id,
    title,
    seller,
    rating,
    reviews,
    price,
    image,
    gallery = [],
    delivery,
    views,
  } = service;

  // Use gallery if available, otherwise fallback to primary image
  const displayImages = gallery.length > 0 ? gallery : [image];
  const hasMultipleImages = displayImages.length > 1;

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-full group/card">
      {/* Link covers the entire card EXCEPT the buttons */}
      <Link href={`/services/${id}`} className="block h-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          className="bg-surface-900/50 rounded-3xl overflow-hidden border border-white/5 hover:border-brand-teal/30 transition-all flex flex-col h-full"
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden group/image">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={displayImages[activeImageIndex]}
                  alt={title}
                  fill
                  className="object-cover group-hover/card:scale-110 transition-transform duration-700"
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
                  <button 
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-8 h-6 rounded-md overflow-hidden border transition-all ${activeImageIndex === idx ? 'border-brand-teal scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                  </button>
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
                    {seller.name.charAt(0)}
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 group-hover/card:text-white transition-colors">
                  {seller.name}
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
            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-brand-teal fill-brand-teal" />
                  <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-500">({reviews})</span>
                </div>
                
                {/* Views */}
                <div className="flex items-center gap-1 text-slate-500">
                  <Eye size={12} />
                  <span className="text-[10px] font-bold">{views || 0}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 block leading-none mb-0.5">From</span>
                <span className="text-lg font-black text-white">${price}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Favorite Button - Positioned absolutely OUTSIDE the Link to prevent hydration error */}
      <button 
        onClick={toggleFavorite}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/40 transition-all z-20"
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${isFavorite ? 'text-brand-red fill-brand-red' : 'text-white'}`} 
        />
      </button>
    </div>
  );
}
