'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BeatLoader} from "react-spinners"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/new-verification"
import { toast } from "sonner"

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loaderState, setLoaderState] = useState(true)

  const onSubmit = useCallback(() => {
    if (!token) {
      toast.error("Missing token")
      return;
    }

    newVerification(token)
    .then((data) => {
      if (!data.success) {
        toast.error(data.message)
      } else {
        toast.success(data.message)
      }
      setLoaderState(false)
    })
    .catch(() => {
      toast.error("Something went wrong")
    })
  },[token])

  useEffect(() => {
    onSubmit();
  }, [onSubmit])

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-sm px-8 py-12 rounded-xl shadow-md bg-gray-900 ">
        <h1 className="font-semibold text-xl mb-8 text-center">Confirming your verification</h1>
        <Link href="/auth/login">
          {loaderState && (
            <div className="flex justify-center my-4">
              <BeatLoader />
            </div>
          )}
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

export default NewVerificationForm