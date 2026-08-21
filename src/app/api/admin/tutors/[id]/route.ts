import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const tutorId = params.id;

    // Find profile by ID or by userId
    const profile = await prisma.tutorProfile.findFirst({
      where: {
        OR: [{ id: tutorId }, { userId: tutorId }]
      },
      include: {
        user: true,
        kycDoc: true
      }
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Tutor profile not found.' }, { status: 404 });
    }

    let idNumberDecrypted = 'Not Uploaded';
    if (profile.kycDoc && profile.kycDoc.idNumberEncrypted) {
      idNumberDecrypted = decrypt(profile.kycDoc.idNumberEncrypted);
    }

    let parsedSubjects: string[] = [];
    let parsedClasses: string[] = [];
    let parsedBoards: string[] = [];
    let parsedServiceAreas: string[] = [];
    let parsedQualifications: any[] = [];
    let parsedExperiences: any[] = [];

    try {
      if (profile.subjects) parsedSubjects = JSON.parse(profile.subjects);
      if (profile.classes) parsedClasses = JSON.parse(profile.classes);
      if (profile.boards) parsedBoards = JSON.parse(profile.boards);
      if (profile.serviceAreas) parsedServiceAreas = JSON.parse(profile.serviceAreas);
      if (profile.qualifications) parsedQualifications = JSON.parse(profile.qualifications);
      if (profile.experiences) parsedExperiences = JSON.parse(profile.experiences);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      tutor: {
        id: profile.id,
        userId: profile.userId,
        name: profile.user.name,
        email: profile.user.email,
        phone: profile.user.phone || 'N/A',
        avatarUrl: profile.avatarUrl || '',
        introVideoUrl: profile.introVideoUrl || '',
        highestDegree: profile.highestDegree || 'Bachelor Degree',
        experienceYears: profile.experienceYears || 1,
        teachingMode: profile.teachingMode || 'BOTH',
        subjects: parsedSubjects,
        classes: parsedClasses,
        boards: parsedBoards,
        serviceAreas: parsedServiceAreas,
        travelRadiusKm: profile.travelRadiusKm || 5,
        latitude: profile.latitude,
        longitude: profile.longitude,
        formattedAddress: profile.formattedAddress || '',
        hourlyRateHomeMin: profile.hourlyRateHomeMin || 500,
        hourlyRateHomeMax: profile.hourlyRateHomeMax || 1000,
        hourlyRateOnlineMin: profile.hourlyRateOnlineMin || 400,
        hourlyRateOnlineMax: profile.hourlyRateOnlineMax || 800,
        status: profile.status,
        isVerified: profile.isVerified,
        isAvailable: profile.isAvailable,
        hasPoliceCheck: profile.hasPoliceCheck || false,
        bio: profile.bio || '',
        qualifications: parsedQualifications,
        experiences: parsedExperiences,
        rating: profile.rating || 5.0,
        kycDoc: profile.kycDoc ? {
          id: profile.kycDoc.id,
          idType: profile.kycDoc.idType,
          idLast4: profile.kycDoc.idLast4,
          idNumberDecrypted,
          idDocUrl: profile.kycDoc.idDocUrl,
          idStatus: profile.kycDoc.idStatus || 'NOT_SUBMITTED',
          idRejectionNote: profile.kycDoc.idRejectionNote || '',
          degreeDocUrl: profile.kycDoc.degreeDocUrl || '',
          degreeStatus: profile.kycDoc.degreeStatus || 'NOT_SUBMITTED',
          degreeRejectionNote: profile.kycDoc.degreeRejectionNote || ''
        } : null
      }
    });
  } catch (error: any) {
    console.error('[GET_TUTOR_BY_ID_ERROR]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const tutorId = params.id;
    const body = await req.json();

    const existing = await prisma.tutorProfile.findFirst({
      where: {
        OR: [{ id: tutorId }, { userId: tutorId }]
      },
      include: { user: true }
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Tutor not found.' }, { status: 404 });
    }

    // 1. Update User basic info if provided
    const userUpdates: any = {};
    if (body.name !== undefined) userUpdates.name = body.name.trim();
    if (body.email !== undefined) userUpdates.email = body.email.trim();
    if (body.phone !== undefined) userUpdates.phone = body.phone.trim();

    if (Object.keys(userUpdates).length > 0) {
      await prisma.user.update({
        where: { id: existing.userId },
        data: userUpdates
      });
    }

    // 2. Update TutorProfile fields
    const profileUpdates: any = {};

    if (body.avatarUrl !== undefined) profileUpdates.avatarUrl = body.avatarUrl;
    if (body.introVideoUrl !== undefined) profileUpdates.introVideoUrl = body.introVideoUrl;
    if (body.bio !== undefined) profileUpdates.bio = body.bio;
    if (body.highestDegree !== undefined) profileUpdates.highestDegree = body.highestDegree;
    if (body.gender !== undefined) profileUpdates.gender = body.gender;
    if (body.experienceYears !== undefined) profileUpdates.experienceYears = Number(body.experienceYears);
    if (body.teachingMode !== undefined) profileUpdates.teachingMode = body.teachingMode;

    if (body.subjects !== undefined) {
      profileUpdates.subjects = Array.isArray(body.subjects) ? JSON.stringify(body.subjects) : body.subjects;
    }
    if (body.classes !== undefined) {
      profileUpdates.classes = Array.isArray(body.classes) ? JSON.stringify(body.classes) : body.classes;
    }
    if (body.boards !== undefined) {
      profileUpdates.boards = Array.isArray(body.boards) ? JSON.stringify(body.boards) : body.boards;
    }
    if (body.serviceAreas !== undefined) {
      profileUpdates.serviceAreas = Array.isArray(body.serviceAreas) ? JSON.stringify(body.serviceAreas) : body.serviceAreas;
    }

    if (body.travelRadiusKm !== undefined) profileUpdates.travelRadiusKm = Number(body.travelRadiusKm);
    if (body.latitude !== undefined) profileUpdates.latitude = body.latitude ? parseFloat(body.latitude) : null;
    if (body.longitude !== undefined) profileUpdates.longitude = body.longitude ? parseFloat(body.longitude) : null;
    if (body.formattedAddress !== undefined) profileUpdates.formattedAddress = body.formattedAddress;

    if (body.hourlyRateHome !== undefined) profileUpdates.hourlyRateHome = Number(body.hourlyRateHome);
    if (body.hourlyRateHomeMin !== undefined) profileUpdates.hourlyRateHomeMin = Number(body.hourlyRateHomeMin);
    if (body.hourlyRateHomeMax !== undefined) profileUpdates.hourlyRateHomeMax = Number(body.hourlyRateHomeMax);
    if (body.hourlyRateOnline !== undefined) profileUpdates.hourlyRateOnline = Number(body.hourlyRateOnline);
    if (body.hourlyRateOnlineMin !== undefined) profileUpdates.hourlyRateOnlineMin = Number(body.hourlyRateOnlineMin);
    if (body.hourlyRateOnlineMax !== undefined) profileUpdates.hourlyRateOnlineMax = Number(body.hourlyRateOnlineMax);
    if (body.monthlyRateMin !== undefined) profileUpdates.monthlyRateMin = Number(body.monthlyRateMin);

    if (body.status !== undefined) profileUpdates.status = body.status;
    if (body.isVerified !== undefined) profileUpdates.isVerified = Boolean(body.isVerified);
    if (body.isAvailable !== undefined) profileUpdates.isAvailable = Boolean(body.isAvailable);
    if (body.hasPoliceCheck !== undefined) profileUpdates.hasPoliceCheck = Boolean(body.hasPoliceCheck);
    if (body.rating !== undefined) profileUpdates.rating = parseFloat(body.rating);

    const updatedProfile = await prisma.tutorProfile.update({
      where: { id: existing.id },
      data: profileUpdates,
      include: {
        user: true,
        kycDoc: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Tutor details updated successfully in database.',
      tutor: updatedProfile
    });

  } catch (error: any) {
    console.error('[UPDATE_TUTOR_BY_ID_ERROR]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update tutor.' }, { status: 500 });
  }
}

export { PATCH as PUT, PATCH as POST };
