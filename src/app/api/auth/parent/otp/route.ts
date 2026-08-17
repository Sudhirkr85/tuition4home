import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTransactionalEmail } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, otpCode, parentName, phone } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // ── Action 1: SEND OTP ──────────────────────────────────────────────────
    if (action === 'SEND_OTP') {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Delete old OTPs for this email
      await prisma.emailOtpToken.deleteMany({
        where: { email: cleanEmail, type: 'PARENT_LOGIN' }
      });

      await prisma.emailOtpToken.create({
        data: {
          email: cleanEmail,
          otpCode: generatedCode,
          type: 'PARENT_LOGIN',
          expiresAt
        }
      });

      // Send branded OTP Email via Brevo
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; background-color: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0F172A; margin: 0; font-size: 22px;">🎓 TuitionForHome</h2>
            <p style="color: #64748B; font-size: 12px; margin: 4px 0 0 0;">SSSAM Academy • Sector 14 Gurugram</p>
          </div>

          <div style="background-color: #F8FAFC; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #E2E8F0; margin-bottom: 20px;">
            <p style="color: #475569; font-size: 14px; margin: 0 0 12px 0;">Your Parent Portal Verification Code is:</p>
            <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #0F6E56; background-color: #ffffff; padding: 12px 24px; border-radius: 8px; display: inline-block; border: 2px dashed #0F6E56;">
              ${generatedCode}
            </div>
            <p style="color: #94A3B8; font-size: 12px; margin: 12px 0 0 0;">Valid for 5 minutes. Please do not share this code.</p>
          </div>

          <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin: 0;">
            Use this code to securely access your Parent Dashboard, review assigned educators, and manage home tuition schedules.
          </p>

          <div style="border-top: 1px solid #E2E8F0; margin-top: 24px; padding-top: 16px; text-align: center; font-size: 11px; color: #94A3B8;">
            TuitionForHome Support Desk • Helpline: +91 92170 31899<br />
            M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram 122001
          </div>
        </div>
      `;

      await sendTransactionalEmail({
        to: [{ email: cleanEmail, name: parentName || 'Parent' }],
        subject: `Your Login Verification Code: ${generatedCode} | TuitionForHome`,
        htmlContent,
      });

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${cleanEmail}. Please check your inbox.`,
      });
    }

    // ── Action 2: VERIFY OTP & LOGIN ────────────────────────────────────────
    if (action === 'VERIFY_OTP') {
      if (!otpCode) {
        return NextResponse.json({ success: false, error: '6-digit OTP code is required.' }, { status: 400 });
      }

      // Check OTP token in DB with real expiry check
      const token = await prisma.emailOtpToken.findFirst({
        where: {
          email: cleanEmail,
          otpCode: otpCode.trim(),
          type: 'PARENT_LOGIN',
          expiresAt: { gte: new Date() }
        }
      });

      if (!token) {
        return NextResponse.json({ success: false, error: 'Invalid or expired OTP code. Please try again.' }, { status: 400 });
      }

      // Delete used OTP
      await prisma.emailOtpToken.delete({ where: { id: token.id } });

      // Find or create User with role PARENT
      let user = await prisma.user.findUnique({
        where: { email: cleanEmail }
      });

      const defaultName = parentName || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: cleanEmail,
            name: defaultName,
            phone: phone || null,
            role: 'PARENT',
            emailVerified: new Date(),
          }
        });
      } else if (parentName && user.name !== parentName) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name: parentName }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Parent authenticated successfully.',
        parent: {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role
        }
      });
    }

    // ── Action 3: GOOGLE ONE-TAP LOGIN MOCK / SYNC ──────────────────────────
    if (action === 'GOOGLE_LOGIN') {
      const googleName = parentName || cleanEmail.split('@')[0];

      let user = await prisma.user.findUnique({
        where: { email: cleanEmail }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: cleanEmail,
            name: googleName,
            role: 'PARENT',
            emailVerified: new Date(),
          }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Google login successful.',
        parent: {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role
        }
      });
    }

    // ── Action 4: UPDATE PHONE NUMBER POST-VERIFICATION ────────────────────
    if (action === 'UPDATE_PHONE') {
      if (!phone) {
        return NextResponse.json({ success: false, error: 'Mobile number is required.' }, { status: 400 });
      }

      const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);
      if (cleanPhone.length < 10) {
        return NextResponse.json({ success: false, error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
      }

      const user = await prisma.user.update({
        where: { email: cleanEmail },
        data: { phone: cleanPhone }
      });

      return NextResponse.json({
        success: true,
        message: 'Phone number updated successfully.',
        parent: {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });

  } catch (error: any) {
    console.error('[PARENT_OTP_API_ERROR]:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed. Please try again.' }, { status: 500 });
  }
}
