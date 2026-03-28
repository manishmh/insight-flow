"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/server/components/user-data";
import { revalidatePath } from "next/cache";

export const updateUserProfile = async (name: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.user.update({
      where: { id: user.id },
      data: { name },
    });

    revalidatePath("/dashboard/profile");
    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Something went wrong!" };
  }
};
