import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@react-oauth/google", "framer-motion", "lucide-react"],
  async rewrites() {
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    backendUrl = backendUrl.replace(/\/$/, "");
    if (!backendUrl.startsWith("http://") && !backendUrl.startsWith("https://")) {
      backendUrl = `https://${backendUrl}`;
    }
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
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
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      (() => {
        const urlStr = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        try {
          const url = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
          return {
            protocol: url.protocol.replace(":", "") as "http" | "https",
            hostname: url.hostname,
            port: url.port || undefined,
            pathname: "/uploads/**",
          };
        } catch {
          return {
            protocol: "http" as const,
            hostname: "localhost",
            port: "4000",
            pathname: "/uploads/**",
          };
        }
      })(),
    ],
  },
};

export default nextConfig;
