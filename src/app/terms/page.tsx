import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';
import { ShieldCheck, CheckCircle2, RefreshCw, FileText, DollarSign, Award, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service & Policies | TuitionForHome — SSSAM Academy',
  description:
    'Read the official Terms of Service, 1-on-1 Trial Class Policy, 100% Free Tutor Replacement Guarantee, and Cancellation/Refund Terms for TuitionForHome (SSSAM Academy Gurugram).',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | TuitionForHome — SSSAM Academy',
    description:
      'Learn about TuitionForHome terms, parent trial policies, tutor codes of conduct, and refund guidelines.',
    url: 'https://sssamacademy.tech/terms',
    siteName: 'TuitionForHome',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function TermsPage() {
  const lastUpdated = 'September 2, 2026';

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', backgroundColor: '#F8FAFC', padding: '3.5rem 1rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '2.5rem 2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          
          {/* Header */}
          <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              <FileText size={16} />
              <span>Standard Operational Terms</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              Terms of Service &amp; Policies
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '0.5rem' }}>
              Last Updated: <strong>{lastUpdated}</strong> • Governed by <strong>SSSAM Academy Sector 14 Gurugram</strong>
            </p>
          </div>

          {/* Policy Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#334155', fontSize: '0.94rem', lineHeight: 1.7 }}>
            
            <section id="general-terms">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or submitting an inquiry on <strong>TuitionForHome (sssamacademy.tech)</strong>, parents, students, and educators agree to be bound by these Terms of Service. TuitionForHome operates as a dedicated home tutoring and mentor coordination platform managed by SSSAM Academy Gurugram.
              </p>
            </section>

            <section id="matching-trial">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                2. 1-on-1 Trial Class Policy
              </h2>
              <p>
                To ensure complete academic compatibility and comfort, parents are offered a 1-on-1 in-person or live online trial class with matched tutors.
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Trial classes are scheduled by mutual agreement between the parent and the educator.</li>
                <li>If the parent decides not to continue with the allocated educator after the trial class, there is zero obligation to proceed.</li>
                <li>Parents may request an alternative tutor profile at no additional matchmaking fee.</li>
              </ul>
            </section>

            <section id="replacement-guarantee">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                3. 100% Free Tutor Replacement Guarantee
              </h2>
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1.25rem', borderRadius: '14px', marginBottom: '0.85rem' }}>
                <strong style={{ color: '#065F46', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                  <RefreshCw size={16} /> Instant Educator Replacement
                </strong>
                <span style={{ color: '#047857', fontSize: '0.88rem' }}>
                  If at any point during regular classes a tutor cannot continue due to schedule conflicts, relocation, or if academic expectations are not met, SSSAM Academy will allocate a pre-verified replacement tutor within 24 to 48 hours at zero extra charge.
                </span>
              </div>
            </section>

            <section id="payment-policy">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                4. Payment &amp; Fee Policy
              </h2>
              <p>
                All tuition fee structures are agreed upon upfront prior to commencement. Hourly or monthly packages depend on student grade, board curriculum (CBSE, ICSE, IB, Cambridge), and weekly frequency. Payments must be processed through authorized platform channels or directly to SSSAM Academy billing receipts.
              </p>
            </section>

            <section id="cancellation-policy">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                5. Cancellation &amp; Refund Policy
              </h2>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><strong>Class Rescheduling:</strong> Notice of at least 4 hours is required to reschedule a scheduled home or online session without fee deduction.</li>
                <li><strong>Unused Session Refunds:</strong> If a student discontinues tuition before completing a prepaid monthly package, any unused sessions will be refunded on a pro-rata basis within 5–7 business days upon written notice.</li>
              </ul>
            </section>

            <section id="tutor-terms">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                6. Educator Code of Conduct &amp; Verification
              </h2>
              <p>
                All registered educators must provide authentic academic degree certificates and valid government photo ID for KYC verification. Educators must maintain strict professional ethics, punctuality, and student safety standards at all times. Any misrepresentation of credentials will result in immediate profile termination.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                7. Contact &amp; Support Desk
              </h2>
              <p>For assistance regarding tutor allocation, fee estimates, or replacement requests, reach out to our team:</p>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: '14px', marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem' }}>
                <div><strong>🏢 Operating Center:</strong> SSSAM Academy, {SSSAM_OFFICE_DETAILS.address}</div>
                <div><strong>📞 Academic Desk:</strong> {SSSAM_OFFICE_DETAILS.phones[0]}</div>
                <div><strong>✉️ Support Email:</strong> info@sssamacademy.com / support@sssamacademy.com</div>
              </div>
            </section>

          </div>

          {/* Navigation Links */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/" style={{ color: '#0F6E56', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              ← Return to Homepage
            </Link>
            <Link href="/privacy-policy" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              View Privacy Policy →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
