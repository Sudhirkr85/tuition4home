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
  GraduationCap,
  Users,
  RotateCcw,
  Eye,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Check,
  BookOpen,
} from 'lucide-react';

import TutorMatchModal from '@/components/TutorMatchModal';
import { VERIFIED_TUTORS, MockTutor, SSSAM_OFFICE_DETAILS } from '@/lib/data';

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
  const [activeTab, setActiveTab] = useState<'LEADS' | 'TUTOR_ALLOCATION' | 'PARENTS' | 'COORDINATION'>('LEADS');
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Active counselor identity
  const [currentOperator, setCurrentOperator] = useState('Counselor Pooja');

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

  // 1,000+ Scalable Tutor Directory State
  const [tutorSearch, setTutorSearch] = useState('');
  const [tutorSubjectFilter, setTutorSubjectFilter] = useState('ALL');
  const [tutorLocalityFilter, setTutorLocalityFilter] = useState('ALL');
  const [tutorCurrentPage, setTutorCurrentPage] = useState(1);
  const [tutorsPerPage, setTutorsPerPage] = useState(10);
  const [activeTutor360, setActiveTutor360] = useState<MockTutor | null>(null);
  const [activeTutor360Tab, setActiveTutor360Tab] = useState<'LEADS' | 'VIDEO_KYC' | 'NOTES'>('LEADS');

  // Parent & Student Master Directory State
  const [parentSearchText, setParentSearchText] = useState('');
  const [parentGradeFilter, setParentGradeFilter] = useState<string>('ALL');
  const [parentStatusFilter, setParentStatusFilter] = useState<'ALL' | 'ACTIVE_TUITION' | 'DEMO_DUE' | 'ENQUIRY_OPEN'>('ALL');
  const [parentCurrentPage, setParentCurrentPage] = useState(1);
  const [parentsPerPage, setParentsPerPage] = useState(10);
  const [activeParent360, setActiveParent360] = useState<LeadItem | null>(null);
  const [activeParent360Tab, setActiveParent360Tab] = useState<'OVERVIEW' | 'TUTOR' | 'NOTES'>('OVERVIEW');
  const [parentFollowUpNotes, setParentFollowUpNotes] = useState<{ [leadId: string]: { id: string; text: string; date: string; author: string }[] }>({
    'LD-101': [
      { id: 'pn-1', text: 'Parent requested Maths classes Mon, Wed, Fri 5:00 PM. Rohit Sharma assigned.', date: 'Today, 10:30 AM', author: 'Counselor Pooja' },
    ],
  });
  const [newParentNoteText, setNewParentNoteText] = useState('');

  // Coordination Desk State
  const [coordSearch, setCoordSearch] = useState('');
  const [coordMilestoneFilter, setCoordMilestoneFilter] = useState<'ALL' | '1ST_SESSION_PENDING' | '1ST_SESSION_DONE' | 'REPLACE_REQ'>('ALL');
  const [coordCurrentPage, setCoordCurrentPage] = useState(1);
  const [coordPerPage, setCoordPerPage] = useState(6);
  const [leadCoordMilestones, setLeadCoordMilestones] = useState<{ [leadId: string]: string }>({
    'LD-101': '1ST_SESSION_PENDING',
    'LD-102': '1ST_SESSION_DONE',
    'LD-104': '1ST_SESSION_DONE',
  });

  // Direct Assignment Confirmation Modal State
  const [directAssignModal, setDirectAssignModal] = useState<{
    isOpen: boolean;
    lead: LeadItem | null;
    tutor: MockTutor | null;
  }>({
    isOpen: false,
    lead: null,
    tutor: null,
  });

  // Centered Alert/Toast Modal State
  const [counselorToast, setCounselorToast] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
  } | null>(null);

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

  useEffect(() => {
    fetchLeads();
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

  const handleConfirmDirectAssignment = async () => {
    const { lead, tutor } = directAssignModal;
    if (!lead || !tutor) return;

    try {
      const res = await fetch('/api/counselor/leads/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          tutorId: tutor.id,
          tutorName: tutor.name,
          assignedBy: currentOperator,
          matchNote: `Direct assignment via Counselor Portal by ${currentOperator}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === lead.id
              ? {
                  ...l,
                  assignedTutor: tutor.name,
                  status: 'DEMO_SCHEDULED',
                  updatedAt: new Date().toISOString(),
                  activities: [
                    {
                      id: `act-${Date.now()}`,
                      leadId: lead.id,
                      actionType: 'TUTOR_ASSIGNED',
                      description: `Assigned verified educator ${tutor.name} (${tutor.highestDegree}) for ${lead.gradeClass}`,
                      performedBy: currentOperator,
                      createdAt: new Date().toISOString(),
                    },
                    ...(l.activities || []),
                  ],
                }
              : l
          )
        );

        setDirectAssignModal({ isOpen: false, lead: null, tutor: null });
        setCounselorToast({
          isOpen: true,
          title: 'Educator Assigned Successfully',
          message: `🎉 ${tutor.name} has been assigned to ${lead.parentName}. Status updated to Demo Scheduled.`,
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Failed to assign educator:', err);
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Top Header */}
      <header style={{ backgroundColor: '#0F172A', color: '#F8FAFC', padding: '0.65rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', borderBottom: '1px solid #1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38BDF8' }}></span>
          <span style={{ fontWeight: 700, letterSpacing: '0.03em' }}>TuitionForHome • Counselor Calling &amp; Allocation Desk</span>
          <span style={{ color: '#64748B' }}>|</span>
          <span style={{ color: '#94A3B8' }}>SSSAM Academy Gurugram</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ color: '#94A3B8' }}>
            Current Desk: <strong style={{ color: '#38BDF8' }}>{currentOperator}</strong>
          </span>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: '#38BDF8', fontWeight: 600, textDecoration: 'none', fontSize: '0.78rem' }}>
            Public Site ↗
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
                  <span>COUNSELOR WORKSTATION</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Operations Hub
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Calling &amp; Allocation Suite
                </div>
              </div>

              {/* Active Operator Switcher */}
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Active Counselor Desk
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} color="var(--brand-teal)" />
                  <select
                    value={currentOperator}
                    onChange={(e) => setCurrentOperator(e.target.value)}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      fontSize: '0.84rem',
                      outline: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <option value="Counselor Pooja">Pooja (Sr. Counselor)</option>
                    <option value="Counselor Amit">Amit (Admission Desk)</option>
                    <option value="Counselor Sneha">Sneha (Parent Relations)</option>
                    <option value="Counselor Rahul">Rahul (Tutor Dispatch)</option>
                  </select>
                </div>
              </div>

              {/* Navigation Menu (4 Pure Operational Desks) */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', paddingLeft: '0.5rem' }}>
                  Operational Desks
                </div>

                {/* Nav 1: Calling Lead Desk */}
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
                    boxShadow: activeTab === 'LEADS' ? '0 4px 12px rgba(14, 165, 233, 0.25)' : 'none',
                    backgroundColor: activeTab === 'LEADS' ? '#0EA5E9' : 'transparent',
                    color: activeTab === 'LEADS' ? '#FFFFFF' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Phone size={16} color={activeTab === 'LEADS' ? '#FFFFFF' : '#0EA5E9'} />
                    <span>Calling Lead Desk</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '6px',
                      backgroundColor: activeTab === 'LEADS' ? 'rgba(255,255,255,0.25)' : '#E0F2FE',
                      color: activeTab === 'LEADS' ? '#FFFFFF' : '#0369A1',
                    }}
                  >
                    {leads.length}
                  </span>
                </button>

                {/* Nav 2: Tutor Allocator */}
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
                    boxShadow: activeTab === 'TUTOR_ALLOCATION' ? '0 4px 12px rgba(245, 158, 11, 0.25)' : 'none',
                    backgroundColor: activeTab === 'TUTOR_ALLOCATION' ? '#F59E0B' : 'transparent',
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

                {/* Nav 3: Parent Directory */}
                <button
                  type="button"
                  onClick={() => setActiveTab('PARENTS')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: 'none',
                    outline: 'none',
                    boxShadow: activeTab === 'PARENTS' ? '0 4px 12px rgba(14, 165, 233, 0.25)' : 'none',
                    backgroundColor: activeTab === 'PARENTS' ? '#0EA5E9' : 'transparent',
                    color: activeTab === 'PARENTS' ? '#FFFFFF' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <GraduationCap size={16} color={activeTab === 'PARENTS' ? '#FFFFFF' : '#0EA5E9'} />
                    <span>Parent Directory</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '6px',
                      backgroundColor: activeTab === 'PARENTS' ? 'rgba(255,255,255,0.25)' : '#E0F2FE',
                      color: activeTab === 'PARENTS' ? '#FFFFFF' : '#0369A1',
                    }}
                  >
                    {leads.length}
                  </span>
                </button>

                {/* Nav 4: Coordination Desk */}
                <button
                  type="button"
                  onClick={() => setActiveTab('COORDINATION')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: 'none',
                    outline: 'none',
                    boxShadow: activeTab === 'COORDINATION' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                    backgroundColor: activeTab === 'COORDINATION' ? '#6366F1' : 'transparent',
                    color: activeTab === 'COORDINATION' ? '#FFFFFF' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Users size={16} color={activeTab === 'COORDINATION' ? '#FFFFFF' : '#6366F1'} />
                    <span>Coordination</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '6px',
                      backgroundColor: activeTab === 'COORDINATION' ? 'rgba(255,255,255,0.25)' : '#E0F2FE',
                      color: activeTab === 'COORDINATION' ? '#FFFFFF' : '#0369A1',
                    }}
                  >
                    {leads.filter(l => Boolean(l.assignedTutor) || l.status === 'DEMO_SCHEDULED' || l.status === 'TUITION_CONFIRMED').length}
                  </span>
                </button>
              </nav>

              {/* Quick Daily Target Summary */}
              <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Daily Calling Target
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Today's Due:</span>
                    <strong style={{ color: '#0F172A' }}>{filterCounts.TODAY} Calls</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Overdue:</span>
                    <strong style={{ color: '#DC2626' }}>{filterCounts.OVERDUE} Calls</strong>
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT MAIN CONTENT VIEWPORT */}
            <section style={{ minWidth: 0 }}>
              {/* Dynamic Header */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {activeTab === 'LEADS' && 'Calling Lead Desk & Parent CRM'}
                  {activeTab === 'TUTOR_ALLOCATION' && 'Tutor Directory & Lead Allocator'}
                  {activeTab === 'PARENTS' && 'Parent & Student Master Directory'}
                  {activeTab === 'COORDINATION' && 'Tutor-Parent Coordination Desk'}
                </h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                  {activeTab === 'LEADS' && 'Follow up on fresh parent inquiries, log mandatory call remarks, and match tutors.'}
                  {activeTab === 'TUTOR_ALLOCATION' && 'Search 1,000+ verified educators, inspect intro videos, and assign to nearby students.'}
                  {activeTab === 'PARENTS' && 'Filter and inspect registered parents, child grade levels, and assigned teachers.'}
                  {activeTab === 'COORDINATION' && '3-way WhatsApp introductions and 1st session milestone management.'}
                </p>
              </div>

              {/* 4 Operational Summary Counters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="apple-card" style={{ padding: '1rem 1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>TODAY'S CALLS DUE</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{filterCounts.TODAY}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Scheduled follow-ups</div>
                </div>

                <div className="apple-card" style={{ padding: '1rem 1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #FDE68A' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>DEMOS SCHEDULED</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>{filterCounts.DEMO_SCHEDULED}</div>
                  <div style={{ fontSize: '0.72rem', color: '#92400E' }}>Awaiting 1st trial session</div>
                </div>

                <div className="apple-card" style={{ padding: '1rem 1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #DCFCE7' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>ACTIVE TUITIONS</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803D', marginTop: '2px' }}>{filterCounts.TUITION_CONFIRMED}</div>
                  <div style={{ fontSize: '0.72rem', color: '#166534' }}>Ongoing running classes</div>
                </div>

                <div className="apple-card" style={{ padding: '1rem 1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E0F2FE' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>VERIFIED EDUCATORS</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>{VERIFIED_TUTORS.length}</div>
                  <div style={{ fontSize: '0.72rem', color: '#0369A1' }}>Ready for dispatch</div>
                </div>
              </div>

              {/* TAB 1: CALLING LEAD DESK */}
              {activeTab === 'LEADS' && (
                <div>
                  {/* Search & Filter Toolbar */}
                  <div className="apple-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Search lead by parent name, phone, locality, subject, or class..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control"
                        style={{ paddingLeft: '2.4rem', borderRadius: '10px', backgroundColor: '#F8FAFC', fontSize: '0.86rem', border: '1px solid var(--border-hairline)' }}
                      />
                    </div>

                    {/* Status Filter Pills */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {[
                        { id: 'ALL', label: 'All Leads', count: filterCounts.ALL },
                        { id: 'NEW_LEAD', label: '🟡 New Leads', count: filterCounts.NEW_LEAD },
                        { id: 'TODAY', label: '📅 Today Due', count: filterCounts.TODAY },
                        { id: 'OVERDUE', label: '⚠️ Overdue', count: filterCounts.OVERDUE },
                        { id: 'INTERESTED', label: '🔥 Interested', count: filterCounts.INTERESTED },
                        { id: 'CONTACTED', label: '📞 Contacted', count: filterCounts.CONTACTED },
                        { id: 'DEMO_SCHEDULED', label: '⏳ Demo Fixed', count: filterCounts.DEMO_SCHEDULED },
                        { id: 'TUITION_CONFIRMED', label: '✓ Confirmed', count: filterCounts.TUITION_CONFIRMED },
                      ].map((pill) => {
                        const isActive = activeFilter === pill.id;
                        return (
                          <button
                            key={pill.id}
                            type="button"
                            onClick={() => setActiveFilter(pill.id)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              border: `1.5px solid ${isActive ? '#0F172A' : '#E2E8F0'}`,
                              backgroundColor: isActive ? '#0F172A' : '#FFFFFF',
                              color: isActive ? '#FFFFFF' : '#334155',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            <span>{pill.label}</span>
                            <span
                              style={{
                                padding: '1px 6px',
                                borderRadius: '10px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                                color: isActive ? '#FFFFFF' : '#64748B',
                              }}
                            >
                              {pill.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Leads List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {filteredLeads.length === 0 ? (
                      <div className="apple-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748B', backgroundColor: '#FFFFFF', borderRadius: '16px' }}>
                        No leads found matching current filter.
                      </div>
                    ) : (
                      filteredLeads.map((lead) => {
                        const subjects = Array.isArray(lead.subjectsNeeded)
                          ? lead.subjectsNeeded.join(', ')
                          : (lead.subjectsNeeded || '').replace(/[\[\]"]/g, '');

                        return (
                          <div
                            key={lead.id}
                            className="apple-card"
                            style={{
                              padding: '1.25rem',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '16px',
                              border: '1px solid #E2E8F0',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                    {lead.parentName}
                                  </h3>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', backgroundColor: lead.status === 'TUITION_CONFIRMED' ? '#DCFCE7' : '#FEF3C7', color: lead.status === 'TUITION_CONFIRMED' ? '#166534' : '#92400E' }}>
                                    {lead.status.replace(/_/g, ' ')}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '3px' }}>
                                  📚 <strong>{lead.gradeClass}</strong> ({subjects}) • 📍 {lead.locality}
                                </div>
                              </div>

                              {/* Lead Action Buttons */}
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <a
                                  href={`tel:${lead.parentPhone}`}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#F8FAFC',
                                    border: '1px solid #CBD5E1',
                                    color: '#0F172A',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                  }}
                                >
                                  <Phone size={13} color="#0284C7" />
                                  <span>{lead.parentPhone}</span>
                                </a>

                                <a
                                  href={`https://wa.me/?text=${encodeURIComponent(
                                    `Namaste ${lead.parentName},\n` +
                                    `This is ${currentOperator} from SSSAM Academy regarding your home tuition requirement for ${lead.gradeClass} (${subjects}) in ${lead.locality}.\n\n` +
                                    `When is a good time for a quick 2-minute call?`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#F0FDF4',
                                    border: '1px solid #86EFAC',
                                    color: '#15803D',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                  }}
                                >
                                  <MessageSquare size={13} color="#15803D" />
                                  <span>WhatsApp</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => openUpdateModal(lead)}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#0F172A',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                  }}
                                >
                                  <Clock size={13} />
                                  <span>Log Follow-up</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSelectedLeadForMatching(lead)}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#0284C7',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
                                  }}
                                >
                                  <MapPin size={13} />
                                  <span>Match Tutor</span>
                                </button>
                              </div>
                            </div>

                            {/* Assigned Tutor Status Strip */}
                            {lead.assignedTutor && (
                              <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#F0F9FF', borderRadius: '8px', border: '1px solid #BAE6FD', fontSize: '0.78rem', color: '#0369A1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>👨‍🏫 Assigned Educator: <strong>{lead.assignedTutor}</strong></span>
                                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                  {new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: TUTOR ALLOCATION (1,000+ CAPACITY TABLE VIEW) */}
              {activeTab === 'TUTOR_ALLOCATION' && (() => {
                const filteredTutors = VERIFIED_TUTORS.filter((tut) => {
                  if (tutorSubjectFilter !== 'ALL' && !tut.subjects.some((s) => s.toLowerCase().includes(tutorSubjectFilter.toLowerCase()))) return false;
                  if (tutorLocalityFilter !== 'ALL' && !tut.serviceAreas.some((a) => a.toLowerCase().includes(tutorLocalityFilter.toLowerCase()))) return false;

                  if (tutorSearch.trim()) {
                    const q = tutorSearch.toLowerCase();
                    const matches =
                      tut.name.toLowerCase().includes(q) ||
                      tut.highestDegree.toLowerCase().includes(q) ||
                      tut.subjects.some((s) => s.toLowerCase().includes(q)) ||
                      tut.serviceAreas.some((a) => a.toLowerCase().includes(q));
                    if (!matches) return false;
                  }
                  return true;
                });

                const totalTutorPages = Math.ceil(filteredTutors.length / tutorsPerPage) || 1;
                const tutorStartIndex = (tutorCurrentPage - 1) * tutorsPerPage;
                const tutorEndIndex = Math.min(tutorStartIndex + tutorsPerPage, filteredTutors.length);
                const paginatedTutors = filteredTutors.slice(tutorStartIndex, tutorEndIndex);

                return (
                  <div>
                    {/* Filter Toolbar */}
                    <div className="apple-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
                          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            type="text"
                            placeholder="Search tutors by name, qualification, subject, or sector..."
                            value={tutorSearch}
                            onChange={(e) => {
                              setTutorSearch(e.target.value);
                              setTutorCurrentPage(1);
                            }}
                            className="form-control"
                            style={{ paddingLeft: '2.4rem', borderRadius: '10px', backgroundColor: '#F8FAFC', fontSize: '0.86rem', border: '1px solid var(--border-hairline)' }}
                          />
                        </div>

                        <div style={{ minWidth: '180px' }}>
                          <select
                            value={tutorSubjectFilter}
                            onChange={(e) => {
                              setTutorSubjectFilter(e.target.value);
                              setTutorCurrentPage(1);
                            }}
                            className="form-control"
                            style={{ borderRadius: '10px', backgroundColor: '#F8FAFC', fontSize: '0.86rem', border: '1px solid var(--border-hairline)' }}
                          >
                            <option value="ALL">All Subjects</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology / NEET</option>
                            <option value="Coding">Coding &amp; AI</option>
                            <option value="Commerce">Commerce &amp; Accounts</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Tutor Table View */}
                    <div className="desktop-only-table apple-card" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid var(--border-hairline)', marginBottom: '1.25rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Tutor &amp; Degree</th>
                            <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Subjects</th>
                            <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Service Areas</th>
                            <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Experience &amp; Rating</th>
                            <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedTutors.map((tut) => (
                            <tr
                              key={tut.id}
                              style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
                              onClick={() => {
                                setActiveTutor360(tut);
                                setActiveTutor360Tab('LEADS');
                              }}
                            >
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>{tut.name}</div>
                                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>🎓 {tut.highestDegree}</div>
                              </td>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontWeight: 700, color: '#0284C7' }}>{tut.subjects.join(', ')}</div>
                              </td>
                              <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#334155' }}>
                                📍 {tut.serviceAreas.join(', ')} ({tut.travelRadiusKm} km radius)
                              </td>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontWeight: 700, color: '#0F172A' }}>{tut.experienceYears} yrs exp</div>
                                <div style={{ fontSize: '0.72rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  <Star size={11} fill="#D97706" /> {tut.rating} rating
                                </div>
                              </td>
                              <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTutor360(tut);
                                    setActiveTutor360Tab('LEADS');
                                  }}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#0F172A',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                  }}
                                >
                                  <Eye size={12} />
                                  <span>Tutor 360°</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 3: PARENT DIRECTORY */}
              {activeTab === 'PARENTS' && (() => {
                const filteredParents = leads.filter((lead) => {
                  if (parentStatusFilter === 'ACTIVE_TUITION' && lead.status !== 'TUITION_CONFIRMED') return false;
                  if (parentStatusFilter === 'DEMO_DUE' && lead.status !== 'DEMO_SCHEDULED') return false;
                  if (parentStatusFilter === 'ENQUIRY_OPEN' && (lead.status === 'TUITION_CONFIRMED' || lead.status === 'DEMO_SCHEDULED')) return false;

                  if (parentGradeFilter !== 'ALL') {
                    const g = (lead.gradeClass || '').toLowerCase();
                    if (parentGradeFilter === 'CLASS_1_5' && !g.match(/class\s*[1-5]|grade\s*[1-5]|kg|primary/i)) return false;
                    if (parentGradeFilter === 'CLASS_6_8' && !g.match(/class\s*[6-8]|grade\s*[6-8]|middle/i)) return false;
                    if (parentGradeFilter === 'CLASS_9_10' && !g.match(/class\s*(9|10)|grade\s*(9|10)|10th|9th/i)) return false;
                    if (parentGradeFilter === 'CLASS_11_12' && !g.match(/class\s*(11|12)|grade\s*(11|12)|11th|12th/i)) return false;
                  }

                  if (parentSearchText.trim()) {
                    const q = parentSearchText.toLowerCase();
                    const matches =
                      lead.parentName.toLowerCase().includes(q) ||
                      lead.parentPhone.includes(q) ||
                      lead.locality.toLowerCase().includes(q) ||
                      lead.gradeClass.toLowerCase().includes(q);
                    if (!matches) return false;
                  }
                  return true;
                });

                return (
                  <div>
                    {/* Parent Filter Toolbar */}
                    <div className="apple-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
                          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            type="text"
                            placeholder="Search parents by name, phone, grade, or sector..."
                            value={parentSearchText}
                            onChange={(e) => setParentSearchText(e.target.value)}
                            className="form-control"
                            style={{ paddingLeft: '2.4rem', borderRadius: '10px', backgroundColor: '#F8FAFC', fontSize: '0.86rem', border: '1px solid var(--border-hairline)' }}
                          />
                        </div>

                        <div style={{ minWidth: '180px' }}>
                          <select
                            value={parentGradeFilter}
                            onChange={(e) => setParentGradeFilter(e.target.value)}
                            className="form-control"
                            style={{ borderRadius: '10px', backgroundColor: '#F8FAFC', fontSize: '0.86rem', border: '1px solid var(--border-hairline)' }}
                          >
                            <option value="ALL">All Grade Levels</option>
                            <option value="CLASS_1_5">Class 1 – 5 (Primary)</option>
                            <option value="CLASS_6_8">Class 6 – 8 (Middle)</option>
                            <option value="CLASS_9_10">Class 9 – 10 (Secondary)</option>
                            <option value="CLASS_11_12">Class 11 – 12 (Sr Secondary)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Parents Table View */}
                    <div className="desktop-only-table apple-card" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid var(--border-hairline)', marginBottom: '1.25rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                            <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Parent &amp; Contact</th>
                            <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Grade &amp; Subjects</th>
                            <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Locality</th>
                            <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Assigned Educator</th>
                            <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredParents.map((lead) => (
                            <tr
                              key={lead.id}
                              style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}
                              onClick={() => {
                                setActiveParent360(lead);
                                setActiveParent360Tab('OVERVIEW');
                              }}
                            >
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>{lead.parentName}</div>
                                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>📞 {lead.parentPhone}</div>
                              </td>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontWeight: 700, color: '#334155' }}>{lead.gradeClass}</div>
                              </td>
                              <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#0F172A' }}>
                                📍 {lead.locality}
                              </td>
                              <td style={{ padding: '0.85rem 1rem' }}>
                                {lead.assignedTutor ? (
                                  <span style={{ fontWeight: 700, color: '#0369A1' }}>👨‍🏫 {lead.assignedTutor}</span>
                                ) : (
                                  <span style={{ color: '#94A3B8' }}>⏳ Unassigned</span>
                                )}
                              </td>
                              <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveParent360(lead);
                                    setActiveParent360Tab('OVERVIEW');
                                  }}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#0EA5E9',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                  }}
                                >
                                  <Eye size={12} />
                                  <span>Parent 360°</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 4: COORDINATION DESK */}
              {activeTab === 'COORDINATION' && (() => {
                const assignedPairs = leads.filter(
                  (l) => Boolean(l.assignedTutor) || l.status === 'DEMO_SCHEDULED' || l.status === 'TUITION_CONFIRMED'
                );

                return (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {assignedPairs.map((lead) => (
                        <div
                          key={lead.id}
                          className="apple-card"
                          style={{
                            padding: '1.25rem',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6366F1', textTransform: 'uppercase' }}>
                                Active Coordination Pair
                              </div>
                              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>
                                {lead.parentName} ⟷ {lead.assignedTutor || 'Assigned Tutor'}
                              </h3>
                              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                {lead.gradeClass} • 📍 {lead.locality}
                              </div>
                            </div>

                            {/* 3-Way WhatsApp Intro Action */}
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `*SSSAM Academy - 3-Way Tuition Coordination Introduction*\n\n` +
                                `Namaste ${lead.parentName} and ${lead.assignedTutor || 'Educator'},\n` +
                                `This is ${currentOperator} from SSSAM Academy connecting you both for *${lead.gradeClass}* classes in *${lead.locality}*.\n\n` +
                                `Kindly connect to coordinate the exact class schedule and timings.\n\n` +
                                `Best regards,\nSSSAM Academy Coordination Desk`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '10px',
                                backgroundColor: '#10B981',
                                color: '#FFFFFF',
                                fontSize: '0.82rem',
                                fontWeight: 800,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                              }}
                            >
                              <MessageSquare size={15} />
                              <span>🤝 Send 3-Way WhatsApp Intro</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </section>
          </div>
        </div>
      </main>

      {/* TUTOR 360° RIGHT SLIDE-OVER DRAWER */}
      {activeTutor360 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 1150,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setActiveTutor360(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              height: '100vh',
              backgroundColor: '#FFFFFF',
              boxShadow: '-8px 0 35px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>{activeTutor360.name}</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>🎓 {activeTutor360.highestDegree}</div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTutor360(null)}
                style={{ border: 'none', background: '#F1F5F9', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Teaching Specialty &amp; Radius
                </div>
                <div style={{ fontWeight: 700, color: '#0284C7' }}>{activeTutor360.subjects.join(', ')}</div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                  📍 {activeTutor360.serviceAreas.join(', ')} ({activeTutor360.travelRadiusKm} km travel radius)
                </div>
              </div>

              {/* Bio & Video Intro */}
              <div style={{ padding: '1rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Educator Profile Bio
                </div>
                <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  {activeTutor360.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PARENT 360° RIGHT SLIDE-OVER DRAWER */}
      {activeParent360 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 1150,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setActiveParent360(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              height: '100vh',
              backgroundColor: '#FFFFFF',
              boxShadow: '-8px 0 35px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>{activeParent360.parentName}</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>📚 {activeParent360.gradeClass} • 📍 {activeParent360.locality}</div>
              </div>
              <button
                type="button"
                onClick={() => setActiveParent360(null)}
                style={{ border: 'none', background: '#F1F5F9', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Student Requirements
                </div>
                <div style={{ fontWeight: 800, color: '#0F172A' }}>{activeParent360.gradeClass}</div>
                <div style={{ fontSize: '0.82rem', color: '#0369A1', marginTop: '2px' }}>
                  {Array.isArray(activeParent360.subjectsNeeded)
                    ? activeParent360.subjectsNeeded.join(', ')
                    : (activeParent360.subjectsNeeded || '').replace(/[\[\]"]/g, '')}
                </div>
              </div>

              {activeParent360.assignedTutor && (
                <div style={{ padding: '1rem', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Assigned Educator
                  </div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem' }}>{activeParent360.assignedTutor}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOLLOW-UP NOTE MODAL */}
      {selectedLeadForUpdate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setSelectedLeadForUpdate(null)}
        >
          <div
            className="apple-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 20px 45px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  Log Call Remarks &amp; Next Action
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  {selectedLeadForUpdate.parentName} ({selectedLeadForUpdate.parentPhone})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadForUpdate(null)}
                style={{ border: 'none', background: '#F1F5F9', borderRadius: '8px', width: '28px', height: '28px', cursor: 'pointer' }}
              >
                <X size={15} color="#64748B" />
              </button>
            </div>

            <form onSubmit={handleSaveFollowup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {noteError && (
                <div style={{ padding: '0.65rem', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700 }}>
                  {noteError}
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Call Disposition Status
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="form-control"
                  style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                >
                  <option value="CONTACTED">📞 Contacted / Spoke with Parent</option>
                  <option value="INTERESTED">🔥 Interested / Ready for Demo</option>
                  <option value="DEMO_SCHEDULED">⏳ Demo Fixed with Teacher</option>
                  <option value="TUITION_CONFIRMED">✓ Tuition Confirmed / Ongoing</option>
                  <option value="LOST">❌ Not Interested / Dropped</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Call Notes / Parent Remarks <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Spoke with mother, wants Demo this Saturday 4 PM..."
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  className="form-control"
                  style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedLeadForUpdate(null)}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={noteSubmitting}
                  style={{
                    flex: 2,
                    padding: '0.65rem',
                    borderRadius: '10px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {noteSubmitting ? 'Saving...' : '✓ Save Call Follow-up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT ASSIGN CONFIRMATION MODAL */}
      {directAssignModal.isOpen && directAssignModal.lead && directAssignModal.tutor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(5px)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setDirectAssignModal({ isOpen: false, lead: null, tutor: null })}
        >
          <div
            className="apple-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              textAlign: 'center',
            }}
          >
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <UserCheck size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
              Assign Educator to Student?
            </h3>

            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Confirming assignment of <strong>{directAssignModal.tutor.name}</strong> ({directAssignModal.tutor.highestDegree}) for student <strong>{directAssignModal.lead.parentName}</strong> ({directAssignModal.lead.gradeClass}).
            </p>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setDirectAssignModal({ isOpen: false, lead: null, tutor: null })}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDirectAssignment}
                style={{
                  flex: 2,
                  padding: '0.65rem',
                  borderRadius: '10px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ✓ Yes, Confirm &amp; Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROXIMITY TUTOR MATCH MODAL */}
      {selectedLeadForMatching && (
        <TutorMatchModal
          lead={{
            id: selectedLeadForMatching.id,
            parentName: selectedLeadForMatching.parentName,
            parentPhone: selectedLeadForMatching.parentPhone,
            locality: selectedLeadForMatching.locality,
            gradeClass: selectedLeadForMatching.gradeClass,
            subjectsNeeded: Array.isArray(selectedLeadForMatching.subjectsNeeded)
              ? (selectedLeadForMatching.subjectsNeeded as string[]).join(', ')
              : (selectedLeadForMatching.subjectsNeeded || '').replace(/[\[\]"]/g, ''),
            budgetMonthly: selectedLeadForMatching.budgetMonthly,
            preferredMode: selectedLeadForMatching.preferredMode,
          }}
          currentOperator={currentOperator}
          onClose={() => setSelectedLeadForMatching(null)}
          onAssignTutor={(tutorName: string, tutorId: string, matchNote: string) => {
            setLeads((prev) =>
              prev.map((l) =>
                l.id === selectedLeadForMatching.id
                  ? {
                      ...l,
                      assignedTutor: tutorName,
                      status: 'DEMO_SCHEDULED',
                      updatedAt: new Date().toISOString(),
                    }
                  : l
              )
            );
            setSelectedLeadForMatching(null);
            setCounselorToast({
              isOpen: true,
              title: 'Tutor Assigned',
              message: `🎉 Matched ${tutorName} for ${selectedLeadForMatching.parentName}!`,
              type: 'success',
            });
          }}
        />
      )}

      {/* CENTERED TOAST NOTIFICATION */}
      {counselorToast && counselorToast.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setCounselorToast(null)}
        >
          <div
            className="apple-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: counselorToast.type === 'error' ? '#FEE2E2' : '#DCFCE7', color: counselorToast.type === 'error' ? '#DC2626' : '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
              {counselorToast.type === 'error' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
              {counselorToast.title}
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.4, marginBottom: '1.25rem' }}>
              {counselorToast.message}
            </p>
            <button
              type="button"
              onClick={() => setCounselorToast(null)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '10px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
