import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/mentor(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = req.nextUrl.pathname;

  // Protect dashboard and admin routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // If user is logged in, restrict access to marketing pages
  // and redirect them to their dashboard
  if (userId && (url === "/" || url === "/internships")) {
    // We allow them to go to /internships if they want to apply,
    // but the user requested "only dashboard is there for students".
    // Wait, if they haven't applied, they need to see /internships.
    // Let's just redirect "/" to "/dashboard".
    if (url === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
