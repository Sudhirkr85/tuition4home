/**
 * Brevo (formerly Sendinblue) Transactional Email Service Module
 * Handles automated email alerts for new parent leads, counselor notifications, and tutor KYC status.
 */

interface SendEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  senderEmail?: string;
  senderName?: string;
}

export async function sendTransactionalEmail({
  to,
  subject,
  htmlContent,
  senderEmail = process.env.BREVO_SENDER_EMAIL || 'support@tuitionforhome.com',
  senderName = process.env.BREVO_SENDER_NAME || 'TuitionForHome Support',
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey || apiKey.includes('mock')) {
    return { success: true, messageId: `mock_brevo_${Date.now()}` };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to,
        subject,
        htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API Error Response:', data);
      return { success: false, error: data.message || 'Failed to send email via Brevo' };
    }

    return { success: true, messageId: data.messageId };
  } catch (err: any) {
    console.error('Brevo Email dispatch failed:', err);
    return { success: false, error: err.message || 'Network error connecting to Brevo' };
  }
}

/**
 * Sends a welcome & confirmation email to parent after submitting an inquiry.
 */
export async function sendParentInquiryConfirmationEmail(
  parentEmail: string,
  parentName: string,
  grade: string,
  locality: string,
  subjects: string[]
) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0F172A; margin: 0;">🎓 TuitionForHome</h2>
        <p style="color: #64748B; font-size: 13px; margin: 4px 0 0 0;">Operated & Verified by SSSAM Academy Sector 14 Gurugram</p>
      </div>

      <div style="background-color: #F0FDF4; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #BBF7D0;">
        <h3 style="color: #166534; margin: 0 0 8px 0;">Tuition Inquiry Confirmed! 🎉</h3>
        <p style="color: #15803D; font-size: 14px; margin: 0; line-height: 1.5;">
          Dear <strong>${parentName}</strong>, thank you for submitting your home tuition request for <strong>${grade} (${subjects.join(', ')})</strong> in <strong>${locality}</strong>.
        </p>
      </div>

      <div style="background-color: #F8FAFC; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #E2E8F0; font-size: 14px; color: #334155; line-height: 1.6;">
        <strong style="color: #0F172A;">What Happens Next:</strong>
        <ol style="padding-left: 20px; margin: 8px 0 0 0;">
          <li>Our academic counselor at SSSAM Academy will review verified educators near your sector.</li>
          <li>We will connect with you via phone/WhatsApp within <strong>2 hours</strong> to schedule your 1st class.</li>
          <li>All classes come with a <strong>100% Free Tutor Replacement Guarantee</strong>.</li>
        </ol>
      </div>

      <div style="border-top: 1px solid #E2E8F0; padding-top: 16px; text-align: center; font-size: 12px; color: #94A3B8;">
        SSSAM Academy, M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001<br />
        Counselor Helpline: +91 9811204921 | Email: support@tuitionforhome.com
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    to: [{ email: parentEmail, name: parentName }],
    subject: `Tuition Request Received — ${grade} (${subjects.join(', ')}) | TuitionForHome`,
    htmlContent,
  });
}
