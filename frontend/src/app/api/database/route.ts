import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        await prisma.$connect();
        console.log("Prisma connected successfully");
        return NextResponse.json({ message: "Prisma connected successfully" });
    } catch (e) {
        console.error("Error connecting to Prisma", e);
        return NextResponse.json({ error: "Error connecting to Prisma" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
