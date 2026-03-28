"use server"

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const GUEST_EMAIL = "guest@insightflow.com";
const GUEST_PASSWORD_PLAIN = "Guest1234!";

export const InitializeGuestAccount = async () => {
    try {
        let guestUser = await db.user.findUnique({
            where: { email: GUEST_EMAIL }
        });

        if (!guestUser) {
            const hashedPassword = await bcrypt.hash(GUEST_PASSWORD_PLAIN, 10);
            guestUser = await db.user.create({
                data: {
                    name: "Guest User",
                    email: GUEST_EMAIL,
                    password: hashedPassword,
                    emailVerified: new Date(),
                }
            });

            // Create a default dashboard for the guest
            const dashboard = await db.dashboard.create({
                data: {
                    name: "Resume Demo Dashboard",
                    userId: guestUser.id,
                    isDefault: true,
                }
            });

            // Update user with default dashboard
            await db.user.update({
                where: { id: guestUser.id },
                data: { defaultDashboardId: dashboard.id }
            });

            // Create some dummy boards / tables
            await db.board.create({
                data: {
                    name: "Sample Analytics",
                    dashboardId: dashboard.id,
                    width: 400,
                    height: 300
                }
            });

            await db.board.create({
                data: {
                    name: "Visitor Growth",
                    dashboardId: dashboard.id,
                    width: 500,
                    height: 300
                }
            });
        }

        return { success: true, message: "Guest account ready." };
    } catch (error: any) {
        console.error("Failed to initialize guest account:", error);
        return { success: false, message: error.message };
    }
}
