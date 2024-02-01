"use server"

import { db } from "@/lib/db"
import { findUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification-token"

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { success: false, message: "Token does not exist"}
    }

    const tokenDate = new Date(existingToken.expires);
    tokenDate.setHours(tokenDate.getHours());

    const hasExpired = new Date(tokenDate) < new Date();
    if (hasExpired) {
        return { success: false, message: "Token has expired"}
    }

    const existingUser = await findUserByEmail(existingToken.email);
    if (!existingUser) {
        return { success: false, message: "User does not exist" }
    }

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    })

    await db.verificationToken.delete({
        where: {id: existingToken.id}
    })

    return { success: true, message: "Email Verified!"}
}