import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, priority: 1 },
    { url: `${SITE_URL}/oferta`, lastModified, priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified, priority: 0.3 },
  ];
}
