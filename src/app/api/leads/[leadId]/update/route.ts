import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const resolvedParams = await params;
    const { leadId } = resolvedParams;
    const body = await req.json();

    const {
      gradeClass,
      subjectsNeeded,
      budgetMonthly,
      commissionAmount,
      status,
      performedBy = 'Counselor Desk',
    } = body;

    if (gradeClass === undefined && subjectsNeeded === undefined && budgetMonthly === undefined && commissionAmount === undefined && status === undefined) {
      return NextResponse.json(
        { success: false, error: 'No fields provided to update.' },
        { status: 400 }
      );
    }

    const currentLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!currentLead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found.' },
        { status: 404 }
      );
    }

    const newGrade = gradeClass !== undefined ? (gradeClass.trim() || currentLead.gradeClass) : currentLead.gradeClass;
    let newSubjects = currentLead.subjectsNeeded;
    if (subjectsNeeded !== undefined) {
      if (Array.isArray(subjectsNeeded)) {
        newSubjects = JSON.stringify(subjectsNeeded);
      } else {
        newSubjects = subjectsNeeded.trim();
      }
    }
    const newBudget = budgetMonthly !== undefined ? Number(budgetMonthly) : currentLead.budgetMonthly;
    const newCommission = commissionAmount !== undefined ? Number(commissionAmount) : currentLead.commissionAmount;
    const newStatus = status !== undefined ? status : currentLead.status;

    // Direct MySQL Update to avoid schema lock issues
    await prisma.$executeRawUnsafe(
      'UPDATE `Lead` SET gradeClass = ?, subjectsNeeded = ?, budgetMonthly = ?, commissionAmount = ?, status = ?, updatedAt = NOW() WHERE id = ?',
      newGrade,
      newSubjects,
      newBudget,
      newCommission,
      newStatus,
      leadId
    );

    // Log Activity
    const activityId = `act-${Date.now()}`;
    const activityDesc = budgetMonthly !== undefined
      ? `Updated Tuition Fee to ₹${newBudget} (Commission: ₹${newCommission || 0})`
      : `Updated Class & Subjects to: ${newGrade} | ${newSubjects}`;
    try {
      await prisma.leadActivity.create({
        data: {
          leadId,
          actionType: budgetMonthly !== undefined ? 'STATUS_CHANGED' : 'NOTE_ADDED',
          description: activityDesc,
          performedBy,
        },
      });
    } catch {
      await prisma.$executeRawUnsafe(
        'INSERT INTO `LeadActivity` (id, leadId, actionType, description, performedBy, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
        activityId,
        leadId,
        'NOTE_ADDED',
        activityDesc,
        performedBy
      );
    }

    const updatedLead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead,
      message: 'Class and subject updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating lead details:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update lead details' },
      { status: 500 }
    );
  }
}

export { PATCH as POST };
