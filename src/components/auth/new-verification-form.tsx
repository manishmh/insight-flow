'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BeatLoader} from "react-spinners"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/new-verification"
import { useToast } from "@/components/ui/use-toast"

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast()
  const [loaderState, setLoaderState] = useState(true)

  const onSubmit = useCallback(() => {
    if (!token) {
      toast({ title: "Error", description: "Missing token"})
      return;
    }

    newVerification(token)
    .then((data) => {
      if (!data.success) {
        toast({ title: "Error", description: data.message });
      } else {
        toast({ title: "Success", description: data.message });
      }
      setLoaderState(false)
    })
    .catch(() => {
      toast({title: "Error", description: "Something went wrong!"})
    })
  },[token, toast])

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