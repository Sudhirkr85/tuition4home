'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does TuitionForHome verify and screen home tutors in Gurgaon & Delhi NCR?',
    a: 'Every educator undergoes a strict 3-stage auditing pipeline by SSSAM Academy: (1) Aadhaar & government ID background verification, (2) In-person degree & academic transcript verification, (3) 60-second video teaching audition evaluating communication, accent, and subject mastery. Only the top 5% of applicants are approved as ACTIVE_VERIFIED.',
  },
  {
    q: 'What are the home tuition fees in Gurgaon, Dwarka, and South Delhi?',
    a: 'Tuition rates depend on the grade and curriculum: Primary (Classes 1–5): ₹600 – ₹900/hr, Middle School (Classes 6–8): ₹700 – ₹1,000/hr, Secondary (Classes 9–10): ₹800 – ₹1,200/hr, Senior Secondary & NEET/JEE (Classes 11–12): ₹900 – ₹1,500/hr, and IB / Cambridge (MYP/DP): ₹1,500 – ₹2,500/hr. You can use our live Fee Calculator to get an instant estimate with zero hidden commissions.',
  },
  {
    q: 'What happens if my child is not comfortable or satisfied with the allocated tutor?',
    a: 'We offer a 100% Free Tutor Replacement Guarantee. If you feel the teaching chemistry or speed does not match your child’s learning style, our dedicated academic counselors will arrange an alternate top-rated educator within 24 hours at zero extra charge.',
  },
  {
    q: 'Do you provide tutors for CBSE, ICSE, IB Diploma, and Cambridge IGCSE boards?',
    a: 'Yes! We specialize in board-specific tutors familiar with the curriculum and exam patterns of premier schools like The Shri Ram School, DPS Sector 45 & Vasant Kunj, The Heritage School, Pathways World School, and Scottish High International.',
  },
  {
    q: 'Can I request a verified female home tutor for my child?',
    a: 'Absolutely. Over 45% of our verified teaching faculty are experienced lady educators. You can specify a preference for a female tutor during your inquiry, and all female tutors have verified background and address credentials.',
  },
  {
    q: 'Can we visit your physical center in Sector 14 Gurugram or take classes there?',
    a: 'Yes! TuitionForHome is operated by SSSAM Academy located at M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram. Parents are welcome to visit our center to meet our academic counselors, review tutor profiles in person, or attend sessions in our offline center classrooms.',
  },
];

export function HomeFaqAccordion() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <section aria-label="Frequently Asked Questions" style={{ padding: '5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-subtle)' }}>
      {/* Visible-matching FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
            <HelpCircle size={14} />
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-main)' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
            Everything you need to know about finding, verifying, and hiring home tutors in Gurgaon and Delhi NCR.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="apple-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: isOpen ? '#F0FDF9' : '#FFFFFF',
                }}
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: isOpen ? '#065F46' : 'var(--text-main)', margin: 0 }}>
                    {faq.q}
                  </h3>
                  <div style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    color: isOpen ? '#065F46' : 'var(--text-muted)',
                    flexShrink: 0,
                  }}>
                    <ChevronDown size={20} />
                  </div>
                </div>
                {isOpen && (
                  <p style={{ marginTop: '0.85rem', color: 'var(--color-slate-700)', fontSize: '0.93rem', lineHeight: 1.65, borderTop: '1px solid rgba(6, 95, 70, 0.1)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
