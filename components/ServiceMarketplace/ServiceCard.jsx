import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Heart, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ServiceCard({ service }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const {
    id,
    title,
    seller,
    rating,
    reviews,
    price,
    image,
    delivery,
    views,
    priceRange
  } = service;

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="relative h-full group">
      {/* Link covers the entire card EXCEPT the favorite button */}
      <Link href={`/services/${id}`} className="block h-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          className="bg-surface-900/50 rounded-3xl overflow-hidden border border-white/5 hover:border-brand-teal/30 transition-all flex flex-col h-full"
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
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
                <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                  {seller.name}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase text-slate-500 tracking-wider">
                <Clock size={10} className="text-brand-teal" />
                <span>{delivery}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm md:text-base font-semibold text-white mb-4 line-clamp-2 leading-snug group-hover:text-brand-teal transition-colors h-12">
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
