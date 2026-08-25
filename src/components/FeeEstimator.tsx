'use client';

import React, { useState } from 'react';
import { Calculator, Sparkles, Check, Home, Video, ArrowRight } from 'lucide-react';

interface FeeEstimatorProps {
  onBookWithEstimate?: (data: { grade: string; mode: string; daysPerWeek: number; estimatedMonthly: string }) => void;
}

export default function FeeEstimator({ onBookWithEstimate }: FeeEstimatorProps) {
  const [grade, setGrade] = useState('Class 9 & 10 (CBSE / ICSE Board)');
  const [mode, setMode] = useState<'OFFLINE_HOME' | 'ONLINE_LIVE'>('OFFLINE_HOME');
  const [daysPerWeek, setDaysPerWeek] = useState(3);

  // Dynamic Rate Engine starting from affordable verified market rates
  const calculateFee = () => {
    let baseHourlyRate = 550;

    if (grade.includes('1 - 5')) {
      baseHourlyRate = 350;
    } else if (grade.includes('6 - 8')) {
      baseHourlyRate = 450;
    } else if (grade.includes('9 & 10')) {
      baseHourlyRate = 550;
    } else if (grade.includes('11 & 12')) {
      baseHourlyRate = 700;
    } else if (grade.includes('IB') || grade.includes('IGCSE')) {
      baseHourlyRate = 900;
    }

    if (mode === 'ONLINE_LIVE') {
      baseHourlyRate = Math.round(baseHourlyRate * 0.75);
    }

    const hoursPerMonth = daysPerWeek * 4 * 1.25;
    const lowEst = Math.max(1000, Math.round((baseHourlyRate * hoursPerMonth * 0.9) / 500) * 500);
    const highEst = Math.round((baseHourlyRate * hoursPerMonth * 1.1) / 500) * 500;

    return {
      hourly: baseHourlyRate,
      monthlyRange: `₹${lowEst.toLocaleString('en-IN')} – ₹${highEst.toLocaleString('en-IN')}`,
      classesPerMonth: daysPerWeek * 4,
    };
  };

  const currentFee = calculateFee();

  return (
    <section id="fee-estimator" style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div style={{
          backgroundColor: 'var(--bg-app)',
          border: '1px solid var(--border-hairline)',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          boxShadow: 'var(--shadow-card)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
            <div className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
              <Calculator size={14} />
              <span>TRANSPARENT PRICING ESTIMATOR</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
              Calculate Monthly Tuition Rates in Gurgaon
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Transparent pricing with zero hidden agency costs. Affordable rates tailored to your child's grade &amp; learning mode.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            {/* Left Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Mode Selection */}
              <div>
                <label className="form-label">1. Choose Learning Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setMode('OFFLINE_HOME')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: `2px solid ${mode === 'OFFLINE_HOME' ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                      backgroundColor: mode === 'OFFLINE_HOME' ? '#FFFFFF' : 'var(--bg-card-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: mode === 'OFFLINE_HOME' ? 'var(--brand-blue-light)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-blue)',
                    }}>
                      <Home size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Home Tuition</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tutor visits your home</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('ONLINE_LIVE')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: `2px solid ${mode === 'ONLINE_LIVE' ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                      backgroundColor: mode === 'ONLINE_LIVE' ? '#FFFFFF' : 'var(--bg-card-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: mode === 'ONLINE_LIVE' ? 'var(--brand-blue-light)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-blue)',
                    }}>
                      <Video size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Online 1-on-1</div>
                      <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700 }}>Save ~25%</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Grade Selection */}
              <div>
                <label htmlFor="fee-estimator-grade" className="form-label">2. Select Grade Level</label>
                <select
                  id="fee-estimator-grade"
                  aria-label="Select Grade Level"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="form-control"
                  style={{ fontWeight: 600, padding: '0.85rem 1rem' }}
                >
                  <option value="Class 1 - 5 (Primary Foundation)">Class 1 to 5 (Primary School)</option>
                  <option value="Class 6 - 8 (Middle School)">Class 6 to 8 (Middle School)</option>
                  <option value="Class 9 & 10 (CBSE / ICSE Board)">Class 9 & 10 (CBSE / ICSE Board Prep)</option>
                  <option value="Class 11 & 12 (Board & JEE/NEET)">Class 11 & 12 (CBSE / ISC / Foundation)</option>
                  <option value="IB / IGCSE Elite International">IB (MYP/DP) / Cambridge IGCSE</option>
                </select>
              </div>

              {/* Frequency Selector */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>3. Frequency of Classes</label>
                  <span style={{ fontWeight: 700, color: '#1D4ED8', fontSize: '0.9rem' }}>
                    {daysPerWeek} Days / Week ({daysPerWeek * 4} Classes/Month)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[2, 3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDaysPerWeek(days)}
                      style={{
                        flex: 1,
                        padding: '0.65rem 0',
                        borderRadius: '10px',
                        border: `1.5px solid ${daysPerWeek === days ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                        backgroundColor: daysPerWeek === days ? 'var(--brand-blue)' : '#FFFFFF',
                        color: daysPerWeek === days ? '#FFFFFF' : 'var(--text-main)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                      }}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary Card (Simple Clean Bright Style) */}
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 55%, #F8FAFC 100%)',
              color: '#0F172A',
              borderRadius: '20px',
              padding: '2rem',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 12px 35px rgba(15, 23, 42, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, letterSpacing: '0.03em' }}>
                    ESTIMATED MONTHLY RATE
                  </span>
                  <span className="badge" style={{ backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', fontWeight: 700 }}>
                    ✨ Verified Teachers Available
                  </span>
                </div>

                <div style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                  {currentFee.monthlyRange}
                  <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 500 }}> / month</span>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#0284C7', fontWeight: 650, marginBottom: '0.4rem' }}>
                  ≈ ₹{currentFee.hourly}/hour • {currentFee.classesPerMonth} personalized classes per month
                </div>

                <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '1.25rem' }}>
                  *Estimated benchmark. Exact price varies on tutor experience &amp; qualifications.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem', fontSize: '0.88rem', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={17} color="#059669" />
                    <span>Background-checked educator verified by TuitionForHome</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={17} color="#059669" />
                    <span>100% Free replacement guarantee if student is unsatisfied</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={17} color="#059669" />
                    <span>Monthly academic progress tracking &amp; test reports</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onBookWithEstimate && onBookWithEstimate({
                  grade,
                  mode: mode === 'OFFLINE_HOME' ? 'Home Tuition' : 'Online 1-on-1',
                  daysPerWeek,
                  estimatedMonthly: currentFee.monthlyRange,
                })}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  backgroundColor: '#0F6E56',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(15, 110, 86, 0.3)',
                }}
              >
                <span>Book Teacher at this Rate</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
