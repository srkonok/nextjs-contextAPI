import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, 
  swcMinify: true,     
  async rewrites() {
    return [
      {
        source: "/api/resources", 
        destination: "https://mges.tech/api/resources",
      },
      {
        source: "/api/user",
        destination: "https://mges.tech/api/user", 
      },
    ];
  },
};

export default nextConfig;
