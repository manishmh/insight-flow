'use client'

import { useCurrentRole } from "@/hooks/use-current-role"

const AdminPage = () => {
  const role = useCurrentRole();

  return (
    <div>
        current role = {role}
    </div>
  )
}

export default AdminPage