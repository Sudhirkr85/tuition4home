import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | TuitionForHome — SSSAM Academy',
  description:
    'Read the TuitionForHome (SSSAM Academy) Privacy Policy. Learn how we collect, handle, encrypt, and protect parent inquiries, student information, and tutor KYC credentials in Gurugram & Delhi NCR.',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | TuitionForHome — SSSAM Academy',
    description:
      'Learn how TuitionForHome and SSSAM Academy protect user data, student privacy, and educator verification credentials.',
    url: 'https://sssamacademy.tech/privacy-policy',
    siteName: 'TuitionForHome',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 2, 2026';

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', backgroundColor: '#F8FAFC', padding: '3.5rem 1rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '2.5rem 2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          
          {/* Header */}
          <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backgroundColor: '#ECFDF5', color: '#047857', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              <ShieldCheck size={16} />
              <span>Official SSSAM Academy Policy</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              Privacy Policy
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '0.5rem' }}>
              Last Updated: <strong>{lastUpdated}</strong> • Effective for all users of <strong>TuitionForHome (sssamacademy.tech)</strong>
            </p>
          </div>

          {/* Policy Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#334155', fontSize: '0.94rem', lineHeight: 1.7 }}>
            
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                1. Overview &amp; Commitment to Privacy
              </h2>
              <p>
                TuitionForHome is an educational service platform operated and managed by <strong>SSSAM Academy</strong>, located at M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001. We are firmly committed to safeguarding the privacy and personal data of parents, students, educators, and visitors who use our platform.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                2. Information We Collect
              </h2>
              <p>We collect only the minimum necessary information required to facilitate home tuition matching and verify educator credentials:</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><strong>For Parents &amp; Students:</strong> Name, contact phone number, email address, residential locality / sector in Gurgaon or Delhi NCR, child’s academic grade, and tuition subject requirements.</li>
                <li><strong>For Tutors &amp; Educators:</strong> Full legal name, contact details, academic degrees and teaching qualifications, subject specializations, government identity documents (Aadhaar / PAN for background KYC verification), and introduction video submissions.</li>
                <li><strong>Technical Data:</strong> Standard server access logs, device browser types, and approximate geographic location to suggest nearby tutors.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                3. How We Use &amp; Protect Your Information
              </h2>
              <p>Collected information is used exclusively to:</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Connect parents with background-audited tutors in their residential sector.</li>
                <li>Enable academic counselors at SSSAM Academy to coordinate 1-on-1 trial classes.</li>
                <li>Verify tutor KYC credentials and maintain our safe educator directory.</li>
                <li>Send important service updates, class schedule notifications, and trial confirmations.</li>
              </ul>
              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1rem 1.25rem', borderRadius: '12px', marginTop: '0.85rem' }}>
                <strong style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                  <Lock size={16} /> Zero Data Selling Policy
                </strong>
                <span style={{ color: '#15803D', fontSize: '0.88rem' }}>
                  We never sell, rent, trade, or monetize your personal phone numbers or academic details with third-party telemarketers or advertisers.
                </span>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                4. Data Encryption &amp; Security Standards
              </h2>
              <p>
                All educator identification numbers (Aadhaar/PAN) and KYC records are encrypted using industry-standard AES-256 encryption before storage. Access to parent lead contact data is restricted to authorized SSSAM Academy administrative personnel via multi-factor authentication.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                5. User Rights &amp; Data Deletion Requests
              </h2>
              <p>
                You retain complete control over your personal data. You may request to review, update, or permanently delete your contact details or educator profile from our systems at any time by emailing our Grievance Officer at <a href="mailto:info@sssamacademy.com" style={{ color: '#0D9488', fontWeight: 700 }}>info@sssamacademy.com</a>.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                6. Contact &amp; Grievance Officer
              </h2>
              <p>If you have any questions or concerns regarding this Privacy Policy, please contact our administrative desk:</p>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: '14px', marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem' }}>
                <div><strong>🏢 Operator:</strong> SSSAM Academy</div>
                <div><strong>📍 Center Address:</strong> {SSSAM_OFFICE_DETAILS.address}</div>
                <div><strong>📞 Helpline:</strong> {SSSAM_OFFICE_DETAILS.phones[0]}</div>
                <div><strong>✉️ Official Email:</strong> info@sssamacademy.com / support@sssamacademy.com</div>
              </div>
            </section>

          </div>

          {/* Back Home Button */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/" style={{ color: '#0F6E56', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Return to TuitionForHome Homepage
            </Link>
            <Link href="/terms" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              View Terms of Service →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
