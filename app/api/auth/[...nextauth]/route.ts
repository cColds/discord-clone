import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { authConfig } from "@/auth.config";
import dbConnect from "@/lib/db/dbConnect";
import { loginSchema } from "@/lib/validations/login";

const authOptions: AuthOptions = {
  ...authConfig,

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);
        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        await dbConnect();

        const user = await User.findOne({ email }).select({
          email: 1,
          username: 1,
          avatar: 1,
          status: 1,
          displayName: 1,
          password: 1,
        });

        if (!user) throw new Error("Login or password is invalid.");

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) throw new Error("Login or password is invalid.");

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          status: user.status,
          avatar: user.avatar,
        };
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export const { signIn } = handler;

export { handler as GET, handler as POST };
