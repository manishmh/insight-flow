" user server"

import * as z from 'zod'

import { registerSchema } from '@/schemas/input-validation'

export const register = async (values: z.infer<typeof registerSchema> ) => {
    const validatedFields = registerSchema.safeParse(values);
    
    if (!validatedFields.success) {
        return { error: "Invalid input validation"}
    }

    const { email, password, name } = validatedFields.data


    return { success: "Registered successfully"}

}