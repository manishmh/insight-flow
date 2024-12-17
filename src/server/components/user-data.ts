import { auth } from "@/server/auth"

/**
 * get current user for server side components
 * 
 */
export const currentUser = async () => {
    const session = await auth()

    return session?.user
}

/**
 * get current user role for server side components
 * 
 */
export const currentRole = async () => {
    const session = await auth()

    return session?.user.role
}
