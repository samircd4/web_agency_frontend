import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import Expertise from '@/components/Expertise';
import ServicesGrid from '@/components/ServicesGrid';
import Stats from '@/components/Stats';
import Portfolio from '@/components/Portfolio';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import ScrollReveal from '@/components/ScrollReveal';

// Dynamic import heavy/interactive components below the fold
const DashboardShowcase = dynamic(() => import('@/components/DashboardShowcase'));
const Contact = dynamic(() => import('@/components/Contact'));

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
                <Testimonials />
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
