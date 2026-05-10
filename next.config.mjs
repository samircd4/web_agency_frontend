/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["187.127.254.41"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
