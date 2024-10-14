import LoginForm from "@/components/auth/login-form"
import { BackgroundBeams } from "@/components/ui/design/background-beam"

const Login = () => {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] h-screen ">
      <BackgroundBeams />
      <div className="relative z-10 h-full">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login