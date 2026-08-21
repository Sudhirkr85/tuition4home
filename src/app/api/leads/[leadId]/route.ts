import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: Request,
  { params }: { params: any }
) {
  try {
    const resolvedParams = await params;
    const leadId = resolvedParams?.leadId || params?.leadId;

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required.' },
        { status: 400 }
      );
    }

    // Delete associated activities first
    try {
      await prisma.leadActivity.deleteMany({
        where: { leadId },
      });
    } catch {}

    // Delete the lead
    await prisma.lead.delete({
      where: { id: leadId },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete lead.' },
      { status: 500 }
    );
  }
}
