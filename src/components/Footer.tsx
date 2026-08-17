'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, GraduationCap, Clock, CheckCircle, Instagram, Facebook, Youtube } from 'lucide-react';
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
                src="/tuitionforhome.webp"
                alt="TuitionForHome Logo"
                style={{
                  height: '48px',
                  width: '48px',
                  objectFit: 'cover',
                  backgroundColor: '#FFFFFF',
                  padding: '0',
                  borderRadius: '50%',
                }}
              />
            </div>

            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              TuitionForHome is a tutoring mediation and management service operated by SSSAM Academy, Gurugram. Connecting parents with verified, background-checked Indian educators with transparent matching standards.
            </p>

            {/* Social Media Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <a
                href="https://www.instagram.com/tuition4home"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tuition4Home Instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F472B6',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                className="social-btn"
              >
                <Instagram size={19} />
              </a>

              <a
                href="https://www.facebook.com/tuition4home"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tuition4Home Facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60A5FA',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                className="social-btn"
              >
                <Facebook size={19} />
              </a>

              <a
                href="https://www.youtube.com/@codingwithsudhir"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CodingWithSudhir YouTube"
                style={{
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '0 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: '#F87171',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                }}
                className="social-btn"
              >
                <Youtube size={19} />
                <span>CodingWithSudhir</span>
              </a>
            </div>

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
            <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#2DD4BF" />
              <span>Home Tutors in Gurgaon</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.85rem' }}>
              {GURGAON_LOCALITIES.slice(0, 14).map((loc) => (
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
            <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} color="#2DD4BF" />
              <span>Subject Tuitions (Gurgaon)</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <Link href="/tuition/female-home-tutors-in-gurgaon" style={{ color: '#FDE047', fontWeight: 700 }} className="hover-link">• Verified Female Home Tutors</Link>
              <Link href="/tuition/primary-school-home-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Primary School (Class 1-5 Foundation)</Link>
              <Link href="/tuition/maths-home-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Mathematics Home Tutors</Link>
              <Link href="/tuition/physics-home-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Physics & NEET/JEE Tutors</Link>
              <Link href="/tuition/chemistry-home-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Chemistry (Organic & Inorganic)</Link>
              <Link href="/tuition/biology-neet-home-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Biology & NEET Medical Tutors</Link>
              <Link href="/tuition/computer-science-python-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Python, CS & Coding (SSSAM Academy)</Link>
              <Link href="/tuition/accounts-commerce-home-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Accounts & Commerce Tutors</Link>
              <Link href="/tuition/economics-business-studies-tutor-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• Economics & Business Studies</Link>
              <Link href="/tuition/ib-igcse-tutors-in-gurgaon" style={{ color: '#CBD5E1' }} className="hover-link">• IB & Cambridge IGCSE Elite Mentors</Link>
            </div>
          </div>

          {/* Col 4: SSSAM Physical Office & Contact */}
          <div>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Office & Support Desks
            </h3>
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
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/" style={{ color: '#94A3B8' }}>Privacy Policy</Link>
            <Link href="/tutor/register" style={{ color: '#94A3B8' }}>Tutor Agreement</Link>
            <Link href="/#how-it-works" style={{ color: '#94A3B8' }}>Payment Policy</Link>
            <Link href="/#how-it-works" style={{ color: '#94A3B8' }}>Cancellation Policy</Link>
            <a href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`} style={{ color: '#94A3B8' }}>Grievance Support</a>
            <a href={`mailto:${SSSAM_OFFICE_DETAILS.email}`} style={{ color: '#94A3B8' }}>Contact</a>
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
