'use server';

import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { findUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/token';
import { loginSchema } from '@/schemas/input-validation';
import { signIn } from '@/server/auth';
import { DEFAULT_LOGIN_REDIRECT_URL } from '@/server/routes';
import { AuthError } from 'next-auth';
import * as z from 'zod';

export const login = async (
    values: z.infer<typeof loginSchema>,
    callBackurl?: string | null
    ) => {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "invalid Fields"}
    }

    const { email, password, code } = validatedFields.data;
    const existingUser = await findUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { success: false, message: "Email is not registered"}
    }

    if (existingUser.defaultDashboardId === null) {
        const dashboard = await db.dashboard.create({
            data: {
                name: "Sample Board", 
                userId: existingUser.id,
                isDefault: true
            }
        })

        await db.user.update({
            where: { id: existingUser.id },
            data: {
                defaultDashboardId: dashboard.id
            }
        })
    }

    // if (!existingUser.emailVerified) {
    //     const verificationToken = await generateVerificationToken(existingUser.email); 

    //     await sendVerificationEmail(
    //         verificationToken.email,
    //         verificationToken.token
    //     );
        
    //     return { success: true, message: "Confirmation email sent! verify your email"}
    // }

    // if (existingUser.isTwoFactorEnabled && existingUser.email) {
    //     if (code) {
    //         const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

    //         if (!twoFactorToken) {
    //             return { success: false, message: "Invalid code"}
    //         }

    //         const hasExpired = new Date(twoFactorToken.expires) < new Date();
    //         if (hasExpired) {
    //             return { success: false, message: "Token has expired, generate new one"};
    //         }

    //         if (twoFactorToken.token !== code) {
    //             return { success: false, message: "Invalid code"}
    //         }

    //         await db.twoFactorToken.delete({
    //             where: { id: twoFactorToken.id }
    //         })

    //         const existignConfirmation = await getTwoFactorConfirmationByUserId(twoFactorToken.id);

    //         if (existignConfirmation) {
    //             db.twoFactorConfirmation.delete({
    //                 where: { id: existignConfirmation.id }
    //             })
    //         }

    //         await db.twoFactorConfirmation.create({
    //             data: {
    //                 userId: existingUser.id
    //             }
    //         })

    //     } else {
    //         const twoFactorToken = await generateTwoFactorToken(existingUser.email)
    
    //         await sendTwoFactorTokenEmail(
    //             twoFactorToken.email,
    //             twoFactorToken.token,
    //         )
    
    //         return { twoFactor: true }
    //     }
    // }

    try{
        await signIn("credentials", {
            email,
            password,
            redirectTo: callBackurl || DEFAULT_LOGIN_REDIRECT_URL
        })
        
        return { success: true, message: "logged in successfully" }
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
}