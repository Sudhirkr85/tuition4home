import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tutorId = searchParams.get('tutorId'); // TutorProfile.id
    const userId = searchParams.get('userId');   // User.id (alternate lookup)

    if (!tutorId && !userId) {
      return NextResponse.json({ success: false, error: 'tutorId or userId required.' }, { status: 400 });
    }

    let profileId = tutorId;

    // If userId passed, resolve to tutorProfile.id first
    if (!profileId && userId) {
      const profile = await prisma.tutorProfile.findUnique({
        where: { userId },
        select: { id: true }
      });
      if (!profile) {
        return NextResponse.json({ success: true, reviews: [], averageRating: 0 });
      }
      profileId = profile.id;
    }

    const reviews = await prisma.review.findMany({
      where: {
        tutorId: profileId!,
        isApproved: true
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        parentName: true,
        rating: true,
        comment: true,
        createdAt: true,
        reviewerId: true,
        reviewer: {
          select: { id: true, name: true, image: true, role: true }
        }
      }
    });

    const averageRating = reviews.length > 0
      ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    return NextResponse.json({ success: true, reviews, averageRating, total: reviews.length });
  } catch (error: any) {
    console.error('[TUTOR_REVIEWS_GET]:', error);
    return NextResponse.json({ success: false, error: 'Failed to load reviews.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tutorId, userId, parentName, rating, comment, reviewerId } = body;

    if ((!tutorId && !userId) || !parentName || !rating || !comment) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    if (!reviewerId) {
      return NextResponse.json({ success: false, error: 'Parent login required to post a verified review.' }, { status: 401 });
    }

    let profileId = tutorId;

    if (!profileId && userId) {
      const profile = await prisma.tutorProfile.findUnique({
        where: { userId },
        select: { id: true }
      });
      if (!profile) {
        return NextResponse.json({ success: false, error: 'Tutor not found.' }, { status: 404 });
      }
      profileId = profile.id;
    }

    const newReview = await prisma.review.create({
      data: {
        tutorId: profileId!,
        reviewerId: reviewerId || null,
        parentName: parentName.trim(),
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment: comment.trim(),
        isApproved: true,
      },
      include: {
        reviewer: {
          select: { id: true, name: true, image: true, role: true }
        }
      }
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error: any) {
    console.error('[TUTOR_REVIEWS_POST]:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit review.' }, { status: 500 });
  }
}
