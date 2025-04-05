import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { findUserByEmail, findUserById } from '@/data/user';
import { db } from '@/lib/db';
import authConfig from '@/server/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

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
  // this method is called only when oAuth provider is being used and not on credentials Auth.
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });

      const existingUser = await db.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser?.defaultDashboardId) {
        const dashboard = await db.dashboard.create({
          data: {
            name: "Sample Board",
            userId: user.id!, // <-- non-null assertion
            isDefault: true,
          },
        });

        await db.user.update({
          where: { id: user.id },
          data: {
            defaultDashboardId: dashboard.id,
          },
        });
      }
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true; // Proceed with OAuth login
        // TODO: allow user login even if account exists with other provider or with credentials.
      }


      // const existingUser = await findUserById(user.id);

      // prevent sign in without email verification
      // if (!existingUser?.emailVerified) return false;

      // if (existingUser.isTwoFactorEnabled) {
      //   const twoFactorconfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      //   if (!twoFactorconfirmation) return false

      //   // delete two factor confirmation for next sign in.
      //   await db.twoFactorConfirmation.delete({
      //     where: { id: twoFactorconfirmation.id }
      //   })
      // }

      return true;
    },
    async jwt({ token }) {
      if (!token?.sub) return token;
      
      const existingUser = await findUserById(token.sub);
      
      if (!existingUser) return token;

      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.defaultDashboardId = existingUser.defaultDashboardId;
      
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
        session.user.defaultDashboardId = token.defaultDashboardId;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
