import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/crypto';
import { sendTutorProfileSubmittedEmail } from '@/lib/brevo';
import { uploadToCloudinary } from '@/lib/cloudinary';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

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
      idType,       // for KYC: 'AADHAAR' | 'PAN'
      idNumber,     // for KYC
      idDocUrl,     // for KYC (Aadhaar or PAN image URL)
      degreeDocUrl, // for Highest Qualification Degree/Marksheet image URL
      status        // final state e.g., 'PENDING_INTERVIEW'
    } = body;

    if (!userId && !body.email) {
      return NextResponse.json({ success: false, error: 'User ID or Email is required.' }, { status: 400 });
    }

    // Verify user exists and has a profile (or auto-create draft profile if user exists)
    let profile = userId ? await prisma.tutorProfile.findUnique({
      where: { userId },
      include: { kycDoc: true, user: true }
    }) : null;

    if (!profile) {
      let user = userId ? await prisma.user.findUnique({
        where: { id: userId },
      }) : null;

      if (!user && body.email) {
        user = await prisma.user.findUnique({
          where: { email: body.email.toLowerCase().trim() },
        });
      }

      if (user) {
        if (user.role !== 'TUTOR') {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: 'TUTOR' },
          });
        }
        profile = await prisma.tutorProfile.create({
          data: {
            userId: user.id,
            status: 'DRAFT',
            experienceYears: 0,
          },
          include: { kycDoc: true, user: true }
        });
      }
    }

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Tutor profile not found.' }, { status: 404 });
    }

    // Validation: Mandatory ID document photo when submitting onboarding profile
    if (status === 'PENDING_INTERVIEW' && !profile.isVerified) {
      const hasExistingDoc = profile.kycDoc && profile.kycDoc.idDocUrl && profile.kycDoc.idDocUrl !== '/placeholder-doc.jpg';
      if (!idDocUrl && !hasExistingDoc) {
        return NextResponse.json({
          success: false,
          error: '⚠️ Government ID Document Proof is MANDATORY. Please upload your ID document photo or PDF to proceed.'
        }, { status: 400 });
      }
    }

    // Security Rule: If tutor has been DEACTIVATED/SUSPENDED by Admin, prevent tutor from self-activating
    if (((profile.status as string) === 'SUSPENDED' || (profile.status as string) === 'DEACTIVATED' || (profile.status as string) === 'REJECTED') && body.isAvailable === true) {
      return NextResponse.json({
        success: false,
        error: 'Your account has been deactivated by SSSAM Academy Admin. Please contact Admin (support@sssamacademy.com) for profile reactivation.'
      }, { status: 403 });
    }

    // Security Rule: If tutor is already VERIFIED, prevent replacing KYC identity documents
    if (profile.isVerified && (idNumber || idDocUrl || degreeDocUrl)) {
      // Check if tutor is attempting to change verified documents
      if (
        (idDocUrl && profile.kycDoc && profile.kycDoc.idDocUrl !== idDocUrl) ||
        (degreeDocUrl && (profile.kycDoc as any)?.degreeDocUrl && (profile.kycDoc as any)?.degreeDocUrl !== degreeDocUrl)
      ) {
        return NextResponse.json({
          success: false,
          error: 'Your profile has already been verified by SSSAM Academy. Verified KYC and qualification documents are locked and cannot be replaced. Contact admin to request changes.'
        }, { status: 403 });
      }
    }

    // Build the update payload
    const profileUpdateData: any = {};
    if (teachingMode !== undefined) profileUpdateData.teachingMode = teachingMode;
    if (highestDegree !== undefined) profileUpdateData.highestDegree = highestDegree;
    if (body.gender !== undefined) profileUpdateData.gender = body.gender;
    if (qualifications !== undefined) profileUpdateData.qualifications = typeof qualifications === 'string' ? qualifications : JSON.stringify(qualifications);
    if (experiences !== undefined) profileUpdateData.experiences = typeof experiences === 'string' ? experiences : JSON.stringify(experiences);
    if (experienceYears !== undefined) profileUpdateData.experienceYears = Number(experienceYears);
    
    // Stringify string arrays for subjects, classes, boards, areas
    if (subjects !== undefined) profileUpdateData.subjects = JSON.stringify(subjects);
    if (classes !== undefined) profileUpdateData.classes = JSON.stringify(classes);
    if (boards !== undefined) profileUpdateData.boards = JSON.stringify(boards);
    if (serviceAreas !== undefined) profileUpdateData.serviceAreas = JSON.stringify(serviceAreas);
    
    if (travelRadiusKm !== undefined) profileUpdateData.travelRadiusKm = Number(travelRadiusKm);
    
    // Save GPS location for proximity matching (or auto-resolve from service areas / address)
    let resolvedLat = body.latitude !== undefined && body.latitude !== null && !isNaN(Number(body.latitude)) ? parseFloat(body.latitude) : null;
    let resolvedLng = body.longitude !== undefined && body.longitude !== null && !isNaN(Number(body.longitude)) ? parseFloat(body.longitude) : null;

    if ((!resolvedLat || !resolvedLng) && Array.isArray(serviceAreas) && serviceAreas.length > 0) {
      for (const area of serviceAreas) {
        const areaStr = String(area).toLowerCase();
        // Check common Gurgaon locations
        if (areaStr.includes('56')) { resolvedLat = 28.4315; resolvedLng = 77.1035; break; }
        if (areaStr.includes('57')) { resolvedLat = 28.4255; resolvedLng = 77.0885; break; }
        if (areaStr.includes('50') || areaStr.includes('nirvana')) { resolvedLat = 28.4185; resolvedLng = 77.0655; break; }
        if (areaStr.includes('49') || areaStr.includes('orchid')) { resolvedLat = 28.4125; resolvedLng = 77.0515; break; }
        if (areaStr.includes('48') || areaStr.includes('sohna')) { resolvedLat = 28.4205; resolvedLng = 77.0395; break; }
        if (areaStr.includes('phase 5') || areaStr.includes('aralias')) { resolvedLat = 28.4552; resolvedLng = 77.0945; break; }
        if (areaStr.includes('golf course')) { resolvedLat = 28.4595; resolvedLng = 77.0988; break; }
        if (areaStr.includes('phase 1')) { resolvedLat = 28.4795; resolvedLng = 77.1025; break; }
        if (areaStr.includes('phase 2')) { resolvedLat = 28.4895; resolvedLng = 77.0895; break; }
        if (areaStr.includes('phase 4') || areaStr.includes('galleria')) { resolvedLat = 28.4685; resolvedLng = 77.0855; break; }
        if (areaStr.includes('14')) { resolvedLat = 28.4728; resolvedLng = 77.0345; break; }
        if (areaStr.includes('sushant lok')) { resolvedLat = 28.4615; resolvedLng = 77.0785; break; }
        if (areaStr.includes('palam vihar')) { resolvedLat = 28.5095; resolvedLng = 77.0425; break; }
      }
      if (!resolvedLat || !resolvedLng) {
        resolvedLat = 28.4595;
        resolvedLng = 77.0988; // Default Central Gurgaon
      }
    }

    if (resolvedLat !== null) profileUpdateData.latitude = resolvedLat;
    if (resolvedLng !== null) profileUpdateData.longitude = resolvedLng;
    if (body.formattedAddress !== undefined) profileUpdateData.formattedAddress = body.formattedAddress;

    // Store price ranges
    if (hourlyRateHomeMin !== undefined && !isNaN(Number(hourlyRateHomeMin))) profileUpdateData.hourlyRateHomeMin = Number(hourlyRateHomeMin);
    if (hourlyRateHomeMax !== undefined && !isNaN(Number(hourlyRateHomeMax))) profileUpdateData.hourlyRateHomeMax = Number(hourlyRateHomeMax);
    if (hourlyRateOnlineMin !== undefined && !isNaN(Number(hourlyRateOnlineMin))) profileUpdateData.hourlyRateOnlineMin = Number(hourlyRateOnlineMin);
    if (hourlyRateOnlineMax !== undefined && !isNaN(Number(hourlyRateOnlineMax))) profileUpdateData.hourlyRateOnlineMax = Number(hourlyRateOnlineMax);
    
    // Set fallback single rates (middle of range or min) for backwards compatibility
    if (hourlyRateHomeMin !== undefined && !isNaN(Number(hourlyRateHomeMin))) profileUpdateData.hourlyRateHome = Number(hourlyRateHomeMin);
    if (hourlyRateOnlineMin !== undefined && !isNaN(Number(hourlyRateOnlineMin))) profileUpdateData.hourlyRateOnline = Number(hourlyRateOnlineMin);

    // Auto-upload Base64 avatar to Cloudinary if needed
    let finalAvatarUrl = avatarUrl;
    if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.startsWith('data:image/')) {
      try {
        const uploadRes = await uploadToCloudinary(avatarUrl, 'tuitionforhome/avatars', 'image');
        finalAvatarUrl = uploadRes.secureUrl;
      } catch (err) {
        console.error('Failed to upload base64 avatar to Cloudinary:', err);
      }
      // Safety fallback: ensure base64 avatar is resized to <20KB if still a data URI
      if (finalAvatarUrl && finalAvatarUrl.startsWith('data:image/') && finalAvatarUrl.length > 25000) {
        try {
          const base64Data = finalAvatarUrl.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const resized = await sharp(buffer).resize(300, 300, { fit: 'cover' }).jpeg({ quality: 75 }).toBuffer();
          finalAvatarUrl = `data:image/jpeg;base64,${resized.toString('base64')}`;
        } catch (e) {
          console.warn('Avatar sharp compression fallback failed:', e);
        }
      }
    }

    // Auto-upload Base64 KYC docs to Cloudinary if needed
    let finalIdDocUrl = idDocUrl;
    if (idDocUrl && typeof idDocUrl === 'string' && idDocUrl.startsWith('data:')) {
      try {
        const uploadRes = await uploadToCloudinary(idDocUrl, 'tuitionforhome/kyc', 'auto');
        finalIdDocUrl = uploadRes.secureUrl;
      } catch (err) {
        console.error('Failed to upload base64 idDoc to Cloudinary:', err);
      }
      if (finalIdDocUrl && finalIdDocUrl.startsWith('data:image/') && finalIdDocUrl.length > 100000) {
        try {
          const base64Data = finalIdDocUrl.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const resized = await sharp(buffer).resize(1000, 1000, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 70 }).toBuffer();
          finalIdDocUrl = `data:image/jpeg;base64,${resized.toString('base64')}`;
        } catch {}
      }
    }

    let finalDegreeDocUrl = degreeDocUrl;
    if (degreeDocUrl && typeof degreeDocUrl === 'string' && degreeDocUrl.startsWith('data:')) {
      try {
        const uploadRes = await uploadToCloudinary(degreeDocUrl, 'tuitionforhome/degrees', 'auto');
        finalDegreeDocUrl = uploadRes.secureUrl;
      } catch (err) {
        console.error('Failed to upload base64 degreeDoc to Cloudinary:', err);
      }
      if (finalDegreeDocUrl && finalDegreeDocUrl.startsWith('data:image/') && finalDegreeDocUrl.length > 100000) {
        try {
          const base64Data = finalDegreeDocUrl.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const resized = await sharp(buffer).resize(1000, 1000, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 70 }).toBuffer();
          finalDegreeDocUrl = `data:image/jpeg;base64,${resized.toString('base64')}`;
        } catch {}
      }
    }

    if (finalAvatarUrl !== undefined) profileUpdateData.avatarUrl = finalAvatarUrl;
    if (introVideoUrl !== undefined) profileUpdateData.introVideoUrl = introVideoUrl;
    if (body.isAvailable !== undefined) profileUpdateData.isAvailable = Boolean(body.isAvailable);
    
    if (status !== undefined && !profile.isVerified) profileUpdateData.status = status;

    // Update profile within a database transaction
    await prisma.$transaction(async (tx) => {
      // Update Tutor Profile
      await tx.tutorProfile.update({
        where: { userId: profile.userId },
        data: profileUpdateData
      });

      // Update user phone and role
      const userUpdates: any = { role: 'TUTOR' };
      if (body.phone) {
        let cleanPhone = String(body.phone).replace(/\D/g, '');
        if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
          cleanPhone = cleanPhone.slice(2);
        } else if (cleanPhone.length > 10) {
          cleanPhone = cleanPhone.slice(-10);
        }
        if (cleanPhone.length === 10) {
          userUpdates.phone = cleanPhone;
        }
      }
      await tx.user.update({
        where: { id: profile.userId },
        data: userUpdates,
      });

      // Handle KYC creation/update if not verified or updating before verification
      if (idType && idNumber && !profile.isVerified) {
        // Enforce secure AES-256 encryption
        const idNumberEncrypted = encrypt(idNumber);
        const idLast4 = idNumber.replace(/\D/g, '').slice(-4) || idNumber.slice(-4);
        
        const kycUpdateData: any = {
          idType,
          idLast4,
          idNumberEncrypted,
        };

        if (finalIdDocUrl) {
          kycUpdateData.idDocUrl = finalIdDocUrl;
          kycUpdateData.idStatus = 'PENDING';
          kycUpdateData.idRejectionNote = null;
        }

        if (finalDegreeDocUrl !== undefined) {
          kycUpdateData.degreeDocUrl = finalDegreeDocUrl;
          kycUpdateData.degreeStatus = 'PENDING';
          kycUpdateData.degreeRejectionNote = null;
        }

        await (tx.tutorKYC as any).upsert({
          where: { tutorId: profile.id },
          create: {
            tutorId: profile.id,
            idType,
            idLast4,
            idNumberEncrypted,
            idDocUrl: finalIdDocUrl || '/placeholder-doc.png',
            idStatus: 'PENDING',
            degreeDocUrl: finalDegreeDocUrl || null,
            degreeStatus: finalDegreeDocUrl ? 'PENDING' : 'PENDING',
          },
          update: kycUpdateData
        });
      }
    });

    // Send confirmation email to tutor when profile is submitted for interview/verification
    if (status === 'PENDING_INTERVIEW' && !profile.isVerified) {
      try {
        const tutorEmail = profile.user?.email || body.email;
        const tutorName = profile.user?.name || 'Educator';
        if (tutorEmail) {
          let subjectsArr: string[] = [];
          if (Array.isArray(subjects)) {
            subjectsArr = subjects;
          } else if (typeof subjects === 'string') {
            try { subjectsArr = JSON.parse(subjects); } catch { subjectsArr = [subjects]; }
          }
          await sendTutorProfileSubmittedEmail(tutorEmail, tutorName, subjectsArr);
        }
      } catch (mailErr) {
        console.error('Failed to send tutor profile submitted email:', mailErr);
      }
    }

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
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json({ success: false, error: 'User ID or Email is required.' }, { status: 400 });
    }

    let profile = null;
    if (userId) {
      profile = await prisma.tutorProfile.findUnique({
        where: { userId },
        include: {
          kycDoc: true,
          user: true,
        }
      });

      if (!profile) {
        profile = await prisma.tutorProfile.findUnique({
          where: { id: userId },
          include: {
            kycDoc: true,
            user: true,
          }
        });
      }
    }

    if (!profile && email) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: {
          tutorProfile: {
            include: {
              kycDoc: true,
              user: true,
            }
          }
        }
      });
      if (user?.tutorProfile) {
        profile = user.tutorProfile;
      }
    }

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
      } catch {
        // Fallback query
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
