'use server'

import bcrypt from 'bcryptjs'
import { newPasswordSchema } from "@/schemas/input-validation"
import * as z from 'zod';
import { db } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { findUserByEmail } from '@/data/user';

const NewPassoword = async (
    values: z.infer<typeof newPasswordSchema>,
    token?: string | null
) => {
    if (!token) {
        return { success: false, message: "Missing token"}
    }

    const validatedFields = newPasswordSchema.safeParse(values)
    if (!validatedFields.success) {
        return { success: false, message: "Invalid credentials"}
    }

    const exisitingToken = await getPasswordResetTokenByToken(token);
    if (!exisitingToken) {
        return { success: false, message: "Token does no exist"}
    }

    const hasExpired = new Date(exisitingToken.expires) < new Date();

    if (hasExpired) {
        return { success: false, message: "reset password token has expired! generate new token"}
    }

    const exisitingUser = await findUserByEmail(exisitingToken.email);
    if (!exisitingUser) {
        return { success: false, message: "Email does not exist"}
    }

    const { password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: { id: exisitingUser.id },
        data: {
            password: hashedPassword
        }
    })

    await db.paswordResetToken.delete({
        where: {id: exisitingToken.id},
    });

    return { success: true, message: "Password has been reset!"}

}

export default NewPassoword