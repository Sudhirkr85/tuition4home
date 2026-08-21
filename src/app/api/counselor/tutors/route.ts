import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

function sanitizeAvatarUrl(url: string | null | undefined, gender?: string): string {
  if (!url) {
    return gender === 'MALE'
      ? '/tutor_rohit_sharma_avatar.webp'
      : '/tutor_ananya_sengupta_avatar.webp';
  }
  if (url.startsWith('data:image/') && url.length > 500) {
    return gender === 'MALE'
      ? '/tutor_rohit_sharma_avatar.webp'
      : '/tutor_ananya_sengupta_avatar.webp';
  }
  return url;
}

export async function GET() {
  try {
    // Fetch all tutors with lean projection
    const profiles = await prisma.tutorProfile.findMany({
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
        createdAt: 'desc',
      },
    });

    // Decrypt full government ID numbers for authorized counselor view
    const formattedProfiles = profiles.map((profile) => {
      let idNumberDecrypted = 'Not Uploaded';
      if (profile.kycDoc && profile.kycDoc.idNumberEncrypted) {
        idNumberDecrypted = decrypt(profile.kycDoc.idNumberEncrypted);
      }

      // Safe parse JSON strings for lists
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
      } catch (e) {
        console.error('Failed parsing tutor list fields', e);
      }

      return {
        id: profile.id,
        userId: profile.userId,
        name: profile.user?.name || 'Tutor',
        email: profile.user?.email || '',
        phone: profile.user?.phone || 'N/A',
        avatarUrl: sanitizeAvatarUrl(profile.avatarUrl, profile.gender || undefined),
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
        hourlyRateHome: profile.hourlyRateHomeMin || profile.hourlyRateHomeMax || 500,
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
        kycDoc: profile.kycDoc
          ? {
              id: profile.kycDoc.id,
              idType: profile.kycDoc.idType,
              idLast4: profile.kycDoc.idLast4,
              idNumberDecrypted,
              idDocUrl: profile.kycDoc.idDocUrl,
              idStatus: profile.kycDoc.idStatus || 'NOT_SUBMITTED',
              idRejectionNote: profile.kycDoc.idRejectionNote || '',
              degreeDocUrl: profile.kycDoc.degreeDocUrl || '',
              degreeStatus: profile.kycDoc.degreeStatus || 'NOT_SUBMITTED',
              degreeRejectionNote: profile.kycDoc.degreeRejectionNote || '',
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      tutors: formattedProfiles,
    });
  } catch (error: any) {
    console.error('[COUNSELOR_GET_TUTORS_ERROR]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve tutor profiles.',
      },
      { status: 500 }
    );
  }
}
