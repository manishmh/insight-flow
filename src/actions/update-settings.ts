"use server"

import { db } from "@/lib/db"
import { settingsSchema } from "@/schemas/input-validation"
import * as z from 'zod'
import { findUserByEmail, findUserById } from "@/data/user"
import { currentUser } from "@/server/components/user-data"

export const updateSettings = async (values: z.infer<typeof settingsSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { message: "Unauthorized "}
    }

    const dbUser = await findUserById(user.id)

    if (!dbUser) {
        return { message: "Unauthorized"}
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values
        }
    })

    return { message: "successfully updated name"}
}