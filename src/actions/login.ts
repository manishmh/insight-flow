'use server';

import * as z from 'zod'
import { loginSchema } from '@/schemas/input-validation';

export const login = async (values: z.infer<typeof loginSchema>) => {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "invalid Fields"}
    }

    return {success: "logged in successfully"}
}