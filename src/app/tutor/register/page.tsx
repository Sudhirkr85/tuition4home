'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  GURGAON_LOCALITIES,
  SUBJECT_OPTIONS,
  CLASS_OPTIONS,
  BOARD_OPTIONS,
  SSSAM_OFFICE_DETAILS,
} from '@/lib/data';
import {
  GraduationCap,
  ShieldCheck,
  Video,
  Home,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  ArrowLeft,
  Building2,
  Lock,
} from 'lucide-react';

export default function TutorRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [teachingMode, setTeachingMode] = useState<'BOTH' | 'OFFLINE_HOME' | 'ONLINE_LIVE'>('BOTH');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [introVideoUrl, setIntroVideoUrl] = useState('');
  const [degree, setDegree] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([SUBJECT_OPTIONS[0]]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([CLASS_OPTIONS[2]]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([BOARD_OPTIONS[0]]);
  const [serviceAreas, setServiceAreas] = useState<string[]>([GURGAON_LOCALITIES[0].name]);
  const [travelRadius, setTravelRadius] = useState(5);
  const [hourlyRateHome, setHourlyRateHome] = useState(800);
  const [hourlyRateOnline, setHourlyRateOnline] = useState(600);
  const [idType, setIdType] = useState('AADHAAR_MASKED');
  const [idLast4, setIdLast4] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toggle helper
  const toggleSelection = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      if (list.length > 1) setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please accept the privacy policy & social media promotion terms to proceed.');
      return;
    }
    setLoading(true);

    try {
      await fetch('/api/tutors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          teachingMode,
          avatarUrl,
          introVideoUrl,
          highestDegree: degree,
          experienceYears,
          subjects: selectedSubjects,
          classes: selectedClasses,
          boards: selectedBoards,
          serviceAreas,
          travelRadiusKm: travelRadius,
          hourlyRateHome,
          hourlyRateOnline,
          idType,
          idLast4,
        }),
      });
    } catch (err) {
      console.log('Tutor register fallback:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '3.5rem 0 5rem 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          {!submitted ? (
            <div className="apple-card" style={{ overflow: 'hidden' }}>
              {/* Header Campaign Banner */}
              <div style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                padding: '1.75rem 2rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge" style={{ backgroundColor: 'rgba(5, 150, 105, 0.25)', color: '#34D399', border: '1px solid rgba(5, 150, 105, 0.4)' }}>
                    ✨ ACADEMIC SESSION DRIVE
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600 }}>
                    Step {currentStep} of {totalSteps}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                  Apply as a Verified Home Tutor
                </h1>
                <div style={{ fontSize: '0.88rem', color: '#93C5FD' }}>
                  Verification Fee: <span style={{ textDecoration: 'line-through' }}>₹999</span> <strong style={{ color: '#34D399' }}>₹0 FREE</strong> (100% Seasonal Fee Waiver Applied)
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '4px', backgroundColor: 'var(--border-hairline)' }}>
                <div style={{
                  height: '100%',
                  width: `${(currentStep / totalSteps) * 100}%`,
                  backgroundColor: 'var(--brand-blue)',
                  transition: 'width 0.3s ease',
                }} />
              </div>

              {/* Step Forms */}
              <div style={{ padding: '2.25rem' }}>
                {/* STEP 1: Personal Info & Login Mandatory */}
                {currentStep === 1 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-blue)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      <Lock size={14} />
                      <span>MANDATORY TUTOR LOGIN SETUP</span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Step 1: Teaching Mode & Account Credentials
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Set up your email and password to access your tutor dashboard and manage lead assignments.
                    </p>

                    {/* Mode Selector */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label">How do you prefer to teach?</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                        {[
                          { id: 'BOTH', title: 'Both Modes', desc: 'Home & Online', icon: Sparkles },
                          { id: 'OFFLINE_HOME', title: 'Home Tuition', desc: 'Visit Student Home', icon: Home },
                          { id: 'ONLINE_LIVE', title: 'Online 1-on-1', desc: 'Live Google Meet', icon: Video },
                        ].map((m) => {
                          const IconComponent = m.icon;
                          const isSelected = teachingMode === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setTeachingMode(m.id as any)}
                              style={{
                                padding: '0.85rem',
                                borderRadius: '12px',
                                border: `2px solid ${isSelected ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                                backgroundColor: isSelected ? 'var(--brand-blue-light)' : '#FFFFFF',
                                color: isSelected ? 'var(--brand-blue)' : 'var(--text-main)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.35rem',
                                cursor: 'pointer',
                              }}
                            >
                              <IconComponent size={20} color={isSelected ? 'var(--brand-blue)' : 'var(--text-muted)'} />
                              <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{m.title}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rohit Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Email Address (Required for Login)</label>
                        <input
                          type="email"
                          placeholder="rohit@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mobile Number</label>
                        <input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Create Password (For Tutor Dashboard)</label>
                      <input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Photo & 60s Video Intro */}
                {currentStep === 2 && (
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Step 2: Profile Photo & 60s Video Intro
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Parents in Gurgaon convert 3x faster when they can watch a 1-minute video introduction.
                    </p>

                    <div className="form-group">
                      <label className="form-label">Profile Photo URL (Headshot)</label>
                      <input
                        type="url"
                        placeholder="Paste image link or avatar photo"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">60–90s Video Introduction (YouTube Unlisted or Video Link)</label>
                      <input
                        type="url"
                        placeholder="https://youtu.be/... (Paste YouTube Unlisted or Drive Link)"
                        value={introVideoUrl}
                        onChange={(e) => setIntroVideoUrl(e.target.value)}
                        className="form-control"
                      />
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.85rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--brand-blue-light)',
                        border: '1px solid rgba(0, 102, 204, 0.15)',
                        fontSize: '0.82rem',
                        color: 'var(--brand-blue)',
                        lineHeight: 1.5,
                      }}>
                        <strong>🎥 What to cover in your 60s video:</strong>
                        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                          <li>Introduce your name and educational degree.</li>
                          <li>Mention which subjects/classes you specialize in.</li>
                          <li>Briefly explain how you build concepts for students.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Qualifications */}
                {currentStep === 3 && (
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Step 3: Academic Qualifications & Subjects
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Select the specific subjects and grade levels you specialize in.
                    </p>

                    <div className="form-group">
                      <label className="form-label">Highest Degree & College</label>
                      <input
                        type="text"
                        placeholder="e.g. M.Sc. Mathematics (Delhi University)"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Total Teaching Experience (Years)</label>
                      <input
                        type="number"
                        min={0}
                        max={35}
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="form-control"
                      />
                    </div>

                    {/* Subjects */}
                    <div className="form-group">
                      <label className="form-label">Subjects Taught</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {SUBJECT_OPTIONS.map((sub) => {
                          const isSelected = selectedSubjects.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => toggleSelection(sub, selectedSubjects, setSelectedSubjects)}
                              style={{
                                padding: '0.45rem 0.85rem',
                                borderRadius: '8px',
                                border: `1.5px solid ${isSelected ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                                backgroundColor: isSelected ? 'var(--brand-blue-light)' : '#FFFFFF',
                                color: isSelected ? 'var(--brand-blue)' : 'var(--text-main)',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                              }}
                            >
                              {isSelected ? '✓ ' : '+ '} {sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Live Travel Radius & Gurgaon Sectors */}
                {currentStep === 4 && (
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Step 4: Location & Travel Radius Selector
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Set your maximum travel distance and select preferred Gurgaon sectors for home visits.
                    </p>

                    <div className="form-group">
                      <label className="form-label">Maximum Travel Radius (KM from your current location)</label>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {[3, 5, 8, 12, 15].map((km) => (
                          <button
                            key={km}
                            type="button"
                            onClick={() => setTravelRadius(km)}
                            style={{
                              flex: 1,
                              padding: '0.65rem 0',
                              borderRadius: '8px',
                              border: `1.5px solid ${travelRadius === km ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                              backgroundColor: travelRadius === km ? 'var(--brand-blue)' : '#FFFFFF',
                              color: travelRadius === km ? '#FFFFFF' : 'var(--text-main)',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                            }}
                          >
                            {km} KM
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred Gurgaon Sectors</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto', padding: '0.5rem', border: '1px solid var(--border-hairline)', borderRadius: '12px' }}>
                        {GURGAON_LOCALITIES.map((loc) => {
                          const isSelected = serviceAreas.includes(loc.name);
                          return (
                            <button
                              key={loc.slug}
                              type="button"
                              onClick={() => toggleSelection(loc.name, serviceAreas, setServiceAreas)}
                              style={{
                                padding: '0.5rem',
                                borderRadius: '8px',
                                border: `1px solid ${isSelected ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                                backgroundColor: isSelected ? 'var(--brand-blue-light)' : '#FFFFFF',
                                color: isSelected ? 'var(--brand-blue)' : 'var(--text-main)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                textAlign: 'left',
                                cursor: 'pointer',
                              }}
                            >
                              {isSelected ? '✓ ' : '+ '} {loc.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Expected Rates starting from ₹1,000+ */}
                {currentStep === 5 && (
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Step 5: Expected Rates & Pricing Tiers
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Higher reviews & ratings unlock Senior Verified Tier badges with higher earning potential.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div className="form-group">
                        <label className="form-label">Expected Rate (Home Visit)</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card-subtle)', border: '1.5px solid var(--border-hairline)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontWeight: 700 }}>₹</span>
                          <input
                            type="number"
                            min={500}
                            max={5000}
                            value={hourlyRateHome}
                            onChange={(e) => setHourlyRateHome(Number(e.target.value))}
                            className="form-control"
                            style={{ borderRadius: '0 8px 8px 0' }}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Expected Rate (Online 1-on-1)</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ padding: '0.75rem', backgroundColor: 'var(--bg-card-subtle)', border: '1.5px solid var(--border-hairline)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontWeight: 700 }}>₹</span>
                          <input
                            type="number"
                            min={400}
                            max={4000}
                            value={hourlyRateOnline}
                            onChange={(e) => setHourlyRateOnline(Number(e.target.value))}
                            className="form-control"
                            style={{ borderRadius: '0 8px 8px 0' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: KYC & Privacy Policy / Social Media Promotion Terms */}
                {currentStep === 6 && (
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                      Step 6: Private Identity Verification (KYC) & Terms
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Only the last 4 digits are recorded under Indian DPDP privacy law.
                    </p>

                    <div className="form-group">
                      <label className="form-label">Select Government ID</label>
                      <select
                        value={idType}
                        onChange={(e) => setIdType(e.target.value)}
                        className="form-control"
                      >
                        <option value="AADHAAR_MASKED">Masked Aadhaar Card</option>
                        <option value="DRIVING_LICENSE">Driving License</option>
                        <option value="PAN">PAN Card</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Last 4 Digits of Document (e.g. 4589)</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="XXXX"
                        value={idLast4}
                        onChange={(e) => setIdLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Privacy & Social Media Terms Checkbox */}
                    <div style={{
                      backgroundColor: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-hairline)',
                      borderRadius: '12px',
                      padding: '1.1rem',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      marginTop: '1.25rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                        <input
                          type="checkbox"
                          id="privacy-terms"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: 'var(--brand-blue)' }}
                        />
                        <label htmlFor="privacy-terms" style={{ cursor: 'pointer', color: 'var(--text-main)' }}>
                          <strong>Privacy & Promotion Agreement:</strong> I agree that my identity documents will be kept 100% private & encrypted. I consent that my interview intro videos and profile photo may be published on official SSSAM Academy platforms and social media for tutor promotion. Upon tuition assignment, I agree to the standard 1st-month bureau fee (50%).
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-hairline)' }}>
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="btn btn-secondary"
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="btn btn-primary"
                    >
                      <span>Next Step</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={loading}
                      className="btn btn-emerald btn-lg"
                    >
                      <Sparkles size={18} />
                      <span>{loading ? 'Submitting Application...' : 'Submit & Claim Free Verification'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Confirmation Screen */
            <div className="apple-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-emerald-light)',
                color: 'var(--brand-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}>
                <CheckCircle2 size={42} />
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Application Submitted Successfully! 🎉
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 2rem auto' }}>
                Welcome aboard, <strong>{name}</strong>! Your application is under <strong>Pending Telephonic Verification</strong>. Our academic team from <strong>SSSAM Academy Sector 14 Gurugram</strong> will review your video intro and call you within 24 hours.
              </p>

              <div style={{
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-hairline)',
                borderRadius: '16px',
                padding: '1.5rem',
                maxWidth: '480px',
                margin: '0 auto 2rem auto',
                textAlign: 'left',
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  🏢 OPTIONAL: WALK-IN VERIFICATION AT GURGAON CENTER
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Prefer meeting in person? Visit our center: <strong>{SSSAM_OFFICE_DETAILS.address}</strong> for fast-track badge activation.
                </div>
              </div>

              <a href="/counselor" className="btn btn-primary btn-lg">
                <span>Go to Counselor Desk (Preview Mode)</span>
                <ArrowRight size={18} />
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
