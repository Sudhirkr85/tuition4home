import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GURGAON_LOCALITIES } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch active localities from database
    const dbLocalities = await prisma.localitySEO.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        name: true,
        pincode: true,
      },
    });

    // 2. Fetch tutor service areas with minimal columns
    const activeTutors = await prisma.tutorProfile.findMany({
      where: { status: 'ACTIVE_VERIFIED', isAvailable: true },
      select: { serviceAreas: true },
    });

    // Calculate real-time tutor count per sector
    const sectorCounts: { [key: string]: number } = {};
    activeTutors.forEach((t) => {
      let areas: string[] = [];
      try {
        areas = t.serviceAreas ? JSON.parse(t.serviceAreas) : [];
      } catch {
        areas = t.serviceAreas ? t.serviceAreas.split(',').map((s) => s.trim()) : [];
      }
      areas.forEach((area) => {
        const lower = area.toLowerCase().trim();
        sectorCounts[lower] = (sectorCounts[lower] || 0) + 1;
      });
    });

    // Build dynamic localities list merging DB records and live calculated tutor counts
    const localities = GURGAON_LOCALITIES.map((loc) => {
      const key = loc.name.toLowerCase().trim();
      const liveCount = sectorCounts[key] || 0;
      const dbMatch = dbLocalities.find((dl) => dl.slug === loc.slug);

      return {
        slug: loc.slug,
        name: dbMatch?.name || loc.name,
        pincode: dbMatch?.pincode || loc.pincode,
        landmark: loc.landmark,
        activeTutorsCount: liveCount,
      };
    });

    return NextResponse.json(
      {
        success: true,
        localities,
        totalTutorsCount: activeTutors.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('Failed to fetch dynamic localities:', error);
    return NextResponse.json(
      {
        success: true,
        localities: GURGAON_LOCALITIES,
        totalTutorsCount: 100,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  }
}
