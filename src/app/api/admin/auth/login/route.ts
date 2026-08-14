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

    // Find admin user in database
    let adminUser = null;
    try {
      adminUser = await prisma.user.findFirst({
        where: {
          email: cleanEmail,
          role: 'SUPER_ADMIN',
        },
      });
    } catch (dbErr) {
      console.warn('DB lookup error in admin login:', dbErr);
    }

    // If user not yet in DB, check hardcoded default admin credentials
    if (!adminUser) {
      if (cleanEmail === 'sudhir@gmail.com' && password === '1234567890') {
        // Automatically upsert into database if possible
        try {
          const passwordHash = await bcrypt.hash('1234567890', 10);
          adminUser = await prisma.user.upsert({
            where: { email: 'sudhir@gmail.com' },
            update: {
              passwordHash,
              role: 'SUPER_ADMIN',
              name: 'Sudhir Admin',
            },
            create: {
              name: 'Sudhir Admin',
              email: 'sudhir@gmail.com',
              passwordHash,
              role: 'SUPER_ADMIN',
            },
          });
        } catch (createErr) {
          console.warn('Fallback admin creation in DB:', createErr);
        }

        return NextResponse.json({
          success: true,
          message: 'Admin authentication successful',
          user: {
            name: 'Sudhir Admin',
            email: 'sudhir@gmail.com',
            role: 'SUPER_ADMIN',
          },
        });
      }

      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials or unauthorized account' },
        { status: 401 }
      );
    }

    // Verify password hash
    if (adminUser.passwordHash) {
      const isValid = await bcrypt.compare(password, adminUser.passwordHash);
      if (!isValid) {
        // Also check plain fallback for sudhir@gmail.com
        if (cleanEmail === 'sudhir@gmail.com' && password === '1234567890') {
          // Re-hash and update password
          const newHash = await bcrypt.hash('1234567890', 10);
          await prisma.user.update({
            where: { id: adminUser.id },
            data: { passwordHash: newHash },
          });
        } else {
          return NextResponse.json(
            { success: false, error: 'Incorrect password' },
            { status: 401 }
          );
        }
      }
    } else if (cleanEmail === 'sudhir@gmail.com' && password === '1234567890') {
      const newHash = await bcrypt.hash('1234567890', 10);
      await prisma.user.update({
        where: { id: adminUser.id },
        data: { passwordHash: newHash },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
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
