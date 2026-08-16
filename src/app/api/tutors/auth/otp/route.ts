import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contact } = body; // This can be email or phone number

    if (!contact) {
      return NextResponse.json({ success: false, error: 'Email or Mobile number is required.' }, { status: 400 });
    }

    // Generate a random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes expiry

    // Save the OTP in the database
    await prisma.emailOtpToken.create({
      data: {
        email: contact, // We store it in the email field (can be email or mobile)
        otpCode,
        expiresAt,
        type: 'LOGIN_REGISTER',
      }
    });

    // If contact is an email, deliver via Brevo Transactional Email
    if (contact.includes('@')) {
      const { sendTransactionalEmail } = await import('@/lib/brevo');
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0F172A; margin: 0; font-size: 22px;">🎓 TuitionForHome</h2>
            <p style="color: #64748B; font-size: 12px; margin: 4px 0 0 0;">Educator Portal • SSSAM Academy</p>
          </div>

          <div style="background-color: #F8FAFC; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #E2E8F0; margin-bottom: 20px;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 12px 0;">Your Tutor Verification Code is:</p>
            <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #0F6E56; background-color: #ffffff; padding: 12px 24px; border-radius: 8px; display: inline-block; border: 2px dashed #0F6E56;">
              ${otpCode}
            </div>
            <p style="color: #94A3B8; font-size: 12px; margin: 12px 0 0 0;">Valid for 10 minutes. Please do not share this code.</p>
          </div>

          <div style="border-top: 1px solid #E2E8F0; margin-top: 24px; padding-top: 16px; text-align: center; font-size: 11px; color: #94A3B8;">
            TuitionForHome Educator Desk • SSSAM Academy Sector 14 Gurugram
          </div>
        </div>
      `;

      await sendTransactionalEmail({
        to: [{ email: contact.toLowerCase().trim() }],
        subject: `Your Educator Portal Verification Code: ${otpCode} | TuitionForHome`,
        htmlContent,
      });
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${contact}. Please check your inbox.`
    });

  } catch (error: any) {
    console.error('[TUTOR_SEND_OTP_API_ERROR]:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send OTP.'
    }, { status: 500 });
  }
}
