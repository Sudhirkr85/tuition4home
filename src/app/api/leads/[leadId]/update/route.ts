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

    // Update lead cleanly with Prisma
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        gradeClass: newGrade,
        subjectsNeeded: newSubjects,
        budgetMonthly: newBudget,
        commissionAmount: newCommission,
        status: newStatus,
      },
    });

    // Log Activity
    const activityDesc = budgetMonthly !== undefined
      ? `Updated Tuition Fee to ₹${newBudget} (Commission: ₹${newCommission || 0})`
      : `Updated Class & Subjects to: ${newGrade} | ${newSubjects}`;
    
    await prisma.leadActivity.create({
      data: {
        leadId,
        actionType: budgetMonthly !== undefined ? 'STATUS_CHANGED' : 'NOTE_ADDED',
        description: activityDesc,
        performedBy,
      },
    });

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
