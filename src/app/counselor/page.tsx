'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  QrCode,
  UserCheck,
  Video,
  Home,
  MapPin,
  Play,
  Plus,
  Clock,
  AlertCircle,
  Star,
  ChevronDown,
  ChevronUp,
  History,
  Send,
  Filter,
  Search,
  User,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';

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

export default function CounselorPortal() {
  const [activeTab, setActiveTab] = useState<'LEADS' | 'INTERVIEWS' | 'INVOICE'>('LEADS');
  const [dbLoading, setDbLoading] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Active counselor identity
  const [currentOperator, setCurrentOperator] = useState('Counselor Pooja');

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Expanded Timelines Map { leadId: boolean }
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({});

  // Follow-up Modal State
  const [selectedLeadForUpdate, setSelectedLeadForUpdate] = useState<LeadItem | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('CONTACTED');
  const [updateNotes, setUpdateNotes] = useState<string>('');
  const [updateNextFollowup, setUpdateNextFollowup] = useState<string>('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [noteError, setNoteError] = useState('');

  // Tutor Interviews State
  const [pendingTutors, setPendingTutors] = useState<any[]>([]);

  // Fetch leads from database / API
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

  // Fetch pending tutors from database
  const fetchPendingTutors = async () => {
    setDbLoading(true);
    try {
      const res = await fetch('/api/counselor/tutors');
      const data = await res.json();
      if (data.success) {
        const pending = data.tutors.filter((t: any) => t.status === 'PENDING_INTERVIEW' || t.status === 'DRAFT');
        if (pending.length > 0) {
          setPendingTutors(pending);
        } else {
          setPendingTutors([
            {
              id: 'tut-pending-1',
              name: 'Amitabh Mukherjee',
              avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
              introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              videoDuration: '1m 20s',
              highestDegree: 'M.Sc. Physics (IIT Roorkee)',
              experienceYears: 6,
              teachingMode: 'BOTH',
              subjects: ['Physics', 'Mathematics'],
              classes: ['Class 11 & 12 (Board & JEE/NEET)'],
              boards: ['CBSE', 'IB'],
              serviceAreas: ['DLF Phase 2', 'DLF Phase 4', 'Sector 14'],
              travelRadiusKm: 6,
              hourlyRateHomeMin: 950,
              hourlyRateHomeMax: 1500,
              hourlyRateOnlineMin: 700,
              hourlyRateOnlineMax: 1200,
              status: 'PENDING_INTERVIEW',
              isVerified: false,
              rating: 5.0,
              bio: 'Physics mentor with 6 years experience specializing in CBSE 12th boards and NEET numerical problem solving.',
              kycDoc: {
                idType: 'AADHAAR_MASKED',
                idLast4: '4589',
                idNumberDecrypted: '1234-5678-4589',
                idDocUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&auto=format&fit=crop&q=80',
              },
            },
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to retrieve tutor list:', err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchPendingTutors();
  }, []);

  const toggleTimeline = (leadId: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
  };

  const openUpdateModal = (lead: LeadItem, prefillStatus?: string, prefillNote?: string) => {
    setSelectedLeadForUpdate(lead);
    setUpdateStatus(prefillStatus || lead.status);
    setUpdateNotes(prefillNote || '');
    setUpdateNextFollowup('');
    setNoteError('');
  };

  const handleQuickNote = (noteText: string, suggestedStatus?: string) => {
    setUpdateNotes((prev) => (prev ? `${prev} | ${noteText}` : noteText));
    if (suggestedStatus) {
      setUpdateStatus(suggestedStatus);
    }
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
          performedBy: currentOperator,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        const updatedActivities = [
          {
            id: `act-${Date.now()}`,
            leadId: selectedLeadForUpdate.id,
            actionType: 'STATUS_CHANGE',
            description: `[Status: ${updateStatus}] ${updateNotes}${
              updateNextFollowup ? ` (Next Follow-up: ${new Date(updateNextFollowup).toLocaleString('en-IN')})` : ''
            }`,
            performedBy: currentOperator,
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

        // Keep timeline expanded for the updated lead
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

  const handleApproveTutor = async (tutorId: string) => {
    if (tutorId === 'tut-pending-1') {
      alert('🎉 Mock Tutor Interview Cleared! Verified Badge Activated.');
      setPendingTutors(pendingTutors.filter((t) => t.id !== tutorId));
      return;
    }

    try {
      const res = await fetch('/api/counselor/tutors/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorId }),
      });
      const data = await res.json();
      if (data.success) {
        alert('🎉 Tutor Interview Cleared! Verified Badge Activated & Profile is now Live.');
        setPendingTutors(pendingTutors.filter((t) => t.id !== tutorId));
      } else {
        alert('Failed to approve tutor: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      alert('Network error approving tutor.');
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
    // Prior to today midnight
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
    // Search query
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
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
            <div>
              <div className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>
                <ShieldCheck size={14} />
                <span>SSSAM ACADEMY • COUNSELOR & OPERATIONS HUB</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Shared Lead Follow-up & Matchmaking Desk
              </h1>
            </div>

            {/* Operator Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#FFFFFF', padding: '0.4rem 0.85rem', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
              <User size={16} color="var(--brand-teal)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Desk:</span>
              <select
                value={currentOperator}
                onChange={(e) => setCurrentOperator(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
              >
                <option value="Counselor Pooja">Counselor Pooja (Desk 1)</option>
                <option value="Counselor Karan">Counselor Karan (Desk 2)</option>
                <option value="Admin (SSSAM Lead Desk)">Admin (SSSAM Lead Desk)</option>
              </select>
            </div>

            {/* Main Tab Switcher */}
            <div style={{
              display: 'flex',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('LEADS')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeTab === 'LEADS' ? 'var(--brand-blue)' : 'transparent',
                  color: activeTab === 'LEADS' ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                📥 Shared Leads & Follow-ups ({leads.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('INTERVIEWS')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeTab === 'INTERVIEWS' ? 'var(--brand-blue)' : 'transparent',
                  color: activeTab === 'INTERVIEWS' ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                🎓 Tutor Interviews ({pendingTutors.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('INVOICE')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeTab === 'INVOICE' ? 'var(--brand-blue)' : 'transparent',
                  color: activeTab === 'INVOICE' ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                💳 Commission Generator
              </button>
            </div>
          </div>

          {/* TAB 1: SHARED LEADS & FOLLOW-UP TIMELINE */}
          {activeTab === 'LEADS' && (
            <div>
              {/* Search & Filter Bar */}
              <div className="apple-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search by Parent Name, Phone, Locality, Grade or Subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.75rem', borderRadius: '12px' }}
                    />
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Showing <strong>{filteredLeads.length}</strong> of {leads.length} total inquiries
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
                          transition: 'all 0.15s ease',
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
                  Loading shared leads and timeline...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="apple-card" style={{ padding: '3.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                  <FileText size={42} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>No Leads in this Filter</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Try selecting another filter or clear your search term.
                  </p>
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
                        {/* Top Bar: Parent Info + Badges */}
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

                        {/* Middle: Latest Note & Collision Safety */}
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
                            <span style={{ color: 'var(--text-muted)' }}>{lead.notes || 'No notes entered yet.'}</span>
                          </div>

                          {lastActivity && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              🛡️ Last updated by <strong style={{ color: 'var(--text-main)' }}>{lastActivity.performedBy}</strong> ({new Date(lastActivity.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})
                            </div>
                          )}
                        </div>

                        {/* Action Bar */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            paddingTop: '0.75rem',
                            borderTop: '1px solid var(--border-hairline)',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <a href={`tel:${lead.parentPhone}`} className="btn btn-secondary btn-sm">
                              <Phone size={14} color="var(--brand-emerald)" />
                              <span>+91 {lead.parentPhone}</span>
                            </a>

                            <a
                              href={`https://wa.me/91${lead.parentPhone}?text=${encodeURIComponent(
                                `Hello ${lead.parentName}, this is TuitionForHome support (SSSAM Academy). We have shortlisted top verified home tutors for ${lead.gradeClass} (${subjects}) in ${lead.locality}. When can we schedule your trial class?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ borderColor: '#25D366' }}
                            >
                              <MessageSquare size={14} color="#25D366" />
                              <span>WhatsApp</span>
                            </a>

                            <button
                              onClick={() => openUpdateModal(lead)}
                              className="btn btn-primary btn-sm"
                              style={{ backgroundColor: 'var(--brand-blue)' }}
                            >
                              <Plus size={14} />
                              <span>Update Status & Note</span>
                            </button>
                          </div>

                          {/* Timeline Toggle Button */}
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

                        {/* Interactive Audit Timeline View */}
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                              <History size={16} color="var(--brand-blue)" />
                              <span>Lead Follow-up & Activity Timeline</span>
                            </div>

                            {lead.activities && lead.activities.length > 0 ? (
                              <div style={{ position: 'relative', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Vertical timeline line */}
                                <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', backgroundColor: 'var(--border-hairline)' }} />

                                {lead.activities.map((act) => (
                                  <div key={act.id} style={{ position: 'relative' }}>
                                    {/* Circle dot on line */}
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
                                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
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
                                No history records available for this lead yet.
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

          {/* TAB 2: TUTOR INTERVIEWS */}
          {activeTab === 'INTERVIEWS' && (
            <div>
              {pendingTutors.length > 0 ? (
                pendingTutors.map((tutor) => (
                  <div key={tutor.id} className="apple-card" style={{ padding: '2rem', marginBottom: '1.5rem', backgroundColor: '#FFFFFF' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tutor.avatarUrl} alt={tutor.name} style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} />
                          <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{tutor.name}</h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--brand-teal)', fontWeight: 700 }}>
                              {tutor.highestDegree} • {tutor.experienceYears} Yrs Exp
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              📞 Mobile: {tutor.phone} | ✉️ {tutor.email}
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                          <div style={{ marginBottom: '0.4rem' }}>
                            <strong>Subjects:</strong> {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'Not Specified'}
                          </div>
                          <div style={{ marginBottom: '0.4rem' }}>
                            <strong>Classes:</strong> {Array.isArray(tutor.classes) ? tutor.classes.join(', ') : 'Not Specified'}
                          </div>
                          <div style={{ marginBottom: '0.4rem' }}>
                            <strong>Gurgaon Sectors:</strong> {Array.isArray(tutor.serviceAreas) ? tutor.serviceAreas.join(', ') : 'Not Specified'} (Radius: {tutor.travelRadiusKm} KM)
                          </div>
                          <div>
                            <strong>Hourly Rates Range:</strong>
                            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.2rem' }}>
                              <li>Home Visit: ₹{tutor.hourlyRateHomeMin} - ₹{tutor.hourlyRateHomeMax}/hr</li>
                              <li>Online 1-on-1: ₹{tutor.hourlyRateOnlineMin} - ₹{tutor.hourlyRateOnlineMax}/hr</li>
                            </ul>
                          </div>
                        </div>

                        {tutor.introVideoUrl && (
                          <a
                            href={tutor.introVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '0.85rem',
                              backgroundColor: 'var(--brand-teal-light)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              color: 'var(--brand-teal)',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Play size={15} fill="var(--brand-teal)" />
                              <span>Watch 60s Video Intro Submission</span>
                            </span>
                            <span style={{ fontSize: '0.75rem' }}>View Video ↗</span>
                          </a>
                        )}
                      </div>

                      {/* Scorecard */}
                      <div
                        style={{
                          backgroundColor: 'var(--bg-card-subtle)',
                          border: '1px solid var(--border-hairline)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                        }}
                      >
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
                          Academic Interview Scorecard
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Communication:</span>
                            <strong style={{ color: 'var(--brand-emerald)' }}>9 / 10 (Clear)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Subject Conceptual Depth:</span>
                            <strong style={{ color: 'var(--brand-emerald)' }}>High (Verified)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0', borderTop: '1px solid var(--border-hairline)' }}>
                            <span style={{ fontWeight: 700 }}>Government Verification (KYC):</span>
                            <div>ID Type: <strong>{tutor.kycDoc ? tutor.kycDoc.idType : 'N/A'}</strong></div>
                            <div>Full ID Number (Decrypted): <strong style={{ color: 'var(--brand-teal)' }}>{tutor.kycDoc ? tutor.kycDoc.idNumberDecrypted : 'N/A'}</strong></div>

                            {tutor.kycDoc?.idDocUrl && (
                              <a
                                href={tutor.kycDoc.idDocUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  color: 'var(--brand-teal)',
                                  textDecoration: 'underline',
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  marginTop: '0.25rem',
                                }}
                              >
                                👁️ View Secure Uploaded ID Document ↗
                              </a>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleApproveTutor(tutor.id)}
                          className="btn btn-emerald"
                          style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--brand-teal)' }}
                        >
                          <CheckCircle2 size={16} />
                          <span>Approve & Activate Badge</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '20px' }}>
                  <CheckCircle2 size={48} color="var(--brand-teal)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>All Tutor Interviews Cleared!</h3>
                  <p style={{ color: 'var(--text-muted)' }}>No pending tutors in the interview queue.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMMISSION INVOICE */}
          {activeTab === 'INVOICE' && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div className="apple-card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>1st-Month Bureau Fee Invoice</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Issued by SSSAM Academy Gurugram</div>
                  </div>
                  <span className="badge badge-emerald">TUITION CONFIRMED</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Student & Parent:</span>
                    <strong>{leads[2]?.parentName || 'Sanjay Singhania'} ({leads[2]?.locality || 'Sector 54'})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subject / Grade:</span>
                    <strong>{leads[2]?.gradeClass || 'IB Maths HL'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned Tutor:</span>
                    <strong>Rohit Sharma</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-hairline)' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Bureau 50% Placement Fee:</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-blue)' }}>
                      ₹{leads[2]?.commissionAmount?.toLocaleString('en-IN') || '7,500'}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    border: '1.5px solid var(--border-hairline)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    marginBottom: '1.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '140px',
                      height: '140px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-hairline)',
                      borderRadius: '12px',
                      margin: '0 auto 1rem auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-main)',
                    }}
                  >
                    <QrCode size={90} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Scan & Pay via UPI / GPay / PhonePe / Paytm
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    UPI ID: <strong>sssamacademy@okaxis</strong>
                  </div>
                </div>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `*TuitionForHome (SSSAM Academy) - Commission Invoice*\nParent: ${leads[2]?.parentName || 'Sanjay Singhania'}\nGrade: ${leads[2]?.gradeClass || 'IB Maths'}\nAmount: ₹${leads[2]?.commissionAmount || '7,500'}\nUPI ID: sssamacademy@okaxis\nPlease clear within 48 hours to maintain your Verified Tutor Pro Badge.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MessageSquare size={16} />
                  <span>Send WhatsApp Invoice to Tutor</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* UPDATE FOLLOW-UP & MANDATORY NOTE MODAL */}
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
                  Update Lead Follow-up
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
              {/* Status Selector */}
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

              {/* 1-Tap Quick Note Buttons */}
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  ⚡ 1-Tap Quick Note Presets:
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickNote('Parent did not pick call. Call back in 2 hours.', 'CONTACTED')}
                    style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border-hairline)', backgroundColor: '#F8FAFC', cursor: 'pointer', fontWeight: 600 }}
                  >
                    📞 Didn&apos;t pick call
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickNote('Shared 2 shortlisted tutor profiles on WhatsApp.', 'CONTACTED')}
                    style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border-hairline)', backgroundColor: '#F8FAFC', cursor: 'pointer', fontWeight: 600 }}
                  >
                    💬 WhatsApp profiles sent
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickNote('Parent very positive. Agreed for demo trial.', 'INTERESTED')}
                    style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border-hairline)', backgroundColor: '#F8FAFC', cursor: 'pointer', fontWeight: 600 }}
                  >
                    ⭐ High Interest
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickNote('Demo class fixed for tomorrow 5:00 PM.', 'DEMO_SCHEDULED')}
                    style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border-hairline)', backgroundColor: '#F8FAFC', cursor: 'pointer', fontWeight: 600 }}
                  >
                    📅 Demo Fixed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickNote('Parent already hired a local teacher.', 'LOST')}
                    style={{ padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border-hairline)', backgroundColor: '#F8FAFC', cursor: 'pointer', fontWeight: 600 }}
                  >
                    ❌ Lost to competitor
                  </button>
                </div>
              </div>

              {/* Mandatory Note / Remarks */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Follow-up Note / Call Remarks *</span>
                  <span style={{ fontSize: '0.75rem', color: '#EF4444' }}>Mandatory</span>
                </label>
                <textarea
                  rows={3}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="e.g. Spoke with Mrs. Verma. Requested Class 10 Math demo on Saturday 4 PM. Budget ₹9,000 agreed."
                  className="form-control"
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Next Follow-up Reminder */}
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

              {/* Submit Buttons */}
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

      <Footer />
    </div>
  );
}
