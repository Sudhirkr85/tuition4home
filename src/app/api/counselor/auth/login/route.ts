import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Only allow TELECALLER or SUPER_ADMIN roles
    let counselorUser = null;
    try {
      counselorUser = await prisma.user.findFirst({
        where: {
          email: cleanEmail,
          role: { in: ['TELECALLER', 'SUPER_ADMIN'] },
        },
      });
    } catch (dbErr) {
      console.error('[COUNSELOR_LOGIN_DB]:', dbErr);
      return NextResponse.json({ success: false, error: 'Database error. Please try again.' }, { status: 500 });
    }

    if (!counselorUser) {
      return NextResponse.json({ success: false, error: 'No counselor account found with this email. Contact your admin.' }, { status: 401 });
    }

    if (!counselorUser.passwordHash) {
      return NextResponse.json({ success: false, error: 'Account password not set. Contact admin to reset.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, counselorUser.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Incorrect password.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Counselor login successful',
      user: {
        id: counselorUser.id,
        name: counselorUser.name,
        email: counselorUser.email,
        role: counselorUser.role,
        phone: counselorUser.phone || '',
      },
    });
  } catch (error: any) {
    console.error('[COUNSELOR_LOGIN_ERROR]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error during login' }, { status: 500 });
  }
}
