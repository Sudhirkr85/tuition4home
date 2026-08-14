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

    // Output OTP in system console for developer/tester reference
    console.log(`\n======================================================`);
    console.log(`🔑 [OTP REQUESTED]: Sent to "${contact}"`);
    console.log(`👉 OTP CODE: ${otpCode}`);
    console.log(`🕒 Expires At: ${expiresAt.toLocaleString()}`);
    console.log(`======================================================\n`);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${contact}. (For testing, check console logs!)`
    });

  } catch (error: any) {
    console.error('[TUTOR_SEND_OTP_API_ERROR]:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send OTP.'
    }, { status: 500 });
  }
}
