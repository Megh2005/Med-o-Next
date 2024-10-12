// app/api/medical-history/[patientId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { patientId: string } }) {
  const { patientId } = params;

  try {
    // Fetch all medical histories for the given patient ID
    const medicalHistories = await prisma.medicalHistory.findMany({
      where: {
        patientId: parseInt(patientId), // Ensure the patientId is an integer
      },
    });

    // Return the fetched medical histories
    return NextResponse.json(medicalHistories);
  } catch (error) {
    console.error("Error fetching medical histories:", error);
    
    // Handle errors appropriately
    return NextResponse.json({ error: "Failed to fetch medical histories" }, { status: 500 });
  }
}
