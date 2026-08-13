'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Menu, X, ShieldCheck, Home, Video, Sparkles, Building2, UserCheck } from 'lucide-react';
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
      borderBottom: '1px solid var(--border-hairline)',
    }}>
      {/* Top SSSAM Academy Trust Bar */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        fontSize: '0.78rem',
        padding: '0.4rem 0',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={14} color="#34D399" />
            <span>Operated & Verified by <strong>SSSAM Academy</strong> • Sector 14, Gurugram</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ display: 'none', color: '#94A3B8' }} className="desktop-nav">
              📍 M24 Ground Floor, Old DLF Colony
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
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tuitionforhome.png"
            alt="TuitionForHome Logo"
            style={{
              height: '44px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link href="/" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Home
          </Link>
          <Link href="/#find-tutor" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Find Tutors
          </Link>
          <Link href="/#how-it-works" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            How It Works
          </Link>
          <Link href="/#fee-estimator" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Fee Estimator
          </Link>
          <Link href="/tutor/register" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-blue)' }}>
            Apply as Tutor
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
          <Link href="/tutor/register" className="btn btn-secondary btn-sm">
            <UserCheck size={14} />
            <span>Tutor Login</span>
          </Link>

          <button
            type="button"
            onClick={() => onOpenBooking && onOpenBooking()}
            className="btn btn-primary btn-sm"
          >
            <Sparkles size={14} />
            <span>Request Trial Callback</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border-hairline)',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-hairline)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700 }}>Home</Link>
          <Link href="/#find-tutor" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Find Tutors</Link>
          <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-muted)' }}>How It Works</Link>
          <Link href="/#fee-estimator" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Fee Estimator</Link>
          <Link href="/tutor/register" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700, color: 'var(--brand-blue)' }}>Apply as Tutor</Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-hairline)' }}>
            <Link href="/tutor/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <UserCheck size={16} />
              <span>Tutor Login</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking && onOpenBooking();
              }}
              className="btn btn-primary"
              style={{ justifyContent: 'center' }}
            >
              <Sparkles size={16} />
              <span>Request Trial Callback</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
