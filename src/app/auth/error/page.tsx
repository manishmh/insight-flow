import { Button } from "@/components/ui/button"
import Link from "next/link"

const AuthErrorPage = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-sm px-6 py-4 rounded-xl shadow-md border border-gray-300">
        <h1 className="font-semibold text-xl text-center mb-8">Oops! something went wrong</h1>
        <Link href="/auth/login">
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full bg-[#2a3a5e] hover:bg-[#344774] text-white"
          >
            Back to login
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default AuthErrorPage