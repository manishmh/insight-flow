import { auth, signOut } from "@/server/auth"

const Settings = async () => {
  const session = await auth();

  return (
    <div>
        {JSON.stringify(session)}
        <form action={async () => {
          "use server";

          await signOut();
        }}>
          <div className="flex justify-center mt-8">
            <button type="submit" className="text-blue-400 text-xl">sign out</button>
          </div>
        </form>
    </div>
  )
}

export default Settings