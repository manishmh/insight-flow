import { useSession } from 'next-auth/react'

/**
 * 
 * @returns Current user data for client component
 */
export const useCurrentUser = () => {
  const session = useSession()
  return session.data?.user;
}
