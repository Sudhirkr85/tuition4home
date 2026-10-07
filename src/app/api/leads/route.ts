import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendTelegramLeadAlert } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      parentName,
      parentPhone,
      phone,
      preferredMode,
      locality,
      formattedAddress,
      latitude,
      longitude,
      gradeClass,
      board,
      subjectsNeeded,
      assignedTutorName,
      requestedTutorName,
      requestedTutorId,
    } = body;

    const resolvedPhone = parentPhone || phone || '9876543210';
    const specificTutor = requestedTutorName || assignedTutorName;

    // Check if requestedTutorId exists in database
    let validTutorId: string | null = null;
    if (requestedTutorId) {
      const tutorExists = await prisma.tutorProfile.findUnique({
        where: { id: requestedTutorId },
        select: { id: true },
      });
      if (tutorExists) validTutorId = tutorExists.id;
    }

    // Save lead to MySQL database with GPS coordinates & requested tutor notes
    const lead = await prisma.lead.create({
      data: {
        parentName: parentName || 'Parent (Gurgaon)',
        parentPhone: resolvedPhone,
        preferredMode: preferredMode === 'OFFLINE_HOME' ? 'OFFLINE_HOME' : preferredMode === 'ONLINE_LIVE' ? 'ONLINE_LIVE' : 'BOTH',
        locality: locality || 'Gurgaon',
        formattedAddress: formattedAddress || locality || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        gradeClass: gradeClass || 'Class 10',
        board: board || 'CBSE',
        subjectsNeeded: JSON.stringify(subjectsNeeded || []),
        assignedTutorId: validTutorId,
        notes: specificTutor ? `🎯 Specifically Requested Tutor: ${specificTutor}` : null,
      },
    });

    // Send instant Telegram alert to team/staff group
    try {
      await sendTelegramLeadAlert({
        parentName: parentName || 'Parent (Gurgaon)',
        parentPhone: resolvedPhone,
        locality: locality || 'Gurgaon',
        formattedAddress: formattedAddress || locality || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        gradeClass: gradeClass || 'Class 10',
        subjectsNeeded: Array.isArray(subjectsNeeded) ? subjectsNeeded : [],
        preferredMode: preferredMode || 'BOTH',
        requestedTutorName: specificTutor || undefined,
      });
    } catch (tgErr) {
      console.error('Telegram notification error:', tgErr);
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Tuition inquiry request successfully recorded.',
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to process lead' }, { status: 500 });
  }
}
