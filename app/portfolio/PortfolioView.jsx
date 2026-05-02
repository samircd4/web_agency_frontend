import React from 'react';
import Portfolio from '@/components/Portfolio';
import ScrollReveal from '@/components/ScrollReveal';

export default function PortfolioView() {
    return (
        <main className="pt-32 pb-24 bg-background">
            <div className="container mx-auto px-6 mb-20 text-center">
                <ScrollReveal width="100%">
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                        Case <span className="text-gradient-teal">Studies.</span>
                    </h1>
                </ScrollReveal>
                <ScrollReveal width="100%" delay={0.2}>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Explore our recent engineering milestones and industrial-scale deployments.
                    </p>
                </ScrollReveal>
            </div>
            <ScrollReveal width="100%" delay={0.4}>
                <Portfolio />
            </ScrollReveal>
        </main>
    );
}
