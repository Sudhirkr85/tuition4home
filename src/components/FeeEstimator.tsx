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
  const [subjectsCount, setSubjectsCount] = useState(1);

  // Dynamic Rate Calculation Engine
  const calculateFee = () => {
    let baseHourlyRate = 800; // Base for 9-10 Home

    if (grade.includes('1 - 5')) {
      baseHourlyRate = 600;
    } else if (grade.includes('6 - 8')) {
      baseHourlyRate = 700;
    } else if (grade.includes('9 & 10')) {
      baseHourlyRate = 850;
    } else if (grade.includes('11 & 12')) {
      baseHourlyRate = 1100;
    } else if (grade.includes('IB') || grade.includes('IGCSE')) {
      baseHourlyRate = 1600;
    } else if (grade.includes('Coding')) {
      baseHourlyRate = 1000;
    }

    // Online discount: ~25% lower than home visits
    if (mode === 'ONLINE_LIVE') {
      baseHourlyRate = Math.round(baseHourlyRate * 0.72);
    }

    const hoursPerMonth = daysPerWeek * 4 * 1.25; // 1.25 hours per class average
    const lowEst = Math.round((baseHourlyRate * hoursPerMonth * subjectsCount * 0.95) / 100) * 100;
    const highEst = Math.round((baseHourlyRate * hoursPerMonth * subjectsCount * 1.1) / 100) * 100;

    return {
      hourly: baseHourlyRate,
      monthlyRange: `₹${lowEst.toLocaleString('en-IN')} – ₹${highEst.toLocaleString('en-IN')}`,
      classesPerMonth: daysPerWeek * 4,
    };
  };

  const currentFee = calculateFee();

  return (
    <section id="fee-estimator" style={{ padding: '4.5rem 0' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, #FFFFFF, var(--color-blue-50))',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          boxShadow: 'var(--shadow-card)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
            <div className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
              <Calculator size={14} />
              <span>INSTANT PRICING ESTIMATOR</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
              Calculate Your Home Tuition Fee in Gurgaon
            </h2>
            <p style={{ color: 'var(--color-slate-600)', fontSize: '0.95rem' }}>
              Transparent pricing with zero hidden agency costs. Pay only when you are 100% satisfied after your free demo class.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            {/* Left: Input Controls */}
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
                      border: `2px solid ${mode === 'OFFLINE_HOME' ? 'var(--color-blue-600)' : 'var(--border-subtle)'}`,
                      backgroundColor: mode === 'OFFLINE_HOME' ? '#FFFFFF' : 'var(--color-slate-50)',
                      cursor: 'pointer',
                      boxShadow: mode === 'OFFLINE_HOME' ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'none',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: mode === 'OFFLINE_HOME' ? 'var(--color-blue-50)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-blue-600)',
                    }}>
                      <Home size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-slate-900)' }}>Home Tuition</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>Tutor visits your home</div>
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
                      border: `2px solid ${mode === 'ONLINE_LIVE' ? 'var(--color-blue-600)' : 'var(--border-subtle)'}`,
                      backgroundColor: mode === 'ONLINE_LIVE' ? '#FFFFFF' : 'var(--color-slate-50)',
                      cursor: 'pointer',
                      boxShadow: mode === 'ONLINE_LIVE' ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'none',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: mode === 'ONLINE_LIVE' ? 'var(--color-blue-50)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-blue-600)',
                    }}>
                      <Video size={18} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-slate-900)' }}>Online 1-on-1</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-emerald-600)', fontWeight: 600 }}>Save ~25%</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Grade Selection */}
              <div>
                <label className="form-label">2. Select Student Grade / Board</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="form-control"
                  style={{ fontWeight: 600, padding: '0.85rem 1rem' }}
                >
                  <option value="Class 1 - 5 (Primary Foundation)">Class 1 to 5 (Primary School)</option>
                  <option value="Class 6 - 8 (Middle School)">Class 6 to 8 (Middle School)</option>
                  <option value="Class 9 & 10 (CBSE / ICSE Board)">Class 9 & 10 (CBSE / ICSE Board Prep)</option>
                  <option value="Class 11 & 12 (Board & JEE/NEET)">Class 11 & 12 (CBSE / ISC / Foundation)</option>
                  <option value="IB / IGCSE / Cambridge Elite">IB (MYP/DP) / Cambridge IGCSE</option>
                  <option value="Coding & AI for Kids">Coding & Python (SSSAM Academy)</option>
                </select>
              </div>

              {/* Days Per Week Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>3. Frequency of Classes</label>
                  <span style={{ fontWeight: 700, color: 'var(--color-blue-600)', fontSize: '0.9rem' }}>
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
                        border: `1.5px solid ${daysPerWeek === days ? 'var(--color-blue-600)' : 'var(--border-subtle)'}`,
                        backgroundColor: daysPerWeek === days ? 'var(--color-blue-600)' : '#FFFFFF',
                        color: daysPerWeek === days ? '#FFFFFF' : 'var(--color-slate-700)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                      }}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Calculated Price Card */}
            <div style={{
              backgroundColor: 'var(--color-slate-900)',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: 'var(--shadow-hover)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-slate-300)', fontWeight: 600 }}>
                    ESTIMATED MONTHLY FEE
                  </span>
                  <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-emerald-500)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    ✨ Free 1st Demo Class
                  </span>
                </div>

                <div style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                  {currentFee.monthlyRange}
                  <span style={{ fontSize: '1rem', color: 'var(--color-slate-400)', fontWeight: 500 }}> / month</span>
                </div>

                <div style={{ fontSize: '0.88rem', color: '#93C5FD', marginBottom: '1.5rem' }}>
                  ≈ ₹{currentFee.hourly}/hour • {currentFee.classesPerMonth} personalized classes per month
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem', fontSize: '0.85rem', color: 'var(--color-slate-300)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} color="var(--color-emerald-500)" />
                    <span>Background-checked, verified educator in your sector</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} color="var(--color-emerald-500)" />
                    <span>Free replacement tutor guarantee if unsatisfied</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} color="var(--color-emerald-500)" />
                    <span>Monthly progress reports & test tracking</span>
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
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Book 1-on-1 Free Demo Class</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
