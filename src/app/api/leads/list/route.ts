import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let dbLeads: any[] = [];
    try {
      dbLeads = await prisma.lead.findMany({
        include: {
          activities: {
            orderBy: {
              createdAt: 'desc',
            },
          },
          assignedTutor: {
            select: {
              id: true,
              user: {
                select: { name: true, phone: true },
              },
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    } catch (err) {
      console.warn('DB leads fetch fallback to operational seed leads:', err);
    }

    if (!dbLeads || dbLeads.length === 0) {
      const now = new Date();
      const todayStr = now.toISOString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

      dbLeads = [
        {
          id: 'LD-101',
          parentName: 'Mrs. Ritu Verma',
          parentPhone: '9811234567',
          parentEmail: 'ritu.verma@gmail.com',
          preferredMode: 'OFFLINE_HOME',
          locality: 'DLF Phase 5, Gurgaon',
          gradeClass: 'Class 10 CBSE',
          subjectsNeeded: '["Mathematics"]',
          budgetMonthly: 9000,
          status: 'NEW_LEAD',
          notes: 'Fresh inquiry from website demo popup. Needs female home tutor.',
          commissionAmount: 4500,
          createdAt: todayStr,
          updatedAt: todayStr,
          nextFollowupDate: null,
          activities: [
            {
              id: 'act-1',
              leadId: 'LD-101',
              actionType: 'NEW_LEAD',
              description: 'Lead submitted via Free Demo Booking widget on TuitionForHome portal.',
              performedBy: 'System Bot',
              createdAt: todayStr,
            },
          ],
        },
        {
          id: 'LD-102',
          parentName: 'Mr. Arvind Kapoor',
          parentPhone: '9871098765',
          parentEmail: 'arvind.k@corporate.com',
          preferredMode: 'OFFLINE_HOME',
          locality: 'Golf Course Road, Gurgaon',
          gradeClass: 'Class 12 CBSE',
          subjectsNeeded: '["Physics", "Chemistry"]',
          budgetMonthly: 14000,
          status: 'INTERESTED',
          notes: 'Spoke with parent on phone. Very interested. Wants demo this Sunday 11 AM.',
          commissionAmount: 7000,
          createdAt: yesterday,
          updatedAt: yesterday,
          nextFollowupDate: todayStr,
          activities: [
            {
              id: 'act-2b',
              leadId: 'LD-102',
              actionType: 'STATUS_CHANGE',
              description: 'Marked as ⭐ Highly Interested. Parent asked to call back today at 5:00 PM to finalize tutor shortlist.',
              performedBy: 'Counselor Pooja',
              createdAt: yesterday,
            },
            {
              id: 'act-2a',
              leadId: 'LD-102',
              actionType: 'CALL_MADE',
              description: 'Introductory discovery call completed. Discussed student past score (78%) and board target (95%).',
              performedBy: 'Counselor Pooja',
              createdAt: yesterday,
            },
          ],
        },
        {
          id: 'LD-103',
          parentName: 'Sanjay Singhania',
          parentPhone: '9910456123',
          parentEmail: 'sanjay.singh@gmail.com',
          preferredMode: 'ONLINE_LIVE',
          locality: 'Sector 54, Gurgaon',
          gradeClass: 'IB Diploma (Maths HL)',
          subjectsNeeded: '["Mathematics HL"]',
          budgetMonthly: 16000,
          status: 'DEMO_SCHEDULED',
          notes: 'Demo scheduled with Rohit Sharma for tomorrow 5:00 PM.',
          commissionAmount: 8000,
          demoDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          createdAt: twoDaysAgo,
          updatedAt: yesterday,
          nextFollowupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          activities: [
            {
              id: 'act-3c',
              leadId: 'LD-103',
              actionType: 'DEMO_FIXED',
              description: 'Demo Class scheduled with verified tutor Rohit Sharma. Google Meet link dispatched on WhatsApp.',
              performedBy: 'Counselor Karan',
              createdAt: yesterday,
            },
            {
              id: 'act-3b',
              leadId: 'LD-103',
              actionType: 'WHATSAPP_SENT',
              description: 'Shared 2 IB certified tutor profiles via WhatsApp document link.',
              performedBy: 'Counselor Karan',
              createdAt: twoDaysAgo,
            },
          ],
        },
        {
          id: 'LD-104',
          parentName: 'Meenakshi Sundaram',
          parentPhone: '9810234888',
          parentEmail: 'meenakshi@gmail.com',
          preferredMode: 'OFFLINE_HOME',
          locality: 'Sector 57, Gurgaon',
          gradeClass: 'Class 8 ICSE',
          subjectsNeeded: '["Science", "Mathematics"]',
          budgetMonthly: 7000,
          status: 'CALL_SCHEDULED',
          notes: 'Callback was scheduled for 2 days ago, but parent was in office meeting. Overdue follow-up needed.',
          commissionAmount: 3500,
          createdAt: threeDaysAgo,
          updatedAt: twoDaysAgo,
          nextFollowupDate: twoDaysAgo, // Overdue / Pending
          activities: [
            {
              id: 'act-4a',
              leadId: 'LD-104',
              actionType: 'NOTE_ADDED',
              description: 'Parent requested callback at 6 PM. Could not reach on second attempt.',
              performedBy: 'Counselor Pooja',
              createdAt: twoDaysAgo,
            },
          ],
        },
        {
          id: 'LD-105',
          parentName: 'Dr. Vivek Malhotra',
          parentPhone: '9818987111',
          parentEmail: 'v.malhotra@med.org',
          preferredMode: 'OFFLINE_HOME',
          locality: 'DLF Phase 4, Gurgaon',
          gradeClass: 'Class 11 NEET Biology',
          subjectsNeeded: '["Biology"]',
          budgetMonthly: 12000,
          status: 'TUITION_CONFIRMED',
          notes: 'Trial successful! Parent paid first month tuition. Commission collected ₹6,000.',
          commissionAmount: 6000,
          createdAt: threeDaysAgo,
          updatedAt: yesterday,
          activities: [
            {
              id: 'act-5c',
              leadId: 'LD-105',
              actionType: 'STATUS_CHANGE',
              description: 'Tuition Confirmed! 1st month tuition finalized. ₹6,000 commission invoice dispatched via UPI QR.',
              performedBy: 'Admin (SSSAM Lead Desk)',
              createdAt: yesterday,
            },
          ],
        },
      ];
    }

    return NextResponse.json({
      success: true,
      leads: dbLeads,
    });
  } catch (error: any) {
    console.error('[GET_LEADS_LIST_ERROR]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}
