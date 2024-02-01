import { useSession } from "next-auth/react"

/**
 * 
 * @returns to ge the current user role for client components
 */
export const useCurrentRole = () => {
    const session = useSession();
    return session.data?.user.role;
}
