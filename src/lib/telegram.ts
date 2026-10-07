/**
 * Telegram Notification Service for TuitionForHome
 * Dispatches real-time alerts for New Parent Leads & New Teacher Registrations.
 */

interface SendTelegramMessageOptions {
  text: string;
  buttons?: Array<Array<{ text: string; url: string }>>;
}

export async function sendTelegramNotification({ text, buttons }: SendTelegramMessageOptions): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || token === 'mock_telegram_bot_token' || !chatId || chatId === 'mock_telegram_chat_id') {
    return false;
  }

  try {
    const payload: any = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    };

    if (buttons && buttons.length > 0) {
      payload.reply_markup = {
        inline_keyboard: buttons,
      };
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return Boolean(data.ok);
  } catch (error) {
    console.error('[TELEGRAM_ALERT_ERROR]:', error);
    return false;
  }
}

/**
 * Sends an instant Telegram alert to staff when a new parent lead is submitted.
 */
export async function sendTelegramLeadAlert(lead: {
  parentName: string;
  parentPhone: string;
  locality?: string;
  formattedAddress?: string;
  latitude?: number | null;
  longitude?: number | null;
  gradeClass: string;
  subjectsNeeded: string[];
  preferredMode: string;
  requestedTutorName?: string;
}) {
  const cleanPhone = lead.parentPhone.replace(/\D/g, '').slice(-10);
  const locationText = lead.formattedAddress || lead.locality || 'Gurgaon';
  const subjectsText = lead.subjectsNeeded.length > 0 ? lead.subjectsNeeded.join(', ') : 'Not specified';

  const text = `🚨 <b>NEW STUDENT / PARENT LEAD</b>\n\n` +
    `👤 <b>Parent Name:</b> ${lead.parentName}\n` +
    `📞 <b>Phone:</b> +91 ${cleanPhone}\n` +
    `📍 <b>Locality:</b> ${locationText}\n` +
    `📚 <b>Class & Subjects:</b> ${lead.gradeClass} — ${subjectsText}\n` +
    `🎯 <b>Teaching Mode:</b> ${lead.preferredMode === 'OFFLINE_HOME' ? '🏡 Offline Home Tuition' : lead.preferredMode === 'ONLINE_LIVE' ? '💻 Online Live' : '✨ Both Home & Online'}\n` +
    (lead.requestedTutorName ? `👨‍🏫 <b>Requested Tutor:</b> ${lead.requestedTutorName}\n` : '') +
    `\n⏰ <i>Received at: ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })} IST</i>`;

  const buttons: Array<Array<{ text: string; url: string }>> = [
    [
      { text: '💬 WhatsApp Parent', url: `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${lead.parentName}, this is regarding your home tuition inquiry on TuitionForHome (SSSAM Academy).`)}` },
      ...(lead.latitude && lead.longitude
        ? [{ text: '🗺️ Map', url: `https://www.google.com/maps?q=${lead.latitude},${lead.longitude}` }]
        : []),
    ],
    [
      { text: '🛡️ Admin Panel', url: 'https://tuitionforhome.com/admin' },
      { text: '📞 Counselor Portal', url: 'https://tuitionforhome.com/counselor' },
    ],
  ];

  return sendTelegramNotification({ text, buttons });
}

/**
 * Sends an instant Telegram alert to staff when a new teacher registers or submits profile for verification.
 */
export async function sendTelegramTutorAlert(tutor: {
  name: string;
  phone: string;
  email?: string;
  highestDegree?: string;
  teachingMode?: string;
  subjects?: string[];
  serviceAreas?: string[];
  experienceYears?: number;
  travelRadiusKm?: number;
}) {
  const cleanPhone = tutor.phone.replace(/\D/g, '').slice(-10);
  const subjectsText = tutor.subjects && tutor.subjects.length > 0 ? tutor.subjects.join(', ') : 'Not specified';
  const sectorsText = tutor.serviceAreas && tutor.serviceAreas.length > 0 ? tutor.serviceAreas.slice(0, 5).join(', ') : 'Gurgaon';

  const text = `👨‍🏫 <b>NEW TEACHER REGISTRATION</b>\n\n` +
    `👤 <b>Teacher Name:</b> ${tutor.name}\n` +
    `📞 <b>Phone:</b> +91 ${cleanPhone}\n` +
    (tutor.email ? `📧 <b>Email:</b> ${tutor.email}\n` : '') +
    `🎓 <b>Degree:</b> ${tutor.highestDegree || 'Graduate'}\n` +
    `⏳ <b>Experience:</b> ${tutor.experienceYears ?? 0} Years\n` +
    `📚 <b>Subjects:</b> ${subjectsText}\n` +
    `📍 <b>Preferred Sectors:</b> ${sectorsText}\n` +
    `🚗 <b>Travel Radius:</b> ${tutor.travelRadiusKm || 5} km\n` +
    `🎯 <b>Mode:</b> ${tutor.teachingMode || 'OFFLINE_HOME'}\n` +
    `\n⏰ <i>Registered at: ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })} IST</i>`;

  const buttons: Array<Array<{ text: string; url: string }>> = [
    [
      { text: '💬 WhatsApp Teacher', url: `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${tutor.name}, welcome to TuitionForHome! We received your tutor registration.`)}` },
    ],
    [
      { text: '🛡️ Admin Panel', url: 'https://tuitionforhome.com/admin' },
      { text: '📞 Counselor Portal', url: 'https://tuitionforhome.com/counselor' },
    ],
  ];

  return sendTelegramNotification({ text, buttons });
}
