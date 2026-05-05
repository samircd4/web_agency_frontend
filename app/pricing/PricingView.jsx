import React from 'react';
import Pricing from '@/components/Pricing';

export const metadata = {
    title: 'Pricing',
    description: 'Transparent, fixed-scope pricing for industrial web scraping, e-commerce engines, API architectures, and cloud automation. No hidden fees.',
};

export default function PricingView() {
    return (
        <main className="bg-background">
            <Pricing />
        </main>
    );
}
