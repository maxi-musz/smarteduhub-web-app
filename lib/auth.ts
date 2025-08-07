import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        isOtpVerification: { label: "Is OTP Verification", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        try {
          // Handle OTP verification for admins
          if (credentials.isOtpVerification === "true" && credentials.otp) {
            // For OTP verification, we don't need password validation
            const response = await fetch(
              "https://smart-edu-hub.onrender.com/api/v1/auth/director-verify-login-otp",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: credentials.email,
                  otp: credentials.otp,
                }),
              }
            );

            const data = await response.json();

            if (response.ok && data.success) {
              return {
                id: data.data.id,
                email: data.data.email,
                name: `${data.data.first_name} ${data.data.last_name}`,
                role: data.data.role,
                schoolId: data.data.school_id,
                firstName: data.data.first_name,
                lastName: data.data.last_name,
                phoneNumber: data.data.phone_number,
                isEmailVerified: data.data.is_email_verified,
              };
            }

            throw new Error(data.message || "Invalid OTP");
          }

          // Handle initial login - password is required for this flow
          if (!credentials?.password) {
            return null;
          }

          const response = await fetch(
            "https://smart-edu-hub.onrender.com/api/v1/auth/sign-in",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await response.json();

          if (response.ok && data.success) {
            // For school directors, don't return user data - throw error to trigger OTP flow
            if (data.data.role === "school_director") {
              throw new Error("OTP_REQUIRED");
            }

            // For teachers and students, return user data for immediate login
            return {
              id: data.data.id,
              email: data.data.email,
              name: `${data.data.first_name} ${data.data.last_name}`,
              role: data.data.role,
              schoolId: data.data.school_id,
              firstName: data.data.first_name,
              lastName: data.data.last_name,
              phoneNumber: data.data.phone_number,
              isEmailVerified: data.data.is_email_verified,
            };
          }

          throw new Error(data.message || "Invalid credentials");
        } catch (error: any) {
          // Don't log OTP_REQUIRED as an error - it's expected behavior
          if (error.message !== "OTP_REQUIRED") {
            console.error("Auth error:", error);
          }
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.schoolId = user.schoolId;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNumber = user.phoneNumber;
        token.isEmailVerified = user.isEmailVerified;
        token.requiresOtp = user.requiresOtp;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || "";
        session.user.role = token.role;
        session.user.schoolId = token.schoolId;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.phoneNumber = token.phoneNumber;
        session.user.isEmailVerified = token.isEmailVerified;
        session.user.requiresOtp = token.requiresOtp;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Disable authentication in development
      if (process.env.NODE_ENV === "development") {
        return url.startsWith(baseUrl) ? url : baseUrl;
      }

      // Handle role-based redirects in production
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
