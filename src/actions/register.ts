"use server"

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import * as z from 'zod'

import { registerSchema } from '@/schemas/input-validation'
import { findUserByEmail } from '@/data/user'

export const register = async (values: z.infer<typeof registerSchema> ) => {
   
   try {
    const validatedFields = registerSchema.safeParse(values);
    
    if (!validatedFields.success) {
        return { success: false, message: "Invalid input validation"} 
    }

    const { email, password, name } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10);

    const exisitingUser = await findUserByEmail(email);
    if (exisitingUser) {
      return { success: false, message: "User already exists"} 
    }

    await db.user.create({ 
      data: { 
          name,
          email,
          password: hashedPassword
      }
    })

    //todo: send verification email

    return { success: true, message: "User successfully created"} 
   }
   catch (err: any) {    
    console.log(err)
    return { error: err.message}
   }
}