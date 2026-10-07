import { NextResponse } from 'next/server';
import { sendTutorProfileSubmittedEmail } from '@/lib/brevo';
import { sendTelegramTutorAlert } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, teachingMode, highestDegree, subjects, serviceAreas, hourlyRateHome } = body;

    const tutorId = `TUT-${Math.floor(10000 + Math.random() * 90000)}`;

    const subjectsArr = Array.isArray(subjects) ? subjects : (subjects ? [subjects] : []);
    const sectorsArr = Array.isArray(serviceAreas) ? serviceAreas : (serviceAreas ? [serviceAreas] : []);

    // 1. Email notification to tutor
    if (email) {
      try {
        await sendTutorProfileSubmittedEmail(email, name || 'Educator', subjectsArr);
      } catch (e) {
        console.error('Failed to send tutor registration email:', e);
      }
    }

    // 2. Instant Telegram alert to team
    try {
      await sendTelegramTutorAlert({
        name: name || 'Educator',
        phone: phone || '9876543210',
        email: email || undefined,
        highestDegree: highestDegree || undefined,
        teachingMode: teachingMode || 'OFFLINE_HOME',
        subjects: subjectsArr,
        serviceAreas: sectorsArr,
      });
    } catch (tgErr) {
      console.error('Failed to dispatch tutor telegram alert:', tgErr);
    }

    return NextResponse.json({
      success: true,
      tutorId,
      status: 'PENDING_INTERVIEW',
      message: 'Tutor registered successfully. Pending telephonic interview.',
    });
  } catch (error) {
    console.error('Error registering tutor:', error);
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}
