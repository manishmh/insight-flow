import NextAuth from 'next-auth';
import authConfig from '@/server/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { findUserById } from '@/data/user';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

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

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorconfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorconfirmation) return false

        // delete two factor confirmation for next sign in.
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorconfirmation.id }
        })
      }

      return true;
    },
    async jwt({ token }) {
      if (!token?.sub) return token;
      
      const existingUser = await findUserById(token.sub);
      
      if (!existingUser) return token;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      
      return token;
    },
    async session({ session, token }: any) {
      console.log({ sessionToken: token, session });

      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token?.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
