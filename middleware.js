// middleware.js

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// ADD '/api/users' to the list of public routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)','/sign-up(.*)','/']) 
//                                                          ^^^^^^^^^^^  <-- ADD THIS

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // This block will now skip the '/api/users' route, 
    // allowing it to hit your API handler.
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // This remains correct, ensuring middleware runs for API routes
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}