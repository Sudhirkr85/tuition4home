import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Query database for admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!adminUser || (adminUser.role !== 'SUPER_ADMIN' && adminUser.role !== 'TELECALLER')) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials or unauthorized account' },
        { status: 401 }
      );
    }

    // Verify bcrypt password hash from database
    if (!adminUser.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Password not set for this account' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error: any) {
    console.error('[ADMIN_LOGIN_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
