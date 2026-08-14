import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      userId,
      teachingMode,
      highestDegree,
      qualifications, // array: [{ id, degree, institute, year, grade }]
      experiences,    // array: [{ id, role, organization, startYear, endYear, isCurrent, description }]
      experienceYears,
      subjects,     // string[]
      classes,      // string[]
      boards,       // string[]
      serviceAreas, // string[]
      travelRadiusKm,
      hourlyRateHomeMin,
      hourlyRateHomeMax,
      hourlyRateOnlineMin,
      hourlyRateOnlineMax,
      avatarUrl,
      introVideoUrl,
      idType,       // for KYC
      idNumber,     // for KYC
      idDocUrl,     // for KYC
      status        // final state e.g., 'PENDING_INTERVIEW'
    } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    // Verify user exists and has a profile
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Tutor profile not found.' }, { status: 404 });
    }

    // Build the update payload
    const profileUpdateData: any = {};
    if (teachingMode !== undefined) profileUpdateData.teachingMode = teachingMode;
    if (highestDegree !== undefined) profileUpdateData.highestDegree = highestDegree;
    if (qualifications !== undefined) profileUpdateData.qualifications = typeof qualifications === 'string' ? qualifications : JSON.stringify(qualifications);
    if (experiences !== undefined) profileUpdateData.experiences = typeof experiences === 'string' ? experiences : JSON.stringify(experiences);
    if (experienceYears !== undefined) profileUpdateData.experienceYears = Number(experienceYears);
    
    // Stringify string arrays for subjects, classes, boards, areas
    if (subjects !== undefined) profileUpdateData.subjects = JSON.stringify(subjects);
    if (classes !== undefined) profileUpdateData.classes = JSON.stringify(classes);
    if (boards !== undefined) profileUpdateData.boards = JSON.stringify(boards);
    if (serviceAreas !== undefined) profileUpdateData.serviceAreas = JSON.stringify(serviceAreas);
    
    if (travelRadiusKm !== undefined) profileUpdateData.travelRadiusKm = Number(travelRadiusKm);
    
    // Store price ranges
    if (hourlyRateHomeMin !== undefined) profileUpdateData.hourlyRateHomeMin = Number(hourlyRateHomeMin);
    if (hourlyRateHomeMax !== undefined) profileUpdateData.hourlyRateHomeMax = Number(hourlyRateHomeMax);
    if (hourlyRateOnlineMin !== undefined) profileUpdateData.hourlyRateOnlineMin = Number(hourlyRateOnlineMin);
    if (hourlyRateOnlineMax !== undefined) profileUpdateData.hourlyRateOnlineMax = Number(hourlyRateOnlineMax);
    
    // Set fallback single rates (middle of range or min) for backwards compatibility
    if (hourlyRateHomeMin !== undefined) profileUpdateData.hourlyRateHome = Number(hourlyRateHomeMin);
    if (hourlyRateOnlineMin !== undefined) profileUpdateData.hourlyRateOnline = Number(hourlyRateOnlineMin);

    if (avatarUrl !== undefined) profileUpdateData.avatarUrl = avatarUrl;
    if (introVideoUrl !== undefined) profileUpdateData.introVideoUrl = introVideoUrl;
    
    if (status !== undefined) profileUpdateData.status = status;

    // Update profile within a database transaction
    await prisma.$transaction(async (tx) => {
      // Update Tutor Profile
      await tx.tutorProfile.update({
        where: { userId },
        data: profileUpdateData
      });

      // Handle KYC creation/update if KYC fields are sent
      if (idType && idNumber) {
        // Enforce secure encryption
        const idNumberEncrypted = encrypt(idNumber);
        const idLast4 = idNumber.slice(-4); // mask everything except last 4 digits
        
        await tx.tutorKYC.upsert({
          where: { tutorId: profile.id },
          create: {
            tutorId: profile.id,
            idType,
            idLast4,
            idNumberEncrypted,
            idDocUrl: idDocUrl || '/placeholder-doc.png',
          },
          update: {
            idType,
            idLast4,
            idNumberEncrypted,
            idDocUrl: idDocUrl || undefined
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.'
    });

  } catch (error: any) {
    console.error('[TUTOR_PROFILE_SETUP_API_ERROR]:', error);
    return NextResponse.json({
      success: false,
      error: 'An internal server error occurred while saving profile.'
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
        kycDoc: true,
        user: true,
      }
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Tutor profile not found.' }, { status: 404 });
    }

    // Helper to safely parse JSON strings or return arrays
    const safeParse = (val: any) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'object') return [val];
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed;
          if (typeof parsed === 'object' && parsed !== null) return [parsed];
          return [];
        } catch (e) {
          return [];
        }
      }
      return [];
    };

    // Ensure qualifications and experiences are retrieved cleanly even if runtime schema is cached
    let rawQual = (profile as any).qualifications;
    let rawExp = (profile as any).experiences;

    if (rawQual === undefined || rawExp === undefined) {
      try {
        const rawRows: any = await prisma.$queryRaw`SELECT qualifications, experiences FROM TutorProfile WHERE userId = ${userId} LIMIT 1`;
        if (rawRows && rawRows[0]) {
          rawQual = rawRows[0].qualifications;
          rawExp = rawRows[0].experiences;
        }
      } catch (e) {
        console.warn('Fallback query error:', e);
      }
    }

    const parsedProfile = {
      ...profile,
      subjects: safeParse(profile.subjects),
      classes: safeParse(profile.classes),
      boards: safeParse(profile.boards),
      serviceAreas: safeParse(profile.serviceAreas),
      qualifications: safeParse(rawQual),
      experiences: safeParse(rawExp),
    };

    return NextResponse.json({
      success: true,
      profile: parsedProfile
    });

  } catch (error: any) {
    console.error('[GET_TUTOR_PROFILE_API_ERROR]:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve tutor profile.'
    }, { status: 500 });
  }
}
