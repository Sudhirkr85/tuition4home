'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface CourseFaqAccordionProps {
  faqs: FAQItem[];
  topicLabel: string;
  locationLabel: string;
}

export default function CourseFaqAccordion({ faqs, topicLabel, locationLabel }: CourseFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            style={{
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              boxShadow: isOpen ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none',
            }}
          >
            <button
              onClick={() => toggleIndex(index)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: '#0F172A',
                gap: '1rem',
              }}
              aria-expanded={isOpen}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <HelpCircle size={20} color="#2563EB" style={{ flexShrink: 0 }} />
                <span>{faq.question}</span>
              </div>
              {isOpen ? (
                <ChevronUp size={20} color="#64748B" style={{ flexShrink: 0 }} />
              ) : (
                <ChevronDown size={20} color="#64748B" style={{ flexShrink: 0 }} />
              )}
            </button>

            {isOpen && (
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderTop: '1px solid #E2E8F0',
                  color: '#475569',
                  fontSize: '0.975rem',
                  lineHeight: 1.65,
                  backgroundColor: '#FFFFFF',
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
