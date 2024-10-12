// app/api/medical-history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { description, diagnosis, treatment, patientId } = await request.json();

    // Create a new medical history entry in the database
    const newMedicalHistory = await prisma.medicalHistory.create({
      data: {
        description,
        diagnosis,
        treatment,
        patient: {
          connect: { id: patientId }, // Connect to the existing patient
        },
      },
    });

    // Return a successful response with the new medical history data
    return NextResponse.json(newMedicalHistory, { status: 201 });
  } catch (error) {
    console.error("Error creating medical history:", error);
    
    // Handle errors appropriately
    return NextResponse.json({ error: "Failed to create medical history" }, { status: 500 });
  }
}
