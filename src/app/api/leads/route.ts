import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentName, parentPhone, preferredMode, locality, gradeClass, subjectsNeeded, assignedTutorName } = body;

    const leadId = `LD-${Math.floor(1000 + Math.random() * 9000)}`;

    console.log(`[LEAD RECEIVED]: ${leadId} from ${parentName} (${parentPhone}) in ${locality} for ${gradeClass}`);

    // If Telegram Bot credentials exist, fire instant notification to staff group
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramToken !== 'mock_telegram_bot_token' && telegramChatId) {
      try {
        const text = `🚨 *NEW PARENT LEAD (Gurgaon)*\n\n👤 *Parent:* ${parentName}\n📞 *Phone:* +91 ${parentPhone}\n📍 *Locality:* ${locality}\n📚 *Class & Subject:* ${gradeClass} - ${subjectsNeeded?.join(', ')}\n🎯 *Mode:* ${preferredMode}\n${assignedTutorName ? `👨‍🏫 *Requested Tutor:* ${assignedTutorName}` : ''}`;
        
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
      leadId,
      message: 'Demo class request successfully recorded.',
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to process lead' }, { status: 500 });
  }
}
