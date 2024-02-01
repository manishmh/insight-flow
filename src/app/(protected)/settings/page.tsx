"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const Settings = () => {
  const user = useCurrentUser();

  const onClick = () => {
    logout()
  };

  return (
    <div>
      {JSON.stringify(user)}
      <button onClick={onClick} type="submit">Sign out</button>
    </div>
  );
};

export default Settings;


// server component example
// import { auth, signOut } from "@/server/auth"

// const Settings = async () => {
//   const session = await auth();

//   return (
//     <div>
//         {JSON.stringify(session)}
//         <form action={async () => {
//           "use server";

//           await signOut();
//         }}>
//           <div className="flex justify-center mt-8">
//             <button type="submit" className="text-blue-400 text-xl">sign out</button>
//           </div>
//         </form>
//     </div>
//   )
// }

// export default Settings