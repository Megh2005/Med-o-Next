// app/api/patients/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { firstName, lastName, email, phone, birthDate, gender } = await request.json();

    // Create a new patient in the database
    const newPatient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        birthDate: new Date(birthDate), // Ensure it's a Date object
        gender,
      },
    });

    // Return a successful response with the new patient data
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    
    // Handle errors appropriately
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
