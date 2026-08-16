'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  LogOut,
  Lock,
  UserCheck,
  User,
  AlertCircle,
  GraduationCap,
  RotateCcw,
  Eye,
  EyeOff,
  Star,
  BookOpen,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Grid,
  CalendarClock,
  Clock,
  Pencil,
  Trash2,
  Key,
  Copy,
  Check,
  CreditCard,
  Receipt,
  Wallet,
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { SSSAM_OFFICE_DETAILS, VERIFIED_TUTORS, MockTutor, CLASS_OPTIONS, SUBJECT_OPTIONS, getSubjectsForClass } from '@/lib/data';
import SearchableSelect from '@/components/SearchableSelect';
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
  formattedAddress?: string;
  latitude?: number | null;
  longitude?: number | null;
  gradeClass: string;
  subjectsNeeded: string;
  budgetMonthly?: number;
  status: 'NEW_LEAD' | 'CONTACTED' | 'INTERESTED' | 'CALL_SCHEDULED' | 'DEMO_SCHEDULED' | 'TUITION_CONFIRMED' | 'LOST';
  notes?: string;
  assignedTutor?: string;
  assignedCaller?: string;
  demoDate?: string;
  nextFollowupDate?: string | null;
  commissionAmount?: number;
  createdAt: string;
  updatedAt: string;
  activities?: LeadActivityItem[];
}

interface FeeLedgerItem {
  id: string;
  leadId: string;
  parentName: string;
  parentPhone: string;
  gradeClass: string;
  subjects: string;
  locality: string;
  monthlyFee: number;
  parentStatus: 'PENDING' | 'RECEIVED';
  parentPaidAmount?: number;
  parentPaidDate?: string;
  parentPaymentMode?: string;
  parentTxnRef?: string;
  commissionRate: number;
  commissionAmount: number;
  tutorName: string;
  tutorPhone: string;
  tutorPayoutAmount: number;
  tutorStatus: 'PENDING' | 'PAID';
  tutorPaidDate?: string;
  tutorPaymentMode?: string;
  tutorTxnRef?: string;
}

interface RegisteredParentItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  emailVerified: boolean;
  totalInquiries: number;
  activeTuitionsCount: number;
  assignedTutors: string[];
  leads: any[];
}

export function OperationsDashboard({ portalMode = 'admin' }: { portalMode?: 'admin' | 'counselor' }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  const [activeAdminTab, setActiveAdminTab] = useState<'OVERVIEW' | 'COUNSELORS' | 'LEADS' | 'TUTOR_ALLOCATION' | 'PARENTS' | 'COORDINATION' | 'FEES_PAYOUTS' | 'PRICING_CAMPAIGNS'>(portalMode === 'counselor' ? 'LEADS' : 'OVERVIEW');
  const [selectedTutorForLeads, setSelectedTutorForLeads] = useState<any>(null);

  // Registered Parents Directory State
  const [registeredParents, setRegisteredParents] = useState<RegisteredParentItem[]>([]);
  const [parentsLoading, setParentsLoading] = useState(false);
  const [parentSearchText, setParentSearchText] = useState('');
  const [parentStatusFilter, setParentStatusFilter] = useState<'ALL' | 'ACTIVE_TUITION' | 'VERIFIED'>('ALL');
  const [parentCurrentPage, setParentCurrentPage] = useState(1);
  const [parentsPerPage, setParentsPerPage] = useState(10);
  const [selectedRegisteredParent, setSelectedRegisteredParent] = useState<RegisteredParentItem | null>(null);

  // Coordination Desk State (Tutor ⟷ Parent Communication Hub)
  const [coordSearch, setCoordSearch] = useState('');
  const [coordMilestoneFilter, setCoordMilestoneFilter] = useState<'ALL' | '1ST_SESSION_PENDING' | '1ST_SESSION_DONE' | 'FEE_PAID' | 'REPLACE_REQ'>('ALL');
  const [coordCurrentPage, setCoordCurrentPage] = useState(1);
  const [coordPerPage, setCoordPerPage] = useState(6);
  const [leadCoordMilestones, setLeadCoordMilestones] = useState<{ [leadId: string]: string }>({});

  // Fees & Payouts Ledger State
  const [feeRecords, setFeeRecords] = useState<FeeLedgerItem[]>([]);

  const [feeSearch, setFeeSearch] = useState('');
  const [feeStatusFilter, setFeeStatusFilter] = useState<'ALL' | 'PARENT_PENDING' | 'PARENT_PAID' | 'TUTOR_DUE' | 'SETTLED'>('ALL');
  const [feeCurrentPage, setFeeCurrentPage] = useState(1);
  const [feePerPage, setFeePerPage] = useState(6);

  // Record Payment Dialog Modals
  const [parentPaymentModalItem, setParentPaymentModalItem] = useState<FeeLedgerItem | null>(null);
  const [parentPayAmountInput, setParentPayAmountInput] = useState(0);
  const [parentPayModeInput, setParentPayModeInput] = useState('UPI (Google Pay / PhonePe)');
  const [parentPayTxnInput, setParentPayTxnInput] = useState('');

  const [tutorPayoutModalItem, setTutorPayoutModalItem] = useState<FeeLedgerItem | null>(null);
  const [tutorPayoutAmountInput, setTutorPayoutAmountInput] = useState(0);
  const [tutorPayoutModeInput, setTutorPayoutModeInput] = useState('UPI Transfer');
  const [tutorPayoutTxnInput, setTutorPayoutTxnInput] = useState('');

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
  const [counselorSearch, setCounselorSearch] = useState('');
  const [showAddCounselorModal, setShowAddCounselorModal] = useState(false);
  const [newCounselorName, setNewCounselorName] = useState('');
  const [newCounselorEmail, setNewCounselorEmail] = useState('');
  const [newCounselorPhone, setNewCounselorPhone] = useState('');
  const [newCounselorPassword, setNewCounselorPassword] = useState('');
  const [showNewCounselorPassword, setShowNewCounselorPassword] = useState(false);
  const [counselorFormError, setCounselorFormError] = useState('');
  const [counselorFormSubmitting, setCounselorFormSubmitting] = useState(false);
  const [counselorSuccessMsg, setCounselorSuccessMsg] = useState('');

  // Counselor Pagination State
  const [counselorCurrentPage, setCounselorCurrentPage] = useState(1);
  const [counselorsPerPage, setCounselorsPerPage] = useState(5);

  // Counselor Edit & Password Reset State
  const [selectedCounselorForEdit, setSelectedCounselorForEdit] = useState<Counselor | null>(null);
  const [editCounselorName, setEditCounselorName] = useState('');
  const [editCounselorEmail, setEditCounselorEmail] = useState('');
  const [editCounselorPhone, setEditCounselorPhone] = useState('');
  const [editCounselorPassword, setEditCounselorPassword] = useState('');
  const [showEditCounselorPassword, setShowEditCounselorPassword] = useState(false);
  const [editCounselorSubmitting, setEditCounselorSubmitting] = useState(false);
  const [editCounselorError, setEditCounselorError] = useState('');

  // Centered Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info' | 'warning';
    onConfirm: () => void;
  } | null>(null);

  // Sidebar Collapse & Mobile Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Scalable Tutor Management & Lead Allocation Hub State
  const [allTutors, setAllTutors] = useState<any[]>([]);
  const [tutorSearchText, setTutorSearchText] = useState('');
  const [tutorKycFilter, setTutorKycFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'HIDDEN'>('ALL');
  const [tutorSubjectFilter, setTutorSubjectFilter] = useState<string>('ALL');
  const [tutorAllocationCurrentPage, setTutorAllocationCurrentPage] = useState(1);
  const [tutorsAllocationPerPage, setTutorsAllocationPerPage] = useState(10);
  const [hiddenTutorIds, setHiddenTutorIds] = useState<string[]>([]);
  const [verifiedTutorIds, setVerifiedTutorIds] = useState<string[]>([]);
  const [activeTutor360, setActiveTutor360] = useState<MockTutor | null>(null);
  const [activeTutor360Tab, setActiveTutor360Tab] = useState<'LEADS' | 'KYC_VIDEO' | 'CALL_NOTES'>('LEADS');
  const [tutorFollowUpNotes, setTutorFollowUpNotes] = useState<{ [tutorId: string]: { id: string; text: string; date: string; author: string }[] }>({});
  const [newFollowUpNoteText, setNewFollowUpNoteText] = useState('');

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({});
  const [dashboardMonthFilter, setDashboardMonthFilter] = useState<'THIS_MONTH' | 'LAST_MONTH' | 'LAST_3_MONTHS' | 'ALL_TIME'>('THIS_MONTH');

  // Proximity Tutor Match State
  const [selectedLeadForMatching, setSelectedLeadForMatching] = useState<LeadItem | null>(null);

  // Full Lead Detail View Modal & Hover Notes (1s Hold Delay)
  const [selectedLeadForFullView, setSelectedLeadForFullView] = useState<LeadItem | null>(null);
  const [selectedConverted, setSelectedConverted] = useState<LeadItem | null>(null);
  const [hoveredLeadId, setHoveredLeadId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Leads Desk Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleRowMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredLeadId(id);
    }, 100); // Quick 100ms response
  };

  const handleRowMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredLeadId(null);
  };

  // Follow-up modal state
  const [selectedLeadForUpdate, setSelectedLeadForUpdate] = useState<LeadItem | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('CONTACTED');
  const [updateNotes, setUpdateNotes] = useState<string>('');
  const [updateNextFollowup, setUpdateNextFollowup] = useState<string>('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [noteError, setNoteError] = useState('');

  // Academic Details (Class & Subject) Edit State
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [editGradeClass, setEditGradeClass] = useState('');
  const [editSubjectsNeeded, setEditSubjectsNeeded] = useState('');
  const [isSavingAcademic, setIsSavingAcademic] = useState(false);

  // Authentication check on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const counselorStored = localStorage.getItem('tfh_counselor_user');
      const adminStored = localStorage.getItem('tfh_admin_user');
      const stored = portalMode === 'counselor' ? (counselorStored || adminStored) : adminStored;

      if (!stored) {
        setIsAuthenticated(false);
        router.push(portalMode === 'counselor' ? '/counselor/login' : '/admin/login');
      } else {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            if (portalMode === 'counselor') {
              localStorage.removeItem('tfh_counselor_user');
            } else {
              localStorage.removeItem('tfh_admin_user');
            }
            setIsAuthenticated(false);
            router.push(portalMode === 'counselor' ? '/counselor/login' : '/admin/login');
            return;
          }
          setAdminUser(parsed);
          setIsAuthenticated(true);
          if (portalMode === 'counselor' || parsed.role === 'TELECALLER') {
            setActiveAdminTab('LEADS');
          } else {
            fetchCounselors();
          }
          fetchLeads();
          fetchTutors();
          fetchParents();
        } catch {
          setIsAuthenticated(false);
          router.push(portalMode === 'counselor' ? '/counselor/login' : '/admin/login');
        }
      }
    }
  }, [portalMode]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      if (portalMode === 'counselor') {
        localStorage.removeItem('tfh_counselor_user');
        router.push('/counselor/login');
      } else {
        localStorage.removeItem('tfh_admin_user');
        router.push('/admin/login');
      }
    }
  };

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
        // Build dynamic fee ledgers from confirmed real database leads
        const dynamicLedgers: FeeLedgerItem[] = data.leads
          .filter((l: any) => l.status === 'TUITION_CONFIRMED' || l.status === 'FEE_PAID' || l.status === 'DEMO_SCHEDULED')
          .map((l: any) => {
            const monthlyFee = l.budgetMax || l.budgetMin || 8000;
            const commRate = 25;
            const commAmt = Math.round(monthlyFee * (commRate / 100));
            const tutorPayout = monthlyFee - commAmt;
            const isPaid = l.status === 'TUITION_CONFIRMED' || l.status === 'FEE_PAID';
            return {
              id: `FEE-${l.id.replace('LD-', '')}`,
              leadId: l.id,
              parentName: l.parentName || 'Parent (Gurgaon)',
              parentPhone: l.parentPhone || 'N/A',
              gradeClass: l.grade || 'Tuition Inquiry',
              subjects: Array.isArray(l.subjects) ? l.subjects.join(', ') : (l.subjects || 'General'),
              locality: l.locality || 'Gurgaon',
              monthlyFee,
              parentStatus: isPaid ? 'RECEIVED' : 'PENDING',
              parentPaidAmount: isPaid ? monthlyFee : 0,
              parentPaidDate: isPaid ? 'Recent' : undefined,
              commissionRate: commRate,
              commissionAmount: commAmt,
              tutorName: l.assignedTutor?.name || 'Assigned Educator',
              tutorPhone: l.assignedTutor?.phone || 'N/A',
              tutorPayoutAmount: tutorPayout,
              tutorStatus: 'PENDING'
            };
          });
        setFeeRecords(dynamicLedgers);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  const fetchTutors = async () => {
    try {
      const res = await fetch('/api/counselor/tutors');
      const data = await res.json();
      if (data.success && data.tutors) {
        setAllTutors(data.tutors);
        setVerifiedTutorIds(data.tutors.filter((t: any) => t.isVerified).map((t: any) => t.id));
      }
    } catch (err) {
      console.error('Failed to fetch dynamic tutors:', err);
    }
  };

  const fetchParents = async () => {
    setParentsLoading(true);
    try {
      const res = await fetch('/api/parents/list');
      const data = await res.json();
      if (data.success && data.parents) {
        setRegisteredParents(data.parents);
      }
    } catch (err) {
      console.error('Failed to fetch registered parents:', err);
    } finally {
      setParentsLoading(false);
    }
  };

  const fetchPlatformConfig = async () => {
    try {
      const res = await fetch('/api/config/global');
      const data = await res.json();
      if (data.success && data.config) {
        setBasePrice(data.config.baseVerificationFee ?? 999);
        setIsOfferActive(data.config.isOfferActive ?? true);
        setDiscountPercent(data.config.offerDiscountPercent ?? 100);
        setCampaignTitle(data.config.offerTitle || 'Academic Session 2026-27 Special Drive');
        setCampaignSubtitle(data.config.offerSubtext || '100% Verification Fee Waiver for Gurgaon & NCR Educators');
      }
    } catch (e) {
      console.error('Failed to fetch platform config:', e);
    }
  };

  useEffect(() => {
    fetchCounselors();
    fetchLeads();
    fetchTutors();
    fetchPlatformConfig();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/config/global', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseVerificationFee: basePrice,
          isOfferActive,
          offerDiscountPercent: discountPercent,
          offerTitle: campaignTitle,
          offerSubtext: campaignSubtitle,
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  // Add Counselor Handler
  const handleCreateCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounselorName || !newCounselorEmail || !newCounselorPassword) {
      setCounselorFormError('Name, Email, and Password are required.');
      return;
    }

    if (newCounselorPhone && !/^[6-9]\d{9}$/.test(newCounselorPhone)) {
      setCounselorFormError('Mobile phone number must be a valid 10-digit Indian number (starting with 6, 7, 8, or 9).');
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

  // Open Edit & Password Reset Modal for Counselor
  const handleOpenEditCounselor = (csl: Counselor) => {
    setSelectedCounselorForEdit(csl);
    setEditCounselorName(csl.name);
    setEditCounselorEmail(csl.email);
    setEditCounselorPhone(csl.phone || '');
    setEditCounselorPassword('');
    setEditCounselorError('');
  };

  // Update Counselor Details & Reset Password
  const handleUpdateCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCounselorForEdit) return;

    if (!editCounselorName || !editCounselorEmail) {
      setEditCounselorError('Name and Email are required.');
      return;
    }

    setEditCounselorSubmitting(true);
    setEditCounselorError('');

    try {
      const res = await fetch('/api/admin/counselors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCounselorForEdit.id,
          name: editCounselorName,
          email: editCounselorEmail,
          phone: editCounselorPhone,
          password: editCounselorPassword.trim() ? editCounselorPassword.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCounselorSuccessMsg(`✅ Counselor ${editCounselorName} updated successfully!`);
        setCounselors((prev) =>
          prev.map((c) => (c.id === selectedCounselorForEdit.id ? { ...c, ...data.counselor } : c))
        );
        setSelectedCounselorForEdit(null);
        setTimeout(() => setCounselorSuccessMsg(''), 4000);
      } else {
        setEditCounselorError(data.error || 'Failed to update counselor');
      }
    } catch {
      setEditCounselorError('Network error updating counselor');
    } finally {
      setEditCounselorSubmitting(false);
    }
  };

  const handleDeleteCounselor = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Counselor Desk',
      message: `Are you sure you want to remove counselor "${name}" from active calling desks?`,
      confirmText: 'Remove Desk',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          const res = await fetch(`/api/admin/counselors?id=${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.success) {
            setCounselors((prev) => prev.filter((c) => c.id !== id));
            setCounselorSuccessMsg(`Counselor "${name}" removed successfully.`);
            setTimeout(() => setCounselorSuccessMsg(''), 4000);
          } else {
            setCounselorSuccessMsg(`⚠️ ${data.error || 'Failed to remove counselor'}`);
            setTimeout(() => setCounselorSuccessMsg(''), 4000);
          }
        } catch {
          setCounselors((prev) => prev.filter((c) => c.id !== id));
          setCounselorSuccessMsg(`Counselor "${name}" removed.`);
          setTimeout(() => setCounselorSuccessMsg(''), 4000);
        }
      },
    });
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

    const actorName = adminUser?.name
      ? `${adminUser.name} (${portalMode === 'counselor' ? 'Counselor' : 'Admin'})`
      : (portalMode === 'counselor' ? 'Counselor Desk' : 'Admin (SSSAM Lead Desk)');

    try {
      const res = await fetch(`/api/leads/${selectedLeadForUpdate.id}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updateStatus,
          notes: updateNotes,
          nextFollowupDate: isTerminal ? null : (updateNextFollowup || null),
          performedBy: actorName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const updatedActivities = [
          {
            id: `act-${Date.now()}`,
            leadId: selectedLeadForUpdate.id,
            actionType: updateStatus,
            description: updateNotes,
            performedBy: actorName,
            createdAt: new Date().toISOString(),
          },
          ...(selectedLeadForUpdate.activities || []),
        ];

        const updatedLeadObj = {
          ...selectedLeadForUpdate,
          status: updateStatus as any,
          notes: updateNotes,
          nextFollowupDate: updateNextFollowup || selectedLeadForUpdate.nextFollowupDate,
          updatedAt: new Date().toISOString(),
          activities: updatedActivities,
        };

        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLeadForUpdate.id ? updatedLeadObj : l
          )
        );

        // Sync full view if open
        if (selectedLeadForFullView && selectedLeadForFullView.id === selectedLeadForUpdate.id) {
          setSelectedLeadForFullView(updatedLeadObj);
        }

        // Fetch fresh leads from backend
        fetchLeads();

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

  const handleSaveAcademicDetails = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedLeadForFullView || !editGradeClass.trim()) return;

    setIsSavingAcademic(true);
    const actorName = adminUser?.name
      ? `${adminUser.name} (${portalMode === 'counselor' ? 'Counselor' : 'Admin'})`
      : (portalMode === 'counselor' ? 'Counselor Desk' : 'Admin');

    try {
      const res = await fetch(`/api/leads/${selectedLeadForFullView.id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeClass: editGradeClass.trim(),
          subjectsNeeded: editSubjectsNeeded.trim(),
          performedBy: actorName,
        }),
      });

      const data = await res.json();
      if (data.success && data.lead) {
        const updated = {
          ...selectedLeadForFullView,
          gradeClass: data.lead.gradeClass,
          subjectsNeeded: data.lead.subjectsNeeded,
          activities: data.lead.activities || selectedLeadForFullView.activities,
        };
        setSelectedLeadForFullView(updated);
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLeadForFullView.id ? { ...l, ...updated } : l))
        );
        setIsEditingAcademic(false);
        fetchLeads();
      } else {
        alert(data.error || 'Failed to update academic details');
      }
    } catch (err) {
      console.error('Failed to update academic details:', err);
      alert('Network error while updating academic details');
    } finally {
      setIsSavingAcademic(false);
    }
  };

  const handleAssignProximityTutor = async (tutorName: string, tutorId: string, matchNote: string) => {
    if (!selectedLeadForMatching) return;

    const actorName = adminUser?.name
      ? `${adminUser.name} (${portalMode === 'counselor' ? 'Counselor' : 'Admin'})`
      : (portalMode === 'counselor' ? 'Counselor Desk' : 'Admin (SSSAM Lead Desk)');

    try {
      const res = await fetch(`/api/leads/${selectedLeadForMatching.id}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'DEMO_SCHEDULED',
          notes: matchNote,
          performedBy: actorName,
          actionType: 'DEMO_FIXED',
        }),
      });

      const updatedActivities = [
        {
          id: `act-${Date.now()}`,
          leadId: selectedLeadForMatching.id,
          actionType: 'DEMO_FIXED',
          description: `Assigned tutor ${tutorName}. ${matchNote}`,
          performedBy: actorName,
          createdAt: new Date().toISOString(),
        },
        ...(selectedLeadForMatching.activities || []),
      ];

      const updatedLeadObj = {
        ...selectedLeadForMatching,
        status: (selectedLeadForMatching.status === 'TUITION_CONFIRMED' ? 'TUITION_CONFIRMED' : 'DEMO_SCHEDULED') as any,
        assignedTutor: tutorName,
        notes: matchNote,
        updatedAt: new Date().toISOString(),
        activities: updatedActivities,
      };

      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLeadForMatching.id ? updatedLeadObj : l
        )
      );

      // Sync full view if open
      if (selectedLeadForFullView && selectedLeadForFullView.id === selectedLeadForMatching.id) {
        setSelectedLeadForFullView(updatedLeadObj);
      }

      fetchLeads();
      setSelectedLeadForMatching(null);
    } catch (err) {
      console.error('Failed to assign proximity tutor', err);
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

  // Dashboard Month & Year Filtering
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('08');

  const monthFilteredLeads = leads.filter((l) => {
    const created = new Date(l.createdAt);
    const leadYear = String(created.getFullYear());
    const leadMonth = String(created.getMonth() + 1).padStart(2, '0');

    if (selectedYear !== 'ALL' && leadYear !== selectedYear) return false;
    if (selectedMonth !== 'ALL' && leadMonth !== selectedMonth) return false;
    return true;
  });

  const urgentActionCount = monthFilteredLeads.filter(
    (l) => l.nextFollowupDate && (isToday(l.nextFollowupDate) || isOverdue(l.nextFollowupDate))
  ).length;

  const freshUncontactedCount = monthFilteredLeads.filter((l) => l.status === 'NEW_LEAD').length;

  const activePipelineCount = monthFilteredLeads.filter((l) =>
    ['INTERESTED', 'CONTACTED', 'DEMO_SCHEDULED'].includes(l.status)
  ).length;

  const closedWonCount = monthFilteredLeads.filter((l) => l.status === 'TUITION_CONFIRMED').length;
  const lostCount = monthFilteredLeads.filter((l) => l.status === 'LOST').length;

  // Active Open Leads (Excluding closed Won/Done and Lost)
  const activeOpenLeadsCount = leads.filter(
    (l) => l.status !== 'LOST' && l.status !== 'TUITION_CONFIRMED'
  ).length;

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

  // Leads Desk Pagination Calculations
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredLeads.length);
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  // Counselor Desk Pagination Calculations
  const filteredCounselors = counselors.filter((c) => {
    const query = counselorSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.phone && c.phone.includes(query))
    );
  });
  const counselorTotalPages = Math.ceil(filteredCounselors.length / counselorsPerPage) || 1;
  const counselorStartIndex = (counselorCurrentPage - 1) * counselorsPerPage;
  const counselorEndIndex = Math.min(counselorStartIndex + counselorsPerPage, filteredCounselors.length);
  const paginatedCounselors = filteredCounselors.slice(counselorStartIndex, counselorEndIndex);

  const getStatusBadge = (status: string) => {
    const norm = (status || '').toUpperCase().trim();
    if (norm === 'NEW_LEAD' || norm === 'NEW' || norm === 'PENDING') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: 700, fontSize: '0.74rem', whiteSpace: 'nowrap' }}>New Lead</span>;
    }
    if (norm === 'INTERESTED' || norm === 'HIGHLY_INTERESTED') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: 700, fontSize: '0.74rem', whiteSpace: 'nowrap' }}>Interested</span>;
    }
    if (norm === 'CONTACTED') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#DBEAFE', color: '#1E40AF', fontWeight: 700, fontSize: '0.74rem', whiteSpace: 'nowrap' }}>Contacted</span>;
    }
    if (norm === 'DEMO_SCHEDULED' || norm === 'DEMO_FIXED' || norm === 'DEMO') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#EDE9FE', color: '#6D28D9', fontWeight: 700, fontSize: '0.74rem', whiteSpace: 'nowrap' }}>1st Class Fixed</span>;
    }
    if (norm === 'TUITION_CONFIRMED' || norm === 'CONVERTED' || norm === 'ADMISSION_CONFIRMED' || norm === 'WON') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#CCFBF1', color: '#0F766E', fontWeight: 700, fontSize: '0.74rem', whiteSpace: 'nowrap' }}>Converted</span>;
    }
    if (norm === 'LOST' || norm === 'CANCELLED' || norm === 'DROPPED' || norm === 'NOT_INTERESTED') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#FFE4E6', color: '#9F1239', fontWeight: 700, fontSize: '0.74rem', whiteSpace: 'nowrap' }}>Not Interested</span>;
    }
    if (norm === 'ENQUIRY_CREATED' || norm === 'ENQUIRY') {
      return <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#EDE9FE', color: '#6D28D9', fontWeight: 700, fontSize: '0.74rem', whiteSpace: 'nowrap' }}>Enquiry Created</span>;
    }
    return (
      <span style={{ display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#F1F5F9', color: '#334155', fontWeight: 700, fontSize: '0.74rem', whiteSpace: 'nowrap' }}>
        {status ? status.replace(/_/g, ' ') : 'New Lead'}
      </span>
    );
  };

  const parseActivity = (act: { actionType?: string; description?: string; performedBy?: string; createdAt?: string }) => {
    let status = act.actionType || 'STATUS_CHANGE';
    let note = act.description || '';
    let followup = '';

    const statusMatch = note.match(/\[Status:\s*([^\]]+)\]/i);
    if (statusMatch) {
      status = statusMatch[1].trim();
      note = note.replace(statusMatch[0], '').trim();
    }

    const followupMatch = note.match(/\(Next Follow-up(?:\s*set)?:\s*([^\)]+)\)/i);
    if (followupMatch) {
      followup = followupMatch[1].trim();
      note = note.replace(followupMatch[0], '').trim();
    }

    const formattedStatus = status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
    return { status, formattedStatus, note, followup };
  };

  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)', padding: '2rem 1rem' }}>
        <div className="apple-card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#FFFFFF', maxWidth: '420px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '16px', backgroundColor: 'var(--brand-blue-light)', color: 'var(--brand-blue)', marginBottom: '1rem' }}>
            <Lock size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Super Admin Authentication Required
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
            Access to SSSAM Academy Command Center is restricted. Please sign in with master admin credentials.
          </p>
          <button
            type="button"
            onClick={() => { window.location.href = '/admin/login'; }}
            className="btn btn-primary btn-md"
            style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center', backgroundColor: '#059669', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
          >
            <ShieldCheck size={16} />
            <span>Go to Admin Login Gateway</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Sleek Top Mini-Header for Portal Status */}
      <header
        style={{
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.82rem',
          borderBottom: '1px solid #1E293B',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              color: '#F8FAFC',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title={isSidebarOpen ? 'Hide Navigation Sidebar' : 'Show Navigation Sidebar'}
          >
            {isSidebarOpen ? <PanelLeftClose size={13} color="#38BDF8" /> : <PanelLeftOpen size={13} color="#38BDF8" />}
            <span>{isSidebarOpen ? 'Menu' : 'Menu'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22C55E' }}></span>
            <span style={{ fontWeight: 700, letterSpacing: '0.02em', fontSize: '0.84rem' }}>
              TuitionForHome {portalMode === 'counselor' ? 'Counselor Portal' : 'Admin'}
            </span>
          </div>
          <span className="hide-on-mobile" style={{ color: '#64748B' }}>|</span>
          <span className="hide-on-mobile" style={{ color: '#94A3B8', fontSize: '0.78rem' }}>SSSAM Academy Sector 14</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#94A3B8', fontSize: '0.76rem' }}>
            Active: <strong style={{ color: '#F8FAFC' }}>{adminUser?.email || 'admin@tuitionforhome.com'}</strong>
          </span>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ color: '#38BDF8', fontWeight: 600, textDecoration: 'none', fontSize: '0.76rem' }}>
            Public Site ↗
          </a>
        </div>
      </header>

      <main className="admin-main-container">
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Main Grid: Collapsible Left Sidebar + Right Content Area */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isSidebarOpen ? '270px 1fr' : '1fr',
              gap: '1.5rem',
              alignItems: 'flex-start',
              transition: 'grid-template-columns 0.25s ease',
            }}
          >
            
            {/* LEFT STICKY SIDEBAR (COLLAPSIBLE) */}
            {isSidebarOpen && (
              <aside
                style={{
                  position: 'sticky',
                  top: '80px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                {/* Brand Header with Collapse X button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="badge badge-emerald" style={{ marginBottom: '0.35rem', fontSize: '0.7rem' }}>
                      <ShieldCheck size={12} />
                      <span>{portalMode === 'counselor' ? 'COUNSELOR WORKSTATION' : 'COMMAND CENTER'}</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {portalMode === 'counselor' ? 'Counselor Portal' : 'Admin Portal'}
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                      {portalMode === 'counselor' ? 'Calling & Lead Allocation Suite' : 'SSSAM Academy Gurugram'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                      border: 'none',
                      background: '#F1F5F9',
                      borderRadius: '8px',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748B',
                    }}
                    title="Hide Sidebar"
                  >
                    <PanelLeftClose size={15} />
                  </button>
                </div>

                {/* Navigation Menu */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', paddingLeft: '0.5rem' }}>
                    Navigation Hub
                  </div>

                  {/* Nav 1: Operational Overview (Admin only) */}
                  {portalMode !== 'counselor' && adminUser?.role !== 'TELECALLER' && (
                    <button
                      type="button"
                      onClick={() => setActiveAdminTab('OVERVIEW')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: 'none',
                        outline: 'none',
                        boxShadow: activeAdminTab === 'OVERVIEW' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                        backgroundColor: activeAdminTab === 'OVERVIEW' ? '#6366F1' : 'transparent',
                        color: activeAdminTab === 'OVERVIEW' ? '#FFFFFF' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <TrendingUp size={16} color={activeAdminTab === 'OVERVIEW' ? '#FFFFFF' : '#6366F1'} />
                        <span>Operational Overview</span>
                      </div>
                    </button>
                  )}

                  {/* Nav 2: Counselor Team (Admin only) */}
                  {portalMode !== 'counselor' && adminUser?.role !== 'TELECALLER' && (
                    <button
                      type="button"
                      onClick={() => setActiveAdminTab('COUNSELORS')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: 'none',
                        outline: 'none',
                        boxShadow: activeAdminTab === 'COUNSELORS' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                        backgroundColor: activeAdminTab === 'COUNSELORS' ? '#6366F1' : 'transparent',
                        color: activeAdminTab === 'COUNSELORS' ? '#FFFFFF' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Users size={16} color={activeAdminTab === 'COUNSELORS' ? '#FFFFFF' : '#6366F1'} />
                        <span>Counselor Team</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '6px',
                          backgroundColor: activeAdminTab === 'COUNSELORS' ? 'rgba(255,255,255,0.25)' : '#EFF6FF',
                          color: activeAdminTab === 'COUNSELORS' ? '#FFFFFF' : '#1D4ED8',
                        }}
                      >
                        {counselors.length} Staff
                      </span>
                    </button>
                  )}

                  {/* Nav 3: Shared Lead Desk */}
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('LEADS')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: 'none',
                      outline: 'none',
                      boxShadow: activeAdminTab === 'LEADS' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                      backgroundColor: activeAdminTab === 'LEADS' ? '#6366F1' : 'transparent',
                      color: activeAdminTab === 'LEADS' ? '#FFFFFF' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Phone size={16} color={activeAdminTab === 'LEADS' ? '#FFFFFF' : '#10B981'} />
                      <span>Shared Lead Desk</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        backgroundColor: activeAdminTab === 'LEADS' ? 'rgba(255,255,255,0.25)' : '#DCFCE7',
                        color: activeAdminTab === 'LEADS' ? '#FFFFFF' : '#166534',
                      }}
                    >
                      {activeOpenLeadsCount} Active
                    </span>
                  </button>

                  {/* Nav 4: Tutor Lead Allocator */}
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('TUTOR_ALLOCATION')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: 'none',
                      outline: 'none',
                      boxShadow: activeAdminTab === 'TUTOR_ALLOCATION' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                      backgroundColor: activeAdminTab === 'TUTOR_ALLOCATION' ? '#6366F1' : 'transparent',
                      color: activeAdminTab === 'TUTOR_ALLOCATION' ? '#FFFFFF' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <MapPin size={16} color={activeAdminTab === 'TUTOR_ALLOCATION' ? '#FFFFFF' : '#F59E0B'} />
                      <span>Tutor Allocator</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        backgroundColor: activeAdminTab === 'TUTOR_ALLOCATION' ? 'rgba(255,255,255,0.25)' : '#FEF3C7',
                        color: activeAdminTab === 'TUTOR_ALLOCATION' ? '#FFFFFF' : '#92400E',
                      }}
                    >
                      {allTutors.length} Tutors
                    </span>
                  </button>
                  {/* Nav 4.2: Parent & Student Directory */}
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('PARENTS')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: 'none',
                      outline: 'none',
                      boxShadow: activeAdminTab === 'PARENTS' ? '0 4px 12px rgba(14, 165, 233, 0.25)' : 'none',
                      backgroundColor: activeAdminTab === 'PARENTS' ? '#0EA5E9' : 'transparent',
                      color: activeAdminTab === 'PARENTS' ? '#FFFFFF' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <GraduationCap size={16} color={activeAdminTab === 'PARENTS' ? '#FFFFFF' : '#0EA5E9'} />
                      <span>Parent Directory</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        backgroundColor: activeAdminTab === 'PARENTS' ? 'rgba(255,255,255,0.25)' : '#E0F2FE',
                        color: activeAdminTab === 'PARENTS' ? '#FFFFFF' : '#0369A1',
                      }}
                    >
                      {registeredParents.length}
                    </span>
                  </button>

                  {/* Nav 4.5: Tutor-Parent Coordination Desk */}
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('COORDINATION')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: 'none',
                      outline: 'none',
                      boxShadow: activeAdminTab === 'COORDINATION' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                      backgroundColor: activeAdminTab === 'COORDINATION' ? '#6366F1' : 'transparent',
                      color: activeAdminTab === 'COORDINATION' ? '#FFFFFF' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Users size={16} color={activeAdminTab === 'COORDINATION' ? '#FFFFFF' : '#0284C7'} />
                      <span>Coordination</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        backgroundColor: activeAdminTab === 'COORDINATION' ? 'rgba(255,255,255,0.25)' : '#E0F2FE',
                        color: activeAdminTab === 'COORDINATION' ? '#FFFFFF' : '#0369A1',
                      }}
                    >
                      {leads.filter(l => Boolean(l.assignedTutor) || l.status === 'DEMO_SCHEDULED' || l.status === 'TUITION_CONFIRMED').length}
                    </span>
                  </button>

                  {/* Nav 4.8: Fees & Payouts Ledger (Admin only) */}
                  {portalMode !== 'counselor' && adminUser?.role !== 'TELECALLER' && (
                    <button
                      type="button"
                      onClick={() => setActiveAdminTab('FEES_PAYOUTS')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: 'none',
                        outline: 'none',
                        boxShadow: activeAdminTab === 'FEES_PAYOUTS' ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none',
                        backgroundColor: activeAdminTab === 'FEES_PAYOUTS' ? '#10B981' : 'transparent',
                        color: activeAdminTab === 'FEES_PAYOUTS' ? '#FFFFFF' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <CreditCard size={16} color={activeAdminTab === 'FEES_PAYOUTS' ? '#FFFFFF' : '#10B981'} />
                        <span>Fees &amp; Payouts</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '6px',
                          backgroundColor: activeAdminTab === 'FEES_PAYOUTS' ? 'rgba(255,255,255,0.25)' : '#FEF3C7',
                          color: activeAdminTab === 'FEES_PAYOUTS' ? '#FFFFFF' : '#92400E',
                        }}
                      >
                        {feeRecords.filter(f => f.parentStatus === 'PENDING' || f.tutorStatus === 'PENDING').length} Due
                      </span>
                    </button>
                  )}

                  {/* Nav 6: Pricing & Campaign Settings (Admin only) */}
                  {portalMode !== 'counselor' && adminUser?.role !== 'TELECALLER' && (
                    <button
                      type="button"
                      onClick={() => setActiveAdminTab('PRICING_CAMPAIGNS')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: 'none',
                        outline: 'none',
                        boxShadow: activeAdminTab === 'PRICING_CAMPAIGNS' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none',
                        backgroundColor: activeAdminTab === 'PRICING_CAMPAIGNS' ? '#6366F1' : 'transparent',
                        color: activeAdminTab === 'PRICING_CAMPAIGNS' ? '#FFFFFF' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <DollarSign size={16} color={activeAdminTab === 'PRICING_CAMPAIGNS' ? '#FFFFFF' : '#6366F1'} />
                        <span>Pricing &amp; Campaigns</span>
                      </div>
                    </button>
                  )}
                </nav>

                {/* Admin Profile & Logout Box */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-hairline)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--brand-emerald)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        boxShadow: 'var(--shadow-sm)',
                        flexShrink: 0,
                      }}
                    >
                      {adminUser?.name ? adminUser.name[0].toUpperCase() : portalMode === 'counselor' ? 'C' : 'A'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {adminUser?.name || (portalMode === 'counselor' ? 'Counselor' : 'Administrator')}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {portalMode === 'counselor'
                          ? 'Academic Counselor'
                          : adminUser?.role === 'SUPER_ADMIN'
                          ? 'Super Admin'
                          : 'Admin Operations'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      color: 'var(--brand-crimson)',
                      borderColor: 'var(--border-hairline)',
                      fontSize: '0.78rem',
                      backgroundColor: '#FEF2F2',
                    }}
                  >
                    <LogOut size={14} />
                    <span>{portalMode === 'counselor' ? 'Log Out' : 'Log Out of Admin'}</span>
                  </button>
                </div>
              </aside>
            )}

            {/* RIGHT MAIN CONTENT VIEWPORT */}
            <section style={{ minWidth: 0 }}>
              {/* Dynamic Header */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {activeAdminTab === 'OVERVIEW' && 'Master Operations & Calling Desks Hub'}
                    {activeAdminTab === 'COUNSELORS' && 'Counselor Team & Sales Desks'}
                    {activeAdminTab === 'LEADS' && 'Shared Parent Inquiry Lead Hub'}
                    {activeAdminTab === 'TUTOR_ALLOCATION' && 'Proximity Student Lead Allocator by Tutor'}
                    {activeAdminTab === 'PARENTS' && 'Parent & Student Master Directory'}
                    {activeAdminTab === 'COORDINATION' && 'Tutor-Parent Connect & Coordination Desk'}
                    {activeAdminTab === 'FEES_PAYOUTS' && 'Tuition Fees, Advance & Tutor Payouts Ledger'}
                    {activeAdminTab === 'PRICING_CAMPAIGNS' && 'Tutor Verification Pricing & Campaigns'}
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                    {activeAdminTab === 'OVERVIEW' && 'Key operational volume, counselor staffing, and active tutor verification campaigns.'}
                    {activeAdminTab === 'COUNSELORS' && 'Manage operational calling desks, sales performance, and staff credentials.'}
                    {activeAdminTab === 'LEADS' && 'Unified parent leads with 8 operational filters, mandatory notes, and history timeline.'}
                    {activeAdminTab === 'TUTOR_ALLOCATION' && 'Match and dispatch nearby student inquiries based on tutor travel radius.'}
                    {activeAdminTab === 'PARENTS' && 'Search, filter, and inspect registered parents, child grades, and active assignments.'}
                    {activeAdminTab === 'COORDINATION' && 'Direct 2-way & 3-way communication between parents and assigned verified tutors.'}
                    {activeAdminTab === 'FEES_PAYOUTS' && 'Track advance collections from parents, academy margin, and tutor payouts.'}
                    {activeAdminTab === 'PRICING_CAMPAIGNS' && 'Configure base verification fees, 100% waiver drives, and season banner text.'}
                  </p>
                </div>
              </div>

              {counselorSuccessMsg && (
                <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1.25rem', backgroundColor: 'var(--brand-emerald-light)', color: 'var(--brand-emerald)', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} />
                  <span>{counselorSuccessMsg}</span>
                </div>
              )}

          {/* TAB 1: OPERATIONAL OVERVIEW & IMPORTANT LEADS SUMMARY */}
          {activeAdminTab === 'OVERVIEW' && (
            <div>
              {/* Clean Top Header with Integrated Month/Year Filter Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.75rem',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Operational Performance
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                    Showing {monthFilteredLeads.length} leads in selected period
                  </p>
                </div>

                {/* Clean Filter Controls Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#FFFFFF',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '14px',
                    border: '1px solid var(--border-hairline)',
                    boxShadow: 'var(--shadow-sm)',
                    flexWrap: 'wrap',
                  }}
                >
                  <Calendar size={15} color="var(--brand-teal)" />

                  {/* Year Select */}
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="ALL">All Years</option>
                  </select>

                  {/* Month Select */}
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="ALL">All Months</option>
                    <option value="01">Jan</option>
                    <option value="02">Feb</option>
                    <option value="03">Mar</option>
                    <option value="04">Apr</option>
                    <option value="05">May</option>
                    <option value="06">Jun</option>
                    <option value="07">Jul</option>
                    <option value="08">Aug</option>
                    <option value="09">Sep</option>
                    <option value="10">Oct</option>
                    <option value="11">Nov</option>
                    <option value="12">Dec</option>
                  </select>

                  {/* Quick Preset Buttons */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedYear('2026');
                      setSelectedMonth('08');
                    }}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: selectedYear === '2026' && selectedMonth === '08' ? 'var(--brand-teal)' : 'transparent',
                      color: selectedYear === '2026' && selectedMonth === '08' ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    This Month
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedYear('ALL');
                      setSelectedMonth('ALL');
                    }}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: selectedYear === 'ALL' && selectedMonth === 'ALL' ? 'var(--brand-teal)' : 'transparent',
                      color: selectedYear === 'ALL' && selectedMonth === 'ALL' ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    All Time
                  </button>
                </div>
              </div>

              {/* 4 BALANCED & CLEAN STATUS CARDS */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                {/* CARD 1: Urgent Action (Overdue + Today's Callbacks) */}
                <div
                  onClick={() => {
                    setActiveFilter('TODAY');
                    setActiveAdminTab('LEADS');
                  }}
                  className="apple-card"
                  style={{
                    padding: '1.35rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-hairline)',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Action Required
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#DC2626' }}></span>
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#DC2626', lineHeight: 1 }}>
                    {urgentActionCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
                    Overdue &amp; today&apos;s calls
                  </div>
                </div>

                {/* CARD 2: Fresh Inquiries (Not Contacted) */}
                <div
                  onClick={() => {
                    setActiveFilter('NEW_LEAD');
                    setActiveAdminTab('LEADS');
                  }}
                  className="apple-card"
                  style={{
                    padding: '1.35rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-hairline)',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Fresh Leads
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D97706' }}></span>
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#D97706', lineHeight: 1 }}>
                    {freshUncontactedCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
                    Awaiting 1st counselor call
                  </div>
                </div>

                {/* CARD 3: Active Pipeline (Demos & Discussions) */}
                <div
                  onClick={() => {
                    setActiveFilter('DEMO_SCHEDULED');
                    setActiveAdminTab('LEADS');
                  }}
                  className="apple-card"
                  style={{
                    padding: '1.35rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-hairline)',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Active Demos
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-teal)' }}></span>
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--brand-teal)', lineHeight: 1 }}>
                    {activePipelineCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
                    Trials &amp; in-discussion leads
                  </div>
                </div>

                {/* CARD 4: Converted Tuitions Won */}
                <div
                  onClick={() => {
                    setActiveFilter('TUITION_CONFIRMED');
                    setActiveAdminTab('LEADS');
                  }}
                  className="apple-card"
                  style={{
                    padding: '1.35rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-hairline)',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Tuitions Won
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-emerald)' }}></span>
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--brand-emerald)', lineHeight: 1 }}>
                    {closedWonCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
                    Successfully closed placements
                  </div>
                </div>
              </div>

              {/* Quick Operation Action Hub */}
              <div className="apple-card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border-hairline)', borderRadius: '18px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.04em' }}>
                  Quick Shortcuts
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('LEADS')}
                    className="apple-card"
                    style={{
                      padding: '1.15rem',
                      textAlign: 'left',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-hairline)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      borderRadius: '14px',
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>Open Leads Desk</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>8 filter tabs &amp; timeline history</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('TUTOR_ALLOCATION')}
                    className="apple-card"
                    style={{
                      padding: '1.15rem',
                      textAlign: 'left',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-hairline)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      borderRadius: '14px',
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>Proximity Allocator</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Match tutors within 1.5 KM</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCounselorModal(true);
                      setCounselorFormError('');
                    }}
                    className="apple-card"
                    style={{
                      padding: '1.15rem',
                      textAlign: 'left',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-hairline)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      borderRadius: '14px',
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <UserPlus size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>+ Add Counselor Staff</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Create telecaller login credentials</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRICING & CAMPAIGN CONTROLLER (DEDICATED ON-DEMAND TAB) */}
          {activeAdminTab === 'PRICING_CAMPAIGNS' && (
            <div>
              {/* Pricing & Campaign Controller */}
              <div className="apple-card" style={{ padding: '2.5rem', marginBottom: '2.5rem', backgroundColor: '#FFFFFF', border: '1px solid var(--border-hairline)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1.5rem' }}>
                  <div>
                    <div className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>
                      <Settings size={14} />
                      <span>SITETWAVE CONTROLLER</span>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
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
                      <label className="form-label" style={{ fontWeight: 700 }}>Base Tutor Verification Fee (₹)</label>
                      <input
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(Number(e.target.value))}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700 }}>Active Discount Setting</label>
                      <select
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        className="form-control"
                        style={{ fontWeight: 700 }}
                      >
                        <option value={100}>100% OFF (₹0 Free Registration - Early Launch Drive)</option>
                        <option value={50}>50% OFF (₹499 Promotional Price)</option>
                        <option value={0}>0% OFF (Full Price ₹999)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700 }}>Campaign Banner Status</label>
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
                      <label className="form-label" style={{ fontWeight: 700 }}>Campaign Title / Hook</label>
                      <input
                        type="text"
                        value={campaignTitle}
                        onChange={(e) => setCampaignTitle(e.target.value)}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700 }}>Campaign Subtext</label>
                      <input
                        type="text"
                        value={campaignSubtitle}
                        onChange={(e) => setCampaignSubtitle(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-hairline)' }}>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ backgroundColor: 'var(--brand-emerald)', fontWeight: 800 }}>
                      <Save size={18} />
                      <span>Save & Publish Pricing Live</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: COUNSELOR MANAGEMENT (CLEAN, MINIMALIST TABLE LAYOUT) */}
          {activeAdminTab === 'COUNSELORS' && (
            <div>
              {/* Header & Controls Bar */}
              <div
                className="admin-search-bar-row"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  backgroundColor: '#FFFFFF',
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border-hairline)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search counselor by name, email, or phone..."
                    value={counselorSearch}
                    onChange={(e) => {
                      setCounselorSearch(e.target.value);
                      setCounselorCurrentPage(1);
                    }}
                    className="form-control"
                    style={{
                      paddingLeft: '2.5rem',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      borderColor: 'var(--border-hairline)',
                      backgroundColor: '#F8FAFC',
                    }}
                  />
                </div>

                {/* HIGH-CONTRAST, CRYSTAL-CLEAR ADD COUNSELOR BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCounselorModal(true);
                    setCounselorFormError('');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: '1px solid #1E293B',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <UserPlus size={16} color="#38BDF8" />
                  <span style={{ color: '#FFFFFF', letterSpacing: '0.01em' }}>Add New Counselor</span>
                </button>
              </div>

              {/* Counselor Structured Container */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                }}
              >
                {/* 1. DESKTOP VIEW: Clean 4-Column Table */}
                <div className="desktop-only-table">
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-hairline)', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em' }}>
                          <th style={{ padding: '0.85rem 1.25rem', width: '36%' }}>Counselor Staff</th>
                          <th style={{ padding: '0.85rem 1.25rem', width: '32%' }}>Login Email</th>
                          <th style={{ padding: '0.85rem 1.25rem', width: '18%' }}>Phone Number</th>
                          <th style={{ padding: '0.85rem 1.25rem', width: '14%', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedCounselors.map((csl) => (
                          <tr
                            key={csl.id}
                            style={{
                              borderBottom: '1px solid var(--border-hairline)',
                              transition: 'background-color 0.15s ease',
                            }}
                          >
                            {/* Staff Name */}
                            <td style={{ padding: '0.9rem 1.25rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    backgroundColor: '#F1F5F9',
                                    border: '1px solid var(--border-hairline)',
                                    color: 'var(--brand-navy)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                    flexShrink: 0,
                                  }}
                                >
                                  {csl.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                    {csl.name}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.84rem', color: 'var(--text-main)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap' }}>
                                <Mail size={13} color="var(--text-muted)" />
                                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{csl.email}</span>
                              </div>
                            </td>

                            {/* Phone */}
                            <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.84rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <Phone size={13} color="var(--text-muted)" />
                                <span style={{ fontWeight: 600 }}>+91 {csl.phone || '95174 47689'}</span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditCounselor(csl)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '8px',
                                    fontSize: '0.76rem',
                                    fontWeight: 600,
                                    border: '1px solid var(--border-hairline)',
                                    color: 'var(--text-main)',
                                    backgroundColor: '#FFFFFF',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                  title="Edit counselor details"
                                >
                                  <Pencil size={12} color="var(--text-muted)" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEditCounselor(csl)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '8px',
                                    fontSize: '0.76rem',
                                    fontWeight: 600,
                                    border: '1px solid var(--border-hairline)',
                                    color: 'var(--text-main)',
                                    backgroundColor: '#FFFFFF',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                  title="Reset Password"
                                >
                                  <Key size={12} color="var(--text-muted)" />
                                  <span>Password</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteCounselor(csl.id, csl.name)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    border: '1px solid #FEE2E2',
                                    color: '#DC2626',
                                    backgroundColor: '#FEF2F2',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                  title="Remove Counselor Desk"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. MOBILE VIEW: Zero-Scroll Clean Cards */}
                <div className="mobile-only-cards" style={{ padding: '0.75rem' }}>
                  {paginatedCounselors.map((csl) => (
                    <div
                      key={csl.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-hairline)',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                      }}
                    >
                      {/* Top: Avatar + Name */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: '#F1F5F9',
                              border: '1px solid var(--border-hairline)',
                              color: 'var(--brand-navy)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              flexShrink: 0,
                            }}
                          >
                            {csl.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                            {csl.name}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Email & Phone Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-hairline)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', wordBreak: 'break-all' }}>
                          <Mail size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{csl.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <Phone size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>+91 {csl.phone || '95174 47689'}</span>
                        </div>
                      </div>

                      {/* Bottom: Action Buttons */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.4rem', marginTop: '0.1rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditCounselor(csl)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.3rem',
                            padding: '0.45rem 0.5rem',
                            borderRadius: '8px',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            border: '1px solid var(--border-hairline)',
                            color: 'var(--text-main)',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer',
                          }}
                        >
                          <Pencil size={12} color="var(--text-muted)" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditCounselor(csl)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.3rem',
                            padding: '0.45rem 0.5rem',
                            borderRadius: '8px',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            border: '1px solid var(--border-hairline)',
                            color: 'var(--text-main)',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer',
                          }}
                        >
                          <Key size={12} color="var(--text-muted)" />
                          <span>Password</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCounselor(csl.id, csl.name)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: '1px solid #FEE2E2',
                            color: '#DC2626',
                            backgroundColor: '#FEF2F2',
                            cursor: 'pointer',
                          }}
                          title="Remove Desk"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredCounselors.length === 0 && !counselorLoading && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {counselorSearch ? `No counselors matching "${counselorSearch}".` : 'No counselors found. Click "+ Add New Counselor" to create a calling desk.'}
                  </div>
                )}

                {/* COUNSELOR PAGINATION BAR */}
                {filteredCounselors.length > 0 && (
                  <div
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderTop: '1px solid #E2E8F0',
                      backgroundColor: '#FAFAFA',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      fontSize: '0.78rem',
                      color: '#475569',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span>
                        Showing <strong>{counselorStartIndex + 1}</strong> to <strong>{counselorEndIndex}</strong> of <strong>{filteredCounselors.length}</strong> counselors
                      </span>

                      {/* Rows per page selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Per page:</span>
                        <select
                          value={counselorsPerPage}
                          onChange={(e) => {
                            setCounselorsPerPage(Number(e.target.value));
                            setCounselorCurrentPage(1);
                          }}
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: '#334155',
                            cursor: 'pointer',
                          }}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                        </select>
                      </div>
                    </div>

                    {/* Page Navigation Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <button
                        type="button"
                        disabled={counselorCurrentPage === 1}
                        onClick={() => setCounselorCurrentPage((p) => Math.max(1, p - 1))}
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: counselorCurrentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                          color: counselorCurrentPage === 1 ? '#94A3B8' : '#334155',
                          cursor: counselorCurrentPage === 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                        }}
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: counselorTotalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCounselorCurrentPage(pageNum)}
                          style={{
                            minWidth: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: counselorCurrentPage === pageNum ? 'none' : '1px solid #CBD5E1',
                            backgroundColor: counselorCurrentPage === pageNum ? '#0F172A' : '#FFFFFF',
                            color: counselorCurrentPage === pageNum ? '#FFFFFF' : '#334155',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                          }}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={counselorCurrentPage >= counselorTotalPages}
                        onClick={() => setCounselorCurrentPage((p) => Math.min(counselorTotalPages, p + 1))}
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: counselorCurrentPage >= counselorTotalPages ? '#F1F5F9' : '#FFFFFF',
                          color: counselorCurrentPage >= counselorTotalPages ? '#94A3B8' : '#334155',
                          cursor: counselorCurrentPage >= counselorTotalPages ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CRM ENQUIRIES & FULL DETAILS VIEW */}
          {activeAdminTab === 'LEADS' && (
            <div>
              {selectedLeadForFullView ? (
                /* IN-PAGE FULL ENQUIRY DETAILS & ACTIVITY TIMELINE VIEW (NO POPUP MODAL) */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Top Bar with Back Navigation & Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      backgroundColor: '#FFFFFF',
                      padding: '0.9rem 1.25rem',
                      borderRadius: '16px',
                      border: '1px solid var(--border-hairline)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedLeadForFullView(null)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        fontSize: '1rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        color: 'var(--brand-teal)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span>←</span>
                      <span>Back to Enquiries Desk</span>
                    </button>

                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => openUpdateModal(selectedLeadForFullView)}
                        style={{
                          padding: '0.55rem 1.15rem',
                          borderRadius: '10px',
                          backgroundColor: '#3B82F6',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <RotateCcw size={14} />
                        <span>Update Status / Follow-up</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedLeadForMatching(selectedLeadForFullView)}
                        style={{
                          padding: '0.55rem 1.15rem',
                          borderRadius: '10px',
                          backgroundColor: '#059669',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Sparkles size={14} />
                        <span>Match Nearby Tutor</span>
                      </button>
                    </div>
                  </div>

                  {/* Profile Header Card */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '18px',
                      padding: '1.5rem',
                      border: '1px solid var(--border-hairline)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '16px',
                          backgroundColor: '#3B82F6',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Users size={28} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                            {selectedLeadForFullView.parentName}
                          </h2>

                          <a
                            href={`https://wa.me/91${selectedLeadForFullView.parentPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '8px',
                              backgroundColor: '#22C55E',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                            }}
                            title="WhatsApp Chat"
                          >
                            <MessageSquare size={15} fill="#FFFFFF" />
                          </a>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)', fontWeight: 600 }}>
                            <Phone size={14} color="var(--brand-emerald)" />
                            <a href={`tel:${selectedLeadForFullView.parentPhone}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                              {selectedLeadForFullView.parentPhone}
                            </a>
                          </span>

                          {selectedLeadForFullView.parentEmail && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Mail size={14} />
                              <span>{selectedLeadForFullView.parentEmail}</span>
                            </span>
                          )}

                          {!isEditingAcademic ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--brand-teal)', fontWeight: 700 }}>
                                <BookOpen size={14} />
                                <span>
                                  {selectedLeadForFullView.gradeClass} (
                                  {Array.isArray(selectedLeadForFullView.subjectsNeeded)
                                    ? selectedLeadForFullView.subjectsNeeded.join(', ')
                                    : selectedLeadForFullView.subjectsNeeded.replace(/[\[\]"]/g, '')}
                                  )
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const subjects = Array.isArray(selectedLeadForFullView.subjectsNeeded)
                                    ? selectedLeadForFullView.subjectsNeeded.join(', ')
                                    : selectedLeadForFullView.subjectsNeeded.replace(/[\[\]"]/g, '');
                                  setEditGradeClass(selectedLeadForFullView.gradeClass);
                                  setEditSubjectsNeeded(subjects);
                                  setIsEditingAcademic(true);
                                }}
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #CBD5E1',
                                  backgroundColor: '#F8FAFC',
                                  color: '#0F172A',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  transition: 'all 0.15s ease',
                                }}
                                title="Edit Class & Subjects"
                              >
                                <Pencil size={11} color="#0EA5E9" />
                                <span>Edit</span>
                              </button>
                            </div>
                          ) : (
                            <form
                              onSubmit={handleSaveAcademicDetails}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.65rem',
                                backgroundColor: '#F8FAFC',
                                border: '1.5px solid #0EA5E9',
                                padding: '0.85rem 1rem',
                                borderRadius: '12px',
                                width: '100%',
                                marginTop: '0.5rem',
                                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.1)',
                              }}
                            >
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', alignItems: 'flex-start' }}>
                                {/* Searchable / Typeable Class */}
                                <div>
                                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                                    Student Class / Grade (Search or Type)
                                  </div>
                                  <SearchableSelect
                                    placeholder="Type or select class..."
                                    options={CLASS_OPTIONS}
                                    value={editGradeClass}
                                    onChange={(val) => {
                                      setEditGradeClass(val);
                                    }}
                                    required
                                  />
                                </div>

                                {/* Searchable / Typeable Subject */}
                                <div>
                                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                                    Subjects Needed (Search or Type)
                                  </div>
                                  <SearchableSelect
                                    placeholder="Type or select subject..."
                                    options={getSubjectsForClass(editGradeClass)}
                                    value={editSubjectsNeeded}
                                    onChange={(val) => setEditSubjectsNeeded(val)}
                                    required
                                  />
                                </div>
                              </div>

                              {/* Quick Suggested Subject Chips */}
                              <div>
                                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', marginBottom: '0.25rem' }}>
                                  Quick Select Subjects for {editGradeClass || 'selected class'}:
                                </div>
                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                  {getSubjectsForClass(editGradeClass).slice(0, 8).map((subj) => {
                                    const isIncluded = editSubjectsNeeded.toLowerCase().includes(subj.toLowerCase());
                                    return (
                                      <button
                                        key={subj}
                                        type="button"
                                        onClick={() => {
                                          if (isIncluded) {
                                            const parts = editSubjectsNeeded.split(',').map((s) => s.trim()).filter((s) => s.toLowerCase() !== subj.toLowerCase());
                                            setEditSubjectsNeeded(parts.join(', '));
                                          } else {
                                            const parts = editSubjectsNeeded ? editSubjectsNeeded.split(',').map((s) => s.trim()).filter(Boolean) : [];
                                            if (!parts.some((p) => p.toLowerCase() === subj.toLowerCase())) {
                                              parts.push(subj);
                                            }
                                            setEditSubjectsNeeded(parts.join(', '));
                                          }
                                        }}
                                        style={{
                                          padding: '2px 8px',
                                          borderRadius: '6px',
                                          fontSize: '0.72rem',
                                          fontWeight: 700,
                                          border: isIncluded ? '1px solid #0284C7' : '1px solid #CBD5E1',
                                          backgroundColor: isIncluded ? '#E0F2FE' : '#FFFFFF',
                                          color: isIncluded ? '#0369A1' : '#334155',
                                          cursor: 'pointer',
                                          transition: 'all 0.12s ease',
                                        }}
                                      >
                                        {isIncluded ? '✓ ' : '+ '}
                                        {subj}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                                <button
                                  type="button"
                                  onClick={() => setIsEditingAcademic(false)}
                                  style={{
                                    padding: '0.4rem 0.85rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#FFFFFF',
                                    color: '#64748B',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={isSavingAcademic}
                                  style={{
                                    padding: '0.4rem 1.1rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#0F172A',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: 800,
                                    cursor: isSavingAcademic ? 'not-allowed' : 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)',
                                  }}
                                >
                                  <Check size={14} />
                                  <span>{isSavingAcademic ? 'Saving...' : 'Save Academic Details'}</span>
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      {getStatusBadge(selectedLeadForFullView.status)}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {/* Follow-up & Schedule Details */}
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-hairline)', padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={16} color="var(--brand-teal)" />
                        <span>Schedule &amp; Dates</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Next Scheduled Follow-up</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                            {selectedLeadForFullView.nextFollowupDate || selectedLeadForFullView.demoDate ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#1D4ED8', fontWeight: 700 }}>
                                <Calendar size={13} />
                                {new Date(selectedLeadForFullView.nextFollowupDate || selectedLeadForFullView.demoDate!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Not Scheduled</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Inquiry Received On</div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            {new Date(selectedLeadForFullView.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tuition Preferences */}
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-hairline)', padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={16} color="var(--brand-teal)" />
                        <span>Tuition Specifics</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                        <div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Locality</div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            📍 {selectedLeadForFullView.formattedAddress || selectedLeadForFullView.locality}
                          </div>
                          {selectedLeadForFullView.latitude && selectedLeadForFullView.longitude && (
                            <a
                              href={`https://www.google.com/maps?q=${selectedLeadForFullView.latitude},${selectedLeadForFullView.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '4px' }}
                            >
                              🗺️ View on Google Maps ↗
                            </a>
                          )}
                        </div>

                        <div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Teaching Mode</div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                            {selectedLeadForFullView.preferredMode === 'OFFLINE_HOME' ? '🏠 Home Visit' : selectedLeadForFullView.preferredMode === 'ONLINE_LIVE' ? '💻 Online 1-on-1' : '🏫 Center Visit'}
                          </div>
                        </div>

                        {selectedLeadForFullView.assignedTutor && (
                          <div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Tutor</div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--brand-emerald)', marginTop: '2px' }}>
                              🎓 {selectedLeadForFullView.assignedTutor}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Activity Timeline Card */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid var(--border-hairline)', padding: '1.5rem' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={18} color="#64748B" />
                      <span>Activity Timeline</span>
                    </div>

                    <div style={{ position: 'relative', paddingLeft: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Vertical Connecting Line */}
                      <div style={{ position: 'absolute', left: '6px', top: '12px', bottom: '12px', width: '2px', backgroundColor: '#E2E8F0' }} />

                      {selectedLeadForFullView.activities && selectedLeadForFullView.activities.length > 0 ? (
                        selectedLeadForFullView.activities.map((act) => {
                          const { status, note, followup } = parseActivity(act);
                          const isGreen = status === 'INTERESTED' || status === 'CONTACTED' || status === 'TUITION_CONFIRMED' || status === 'DEMO_SCHEDULED';
                          const dotColor = isGreen ? '#22C55E' : '#6366F1';

                          return (
                            <div key={act.id} style={{ position: 'relative' }}>
                              {/* Timeline Node Dot */}
                              <div
                                style={{
                                  position: 'absolute',
                                  left: '-1.75rem',
                                  top: '12px',
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  backgroundColor: dotColor,
                                  border: '2px solid #FFFFFF',
                                  boxShadow: `0 0 0 2px ${isGreen ? '#BBF7D0' : '#DDD6FE'}`,
                                }}
                              />

                              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '1rem 1.25rem', border: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                  <div>
                                    {getStatusBadge(status)}
                                  </div>
                                  <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>
                                    {new Date(act.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, {new Date(act.createdAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                                  </span>
                                </div>

                                <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <User size={12} color="#64748B" />
                                  <span>Updated by: <strong style={{ color: '#1E293B', fontWeight: 600 }}>{act.performedBy}</strong></span>
                                </div>

                                {note && (
                                  <div style={{ fontSize: '0.88rem', color: '#1E293B', lineHeight: 1.5, fontWeight: 500 }}>
                                    {note}
                                  </div>
                                )}

                                {followup && (
                                  <div style={{ fontSize: '0.74rem', color: '#1D4ED8', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#EFF6FF', padding: '0.2rem 0.55rem', borderRadius: '6px', marginTop: '0.35rem' }}>
                                    <Calendar size={11} />
                                    <span>Next Follow-up: {followup}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              left: '-1.75rem',
                              top: '12px',
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#6366F1',
                              border: '2px solid #FFFFFF',
                              boxShadow: '0 0 0 2px #DDD6FE',
                            }}
                          />
                          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '1rem 1.25rem', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                              <span style={{ padding: '0.2rem 0.75rem', borderRadius: '999px', backgroundColor: '#EDE9FE', color: '#6D28D9', fontWeight: 700, fontSize: '0.74rem' }}>
                                Enquiry Created
                              </span>
                              <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600 }}>
                                {new Date(selectedLeadForFullView.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '0.35rem' }}>
                              Updated by: <strong style={{ color: '#1E293B' }}>System Lead Desk</strong>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: '#1E293B' }}>
                              {selectedLeadForFullView.notes || 'Inquiry logged into TuitionForHome CRM system.'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* LEADS DESK TABLE VIEW */
                <div>
                  {/* Header with Search & Date Filters */}
                  <div className="apple-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      {/* Search Input */}
                      <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          placeholder="Search name, mobile, email or course / subjects..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="form-control"
                          style={{ paddingLeft: '2.75rem', borderRadius: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-hairline)' }}
                        />
                      </div>

                      {/* Date Filter & Reset */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setActiveFilter('ALL');
                            setCurrentPage(1);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700 }}
                        >
                          <RotateCcw size={14} />
                          <span>Reset</span>
                        </button>
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
                            onClick={() => {
                              setActiveFilter(tab.id);
                              setCurrentPage(1);
                            }}
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

                  {/* CRM Leads Structured Table Card */}
                  <div className="apple-card" style={{ padding: 0, overflow: 'visible', backgroundColor: '#FFFFFF', border: '1px solid var(--border-hairline)', borderRadius: '16px' }}>
                    <div style={{ overflow: 'visible', position: 'relative' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #CBD5E1', backgroundColor: '#F8FAFC' }}>
                          <th style={{ padding: '0.55rem 0.75rem', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Student Details
                          </th>
                          <th style={{ padding: '0.55rem 0.75rem', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Course &amp; Subjects
                          </th>
                          <th style={{ padding: '0.55rem 0.75rem', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Status
                          </th>
                          <th style={{ padding: '0.55rem 0.75rem', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Follow-up Date
                          </th>
                          <th style={{ padding: '0.55rem 0.75rem', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedLeads.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                              No leads found matching current filter.
                            </td>
                          </tr>
                        ) : (
                          paginatedLeads.map((lead, index) => {
                            const subjects = Array.isArray(lead.subjectsNeeded)
                              ? lead.subjectsNeeded.join(', ')
                              : lead.subjectsNeeded.replace(/[\[\]"]/g, '');

                            const isHovered = hoveredLeadId === lead.id;
                            const hasOverdue = lead.nextFollowupDate && isOverdue(lead.nextFollowupDate);
                            const hasToday = lead.nextFollowupDate && isToday(lead.nextFollowupDate);
                            const showAbove = paginatedLeads.length <= 3 || index >= paginatedLeads.length - 2;

                            return (
                              <tr
                                key={lead.id}
                                onClick={() => setSelectedLeadForFullView(lead)}
                                onMouseEnter={() => handleRowMouseEnter(lead.id)}
                                onMouseMove={() => {
                                  if (hoveredLeadId !== lead.id && !hoverTimeoutRef.current) {
                                    handleRowMouseEnter(lead.id);
                                  }
                                }}
                                onMouseLeave={handleRowMouseLeave}
                                style={{
                                  borderBottom: '1px solid #E2E8F0',
                                  backgroundColor: isHovered ? '#F8FAFC' : '#FFFFFF',
                                  transition: 'background-color 0.15s ease',
                                  position: 'relative',
                                  cursor: 'pointer',
                                }}
                              >
                                {/* Student Details */}
                                <td style={{ padding: '0.45rem 0.75rem' }}>
                                  <div>
                                    <div
                                      style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.86rem' }}
                                      title="Click to view details"
                                    >
                                      {lead.parentName.toLowerCase()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.72rem', color: '#64748B', marginTop: '2px', flexWrap: 'wrap' }}>
                                      <a
                                        href={`tel:${lead.parentPhone}`}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                                      >
                                        <Phone size={10} color="#64748B" />
                                        <span>{lead.parentPhone}</span>
                                      </a>
                                      {lead.parentEmail && (
                                        <span
                                          onClick={(e) => e.stopPropagation()}
                                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                                        >
                                          <Mail size={10} color="#64748B" />
                                          <span>{lead.parentEmail}</span>
                                        </span>
                                      )}
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <Calendar size={10} color="#64748B" />
                                        <span>{new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* Course / Class & Subjects */}
                                <td style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
                                  <div style={{ fontWeight: 600, color: '#334155' }}>
                                    {lead.gradeClass}
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>
                                    {subjects}
                                  </div>
                                </td>

                                {/* Status */}
                                <td style={{ padding: '0.45rem 0.75rem', position: 'relative' }}>
                                  <div>
                                    {getStatusBadge(lead.status)}
                                  </div>
                                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>
                                    Updated {new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                  </div>

                                  {/* Clean Hover Timeline Popover (Matching User's Screenshot 1) */}
                                  {isHovered && (
                                    <div
                                      style={{
                                        position: 'absolute',
                                        left: '-40px',
                                        ...(showAbove ? { bottom: 'calc(100% + 6px)' } : { top: 'calc(100% + 6px)' }),
                                        zIndex: 99999,
                                        backgroundColor: '#FFFFFF',
                                        color: '#1E293B',
                                        padding: '0.65rem 0.85rem',
                                        borderRadius: '6px',
                                        border: '1px solid #334155',
                                        fontSize: '0.74rem',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                                        width: '320px',
                                        maxWidth: 'calc(100vw - 40px)',
                                        textAlign: 'left',
                                        pointerEvents: 'none',
                                        lineHeight: '1.45',
                                      }}
                                    >
                                      <div style={{ color: '#0F172A', fontWeight: 600 }}>
                                        Status: <span>{lead.status ? lead.status.replace(/_/g, ' ') : 'New Lead'}</span>
                                      </div>
                                      <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>
                                        Follow-up: <span>{lead.nextFollowupDate ? new Date(lead.nextFollowupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not Scheduled'}</span>
                                      </div>
                                      <div style={{ fontWeight: 700, color: '#334155', marginTop: '4px' }}>
                                        Timeline:
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                                        {lead.activities && lead.activities.length > 0 ? (
                                          lead.activities.slice(0, 3).map((act) => {
                                            const { formattedStatus, note } = parseActivity(act);
                                            return (
                                              <div key={act.id} style={{ fontSize: '0.72rem', color: '#334155' }}>
                                                <span style={{ color: '#64748B' }}>{new Date(act.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}: </span>
                                                <strong>{formattedStatus}</strong> - <span>{note || 'Status updated'}</span>
                                              </div>
                                            );
                                          })
                                        ) : (
                                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                            {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}: Enquiry created
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </td>

                                {/* Follow-up Date */}
                                <td style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap', color: '#334155' }}>
                                  {lead.nextFollowupDate ? (
                                    <div>
                                      <span style={{ fontWeight: 600 }}>
                                        {new Date(lead.nextFollowupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                      </span>
                                      {hasOverdue && <span style={{ marginLeft: '4px', fontSize: '0.66rem', color: '#DC2626', fontWeight: 800, backgroundColor: '#FEE2E2', padding: '1px 4px', borderRadius: '3px' }}>Overdue</span>}
                                      {hasToday && <span style={{ marginLeft: '4px', fontSize: '0.66rem', color: '#1D4ED8', fontWeight: 800, backgroundColor: '#EFF6FF', padding: '1px 4px', borderRadius: '3px' }}>Today</span>}
                                    </div>
                                  ) : (
                                    <span style={{ color: '#94A3B8' }}>-</span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td style={{ padding: '0.45rem 0.75rem', textAlign: 'right', whiteSpace: 'nowrap', position: 'relative' }}>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openUpdateModal(lead);
                                      }}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.2rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '6px',
                                        fontSize: '0.73rem',
                                        fontWeight: 700,
                                        border: '1px solid #E0E7FF',
                                        color: '#4F46E5',
                                        backgroundColor: '#EEF2FF',
                                        cursor: 'pointer',
                                      }}
                                      title="Log Follow-up & Change Status"
                                    >
                                      <RotateCcw size={11} />
                                      <span>Action</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedLeadForFullView(lead);
                                      }}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.2rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '6px',
                                        fontSize: '0.73rem',
                                        fontWeight: 700,
                                        border: '1px solid #E2E8F0',
                                        color: '#334155',
                                        backgroundColor: '#F8FAFC',
                                        cursor: 'pointer',
                                      }}
                                      title="View Full Details & Timeline"
                                    >
                                      <Eye size={11} />
                                      <span>View</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedLeadForMatching(lead);
                                      }}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.2rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '6px',
                                        fontSize: '0.73rem',
                                        fontWeight: 700,
                                        border: '1px solid #FEF3C7',
                                        color: '#B45309',
                                        backgroundColor: '#FFFBEB',
                                        cursor: 'pointer',
                                      }}
                                      title="Match Nearby Tutor"
                                    >
                                      <Users size={11} />
                                      <span>Assign</span>
                                    </button>
                                  </div>
                                </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Bar */}
                    {filteredLeads.length > 0 && (
                      <div
                        style={{
                          padding: '0.75rem 1.25rem',
                          borderTop: '1px solid #E2E8F0',
                          backgroundColor: '#FAFAFA',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          fontSize: '0.78rem',
                          color: '#475569',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span>
                            Showing <strong>{startIndex + 1}</strong> to <strong>{endIndex}</strong> of <strong>{filteredLeads.length}</strong> enquiries
                          </span>

                          {/* Rows per page selector */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Per page:</span>
                            <select
                              value={itemsPerPage}
                              onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                              }}
                              style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                color: '#334155',
                                cursor: 'pointer',
                              }}
                            >
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={20}>20</option>
                              <option value={50}>50</option>
                            </select>
                          </div>
                        </div>

                        {/* Page Number Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            style={{
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: currentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                              color: currentPage === 1 ? '#94A3B8' : '#334155',
                              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                              fontWeight: 700,
                              fontSize: '0.74rem',
                            }}
                          >
                            ← Prev
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                            const isCurrent = pageNum === currentPage;
                            return (
                              <button
                                key={pageNum}
                                type="button"
                                onClick={() => setCurrentPage(pageNum)}
                                style={{
                                  padding: '0.25rem 0.55rem',
                                  borderRadius: '6px',
                                  border: `1px solid ${isCurrent ? 'var(--brand-teal)' : '#CBD5E1'}`,
                                  backgroundColor: isCurrent ? 'var(--brand-teal)' : '#FFFFFF',
                                  color: isCurrent ? '#FFFFFF' : '#334155',
                                  cursor: 'pointer',
                                  fontWeight: isCurrent ? 800 : 600,
                                  fontSize: '0.74rem',
                                  minWidth: '28px',
                                }}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            style={{
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: currentPage === totalPages ? '#F1F5F9' : '#FFFFFF',
                              color: currentPage === totalPages ? '#94A3B8' : '#334155',
                              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                              fontWeight: 700,
                              fontSize: '0.74rem',
                            }}
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4.2: REGISTERED PARENTS DIRECTORY */}
          {activeAdminTab === 'PARENTS' && (() => {
            // Filter registered parents
            const filteredParents = registeredParents.filter((parent) => {
              if (parentStatusFilter === 'ACTIVE_TUITION' && parent.activeTuitionsCount === 0) return false;
              if (parentStatusFilter === 'VERIFIED' && !parent.emailVerified) return false;

              if (parentSearchText.trim()) {
                const q = parentSearchText.toLowerCase();
                const matches =
                  parent.name.toLowerCase().includes(q) ||
                  parent.phone.includes(q) ||
                  parent.email.toLowerCase().includes(q);
                if (!matches) return false;
              }

              return true;
            });

            // Pagination calculation
            const totalParentPages = Math.ceil(filteredParents.length / parentsPerPage) || 1;
            const parentStartIndex = (parentCurrentPage - 1) * parentsPerPage;
            const parentEndIndex = Math.min(parentStartIndex + parentsPerPage, filteredParents.length);
            const paginatedParents = filteredParents.slice(parentStartIndex, parentEndIndex);

            return (
              <div>
                {/* Filter Toolbar */}
                <div className="apple-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    {/* Live Search */}
                    <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Search by registered parent name, email, or mobile..."
                        value={parentSearchText}
                        onChange={(e) => {
                          setParentSearchText(e.target.value);
                          setParentCurrentPage(1);
                        }}
                        className="form-control"
                        style={{ paddingLeft: '2.4rem', borderRadius: '10px', backgroundColor: '#F8FAFC', fontSize: '0.86rem', border: '1px solid var(--border-hairline)' }}
                      />
                    </div>

                    {/* Per Page Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#64748B' }}>
                      <span>Show:</span>
                      <select
                        value={parentsPerPage}
                        onChange={(e) => {
                          setParentsPerPage(Number(e.target.value));
                          setParentCurrentPage(1);
                        }}
                        className="form-control"
                        style={{ width: '70px', padding: '0.3rem 0.5rem', borderRadius: '8px', fontSize: '0.78rem' }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                      { id: 'ALL', label: 'All Registered Parents', count: registeredParents.length },
                      { id: 'ACTIVE_TUITION', label: '🟢 With Active Tuitions', count: registeredParents.filter((p) => p.activeTuitionsCount > 0).length },
                      { id: 'VERIFIED', label: '✓ Verified Accounts', count: registeredParents.filter((p) => p.emailVerified).length },
                    ].map((pill) => {
                      const isActive = parentStatusFilter === pill.id;
                      return (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => {
                            setParentStatusFilter(pill.id as any);
                            setParentCurrentPage(1);
                          }}
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
                            transition: 'all 0.15s ease',
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

                {/* HIGH CAPACITY TABLE VIEW */}
                <div className="apple-card" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid var(--border-hairline)', marginBottom: '1.25rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Parent Account</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Joined On</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Total Inquiries</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Active Tuitions</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Account Status</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parentsLoading ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                            Loading registered parents...
                          </td>
                        </tr>
                      ) : paginatedParents.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                            No registered parent accounts found matching current filter.
                          </td>
                        </tr>
                      ) : (
                        paginatedParents.map((parent) => {
                          return (
                            <tr
                              key={parent.id}
                              style={{
                                borderBottom: '1px solid #F1F5F9',
                                transition: 'background-color 0.12s ease',
                              }}
                            >
                              {/* 1. Parent Account */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>{parent.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                                  <span>📞 {parent.phone}</span>
                                  <span>✉️ {parent.email}</span>
                                  {parent.emailVerified && (
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#166534', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                                      ✓ Verified
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 2. Joined On */}
                              <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#334155' }}>
                                {new Date(parent.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>

                              {/* 3. Total Inquiries */}
                              <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                                {parent.totalInquiries > 0 ? (
                                  <span style={{ color: '#0284C7' }}>{parent.totalInquiries} {parent.totalInquiries === 1 ? 'Inquiry' : 'Inquiries'}</span>
                                ) : (
                                  <span style={{ color: '#94A3B8' }}>0 Inquiries</span>
                                )}
                              </td>

                              {/* 4. Active Tuitions */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                {parent.activeTuitionsCount > 0 ? (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', backgroundColor: '#DCFCE7', color: '#166534' }}>
                                    🟢 {parent.activeTuitionsCount} Active
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>None</span>
                                )}
                              </td>

                              {/* 5. Account Status */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#334155' }}>
                                  Registered Member
                                </span>
                              </td>

                              {/* 6. Actions */}
                              <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                                  {parent.phone && parent.phone !== 'Not Provided' && (
                                    <>
                                      <a
                                        href={`tel:${parent.phone}`}
                                        style={{
                                          padding: '0.35rem 0.55rem',
                                          borderRadius: '6px',
                                          backgroundColor: '#F1F5F9',
                                          color: '#0F172A',
                                          textDecoration: 'none',
                                          fontSize: '0.72rem',
                                          fontWeight: 700,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                        }}
                                        title="Call Parent"
                                      >
                                        <Phone size={11} />
                                        <span>Call</span>
                                      </a>
                                      <a
                                        href={`https://wa.me/91${parent.phone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          padding: '0.35rem 0.55rem',
                                          borderRadius: '6px',
                                          backgroundColor: '#22C55E',
                                          color: '#FFFFFF',
                                          textDecoration: 'none',
                                          fontSize: '0.72rem',
                                          fontWeight: 700,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                        }}
                                        title="WhatsApp Chat"
                                      >
                                        <MessageSquare size={11} fill="#FFFFFF" />
                                        <span>Chat</span>
                                      </a>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Toolbar */}
                {filteredParents.length > 0 && (
                  <div
                    style={{
                      padding: '0.75rem 1.25rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid var(--border-hairline)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      fontSize: '0.78rem',
                      color: '#475569',
                    }}
                  >
                    <div>
                      Showing <strong>{parentStartIndex + 1}</strong> to <strong>{parentEndIndex}</strong> of <strong>{filteredParents.length}</strong> registered parents
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <button
                        type="button"
                        disabled={parentCurrentPage === 1}
                        onClick={() => setParentCurrentPage((p) => Math.max(1, p - 1))}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: parentCurrentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                          color: parentCurrentPage === 1 ? '#94A3B8' : '#334155',
                          cursor: parentCurrentPage === 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                        }}
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: totalParentPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setParentCurrentPage(pageNum)}
                          style={{
                            minWidth: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            border: parentCurrentPage === pageNum ? 'none' : '1px solid #CBD5E1',
                            backgroundColor: parentCurrentPage === pageNum ? '#0F172A' : '#FFFFFF',
                            color: parentCurrentPage === pageNum ? '#FFFFFF' : '#334155',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                          }}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={parentCurrentPage >= totalParentPages}
                        onClick={() => setParentCurrentPage((p) => Math.min(totalParentPages, p + 1))}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: parentCurrentPage >= totalParentPages ? '#F1F5F9' : '#FFFFFF',
                          color: parentCurrentPage >= totalParentPages ? '#94A3B8' : '#334155',
                          cursor: parentCurrentPage >= totalParentPages ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}


          {activeAdminTab === 'TUTOR_ALLOCATION' && (() => {
            // Filter Tutors
            const filteredTutorList = allTutors.filter((tut) => {
              const isHidden = hiddenTutorIds.includes(tut.id);
              const isVerified = verifiedTutorIds.includes(tut.id);

              // KYC / Hidden Status Filter
              if (tutorKycFilter === 'HIDDEN' && !isHidden) return false;
              if (tutorKycFilter === 'VERIFIED' && (!isVerified || isHidden)) return false;
              if (tutorKycFilter === 'PENDING' && (isVerified || isHidden)) return false;
              if (tutorKycFilter === 'ALL' && isHidden) return false;

              // Subject Filter
              if (tutorSubjectFilter !== 'ALL') {
                const matchesSubject = (tut.subjects || []).some((s: string) => s.toLowerCase().includes(tutorSubjectFilter.toLowerCase()));
                if (!matchesSubject) return false;
              }

              // Search Text Filter
              if (tutorSearchText.trim()) {
                const q = tutorSearchText.toLowerCase();
                const matchesQuery =
                  tut.name.toLowerCase().includes(q) ||
                  tut.email.toLowerCase().includes(q) ||
                  tut.phone.includes(q) ||
                  tut.highestDegree.toLowerCase().includes(q) ||
                  (tut.serviceAreas || []).some((a: string) => a.toLowerCase().includes(q)) ||
                  (tut.subjects || []).some((s: string) => s.toLowerCase().includes(q));
                if (!matchesQuery) return false;
              }

              return true;
            });

            // Pagination Calculations
            const tutorAllocTotalPages = Math.ceil(filteredTutorList.length / tutorsAllocationPerPage) || 1;
            const tutorAllocStartIndex = (tutorAllocationCurrentPage - 1) * tutorsAllocationPerPage;
            const tutorAllocEndIndex = Math.min(tutorAllocStartIndex + tutorsAllocationPerPage, filteredTutorList.length);
            const paginatedTutorList = filteredTutorList.slice(tutorAllocStartIndex, tutorAllocEndIndex);

            return (
              <div>
                {/* Clean Top Header */}
                <div className="apple-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div className="badge badge-emerald" style={{ marginBottom: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} />
                        <span>TUTOR DIRECTORY &amp; PROXIMITY ALLOCATION</span>
                      </div>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                        Tutor Management &amp; Lead Dispatch
                      </h2>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px', margin: 0 }}>
                        Search, verify KYC, and match student inquiries based on tutor travel radius.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ padding: '0.5rem 0.85rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>TOTAL TUTORS</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{allTutors.length}</div>
                      </div>
                      <div style={{ padding: '0.5rem 0.85rem', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #DCFCE7', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>VERIFIED PRO</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803D' }}>{verifiedTutorIds.length}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters Toolbar */}
                <div className="apple-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    {/* Search Input */}
                    <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Search tutor by name, phone, subject, or sector..."
                        value={tutorSearchText}
                        onChange={(e) => {
                          setTutorSearchText(e.target.value);
                          setTutorAllocationCurrentPage(1);
                        }}
                        className="form-control"
                        style={{ paddingLeft: '2.4rem', borderRadius: '10px', backgroundColor: '#F8FAFC', fontSize: '0.86rem', border: '1px solid var(--border-hairline)' }}
                      />
                    </div>

                    {/* Subject Filter Dropdown */}
                    <select
                      value={tutorSubjectFilter}
                      onChange={(e) => {
                        setTutorSubjectFilter(e.target.value);
                        setTutorAllocationCurrentPage(1);
                      }}
                      style={{
                        padding: '0.55rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        backgroundColor: '#F8FAFC',
                        color: '#0F172A',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="ALL">All Subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Commerce">Commerce &amp; Accounts</option>
                      <option value="English">English Literature</option>
                      <option value="Computer">Coding &amp; Python</option>
                      <option value="Primary">Primary (Class 1-5)</option>
                    </select>
                  </div>

                  {/* KYC & Visibility Status Filter Pills */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                      { id: 'ALL', label: 'All Tutors', count: allTutors.filter((t) => !hiddenTutorIds.includes(t.id)).length },
                      { id: 'VERIFIED', label: '✓ Verified Pro', count: allTutors.filter((t) => verifiedTutorIds.includes(t.id) && !hiddenTutorIds.includes(t.id)).length },
                      { id: 'PENDING', label: '⏳ Pending KYC', count: allTutors.filter((t) => !verifiedTutorIds.includes(t.id) && !hiddenTutorIds.includes(t.id)).length },
                      { id: 'HIDDEN', label: '🙈 Hidden', count: hiddenTutorIds.length },
                    ].map((pill) => {
                      const isActive = tutorKycFilter === pill.id;
                      return (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => {
                            setTutorKycFilter(pill.id as any);
                            setTutorAllocationCurrentPage(1);
                          }}
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
                            transition: 'all 0.15s ease',
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

                {/* TUTOR STRUCTURED TABLE (DESKTOP) */}
                <div className="desktop-only-table apple-card" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid var(--border-hairline)', marginBottom: '1.25rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Tutor &amp; Qualification</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Subjects</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Location &amp; Radius</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Rate &amp; Rating</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Open Leads</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTutorList.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                            No tutors found matching current filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedTutorList.map((tut) => {
                          const isHidden = hiddenTutorIds.includes(tut.id);
                          const isVerified = verifiedTutorIds.includes(tut.id);

                          // Matching leads count
                          const matchingLeads = leads.filter((l) => {
                            const subjects = l.subjectsNeeded || '';
                            const matchesSubject = (tut.subjects || []).some((s: string) => subjects.toLowerCase().includes(s.toLowerCase()));
                            return matchesSubject && l.status !== 'TUITION_CONFIRMED' && l.status !== 'LOST';
                          });

                          return (
                            <tr
                              key={tut.id}
                              style={{
                                borderBottom: '1px solid #F1F5F9',
                                cursor: 'pointer',
                                transition: 'background-color 0.12s ease',
                                backgroundColor: isHidden ? '#FAFAFA' : '#FFFFFF',
                                opacity: isHidden ? 0.75 : 1,
                              }}
                              onClick={() => {
                                window.open(`/admin/tutors/${tut.id}`, '_blank');
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isHidden ? '#FAFAFA' : '#FFFFFF'; }}
                            >
                              {/* 1. Tutor Info */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={tut.avatarUrl}
                                    alt={tut.name}
                                    style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }}
                                  />
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                      <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>{tut.name}</span>
                                      {isVerified ? (
                                        <span style={{ fontSize: '0.66rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#166534' }}>
                                          ✓ Verified
                                        </span>
                                      ) : (
                                        <span style={{ fontSize: '0.66rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#92400E' }}>
                                          ⏳ KYC Due
                                        </span>
                                      )}
                                      {isHidden && (
                                        <span style={{ fontSize: '0.66rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#64748B' }}>
                                          🙈 Hidden
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '1px' }}>
                                      {tut.highestDegree} • {tut.experienceYears}y exp
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Subjects */}
                              <td style={{ padding: '0.85rem 1rem', color: '#334155', fontWeight: 600, fontSize: '0.8rem' }}>
                                <div style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {tut.subjects.join(', ')}
                                </div>
                              </td>

                              {/* 3. Locality & Radius */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                                  📍 {tut.serviceAreas[0]}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                  Radius: {tut.travelRadiusKm} KM
                                </div>
                              </td>

                              {/* 4. Rate & Rating */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F766E' }}>
                                  {tut.hourlyRateHomeMin && tut.hourlyRateHomeMax && tut.hourlyRateHomeMin !== tut.hourlyRateHomeMax
                                    ? `₹${tut.hourlyRateHomeMin} - ₹${tut.hourlyRateHomeMax}/hr`
                                    : `₹${tut.hourlyRateHome || tut.hourlyRateHomeMin || 500}/hr`}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  <Star size={11} fill="#D97706" /> {tut.rating ? Number(tut.rating).toFixed(1) : '5.0'} ({tut.totalReviews || 0})
                                </div>
                              </td>

                              {/* 5. Matching Leads */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.74rem',
                                    fontWeight: 800,
                                    backgroundColor: matchingLeads.length > 0 ? '#DCFCE7' : '#F1F5F9',
                                    color: matchingLeads.length > 0 ? '#15803D' : '#64748B',
                                  }}
                                >
                                  {matchingLeads.length} Matching Leads
                                </span>
                              </td>

                              {/* 6. Action Button */}
                              <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                <a
                                  href={`/admin/tutors/${tut.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    padding: '0.45rem 0.85rem',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--brand-teal)',
                                    color: '#FFFFFF',
                                    textDecoration: 'none',
                                    fontSize: '0.78rem',
                                    fontWeight: 800,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
                                  }}
                                >
                                  <Eye size={14} />
                                  <span>View &amp; Audit Credentials</span>
                                </a>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE RESPONSIVE CARDS (ZERO HORIZONTAL SCROLL) */}
                <div className="mobile-only-cards" style={{ display: 'none', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {paginatedTutorList.map((tut) => {
                    const isHidden = hiddenTutorIds.includes(tut.id);
                    const isVerified = verifiedTutorIds.includes(tut.id);

                    const matchingLeads = leads.filter((l) => {
                      const subjects = l.subjectsNeeded || '';
                      const matchesSubject = (tut.subjects || []).some((s: string) => subjects.toLowerCase().includes(s.toLowerCase()));
                      return matchesSubject && l.status !== 'TUITION_CONFIRMED' && l.status !== 'LOST';
                    });

                    return (
                      <div
                        key={tut.id}
                        className="apple-card"
                        onClick={() => {
                          setActiveTutor360(tut);
                          setActiveTutor360Tab('LEADS');
                        }}
                        style={{
                          padding: '1rem',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '14px',
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={tut.avatarUrl}
                            alt={tut.name}
                            style={{ width: '46px', height: '46px', borderRadius: '10px', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A' }}>{tut.name}</span>
                              <span style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 800 }}>⭐ {tut.rating}</span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                              {tut.highestDegree} • {tut.experienceYears}y exp
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                          <strong>Subjects:</strong> {tut.subjects.join(', ')}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.45rem', borderTop: '1px solid #F1F5F9' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F766E' }}>₹{tut.hourlyRateHome}/hr</span>
                          <span style={{ fontSize: '0.72rem', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#166534', fontWeight: 800 }}>
                            {matchingLeads.length} Matching Leads
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PAGINATION BAR */}
                {filteredTutorList.length > 0 && (
                  <div
                    style={{
                      padding: '0.75rem 1.25rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid var(--border-hairline)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      fontSize: '0.78rem',
                      color: '#475569',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span>
                        Showing <strong>{tutorAllocStartIndex + 1}</strong> to <strong>{tutorAllocEndIndex}</strong> of <strong>{filteredTutorList.length}</strong> tutors
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ color: '#94A3B8' }}>Per page:</span>
                        <select
                          value={tutorsAllocationPerPage}
                          onChange={(e) => {
                            setTutorsAllocationPerPage(Number(e.target.value));
                            setTutorAllocationCurrentPage(1);
                          }}
                          style={{
                            padding: '0.2rem 0.4rem',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#F8FAFC',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: '#334155',
                            cursor: 'pointer',
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <button
                        type="button"
                        disabled={tutorAllocationCurrentPage === 1}
                        onClick={() => setTutorAllocationCurrentPage((p) => Math.max(1, p - 1))}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: tutorAllocationCurrentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                          color: tutorAllocationCurrentPage === 1 ? '#94A3B8' : '#334155',
                          cursor: tutorAllocationCurrentPage === 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                        }}
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: tutorAllocTotalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setTutorAllocationCurrentPage(pageNum)}
                          style={{
                            minWidth: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            border: tutorAllocationCurrentPage === pageNum ? 'none' : '1px solid #CBD5E1',
                            backgroundColor: tutorAllocationCurrentPage === pageNum ? '#0F172A' : '#FFFFFF',
                            color: tutorAllocationCurrentPage === pageNum ? '#FFFFFF' : '#334155',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                          }}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={tutorAllocationCurrentPage >= tutorAllocTotalPages}
                        onClick={() => setTutorAllocationCurrentPage((p) => Math.min(tutorAllocTotalPages, p + 1))}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: tutorAllocationCurrentPage >= tutorAllocTotalPages ? '#F1F5F9' : '#FFFFFF',
                          color: tutorAllocationCurrentPage >= tutorAllocTotalPages ? '#94A3B8' : '#334155',
                          cursor: tutorAllocationCurrentPage >= tutorAllocTotalPages ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 4.5: TUTOR-PARENT CONNECT & COORDINATION DESK */}
          {activeAdminTab === 'COORDINATION' && (() => {
            // Filter all leads that have an assigned tutor or active placement
            const allAssignedPairs = leads.filter(
              (l) => Boolean(l.assignedTutor) || l.status === 'DEMO_SCHEDULED' || l.status === 'TUITION_CONFIRMED'
            );

            const filteredPairs = allAssignedPairs.filter((lead) => {
              const currentMilestone = leadCoordMilestones[lead.id] || (lead.status === 'TUITION_CONFIRMED' ? '1ST_SESSION_DONE' : '1ST_SESSION_PENDING');

              // Milestone Filter
              if (coordMilestoneFilter !== 'ALL' && currentMilestone !== coordMilestoneFilter) {
                return false;
              }

              // Search query filter
              if (coordSearch.trim()) {
                const q = coordSearch.toLowerCase();
                const tutorName = (lead.assignedTutor || '').toLowerCase();
                const parentName = (lead.parentName || '').toLowerCase();
                const locality = (lead.locality || '').toLowerCase();
                const grade = (lead.gradeClass || '').toLowerCase();
                const phone = lead.parentPhone || '';

                const matches =
                  parentName.includes(q) ||
                  tutorName.includes(q) ||
                  locality.includes(q) ||
                  grade.includes(q) ||
                  phone.includes(q);

                if (!matches) return false;
              }

              return true;
            });

            // Pagination
            const totalCoordPages = Math.ceil(filteredPairs.length / coordPerPage) || 1;
            const coordStartIndex = (coordCurrentPage - 1) * coordPerPage;
            const coordEndIndex = Math.min(coordStartIndex + coordPerPage, filteredPairs.length);
            const paginatedPairs = filteredPairs.slice(coordStartIndex, coordEndIndex);

            return (
              <div>
                {/* Header Banner */}
                <div className="apple-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div className="badge" style={{ marginBottom: '0.35rem', backgroundColor: '#E0F2FE', color: '#0369A1', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 800 }}>
                        <Users size={13} />
                        <span>ACTIVE TUITION COORDINATION DESK</span>
                      </div>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                        Tutor ⟷ Parent Communication &amp; Progress Hub
                      </h2>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px', margin: 0 }}>
                        Facilitate direct 2-way and 3-way calling, WhatsApp introductions, session tracking, and fee status.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                      <div style={{ padding: '0.5rem 0.85rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>ACTIVE PAIRS</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>{allAssignedPairs.length}</div>
                      </div>
                      <div style={{ padding: '0.5rem 0.85rem', backgroundColor: '#FEF3C7', borderRadius: '10px', border: '1px solid #FDE68A', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#92400E', fontWeight: 700 }}>1ST CLASS DUE</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#B45309' }}>
                          {allAssignedPairs.filter((p) => (leadCoordMilestones[p.id] || p.status) === 'DEMO_SCHEDULED' || leadCoordMilestones[p.id] === '1ST_SESSION_PENDING').length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Toolbar */}
                <div className="apple-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Search by parent name, phone, tutor name, or locality..."
                        value={coordSearch}
                        onChange={(e) => {
                          setCoordSearch(e.target.value);
                          setCoordCurrentPage(1);
                        }}
                        className="form-control"
                        style={{ paddingLeft: '2.4rem', borderRadius: '10px', backgroundColor: '#F8FAFC', fontSize: '0.86rem', border: '1px solid var(--border-hairline)' }}
                      />
                    </div>
                  </div>

                  {/* Milestone Filter Tabs */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                      { id: 'ALL', label: 'All Assigned Pairs', count: allAssignedPairs.length },
                      { id: '1ST_SESSION_PENDING', label: '🟡 1st Class Pending', count: allAssignedPairs.filter((p) => (leadCoordMilestones[p.id] || (p.status === 'DEMO_SCHEDULED' ? '1ST_SESSION_PENDING' : '')) === '1ST_SESSION_PENDING').length },
                      { id: '1ST_SESSION_DONE', label: '🟢 1st Class Done / Ongoing', count: allAssignedPairs.filter((p) => (leadCoordMilestones[p.id] || (p.status === 'TUITION_CONFIRMED' ? '1ST_SESSION_DONE' : '')) === '1ST_SESSION_DONE').length },
                      { id: 'FEE_PAID', label: '💰 Fee Deposited', count: allAssignedPairs.filter((p) => leadCoordMilestones[p.id] === 'FEE_PAID').length },
                      { id: 'REPLACE_REQ', label: '🔄 Replace Tutor Needed', count: allAssignedPairs.filter((p) => leadCoordMilestones[p.id] === 'REPLACE_REQ').length },
                    ].map((pill) => {
                      const isActive = coordMilestoneFilter === pill.id;
                      return (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => {
                            setCoordMilestoneFilter(pill.id as any);
                            setCoordCurrentPage(1);
                          }}
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
                            transition: 'all 0.15s ease',
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

                {/* PAIR CARDS CONTAINER */}
                {paginatedPairs.length === 0 ? (
                  <div className="apple-card" style={{ padding: '3.5rem 1rem', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤝</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>No assigned pairs found</div>
                    <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '0.35rem', maxWidth: '420px', margin: '0.35rem auto 0' }}>
                      Assign verified tutors to open student enquiries in the <strong>Shared Lead Desk</strong> or <strong>Tutor Allocator</strong> tab to start managing them here.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                    {paginatedPairs.map((lead) => {
                      const subjects = Array.isArray(lead.subjectsNeeded)
                        ? lead.subjectsNeeded.join(', ')
                        : (lead.subjectsNeeded || '').replace(/[\[\]"]/g, '');

                      // Find matching tutor object
                      const assignedTutorObj = allTutors.find(
                        (t) => t.name.toLowerCase() === (lead.assignedTutor || '').toLowerCase()
                      ) || allTutors[0];

                      const currentMilestone = leadCoordMilestones[lead.id] || (lead.status === 'TUITION_CONFIRMED' ? '1ST_SESSION_DONE' : '1ST_SESSION_PENDING');

                      const milestoneConfig: { [k: string]: { label: string; bg: string; text: string; icon: string } } = {
                        '1ST_SESSION_PENDING': { label: '🟡 1st Class Scheduled / Pending', bg: '#FEF3C7', text: '#92400E', icon: '🟡' },
                        '1ST_SESSION_DONE': { label: '🟢 1st Class Done & Ongoing', bg: '#DCFCE7', text: '#166534', icon: '🟢' },
                        'FEE_PAID': { label: '💰 Fee Deposited (Active)', bg: '#E0F2FE', text: '#0369A1', icon: '💰' },
                        'REPLACE_REQ': { label: '🔄 Tutor Replacement Requested', bg: '#FEE2E2', text: '#991B1B', icon: '🔄' },
                      };

                      const currentBadge = milestoneConfig[currentMilestone] || milestoneConfig['1ST_SESSION_PENDING'];

                      return (
                        <div
                          key={lead.id}
                          className="apple-card"
                          style={{
                            padding: '1.25rem',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1.5px solid #E2E8F0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          }}
                        >
                          {/* Pair Top Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>
                                Pair #{lead.id}
                              </span>
                              <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                • 📍 {lead.locality}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span
                                style={{
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  padding: '3px 9px',
                                  borderRadius: '6px',
                                  backgroundColor: currentBadge.bg,
                                  color: currentBadge.text,
                                }}
                              >
                                {currentBadge.label}
                              </span>
                            </div>
                          </div>

                          {/* Split View: Parent Box ⟷ Tutor Box */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            {/* 1. Parent & Student Card Box */}
                            <div
                              style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                backgroundColor: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>PARENT &amp; STUDENT</div>
                                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                                    {lead.parentName}
                                  </div>
                                </div>
                              </div>

                              <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                                📚 <strong>{lead.gradeClass}</strong> ({subjects})
                              </div>
                              <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                📍 {lead.locality} • Mode: <strong>{lead.preferredMode === 'OFFLINE_HOME' ? 'Home Visit' : 'Online'}</strong>
                              </div>

                              {/* Parent Contact Buttons */}
                              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                                <a
                                  href={`tel:${lead.parentPhone}`}
                                  style={{
                                    flex: 1,
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: '7px',
                                    border: '1px solid #CBD5E1',
                                    backgroundColor: '#FFFFFF',
                                    color: '#0F172A',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.3rem',
                                  }}
                                >
                                  <Phone size={13} color="#0F766E" />
                                  <span>Call Parent</span>
                                </a>

                                <a
                                  href={`https://wa.me/?text=${encodeURIComponent(
                                    `Hello ${lead.parentName},\n` +
                                    `This is SSSAM Academy regarding your home tuition enquiry for ${lead.gradeClass} (${subjects}).\n` +
                                    `Your assigned verified educator is *${lead.assignedTutor || assignedTutorObj.name}* (${assignedTutorObj.highestDegree}).\n\n` +
                                    `Please let us know your preferred time for the trial class.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    flex: 1,
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: '7px',
                                    border: '1px solid #86EFAC',
                                    backgroundColor: '#F0FDF4',
                                    color: '#15803D',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.3rem',
                                  }}
                                >
                                  <MessageSquare size={13} color="#15803D" />
                                  <span>WhatsApp Parent</span>
                                </a>
                              </div>
                            </div>

                            {/* 2. Assigned Educator Card Box */}
                            <div
                              style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                backgroundColor: '#F0FDF4',
                                border: '1px solid #DCFCE7',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={assignedTutorObj.avatarUrl}
                                    alt={assignedTutorObj.name}
                                    style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #86EFAC' }}
                                  />
                                  <div>
                                    <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>ASSIGNED TUTOR</div>
                                    <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A' }}>
                                      {lead.assignedTutor || assignedTutorObj.name}
                                    </div>
                                  </div>
                                </div>
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F766E' }}>
                                  ₹{assignedTutorObj.hourlyRateHome}/hr
                                </span>
                              </div>

                              <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                                🎓 {assignedTutorObj.highestDegree} • {assignedTutorObj.experienceYears}y exp
                              </div>
                              <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                📍 Base: {assignedTutorObj.serviceAreas[0]} (Radius: {assignedTutorObj.travelRadiusKm} KM)
                              </div>

                              {/* Tutor Contact Buttons */}
                              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid #DCFCE7' }}>
                                <a
                                  href={`tel:${assignedTutorObj.phone}`}
                                  style={{
                                    flex: 1,
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: '7px',
                                    border: '1px solid #CBD5E1',
                                    backgroundColor: '#FFFFFF',
                                    color: '#0F172A',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.3rem',
                                  }}
                                >
                                  <Phone size={13} color="#0F766E" />
                                  <span>Call Tutor</span>
                                </a>

                                <a
                                  href={`https://wa.me/?text=${encodeURIComponent(
                                    `Hello ${lead.assignedTutor || assignedTutorObj.name},\n` +
                                    `This is SSSAM Academy coordinator regarding student lead in *${lead.locality}*:\n` +
                                    `👤 *Parent:* ${lead.parentName} (${lead.parentPhone})\n` +
                                    `📚 *Class:* ${lead.gradeClass} (${subjects})\n\n` +
                                    `Please contact the parent and update us on your session timing.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    flex: 1,
                                    padding: '0.35rem 0.5rem',
                                    borderRadius: '7px',
                                    border: '1px solid #86EFAC',
                                    backgroundColor: '#FFFFFF',
                                    color: '#15803D',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.3rem',
                                  }}
                                >
                                  <MessageSquare size={13} color="#15803D" />
                                  <span>WhatsApp Tutor</span>
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Coordination Action Bar */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                            {/* 3-Way WhatsApp Intro */}
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `*SSSAM Academy (TuitionForHome) - Coordination Intro*\n\n` +
                                `Hello ${lead.parentName} and ${lead.assignedTutor || assignedTutorObj.name} Sir,\n` +
                                `Connecting you both for *${lead.gradeClass} (${subjects})* home tuition in *${lead.locality}*.\n\n` +
                                `📍 *Session Location:* ${lead.locality}, Gurgaon\n` +
                                `📚 *Subject:* ${subjects}\n` +
                                `🎓 *Assigned Educator:* ${lead.assignedTutor || assignedTutorObj.name} (${assignedTutorObj.highestDegree})\n\n` +
                                `Please coordinate your preferred timings for the trial session.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '0.4rem 0.85rem',
                                borderRadius: '8px',
                                border: '1.5px solid #25D366',
                                backgroundColor: '#F0FDF4',
                                color: '#15803D',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                              }}
                            >
                              <MessageSquare size={14} color="#25D366" />
                              <span>🤝 Send 3-Way WhatsApp Intro</span>
                            </a>

                            {/* Milestone Updater & Replacement Controls */}
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>Milestone:</span>
                              <select
                                value={currentMilestone}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  setLeadCoordMilestones({
                                    ...leadCoordMilestones,
                                    [lead.id]: newStatus,
                                  });
                                  setCounselorSuccessMsg(`Updated Pair #${lead.id} milestone to "${milestoneConfig[newStatus]?.label || newStatus}"`);
                                  setTimeout(() => setCounselorSuccessMsg(''), 3000);
                                }}
                                style={{
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '8px',
                                  border: '1px solid #CBD5E1',
                                  backgroundColor: '#F8FAFC',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  color: '#0F172A',
                                  cursor: 'pointer',
                                }}
                              >
                                <option value="1ST_SESSION_PENDING">🟡 1st Class Scheduled</option>
                                <option value="1ST_SESSION_DONE">🟢 1st Class Completed &amp; Ongoing</option>
                                <option value="FEE_PAID">💰 Monthly Fee Deposited</option>
                                <option value="REPLACE_REQ">🔄 Replacement Requested</option>
                              </select>

                              {/* Re-assign alternative tutor button */}
                              <button
                                type="button"
                                onClick={() => setSelectedLeadForMatching(lead)}
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: '8px',
                                  border: '1px solid #CBD5E1',
                                  backgroundColor: '#FFFFFF',
                                  color: '#334155',
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                }}
                              >
                                <RotateCcw size={12} />
                                <span>Change Tutor</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {filteredPairs.length > 0 && (
                  <div
                    style={{
                      padding: '0.75rem 1.25rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid var(--border-hairline)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      fontSize: '0.78rem',
                      color: '#475569',
                    }}
                  >
                    <div>
                      Showing <strong>{coordStartIndex + 1}</strong> to <strong>{coordEndIndex}</strong> of <strong>{filteredPairs.length}</strong> active pairs
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <button
                        type="button"
                        disabled={coordCurrentPage === 1}
                        onClick={() => setCoordCurrentPage((p) => Math.max(1, p - 1))}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: coordCurrentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                          color: coordCurrentPage === 1 ? '#94A3B8' : '#334155',
                          cursor: coordCurrentPage === 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                        }}
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: totalCoordPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCoordCurrentPage(pageNum)}
                          style={{
                            minWidth: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            border: coordCurrentPage === pageNum ? 'none' : '1px solid #CBD5E1',
                            backgroundColor: coordCurrentPage === pageNum ? '#0F172A' : '#FFFFFF',
                            color: coordCurrentPage === pageNum ? '#FFFFFF' : '#334155',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                          }}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={coordCurrentPage >= totalCoordPages}
                        onClick={() => setCoordCurrentPage((p) => Math.min(totalCoordPages, p + 1))}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: coordCurrentPage >= totalCoordPages ? '#F1F5F9' : '#FFFFFF',
                          color: coordCurrentPage >= totalCoordPages ? '#94A3B8' : '#334155',
                          cursor: coordCurrentPage >= totalCoordPages ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 4.8: TUITION FEES & TUTOR PAYOUTS LEDGER */}
          {activeAdminTab === 'FEES_PAYOUTS' && (() => {
            const totalCollected = feeRecords
              .filter((f) => f.parentStatus === 'RECEIVED')
              .reduce((sum, f) => sum + (f.parentPaidAmount || f.monthlyFee), 0);

            const parentPendingTotal = feeRecords
              .filter((f) => f.parentStatus === 'PENDING')
              .reduce((sum, f) => sum + f.monthlyFee, 0);

            const netCommissionTotal = feeRecords
              .filter((f) => f.parentStatus === 'RECEIVED')
              .reduce((sum, f) => sum + f.commissionAmount, 0);

            const tutorPayoutDueTotal = feeRecords
              .filter((f) => f.parentStatus === 'RECEIVED' && f.tutorStatus === 'PENDING')
              .reduce((sum, f) => sum + f.tutorPayoutAmount, 0);

            // Filter records
            const filteredFees = feeRecords.filter((rec) => {
              if (feeStatusFilter === 'PARENT_PENDING' && rec.parentStatus !== 'PENDING') return false;
              if (feeStatusFilter === 'PARENT_PAID' && rec.parentStatus !== 'RECEIVED') return false;
              if (feeStatusFilter === 'TUTOR_DUE' && (rec.parentStatus !== 'RECEIVED' || rec.tutorStatus !== 'PENDING')) return false;
              if (feeStatusFilter === 'SETTLED' && (rec.parentStatus !== 'RECEIVED' || rec.tutorStatus !== 'PAID')) return false;

              if (feeSearch.trim()) {
                const q = feeSearch.toLowerCase();
                const matches =
                  rec.parentName.toLowerCase().includes(q) ||
                  rec.tutorName.toLowerCase().includes(q) ||
                  rec.locality.toLowerCase().includes(q) ||
                  rec.gradeClass.toLowerCase().includes(q) ||
                  rec.subjects.toLowerCase().includes(q) ||
                  rec.parentPhone.includes(q) ||
                  (rec.parentTxnRef || '').toLowerCase().includes(q);
                if (!matches) return false;
              }

              return true;
            });

            // Pagination
            const totalFeePages = Math.ceil(filteredFees.length / feePerPage) || 1;
            const feeStartIndex = (feeCurrentPage - 1) * feePerPage;
            const feeEndIndex = Math.min(feeStartIndex + feePerPage, filteredFees.length);
            const paginatedFees = filteredFees.slice(feeStartIndex, feeEndIndex);

            return (
              <div>
                {/* 4 Financial KPI Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  {/* Card 1: Total Collections */}
                  <div className="apple-card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>FEE RECEIVED (ADVANCE)</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowDownLeft size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#15803D', marginTop: '0.35rem' }}>
                      ₹{totalCollected.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                      Advance received in bank/UPI
                    </div>
                  </div>

                  {/* Card 2: Advance Due from Parents */}
                  <div className="apple-card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #FDE68A' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>ADVANCE FEE DUE</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#B45309', marginTop: '0.35rem' }}>
                      ₹{parentPendingTotal.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#92400E', marginTop: '2px' }}>
                      Awaiting parent advance payment
                    </div>
                  </div>

                  {/* Card 3: Academy Revenue (Margin) */}
                  <div className="apple-card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E0F2FE' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>ACADEMY COMMISSION</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0284C7', marginTop: '0.35rem' }}>
                      ₹{netCommissionTotal.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#0369A1', marginTop: '2px' }}>
                      Bureau retained 25% margin
                    </div>
                  </div>

                  {/* Card 4: Tutor Payouts Pending */}
                  <div className="apple-card" style={{ padding: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>TUTOR PAYOUTS DUE</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>
                      ₹{tutorPayoutDueTotal.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                      Payable to verified educators
                    </div>
                  </div>
                </div>

                {/* Filter Toolbar */}
                <div className="apple-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Search by parent, tutor, locality, or transaction ID..."
                        value={feeSearch}
                        onChange={(e) => {
                          setFeeSearch(e.target.value);
                          setFeeCurrentPage(1);
                        }}
                        className="form-control"
                        style={{ paddingLeft: '2.4rem', borderRadius: '10px', backgroundColor: '#F8FAFC', fontSize: '0.86rem', border: '1px solid var(--border-hairline)' }}
                      />
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[
                      { id: 'ALL', label: 'All Ledgers', count: feeRecords.length },
                      { id: 'PARENT_PENDING', label: '🟡 Advance Due from Parent', count: feeRecords.filter((f) => f.parentStatus === 'PENDING').length },
                      { id: 'PARENT_PAID', label: '🟢 Fee Received', count: feeRecords.filter((f) => f.parentStatus === 'RECEIVED').length },
                      { id: 'TUTOR_DUE', label: '⏳ Tutor Payout Due', count: feeRecords.filter((f) => f.parentStatus === 'RECEIVED' && f.tutorStatus === 'PENDING').length },
                      { id: 'SETTLED', label: '✓ Settled (Both Paid)', count: feeRecords.filter((f) => f.parentStatus === 'RECEIVED' && f.tutorStatus === 'PAID').length },
                    ].map((pill) => {
                      const isActive = feeStatusFilter === pill.id;
                      return (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => {
                            setFeeStatusFilter(pill.id as any);
                            setFeeCurrentPage(1);
                          }}
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
                            transition: 'all 0.15s ease',
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

                {/* 2-WAY FINANCE LEDGER TABLE (DESKTOP) */}
                <div className="desktop-only-table apple-card" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid var(--border-hairline)', marginBottom: '1.25rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Tuition &amp; Parent</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Parent Advance Fee</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Academy (25%)</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase' }}>Tutor Net Payout</th>
                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedFees.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                            No fee records found matching current filter.
                          </td>
                        </tr>
                      ) : (
                        paginatedFees.map((rec) => {
                          const isParentPaid = rec.parentStatus === 'RECEIVED';
                          const isTutorPaid = rec.tutorStatus === 'PAID';

                          return (
                            <tr
                              key={rec.id}
                              style={{
                                borderBottom: '1px solid #F1F5F9',
                                transition: 'background-color 0.12s ease',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                            >
                              {/* 1. Parent & Student */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div>
                                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>{rec.parentName}</div>
                                  <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '1px' }}>
                                    📚 <strong>{rec.gradeClass}</strong> ({rec.subjects})
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>
                                    📍 {rec.locality}
                                  </div>
                                </div>
                              </td>

                              {/* 2. Parent Advance Fee */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isParentPaid ? '#15803D' : '#B45309' }}>
                                  ₹{rec.monthlyFee.toLocaleString('en-IN')}
                                </div>
                                <div style={{ marginTop: '3px' }}>
                                  {isParentPaid ? (
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#166534' }}>
                                      ✓ Paid ({rec.parentPaidDate || 'Received'})
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#92400E' }}>
                                      🟡 Advance Due
                                    </span>
                                  )}
                                </div>
                                {rec.parentTxnRef && (
                                  <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '2px' }}>
                                    Ref: {rec.parentTxnRef}
                                  </div>
                                )}
                              </td>

                              {/* 3. Academy Margin */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0284C7' }}>
                                  ₹{rec.commissionAmount.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                  ({rec.commissionRate}% retained)
                                </div>
                              </td>

                              {/* 4. Tutor Net Payout */}
                              <td style={{ padding: '0.85rem 1rem' }}>
                                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.86rem' }}>
                                  {rec.tutorName}
                                </div>
                                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: isTutorPaid ? '#15803D' : '#0F172A', marginTop: '1px' }}>
                                  ₹{rec.tutorPayoutAmount.toLocaleString('en-IN')}
                                </div>
                                <div style={{ marginTop: '2px' }}>
                                  {isTutorPaid ? (
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#166534' }}>
                                      ✓ Payout Settled
                                    </span>
                                  ) : isParentPaid ? (
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#92400E' }}>
                                      ⏳ Payout Pending
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#64748B' }}>
                                      ⏸️ Awaiting Parent Fee
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 5. Actions */}
                              <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', flexWrap: 'wrap' }}>
                                  {!isParentPaid ? (
                                    <>
                                      {/* WhatsApp Fee Reminder */}
                                      <a
                                        href={`https://wa.me/?text=${encodeURIComponent(
                                          `*SSSAM Academy (TuitionForHome) - Advance Fee Reminder*\n\n` +
                                          `Dear ${rec.parentName},\n` +
                                          `This is a gentle reminder regarding the monthly advance tuition fee of *₹${rec.monthlyFee.toLocaleString('en-IN')}* for *${rec.gradeClass} (${rec.subjects})* in *${rec.locality}*.\n\n` +
                                          `Assigned Educator: *${rec.tutorName}*\n\n` +
                                          `Kindly deposit via UPI to: *${SSSAM_OFFICE_DETAILS.phones[0]}@upi* and reply with the screenshot.\n\n` +
                                          `Thank you,\nSSSAM Academy Accounts Desk`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          padding: '0.35rem 0.65rem',
                                          borderRadius: '7px',
                                          border: '1px solid #86EFAC',
                                          backgroundColor: '#F0FDF4',
                                          color: '#15803D',
                                          fontSize: '0.74rem',
                                          fontWeight: 700,
                                          textDecoration: 'none',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                        }}
                                      >
                                        <MessageSquare size={12} color="#15803D" />
                                        <span>Reminder</span>
                                      </a>

                                      {/* Receive Fee Button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setParentPaymentModalItem(rec);
                                          setParentPayAmountInput(rec.monthlyFee);
                                          setParentPayTxnInput('');
                                        }}
                                        style={{
                                          padding: '0.35rem 0.65rem',
                                          borderRadius: '7px',
                                          backgroundColor: '#10B981',
                                          color: '#FFFFFF',
                                          border: 'none',
                                          fontSize: '0.74rem',
                                          fontWeight: 800,
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                        }}
                                      >
                                        <CreditCard size={12} />
                                        <span>Receive Advance</span>
                                      </button>
                                    </>
                                  ) : !isTutorPaid ? (
                                    <>
                                      {/* WhatsApp Receipt to Parent */}
                                      <a
                                        href={`https://wa.me/?text=${encodeURIComponent(
                                          `*SSSAM Academy - Payment Receipt Confirmation*\n\n` +
                                          `Dear ${rec.parentName},\n` +
                                          `We have received your advance tuition payment of *₹${(rec.parentPaidAmount || rec.monthlyFee).toLocaleString('en-IN')}* for *${rec.gradeClass} (${rec.subjects})*.\n\n` +
                                          `Assigned Educator: *${rec.tutorName}*\n` +
                                          `Payment Mode: *${rec.parentPaymentMode || 'UPI'}*\n` +
                                          `Transaction Ref: *${rec.parentTxnRef || 'CONFIRMED'}*\n\n` +
                                          `Thank you for choosing SSSAM Academy!`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          padding: '0.35rem 0.65rem',
                                          borderRadius: '7px',
                                          border: '1px solid #CBD5E1',
                                          backgroundColor: '#FFFFFF',
                                          color: '#334155',
                                          fontSize: '0.74rem',
                                          fontWeight: 700,
                                          textDecoration: 'none',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                        }}
                                      >
                                        <Receipt size={12} color="#0284C7" />
                                        <span>Parent Receipt</span>
                                      </a>

                                      {/* Settle Tutor Payout Button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTutorPayoutModalItem(rec);
                                          setTutorPayoutAmountInput(rec.tutorPayoutAmount);
                                          setTutorPayoutTxnInput('');
                                        }}
                                        style={{
                                          padding: '0.35rem 0.65rem',
                                          borderRadius: '7px',
                                          backgroundColor: '#0F172A',
                                          color: '#FFFFFF',
                                          border: 'none',
                                          fontSize: '0.74rem',
                                          fontWeight: 800,
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                        }}
                                      >
                                        <Banknote size={12} />
                                        <span>Pay Tutor</span>
                                      </button>
                                    </>
                                  ) : (
                                    /* Fully Settled WhatsApp Slip to Tutor */
                                    <a
                                      href={`https://wa.me/?text=${encodeURIComponent(
                                        `*SSSAM Academy - Tutor Payout Slip*\n\n` +
                                        `Dear ${rec.tutorName} Sir/Ma'am,\n` +
                                        `Your net payout of *₹${rec.tutorPayoutAmount.toLocaleString('en-IN')}* for student *${rec.parentName} (${rec.gradeClass})* has been processed.\n\n` +
                                        `Mode: *${rec.tutorPaymentMode || 'UPI Transfer'}*\n` +
                                        `Ref/UTR: *${rec.tutorTxnRef || 'CREDITED'}*\n` +
                                        `Date: *${rec.tutorPaidDate || 'Today'}*\n\n` +
                                        `Best regards,\nSSSAM Academy Finance Desk`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '7px',
                                        border: '1px solid #86EFAC',
                                        backgroundColor: '#F0FDF4',
                                        color: '#15803D',
                                        fontSize: '0.74rem',
                                        fontWeight: 800,
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                      }}
                                    >
                                      <Check size={12} color="#15803D" />
                                      <span>Tutor Payout Slip</span>
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE RESPONSIVE CARDS */}
                <div className="mobile-only-cards" style={{ display: 'none', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {paginatedFees.map((rec) => {
                    const isParentPaid = rec.parentStatus === 'RECEIVED';
                    const isTutorPaid = rec.tutorStatus === 'PAID';

                    return (
                      <div
                        key={rec.id}
                        className="apple-card"
                        style={{
                          padding: '1rem',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '14px',
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A' }}>{rec.parentName}</div>
                            <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                              {rec.gradeClass} ({rec.subjects}) • 📍 {rec.locality}
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: '5px',
                              backgroundColor: isParentPaid ? '#DCFCE7' : '#FEF3C7',
                              color: isParentPaid ? '#166534' : '#92400E',
                            }}
                          >
                            {isParentPaid ? 'Fee Received' : 'Advance Due'}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '10px', fontSize: '0.76rem' }}>
                          <div>
                            <div style={{ color: '#64748B' }}>Parent Fee:</div>
                            <div style={{ fontWeight: 800, color: '#15803D' }}>₹{rec.monthlyFee}</div>
                          </div>
                          <div>
                            <div style={{ color: '#64748B' }}>Tutor ({rec.tutorName}):</div>
                            <div style={{ fontWeight: 800, color: isTutorPaid ? '#15803D' : '#0F172A' }}>
                              ₹{rec.tutorPayoutAmount} ({isTutorPaid ? 'Paid' : 'Pending'})
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {filteredFees.length > 0 && (
                  <div
                    style={{
                      padding: '0.75rem 1.25rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid var(--border-hairline)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      fontSize: '0.78rem',
                      color: '#475569',
                    }}
                  >
                    <div>
                      Showing <strong>{feeStartIndex + 1}</strong> to <strong>{feeEndIndex}</strong> of <strong>{filteredFees.length}</strong> ledgers
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <button
                        type="button"
                        disabled={feeCurrentPage === 1}
                        onClick={() => setFeeCurrentPage((p) => Math.max(1, p - 1))}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: feeCurrentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                          color: feeCurrentPage === 1 ? '#94A3B8' : '#334155',
                          cursor: feeCurrentPage === 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                        }}
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: totalFeePages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setFeeCurrentPage(pageNum)}
                          style={{
                            minWidth: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            border: feeCurrentPage === pageNum ? 'none' : '1px solid #CBD5E1',
                            backgroundColor: feeCurrentPage === pageNum ? '#0F172A' : '#FFFFFF',
                            color: feeCurrentPage === pageNum ? '#FFFFFF' : '#334155',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                          }}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={feeCurrentPage >= totalFeePages}
                        onClick={() => setFeeCurrentPage((p) => Math.min(totalFeePages, p + 1))}
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: feeCurrentPage >= totalFeePages ? '#F1F5F9' : '#FFFFFF',
                          color: feeCurrentPage >= totalFeePages ? '#94A3B8' : '#334155',
                          cursor: feeCurrentPage >= totalFeePages ? 'not-allowed' : 'pointer',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
            </section>
          </div>
        </div>
      </main>

      {/* MODAL: RECORD PARENT ADVANCE PAYMENT */}
      {parentPaymentModalItem && (
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
          onClick={() => setParentPaymentModalItem(null)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  Record Parent Advance Fee
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  {parentPaymentModalItem.parentName} • {parentPaymentModalItem.gradeClass}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setParentPaymentModalItem(null)}
                style={{ border: 'none', background: '#F1F5F9', borderRadius: '8px', width: '28px', height: '28px', cursor: 'pointer' }}
              >
                <X size={15} color="#64748B" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFeeRecords((prev) =>
                  prev.map((f) =>
                    f.id === parentPaymentModalItem.id
                      ? {
                          ...f,
                          parentStatus: 'RECEIVED',
                          parentPaidAmount: parentPayAmountInput || f.monthlyFee,
                          parentPaidDate: 'Today',
                          parentPaymentMode: parentPayModeInput,
                          parentTxnRef: parentPayTxnInput.trim() || `UPI-${Date.now().toString().slice(-8)}`,
                        }
                      : f
                  )
                );
                setCounselorSuccessMsg(`🎉 Recorded advance payment of ₹${parentPayAmountInput} from ${parentPaymentModalItem.parentName}!`);
                setTimeout(() => setCounselorSuccessMsg(''), 4000);
                setParentPaymentModalItem(null);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Amount Received (₹)
                </label>
                <input
                  type="number"
                  value={parentPayAmountInput}
                  onChange={(e) => setParentPayAmountInput(Number(e.target.value))}
                  className="form-control"
                  style={{ borderRadius: '10px', fontWeight: 800, fontSize: '1.1rem', color: '#15803D' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Payment Method
                </label>
                <select
                  value={parentPayModeInput}
                  onChange={(e) => setParentPayModeInput(e.target.value)}
                  className="form-control"
                  style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                >
                  <option value="UPI (Google Pay / PhonePe / Paytm)">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Bank IMPS / NEFT Transfer">Bank IMPS / NEFT Transfer</option>
                  <option value="Cash Payment">Cash Payment</option>
                  <option value="Cheque Deposit">Cheque Deposit</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Transaction ID / UTR / Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI-998822001 or Cash Receipt #12"
                  value={parentPayTxnInput}
                  onChange={(e) => setParentPayTxnInput(e.target.value)}
                  className="form-control"
                  style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setParentPaymentModalItem(null)}
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
                  style={{
                    flex: 2,
                    padding: '0.65rem',
                    borderRadius: '10px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  ✓ Confirm Payment Received
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD TUTOR PAYOUT */}
      {tutorPayoutModalItem && (
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
          onClick={() => setTutorPayoutModalItem(null)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  Record Educator Payout
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  Educator: <strong>{tutorPayoutModalItem.tutorName}</strong> (Student: {tutorPayoutModalItem.parentName})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTutorPayoutModalItem(null)}
                style={{ border: 'none', background: '#F1F5F9', borderRadius: '8px', width: '28px', height: '28px', cursor: 'pointer' }}
              >
                <X size={15} color="#64748B" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFeeRecords((prev) =>
                  prev.map((f) =>
                    f.id === tutorPayoutModalItem.id
                      ? {
                          ...f,
                          tutorStatus: 'PAID',
                          tutorPayoutAmount: tutorPayoutAmountInput || f.tutorPayoutAmount,
                          tutorPaidDate: 'Today',
                          tutorPaymentMode: tutorPayoutModeInput,
                          tutorTxnRef: tutorPayoutTxnInput.trim() || `UTR-${Date.now().toString().slice(-8)}`,
                        }
                      : f
                  )
                );
                setCounselorSuccessMsg(`🎉 Successfully recorded payout of ₹${tutorPayoutAmountInput} to ${tutorPayoutModalItem.tutorName}!`);
                setTimeout(() => setCounselorSuccessMsg(''), 4000);
                setTutorPayoutModalItem(null);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Net Payout Amount (₹)
                </label>
                <input
                  type="number"
                  value={tutorPayoutAmountInput}
                  onChange={(e) => setTutorPayoutAmountInput(Number(e.target.value))}
                  className="form-control"
                  style={{ borderRadius: '10px', fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Payout Transfer Mode
                </label>
                <select
                  value={tutorPayoutModeInput}
                  onChange={(e) => setTutorPayoutModeInput(e.target.value)}
                  className="form-control"
                  style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                >
                  <option value="UPI Transfer (GPay / PhonePe)">UPI Transfer (GPay / PhonePe)</option>
                  <option value="Direct Bank NEFT / IMPS">Direct Bank NEFT / IMPS</option>
                  <option value="Cash Settlement">Cash Settlement</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Bank UTR / Transaction Reference No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR-491028301 or UPI Ref"
                  value={tutorPayoutTxnInput}
                  onChange={(e) => setTutorPayoutTxnInput(e.target.value)}
                  className="form-control"
                  style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setTutorPayoutModalItem(null)}
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
                  style={{
                    flex: 2,
                    padding: '0.65rem',
                    borderRadius: '10px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                  }}
                >
                  ✓ Confirm Payout Settled
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  maxLength={10}
                  value={newCounselorPhone}
                  onChange={(e) => setNewCounselorPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Account Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewCounselorPassword ? 'text' : 'password'}
                    placeholder="Enter login password"
                    value={newCounselorPassword}
                    onChange={(e) => setNewCounselorPassword(e.target.value)}
                    className="form-control"
                    style={{ paddingRight: '2.5rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewCounselorPassword(!showNewCounselorPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                    }}
                    title={showNewCounselorPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewCounselorPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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

      {/* COMPACT & CLEAN UPDATE FOLLOW-UP MODAL (ADMIN) */}
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
              {/* Status */}
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

              {/* Notes */}
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Notes / Remarks <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <textarea
                  rows={2}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="e.g. Spoke to parent, requested demo on Sunday..."
                  className="form-control"
                  style={{ fontSize: '0.82rem', padding: '0.42rem 0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1', resize: 'vertical' }}
                  required
                />
              </div>

              {/* Next Follow-up Date (Mandatory for Active Leads, Optional/Hidden for Done & Lost) */}
              {updateStatus === 'LOST' || updateStatus === 'TUITION_CONFIRMED' ? (
                <div style={{ padding: '0.45rem 0.7rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1', fontSize: '0.74rem', color: '#64748B' }}>
                  ✓ No follow-up required for {updateStatus === 'LOST' ? 'Not Interested' : 'Converted'}
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                    Next Follow-up Date <span style={{ color: '#DC2626' }}>*</span>
                  </label>

                  {/* Date Input */}
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
          currentOperator="Admin (SSSAM Lead Desk)"
          onClose={() => setSelectedLeadForMatching(null)}
          onAssignTutor={(tutorName, tutorId, notes) => handleAssignProximityTutor(tutorName, tutorId, notes)}
        />
      )}

      {/* COUNSELOR DETAIL VIEW, EDIT & RESET PASSWORD MODAL */}
      {selectedCounselorForEdit && (
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
              maxWidth: '540px',
              backgroundColor: '#FFFFFF',
              padding: '2rem',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--brand-teal-light)',
                    color: 'var(--brand-teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                  }}
                >
                  {selectedCounselorForEdit.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Counselor Profile &amp; Settings
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Role: <strong style={{ color: 'var(--brand-navy)' }}>Telecaller &amp; Lead Desk</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCounselorForEdit(null)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Edit & Password Reset Form */}
            <form onSubmit={handleUpdateCounselor} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Counselor Full Name *
                </label>
                <input
                  type="text"
                  value={editCounselorName}
                  onChange={(e) => setEditCounselorName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Login Email Address *
                </label>
                <input
                  type="email"
                  value={editCounselorEmail}
                  onChange={(e) => setEditCounselorEmail(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9517447689"
                  maxLength={10}
                  value={editCounselorPhone}
                  onChange={(e) => setEditCounselorPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="form-control"
                />
              </div>

              {/* Password Reset Section */}
              <div style={{ padding: '1rem', backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                <label className="form-label" style={{ fontWeight: 800, color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <Lock size={15} />
                  <span>Reset / Change Password</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showEditCounselorPassword ? 'text' : 'password'}
                    placeholder="Enter new password (or leave empty to keep current)"
                    value={editCounselorPassword}
                    onChange={(e) => setEditCounselorPassword(e.target.value)}
                    className="form-control"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#FCD34D', paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditCounselorPassword(!showEditCounselorPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#92400E',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                    }}
                    title={showEditCounselorPassword ? 'Hide password' : 'Show password'}
                  >
                    {showEditCounselorPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#92400E', marginTop: '4px' }}>
                  ℹ️ Agar password change nahi karna hai, toh isse khali (empty) chhod dein.
                </div>
              </div>

              {editCounselorError && (
                <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.82rem', fontWeight: 700 }}>
                  ⚠️ {editCounselorError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-hairline)' }}>
                <button
                  type="button"
                  onClick={() => setSelectedCounselorForEdit(null)}
                  className="btn btn-secondary"
                  disabled={editCounselorSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={editCounselorSubmitting}
                  style={{ backgroundColor: 'var(--brand-emerald)', fontWeight: 800 }}
                >
                  <Save size={16} />
                  <span>{editCounselorSubmitting ? 'Saving...' : 'Save & Update Details'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CENTERED CONFIRMATION MODAL (NEVER USE BROWSER NATIVE ALERT/CONFIRM) */}
      {confirmModal && confirmModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {/* Icon Badge */}
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: confirmModal.type === 'danger' ? '#FEE2E2' : '#EFF6FF',
                color: confirmModal.type === 'danger' ? '#DC2626' : '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {confirmModal.type === 'danger' ? <Trash2 size={24} /> : <AlertCircle size={24} />}
            </div>

            {/* Title & Message */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {confirmModal.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.4rem', lineHeight: 1.45, margin: 0 }}>
                {confirmModal.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', width: '100%', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {confirmModal.cancelText || 'Cancel'}
              </button>

              <button
                type="button"
                onClick={confirmModal.onConfirm}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: confirmModal.type === 'danger' ? '#DC2626' : '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: confirmModal.type === 'danger' ? '0 4px 12px rgba(220, 38, 38, 0.3)' : '0 4px 12px rgba(15, 23, 42, 0.2)',
                  transition: 'all 0.15s ease',
                }}
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
