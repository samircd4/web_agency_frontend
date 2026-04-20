import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import "./globals.css";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: {
        default: 'Dr. Python Solutions | Scraping & E-commerce Expert',
        template: '%s | Dr. Python Solutions'
    },
    description: 'Expert Python solutions specializing in automated web scraping, data extraction, and premium full-stack e-commerce architectures.',
    keywords: ['Web Scraping', 'Python Developer', 'Django E-commerce', 'Automation Expert', 'Data Extraction'],
    authors: [{ name: 'Samir' }],
    creator: 'Samir',
    openGraph: {
        title: 'Dr. Python Solutions',
        description: 'Turning Raw Data into High-Performance Engines',
        url: 'https://drpythonsolutions.com',
        siteName: 'Dr. Python Solutions',
        locale: 'en_US',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: '/images/logo/favicon.png',
    },
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="antialiased bg-background" suppressHydrationWarning={true}>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
