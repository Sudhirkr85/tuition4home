import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

async function optimizeBase64Avatar(base64Str: string): Promise<string> {
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return base64Str;
  }
  try {
    const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const resizedBuffer = await sharp(buffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 75 })
      .toBuffer();
    return `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
  } catch (err) {
    return '/placeholder-avatar.jpg';
  }
}

async function optimizeBase64Doc(base64Str: string): Promise<string> {
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return base64Str;
  }
  try {
    const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const resizedBuffer = await sharp(buffer)
      .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();
    return `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
  } catch {
    return base64Str;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const secret = body.secret || new URL(req.url).searchParams.get('secret');

    // Simple security check (or session verify)
    if (secret !== 'tfh_admin_optimize_2026') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const tutors = await prisma.tutorProfile.findMany({
      select: { id: true, userId: true, avatarUrl: true },
    });

    let cleanedAvatars = 0;
    for (const t of tutors) {
      if (t.avatarUrl && t.avatarUrl.startsWith('data:image/') && t.avatarUrl.length > 25000) {
        const optimized = await optimizeBase64Avatar(t.avatarUrl);
        await prisma.tutorProfile.update({
          where: { id: t.id },
          data: { avatarUrl: optimized },
        });
        cleanedAvatars++;
      }
    }

    const kycDocs = await prisma.tutorKYC.findMany({
      select: { id: true, tutorId: true, idDocUrl: true, degreeDocUrl: true },
    });

    let cleanedKyc = 0;
    for (const kyc of kycDocs) {
      let updateData: any = {};

      if (kyc.idDocUrl && kyc.idDocUrl.startsWith('data:image/') && kyc.idDocUrl.length > 50000) {
        const optimizedId = await optimizeBase64Doc(kyc.idDocUrl);
        updateData.idDocUrl = optimizedId;
        cleanedKyc++;
      }

      if (kyc.degreeDocUrl && kyc.degreeDocUrl.startsWith('data:image/') && kyc.degreeDocUrl.length > 50000) {
        const optimizedDegree = await optimizeBase64Doc(kyc.degreeDocUrl);
        updateData.degreeDocUrl = optimizedDegree;
        cleanedKyc++;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.tutorKYC.update({
          where: { id: kyc.id },
          data: updateData,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database images optimized successfully!',
      stats: {
        cleanedAvatars,
        cleanedKyc,
        totalTutorsChecked: tutors.length,
        totalKycChecked: kycDocs.length,
      },
    });
  } catch (error: any) {
    console.error('Optimize DB error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Optimization failed' }, { status: 500 });
  }
}

export { POST as GET };
