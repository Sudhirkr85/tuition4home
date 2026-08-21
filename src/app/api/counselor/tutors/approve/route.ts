import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTutorVerifiedEmail } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tutorId, action, docType, decision, rejectionNote } = body;

    if (!tutorId) {
      return NextResponse.json({ success: false, error: 'Tutor ID is required.' }, { status: 400 });
    }

    // Action 1: Individual Document Review (ID_DOC or DEGREE_DOC)
    if (action === 'REVIEW_DOCUMENT') {
      if (!docType || !decision) {
        return NextResponse.json({ success: false, error: 'Document type and decision are required.' }, { status: 400 });
      }

      const updateData: any = {};

      if (docType === 'ID_DOC') {
        updateData.idStatus = decision === 'APPROVED' ? 'APPROVED' : 'REJECTED';
        updateData.idRejectionNote = decision === 'REJECTED' ? (rejectionNote || 'Document image is not clear. Please re-upload a clear copy.') : null;
      } else if (docType === 'DEGREE_DOC') {
        updateData.degreeStatus = decision === 'APPROVED' ? 'APPROVED' : 'REJECTED';
        updateData.degreeRejectionNote = decision === 'REJECTED' ? (rejectionNote || 'Degree document is not clear. Please re-upload a valid certificate.') : null;
      }

      await (prisma.tutorKYC as any).updateMany({
        where: { tutorId },
        data: updateData
      });

      // If document is rejected, update profile status to REJECTED so tutor knows re-upload is required
      if (decision === 'REJECTED') {
        await prisma.tutorProfile.update({
          where: { id: tutorId },
          data: { status: 'REJECTED' }
        });
      }

      return NextResponse.json({
        success: true,
        message: `Document ${docType} successfully marked as ${decision}.`
      });
    }

    // Action: Toggle Admin Deactivation / Activation
    if (action === 'TOGGLE_AVAILABILITY') {
      const { isAvailable } = body;
      await prisma.tutorProfile.update({
        where: { id: tutorId },
        data: {
          isAvailable: !!isAvailable,
          status: isAvailable ? 'ACTIVE_VERIFIED' : 'SUSPENDED'
        }
      });
      return NextResponse.json({
        success: true,
        message: `Admin status updated to ${isAvailable ? 'ACTIVE & VISIBLE' : 'SUSPENDED (DEACTIVATED BY ADMIN)'}.`
      });
    }

    // Action: Final Profile Approval & Activation
    const updatedProfile = await prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        status: 'ACTIVE_VERIFIED',
        isVerified: true,
        isAvailable: true
      },
      include: {
        user: true
      }
    });

    // Mark both Aadhaar/Govt ID & Degree Certificate documents as APPROVED together
    const existingKyc = await (prisma.tutorKYC as any).findFirst({ where: { tutorId } });
    if (existingKyc) {
      await (prisma.tutorKYC as any).update({
        where: { id: existingKyc.id },
        data: {
          idStatus: 'APPROVED',
          degreeStatus: 'APPROVED',
        }
      });
    } else {
      await (prisma.tutorKYC as any).create({
        data: {
          tutorId,
          idStatus: 'APPROVED',
          degreeStatus: 'APPROVED',
        }
      });
    }

    // Send congratulatory email to tutor upon complete verification
    if (updatedProfile.user?.email) {
      try {
        await sendTutorVerifiedEmail(updatedProfile.user.email, updatedProfile.user.name);
      } catch (mailErr) {
        console.error('Failed to dispatch tutor verification email:', mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Tutor profile approved and activated successfully.'
    });

  } catch (error: any) {
    console.error('[COUNSELOR_APPROVE_TUTOR_ERROR]:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process approval.'
    }, { status: 500 });
  }
}
