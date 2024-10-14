import RegisterForm from '@/components/auth/register-form'
import React from 'react'
import { BackgroundBeams } from '@/components/ui/design/background-beam'

const Register = () => {
  return (
     <div className="bg-white dark:bg-[#0a0a0a] h-screen">
      <BackgroundBeams />
      <div className="relative z-10 h-full">
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register