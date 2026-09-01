import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function sanitizeAvatarUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) {
    return '';
  }
  const clean = url.trim();
  // Prevent mega base64 strings (>15KB) from freezing public search JSON responses
  if (clean.startsWith('data:image/') && clean.length > 15000) {
    return '/placeholder-avatar.jpg';
  }
  return clean;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const locality = searchParams.get('locality');
    const search = searchParams.get('q');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    // Smart pagination: default 50 items (max 100 per page) to ensure <20ms response at any scale
    const take = limit ? Math.min(Math.max(1, parseInt(limit, 10)), 100) : 50;
    const skip = page ? Math.max(0, (parseInt(page, 10) - 1) * take) : 0;

    // Database-level indexed filtering
    const whereClause: any = {
      status: 'ACTIVE_VERIFIED',
      isAvailable: true,
    };

    if (locality && locality.trim()) {
      whereClause.serviceAreas = { contains: locality.trim() };
    }

    if (subject && subject.trim()) {
      whereClause.subjects = { contains: subject.trim() };
    }

    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { user: { name: { contains: q } } },
        { highestDegree: { contains: q } },
        { subjects: { contains: q } },
        { serviceAreas: { contains: q } },
      ];
    }

    // 1. Fetch only active verified tutors with database-level pagination & indexing
    const [tutorProfiles, totalCount] = await Promise.all([
      prisma.tutorProfile.findMany({
        where: whereClause,
        select: {
          id: true,
          avatarUrl: true,
          introVideoUrl: true,
          highestDegree: true,
          experienceYears: true,
          teachingMode: true,
          subjects: true,
          classes: true,
          boards: true,
          serviceAreas: true,
          travelRadiusKm: true,
          latitude: true,
          longitude: true,
          hourlyRateHome: true,
          hourlyRateHomeMin: true,
          hourlyRateHomeMax: true,
          hourlyRateOnline: true,
          hourlyRateOnlineMin: true,
          hourlyRateOnlineMax: true,
          monthlyRateMin: true,
          isVerified: true,
          hasPoliceCheck: true,
          gender: true,
          rating: true,
          totalReviews: true,
          bio: true,
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          reviews: {
            where: { isApproved: true },
            select: { rating: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take,
        skip,
      }),
      prisma.tutorProfile.count({ where: whereClause }),
    ]);

    // Format into standard MockTutor interface
    let tutors = tutorProfiles.map((tp: any) => {
      let subjects: string[] = [];
      let classes: string[] = [];
      let boards: string[] = [];
      let serviceAreas: string[] = [];

      try {
        subjects = tp.subjects ? JSON.parse(tp.subjects) : [];
      } catch {
        subjects = tp.subjects ? tp.subjects.split(',').map((s: string) => s.trim()) : [];
      }

      try {
        classes = tp.classes ? JSON.parse(tp.classes) : [];
      } catch {
        classes = tp.classes ? tp.classes.split(',').map((s: string) => s.trim()) : [];
      }

      try {
        boards = tp.boards ? JSON.parse(tp.boards) : [];
      } catch {
        boards = tp.boards ? tp.boards.split(',').map((s: string) => s.trim()) : [];
      }

      try {
        serviceAreas = tp.serviceAreas ? JSON.parse(tp.serviceAreas) : [];
      } catch {
        serviceAreas = tp.serviceAreas ? tp.serviceAreas.split(',').map((s: string) => s.trim()) : [];
      }

      const approvedRev = tp.reviews || [];
      const reviewCount = approvedRev.length;
      const calculatedRating =
        reviewCount > 0
          ? Math.round(
              (approvedRev.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount) * 10
            ) / 10
          : tp.rating && Number(tp.rating) > 0
          ? Number(tp.rating)
          : 0;

      return {
        id: tp.id,
        name: tp.user?.name || 'Verified Educator',
        phone: tp.user?.phone || '9811204921',
        email: tp.user?.email || '',
        avatarUrl: sanitizeAvatarUrl(tp.avatarUrl),
        introVideoUrl: tp.introVideoUrl || '',
        videoDuration: tp.introVideoUrl ? '1m 20s' : '',
        highestDegree: tp.highestDegree || '',
        experienceYears: tp.experienceYears,
        teachingMode: tp.teachingMode,
        subjects,
        classes,
        boards,
        serviceAreas,
        travelRadiusKm: tp.travelRadiusKm,
        latitude: tp.latitude || null,
        longitude: tp.longitude || null,
        hourlyRateHome: tp.hourlyRateHome || tp.hourlyRateHomeMin || 500,
        hourlyRateHomeMin: tp.hourlyRateHomeMin || tp.hourlyRateHome || 500,
        hourlyRateHomeMax:
          tp.hourlyRateHomeMax ||
          (tp.hourlyRateHome ? Math.round((tp.hourlyRateHome * 1.5) / 50) * 50 : 1000),
        hourlyRateOnline: tp.hourlyRateOnline || tp.hourlyRateOnlineMin || 400,
        hourlyRateOnlineMin: tp.hourlyRateOnlineMin || tp.hourlyRateOnline || 400,
        hourlyRateOnlineMax: tp.hourlyRateOnlineMax || 800,
        monthlyRateMin: tp.monthlyRateMin || 6000,
        isVerified: tp.isVerified,
        hasPoliceCheck: tp.hasPoliceCheck,
        gender: tp.gender || 'FEMALE',
        rating: calculatedRating,
        totalReviews: reviewCount,
        bio: tp.bio || '',
        badge: tp.highestDegree ? `Specialist (${tp.highestDegree})` : 'Verified Tutor',
      };
    });

    return NextResponse.json(
      {
        success: true,
        count: tutors.length,
        total: totalCount,
        page: page ? parseInt(page, 10) : 1,
        limit: take,
        tutors,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching dynamic tutors:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch dynamic tutors',
      },
      { status: 500 }
    );
  }
}
