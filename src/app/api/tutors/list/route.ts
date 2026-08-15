import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const locality = searchParams.get('locality');
    const search = searchParams.get('q');

    const tutorProfiles = await prisma.tutorProfile.findMany({
      where: {
        status: 'ACTIVE_VERIFIED',
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
      },
      orderBy: {
        rating: 'desc',
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

      return {
        id: tp.id,
        name: tp.user.name,
        phone: tp.user.phone || '9811204921',
        email: tp.user.email,
        avatarUrl: tp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        introVideoUrl: tp.introVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: '1m 20s',
        highestDegree: tp.highestDegree || 'M.Sc.',
        experienceYears: tp.experienceYears,
        teachingMode: tp.teachingMode,
        subjects,
        classes,
        boards,
        serviceAreas,
        travelRadiusKm: tp.travelRadiusKm,
        hourlyRateHome: tp.hourlyRateHome || 900,
        hourlyRateOnline: tp.hourlyRateOnline || 600,
        monthlyRateMin: tp.monthlyRateMin || 7500,
        isVerified: tp.isVerified,
        hasPoliceCheck: tp.hasPoliceCheck,
        rating: tp.rating,
        totalReviews: tp.totalReviews,
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
