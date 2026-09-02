import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminOrCounselor } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_CONFIG = {
  id: 'global_config',
  baseVerificationFee: 999,
  isOfferActive: true,
  offerDiscountPercent: 100,
  offerTitle: 'Academic Session 2026-27 Special Drive',
  offerSubtext: '100% Verification Fee Waiver for Gurgaon & NCR Educators',
  officeAddress: 'M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001',
  helplinePhones: '+91 92170 31899',
  supportEmail: 'info@sssamacademy.com',
  mapProvider: 'GOOGLE_MAPS',
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null,
  googleMapsUsageCount: 0,
  googleMapsLimit: 25000,
};

function sanitizePublicConfig(config: any) {
  if (!config) return DEFAULT_CONFIG;
  const sanitized = { ...config };
  // Never expose sensitive server API keys or secret limits in public responses
  delete sanitized.googleMapsApiKey;
  delete sanitized.googleMapsUsageCount;
  return sanitized;
}

export async function GET(req: Request) {
  try {
    const authUser = await verifyAdminOrCounselor(req);

    // 1. Fast Read-only query (No write-locks / no upsert on GET)
    let config = await prisma.platformConfig.findUnique({
      where: { id: 'global_config' },
    });

    if (!config) {
      try {
        config = await prisma.platformConfig.create({
          data: DEFAULT_CONFIG,
        });
      } catch {
        config = await prisma.platformConfig.findUnique({
          where: { id: 'global_config' },
        });
      }
    }

    const outputConfig = authUser && authUser.role === 'SUPER_ADMIN'
      ? (config || DEFAULT_CONFIG)
      : sanitizePublicConfig(config || DEFAULT_CONFIG);

    return NextResponse.json(
      {
        success: true,
        config: outputConfig,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching platform config:', error);
    return NextResponse.json(
      {
        success: true,
        config: sanitizePublicConfig(DEFAULT_CONFIG),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  }
}

export async function POST(req: Request) {
  // Enforce Admin Authentication before allowing configuration mutation
  const authUser = await verifyAdminOrCounselor(req);
  if (!authUser || authUser.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Only Super Admin can modify platform settings.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const updated = await prisma.platformConfig.upsert({
      where: { id: 'global_config' },
      update: {
        baseVerificationFee:
          body.baseVerificationFee !== undefined ? Number(body.baseVerificationFee) : undefined,
        isOfferActive: body.isOfferActive !== undefined ? Boolean(body.isOfferActive) : undefined,
        offerDiscountPercent:
          body.offerDiscountPercent !== undefined ? Number(body.offerDiscountPercent) : undefined,
        offerTitle: body.offerTitle || undefined,
        offerSubtext: body.offerSubtext || undefined,
        officeAddress: body.officeAddress || undefined,
        helplinePhones: body.helplinePhones || undefined,
        supportEmail: body.supportEmail || undefined,
        mapProvider: body.mapProvider || undefined,
        googleMapsApiKey:
          body.googleMapsApiKey !== undefined ? body.googleMapsApiKey.trim() || null : undefined,
        googleMapsUsageCount:
          body.googleMapsUsageCount !== undefined ? Number(body.googleMapsUsageCount) : undefined,
        googleMapsLimit:
          body.googleMapsLimit !== undefined ? Number(body.googleMapsLimit) : undefined,
      },
      create: {
        id: 'global_config',
        baseVerificationFee: Number(body.baseVerificationFee || 999),
        isOfferActive: Boolean(body.isOfferActive ?? true),
        offerDiscountPercent: Number(body.offerDiscountPercent ?? 100),
        offerTitle: body.offerTitle || 'Academic Session 2026-27 Special Drive',
        offerSubtext: body.offerSubtext || '100% Verification Fee Waiver for Gurgaon & NCR Educators',
        officeAddress:
          body.officeAddress ||
          'M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001',
        helplinePhones: body.helplinePhones || '+91 92170 31899',
        supportEmail: body.supportEmail || 'info@sssamacademy.com',
        mapProvider: body.mapProvider || 'GOOGLE_MAPS',
        googleMapsApiKey:
          body.googleMapsApiKey?.trim() || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null,
        googleMapsUsageCount: Number(body.googleMapsUsageCount || 0),
        googleMapsLimit: Number(body.googleMapsLimit || 25000),
      },
    });

    return NextResponse.json({
      success: true,
      config: updated,
    });
  } catch (error: any) {
    console.error('Error updating platform config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update platform config' },
      { status: 500 }
    );
  }
}

