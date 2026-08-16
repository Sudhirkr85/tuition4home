import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      parentName,
      parentPhone,
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
        parentPhone: parentPhone,
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

    console.log(`[LEAD SAVED TO DB]: ${lead.id} from ${parentName} (${parentPhone}) in ${locality} | Specific Tutor: ${specificTutor || 'None'}`);

    // If Telegram Bot credentials exist, fire instant notification to staff group
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramToken !== 'mock_telegram_bot_token' && telegramChatId) {
      try {
        const locationLine = latitude && longitude
          ? `📍 *GPS Location:* [Open in Google Maps](https://www.google.com/maps?q=${latitude},${longitude})`
          : `📍 *Locality:* ${locality}`;

        const text = `🚨 *NEW PARENT LEAD (Gurgaon)*\n\n👤 *Parent:* ${parentName}\n📞 *Phone:* +91 ${parentPhone}\n${locationLine}\n🏠 *Address:* ${formattedAddress || locality}\n📚 *Class & Subject:* ${gradeClass} - ${subjectsNeeded?.join(', ')}\n🎯 *Mode:* ${preferredMode}\n${assignedTutorName ? `👨‍🏫 *Requested Tutor:* ${assignedTutorName}` : ''}`;
        
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '📞 Call Parent', url: `tel:${parentPhone}` },
                  { text: '💬 WhatsApp', url: `https://wa.me/91${parentPhone}` },
                ],
                ...(latitude && longitude
                  ? [[{ text: '🗺️ View on Map', url: `https://www.google.com/maps?q=${latitude},${longitude}` }]]
                  : []),
              ],
            },
          }),
        });
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr);
      }
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
