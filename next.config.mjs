import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback directly to your live API server if Docker environment mapping fails during build
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.drpythonsolutions.com';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        serverActions: {
            allowedOrigins: ["drpythonsolutions.com", "*.drpythonsolutions.com"],
        },
    },
    env: {
        NEXT_PUBLIC_API_BASE_URL: API_BASE,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "plus.unsplash.com",
            }
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${API_BASE}/api/:path*`,
            },
            {
                source: '/docs',
                destination: `${API_BASE}/docs/`,
            },
        ];
    },
};

export default nextConfig;