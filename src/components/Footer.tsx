'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, GraduationCap, Clock, CheckCircle } from 'lucide-react';
import { GURGAON_LOCALITIES, SSSAM_OFFICE_DETAILS } from '@/lib/data';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      paddingTop: '4.5rem',
      paddingBottom: '2.5rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '5rem',
    }}>
      <div className="container">
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          paddingBottom: '3.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {/* Col 1: Brand & SSSAM Academy Trust */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tuitionforhome.png"
                alt="TuitionForHome Logo"
                style={{
                  height: '42px',
                  width: 'auto',
                  objectFit: 'contain',
                  backgroundColor: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: '8px',
                }}
              />
            </div>

            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Gurgaon&apos;s premier managed home & online tuition mediation network. Connecting parents with verified, background-checked Indian educators with a 100% satisfaction guarantee.
            </p>

            {/* SSSAM Academy Accreditation Box */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2DD4BF', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                <ShieldCheck size={16} />
                <span>OPERATED & VERIFIED BY SSSAM ACADEMY</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                Physical Center: M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram (Near HUDA Market).
              </div>
            </div>
          </div>

          {/* Col 2: Gurgaon Sector Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#2DD4BF" />
              <span>Home Tutors in Gurgaon</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.85rem' }}>
              {GURGAON_LOCALITIES.slice(0, 10).map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/home-tutors-in-gurgaon/${loc.slug}`}
                  style={{ color: '#CBD5E1', transition: 'color 0.2s' }}
                  className="hover-link"
                >
                  • {loc.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Subject Specializations */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} color="#2DD4BF" />
              <span>Subject Tuitions (Gurgaon)</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <Link href="/tuition/maths-home-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Mathematics Home Tutors</Link>
              <Link href="/tuition/physics-home-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Physics & NEET/JEE Tutors</Link>
              <Link href="/tuition/chemistry-home-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Chemistry (Organic & Inorganic)</Link>
              <Link href="/tuition/computer-science-python-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Python, CS & Coding (SSSAM Academy)</Link>
              <Link href="/tuition/accounts-commerce-home-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Accounts & Commerce Tutors</Link>
              <Link href="/tuition/ib-igcse-tutors-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• IB & Cambridge IGCSE Elite Mentors</Link>
            </div>
          </div>

          {/* Col 4: SSSAM Physical Office & Contact */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Office & Support Desks
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <MapPin size={18} color="#2DD4BF" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{SSSAM_OFFICE_DETAILS.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Phone size={18} color="#93C5FD" style={{ flexShrink: 0 }} />
                <div>
                  <div>{SSSAM_OFFICE_DETAILS.phones[0]}</div>
                  <div>{SSSAM_OFFICE_DETAILS.phones[1]}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Clock size={18} color="#FBBF24" style={{ flexShrink: 0 }} />
                <span>{SSSAM_OFFICE_DETAILS.hours}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Mail size={18} color="#60A5FA" style={{ flexShrink: 0 }} />
                <span>{SSSAM_OFFICE_DETAILS.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.82rem',
          color: '#94A3B8',
        }}>
          <div>
            © {new Date().getFullYear()} <strong>TuitionForHome</strong>. Powered by SSSAM Academy. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#94A3B8' }}>Privacy Policy</Link>
            <Link href="/" style={{ color: '#94A3B8' }}>Terms of Service</Link>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}>Sitemap (XML)</a>
            <Link href="/counselor" style={{ color: '#94A3B8' }}>Counselor Desk</Link>
            <Link href="/admin" style={{ color: '#94A3B8' }}>Admin Portal</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-link:hover {
          color: #2DD4BF !important;
          transform: translateX(3px);
        }
      `}</style>
    </footer>
  );
}
