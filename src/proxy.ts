import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes (Admin and Student Dashboard)
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Authenticate protected routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const res = NextResponse.next();

  // 2. Add Security Headers
  // Prevents Clickjacking
  res.headers.set('X-Frame-Options', 'DENY');
  // Prevents MIME type sniffing
  res.headers.set('X-Content-Type-Options', 'nosniff');
  // Enforces HTTPS for 1 year
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // Controls referrer information sent with requests
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Basic CSP to prevent basic XSS while allowing standard scripts
  // We use a somewhat relaxed CSP because Clerk/NextJS/Tailwind need inline styles and external scripts
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://checkout.razorpay.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https://* http://*;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co https://*.clerk.accounts.dev https://*.clerk.com https://api.razorpay.com wss://*.supabase.co;
    frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://api.razorpay.com;
  `.replace(/\s{2,}/g, ' ').trim();
  
  res.headers.set('Content-Security-Policy', cspHeader);

  return res;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
