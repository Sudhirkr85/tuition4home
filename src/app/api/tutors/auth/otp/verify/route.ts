import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contact, otpCode } = body;

    if (!contact || !otpCode) {
      return NextResponse.json({ success: false, error: 'Contact and OTP code are required.' }, { status: 400 });
    }

    // Find the valid OTP in the database
    const otpRecord = await prisma.emailOtpToken.findFirst({
      where: {
        email: contact,
        otpCode,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!otpRecord) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP code.' }, { status: 400 });
    }

    // OTP verified, consume it (delete it so it cannot be reused)
    await prisma.emailOtpToken.delete({
      where: { id: otpRecord.id }
    });

    // Check if the user exists with this email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: contact },
          { phone: contact }
        ]
      },
      include: {
        tutorProfile: true
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No registered tutor found with this email or mobile. Please register first.'
      }, { status: 404 });
    }

    if (user.role !== 'TUTOR') {
      return NextResponse.json({
        success: false,
        error: 'Access denied. This login is strictly for verified tutors.'
      }, { status: 403 });
    }

    // If tutorProfile is missing (just in case), create it
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
      message: 'OTP verification successful. Welcome back!'
    });

  } catch (error: any) {
    console.error('[TUTOR_VERIFY_OTP_API_ERROR]:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to verify OTP.'
    }, { status: 500 });
  }
}
