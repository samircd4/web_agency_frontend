'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Globe, Send } from 'lucide-react';

function TwitterIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function FacebookIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.6 13.78 5.6c1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 3h-2.33v6.8c4.56-.93 8-4.96 8-9.8z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.197 8.197 0 0 1-5.83 2.42c-1.47 0-2.91-.39-4.18-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.54 3.7-8.24 8.23-8.24zm4.52 11.47c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.16-.29.18-.54.06s-1.05-.39-2.01-1.24c-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.29 3.8 2.52 1.09 2.52.73 2.97.68.45-.05 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.47-.29z" />
    </svg>
  );
}

export default function ShareModal({ isOpen, onClose, title, description, url, category, image }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://drpythonsolutions.com');
  const shareTitle = title || 'Dr. Python Solutions Engineering Briefing';
  const shareText = description || 'Check out this technical case briefing from Dr. Python Solutions.';

  const handleCopy = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy share link:', err);
      }
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Native share closed');
      }
    }
  };

  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: TwitterIcon,
      color: 'bg-slate-900 hover:bg-slate-800 text-white border-white/10',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      color: 'bg-[#0077b5]/20 hover:bg-[#0077b5]/30 text-[#0077b5] border-[#0077b5]/40',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      color: 'bg-[#1877f2]/20 hover:bg-[#1877f2]/30 text-[#1877f2] border-[#1877f2]/40',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      color: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/40',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
    }
  ];

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl glass border border-white/10 p-6 sm:p-8 shadow-2xl z-10 space-y-6 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 size={18} className="text-brand-teal" />
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Share Briefing</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Item Preview Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-center">
            {image ? (
              <img src={image} alt={shareTitle} className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal font-black text-xs flex-shrink-0">
                DR.PY
              </div>
            )}
            <div className="min-w-0 flex-1">
              {category && (
                <span className="px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal text-[8px] font-black uppercase tracking-widest block mb-1 w-max">
                  {category}
                </span>
              )}
              <h4 className="text-white font-bold text-sm leading-snug truncate">{shareTitle}</h4>
              <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-0.5">drpythonsolutions.com</p>
            </div>
          </div>

          {/* Social Share Grid */}
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-black uppercase tracking-wider transition-all duration-300 ${social.color}`}
              >
                <social.icon size={16} />
                <span>{social.name}</span>
              </a>
            ))}
          </div>

          {/* Mobile Native Share Button if available */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-xl bg-brand-teal/20 hover:bg-brand-teal/30 border border-brand-teal/40 text-brand-teal text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Send size={14} />
              <span>Share via Device Menu</span>
            </button>
          )}

          {/* Direct Link Copy Bar */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Direct Share Link</label>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-white/10">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent px-3 text-xs font-mono text-slate-300 focus:outline-none truncate select-all"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-teal text-slate-950 hover:bg-brand-teal/90 font-black uppercase tracking-widest text-[10px] transition-all shadow-glow-teal flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={12} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
