import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   allowedDevOrigins: ['192.168.137.37'],
  /* config options here */
    webpack: (config) => {
    config.cache = false;
    return config;
  },
  
};

export default nextConfig;
