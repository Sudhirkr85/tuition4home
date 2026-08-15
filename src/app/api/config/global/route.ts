import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let config = await prisma.platformConfig.findUnique({
      where: { id: 'global_config' },
    });

    if (!config) {
      config = await prisma.platformConfig.create({
        data: {
          id: 'global_config',
          baseVerificationFee: 999,
          isOfferActive: true,
          offerDiscountPercent: 100,
          offerTitle: 'Academic Session 2026-27 Special Drive',
          offerSubtext: '100% Verification Fee Waiver for Gurgaon & NCR Educators',
          officeAddress: 'M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001',
          helplinePhones: '+91 95174 47689, +91 92170 31899',
          supportEmail: 'info@sssamacademy.com',
        },
      });
    }

    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error: any) {
    console.error('Error fetching platform config:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch platform config' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await prisma.platformConfig.upsert({
      where: { id: 'global_config' },
      update: {
        baseVerificationFee: body.baseVerificationFee !== undefined ? Number(body.baseVerificationFee) : undefined,
        isOfferActive: body.isOfferActive !== undefined ? Boolean(body.isOfferActive) : undefined,
        offerDiscountPercent: body.offerDiscountPercent !== undefined ? Number(body.offerDiscountPercent) : undefined,
        offerTitle: body.offerTitle || undefined,
        offerSubtext: body.offerSubtext || undefined,
        officeAddress: body.officeAddress || undefined,
        helplinePhones: body.helplinePhones || undefined,
        supportEmail: body.supportEmail || undefined,
      },
      create: {
        id: 'global_config',
        baseVerificationFee: Number(body.baseVerificationFee || 999),
        isOfferActive: Boolean(body.isOfferActive ?? true),
        offerDiscountPercent: Number(body.offerDiscountPercent ?? 100),
        offerTitle: body.offerTitle || 'Academic Session 2026-27 Special Drive',
        offerSubtext: body.offerSubtext || '100% Verification Fee Waiver for Gurgaon & NCR Educators',
        officeAddress: body.officeAddress || 'M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001',
        helplinePhones: body.helplinePhones || '+91 95174 47689, +91 92170 31899',
        supportEmail: body.supportEmail || 'info@sssamacademy.com',
      },
    });

    return NextResponse.json({
      success: true,
      config: updated,
    });
  } catch (error: any) {
    console.error('Error updating platform config:', error);
    return NextResponse.json({ success: false, error: 'Failed to update platform config' }, { status: 500 });
  }
}
