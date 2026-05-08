import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { findUserByEmail, findUserById } from '@/data/user';
import { db } from '@/lib/db';
import authConfig from '@/server/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/schemas/input-validation';
import bcrypt from 'bcryptjs';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    ...(authConfig.providers || []),
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await findUserByEmail(email);
          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ],
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

      const defaultDashboard = existingUser?.defaultDashboardId
        ? await db.dashboard.findFirst({
            where: { id: existingUser.defaultDashboardId, userId: user.id! },
            select: { id: true },
          })
        : null;

      if (!defaultDashboard) {
        const firstDashboard = await db.dashboard.findFirst({
          where: { userId: user.id! },
          orderBy: { id: "asc" },
          select: { id: true },
        });

        const defaultDashboardId = firstDashboard?.id ?? (
          await db.dashboard.create({
            data: {
              name: "Sample Board",
              userId: user.id!,
              isDefault: true,
              boards: {
                create: {
                  name: "Main Board",
                  width: 500,
                  height: 360,
                },
              },
            },
          })
        ).id;

        await db.user.update({
          where: { id: user.id },
          data: {
            defaultDashboardId,
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
});
