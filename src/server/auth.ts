import NextAuth from 'next-auth';
import authConfig from '@/server/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { findUserById } from '@/data/user';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn:"/auth/login",
    error: "/auth/error",
  },
  events: {
    // this method is called only when oAuth provider is being used and not on credentials Auth.
    async linkAccount({ user }) {
      await db.user.update({
        where: {id: user.id},
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // allow oAuth withour email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await findUserById(user.id);

      // prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      // TODOD: Add 2FA check
      return true;
    },
    async session({ token, session }) {
      console.log({ sessionToken: token, session });

      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token?.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token?.sub) return token;

      const existingUser = await findUserById(token.sub);

      if (!existingUser) return token;
      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
