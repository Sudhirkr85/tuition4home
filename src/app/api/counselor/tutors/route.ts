import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';

export async function GET() {
  try {
    // Fetch all tutors, including user data and KYC documents
    const profiles = await prisma.tutorProfile.findMany({
      include: {
        user: true,
        kycDoc: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Decrypt full government ID numbers for authorized counselor view
    const formattedProfiles = profiles.map(profile => {
      let idNumberDecrypted = 'Not Uploaded';
      if (profile.kycDoc && profile.kycDoc.idNumberEncrypted) {
        idNumberDecrypted = decrypt(profile.kycDoc.idNumberEncrypted);
      }

      // Safe parse JSON strings for lists
      let parsedSubjects: string[] = [];
      let parsedClasses: string[] = [];
      let parsedBoards: string[] = [];
      let parsedServiceAreas: string[] = [];
      
      try {
        if (profile.subjects) parsedSubjects = JSON.parse(profile.subjects);
        if (profile.classes) parsedClasses = JSON.parse(profile.classes);
        if (profile.boards) parsedBoards = JSON.parse(profile.boards);
        if (profile.serviceAreas) parsedServiceAreas = JSON.parse(profile.serviceAreas);
      } catch (e) {
        console.error('Failed parsing tutor list fields', e);
      }

      return {
        id: profile.id,
        userId: profile.userId,
        name: profile.user.name,
        email: profile.user.email,
        phone: profile.user.phone || 'N/A',
        avatarUrl: profile.avatarUrl || '/placeholder-avatar.jpg',
        introVideoUrl: profile.introVideoUrl || '',
        highestDegree: profile.highestDegree || 'N/A',
        experienceYears: profile.experienceYears,
        teachingMode: profile.teachingMode,
        subjects: parsedSubjects,
        classes: parsedClasses,
        boards: parsedBoards,
        serviceAreas: parsedServiceAreas,
        travelRadiusKm: profile.travelRadiusKm,
        hourlyRateHomeMin: profile.hourlyRateHomeMin || 0,
        hourlyRateHomeMax: profile.hourlyRateHomeMax || 0,
        hourlyRateOnlineMin: profile.hourlyRateOnlineMin || 0,
        hourlyRateOnlineMax: profile.hourlyRateOnlineMax || 0,
        status: profile.status,
        isVerified: profile.isVerified,
        rating: profile.rating,
        kycDoc: profile.kycDoc ? {
          idType: profile.kycDoc.idType,
          idLast4: profile.kycDoc.idLast4,
          idNumberDecrypted,
          idDocUrl: profile.kycDoc.idDocUrl
        } : null
      };
    });

    return NextResponse.json({
      success: true,
      tutors: formattedProfiles
    });

  } catch (error: any) {
    console.error('[COUNSELOR_GET_TUTORS_ERROR]:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve tutor profiles.'
    }, { status: 500 });
  }
}
