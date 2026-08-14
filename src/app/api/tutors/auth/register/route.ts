import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address format.' }, { status: 400 });
    }

    // Validate phone number format (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ success: false, error: 'Mobile number must be exactly 10 digits.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'A tutor with this email or mobile number is already registered.' 
      }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User & Default TutorProfile in a database transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
          role: 'TUTOR',
        }
      });

      const profile = await tx.tutorProfile.create({
        data: {
          userId: user.id,
          status: 'DRAFT', // Onboarding in progress
          experienceYears: 0,
        }
      });

      return { user, profile };
    });

    return NextResponse.json({
      success: true,
      userId: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      message: 'Initial registration successful. Please complete your profile.'
    });

  } catch (error: any) {
    console.error('[TUTOR_REGISTER_API_ERROR]:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'An internal server error occurred during registration.' 
    }, { status: 500 });
  }
}
