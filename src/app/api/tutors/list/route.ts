import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const locality = searchParams.get('locality');
    const search = searchParams.get('q');

    const tutorProfiles = await prisma.tutorProfile.findMany({
      where: {
        status: 'ACTIVE_VERIFIED',
        isAvailable: true,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        kycDoc: true,
        reviews: {
          where: { isApproved: true },
          select: { rating: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

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
      const calculatedRating = reviewCount > 0
        ? Math.round((approvedRev.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount) * 10) / 10
        : (tp.rating && Number(tp.rating) > 0 ? Number(tp.rating) : 0);

      return {
        id: tp.id,
        name: tp.user.name,
        phone: tp.user.phone || '9811204921',
        email: tp.user.email,
        avatarUrl: tp.avatarUrl || '',
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
        hourlyRateHomeMax: tp.hourlyRateHomeMax || (tp.hourlyRateHome ? Math.round((tp.hourlyRateHome * 1.5) / 50) * 50 : 1000),
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

    // Apply query filters if provided
    if (subject) {
      const sLower = subject.toLowerCase();
      tutors = tutors.filter((t: any) => t.subjects.some((s: string) => s.toLowerCase().includes(sLower)));
    }

    if (locality) {
      const locLower = locality.toLowerCase();
      tutors = tutors.filter((t: any) => t.serviceAreas.some((a: string) => a.toLowerCase().includes(locLower)));
    }

    if (search) {
      const qLower = search.toLowerCase();
      tutors = tutors.filter(
        (t: any) =>
          t.name.toLowerCase().includes(qLower) ||
          t.highestDegree.toLowerCase().includes(qLower) ||
          t.subjects.some((s: string) => s.toLowerCase().includes(qLower)) ||
          t.serviceAreas.some((a: string) => a.toLowerCase().includes(qLower))
      );
    }

    return NextResponse.json({
      success: true,
      count: tutors.length,
      tutors,
    });
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
