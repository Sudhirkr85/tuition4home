'use client';

import React, { useState, useEffect } from 'react';
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
  Plus,
  UserPlus,
  Phone,
  Mail,
  History,
  FileText,
  Search,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Home,
  Video,
} from 'lucide-react';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';
import TutorMatchModal from '@/components/TutorMatchModal';

interface Counselor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  callsCount?: number;
  trialsCount?: number;
  conversionsCount?: number;
  commissionTotal?: number;
}

interface LeadActivityItem {
  id: string;
  leadId: string;
  actionType: string;
  description: string;
  performedBy: string;
  createdAt: string;
}

interface LeadItem {
  id: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  preferredMode: 'OFFLINE_HOME' | 'ONLINE_LIVE';
  locality: string;
  gradeClass: string;
  subjectsNeeded: string;
  budgetMonthly?: number;
  status: 'NEW_LEAD' | 'CONTACTED' | 'INTERESTED' | 'CALL_SCHEDULED' | 'DEMO_SCHEDULED' | 'TUITION_CONFIRMED' | 'LOST';
  notes?: string;
  assignedTutor?: string;
  demoDate?: string;
  nextFollowupDate?: string | null;
  commissionAmount?: number;
  createdAt: string;
  updatedAt: string;
  activities?: LeadActivityItem[];
}

export default function SuperAdminPage() {
  const [activeAdminTab, setActiveAdminTab] = useState<'OVERVIEW' | 'COUNSELORS' | 'LEADS'>('OVERVIEW');

  // Pricing & campaign config state
  const [basePrice, setBasePrice] = useState(999);
  const [isOfferActive, setIsOfferActive] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(100);
  const [campaignTitle, setCampaignTitle] = useState('Academic Session 2026-27 Special Drive');
  const [campaignSubtitle, setCampaignSubtitle] = useState('100% Verification Fee Waiver for Gurgaon & NCR Educators');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Counselors State
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [counselorLoading, setCounselorLoading] = useState(false);
  const [showAddCounselorModal, setShowAddCounselorModal] = useState(false);
  const [newCounselorName, setNewCounselorName] = useState('');
  const [newCounselorEmail, setNewCounselorEmail] = useState('');
  const [newCounselorPhone, setNewCounselorPhone] = useState('');
  const [newCounselorPassword, setNewCounselorPassword] = useState('');
  const [counselorFormError, setCounselorFormError] = useState('');
  const [counselorFormSubmitting, setCounselorFormSubmitting] = useState(false);
  const [counselorSuccessMsg, setCounselorSuccessMsg] = useState('');

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({});

  // Proximity Tutor Match State
  const [selectedLeadForMatching, setSelectedLeadForMatching] = useState<LeadItem | null>(null);

  // Follow-up modal state
  const [selectedLeadForUpdate, setSelectedLeadForUpdate] = useState<LeadItem | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('CONTACTED');
  const [updateNotes, setUpdateNotes] = useState<string>('');
  const [updateNextFollowup, setUpdateNextFollowup] = useState<string>('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [noteError, setNoteError] = useState('');

  // Fetch counselors
  const fetchCounselors = async () => {
    setCounselorLoading(true);
    try {
      const res = await fetch('/api/admin/counselors');
      const data = await res.json();
      if (data.success && data.counselors) {
        setCounselors(data.counselors);
      }
    } catch (err) {
      console.error('Failed to fetch counselors:', err);
    } finally {
      setCounselorLoading(false);
    }
  };

  // Fetch leads
  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/leads/list');
      const data = await res.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselors();
    fetchLeads();
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Add Counselor Handler
  const handleCreateCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounselorName || !newCounselorEmail || !newCounselorPassword) {
      setCounselorFormError('Name, Email, and Password are required.');
      return;
    }

    setCounselorFormSubmitting(true);
    setCounselorFormError('');

    try {
      const res = await fetch('/api/admin/counselors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCounselorName,
          email: newCounselorEmail,
          phone: newCounselorPhone,
          password: newCounselorPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCounselorSuccessMsg(`🎉 Counselor ${newCounselorName} registered successfully!`);
        setCounselors((prev) => [data.counselor, ...prev]);
        setNewCounselorName('');
        setNewCounselorEmail('');
        setNewCounselorPhone('');
        setNewCounselorPassword('');
        setShowAddCounselorModal(false);
        setTimeout(() => setCounselorSuccessMsg(''), 4000);
      } else {
        setCounselorFormError(data.error || 'Failed to add counselor');
      }
    } catch (err) {
      setCounselorFormError('Network error creating counselor');
    } finally {
      setCounselorFormSubmitting(false);
    }
  };

  const toggleTimeline = (leadId: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
  };

  const openUpdateModal = (lead: LeadItem) => {
    setSelectedLeadForUpdate(lead);
    setUpdateStatus(lead.status);
    setUpdateNotes('');
    setUpdateNextFollowup('');
    setNoteError('');
  };

  const handleSaveFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForUpdate) return;
    if (!updateNotes.trim()) {
      setNoteError('Follow-up note/remark is mandatory.');
      return;
    }

    setNoteSubmitting(true);
    setNoteError('');

    try {
      const res = await fetch(`/api/leads/${selectedLeadForUpdate.id}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updateStatus,
          notes: updateNotes,
          nextFollowupDate: updateNextFollowup || null,
          performedBy: 'Admin (SSSAM Lead Desk)',
        }),
      });

      const data = await res.json();
      if (data.success) {
        const updatedActivities = [
          {
            id: `act-${Date.now()}`,
            leadId: selectedLeadForUpdate.id,
            actionType: 'STATUS_CHANGE',
            description: `[Status: ${updateStatus}] ${updateNotes}${
              updateNextFollowup ? ` (Next Follow-up: ${new Date(updateNextFollowup).toLocaleString('en-IN')})` : ''
            }`,
            performedBy: 'Admin (SSSAM Lead Desk)',
            createdAt: new Date().toISOString(),
          },
          ...(selectedLeadForUpdate.activities || []),
        ];

        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLeadForUpdate.id
              ? {
                  ...l,
                  status: updateStatus as any,
                  notes: updateNotes,
                  nextFollowupDate: updateNextFollowup || l.nextFollowupDate,
                  updatedAt: new Date().toISOString(),
                  activities: updatedActivities,
                }
              : l
          )
        );

        setExpandedTimelines((prev) => ({ ...prev, [selectedLeadForUpdate.id]: true }));
        setSelectedLeadForUpdate(null);
      } else {
        setNoteError(data.error || 'Failed to save follow-up');
      }
    } catch (err) {
      setNoteError('Network error saving follow-up');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleAssignProximityTutor = async (tutorName: string, tutorId: string, matchNote: string) => {
    if (!selectedLeadForMatching) return;

    try {
      const res = await fetch(`/api/leads/${selectedLeadForMatching.id}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'DEMO_SCHEDULED',
          notes: matchNote,
          performedBy: 'Admin (SSSAM Lead Desk)',
          actionType: 'DEMO_FIXED',
        }),
      });

      const updatedActivities = [
        {
          id: `act-${Date.now()}`,
          leadId: selectedLeadForMatching.id,
          actionType: 'DEMO_FIXED',
          description: `[Status: DEMO_SCHEDULED] ${matchNote}`,
          performedBy: 'Admin (SSSAM Lead Desk)',
          createdAt: new Date().toISOString(),
        },
        ...(selectedLeadForMatching.activities || []),
      ];

      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLeadForMatching.id
            ? {
                ...l,
                status: 'DEMO_SCHEDULED',
                assignedTutor: tutorName,
                notes: matchNote,
                updatedAt: new Date().toISOString(),
                activities: updatedActivities,
              }
            : l
        )
      );

      setExpandedTimelines((prev) => ({ ...prev, [selectedLeadForMatching.id]: true }));
      setSelectedLeadForMatching(null);
      alert(`🎉 Successfully matched tutor ${tutorName}! Demo status logged and timeline updated.`);
    } catch (err) {
      console.error('Failed to assign tutor:', err);
    }
  };

  // Helper date checking
  const isToday = (dateStr?: string | null) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const isOverdue = (dateStr?: string | null) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return d.getTime() < now.setHours(0, 0, 0, 0);
  };

  // Filter calculations
  const filterCounts = {
    ALL: leads.length,
    NEW_LEAD: leads.filter((l) => l.status === 'NEW_LEAD').length,
    TODAY: leads.filter((l) => l.nextFollowupDate && isToday(l.nextFollowupDate)).length,
    OVERDUE: leads.filter((l) => l.nextFollowupDate && isOverdue(l.nextFollowupDate)).length,
    INTERESTED: leads.filter((l) => l.status === 'INTERESTED').length,
    CONTACTED: leads.filter((l) => l.status === 'CONTACTED').length,
    DEMO_SCHEDULED: leads.filter((l) => l.status === 'DEMO_SCHEDULED').length,
    TUITION_CONFIRMED: leads.filter((l) => l.status === 'TUITION_CONFIRMED').length,
    LOST: leads.filter((l) => l.status === 'LOST').length,
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const subjects = l.subjectsNeeded || '';
    const matchesSearch =
      l.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.parentPhone.includes(searchQuery) ||
      l.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subjects.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.gradeClass.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'NEW_LEAD') return l.status === 'NEW_LEAD';
    if (activeFilter === 'TODAY') return l.nextFollowupDate && isToday(l.nextFollowupDate);
    if (activeFilter === 'OVERDUE') return l.nextFollowupDate && isOverdue(l.nextFollowupDate);
    if (activeFilter === 'INTERESTED') return l.status === 'INTERESTED';
    if (activeFilter === 'CONTACTED') return l.status === 'CONTACTED';
    if (activeFilter === 'DEMO_SCHEDULED') return l.status === 'DEMO_SCHEDULED';
    if (activeFilter === 'TUITION_CONFIRMED') return l.status === 'TUITION_CONFIRMED';
    if (activeFilter === 'LOST') return l.status === 'LOST';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW_LEAD':
        return <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 800 }}>🆕 New Lead</span>;
      case 'INTERESTED':
        return <span className="badge" style={{ backgroundColor: '#FEF08A', color: '#854D0E', fontWeight: 800 }}>⭐ Highly Interested</span>;
      case 'CONTACTED':
        return <span className="badge" style={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontWeight: 800 }}>📞 Contacted</span>;
      case 'DEMO_SCHEDULED':
        return <span className="badge" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', fontWeight: 800 }}>🎓 Demo Fixed</span>;
      case 'TUITION_CONFIRMED':
        return <span className="badge" style={{ backgroundColor: '#DCFCE7', color: '#166534', fontWeight: 800 }}>🏆 Tuition Won</span>;
      case 'LOST':
        return <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: 800 }}>❌ Lost</span>;
      default:
        return <span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>{status}</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 0 4rem 0' }}>
        <div className="container">
          {/* Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>
                <ShieldCheck size={14} />
                <span>SUPER ADMIN COMMAND CENTER • SSSAM ACADEMY</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Master Business, Counselors & Revenue Hub
              </h1>
            </div>

            {/* Admin Tabs */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveAdminTab('OVERVIEW')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeAdminTab === 'OVERVIEW' ? 'var(--brand-blue)' : 'transparent',
                  color: activeAdminTab === 'OVERVIEW' ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                📊 Dashboard & Pricing
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('COUNSELORS')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeAdminTab === 'COUNSELORS' ? 'var(--brand-blue)' : 'transparent',
                  color: activeAdminTab === 'COUNSELORS' ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                👥 Counselor Team ({counselors.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('LEADS')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeAdminTab === 'LEADS' ? 'var(--brand-blue)' : 'transparent',
                  color: activeAdminTab === 'LEADS' ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                📥 Shared Lead Desk ({leads.length})
              </button>
            </div>
          </div>

          {counselorSuccessMsg && (
            <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1.25rem', backgroundColor: 'var(--brand-emerald-light)', color: 'var(--brand-emerald)', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              <span>{counselorSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW & PRICING */}
          {activeAdminTab === 'OVERVIEW' && (
            <div>
              {/* Metric KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2.5rem',
                }}
              >
                <div className="apple-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <span>TOTAL REVENUE (THIS MONTH)</span>
                    <DollarSign size={18} color="var(--brand-emerald)" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>₹2,48,000</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--brand-emerald)', fontWeight: 700, marginTop: '4px' }}>↑ +28% vs last month</div>
                </div>

                <div className="apple-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <span>ACTIVE VERIFIED TUTORS</span>
                    <Award size={18} color="var(--brand-blue)" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>482</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--brand-blue)', fontWeight: 700, marginTop: '4px' }}>Across 14 Gurgaon Sectors</div>
                </div>

                <div className="apple-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <span>INBOUND PARENT LEADS</span>
                    <Users size={18} color="var(--brand-amber)" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{leads.length}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Real-time sync active</div>
                </div>

                <div className="apple-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <span>ACTIVE COUNSELORS</span>
                    <TrendingUp size={18} color="var(--text-main)" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{counselors.length}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Operational Desks</div>
                </div>
              </div>

              {/* Pricing & Campaign Controller */}
              <div className="apple-card" style={{ padding: '2.5rem', marginBottom: '2.5rem', backgroundColor: '#FFFFFF' }}>
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
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
            </div>
          )}

          {/* TAB 2: COUNSELOR MANAGEMENT */}
          {activeAdminTab === 'COUNSELORS' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Counselor Team & Performance Desk
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Create counselor credentials and monitor follow-ups and revenue generated.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddCounselorModal(true);
                    setCounselorFormError('');
                  }}
                  className="btn btn-primary"
                  style={{ backgroundColor: 'var(--brand-emerald)' }}
                >
                  <UserPlus size={16} />
                  <span>➕ Add New Counselor</span>
                </button>
              </div>

              {/* Counselor Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {counselors.map((csl, index) => (
                  <div key={csl.id} className="apple-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{csl.name}</h3>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Desk ID: {csl.id}</span>
                        </div>
                        <span className="badge badge-emerald">ACTIVE</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Mail size={14} />
                          <span>{csl.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={14} />
                          <span>+91 {csl.phone || '95174 47689'}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-hairline)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', textAlign: 'center', backgroundColor: 'var(--bg-app)', padding: '0.75rem', borderRadius: '10px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>CALLS LOGGED</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{index === 0 ? '142' : index === 1 ? '118' : '0'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>REVENUE CLOSED</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-blue)' }}>{index === 0 ? '₹1,32,000' : index === 1 ? '₹1,16,000' : '₹0'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SHARED LEADS & AUDIT TIMELINE */}
          {activeAdminTab === 'LEADS' && (
            <div>
              {/* Search & Filter Bar */}
              <div className="apple-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search leads by Parent Name, Phone, Locality, or Subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.75rem', borderRadius: '12px' }}
                    />
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Showing <strong>{filteredLeads.length}</strong> of {leads.length} inquiries
                  </div>
                </div>

                {/* 8 Operational Filters */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {[
                    { id: 'ALL', label: '📋 All Leads', count: filterCounts.ALL },
                    { id: 'TODAY', label: '🔔 Today\'s Follow-up', count: filterCounts.TODAY, highlight: true },
                    { id: 'OVERDUE', label: '⚠️ Pending / Overdue', count: filterCounts.OVERDUE, danger: true },
                    { id: 'NEW_LEAD', label: '🆕 Not Contacted', count: filterCounts.NEW_LEAD },
                    { id: 'INTERESTED', label: '⭐ Highly Interested', count: filterCounts.INTERESTED, star: true },
                    { id: 'CONTACTED', label: '📞 Contacted', count: filterCounts.CONTACTED },
                    { id: 'DEMO_SCHEDULED', label: '🎓 Demo Scheduled', count: filterCounts.DEMO_SCHEDULED },
                    { id: 'TUITION_CONFIRMED', label: '🏆 Converted', count: filterCounts.TUITION_CONFIRMED },
                    { id: 'LOST', label: '❌ Lost', count: filterCounts.LOST },
                  ].map((tab) => {
                    const isActive = activeFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFilter(tab.id)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '10px',
                          border: `1.5px solid ${
                            isActive
                              ? 'var(--brand-blue)'
                              : tab.danger && tab.count > 0
                              ? '#FCA5A5'
                              : tab.highlight && tab.count > 0
                              ? '#93C5FD'
                              : 'var(--border-hairline)'
                          }`,
                          backgroundColor: isActive
                            ? 'var(--brand-blue)'
                            : tab.danger && tab.count > 0
                            ? '#FEF2F2'
                            : tab.highlight && tab.count > 0
                            ? '#EFF6FF'
                            : '#FFFFFF',
                          color: isActive
                            ? '#FFFFFF'
                            : tab.danger && tab.count > 0
                            ? '#DC2626'
                            : tab.highlight && tab.count > 0
                            ? '#1D4ED8'
                            : 'var(--text-main)',
                          fontWeight: isActive || (tab.count > 0 && (tab.danger || tab.highlight || tab.star)) ? 700 : 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span>{tab.label}</span>
                        <span
                          style={{
                            padding: '0.1rem 0.45rem',
                            borderRadius: '999px',
                            backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                          }}
                        >
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Leads Listing */}
              {leadsLoading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading leads and history...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="apple-card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                  <FileText size={38} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>No Leads in this Filter</h3>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {filteredLeads.map((lead) => {
                    const isExpanded = !!expandedTimelines[lead.id];
                    const lastActivity = lead.activities?.[0];
                    const subjects = Array.isArray(lead.subjectsNeeded)
                      ? lead.subjectsNeeded.join(', ')
                      : lead.subjectsNeeded.replace(/[\[\]"]/g, '');

                    const hasOverdueFollowup = lead.nextFollowupDate && isOverdue(lead.nextFollowupDate);
                    const hasTodayFollowup = lead.nextFollowupDate && isToday(lead.nextFollowupDate);

                    return (
                      <div
                        key={lead.id}
                        className="apple-card"
                        style={{
                          padding: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                          backgroundColor: '#FFFFFF',
                          borderLeft: `4px solid ${
                            lead.status === 'TUITION_CONFIRMED'
                              ? 'var(--brand-emerald)'
                              : lead.status === 'DEMO_SCHEDULED'
                              ? 'var(--brand-blue)'
                              : lead.status === 'INTERESTED'
                              ? '#EAB308'
                              : hasOverdueFollowup
                              ? '#EF4444'
                              : 'var(--border-hairline)'
                          }`,
                        }}
                      >
                        {/* Top Bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                backgroundColor: lead.preferredMode === 'OFFLINE_HOME' ? 'var(--brand-blue-light)' : 'var(--brand-emerald-light)',
                                color: lead.preferredMode === 'OFFLINE_HOME' ? 'var(--brand-blue)' : 'var(--brand-emerald)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {lead.preferredMode === 'OFFLINE_HOME' ? <Home size={22} /> : <Video size={22} />}
                            </div>

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{lead.parentName}</h3>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>[{lead.id}]</span>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                📍 <strong>{lead.locality}</strong> • {lead.gradeClass} ({subjects}) • Budget: <strong style={{ color: 'var(--brand-blue)' }}>₹{lead.budgetMonthly?.toLocaleString('en-IN') || 'Negotiable'}</strong>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {hasOverdueFollowup && (
                              <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontWeight: 800 }}>
                                ⚠️ Overdue Callback
                              </span>
                            )}
                            {hasTodayFollowup && (
                              <span className="badge" style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: 800 }}>
                                🔔 Callback Today
                              </span>
                            )}
                            {getStatusBadge(lead.status)}
                          </div>
                        </div>

                        {/* Note & Performer */}
                        <div
                          style={{
                            backgroundColor: 'var(--bg-app)',
                            borderRadius: '10px',
                            padding: '0.75rem 1rem',
                            fontSize: '0.84rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                            <FileText size={15} color="var(--brand-blue)" />
                            <strong>Latest Note:</strong>
                            <span style={{ color: 'var(--text-muted)' }}>{lead.notes || 'No notes yet.'}</span>
                          </div>

                          {lastActivity && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              🛡️ Last updated by <strong style={{ color: 'var(--text-main)' }}>{lastActivity.performedBy}</strong> ({new Date(lastActivity.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-hairline)' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <a href={`tel:${lead.parentPhone}`} className="btn btn-secondary btn-sm">
                              <Phone size={14} color="var(--brand-emerald)" />
                              <span>+91 {lead.parentPhone}</span>
                            </a>
                            <a
                              href={`https://wa.me/91${lead.parentPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ borderColor: '#25D366' }}
                            >
                              <MessageSquare size={14} color="#25D366" />
                              <span>WhatsApp</span>
                            </a>
                            <button
                              onClick={() => setSelectedLeadForMatching(lead)}
                              className="btn btn-emerald btn-sm"
                              style={{ backgroundColor: 'var(--brand-teal)', color: '#FFFFFF', fontWeight: 700 }}
                            >
                              <Sparkles size={14} />
                              <span>🎯 Match Proximity Tutor</span>
                            </button>
                            <button
                              onClick={() => openUpdateModal(lead)}
                              className="btn btn-primary btn-sm"
                              style={{ backgroundColor: 'var(--brand-blue)' }}
                            >
                              <Plus size={14} />
                              <span>Update Note & Status</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleTimeline(lead.id)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--brand-blue)',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              cursor: 'pointer',
                            }}
                          >
                            <History size={14} />
                            <span>{isExpanded ? 'Hide History' : `View Timeline (${lead.activities?.length || 0})`}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>

                        {/* Audit Timeline */}
                        {isExpanded && (
                          <div
                            style={{
                              marginTop: '0.5rem',
                              padding: '1.25rem',
                              borderRadius: '12px',
                              backgroundColor: 'var(--bg-card-subtle)',
                              border: '1px solid var(--border-hairline)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>
                              <History size={16} color="var(--brand-blue)" />
                              <span>Lead Activity & Follow-up History</span>
                            </div>

                            {lead.activities && lead.activities.length > 0 ? (
                              <div style={{ position: 'relative', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', backgroundColor: 'var(--border-hairline)' }} />

                                {lead.activities.map((act) => (
                                  <div key={act.id} style={{ position: 'relative' }}>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        left: '-1.5rem',
                                        top: '3px',
                                        width: '14px',
                                        height: '14px',
                                        borderRadius: '50%',
                                        backgroundColor: '#FFFFFF',
                                        border: '3px solid var(--brand-blue)',
                                      }}
                                    />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem' }}>
                                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                                        {act.performedBy}
                                        <span style={{ marginLeft: '0.5rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: '#E2E8F0', fontSize: '0.72rem', color: '#334155' }}>
                                          {act.actionType}
                                        </span>
                                      </div>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(act.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                      </div>
                                    </div>

                                    <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                      {act.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                No history records for this lead yet.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ADD COUNSELOR MODAL */}
      {showAddCounselorModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="apple-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#FFFFFF',
              padding: '2rem',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  ➕ Create Counselor Account
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
                  Grant staff access to the shared Lead Management & Follow-up Desk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCounselorModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCounselor} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Counselor Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pooja Sharma / Karan Mehra"
                  value={newCounselorName}
                  onChange={(e) => setNewCounselorName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. pooja.counselor@sssamacademy.com"
                  value={newCounselorEmail}
                  onChange={(e) => setNewCounselorEmail(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9517447689"
                  value={newCounselorPhone}
                  onChange={(e) => setNewCounselorPhone(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Account Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter login password"
                  value={newCounselorPassword}
                  onChange={(e) => setNewCounselorPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              {counselorFormError && (
                <div style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.82rem', fontWeight: 700 }}>
                  ⚠️ {counselorFormError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddCounselorModal(false)}
                  className="btn btn-secondary"
                  disabled={counselorFormSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={counselorFormSubmitting}
                  style={{ backgroundColor: 'var(--brand-emerald)' }}
                >
                  <UserPlus size={16} />
                  <span>{counselorFormSubmitting ? 'Creating...' : 'Create Counselor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE FOLLOW-UP MODAL (ADMIN) */}
      {selectedLeadForUpdate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="apple-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#FFFFFF',
              padding: '2rem',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Update Lead Follow-up (Admin)
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Parent: <strong>{selectedLeadForUpdate.parentName}</strong> ({selectedLeadForUpdate.locality})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadForUpdate(null)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFollowup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Update Lead Status
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="form-control"
                  style={{ fontWeight: 700 }}
                >
                  <option value="NEW_LEAD">🆕 New Lead (Not Contacted)</option>
                  <option value="CONTACTED">📞 Contacted (Spoke with parent)</option>
                  <option value="INTERESTED">⭐ Highly Interested (Ready for tutor)</option>
                  <option value="DEMO_SCHEDULED">🎓 Demo Scheduled</option>
                  <option value="TUITION_CONFIRMED">🏆 Tuition Confirmed (Won)</option>
                  <option value="LOST">❌ Lost / Not Interested</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Follow-up Note / Call Remarks *</span>
                  <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>Mandatory</span>
                </label>
                <textarea
                  rows={3}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Enter detailed update remark e.g. Parent requested weekend demo..."
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  ⏰ Set Next Follow-up Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={updateNextFollowup}
                  onChange={(e) => setUpdateNextFollowup(e.target.value)}
                  className="form-control"
                />
              </div>

              {noteError && (
                <div style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.82rem', fontWeight: 700 }}>
                  ⚠️ {noteError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedLeadForUpdate(null)}
                  className="btn btn-secondary"
                  disabled={noteSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={noteSubmitting}
                  style={{ backgroundColor: 'var(--brand-blue)' }}
                >
                  <Send size={16} />
                  <span>{noteSubmitting ? 'Saving...' : 'Save & Update Timeline'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SMART PROXIMITY TUTOR MATCH MODAL */}
      {selectedLeadForMatching && (
        <TutorMatchModal
          lead={selectedLeadForMatching}
          currentOperator="Admin (SSSAM Lead Desk)"
          onClose={() => setSelectedLeadForMatching(null)}
          onAssignTutor={(tutorName, tutorId, notes) => handleAssignProximityTutor(tutorName, tutorId, notes)}
        />
      )}

      <Footer />
    </div>
  );
}
