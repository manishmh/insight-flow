import LoginForm from "@/components/auth/login-form"
import { BackgroundBeams } from "@/components/ui/design/background-beam"

const Login = () => {
  return (
    <div className="bg-white dark:bg-[#0a0a0a]">
      <BackgroundBeams />
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login