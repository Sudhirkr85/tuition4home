import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contact, password } = body; // contact can be email or mobile

    if (!contact || !password) {
      return NextResponse.json({ success: false, error: 'Email/Mobile and Password are required.' }, { status: 400 });
    }

    const cleanContact = contact.trim();
    const cleanEmail = cleanContact.toLowerCase();

    // Find the user by email or mobile number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { phone: cleanContact }
        ]
      },
      include: {
        tutorProfile: true
      }
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, error: 'Invalid credentials. Please try again.' }, { status: 401 });
    }

    if (user.role !== 'TUTOR') {
      return NextResponse.json({ success: false, error: 'Access denied. Account is not registered as a Tutor.' }, { status: 403 });
    }

    // Compare the password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials. Please try again.' }, { status: 401 });
    }

    // Check if onboarding is complete
    let profile = user.tutorProfile;
    if (!profile) {
      profile = await prisma.tutorProfile.create({
        data: {
          userId: user.id,
          status: 'DRAFT',
          experienceYears: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isOnboardingComplete: profile.status !== 'DRAFT',
      message: 'Login successful. Welcome!'
    });

  } catch (error: any) {
    console.error('[TUTOR_LOGIN_API_ERROR]:', error);
    return NextResponse.json({
      success: false,
      error: 'An internal server error occurred during login.'
    }, { status: 500 });
  }
}
