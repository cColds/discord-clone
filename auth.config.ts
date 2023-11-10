import type { NextAuthOptions } from "next-auth";

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
} satisfies NextAuthOptions;
