import React from 'react';
import Hero from '@/components/Hero';
import Expertise from '@/components/Expertise';
import ServicesGrid from '@/components/ServicesGrid';
import DashboardShowcase from '@/components/DashboardShowcase';
import Stats from '@/components/Stats';
import Contact from '@/components/Contact';
import Portfolio from '@/components/Portfolio';
import Process from '@/components/Process';
import ScrollReveal from '@/components/ScrollReveal';

export default function HomeView() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-brand-teal/30">
            <Hero />
            
            <ScrollReveal width="100%">
                <Expertise />
            </ScrollReveal>
            
            <ScrollReveal width="100%" delay={0.2}>
                <ServicesGrid />
            </ScrollReveal>
            
            <ScrollReveal width="100%">
                <Portfolio />
            </ScrollReveal>
            
            <ScrollReveal width="100%">
                <Process />
            </ScrollReveal>
            
            <ScrollReveal width="100%">
                <DashboardShowcase />
            </ScrollReveal>
            
            <ScrollReveal width="100%">
                <Stats />
            </ScrollReveal>
            
            <ScrollReveal width="100%">
                <Contact />
            </ScrollReveal>
            
        </div>
    );
}
