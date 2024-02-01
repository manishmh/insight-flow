import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await db.paswordResetToken.findUnique({
            where: {
                token
            }
        })

        return passwordResetToken;
    } catch (error) {
        return null; 
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.paswordResetToken.findFirst({
            where: {
                email
            }
        })

        return passwordResetToken;
    } catch (error) {
        return null; 
    }
}