'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Phone, Menu, X, ShieldCheck, UserCheck, ChevronRight, LogOut, User, Settings } from 'lucide-react';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';

interface NavbarProps {
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tutorSession, setTutorSession] = useState<{ userId: string; name: string; email: string } | null>(null);
  const [parentSession, setParentSession] = useState<{ userId: string; name: string; email: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read sessions from localStorage on mount & storage events
  useEffect(() => {
    const checkSessions = () => {
      const tutorRaw = localStorage.getItem('tutor_session');
      if (tutorRaw) {
        try { setTutorSession(JSON.parse(tutorRaw)); } catch {}
      } else {
        setTutorSession(null);
      }

      const parentRaw = localStorage.getItem('parent_session');
      if (parentRaw) {
        try { setParentSession(JSON.parse(parentRaw)); } catch {}
      } else {
        setParentSession(null);
      }
    };

    checkSessions();
    window.addEventListener('storage', checkSessions);

    // Close dropdown on outside click
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('storage', checkSessions);
    };
  }, []);

  const handleTutorLogout = () => {
    localStorage.removeItem('tutor_session');
    setTutorSession(null);
    setDropdownOpen(false);
    window.location.href = '/tutor/register';
  };

  const handleParentLogout = () => {
    localStorage.removeItem('parent_session');
    setParentSession(null);
    setDropdownOpen(false);
    window.location.href = '/parent/login';
  };

  // ── Avatar Component ──────────────────────────────────────────
  const UserAvatar = ({ name, role = 'tutor', size = 36 }: { name?: string; role?: 'tutor' | 'parent'; size?: number }) => {
    const initial = name?.charAt(0)?.toUpperCase() || (role === 'parent' ? 'P' : 'T');
    const isParent = role === 'parent';
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: isParent ? '#2563EB' : 'var(--brand-teal)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size * 0.4,
        flexShrink: 0,
        cursor: 'pointer',
        border: isParent ? '2px solid #93C5FD' : '2px solid var(--brand-teal-light)',
      }}>
        {initial}
      </div>
    );
  };

  const DropdownMenu = () => {
    const isParent = !!parentSession;
    const currentName = isParent ? parentSession?.name : tutorSession?.name;
    const currentEmail = isParent ? parentSession?.email : tutorSession?.email;

    return (
      <div style={{
        position: 'absolute',
        top: 'calc(100% + 0.6rem)',
        right: 0,
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-hairline)',
        borderRadius: '16px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.10)',
        minWidth: '230px',
        padding: '0.5rem',
        zIndex: 9999,
      }}>
        {/* Profile info header */}
        <div style={{
          padding: '0.75rem 1rem 0.65rem',
          borderBottom: '1px solid var(--border-hairline)',
          marginBottom: '0.35rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              backgroundColor: isParent ? '#EFF6FF' : '#ECFDF5',
              color: isParent ? '#2563EB' : '#059669',
              padding: '0.08rem 0.45rem',
              borderRadius: '4px'
            }}>
              {isParent ? 'PARENT PORTAL' : 'EDUCATOR PORTAL'}
            </span>
          </div>
          <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 800 }}>
            {currentName}
          </strong>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{currentEmail}</span>
        </div>

        {/* Menu Items */}
        {isParent ? (
          <>
            <Link
              href="/parent/dashboard"
              onClick={() => setDropdownOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.6rem 1rem', borderRadius: '10px',
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)',
                textDecoration: 'none', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <User size={15} color="#2563EB" />
              Parent Dashboard
            </Link>

            <Link
              href="/book-demo"
              onClick={() => setDropdownOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.6rem 1rem', borderRadius: '10px',
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)',
                textDecoration: 'none', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ShieldCheck size={15} color="#059669" />
              Book Free Demo Class
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/tutor/profile"
              onClick={() => setDropdownOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.6rem 1rem', borderRadius: '10px',
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)',
                textDecoration: 'none', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <User size={15} color="var(--brand-teal)" />
              My Profile Dashboard
            </Link>

            <Link
              href="/tutor/profile"
              onClick={() => setDropdownOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.6rem 1rem', borderRadius: '10px',
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)',
                textDecoration: 'none', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Settings size={15} color="var(--brand-teal)" />
              Settings &amp; KYC
            </Link>
          </>
        )}

        <div style={{ borderTop: '1px solid var(--border-hairline)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
          <button
            type="button"
            onClick={isParent ? handleParentLogout : handleTutorLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              width: '100%', padding: '0.6rem 1rem', borderRadius: '10px',
              fontSize: '0.85rem', fontWeight: 600, color: '#DC2626',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'background 0.15s', textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </div>
    );
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(237, 251, 247, 0.94)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-hairline)',
    }}>
      {/* Top SSSAM Academy Trust Bar */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        fontSize: '0.74rem',
        padding: '0.45rem 0',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <ShieldCheck size={14} color="#2DD4BF" />
            <span>Operated &amp; Verified by <strong>SSSAM Academy</strong> • Sector 14, Gurugram</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'none', color: '#94A3B8' }} className="desktop-nav">
              📍 M24 Ground Floor, Old DLF Colony
            </span>
            <a
              href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`}
              style={{ color: '#93C5FD', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem' }}
            >
              <Phone size={12} />
              <span>Helpline: {SSSAM_OFFICE_DETAILS.phones[0]}</span>
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
            style={{ height: '44px', width: 'auto', objectFit: 'contain', borderRadius: '6px' }}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ alignItems: 'center', gap: '1.75rem' }}>
          <Link href="/" style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--brand-teal)' }}>Home</Link>
          <Link href="/#find-tutor" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-muted)' }}>Find Tutors</Link>
          <Link href="/#how-it-works" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-muted)' }}>How It Works</Link>
          <Link href="/#fee-estimator" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-muted)' }}>Fee Estimator</Link>
          {!tutorSession && !parentSession && (
            <Link href="/tutor/register" style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--brand-teal)' }}>
              Apply as Tutor
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="desktop-nav" style={{ alignItems: 'center', gap: '0.75rem' }}>
          {parentSession || tutorSession ? (
            /* ── Logged-in: Avatar + Dropdown ── */
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.55rem',
                  backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-hairline)',
                  borderRadius: '999px', padding: '0.3rem 0.75rem 0.3rem 0.3rem',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: dropdownOpen ? '0 0 0 3px rgba(45,212,191,0.18)' : 'none',
                }}
              >
                <UserAvatar
                  name={parentSession ? parentSession.name : tutorSession?.name}
                  role={parentSession ? 'parent' : 'tutor'}
                  size={32}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {parentSession ? parentSession.name : tutorSession?.name}
                </span>
                <ChevronRight size={14} color="var(--text-muted)" style={{ transform: dropdownOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              {dropdownOpen && <DropdownMenu />}
            </div>
          ) : (
            /* ── Logged-out: Login + Book buttons ── */
            <>
              <Link href="/parent/login" style={{ fontSize: '0.86rem', fontWeight: 700, color: '#2563EB', textDecoration: 'none', padding: '0.45rem 0.75rem' }}>
                Parent Login
              </Link>
              <Link href="/tutor/register" className="btn btn-secondary btn-sm">
                <UserCheck size={14} />
                <span>Tutor Portal</span>
              </Link>
              <Link
                href="/book-demo"
                className="btn btn-primary btn-sm"
              >
                <span>Book Free Demo</span>
                <div className="btn-arrow"><ChevronRight size={14} /></div>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="mobile-only-flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
          {parentSession || tutorSession ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <UserAvatar
                  name={parentSession ? parentSession.name : tutorSession?.name}
                  role={parentSession ? 'parent' : 'tutor'}
                  size={36}
                />
              </button>
              {dropdownOpen && <DropdownMenu />}
            </div>
          ) : (
            <Link
              href="/parent/login"
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.8rem', padding: '0.45rem 0.85rem', fontWeight: 700,
                alignItems: 'center', gap: '0.35rem', borderRadius: '9999px',
              }}
            >
              <span>Login</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0.5rem', borderRadius: '8px',
              border: '1.5px solid var(--border-hairline)',
              backgroundColor: '#FFFFFF', cursor: 'pointer',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-hairline)',
          padding: '1.25rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700, color: 'var(--brand-teal)' }}>Home</Link>
          <Link href="/#find-tutor" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Find Tutors</Link>
          <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-muted)' }}>How It Works</Link>
          <Link href="/#fee-estimator" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Fee Estimator</Link>
          {!tutorSession && (
            <Link href="/tutor/register" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700, color: 'var(--brand-teal)' }}>Apply as Tutor</Link>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-hairline)' }}>
            {parentSession ? (
              <>
                <Link
                  href="/parent/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'center' }}
                >
                  <User size={16} color="#2563EB" />
                  <span>Parent Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleParentLogout(); }}
                  className="btn"
                  style={{ justifyContent: 'center', backgroundColor: '#FEF2F2', color: '#DC2626', border: '1.5px solid #FECACA' }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : tutorSession ? (
              <>
                <Link
                  href="/tutor/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'center' }}
                >
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleTutorLogout(); }}
                  className="btn"
                  style={{ justifyContent: 'center', backgroundColor: '#FEF2F2', color: '#DC2626', border: '1.5px solid #FECACA' }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/parent/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                  <User size={16} color="#2563EB" />
                  <span>Parent Login</span>
                </Link>
                <Link href="/tutor/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                  <UserCheck size={16} />
                  <span>Tutor Login</span>
                </Link>
                <Link
                  href="/book-demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ justifyContent: 'center' }}
                >
                  <span>Book Free Demo</span>
                  <div className="btn-arrow"><ChevronRight size={14} /></div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
