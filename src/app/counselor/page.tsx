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
  FileText,
  Grid,
  CalendarClock,
} from 'lucide-react';

import TutorMatchModal from '@/components/TutorMatchModal';
import { VERIFIED_TUTORS, MockTutor } from '@/lib/data';

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
  const [activeTab, setActiveTab] = useState<'LEADS' | 'TUTOR_ALLOCATION' | 'INTERVIEWS' | 'INVOICE'>('LEADS');
  const [dbLoading, setDbLoading] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Active counselor identity
  const [currentOperator, setCurrentOperator] = useState('Counselor Pooja');

  // Selected tutor for lead allocation desk
  const [selectedTutorForLeads, setSelectedTutorForLeads] = useState<MockTutor>(VERIFIED_TUTORS[0]);

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Expanded Timelines Map { leadId: boolean }
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({});

  // Proximity Tutor Matching State
  const [selectedLeadForMatching, setSelectedLeadForMatching] = useState<LeadItem | null>(null);

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
      setNoteError('Follow-up note / remark is mandatory.');
      return;
    }

    const isTerminal = updateStatus === 'LOST' || updateStatus === 'TUITION_CONFIRMED';
    if (!isTerminal && !updateNextFollowup) {
      setNoteError('Please select next follow-up date (use 1-tap Today, Tomorrow, or 3 Days buttons).');
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
          nextFollowupDate: isTerminal ? null : (updateNextFollowup || null),
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

  const handleAssignProximityTutor = async (tutorName: string, tutorId: string, matchNote: string) => {
    if (!selectedLeadForMatching) return;

    try {
      const res = await fetch(`/api/leads/${selectedLeadForMatching.id}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'DEMO_SCHEDULED',
          notes: matchNote,
          performedBy: currentOperator,
          actionType: 'DEMO_FIXED',
        }),
      });

      const updatedActivities = [
        {
          id: `act-${Date.now()}`,
          leadId: selectedLeadForMatching.id,
          actionType: 'DEMO_FIXED',
          description: `[Status: DEMO_SCHEDULED] ${matchNote}`,
          performedBy: currentOperator,
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
    const norm = (status || '').toUpperCase().trim();
    if (norm === 'NEW_LEAD' || norm === 'NEW' || norm === 'PENDING') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.74rem' }}>New Lead</span>;
    }
    if (norm === 'INTERESTED' || norm === 'HIGHLY_INTERESTED') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: 700, fontSize: '0.74rem' }}>Interested</span>;
    }
    if (norm === 'CONTACTED') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#DBEAFE', color: '#1E40AF', fontWeight: 700, fontSize: '0.74rem' }}>Contacted</span>;
    }
    if (norm === 'DEMO_SCHEDULED' || norm === 'DEMO_FIXED' || norm === 'DEMO') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#EDE9FE', color: '#6D28D9', fontWeight: 700, fontSize: '0.74rem' }}>Demo Fixed</span>;
    }
    if (norm === 'TUITION_CONFIRMED' || norm === 'CONVERTED' || norm === 'ADMISSION_CONFIRMED' || norm === 'WON') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#CCFBF1', color: '#0F766E', fontWeight: 700, fontSize: '0.74rem' }}>Converted</span>;
    }
    if (norm === 'LOST' || norm === 'CANCELLED' || norm === 'DROPPED' || norm === 'NOT_INTERESTED') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#FFE4E6', color: '#9F1239', fontWeight: 700, fontSize: '0.74rem' }}>Not Interested</span>;
    }
    return (
      <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#F1F5F9', color: '#334155', fontWeight: 700, fontSize: '0.74rem' }}>
        {status || 'New Lead'}
      </span>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Sleek Top Mini-Header for Portal Status */}
      <header style={{ backgroundColor: '#0F172A', color: '#F8FAFC', padding: '0.65rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', borderBottom: '1px solid #1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38BDF8' }}></span>
          <span style={{ fontWeight: 700, letterSpacing: '0.03em' }}>TuitionForHome • Counselor & Operations Portal</span>
          <span style={{ color: '#64748B' }}>|</span>
          <span style={{ color: '#94A3B8' }}>SSSAM Academy Gurugram</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ color: '#94A3B8' }}>
            Current Desk: <strong style={{ color: '#38BDF8' }}>{currentOperator}</strong>
          </span>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: '#38BDF8', fontWeight: 600, textDecoration: 'none', fontSize: '0.78rem' }}>
            View Public Site ↗
          </a>
        </div>
      </header>

      <main style={{ flex: 1, padding: '1.75rem 2rem 3rem 2rem' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Main Grid: Left Sidebar + Right Content Area */}
          <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '1.75rem', alignItems: 'flex-start' }}>

            {/* LEFT STICKY SIDEBAR */}
            <aside
              style={{
                position: 'sticky',
                top: '90px',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--border-hairline)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* Brand Header */}
              <div>
                <div className="badge badge-emerald" style={{ marginBottom: '0.4rem', fontSize: '0.72rem' }}>
                  <ShieldCheck size={13} />
                  <span>COUNSELOR DESK</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Operations Hub
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Calling & Lead Allocations
                </div>
              </div>

              {/* Active Desk Selector */}
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Operator Desk
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} color="var(--brand-teal)" />
                  <select
                    value={currentOperator}
                    onChange={(e) => setCurrentOperator(e.target.value)}
                    className="form-control form-control-sm"
                    style={{ fontSize: '0.82rem', fontWeight: 700, borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  >
                    <option value="Counselor Pooja">Pooja (Senior Telecaller)</option>
                    <option value="Counselor Amit">Amit (Admission Specialist)</option>
                    <option value="Counselor Rahul">Rahul (Academic Lead)</option>
                    <option value="Admin Team">Admin Team (Super Desk)</option>
                  </select>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', paddingLeft: '0.5rem' }}>
                  Navigation Desk
                </div>

                {/* Nav 1: Shared Leads */}
                <button
                  type="button"
                  onClick={() => setActiveTab('LEADS')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: 'none',
                    outline: 'none',
                    boxShadow: activeTab === 'LEADS' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                    backgroundColor: activeTab === 'LEADS' ? '#6366F1' : 'transparent',
                    color: activeTab === 'LEADS' ? '#FFFFFF' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Phone size={16} color={activeTab === 'LEADS' ? '#FFFFFF' : '#10B981'} />
                    <span>Shared Leads Desk</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '6px',
                      backgroundColor: activeTab === 'LEADS' ? 'rgba(255,255,255,0.25)' : '#DCFCE7',
                      color: activeTab === 'LEADS' ? '#FFFFFF' : '#166534',
                    }}
                  >
                    {leads.length}
                  </span>
                </button>

                {/* Nav 2: Tutor Lead Allocator */}
                <button
                  type="button"
                  onClick={() => setActiveTab('TUTOR_ALLOCATION')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: 'none',
                    outline: 'none',
                    boxShadow: activeTab === 'TUTOR_ALLOCATION' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                    backgroundColor: activeTab === 'TUTOR_ALLOCATION' ? '#6366F1' : 'transparent',
                    color: activeTab === 'TUTOR_ALLOCATION' ? '#FFFFFF' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <MapPin size={16} color={activeTab === 'TUTOR_ALLOCATION' ? '#FFFFFF' : '#F59E0B'} />
                    <span>Tutor Allocator</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '6px',
                      backgroundColor: activeTab === 'TUTOR_ALLOCATION' ? 'rgba(255,255,255,0.25)' : '#FEF3C7',
                      color: activeTab === 'TUTOR_ALLOCATION' ? '#FFFFFF' : '#92400E',
                    }}
                  >
                    {VERIFIED_TUTORS.length}
                  </span>
                </button>

                {/* Nav 3: Tutor Interviews & KYC */}
                <button
                  type="button"
                  onClick={() => setActiveTab('INTERVIEWS')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: 'none',
                    outline: 'none',
                    boxShadow: activeTab === 'INTERVIEWS' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                    backgroundColor: activeTab === 'INTERVIEWS' ? '#6366F1' : 'transparent',
                    color: activeTab === 'INTERVIEWS' ? '#FFFFFF' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <UserCheck size={16} color={activeTab === 'INTERVIEWS' ? '#FFFFFF' : '#6366F1'} />
                    <span>Tutor Interviews</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '6px',
                      backgroundColor: activeTab === 'INTERVIEWS' ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                      color: activeTab === 'INTERVIEWS' ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {pendingTutors.length}
                  </span>
                </button>

                {/* Nav 4: Commission Generator */}
                <button
                  type="button"
                  onClick={() => setActiveTab('INVOICE')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: 'none',
                    outline: 'none',
                    boxShadow: activeTab === 'INVOICE' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                    backgroundColor: activeTab === 'INVOICE' ? '#6366F1' : 'transparent',
                    color: activeTab === 'INVOICE' ? '#FFFFFF' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <QrCode size={16} color={activeTab === 'INVOICE' ? '#FFFFFF' : '#10B981'} />
                    <span>Commission Generator</span>
                  </div>
                </button>
              </nav>
            </aside>

            {/* RIGHT MAIN CONTENT VIEWPORT */}
            <section style={{ minWidth: 0 }}>
              {/* Dynamic Header */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {activeTab === 'LEADS' && 'Shared Lead Follow-up & Matchmaking Desk'}
                    {activeTab === 'TUTOR_ALLOCATION' && 'Proximity Student Lead Allocator by Tutor'}
                    {activeTab === 'INTERVIEWS' && 'Tutor Screening & Video Evaluation'}
                    {activeTab === 'INVOICE' && 'Tuition Confirmation & Placement Fee Generator'}
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                    {activeTab === 'LEADS' && '8 operational filters with live counts, mandatory remarks, and double-call timeline.'}
                    {activeTab === 'TUTOR_ALLOCATION' && 'Match and dispatch nearby student inquiries based on tutor travel radius.'}
                    {activeTab === 'INTERVIEWS' && 'Review KYC documents, conduct subject interviews, and activate verified educator badge.'}
                    {activeTab === 'INVOICE' && 'Generate 50% 1st-month placement fee invoice with instant UPI QR code.'}
                  </p>
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

                {/* Filter Pills (Matching User's Reference Palette) */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {[
                    { id: 'ALL', label: 'All', count: filterCounts.ALL, icon: <Grid size={12} />, bg: '#283344', text: '#FFFFFF', countBg: 'rgba(255,255,255,0.2)', border: '#1E293B' },
                    { id: 'TODAY', label: 'Today', count: filterCounts.TODAY, icon: <CalendarClock size={12} />, bg: '#EA580C', text: '#FFFFFF', countBg: 'rgba(0,0,0,0.18)', border: '#C2410C' },
                    { id: 'OVERDUE', label: 'Pending', count: filterCounts.OVERDUE, icon: <Clock size={12} />, bg: '#D97706', text: '#FFFFFF', countBg: 'rgba(0,0,0,0.18)', border: '#B45309' },
                    { id: 'NEW_LEAD', label: 'New', count: filterCounts.NEW_LEAD, bg: '#F1F5F9', text: '#334155', countBg: '#E2E8F0', border: '#CBD5E1' },
                    { id: 'CONTACTED', label: 'Contacted', count: filterCounts.CONTACTED, bg: '#FEF9C3', text: '#854D0E', countBg: '#FDE047', border: '#FACC15' },
                    { id: 'INTERESTED', label: 'Interested', count: filterCounts.INTERESTED, bg: '#ECFCCB', text: '#3F6212', countBg: '#D9F99D', border: '#BEF264' },
                    { id: 'DEMO_SCHEDULED', label: 'Demo Fixed', count: filterCounts.DEMO_SCHEDULED, bg: '#EDE9FE', text: '#6D28D9', countBg: '#DDD6FE', border: '#C4B5FD' },
                    { id: 'LOST', label: 'Not Interested', count: filterCounts.LOST, bg: '#FFE4E6', text: '#9F1239', countBg: '#FECDD3', border: '#FDA4AF' },
                  ].map((tab) => {
                    const isActive = activeFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFilter(tab.id)}
                        style={{
                          padding: '0.32rem 0.7rem',
                          borderRadius: '8px',
                          border: `1px solid ${isActive ? '#38BDF8' : tab.border}`,
                          backgroundColor: tab.bg,
                          color: tab.text,
                          boxShadow: isActive ? '0 0 0 2px #38BDF8, 0 2px 8px rgba(0,0,0,0.12)' : '0 1px 2px rgba(0,0,0,0.04)',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease',
                          lineHeight: 1.2,
                          opacity: isActive ? 1 : 0.92,
                        }}
                      >
                        {tab.icon && <span>{tab.icon}</span>}
                        <span>{tab.label}</span>
                        <span
                          style={{
                            padding: '1px 6px',
                            borderRadius: '999px',
                            backgroundColor: tab.countBg,
                            color: tab.text,
                            fontSize: '0.68rem',
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

          {/* TAB 2: TUTOR LEAD ALLOCATOR (MATCH NEARBY STUDENTS PER TUTOR) */}
          {activeTab === 'TUTOR_ALLOCATION' && (
            <div>
              {/* Top Banner */}
              <div className="apple-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>
                      <MapPin size={13} />
                      <span>PROXIMITY STUDENT ALLOCATION DESK</span>
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      Assign Nearby Parent Leads by Tutor
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                      Select a verified educator to view all nearby parent inquiries matching their subjects and travel radius.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tutor Selector & Matched Leads Container */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
                {/* Left: Tutors List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Select Verified Tutor ({VERIFIED_TUTORS.length})
                  </div>

                  {VERIFIED_TUTORS.map((tut) => {
                    const isSelected = selectedTutorForLeads.id === tut.id;
                    // Count matching open leads for this tutor
                    const matchingLeadsCount = leads.filter((l) => {
                      const subjects = l.subjectsNeeded || '';
                      const matchesSubject = tut.subjects.some((s) => subjects.toLowerCase().includes(s.toLowerCase()));
                      return matchesSubject && l.status !== 'TUITION_CONFIRMED' && l.status !== 'LOST';
                    }).length;

                    return (
                      <div
                        key={tut.id}
                        onClick={() => setSelectedTutorForLeads(tut)}
                        style={{
                          padding: '1.15rem',
                          borderRadius: '16px',
                          backgroundColor: isSelected ? 'var(--brand-blue-light)' : '#FFFFFF',
                          border: `2px solid ${isSelected ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tut.avatarUrl}
                          alt={tut.name}
                          style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{tut.name}</h4>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706' }}>⭐ {tut.rating}</span>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--brand-teal)', fontWeight: 700, marginTop: '2px' }}>
                            {tut.highestDegree} • {tut.experienceYears} Yrs Exp
                          </div>

                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            📍 {tut.serviceAreas.slice(0, 2).join(', ')} (Radius: {tut.travelRadiusKm} KM)
                          </div>
                        </div>

                        <span
                          className="badge"
                          style={{
                            backgroundColor: matchingLeadsCount > 0 ? '#DCFCE7' : '#F1F5F9',
                            color: matchingLeadsCount > 0 ? '#166534' : '#64748B',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                          }}
                        >
                          {matchingLeadsCount} Leads
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Available Student Leads for Selected Tutor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Selected Tutor Spotlight Banner */}
                  <div className="apple-card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-hairline)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedTutorForLeads.avatarUrl}
                          alt={selectedTutorForLeads.name}
                          style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover' }}
                        />
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                            {selectedTutorForLeads.name}
                          </h3>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Base: <strong>{selectedTutorForLeads.serviceAreas[0]}</strong> • Travel Radius: <strong>{selectedTutorForLeads.travelRadiusKm} KM</strong> • Home Rate: <strong style={{ color: 'var(--brand-blue)' }}>₹{selectedTutorForLeads.hourlyRateHome}/hr</strong>
                          </div>
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Hello ${selectedTutorForLeads.name}, this is SSSAM Academy / TuitionForHome Counselor desk regarding active student leads in your sector.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ borderColor: '#25D366', color: '#15803D' }}
                      >
                        <MessageSquare size={14} color="#25D366" />
                        <span>Chat with Tutor</span>
                      </a>
                    </div>
                  </div>

                  {/* Nearby Open Parent Leads List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Available Student Leads for {selectedTutorForLeads.name}
                    </div>

                    {leads
                      .filter((l) => l.status !== 'TUITION_CONFIRMED' && l.status !== 'LOST')
                      .map((lead) => {
                        const subjects = Array.isArray(lead.subjectsNeeded)
                          ? lead.subjectsNeeded.join(', ')
                          : lead.subjectsNeeded.replace(/[\[\]"]/g, '');

                        const matchesSubject = selectedTutorForLeads.subjects.some((s) => subjects.toLowerCase().includes(s.toLowerCase()));

                        // Calculate distance from this tutor's service areas
                        const normLeadLoc = lead.locality.toLowerCase();
                        let estDist = 5.2;
                        for (const area of selectedTutorForLeads.serviceAreas) {
                          if (normLeadLoc.includes(area.toLowerCase()) || area.toLowerCase().includes(normLeadLoc)) {
                            estDist = 1.2;
                            break;
                          }
                        }
                        if (estDist > 2.0 && (normLeadLoc.includes('dlf') || normLeadLoc.includes('golf course'))) {
                          estDist = 2.4;
                        }

                        const isWithinRadius = estDist <= selectedTutorForLeads.travelRadiusKm;

                        return (
                          <div
                            key={lead.id}
                            className="apple-card"
                            style={{
                              padding: '1.25rem',
                              backgroundColor: '#FFFFFF',
                              borderLeft: `4px solid ${matchesSubject && isWithinRadius ? 'var(--brand-emerald)' : 'var(--border-hairline)'}`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>{lead.parentName}</h4>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>[{lead.id}]</span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                  📍 <strong>{lead.locality}</strong> • {lead.gradeClass} ({subjects}) • Budget: <strong style={{ color: 'var(--brand-blue)' }}>₹{lead.budgetMonthly?.toLocaleString('en-IN') || 'Negotiable'}</strong>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: isWithinRadius ? '#DCFCE7' : '#FEF3C7',
                                    color: isWithinRadius ? '#166534' : '#92400E',
                                    fontWeight: 800,
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  ~{estDist} KM AWAY
                                </span>
                                {getStatusBadge(lead.status)}
                              </div>
                            </div>

                            {/* Action Buttons for Counselor */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-hairline)' }}>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <a
                                  href={`https://wa.me/?text=${encodeURIComponent(
                                    `*TuitionForHome (SSSAM Academy) - Student Lead Offer*\n\n` +
                                    `Hello ${selectedTutorForLeads.name},\n` +
                                    `We have an immediate student inquiry in *${lead.locality}* (~${estDist} KM from your sector):\n` +
                                    `👤 *Student/Parent:* ${lead.parentName}\n` +
                                    `📚 *Class & Subject:* ${lead.gradeClass} (${subjects})\n` +
                                    `🎯 *Mode:* ${lead.preferredMode === 'OFFLINE_HOME' ? 'Home Visit' : 'Online Live'}\n` +
                                    `💰 *Parent Budget:* ₹${lead.budgetMonthly || 8000}/month\n\n` +
                                    `Please confirm if you are available to take this trial class.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-secondary btn-sm"
                                  style={{ borderColor: '#25D366', color: '#15803D', fontSize: '0.78rem' }}
                                >
                                  <MessageSquare size={13} color="#25D366" />
                                  <span>Dispatch to Tutor (WhatsApp)</span>
                                </a>

                                <a href={`tel:${lead.parentPhone}`} className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem' }}>
                                  <Phone size={13} color="var(--brand-emerald)" />
                                  <span>Call Parent</span>
                                </a>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLeadForMatching(lead);
                                }}
                                className="btn btn-primary btn-sm"
                                style={{ backgroundColor: 'var(--brand-blue)', fontSize: '0.78rem' }}
                              >
                                <CheckCircle2 size={13} />
                                <span>Assign to this Tutor</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TUTOR INTERVIEWS */}
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
            </section>
          </div>
        </div>
      </main>

      {/* COMPACT & CLEAN UPDATE FOLLOW-UP MODAL (COUNSELOR) */}
      {selectedLeadForUpdate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              backgroundColor: '#FFFFFF',
              padding: '1.25rem 1.5rem',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
              border: '1px solid #E2E8F0',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  Update Follow-up
                </h3>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>
                  Student: <strong>{selectedLeadForUpdate.parentName}</strong> ({selectedLeadForUpdate.locality})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadForUpdate(null)}
                style={{ border: 'none', background: '#F1F5F9', borderRadius: '6px', width: '26px', height: '26px', fontSize: '0.9rem', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFollowup} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {/* Status Selector */}
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Lead Status
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="form-control"
                  style={{ fontWeight: 600, fontSize: '0.82rem', padding: '0.42rem 0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                >
                  <option value="CONTACTED">Contacted</option>
                  <option value="INTERESTED">Interested</option>
                  <option value="DEMO_SCHEDULED">Demo Fixed</option>
                  <option value="LOST">Not Interested</option>
                </select>
              </div>

              {/* Notes / Remarks */}
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Notes / Remarks <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <textarea
                  rows={2}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="e.g. Spoke to parent, requested weekend demo..."
                  className="form-control"
                  style={{ fontSize: '0.82rem', padding: '0.42rem 0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1', resize: 'vertical' }}
                  required
                />
              </div>

              {/* Next Follow-up Reminder with Quick Buttons below Date */}
              {updateStatus === 'LOST' || updateStatus === 'TUITION_CONFIRMED' ? (
                <div style={{ padding: '0.45rem 0.7rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1', fontSize: '0.74rem', color: '#64748B' }}>
                  ✓ No follow-up required for {updateStatus === 'LOST' ? 'Not Interested' : 'Converted'}
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                    Next Follow-up Date <span style={{ color: '#DC2626' }}>*</span>
                  </label>

                  {/* Custom Date Selector */}
                  <input
                    type="date"
                    value={updateNextFollowup ? updateNextFollowup.split('T')[0] : ''}
                    onChange={(e) => setUpdateNextFollowup(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', width: '100%' }}
                    required
                  />

                  {/* Quick 1-Tap Pickers directly below the input */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem', marginTop: '0.35rem' }}>
                    {[
                      { label: '⚡ Today', days: 0 },
                      { label: '⚡ Tomorrow', days: 1 },
                      { label: '⚡ In 3 Days', days: 3 },
                    ].map((preset) => {
                      const targetD = new Date(Date.now() + preset.days * 86400000).toISOString().split('T')[0];
                      const isSelected = updateNextFollowup.startsWith(targetD);
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setUpdateNextFollowup(targetD)}
                          style={{
                            padding: '0.28rem 0.35rem',
                            borderRadius: '6px',
                            border: `1px solid ${isSelected ? '#6366F1' : '#E2E8F0'}`,
                            backgroundColor: isSelected ? '#EEF2FF' : '#F8FAFC',
                            color: isSelected ? '#4F46E5' : '#475569',
                            fontSize: '0.72rem',
                            fontWeight: isSelected ? 800 : 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            textAlign: 'center',
                          }}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {noteError && (
                <div style={{ padding: '0.42rem 0.7rem', borderRadius: '6px', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700 }}>
                  ⚠️ {noteError}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem', paddingTop: '0.65rem', borderTop: '1px solid #F1F5F9' }}>
                <button
                  type="button"
                  onClick={() => setSelectedLeadForUpdate(null)}
                  style={{
                    padding: '0.38rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  disabled={noteSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={noteSubmitting}
                  style={{
                    padding: '0.38rem 0.95rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#6366F1',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <Send size={13} />
                  <span>{noteSubmitting ? 'Saving...' : 'Save Update'}</span>
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
          currentOperator={currentOperator}
          onClose={() => setSelectedLeadForMatching(null)}
          onAssignTutor={(tutorName, tutorId, notes) => handleAssignProximityTutor(tutorName, tutorId, notes)}
        />
      )}
    </div>
  );
}
