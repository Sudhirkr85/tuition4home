import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTutorVerifiedEmail, sendTutorKYCRejectedEmail } from '@/lib/brevo';
import { verifyAdminOrCounselor } from '@/lib/admin-auth';

export async function POST(req: Request) {
  const authUser = await verifyAdminOrCounselor(req);
  if (!authUser) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin or Counselor access required.' },
      { status: 401 }
    );
  }

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
      const note = rejectionNote || (docType === 'ID_DOC' ? 'Government ID photo is not clear or unreadable. Please re-upload a clear copy.' : 'Degree certificate document is not clear. Please re-upload a valid degree or marksheet.');

      if (docType === 'ID_DOC') {
        updateData.idStatus = decision === 'APPROVED' ? 'APPROVED' : 'REJECTED';
        updateData.idRejectionNote = decision === 'REJECTED' ? note : null;
      } else if (docType === 'DEGREE_DOC') {
        updateData.degreeStatus = decision === 'APPROVED' ? 'APPROVED' : 'REJECTED';
        updateData.degreeRejectionNote = decision === 'REJECTED' ? note : null;
      }

      await (prisma.tutorKYC as any).updateMany({
        where: { tutorId },
        data: updateData
      });

      // If document is rejected, update profile status to REJECTED and send alert email
      if (decision === 'REJECTED') {
        const prof = await prisma.tutorProfile.update({
          where: { id: tutorId },
          data: { status: 'REJECTED', isAvailable: false },
          include: { user: true }
        });

        if (prof.user?.email) {
          try {
            const docLabel = docType === 'ID_DOC' ? 'Government ID Proof (Aadhaar/PAN)' : 'Degree Certificate / Marksheet';
            await sendTutorKYCRejectedEmail(prof.user.email, prof.user.name, docLabel, note);
          } catch (err) {
            console.error('Failed to send KYC rejection email:', err);
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: `Document ${docType} successfully marked as ${decision}.`
      });
    }

    // Action 2: Reject Entire Tutor Profile
    if (action === 'REJECT_PROFILE') {
      const updatedProfile = await prisma.tutorProfile.update({
        where: { id: tutorId },
        data: {
          status: 'REJECTED',
          isVerified: false,
          isAvailable: false,
        },
        include: { user: true },
      });

      if (updatedProfile.user?.email) {
        try {
          await sendTutorKYCRejectedEmail(
            updatedProfile.user.email,
            updatedProfile.user.name,
            'Profile Verification',
            rejectionNote || 'Profile credentials or documentation did not meet verification criteria.'
          );
        } catch (err) {
          console.error('Failed to send profile rejection email:', err);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Tutor profile has been marked REJECTED and hidden from parent search.',
      });
    }

    // Action 3: Suspend / Deactivate Tutor Profile
    if (action === 'SUSPEND_PROFILE' || (action === 'TOGGLE_AVAILABILITY' && !body.isAvailable)) {
      await prisma.tutorProfile.update({
        where: { id: tutorId },
        data: {
          isAvailable: false,
          status: 'SUSPENDED',
        },
      });
      return NextResponse.json({
        success: true,
        message: 'Tutor profile status updated to SUSPENDED (Deactivated by Admin).',
      });
    }

    // Action 4: Final Profile Approval & Activation / Re-Activation
    if (action === 'APPROVE_FINAL_PROFILE' || action === 'REACTIVATE_PROFILE' || (action === 'TOGGLE_AVAILABILITY' && body.isAvailable)) {
      const updatedProfile = await prisma.tutorProfile.update({
        where: { id: tutorId },
        data: {
          status: 'ACTIVE_VERIFIED',
          isVerified: true,
          isAvailable: true,
        },
        include: {
          user: true,
        },
      });

      // Mark both Aadhaar/Govt ID & Degree Certificate documents as APPROVED together
      const existingKyc = await (prisma.tutorKYC as any).findFirst({ where: { tutorId } });
      if (existingKyc) {
        await (prisma.tutorKYC as any).update({
          where: { id: existingKyc.id },
          data: {
            idStatus: 'APPROVED',
            degreeStatus: 'APPROVED',
            idRejectionNote: null,
            degreeRejectionNote: null,
          },
        });
      } else {
        await (prisma.tutorKYC as any).create({
          data: {
            tutorId,
            idStatus: 'APPROVED',
            degreeStatus: 'APPROVED',
          },
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
        message: 'Tutor profile approved and activated successfully. Live across Gurgaon & NCR matching searches.',
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action specified.' }, { status: 400 });

  } catch (error: any) {
    console.error('[COUNSELOR_APPROVE_TUTOR_ERROR]:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process approval.'
    }, { status: 500 });
  }
}
