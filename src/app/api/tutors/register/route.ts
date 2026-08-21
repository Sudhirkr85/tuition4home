import { NextResponse } from 'next/server';
import { sendTutorProfileSubmittedEmail } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, teachingMode, highestDegree, subjects, serviceAreas, hourlyRateHome } = body;

    const tutorId = `TUT-${Math.floor(10000 + Math.random() * 90000)}`;

    if (email) {
      try {
        const subjectsArr = Array.isArray(subjects) ? subjects : (subjects ? [subjects] : []);
        await sendTutorProfileSubmittedEmail(email, name || 'Educator', subjectsArr);
      } catch (e) {
        console.error('Failed to send tutor registration email:', e);
      }
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
