import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Parent User ID is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Parent account not found.' }, { status: 404 });
    }

    // 1. Fetch Demo Bookings / Leads submitted by this parent
    const leads = await prisma.lead.findMany({
      where: { parentId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTutor: {
          include: {
            user: { select: { name: true, image: true } }
          }
        }
      }
    });

    // 2. Fetch Reviews submitted by this parent
    const reviews = await prisma.review.findMany({
      where: { reviewerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        tutor: {
          include: {
            user: { select: { id: true, name: true, image: true } }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      parent: user,
      leads: leads.map(l => ({
        id: l.id,
        status: l.status,
        preferredMode: l.preferredMode,
        locality: l.locality,
        gradeClass: l.gradeClass,
        subjectsNeeded: l.subjectsNeeded,
        createdAt: l.createdAt,
        matchedTutor: l.assignedTutor ? {
          name: l.assignedTutor.user.name,
          highestDegree: l.assignedTutor.highestDegree,
          rating: l.assignedTutor.rating
        } : null
      })),
      reviews: reviews.map(r => ({
        id: r.id,
        tutorId: r.tutorId,
        tutorUserId: r.tutor.userId,
        tutorName: r.tutor.user.name,
        tutorDegree: r.tutor.highestDegree || 'Verified Educator',
        tutorAvatar: r.tutor.avatarUrl || r.tutor.user.image,
        rating: r.rating,
        comment: r.comment,
        isApproved: r.isApproved,
        createdAt: r.createdAt
      }))
    });

  } catch (error: any) {
    console.error('[PARENT_DASHBOARD_API_ERROR]:', error);
    return NextResponse.json({ success: false, error: 'Failed to load parent dashboard data.' }, { status: 500 });
  }
}
