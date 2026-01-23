import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Skip authentication in development mode
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next();
    }

    // If no token, redirect to login (only for dashboard routes)
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = token.role as string;
    const userType = token.userType as string | undefined;

    // Redirect library owners away from legacy general-pages AI Books routes
    if (
      pathname.startsWith("/general-pages/general-materials") &&
      userRole === "library_owner"
    ) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = redirectUrl.pathname.replace(
        /^\/general-pages\/general-materials/,
        "/library-owner/general-materials"
      );
      return NextResponse.redirect(redirectUrl);
    }

    const getDashboardPath = (role?: string, type?: string) => {
      if (type === "libraryresourceowner") {
        return "/library-owner";
      }
      switch (role) {
        case "school_director":
          return "/admin";
        case "teacher":
          return "/teacher";
        case "student":
          return "/student";
        case "library_owner":
          return "/library-owner";
        default:
          return "/login";
      }
    };

    // Role-based dashboard access
    if (pathname.startsWith("/admin")) {
      if (userRole !== "school_director") {
        return NextResponse.redirect(
          new URL(getDashboardPath(userRole, userType), req.url)
        );
      }
    }

    if (pathname.startsWith("/library-owner")) {
      if (userRole !== "library_owner" && userType !== "libraryresourceowner") {
        return NextResponse.redirect(
          new URL(getDashboardPath(userRole, userType), req.url)
        );
      }
    }

    if (pathname.startsWith("/teacher")) {
      if (userRole !== "teacher") {
        return NextResponse.redirect(
          new URL(getDashboardPath(userRole, userType), req.url)
        );
      }
    }

    if (pathname.startsWith("/student")) {
      if (userRole !== "student") {
        return NextResponse.redirect(
          new URL(getDashboardPath(userRole, userType), req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Skip authentication in development mode
        if (process.env.NODE_ENV === "development") {
          return true;
        }

        const { pathname } = req.nextUrl;

        // Only require auth for dashboard routes and shared pages
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/library-owner") ||
          pathname.startsWith("/teacher") ||
          pathname.startsWith("/student") ||
          pathname.startsWith("/general-pages")
        ) {
          return !!token;
        }

        // Allow all other routes without authentication
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/library-owner/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/general-pages/:path*",
  ],
};
