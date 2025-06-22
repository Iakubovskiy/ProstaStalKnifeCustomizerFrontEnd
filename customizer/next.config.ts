import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://prostastal-backend-5bd4ca6915d2.herokuapp.com/api/:path*",
        //destination: "https://new-repo-latest-gpe8.onrender.com/api/:path*",
      },
    ];
  },
  i18n: {
    locales: ['ua', 'en'],
    defaultLocale: 'ua',
  },
};

export default nextConfig;
