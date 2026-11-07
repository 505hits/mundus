import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    const localizedPublicRoots = [
      "languages",
      "pricing",
      "prices",
      "group-lessons",
      "companies",
      "contact",
      "privacy",
      "terms",
      "cookies",
      "learn",
      "payment",
    ];

    const beforeFiles = [
      { source: "/sk", destination: "/" },
      { source: "/en", destination: "/" },
    ];

    for (const locale of ["sk", "en"]) {
      for (const root of localizedPublicRoots) {
        beforeFiles.push(
          { source: `/${locale}/${root}`, destination: `/${root}` },
          { source: `/${locale}/${root}/:path*`, destination: `/${root}/:path*` },
        );
      }
    }

    return { beforeFiles };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
};

export default nextConfig;
