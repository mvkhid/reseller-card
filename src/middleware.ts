import { NextResponse, type NextRequest } from "next/server";

// Temporary workaround: Vercel's custom-domain IPs are currently throttled by
// some Russian ISPs (connections stall after ~13KB), while *.vercel.app is
// unaffected. A redirect response has no body to stall on, so it gets through.
// Remove this file once either Vercel resolves the issue or the site moves to
// Russian hosting.
const REDIRECT_HOSTS = new Set(["reseller-card.ru", "www.reseller-card.ru"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (REDIRECT_HOSTS.has(host)) {
    const target = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      "https://reseller-card.vercel.app"
    );
    return NextResponse.redirect(target, 307);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
