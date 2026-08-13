'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Sparkles,
  Save,
  CheckCircle2,
  ShieldCheck,
  Building2,
  MapPin,
  Settings,
} from 'lucide-react';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';

export default function SuperAdminPage() {
  const [basePrice, setBasePrice] = useState(999);
  const [isOfferActive, setIsOfferActive] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(100);
  const [campaignTitle, setCampaignTitle] = useState('Academic Session 2026-27 Special Drive');
  const [campaignSubtitle, setCampaignSubtitle] = useState('100% Verification Fee Waiver for Gurgaon & NCR Educators');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '3rem 0 5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <div className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>
                <ShieldCheck size={14} />
                <span>SUPER ADMIN COMMAND CENTER • SSSAM ACADEMY</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Master Business & Revenue Dashboard
              </h1>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}>
            <div className="apple-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <span>TOTAL REVENUE (THIS MONTH)</span>
                <DollarSign size={18} color="var(--brand-emerald)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                ₹2,48,000
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--brand-emerald)', fontWeight: 700, marginTop: '4px' }}>
                ↑ +28% vs last month
              </div>
            </div>

            <div className="apple-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <span>ACTIVE VERIFIED TUTORS</span>
                <Award size={18} color="var(--brand-blue)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                482
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--brand-blue)', fontWeight: 700, marginTop: '4px' }}>
                Across 14 Gurgaon Sectors
              </div>
            </div>

            <div className="apple-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <span>INBOUND PARENT LEADS</span>
                <Users size={18} color="var(--brand-amber)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                114
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                This month (78% Conversion)
              </div>
            </div>

            <div className="apple-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <span>AVG. COMMISSION / PLACEMENT</span>
                <TrendingUp size={18} color="var(--text-main)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                ₹5,160
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                50% 1st-Month Fee Model
              </div>
            </div>
          </div>

          {/* Pricing & Campaign Controller */}
          <div className="apple-card" style={{ padding: '2.5rem', marginBottom: '3rem', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1.5rem' }}>
              <div>
                <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>
                  <Settings size={14} />
                  <span>SITETWAVE CONTROLLER</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Dynamic Tutor Pricing & Festival Campaign Controller
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Switch between 100% Free launch offers, festive campaigns, or Full Price without touching code.
                </p>
              </div>

              {savedSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--brand-emerald-light)', color: 'var(--brand-emerald)', padding: '0.6rem 1rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Pricing & Campaign Updated Live!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Base Tutor Verification Fee (₹)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Active Discount Setting</label>
                  <select
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="form-control"
                    style={{ fontWeight: 700 }}
                  >
                    <option value={100}>100% OFF (₹0 Free Registration - Early Launch)</option>
                    <option value={50}>50% OFF (₹499 Promotional Price)</option>
                    <option value={0}>0% OFF (Full Price ₹999)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Campaign Banner Status</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsOfferActive(true)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: `1.5px solid ${isOfferActive ? 'var(--brand-emerald)' : 'var(--border-hairline)'}`,
                        backgroundColor: isOfferActive ? 'var(--brand-emerald-light)' : '#FFFFFF',
                        color: isOfferActive ? 'var(--brand-emerald)' : 'var(--text-main)',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      🟢 Offer ON
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOfferActive(false)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: `1.5px solid ${!isOfferActive ? 'var(--text-main)' : 'var(--border-hairline)'}`,
                        backgroundColor: !isOfferActive ? 'var(--text-main)' : '#FFFFFF',
                        color: !isOfferActive ? '#FFFFFF' : 'var(--text-main)',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      🔴 Offer OFF
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Campaign Title / Hook</label>
                  <input
                    type="text"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Campaign Subtext</label>
                  <input
                    type="text"
                    value={campaignSubtitle}
                    onChange={(e) => setCampaignSubtitle(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-hairline)' }}>
                <button type="submit" className="btn btn-primary btn-lg">
                  <Save size={18} />
                  <span>Save & Publish Pricing Live</span>
                </button>
              </div>
            </form>
          </div>

          {/* Counselor Tracker */}
          <div className="apple-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Counselor Team Performance Tracker
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-hairline)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <th style={{ padding: '0.75rem' }}>COUNSELOR NAME</th>
                    <th style={{ padding: '0.75rem' }}>CALLS MADE</th>
                    <th style={{ padding: '0.75rem' }}>TRIALS FIXED</th>
                    <th style={{ padding: '0.75rem' }}>CONVERSIONS</th>
                    <th style={{ padding: '0.75rem' }}>COMMISSION GENERATED</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700 }}>Pooja Sharma (Lead Desk 1)</td>
                    <td style={{ padding: '1rem 0.75rem' }}>142</td>
                    <td style={{ padding: '1rem 0.75rem' }}>38</td>
                    <td style={{ padding: '1rem 0.75rem' }}>26 closed</td>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: 'var(--brand-blue)' }}>₹1,32,000</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700 }}>Karan Mehra (Lead Desk 2)</td>
                    <td style={{ padding: '1rem 0.75rem' }}>118</td>
                    <td style={{ padding: '1rem 0.75rem' }}>31</td>
                    <td style={{ padding: '1rem 0.75rem' }}>22 closed</td>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: 700, color: 'var(--brand-blue)' }}>₹1,16,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
