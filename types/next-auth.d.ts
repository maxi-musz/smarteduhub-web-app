import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      schoolId?: string;
      platformId?: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      isEmailVerified: boolean;
      requiresOtp?: boolean;
      accessToken?: string;
      userType?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    schoolId?: string;
    platformId?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isEmailVerified: boolean;
    requiresOtp?: boolean;
    accessToken?: string;
    userType?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    schoolId?: string;
    platformId?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isEmailVerified: boolean;
    requiresOtp?: boolean;
    accessToken?: string;
    userType?: string;
  }
}
