import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Completely disable all dev indicators
  devIndicators: false,
  // Disable telemetry
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
};

export default nextConfig;
