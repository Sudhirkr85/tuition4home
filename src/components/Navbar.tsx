'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Phone, Menu, X, ShieldCheck, ChevronRight, LogOut, User, Settings, GraduationCap } from 'lucide-react';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';

interface NavbarProps {
  onOpenBooking?: () => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const pathname = usePathname() || '';
  const isTutorRoute = pathname.startsWith('/tutor');
  const isParentRoute = pathname.startsWith('/parent');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [parentSession, setParentSession] = useState<{ userId: string; name: string; email: string; image?: string } | null>(null);
  const [tutorSession, setTutorSession] = useState<{ userId?: string; name?: string; email?: string; image?: string; avatarUrl?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const { data: authSession } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Read sessions from NextAuth & route context
  useEffect(() => {
    if (authSession?.user?.email) {
      const email = authSession.user.email;
      const name = authSession.user.name || 'User';
      const image = authSession.user.image || '';
      const userId = (authSession.user as any).id || `GGL-${email.split('@')[0]}`;
      const role = (authSession.user as any).role;
      const hasTutorProfile = (authSession.user as any).hasTutorProfile;

      // If on tutor route or recognized as a tutor, save as tutor session
      if (isTutorRoute || role === 'TUTOR' || hasTutorProfile) {
        const tObj = { userId, name, email, image, avatarUrl: image };
        setTutorSession(tObj);
        try {
          localStorage.setItem('tutor_session', JSON.stringify(tObj));
        } catch {}
      } else {
        const pObj = { userId, name, email, image };
        setParentSession(pObj);
        try {
          localStorage.setItem('parent_session', JSON.stringify(pObj));
        } catch {}
      }
    }
  }, [authSession, isTutorRoute]);

  // Load from localStorage on mount & when storage/custom events trigger
  useEffect(() => {
    const checkSessions = () => {
      const tutorRaw = localStorage.getItem('tutor_session');
      if (tutorRaw) {
        try {
          const parsed = JSON.parse(tutorRaw);

          // Check draft if avatar not yet in session object
          if (!parsed.image && !parsed.avatarUrl && parsed.userId) {
            try {
              const draft = localStorage.getItem(`tutor_draft_${parsed.userId}`);
              if (draft) {
                const draftObj = JSON.parse(draft);
                if (draftObj.profilePhotoUrl) {
                  parsed.image = draftObj.profilePhotoUrl;
                  parsed.avatarUrl = draftObj.profilePhotoUrl;
                }
              }
            } catch {}
          }

          setTutorSession(parsed);

          // Fetch profile image from DB if missing from local session state
          if (parsed.userId && !parsed.image && !parsed.avatarUrl) {
            fetch(`/api/tutors/profile/setup?userId=${parsed.userId}`)
              .then(r => r.json())
              .then(d => {
                if (d.success && d.profile?.avatarUrl) {
                  const updated = { ...parsed, image: d.profile.avatarUrl, avatarUrl: d.profile.avatarUrl };
                  try { localStorage.setItem('tutor_session', JSON.stringify(updated)); } catch {}
                  setTutorSession(updated);
                }
              })
              .catch(() => {});
          }
        } catch {}
      } else if (!authSession?.user?.email) {
        setTutorSession(null);
      }

      const parentRaw = localStorage.getItem('parent_session');
      if (parentRaw) {
        try {
          setParentSession(JSON.parse(parentRaw));
        } catch {}
      } else if (!authSession?.user?.email) {
        setParentSession(null);
      }
    };

    checkSessions();
    window.addEventListener('storage', checkSessions);
    window.addEventListener('tutor-session-updated', checkSessions);
    window.addEventListener('profile-updated', checkSessions);

    return () => {
      window.removeEventListener('storage', checkSessions);
      window.removeEventListener('tutor-session-updated', checkSessions);
      window.removeEventListener('profile-updated', checkSessions);
    };
  }, [authSession]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsideDesktop = desktopDropdownRef.current && desktopDropdownRef.current.contains(target);
      const isInsideMobile = mobileDropdownRef.current && mobileDropdownRef.current.contains(target);

      if (!isInsideDesktop && !isInsideMobile) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  // Context-aware role determination
  let activeRole: 'tutor' | 'parent' | null = null;
  let activeSession: { userId?: string; name?: string; email?: string; image?: string; avatarUrl?: string } | null = null;

  if (isTutorRoute) {
    if (tutorSession) {
      activeRole = 'tutor';
      activeSession = tutorSession;
    } else if (parentSession) {
      activeRole = 'parent';
      activeSession = parentSession;
    }
  } else if (isParentRoute) {
    if (parentSession) {
      activeRole = 'parent';
      activeSession = parentSession;
    } else if (tutorSession) {
      activeRole = 'tutor';
      activeSession = tutorSession;
    }
  } else {
    // General website pages
    if (tutorSession && !parentSession) {
      activeRole = 'tutor';
      activeSession = tutorSession;
    } else if (parentSession && !tutorSession) {
      activeRole = 'parent';
      activeSession = parentSession;
    } else if (tutorSession && parentSession) {
      activeRole = 'tutor';
      activeSession = tutorSession;
    }
  }

  // Unified clean sign out
  const handleUniversalLogout = async (roleToLogout?: 'tutor' | 'parent') => {
    try {
      if (roleToLogout === 'tutor') {
        localStorage.removeItem('tutor_session');
        localStorage.removeItem('tutor_session_raw');
      } else if (roleToLogout === 'parent') {
        localStorage.removeItem('parent_session');
        localStorage.removeItem('parent_session_raw');
      } else {
        localStorage.removeItem('tutor_session');
        localStorage.removeItem('parent_session');
        localStorage.removeItem('tutor_session_raw');
        localStorage.removeItem('parent_session_raw');
      }
      window.dispatchEvent(new Event('storage'));
    } catch {}

    if (roleToLogout === 'tutor') {
      setTutorSession(null);
    } else if (roleToLogout === 'parent') {
      setParentSession(null);
    } else {
      setTutorSession(null);
      setParentSession(null);
    }

    setDropdownOpen(false);
    setMobileMenuOpen(false);

    try {
      await signOut({ redirect: false });
    } catch {}

    if (roleToLogout === 'parent' || isParentRoute) {
      window.location.href = '/parent/login';
    } else if (roleToLogout === 'tutor' || isTutorRoute) {
      window.location.href = '/tutor/register';
    } else {
      window.location.href = '/';
    }
  };

  // ── Avatar Component ──────────────────────────────────────────
  const UserAvatar = ({ name, image, role = 'tutor', size = 36 }: { name?: string; image?: string; role?: 'tutor' | 'parent'; size?: number }) => {
    const initial = name?.charAt(0)?.toUpperCase() || (role === 'parent' ? 'P' : 'T');
    const isParent = role === 'parent';

    if (image) {
      return (
        <div style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          cursor: 'pointer',
          border: isParent ? '2px solid #3B82F6' : '2px solid #0F6E56',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      );
    }

    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: isParent ? '#2563EB' : '#0F6E56',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size * 0.4,
        flexShrink: 0,
        cursor: 'pointer',
        border: isParent ? '2px solid #93C5FD' : '2px solid #A7F3D0',
      }}>
        {initial}
      </div>
    );
  };

  const DropdownMenu = () => {
    const isParentView = activeRole === 'parent';
    const currentName = activeSession?.name || (isParentView ? 'Parent' : 'Educator');
    const currentEmail = activeSession?.email || '';

    return (
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: 'calc(100% + 0.6rem)',
          right: 0,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
          minWidth: '240px',
          padding: '0.5rem',
          zIndex: 99999,
        }}
      >
        {/* Profile info header */}
        <div style={{
          padding: '0.75rem 1rem 0.65rem',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '0.35rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              backgroundColor: isParentView ? '#EFF6FF' : '#ECFDF5',
              color: isParentView ? '#2563EB' : '#059669',
              padding: '0.12rem 0.5rem',
              borderRadius: '6px'
            }}>
              {isParentView ? 'PARENT PORTAL' : 'EDUCATOR PORTAL'}
            </span>
          </div>
          <strong style={{ display: 'block', fontSize: '0.92rem', color: '#0F172A', fontWeight: 800 }}>
            {currentName}
          </strong>
          {currentEmail && (
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{currentEmail}</span>
          )}
        </div>

        {/* Menu Items */}
        {isParentView ? (
          <>
            <Link
              href="/parent/dashboard"
              onClick={() => setDropdownOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.65rem 1rem', borderRadius: '10px',
                fontSize: '0.86rem', fontWeight: 700, color: '#0F172A',
                textDecoration: 'none', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <User size={16} color="#2563EB" />
              <span>Parent Dashboard</span>
            </Link>

            <Link
              href="/request-tutor"
              onClick={(e) => {
                setDropdownOpen(false);
                if (onOpenBooking) {
                  e.preventDefault();
                  onOpenBooking();
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.65rem 1rem', borderRadius: '10px',
                fontSize: '0.86rem', fontWeight: 700, color: '#0F172A',
                textDecoration: 'none', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ShieldCheck size={16} color="#059669" />
              <span>Request Home Teacher</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/tutor/profile"
              onClick={() => setDropdownOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.65rem 1rem', borderRadius: '10px',
                fontSize: '0.86rem', fontWeight: 700, color: '#0F172A',
                textDecoration: 'none', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <User size={16} color="#0F6E56" />
              <span>My Profile Dashboard</span>
            </Link>

            <Link
              href="/tutor/profile"
              onClick={() => setDropdownOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.65rem 1rem', borderRadius: '10px',
                fontSize: '0.86rem', fontWeight: 700, color: '#0F172A',
                textDecoration: 'none', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Settings size={16} color="#0F6E56" />
              <span>Settings &amp; KYC</span>
            </Link>
          </>
        )}

        <div style={{ borderTop: '1px solid #E2E8F0', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
          <button
            type="button"
            onClick={() => handleUniversalLogout(activeRole || undefined)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              width: '100%', padding: '0.65rem 1rem', borderRadius: '10px',
              fontSize: '0.86rem', fontWeight: 700, color: '#DC2626',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'background 0.15s', textAlign: 'left',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={14} color="#2DD4BF" />
            <span>Operated &amp; Verified by <strong>SSSAM Academy</strong> • Sector 14, Gurugram<span className="desktop-only-inline"> &amp; Delhi NCR</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'none', color: '#CBD5E1' }} className="desktop-nav">
              📍 M24 Ground Floor, Old DLF Colony
            </span>
            <a
              href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`}
              style={{ color: '#67E8F9', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem' }}
            >
              <Phone size={13} className="phone-icon-animated" />
              <span>Helpline: {SSSAM_OFFICE_DETAILS.phones[0]}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo & Brand Name */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.webp"
            alt="TuitionForHome Logo"
            style={{ height: '44px', width: '44px', objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.22rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Tuition<span style={{ color: '#EA580C' }}>For</span>Home
            </span>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#065F46', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              By SSSAM Academy
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', whiteSpace: 'nowrap' }}>
          <Link href="/tutors" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', textDecoration: 'none' }}>Find Teachers</Link>
          <Link href="/home-tutors-in-gurgaon" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', textDecoration: 'none' }}>Gurgaon Localities</Link>
          <Link href="/tuition" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', textDecoration: 'none' }}>Subjects &amp; Boards</Link>
          <Link href="/#fee-estimator" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B', textDecoration: 'none' }}>Fee Estimator</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', whiteSpace: 'nowrap' }}>
          {mounted && activeSession ? (
            /* ── Logged-in: Avatar + Dropdown ── */
            <div ref={desktopDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <UserAvatar
                  name={activeSession.name}
                  image={activeSession.image || activeSession.avatarUrl}
                  role={activeRole || 'tutor'}
                  size={38}
                />
              </button>
              {dropdownOpen && <DropdownMenu />}
            </div>
          ) : (
            /* ── Logged-out: Clear Parent vs Tutor actions ── */
            <>
              {/* For Teachers / Tutors */}
              <Link
                href="/tutor/register"
                className="btn btn-secondary btn-sm btn-teacher-animated"
                style={{
                  textDecoration: 'none',
                  padding: '0.48rem 0.95rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  borderRadius: '12px',
                  border: '1.5px solid #34D399',
                  backgroundColor: '#F0FDF4',
                  color: '#047857',
                  boxShadow: '0 3px 12px rgba(4, 120, 87, 0.15)',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ position: 'relative', display: 'inline-flex', width: '7px', height: '7px' }}>
                  <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#22C55E', animation: 'ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite', opacity: 0.8 }} />
                  <span style={{ position: 'relative', display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                </span>
                <GraduationCap size={15} color="#047857" />
                <span>I&apos;m a Teacher</span>
              </Link>

              {/* For Parents Login */}
              <Link
                href="/parent/login"
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#1D4ED8',
                  textDecoration: 'none',
                  padding: '0.45rem 0.65rem',
                }}
              >
                Parent Login
              </Link>

              {/* For Parents - Book Home Tutor CTA */}
              <Link
                href="/request-tutor"
                onClick={(e) => {
                  if (onOpenBooking) {
                    e.preventDefault();
                    onOpenBooking();
                  }
                }}
                className="btn btn-primary btn-sm"
                style={{
                  textDecoration: 'none',
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  backgroundColor: '#065F46',
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px rgba(6, 95, 70, 0.25)',
                }}
              >
                <span>Find a Teacher</span>
                <div className="btn-arrow"><ChevronRight size={14} /></div>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="mobile-only-flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
          {mounted && activeSession ? (
            <div ref={mobileDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <UserAvatar
                  name={activeSession.name}
                  image={activeSession.image || activeSession.avatarUrl}
                  role={activeRole || 'tutor'}
                  size={36}
                />
              </button>
              {dropdownOpen && <DropdownMenu />}
            </div>
          ) : (
            <Link
              href="/tutor/register"
              className="btn btn-secondary btn-sm btn-teacher-animated"
              style={{
                fontSize: '0.76rem',
                padding: '0.38rem 0.65rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                borderRadius: '9999px',
                whiteSpace: 'nowrap',
                border: '1.5px solid #34D399',
                color: '#047857',
                backgroundColor: '#ECFDF5',
                boxShadow: '0 2px 10px rgba(4, 120, 87, 0.18)',
              }}
            >
              <span style={{ position: 'relative', display: 'inline-flex', width: '6px', height: '6px' }}>
                <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#22C55E', animation: 'ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite', opacity: 0.8 }} />
                <span style={{ position: 'relative', display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
              </span>
              <GraduationCap size={13} color="#047857" />
              <span>I&apos;m a Teacher</span>
            </Link>
          )}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-hairline)',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Clear Role Sections */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-hairline)',
          padding: '1.25rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          {/* Section 1: For Parents */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '0.9rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              👨‍👩‍👧 For Parents &amp; Students
            </div>
            <Link
              href="/request-tutor"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (onOpenBooking) {
                  e.preventDefault();
                  onOpenBooking();
                }
              }}
              className="btn btn-primary"
              style={{ justifyContent: 'center', backgroundColor: '#065F46', padding: '0.65rem 1rem', fontSize: '0.88rem', fontWeight: 800 }}
            >
              <span>Get a Home Teacher</span>
              <ChevronRight size={16} />
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                href="/tutors"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', padding: '0.45rem' }}
              >
                Find Teachers
              </Link>
              {mounted && parentSession ? (
                <Link
                  href="/parent/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', padding: '0.45rem', color: '#1D4ED8', fontWeight: 700 }}
                >
                  Parent Dashboard
                </Link>
              ) : (
                <Link
                  href="/parent/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', padding: '0.45rem', color: '#1D4ED8' }}
                >
                  Parent Login
                </Link>
              )}
            </div>
          </div>

          {/* Section 2: For Teachers / Tutors */}
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '14px',
            padding: '0.9rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              👨‍🏫 For Teachers
            </div>
            <Link
              href={mounted && tutorSession ? '/tutor/profile' : '/tutor/register'}
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-secondary"
              style={{
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #0F6E56',
                color: '#0F6E56',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 8px rgba(15, 110, 86, 0.15)',
              }}
            >
              <span style={{ position: 'relative', display: 'inline-flex', width: '7px', height: '7px' }}>
                <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#22C55E', animation: 'ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite', opacity: 0.8 }} />
                <span style={{ position: 'relative', display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
              </span>
              <GraduationCap size={16} color="#0F6E56" />
              <span>{mounted && tutorSession ? 'My Teacher Dashboard' : 'I\u0027m a Teacher'}</span>
            </Link>
          </div>

          {/* Section 3: Explore & Information Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '0.35rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              📍 Explore &amp; Tuition Rates
            </div>
            <Link href="/home-tutors-in-gurgaon" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E293B', textDecoration: 'none' }}>
              Gurgaon &amp; Delhi NCR Localities
            </Link>
            <Link href="/tuition" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E293B', textDecoration: 'none' }}>
              Tuition Subjects &amp; Educational Boards
            </Link>
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E293B', textDecoration: 'none' }}>
              How Matching Works
            </Link>
            <Link href="/#fee-estimator" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E293B', textDecoration: 'none' }}>
              Hourly Fee Estimator
            </Link>
          </div>

          {/* Active Session Sign-Out Button if logged in */}
          {mounted && activeSession && (
            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-hairline)' }}>
              <button
                type="button"
                onClick={() => handleUniversalLogout(activeRole || undefined)}
                className="btn"
                style={{ width: '100%', justifyContent: 'center', backgroundColor: '#FEF2F2', color: '#DC2626', border: '1.5px solid #FECACA' }}
              >
                <LogOut size={16} />
                <span>Sign Out ({activeSession.name})</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
