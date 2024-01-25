'use server';

import * as z from 'zod'
import { loginSchema } from '@/schemas/input-validation';
import { signIn } from '@/server/auth';
import { DEFAULT_LOGIN_REDIRECT_URL } from '@/server/routes';
import { AuthError } from 'next-auth';

export const login = async (values: z.infer<typeof loginSchema>) => {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { statusCode: 400, error: "invalid Fields"}
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT_URL
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { statusCode: 400, error: "Invalid credentials"};
                default: 
                    return { statusCode: 400, error: "Something went wrong!"};
            }
        }

        throw error;
    }

    return {success: "logged in successfully"}
}