import { db } from "@/lib/db";

export const findUserByEmail = (email: string) => {
    try{
        const user = db.user.findUnique({ where: { email } });

        return user;
    } catch(error){
        return null;
    }
}

export const findUserById = (id: string) => {
    try{
        const user = db.user.findUnique({ where: { id } });

        return user;
    } catch(error){
        return null;
    }
}