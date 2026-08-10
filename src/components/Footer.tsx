import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, GraduationCap, Clock, CheckCircle } from 'lucide-react';
import { GURGAON_LOCALITIES, SSSAM_OFFICE_DETAILS } from '@/lib/data';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-slate-900)',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '3rem',
          paddingBottom: '3.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {/* Col 1: Brand & SSSAM Academy Trust */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--color-blue-600), #60A5FA)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}>
                <GraduationCap size={22} />
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                Tuition<span style={{ color: '#60A5FA' }}>ForHome</span>
              </div>
            </div>

            <p style={{ color: 'var(--color-slate-300)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Gurgaon&apos;s premier managed home & online tuition mediation network. Connecting parents with verified, background-checked 1-on-1 educators with a 100% satisfaction guarantee.
            </p>

            {/* SSSAM Academy Accreditation Box */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-emerald-500)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                <ShieldCheck size={16} />
                <span>OPERATED & VERIFIED BY SSSAM ACADEMY</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-slate-300)', lineHeight: 1.4 }}>
                Physical Center: M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram (Near HUDA Market).
              </div>
            </div>
          </div>

          {/* Col 2: Top Gurgaon Localities (SEO Links) */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={18} color="#60A5FA" />
              <span>Home Tutors in Gurgaon</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              {GURGAON_LOCALITIES.slice(0, 10).map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/home-tutors-in-gurgaon/${loc.slug}`}
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-slate-300)',
                    transition: 'var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                  className="hover-link"
                >
                  <span style={{ color: 'var(--color-emerald-500)' }}>•</span>
                  <span>{loc.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Academic Programs & Modes */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Specialty Programs
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--color-slate-300)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={15} color="var(--color-emerald-500)" />
                <span>CBSE Class 9 & 10 Board Maths & Science</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={15} color="var(--color-emerald-500)" />
                <span>Class 11 & 12 Physics, Chemistry & Accounts</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={15} color="var(--color-emerald-500)" />
                <span>IB & IGCSE Cambridge International Mentors</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={15} color="var(--color-emerald-500)" />
                <span>Python, AI & Coding for School Kids</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={15} color="var(--color-emerald-500)" />
                <span>Online 1-on-1 Live Interactive Classes</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Physical Office & Helplines */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Office & Support Desks
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: 'var(--color-slate-300)' }}>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <MapPin size={20} color="#60A5FA" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{SSSAM_OFFICE_DETAILS.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <Phone size={18} color="var(--color-emerald-500)" style={{ flexShrink: 0 }} />
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
          color: 'var(--color-slate-400)',
        }}>
          <div>
            © {new Date().getFullYear()} <strong>TuitionForHome</strong>. Powered by SSSAM Academy. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/" style={{ color: 'var(--color-slate-400)' }}>Privacy Policy</Link>
            <Link href="/" style={{ color: 'var(--color-slate-400)' }}>Terms of Service</Link>
            <Link href="/counselor" style={{ color: 'var(--color-slate-400)' }}>Counselor Desk</Link>
            <Link href="/admin" style={{ color: 'var(--color-slate-400)' }}>Admin Portal</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-link:hover {
          color: #93C5FD !important;
          transform: translateX(3px);
        }
      `}</style>
    </footer>
  );
}
