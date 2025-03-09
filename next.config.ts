import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"], // For GitHub avatar images
  },
  // Enhance security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "same-origin",
          },
          // {
          //   key: "Permissions-Policy",
          //   value: "camera=(), microphone=(), geolocation=()",
          // },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
