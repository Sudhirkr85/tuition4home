import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let rawParents: any[] = [];
    try {
      rawParents = await prisma.user.findMany({
        where: { role: 'PARENT' },
        include: {
          parentLeads: {
            include: {
              assignedTutor: {
                include: {
                  user: {
                    select: { name: true, phone: true },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      rawParents = await prisma.$queryRawUnsafe("SELECT id, name, email, phone, createdAt, updatedAt, role FROM `User` WHERE role = 'PARENT' ORDER BY createdAt DESC");
    }

    const parents = rawParents.map((p: any) => {
      const leads = p.parentLeads || [];
      const activeTuitions = leads.filter((l: any) => l.status === 'TUITION_CONFIRMED');
      const confirmedTutors = activeTuitions.map((l: any) => l.assignedTutor?.user?.name).filter(Boolean);

      return {
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone || 'Not Provided',
        createdAt: new Date(p.createdAt).toISOString(),
        emailVerified: p.emailVerified ? true : false,
        totalInquiries: leads.length,
        activeTuitionsCount: activeTuitions.length,
        assignedTutors: confirmedTutors,
        leads: leads.map((l: any) => ({
          id: l.id,
          gradeClass: l.gradeClass,
          subjectsNeeded: l.subjectsNeeded,
          status: l.status,
          locality: l.locality,
          preferredMode: l.preferredMode,
          createdAt: new Date(l.createdAt).toISOString(),
        })),
      };
    });

    return NextResponse.json({
      success: true,
      count: parents.length,
      parents,
    });
  } catch (error: any) {
    console.error('[GET_PARENTS_LIST_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch registered parents' },
      { status: 500 }
    );
  }
}
