import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tutorId } = body;

    if (!tutorId) {
      return NextResponse.json({ success: false, error: 'Tutor ID is required.' }, { status: 400 });
    }

    // Update TutorProfile to ACTIVE_VERIFIED and set verified flag to true
    await prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        status: 'ACTIVE_VERIFIED',
        isVerified: true
      }
    });

    console.log(`[TUTOR APPROVED]: Profile ${tutorId} status updated to ACTIVE_VERIFIED.`);

    return NextResponse.json({
      success: true,
      message: 'Tutor profile approved and activated successfully.'
    });

  } catch (error: any) {
    console.error('[COUNSELOR_APPROVE_TUTOR_ERROR]:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to approve tutor.'
    }, { status: 500 });
  }
}
