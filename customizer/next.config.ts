import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://new-repo-latest-gpe8.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
