/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.courir.com",
      },
      {
        protocol: "https",
        hostname: "**.courir.com",
      },
    ],
  },
};

export default nextConfig;
