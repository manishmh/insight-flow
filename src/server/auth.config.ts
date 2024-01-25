import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/schemas/input-validation';
import bcrypt from 'bcryptjs';

import type { NextAuthConfig } from "next-auth"
import { findUserByEmail } from '@/data/user';

export default {
  providers: [
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
} satisfies NextAuthConfig