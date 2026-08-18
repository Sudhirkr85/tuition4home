import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, otpCode, newPassword } = body;

    // =========================================================================
    // ACTION 1: REQUEST OTP FOR PASSWORD RESET
    // =========================================================================
    if (action === 'REQUEST_OTP') {
      if (!email || !email.includes('@')) {
        return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
      }

      const cleanEmail = email.toLowerCase().trim();

      // Verify user exists as a TUTOR
      const user = await prisma.user.findFirst({
        where: { email: cleanEmail },
      });

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'No registered tutor found with this email address.',
        }, { status: 404 });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes expiry

      // Save OTP token
      await prisma.emailOtpToken.create({
        data: {
          email: cleanEmail,
          otpCode: otp,
          expiresAt,
          type: 'RESET_PASSWORD',
        },
      });

      // Send Brevo Email
      const { sendTransactionalEmail } = await import('@/lib/brevo');
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0F172A; margin: 0; font-size: 22px;">🎓 TuitionForHome</h2>
            <p style="color: #64748B; font-size: 12px; margin: 4px 0 0 0;">Password Reset Request • SSSAM Academy</p>
          </div>

          <div style="background-color: #F8FAFC; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #E2E8F0; margin-bottom: 20px;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 12px 0;">Your Password Reset Code is:</p>
            <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #0F6E56; background-color: #ffffff; padding: 12px 24px; border-radius: 8px; display: inline-block; border: 2px dashed #0F6E56;">
              ${otp}
            </div>
            <p style="color: #94A3B8; font-size: 12px; margin: 12px 0 0 0;">Valid for 10 minutes. If you did not request this, please ignore.</p>
          </div>

          <div style="border-top: 1px solid #E2E8F0; margin-top: 24px; padding-top: 16px; text-align: center; font-size: 11px; color: #94A3B8;">
            TuitionForHome Security • SSSAM Academy Sector 14 Gurugram
          </div>
        </div>
      `;

      await sendTransactionalEmail({
        to: [{ email: cleanEmail }],
        subject: `Reset Your Tutor Password (Code: ${otp}) | TuitionForHome`,
        htmlContent,
      });

      return NextResponse.json({
        success: true,
        message: `Password reset code sent to ${cleanEmail}. Please check your inbox.`,
      });
    }

    // =========================================================================
    // ACTION 2: VERIFY OTP & RESET PASSWORD
    // =========================================================================
    if (action === 'RESET_PASSWORD') {
      if (!email || !otpCode || !newPassword) {
        return NextResponse.json({ success: false, error: 'Email, OTP code, and new password are required.' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ success: false, error: 'New password must be at least 6 characters.' }, { status: 400 });
      }

      const cleanEmail = email.toLowerCase().trim();

      // Verify OTP token in database
      const otpRecord = await prisma.emailOtpToken.findFirst({
        where: {
          email: cleanEmail,
          otpCode: otpCode.trim(),
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!otpRecord) {
        return NextResponse.json({ success: false, error: 'Invalid or expired reset code.' }, { status: 400 });
      }

      // Hash the new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update user password
      const user = await prisma.user.update({
        where: { email: cleanEmail },
        data: { passwordHash },
        include: { tutorProfile: true },
      });

      // Delete consumed OTP token
      await prisma.emailOtpToken.delete({
        where: { id: otpRecord.id },
      });

      // If tutorProfile is missing, create draft profile
      let profile = user.tutorProfile;
      if (!profile) {
        profile = await prisma.tutorProfile.create({
          data: {
            userId: user.id,
            status: 'DRAFT',
            experienceYears: 0,
          },
        });
      }

      return NextResponse.json({
        success: true,
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOnboardingComplete: profile.status !== 'DRAFT',
        message: 'Password reset successfully! You are now signed in.',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('[TUTOR_RESET_PASSWORD_ERROR]:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
