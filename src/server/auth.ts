import NextAuth from "next-auth";
import authConfig from "@/server/auth.config";
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from "@/lib/db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token) {
        console.log({ sessionToken: token })
      }
      return session;
    },
    async jwt({ token }){
      console.log({token})
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
