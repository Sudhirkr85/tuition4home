'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, ShieldCheck, GraduationCap, Menu, X, Sparkles, MapPin } from 'lucide-react';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';

interface NavbarProps {
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Top Notification Bar - SSSAM Academy Center Assurance */}
      <div style={{
        backgroundColor: 'var(--color-slate-900)',
        color: '#FFFFFF',
        padding: '0.4rem 1rem',
        fontSize: '0.78rem',
        fontWeight: 500,
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="pulse-emerald" />
            <span>
              <strong>Verified by SSSAM Academy:</strong> Offline Home & Online 1-on-1 Tuitions in Gurgaon & Delhi NCR
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ display: 'none', alignItems: 'center', gap: '0.3rem' }} className="md:flex">
              <MapPin size={13} color="var(--color-emerald-500)" />
              <span>Center: Sector 14, Old DLF, Gurugram</span>
            </span>
            <a 
              href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`}
              style={{ color: '#93C5FD', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Phone size={13} />
              <span>Call Helpline: {SSSAM_OFFICE_DETAILS.phones[0]}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tuitionforhome.png"
            alt="TuitionForHome Logo"
            style={{
              height: '46px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        </Link>


        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link href="/#find-tutor" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-slate-700)', transition: 'var(--transition-fast)' }}>
            Find a Tutor
          </Link>
          <Link href="/#fee-estimator" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-slate-700)', transition: 'var(--transition-fast)' }}>
            Fee Calculator
          </Link>
          <Link href="/tutor/register" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-slate-700)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Become a Tutor</span>
            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', backgroundColor: 'var(--color-emerald-50)', color: 'var(--color-emerald-600)', borderRadius: '9999px', fontWeight: 700, border: '1px solid var(--color-emerald-100)' }}>
              100% Free
            </span>
          </Link>
          <Link href="/counselor" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-slate-700)' }}>
            Counselor Desk
          </Link>
          <Link href="/admin" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-slate-500)' }}>
            Admin
          </Link>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onOpenBooking}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Sparkles size={16} />
            <span>Book Free Demo</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link href="/#find-tutor" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-900)' }}>
            🔍 Find a Tutor (Home / Online)
          </Link>
          <Link href="/#fee-estimator" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-900)' }}>
            🧮 Tuition Fee Calculator
          </Link>
          <Link href="/tutor/register" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-blue-600)', display: 'flex', justifyContent: 'space-between' }}>
            <span>🎓 Apply as Home Tutor</span>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', backgroundColor: 'var(--color-emerald-50)', color: 'var(--color-emerald-600)', borderRadius: '999px', fontWeight: 700 }}>Free Onboarding</span>
          </Link>
          <Link href="/counselor" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-900)' }}>
            📞 Counselor CRM Desk
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-slate-600)' }}>
            👑 Super Admin Portal
          </Link>
          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <a href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <Phone size={16} />
              <span>Call Advisor: {SSSAM_OFFICE_DETAILS.phones[0]}</span>
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
