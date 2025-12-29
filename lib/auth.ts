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
        isLibraryOwner: { label: "Is Library Owner", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        try {
          // Handle OTP verification for admins
          if (credentials.isOtpVerification === "true" && credentials.otp) {
            // For OTP verification, we don't need password validation
            const backendUrl = process.env.BACKEND_URL;
            if (!backendUrl) {
              throw new Error("Backend URL not configured");
            }

            const requestBody = {
              email: credentials.email,
              otp: credentials.otp,
            };

            console.log("=== OTP VERIFICATION API REQUEST ===");
            console.log("URL:", `${backendUrl}/auth/director-verify-login-otp`);
            console.log("Method: POST");
            console.log("Request Body:", JSON.stringify(requestBody, null, 2));

            const response = await fetch(
              `${backendUrl}/auth/director-verify-login-otp`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
              }
            );

            console.log("=== OTP VERIFICATION API RESPONSE ===");
            console.log("Status:", response.status, response.statusText);
            console.log("Headers:", Object.fromEntries(response.headers.entries()));

            const data = await response.json();
            console.log("Response Body:", JSON.stringify(data, null, 2));
            console.log("=====================================");

            if (response.ok && data.success) {
              // Extract user data from the nested structure
              const userData = data.data.user || data.data;
              
              return {
                id: userData.id,
                email: userData.email,
                name: `${userData.first_name} ${userData.last_name}`,
                role: userData.role,
                schoolId: userData.school_id,
                firstName: userData.first_name,
                lastName: userData.last_name,
                phoneNumber: userData.phone_number,
                isEmailVerified: userData.is_email_verified,
                accessToken: data.data.access_token || data.access_token,
              };
            }

            throw new Error(data.message || "Invalid OTP");
          }

          // Handle initial login - password is required for this flow
          if (!credentials?.password) {
            return null;
          }

          const backendUrl = process.env.BACKEND_URL;
          if (!backendUrl) {
            throw new Error("Backend URL not configured");
          }

          // Check if this is a library owner login
          const isLibraryOwner = credentials.isLibraryOwner === "true";

          const requestBody = {
            email: credentials.email,
            password: credentials.password,
          };

          // Determine the endpoint based on user type
          const endpoint = isLibraryOwner
            ? "/library/auth/sign-in"
            : "/auth/sign-in";

          console.log("=== LOGIN API REQUEST ===");
          console.log("User Type:", isLibraryOwner ? "Library Owner" : "School User");
          console.log("URL:", `${backendUrl}${endpoint}`);
          console.log("Method: POST");
          console.log("Request Body:", JSON.stringify({ ...requestBody, password: "[REDACTED]" }, null, 2));

          const response = await fetch(`${backendUrl}${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          console.log("=== LOGIN API RESPONSE ===");
          console.log("Status:", response.status, response.statusText);
          console.log("Headers:", Object.fromEntries(response.headers.entries()));

          const data = await response.json();
          console.log("Response Body:", JSON.stringify(data, null, 2));
          console.log("==========================");

          if (response.ok && data.success) {
            // Handle library owner response structure
            if (isLibraryOwner) {
              // Extract user data from nested structure (same as school users now)
              const userData = data.data.user || data.data;
              const accessToken = data.data.access_token || data.access_token || "";
              
              console.log("✅ Logging in library owner with userType:", userData.userType);
              console.log("Access Token Check:", accessToken ? "✅ Present" : "⚠️ Not provided (may not be required for library owners)");
              
              return {
                id: userData.id,
                email: userData.email,
                name: `${userData.first_name} ${userData.last_name}`,
                role: userData.role,
                platformId: userData.platformId,
                firstName: userData.first_name,
                lastName: userData.last_name,
                phoneNumber: userData.phone_number || "",
                isEmailVerified: true, // Library owners don't have this field, assume verified
                userType: userData.userType,
                accessToken: accessToken,
              };
            }

            // Handle school user response structure
            const userData = data.data.user || data.data;
            const accessToken = data.data.access_token || data.access_token;
            
            console.log("Access Token Check:", accessToken ? "✅ Present - Logging in directly" : "❌ Missing - OTP required");
            
            // If access_token is not present, require OTP verification
            if (!accessToken) {
              throw new Error("OTP_REQUIRED");
            }

            // If access_token is present, log the user in directly
            console.log("✅ Logging in user with role:", userData.role);
            return {
              id: userData.id,
              email: userData.email,
              name: `${userData.first_name} ${userData.last_name}`,
              role: userData.role,
              schoolId: userData.school_id,
              firstName: userData.first_name,
              lastName: userData.last_name,
              phoneNumber: userData.phone_number,
              isEmailVerified: userData.is_email_verified,
              accessToken: accessToken,
            };
          }

          throw new Error(data.message || "Invalid credentials");
        } catch (error: unknown) {
          // Don't log OTP_REQUIRED as an error - it's expected behavior
          const errorMessage =
            error instanceof Error ? error.message : "Authentication failed";
          if (errorMessage !== "OTP_REQUIRED") {
            console.error("Auth error:", error);
          }
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.schoolId = user.schoolId;
        token.platformId = user.platformId;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNumber = user.phoneNumber;
        token.isEmailVerified = user.isEmailVerified;
        token.requiresOtp = user.requiresOtp;
        token.accessToken = user.accessToken;
        token.userType = user.userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || "";
        session.user.role = token.role;
        session.user.schoolId = token.schoolId;
        session.user.platformId = token.platformId;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.phoneNumber = token.phoneNumber;
        session.user.isEmailVerified = token.isEmailVerified;
        session.user.requiresOtp = token.requiresOtp;
        session.user.accessToken = token.accessToken;
        session.user.userType = token.userType;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always allow relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allow same origin URLs
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default redirect to base URL
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
  debug: false, // Disable NextAuth debug logs
};
