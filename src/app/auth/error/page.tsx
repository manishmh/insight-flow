import { Button } from "@/components/ui/button"
import Link from "next/link"

const AuthErrorPage = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-sm px-4 py-4 rounded-xl shadow-md ">
        <h1 className="font-semibold text-xl mb-8">Oops! something went wrong</h1>
        <Link href="/auth/login">
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full"
          >
            Back to login
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default AuthErrorPage