import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Skip auth in development
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next();
    }

    // If no token, redirect to login (only for dashboard routes)
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = token.role as string;

    // Role-based dashboard access
    if (pathname.startsWith("/admin")) {
      if (userRole !== "school_director") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (pathname.startsWith("/teacher")) {
      if (userRole !== "teacher") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (pathname.startsWith("/student")) {
      if (userRole !== "student") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Skip auth in development
        if (process.env.NODE_ENV === "development") {
          return true;
        }

        const { pathname } = req.nextUrl;

        // Only require auth for dashboard routes
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/teacher") ||
          pathname.startsWith("/student")
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
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};
