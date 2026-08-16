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
    return NextResponse.json({ success: false, error: 'Failed to load tutor details.' }, { status: 500 });
  }
}
