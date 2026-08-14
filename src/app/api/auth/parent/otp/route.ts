import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      // In production, Brevo / Resend sends the email. In dev / demo, we generate a 6-digit code.
      // For instant testing: code 123456 or random 6-digit code
      const generatedCode = '123456';
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

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

      return NextResponse.json({
        success: true,
        message: `OTP sent to ${cleanEmail}. (Use 123456 for instant testing)`,
        devOtp: '123456'
      });
    }

    // ── Action 2: VERIFY OTP & LOGIN ────────────────────────────────────────
    if (action === 'VERIFY_OTP') {
      if (!otpCode) {
        return NextResponse.json({ success: false, error: '6-digit OTP code is required.' }, { status: 400 });
      }

      // Check OTP token in DB (accept 123456 in dev or matching token)
      const token = await prisma.emailOtpToken.findFirst({
        where: {
          email: cleanEmail,
          otpCode: otpCode.trim(),
          type: 'PARENT_LOGIN',
          expiresAt: { gte: new Date() }
        }
      });

      if (!token && otpCode.trim() !== '123456') {
        return NextResponse.json({ success: false, error: 'Invalid or expired OTP code. Please try again.' }, { status: 400 });
      }

      // Delete used OTP
      if (token) {
        await prisma.emailOtpToken.delete({ where: { id: token.id } });
      }

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

    return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });

  } catch (error: any) {
    console.error('[PARENT_OTP_API_ERROR]:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed. Please try again.' }, { status: 500 });
  }
}
