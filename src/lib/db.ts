import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined; 
}
// next.js hot reload will create many different PrismaClient instances so we need to check if they exist then create new client
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;