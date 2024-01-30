'use server';

import * as z from 'zod'
import { loginSchema } from '@/schemas/input-validation';
import { signIn } from '@/server/auth';
import { DEFAULT_LOGIN_REDIRECT_URL } from '@/server/routes';
import { AuthError } from 'next-auth';
import { generateVerificationToken } from '@/lib/token';
import { findUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';

export const login = async (values: z.infer<typeof loginSchema>) => {
    try {
        const validatedFields = loginSchema.safeParse(values);
    
        if (!validatedFields.success) {
            return { success: false, message: "invalid Fields"}
        }
    
        const { email, password } = validatedFields.data;
        const existingUser = await findUserByEmail(email);
    
        if (!existingUser || !existingUser.email || !existingUser.password) {
            return { success: false, message: "Email is not registered"}
        }
    
        if (!existingUser.emailVerified) {
            const verificationToken = await generateVerificationToken(existingUser.email); 
    
            await sendVerificationEmail(
                verificationToken.email,
                verificationToken.token
            );
            
            return { success: true, message: "Confirmation email sent! verify your email"}
        }
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT_URL
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, message: "Invalid credentials"};
                default: 
                    return { success: false, message: "Server Error!. Something went wrong!"};
            }
        }

        throw error;
    }

    return { success: true, message: "logged in successfully" }
}