import type { NextAuthOptions } from "next-auth";
import { SessionUser } from "./types/SessionUser";

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authConfig = {
  providers: [], // rest of your config
  session: { strategy: "jwt" },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as SessionUser;
      return session;
    },
  },
} satisfies NextAuthOptions;
