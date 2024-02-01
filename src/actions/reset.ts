"use server"

import { resetSchema } from "@/schemas/input-validation"
import { findUserByEmail } from "@/data/user"
import * as z from 'zod'
import { sendPasswordResetEmail} from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/token"

export const reset = async (values: z.infer<typeof resetSchema>) => {
    const validatedFields = resetSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "Invalid email!"}
    }
    const { email } = validatedFields.data;
    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
        return { success: false, message: "User not found"}
    }

    const passwordResettoken = await generatePasswordResetToken(email)

    await sendPasswordResetEmail(
        passwordResettoken.email, 
        passwordResettoken.token
    )

    return { success: true, message: "Resent email sent successfully"}
}
