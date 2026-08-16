import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let rawDbLeads: any[] = [];
    try {
      rawDbLeads = await prisma.lead.findMany({
        include: {
          activities: {
            orderBy: {
              createdAt: 'desc',
            },
          },
          assignedTutor: {
            include: {
              user: {
                select: { name: true, phone: true },
              },
            },
          },
          assignedCaller: {
            select: { name: true, phone: true, email: true },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    } catch {
      const rows: any[] = await prisma.$queryRawUnsafe('SELECT * FROM `Lead` ORDER BY updatedAt DESC');
      const allActivities: any[] = await prisma.$queryRawUnsafe('SELECT * FROM `LeadActivity` ORDER BY createdAt DESC');
      
      rawDbLeads = rows.map((r) => ({
        ...r,
        activities: allActivities.filter((a) => a.leadId === r.id),
      }));
    }

    const leads = rawDbLeads.map((lead: any) => {
      let subjects = lead.subjectsNeeded;
      try {
        const parsed = JSON.parse(lead.subjectsNeeded);
        if (Array.isArray(parsed)) subjects = parsed.join(', ');
      } catch {
        // Keep string
      }

      return {
        id: lead.id,
        parentName: lead.parentName,
        parentPhone: lead.parentPhone,
        parentEmail: lead.parentEmail || '',
        preferredMode: lead.preferredMode,
        locality: lead.locality,
        formattedAddress: lead.formattedAddress || lead.locality || '',
        latitude: lead.latitude || null,
        longitude: lead.longitude || null,
        gradeClass: lead.gradeClass,
        subjectsNeeded: subjects,
        board: lead.board || null,
        budgetMonthly: lead.budgetMonthly || null,
        status: lead.status,
        notes: lead.notes || '',
        assignedTutor: lead.assignedTutor?.user?.name || null,
        assignedTutorId: lead.assignedTutorId || null,
        assignedCaller: lead.assignedCaller?.name || 'Unassigned',
        demoDate: lead.demoDate ? new Date(lead.demoDate).toISOString() : null,
        nextFollowupDate: lead.demoDate ? new Date(lead.demoDate).toISOString() : null,
        commissionAmount: lead.commissionAmount || 0,
        createdAt: new Date(lead.createdAt).toISOString(),
        updatedAt: new Date(lead.updatedAt).toISOString(),
        activities: (lead.activities || []).map((act: any) => ({
          id: act.id,
          leadId: act.leadId,
          actionType: act.actionType,
          description: act.description,
          performedBy: act.performedBy,
          createdAt: new Date(act.createdAt).toISOString(),
        })),
      };
    });

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error: any) {
    console.error('[GET_LEADS_LIST_ERROR]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch leads' }, { status: 500 });
  }
}
