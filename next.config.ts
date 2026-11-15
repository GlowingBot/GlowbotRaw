import type { NextConfig } from "next";

const sharedHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const sitePolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const studioPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com https://*.sanity.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  "connect-src 'self' https://*.sanity.io https://*.api.sanity.io wss://*.sanity.io",
  "frame-src 'self' https://*.sanity.io",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...sharedHeaders, { key: "Content-Security-Policy", value: sitePolicy }],
      },
      {
        source: "/studio",
        headers: [{ key: "Content-Security-Policy", value: studioPolicy }],
      },
      {
        source: "/studio/:path*",
        headers: [{ key: "Content-Security-Policy", value: studioPolicy }],
      },
    ];
  },
};

export default nextConfig;
