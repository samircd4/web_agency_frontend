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
    <main className="min-h-screen bg-background text-foreground pt-32 pb-24 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-brand-teal/5 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-red/5 rounded-full blur-[150px] -ml-64 -mb-64 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-teal transition-colors mb-12 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest text-[10px]">Abort & Return to Base</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-teal mb-6 block">Mission Initiation Protocol</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              Secure your <br/>
              <span className="text-gradient-teal">next breakthrough.</span>
            </h1>
          </motion.div>
        </div>

        {/* Multi-Step Form Container */}
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
            
            {/* Form Side */}
            <div className="glass border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Select Primary Objective</h3>
                      <p className="text-slate-500 text-sm">Which engineering domain does your mission fall under?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'scraping', icon: <Database />, title: "Web Scraping", desc: "Distributed extraction networks" },
                        { id: 'ecommerce', icon: <Cpu />, title: "E-commerce", desc: "Custom engine development" },
                        { id: 'automation', icon: <Zap />, title: "Automation", desc: "Workflow orchestration" },
                        { id: 'security', icon: <Lock />, title: "Security", desc: "Penetration testing & audits" },
                        { id: 'ai', icon: <Rocket />, title: "AI Agent", desc: "Autonomous intelligence" },
                        { id: 'cloud', icon: <Server />, title: "Cloud / DevOps", desc: "Scalable infrastructure" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setFormData({ ...formData, service: item.id })}
                          className={`flex items-start gap-4 p-6 rounded-3xl border transition-all text-left ${
                            formData.service === item.id 
                              ? 'bg-brand-teal/10 border-brand-teal shadow-glow-teal/10' 
                              : 'bg-white/5 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className={`p-3 rounded-2xl ${formData.service === item.id ? 'text-brand-teal bg-brand-teal/10' : 'text-slate-500 bg-white/5'}`}>
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-12"
                  >
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Technical Constraints</h3>
                      <p className="text-slate-500 text-sm">Define the budget and delivery window for this mission.</p>
                    </div>

                    <div className="space-y-10">
                      {/* Budget Selection */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Allocated Budget Range</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['< $1k', '$1k - $5k', '$5k - $15k', '$15k+'].map(range => (
                            <button
                              key={range}
                              onClick={() => setFormData({ ...formData, budget: range })}
                              className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
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

                      {/* Timeline Selection */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Mission Urgency</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {[
                            { id: 'rush', title: 'ASAP', desc: 'Critical Deadline' },
                            { id: 'standard', title: '1-2 Months', desc: 'Normal Pace' },
                            { id: 'flexible', title: 'Flexible', desc: 'Strategic Growth' }
                          ].map(t => (
                            <button
                              key={t.id}
                              onClick={() => setFormData({ ...formData, timeline: t.title })}
                              className={`p-6 rounded-3xl border text-left transition-all ${
                                formData.timeline === t.title 
                                  ? 'bg-brand-red/10 border-brand-red' 
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                              }`}
                            >
                              <div className="text-white font-black text-xs uppercase mb-1">{t.title}</div>
                              <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.desc}</div>
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Final Briefing</h3>
                      <p className="text-slate-500 text-sm">Identify yourself and describe the technical challenge.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Commander Name</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name" 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-700 font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Secure Email</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@company.com" 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-700 font-bold"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Mission Intelligence (Details)</label>
                        <textarea 
                          rows="5" 
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe the problem, target platform, or required features..." 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-700 font-bold resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-10"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal mx-auto mb-6">
                        <Shield size={40} className="animate-pulse" />
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Review Briefing</h3>
                      <p className="text-slate-500 text-sm">Verify your mission parameters before secure transmission.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { label: 'Objective', value: formData.service || 'Not Selected' },
                        { label: 'Budget', value: formData.budget || 'Not Selected' },
                        { label: 'Timeline', value: formData.timeline || 'Not Selected' },
                        { label: 'Commander', value: formData.name || 'Not Provided' }
                      ].map(item => (
                        <div key={item.label} className="p-5 rounded-3xl bg-white/5 border border-white/5">
                          <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.label}</div>
                          <div className="text-white font-bold">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 rounded-3xl bg-brand-teal/5 border border-brand-teal/20">
                      <div className="flex items-center gap-3 text-brand-teal font-black text-[10px] uppercase tracking-widest mb-3">
                        <Zap size={14} /> Encryption Active
                      </div>
                      <p className="text-slate-400 text-xs italic leading-relaxed">
                        &quot;{formData.description || 'No additional mission details provided.'}&quot;
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/5">
                <button 
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <ArrowLeft size={14} /> Previous Step
                </button>

                {step < 4 ? (
                  <button 
                    onClick={nextStep}
                    disabled={step === 1 && !formData.service}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all disabled:opacity-30"
                  >
                    Next Step <ArrowRight size={14} className="text-brand-teal" />
                  </button>
                ) : (
                  <button 
                    onClick={() => alert('Mission Briefing Transmitted!')}
                    className="px-10 py-5 bg-brand-teal text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-glow-teal hover:-translate-y-1"
                  >
                    Transmit Briefing <Send size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Status Sidebar */}
            <div className="space-y-6">
              <div className="p-8 rounded-[3rem] glass border border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 text-center">Protocol Progress</h4>
                <div className="space-y-6">
                  {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        step > s.id 
                          ? 'bg-brand-teal border-brand-teal text-white' 
                          : step === s.id 
                            ? 'bg-brand-teal/20 border-brand-teal text-brand-teal' 
                            : 'bg-white/5 border-white/10 text-slate-700'
                      }`}>
                        {step > s.id ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-black">{s.id}</span>}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        step >= s.id ? 'text-white' : 'text-slate-700'
                      }`}>
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-[3rem] bg-brand-red/5 border border-brand-red/10">
                <div className="flex items-center gap-3 text-brand-red mb-4">
                  <Shield size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Transmission</span>
                </div>
                <p className="text-slate-500 text-[10px] leading-relaxed">
                  Your mission briefing is encrypted via 256-bit AES protocol. Only certified Dr. Python engineers have access to this data.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
