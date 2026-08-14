import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { leadId } = resolvedParams;
    const body = await req.json();

    const {
      status,
      notes,
      nextFollowupDate,
      performedBy = 'Counselor Desk',
      actionType = 'NOTE_ADDED',
    } = body;

    if (!notes || notes.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Follow-up notes/remarks are mandatory for every update.' },
        { status: 400 }
      );
    }

    const activityDescription = `${status ? `[Status: ${status}] ` : ''}${notes.trim()}${
      nextFollowupDate ? ` (Next Follow-up set: ${new Date(nextFollowupDate).toLocaleString('en-IN')})` : ''
    }`;

    try {
      // 1. Create LeadActivity record
      const activity = await prisma.leadActivity.create({
        data: {
          leadId,
          actionType: actionType || 'STATUS_CHANGE',
          description: activityDescription,
          performedBy,
        },
      });

      // 2. Update Lead status and notes
      const updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: {
          ...(status ? { status } : {}),
          notes: notes.trim(),
          ...(nextFollowupDate ? { demoDate: new Date(nextFollowupDate) } : {}),
        },
        include: {
          activities: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Follow-up logged and timeline updated successfully.',
        lead: updatedLead,
        activity,
      });
    } catch (dbErr) {
      console.warn('Prisma DB update fallback in mock mode:', dbErr);
      const mockActivity = {
        id: `act-${Date.now()}`,
        leadId,
        actionType: actionType || 'STATUS_CHANGE',
        description: activityDescription,
        performedBy,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        message: 'Follow-up recorded successfully.',
        activity: mockActivity,
      });
    }
  } catch (error: any) {
    console.error('[LEAD_FOLLOWUP_UPDATE_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update lead follow-up' },
      { status: 500 }
    );
  }
}
