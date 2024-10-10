/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn2.suno.ai",
      },
    ],
  },
};

export default nextConfig;
