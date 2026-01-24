import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/upload(.*)",
  "/api/upload(.*)",
  "/api/webhooks/clerk(.*)",
  "/pricing(.*)",
  "/knowledge-center(.*)",
  "/ai-assistant(.*)",
  "/career-insights(.*)"
]);

export default clerkMiddleware((auth: any, req: any) => {
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};
