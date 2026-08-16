import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  try {
    // Test direct database query
    await prisma.$queryRaw`SELECT 1 as test`;
    
    // Count records to verify tables are accessible
    const userCount = await prisma.user.count();
    const leadCount = await prisma.lead.count();
    const tutorCount = await prisma.tutorProfile.count();

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      status: 'HEALTHY',
      database: {
        connection: 'CONNECTED',
        latencyMs: `${latencyMs}ms`,
        counts: {
          users: userCount,
          leads: leadCount,
          tutors: tutorCount,
        },
      },
      serverTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
    });
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      {
        success: false,
        status: 'UNHEALTHY',
        database: {
          connection: 'DISCONNECTED',
          error: error.message || 'Failed to connect to MySQL database',
        },
        serverTime: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
