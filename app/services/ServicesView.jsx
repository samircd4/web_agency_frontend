import React from 'react';
import ServicesGrid from '@/components/ServicesGrid';
import Expertise from '@/components/Expertise';

export default function ServicesView() {
    return (
        <main className="pt-32 pb-24 bg-background">
            <div className="container mx-auto px-6 mb-20 text-center">
                <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                    Our <span className="text-gradient-red">Capabilities.</span>
                </h1>
                <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                    We architect distributed systems, proprietary engines, and high-concurrency data pipelines.
                </p>
            </div>
            <ServicesGrid />
            <div className="mt-24">
                <Expertise />
            </div>
        </main>
    );
}
