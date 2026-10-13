import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

function sanitizeAvatarUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) {
    return '';
  }
  const clean = url.trim();
  // Prevent mega base64 strings (>15KB) from freezing the list JSON response
  if (clean.startsWith('data:image/') && clean.length > 15000) {
    return '/placeholder-avatar.jpg';
  }
  return clean;
}

function sanitizeDocUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) {
    return '';
  }
  const clean = url.trim();
  // Strip heavy base64 documents (>500 chars) from the bulk list endpoint; full docs are fetched on-demand in /api/admin/tutors/[id]
  if (clean.startsWith('data:')) {
    return '';
  }
  return clean;
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

      // Safe parse JSON strings for lists (recovers gracefully if legacy VARCHAR/TEXT row was truncated)
      const safeParseArray = (raw: string | null | undefined): any[] => {
        if (!raw || !raw.trim()) return [];
        const trimmed = raw.trim();
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // Recover complete string items if array was truncated at 191 or 65535 chars
          const matches = trimmed.match(/"([^"\\]*(?:\\.[^"\\]*)*)"/g);
          if (matches && matches.length > 0 && !trimmed.startsWith('[{')) {
            return matches.map((m) => m.slice(1, -1));
          }
          return [];
        }
      };

      const parsedSubjects = safeParseArray(profile.subjects);
      const parsedClasses = safeParseArray(profile.classes);
      const parsedBoards = safeParseArray(profile.boards);
      const parsedServiceAreas = safeParseArray(profile.serviceAreas);
      const parsedQualifications = safeParseArray(profile.qualifications);
      const parsedExperiences = safeParseArray(profile.experiences);

      const hasIdDocUploaded = Boolean(profile.kycDoc?.idDocUrl && profile.kycDoc.idDocUrl.trim().length > 0);
      const hasDegreeDocUploaded = Boolean(profile.kycDoc?.degreeDocUrl && profile.kycDoc.degreeDocUrl.trim().length > 0);

      return {
        id: profile.id,
        userId: profile.userId,
        name: profile.user?.name || 'Tutor',
        email: profile.user?.email || '',
        phone: profile.user?.phone || 'N/A',
        avatarUrl: sanitizeAvatarUrl(profile.avatarUrl),
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
              idDocUrl: sanitizeDocUrl(profile.kycDoc.idDocUrl),
              hasIdDoc: hasIdDocUploaded,
              idStatus: profile.kycDoc.idStatus || 'NOT_SUBMITTED',
              idRejectionNote: profile.kycDoc.idRejectionNote || '',
              degreeDocUrl: sanitizeDocUrl(profile.kycDoc.degreeDocUrl),
              hasDegreeDoc: hasDegreeDocUploaded,
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
