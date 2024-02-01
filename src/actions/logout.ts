"use server"

import { signOut } from "@/server/auth"

export const logout = async () => {

    // some server stuff if you want to clear user data ro anything after logout
    await signOut()
}
