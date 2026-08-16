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
      performedBy = 'Counselor Desk',
    } = body;

    if (!gradeClass && !subjectsNeeded) {
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

    const newGrade = gradeClass?.trim() || currentLead.gradeClass;
    let newSubjects = currentLead.subjectsNeeded;
    if (subjectsNeeded) {
      if (Array.isArray(subjectsNeeded)) {
        newSubjects = JSON.stringify(subjectsNeeded);
      } else {
        newSubjects = subjectsNeeded.trim();
      }
    }

    // Direct MySQL Update to avoid schema lock issues
    await prisma.$executeRawUnsafe(
      'UPDATE `Lead` SET gradeClass = ?, subjectsNeeded = ?, updatedAt = NOW() WHERE id = ?',
      newGrade,
      newSubjects,
      leadId
    );

    // Log Activity
    const activityId = `act-${Date.now()}`;
    const activityDesc = `Updated Class & Subjects to: ${newGrade} | ${newSubjects}`;
    try {
      await prisma.leadActivity.create({
        data: {
          leadId,
          actionType: 'NOTE_ADDED',
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
