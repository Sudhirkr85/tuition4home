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
  senderEmail = process.env.BREVO_SENDER_EMAIL || 'support@sssamacademy.com',
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
        Counselor Helpline: +91 92170 31899 | Email: support@sssamacademy.com
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    to: [{ email: parentEmail, name: parentName }],
    subject: `Tuition Request Received — ${grade} (${subjects.join(', ')}) | TuitionForHome`,
    htmlContent,
  });
}

/**
 * Sends an email to a tutor when they submit their profile for verification review.
 */
export async function sendTutorProfileSubmittedEmail(
  tutorEmail: string,
  tutorName: string,
  subjects?: string[]
) {
  const subjectsList = subjects && subjects.length > 0 ? subjects.slice(0, 4).join(', ') : 'Registered Subjects';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0F172A; margin: 0; font-size: 22px;">🎓 TuitionForHome</h2>
        <p style="color: #64748B; font-size: 12px; margin: 4px 0 0 0;">SSSAM Academy • Sector 14 Gurugram</p>
      </div>

      <div style="background-color: #F0FDF4; border-radius: 12px; padding: 20px; text-align: left; border: 1px solid #BBF7D0; margin-bottom: 20px;">
        <h3 style="color: #166534; margin: 0 0 8px 0; font-size: 17px;">Tutor Profile Submitted Successfully! 📋</h3>
        <p style="color: #15803D; font-size: 14px; margin: 0; line-height: 1.5;">
          Dear <strong>${tutorName}</strong>, thank you for completing and submitting your educator profile for <strong>${subjectsList}</strong> on TuitionForHome.
        </p>
      </div>

      <div style="background-color: #F8FAFC; border-radius: 12px; padding: 18px 20px; border: 1px solid #E2E8F0; margin-bottom: 20px;">
        <strong style="color: #0F172A; font-size: 14px; display: block; margin-bottom: 10px;">Verification Process &amp; Next Steps:</strong>
        <ol style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px; line-height: 1.7;">
          <li><strong>Document &amp; KYC Verification:</strong> Our academic team at SSSAM Academy will review your uploaded government ID and degree certificates.</li>
          <li><strong>Academic Screening:</strong> A counselor will connect with you via phone/WhatsApp within 24–48 hours for a quick telephonic demo screening.</li>
          <li><strong>Profile Activation:</strong> Once verified, your educator profile will go live with the <em>SSSAM Verified Badge</em> to receive student demo requests and 1-on-1 home tuition leads.</li>
        </ol>
      </div>

      <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin: 0 0 16px 0;">
        You can log in to your Tutor Dashboard at any time to review your profile status or update teaching preferences.
      </p>

      <div style="text-align: center; margin-bottom: 20px;">
        <a href="https://sssamacademy.tech/tutor/profile" style="background-color: #0F6E56; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">
          Open Tutor Dashboard →
        </a>
      </div>

      <div style="border-top: 1px solid #E2E8F0; margin-top: 24px; padding-top: 16px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.5;">
        SSSAM Academy • M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001<br />
        Tutor Support Desk: +91 92170 31899 | Email: support@sssamacademy.com
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    to: [{ email: tutorEmail, name: tutorName }],
    subject: `Tutor Profile Submitted for Verification — TuitionForHome (SSSAM Academy)`,
    htmlContent,
  });
}

/**
 * Sends an email to a tutor when their profile is verified & activated by SSSAM Academy.
 */
export async function sendTutorVerifiedEmail(
  tutorEmail: string,
  tutorName: string
) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0F172A; margin: 0; font-size: 22px;">🎓 TuitionForHome</h2>
        <p style="color: #64748B; font-size: 12px; margin: 4px 0 0 0;">SSSAM Academy • Sector 14 Gurugram</p>
      </div>

      <div style="background: linear-gradient(135deg, #0F6E56 0%, #059669 100%); border-radius: 12px; padding: 22px; text-align: center; color: #ffffff; margin-bottom: 20px;">
        <div style="font-size: 32px; margin-bottom: 8px;">🎉 ✨</div>
        <h3 style="color: #ffffff; margin: 0 0 6px 0; font-size: 19px; font-weight: 800;">Congratulations, ${tutorName}!</h3>
        <p style="color: #E6FFFA; font-size: 14px; margin: 0; line-height: 1.5;">
          Your Tutor Profile has been successfully verified &amp; approved by SSSAM Academy.
        </p>
      </div>

      <div style="background-color: #F8FAFC; border-radius: 12px; padding: 18px 20px; border: 1px solid #E2E8F0; margin-bottom: 20px;">
        <strong style="color: #0F172A; font-size: 14px; display: block; margin-bottom: 10px;">Your Profile is Now Active:</strong>
        <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px; line-height: 1.7;">
          <li><strong>Verified Badge:</strong> Your profile displays the official <em>SSSAM Verified Educator</em> badge.</li>
          <li><strong>Live in Search:</strong> Parents searching for tutors in your subjects &amp; sectors in Gurgaon can view your profile and book demo classes.</li>
          <li><strong>Direct Counselor Matching:</strong> Our academic counselors will prioritize assigning high-matching 1-on-1 home tuition leads in your area.</li>
        </ul>
      </div>

      <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin: 0 0 20px 0;">
        Make sure your WhatsApp number and notifications are active to receive instant demo class inquiries from our counselors.
      </p>

      <div style="text-align: center; margin-bottom: 20px;">
        <a href="https://sssamacademy.tech/tutor/profile" style="background-color: #0F6E56; color: #ffffff; text-decoration: none; padding: 12px 26px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(15, 110, 86, 0.2);">
          View Your Verified Dashboard →
        </a>
      </div>

      <div style="border-top: 1px solid #E2E8F0; margin-top: 24px; padding-top: 16px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.5;">
        SSSAM Academy • M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001<br />
        Tutor Support Desk: +91 92170 31899 | Email: support@sssamacademy.com
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    to: [{ email: tutorEmail, name: tutorName }],
    subject: `Congratulations! Your Tutor Profile is Verified & Active 🎉 | TuitionForHome`,
    htmlContent,
  });
}

/**
 * Sends an email to a tutor when their KYC Document or Degree is rejected by Admin with reason.
 */
export async function sendTutorKYCRejectedEmail(
  tutorEmail: string,
  tutorName: string,
  docTypeLabel: string,
  rejectionReason: string
) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0F172A; margin: 0; font-size: 22px;">🎓 TuitionForHome</h2>
        <p style="color: #64748B; font-size: 12px; margin: 4px 0 0 0;">SSSAM Academy • Sector 14 Gurugram</p>
      </div>

      <div style="background-color: #FEF2F2; border-radius: 12px; padding: 20px; text-align: left; border: 1px solid #FCA5A5; margin-bottom: 20px;">
        <h3 style="color: #991B1B; margin: 0 0 8px 0; font-size: 17px;">Action Required: Document Verification Update ⚠️</h3>
        <p style="color: #B91C1C; font-size: 14px; margin: 0; line-height: 1.5;">
          Dear <strong>${tutorName}</strong>, during the SSSAM Academy verification review, your <strong>${docTypeLabel}</strong> requires re-upload.
        </p>
      </div>

      <div style="background-color: #F8FAFC; border-radius: 12px; padding: 18px 20px; border: 1px solid #E2E8F0; margin-bottom: 20px;">
        <strong style="color: #0F172A; font-size: 14px; display: block; marginBottom: 8px;">Reviewer Note / Reason:</strong>
        <div style="background-color: #FFFFFF; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #EF4444; font-size: 13px; color: #334155; line-height: 1.6;">
          &ldquo;${rejectionReason}&rdquo;
        </div>
      </div>

      <div style="background-color: #F0FDF4; border-radius: 12px; padding: 16px 20px; border: 1px solid #BBF7D0; margin-bottom: 20px; font-size: 13px; color: #166534; line-height: 1.6;">
        <strong>How to Resolve:</strong>
        <ol style="margin: 6px 0 0 0; padding-left: 18px;">
          <li>Log in to your Tutor Profile dashboard.</li>
          <li>Go to the <strong>KYC & Security</strong> section.</li>
          <li>Upload a clear, un-cropped, high-resolution copy of your ${docTypeLabel} and click Save.</li>
        </ol>
      </div>

      <div style="text-align: center; margin-bottom: 20px;">
        <a href="https://sssamacademy.tech/tutor/profile" style="background-color: #0F6E56; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block;">
          Re-Upload Document Now →
        </a>
      </div>

      <div style="border-top: 1px solid #E2E8F0; margin-top: 24px; padding-top: 16px; text-align: center; font-size: 11px; color: #94A3B8; line-height: 1.5;">
        SSSAM Academy • M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001<br />
        Tutor Helpdesk: +91 92170 31899 | Email: support@sssamacademy.com
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    to: [{ email: tutorEmail, name: tutorName }],
    subject: `Action Required: Re-upload ${docTypeLabel} — TuitionForHome Verification`,
    htmlContent,
  });
}
