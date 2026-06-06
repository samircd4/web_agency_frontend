// app/layout.jsx

import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutWrapper from '@/components/LayoutWrapper';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, websiteSchema, faqSchema } from '@/lib/schemas';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
});

export const metadata = {
    metadataBase: new URL("https://drpythonsolutions.com"),

    title: {
        default:  "Dr Python Solutions | Custom Web Scraping & APIs",
        template: "%s | Dr Python Solutions",
    },

    description:
        "Hire expert Python engineers for industrial-grade web scraping, high-velocity API development, and scalable e-commerce data architectures. 150+ projects delivered.",

    keywords: [
        "hire python developer",
        "web scraping service",
        "django e-commerce developer",
        "API development service",
        "price monitoring system",
        "python automation expert",
        "web scraping company",
        "e-commerce development service",
    ],

    authors: [{ name: "Somir Chandra Dash", url: "https://drpythonsolutions.com" }],
    creator: "Somir Chandra Dash",

    openGraph: {
        type:        "website",
        url:         "https://drpythonsolutions.com",
        siteName:    "Dr Python Solutions",
        locale:      "en_US",
        title:       "Dr Python Solutions | Production-Grade Software Engineering",
        description: "Industrial-grade web scraping, high-velocity API ecosystems, and premium e-commerce data architectures built for maximum scale.",
        images: [{
            url:    "/images/og-image.png",
            width:  1200,
            height: 630,
            alt:    "Dr Python Solutions",
        }],
    },

    twitter: {
        card:        "summary_large_image",
        title:       "Dr Python Solutions | Custom Web Scraping & APIs",
        description: "Industrial-grade web scraping, high-velocity API ecosystems, and premium e-commerce data architectures built for maximum scale.",
        images:      ["/images/og-image.png"],
    },

    robots: {
        index:     true,
        follow:    true,
        googleBot: {
            index:               true,
            follow:              true,
            "max-image-preview": "large",
        },
    },

    icons: {
        icon: '/logo/logo.png',
    },
};

export default function RootLayout({ children }) {
    // Combine standalone schemas into an item graph so Google maps your identity efficiently
    const schemaGraph = {
        "@context": "https://schema.org",
        "@graph": [
            organizationSchema,
            websiteSchema,
            faqSchema
        ]
    };

    return (
        <html
            lang="en"
            suppressHydrationWarning={true}
            data-scroll-behavior="smooth"
            className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
        >
            <head>
                {/* Fixed Google Analytics to prevent build crashes */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-BLVNBL6E4B"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        if (typeof window !== 'undefined') {
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){window.dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-BLVNBL6E4B');
                        }
                    `}
                </Script>
            </head>

            <body
                className="font-sans antialiased bg-background text-foreground h-full"
                suppressHydrationWarning={true}
            >
                {/* Render everything as a unified identity graph */}
                <JsonLd data={schemaGraph} />

                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </body>
        </html>
    );
}