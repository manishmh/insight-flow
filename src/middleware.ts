import NextAuth from "next-auth";
import authConfig from "@/server/auth.config";
import {
  apiAuthPrefix, 
  authRoutes,
  publicRoutes,
  DEFAULT_LOGIN_REDIRECT_URL,
} from "@/server/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // every one can access isApiAuthRoute "/api/auth"
  if (isApiAuthRoute) {
    return null;
  }

  // check access of auth routes "/login", "/register" and if user is logged in then redirect to DEFAULT_LOGIN_REDIRECT_URL else it is public 
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT_URL, nextUrl));
    }

    return null;
  }

  // if user is not logged in and it is not public route (i.e. if user is trying to access private routes) it will redirec to "/auth/login" 
  if (!isLoggedIn && !isPublicRoutes) { 
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;

})

/**
 * matcher regex targets all the routes except the files that are mentioned like .next etc.
 * This matcher envokes middleware to the routes that is being targeted by matcher regex pattern
 * by default middleware is being envoked in all the routes.
 **/  
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}