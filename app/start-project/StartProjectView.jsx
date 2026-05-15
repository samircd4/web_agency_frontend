'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Cpu, Database, Zap, ArrowLeft, ArrowRight, 
  CheckCircle2, Server, Globe, Shield, Rocket, 
  BarChart, Layers, Terminal, Lock
} from 'lucide-react';
import Link from 'next/link';

export default function StartProjectView() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    company: '',
    description: '',
    techPreference: []
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const steps = [
    { id: 1, title: "Mission Scope" },
    { id: 2, title: "Technical Specs" },
    { id: 3, title: "Briefing Details" },
    { id: 4, title: "Review" }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-12 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-brand-teal/5 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-red/5 rounded-full blur-[150px] -ml-64 -mb-64 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-brand-teal transition-colors mb-4 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-widest">Return to Base</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-teal mb-2 block">Mission Initiation</span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-[0.9]">
              Secure your <span className="text-gradient-teal">next breakthrough.</span>
            </h1>
          </motion.div>
        </div>

        {/* Multi-Step Form Container */}
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_280px] gap-4 items-start">
            
            {/* Status Sidebar - TOP on mobile, RIGHT on desktop */}
            <div className="order-1 lg:order-2 space-y-3">
              <div className="p-4 rounded-xl glass border border-white/5">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 text-center">Progress Protocol</h4>
                <div className="grid grid-cols-4 lg:grid-cols-1 gap-2 lg:gap-3">
                  {steps.map((s, i) => (
                    <div key={s.id} className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3">
                      <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border transition-all ${
                        step > s.id 
                          ? 'bg-brand-teal border-brand-teal text-white' 
                          : step === s.id 
                            ? 'bg-brand-teal/20 border-brand-teal text-brand-teal' 
                            : 'bg-white/5 border-white/10 text-slate-700'
                      }`}>
                        {step > s.id ? <CheckCircle2 size={12} /> : <span className="text-[9px] font-black">{s.id}</span>}
                      </div>
                      <span className={`text-[8px] lg:text-[9px] font-black uppercase tracking-widest truncate ${
                        step >= s.id ? 'text-white' : 'text-slate-700'
                      }`}>
                        {s.title.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block p-4 rounded-xl bg-brand-red/5 border border-brand-red/10">
                <div className="flex items-center gap-2 text-brand-red mb-2">
                  <Shield size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure</span>
                </div>
                <p className="text-slate-500 text-[9px] leading-relaxed">
                  256-bit AES encryption. Data accessible only to certified engineers.
                </p>
              </div>
            </div>

            {/* Form Side - BOTTOM on mobile, LEFT on desktop */}
            <div className="order-2 lg:order-1 glass border-white/5 rounded-xl p-4 md:p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div 
                  className="h-full bg-brand-teal"
                  initial={{ width: "25%" }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                />
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">Select Objective</h3>
                      <p className="text-slate-500 text-xs">Which engineering domain does your mission fall under?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        { id: 'scraping', icon: <Database />, title: "Web Scraping", desc: "Extraction networks" },
                        { id: 'ecommerce', icon: <Cpu />, title: "E-commerce", desc: "Custom engines" },
                        { id: 'automation', icon: <Zap />, title: "Automation", desc: "Orchestration" },
                        { id: 'security', icon: <Lock />, title: "Security", desc: "Audits & Tests" },
                        { id: 'ai', icon: <Rocket />, title: "AI Agent", desc: "Intelligence" },
                        { id: 'cloud', icon: <Server />, title: "Cloud / DevOps", desc: "Infrastructure" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setFormData({ ...formData, service: item.id })}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                            formData.service === item.id 
                              ? 'bg-brand-teal/10 border-brand-teal shadow-glow-teal/5' 
                              : 'bg-white/5 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className={`p-2 rounded-md shrink-0 ${formData.service === item.id ? 'text-brand-teal bg-brand-teal/10' : 'text-slate-500 bg-white/5'}`}>
                            {React.cloneElement(item.icon, { size: 16 })}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-white font-bold text-[11px] leading-tight mb-0.5 truncate">{item.title}</h4>
                            <p className="text-slate-500 text-[8px] uppercase font-black tracking-widest truncate">{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">Constraints</h3>
                      <p className="text-slate-500 text-xs">Define budget and delivery window.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Budget Range</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {['< $1k', '$1k - $5k', '$5k - $15k', '$15k+'].map(range => (
                            <button
                              key={range}
                              onClick={() => setFormData({ ...formData, budget: range })}
                              className={`py-2 rounded-md border text-[9px] font-black uppercase tracking-widest transition-all ${
                                formData.budget === range 
                                  ? 'bg-brand-teal text-white border-brand-teal' 
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                              }`}
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Urgency</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {[
                            { id: 'rush', title: 'ASAP', desc: 'Critical' },
                            { id: 'standard', title: '1-2 Mo', desc: 'Standard' },
                            { id: 'flexible', title: 'Flexible', desc: 'Strategic' }
                          ].map(t => (
                            <button
                              key={t.id}
                              onClick={() => setFormData({ ...formData, timeline: t.title })}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                formData.timeline === t.title 
                                  ? 'bg-brand-red/10 border-brand-red' 
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                              }`}
                            >
                              <div className="text-white font-black text-[10px] uppercase mb-0.5">{t.title}</div>
                              <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{t.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">Briefing</h3>
                      <p className="text-slate-500 text-xs">Technical challenge details.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Name</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name" 
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-700 font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Email</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@company.com" 
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-700 font-bold"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-2">Mission Intelligence</label>
                        <textarea 
                          rows="3" 
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe the problem..." 
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-700 font-bold resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal mx-auto mb-3">
                        <Shield size={24} className="animate-pulse" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">Review</h3>
                      <p className="text-slate-500 text-xs">Verify parameters.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        { label: 'Objective', value: formData.service || 'Not Selected' },
                        { label: 'Budget', value: formData.budget || 'Not Selected' },
                        { label: 'Timeline', value: formData.timeline || 'Not Selected' },
                        { label: 'Commander', value: formData.name || 'Not Provided' }
                      ].map(item => (
                        <div key={item.label} className="p-3 rounded-lg bg-white/5 border border-white/5">
                          <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">{item.label}</div>
                          <div className="text-white font-bold text-xs truncate">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-brand-teal/5 border border-brand-teal/20">
                      <div className="flex items-center gap-2 text-brand-teal font-black text-[9px] uppercase tracking-widest mb-1.5">
                        <Zap size={12} /> Encryption Active
                      </div>
                      <p className="text-slate-400 text-[10px] italic leading-relaxed line-clamp-3">
                        &quot;{formData.description || 'No additional mission details provided.'}&quot;
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5">
                <button 
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                    step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <ArrowLeft size={12} /> Back
                </button>

                {step < 4 ? (
                  <button 
                    onClick={nextStep}
                    disabled={step === 1 && !formData.service}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-30"
                  >
                    Next <ArrowRight size={12} className="text-brand-teal" />
                  </button>
                ) : (
                  <button 
                    onClick={() => alert('Mission Briefing Transmitted!')}
                    className="px-6 py-3 bg-brand-teal text-white rounded-lg font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-glow-teal hover:-translate-y-0.5"
                  >
                    Transmit <Send size={12} />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
