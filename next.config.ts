import type { NextConfig } from "next";

// STATIC_EXPORT=1 npm run build  ->  plain HTML/CSS/JS in ./out for any
// ordinary web hosting (used for Russian hosting, where Vercel gets throttled).
// Regular `npm run build` (Vercel) is unaffected.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = staticExport
  ? {
      output: "export",
      trailingSlash: true,
      distDir: ".next-static",
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
