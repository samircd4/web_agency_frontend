'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, User, Mail, MessageSquare, Briefcase, CreditCard, ShieldCheck, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { api } from '@/lib/api';

export default function OrderModal({ isOpen, onClose, service, tier }) {
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requirements: '',
    deadline: ''
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token) {
        try {
          const me = await api.getMe();
          const fullName = `${me.first_name || ''} ${me.last_name || ''}`.trim() || me.username;
          setFormData(prev => ({
            ...prev,
            name: fullName,
            email: me.email || ''
          }));
        } catch (err) {
          console.error('Failed to load user profile for autofill:', err);
        }
      }
    };
    if (isOpen) {
      loadUserProfile();
      setErrorMessage('');
      setStep(1);
    }
  }, [isOpen]);

  const price = tier.price || service.price;
  const isLargeProject = price >= 100;
  const depositPercentage = 50;
  const paymentAmount = isLargeProject ? (price * (depositPercentage / 100)) : price;

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.drpythonsolutions.com';
      const response = await fetch(`${API_BASE}/payments/create-session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('access_token') ? { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } : {})
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          requirements: formData.requirements,
          deadline: formData.deadline,
          service_title: service.title,
          tier_title: tier.title,
          price: price
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create checkout session');
      }

      // If a new user register session was created on the fly
      if (data.access && data.refresh) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        document.cookie = `admin_session=${data.access}; path=/; max-age=86400`;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during payment setup.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-surface-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
            <motion.div 
              className="h-full bg-brand-teal"
              initial={{ width: "0%" }}
              animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
            />
          </div>

          {/* Header */}
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
              <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">
                {step === 1 ? 'Project Brief' : step === 2 ? 'Security Deposit' : 'Project Active'}
              </h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {service.title} • <span className="text-brand-teal">{tier.title}</span>
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleNextStep} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-teal transition-colors" />
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-teal/50 transition-all"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-teal transition-colors" />
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-teal/50 transition-all"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Deadline</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-teal transition-colors" />
                      <input 
                        type="date" 
                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand-teal/50 transition-all [color-scheme:dark]"
                        value={formData.deadline}
                        onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Brief</label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-4 top-6 w-4 h-4 text-slate-500 group-focus-within:text-brand-teal transition-colors" />
                      <textarea 
                        required
                        placeholder="Describe your requirements..."
                        rows={4}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-teal/50 transition-all resize-none"
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-brand-teal text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-glow-teal hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    Next: Review & Secure <ArrowRight size={18} />
                  </button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                      <span className="text-sm font-bold text-slate-400">Total Project Value</span>
                      <span className="text-xl font-black text-white">${price}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-sm font-black text-white uppercase tracking-tight">
                          {isLargeProject ? `Security Deposit (${depositPercentage}%)` : 'Full Payment'}
                        </span>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {isLargeProject ? 'Required to initialize development' : 'Secure upfront payment'}
                        </p>
                      </div>
                      <span className="text-3xl font-black text-brand-teal">${paymentAmount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-indigo/5 border border-brand-indigo/20 text-brand-indigo">
                    <ShieldCheck size={20} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      Encrypted checkout via Stripe Gateway
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-4 rounded-2xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-[10px] font-bold uppercase tracking-widest text-center">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-8 py-5 glass text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-grow py-5 bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-glow-red hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
                    >
                      {isProcessing ? (
                        <>Processing... <Loader2 className="animate-spin" size={18} /></>
                      ) : (
                        <>Pay Securely <CreditCard size={18} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal mx-auto mb-8 shadow-[0_0_50px_rgba(0,200,150,0.2)]">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Project Initialized</h3>
                  <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                    Payment of <span className="text-white font-bold">${paymentAmount}</span> confirmed. A Dr. Python architect will reach out to <span className="text-white font-bold">{formData.email}</span> within 24 hours to begin the engineering phase.
                  </p>
                  <button 
                    onClick={onClose}
                    className="px-10 py-4 glass text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                  >
                    Return to Project Hub
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
