import React from 'react';
import Hero from '@/components/Hero';
import Expertise from '@/components/Expertise';
import ServicesGrid from '@/components/ServicesGrid';
import DashboardShowcase from '@/components/DashboardShowcase';
import Stats from '@/components/Stats';
import Contact from '@/components/Contact';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30">
            <Hero />
            <Expertise />
            <ServicesGrid />
            <DashboardShowcase />
            <Stats />
            <Contact />
        </div>
    );
}