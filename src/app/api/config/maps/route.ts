import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Returns client map provider configuration
export async function GET() {
  try {
    const config = await prisma.platformConfig.findUnique({
      where: { id: 'global_config' },
      select: {
        mapProvider: true,
        googleMapsApiKey: true,
        googleMapsUsageCount: true,
        googleMapsLimit: true,
      },
    });

    const apiKey = config?.googleMapsApiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    const hasValidGoogleKey = Boolean(apiKey && apiKey.trim().length > 10 && apiKey !== 'mock_google_maps_api_key');
    const requestedProvider = config?.mapProvider || 'GOOGLE_MAPS';
    const usageCount = config?.googleMapsUsageCount || 0;
    const limit = config?.googleMapsLimit || 25000;

    // Auto-fallback condition: If limit exceeded or no key, fallback to OPENSTREETMAP
    const effectiveProvider = (requestedProvider === 'GOOGLE_MAPS' && hasValidGoogleKey && usageCount < limit)
      ? 'GOOGLE_MAPS'
      : 'OPENSTREETMAP';

    return NextResponse.json({
      success: true,
      provider: effectiveProvider,
      requestedProvider,
      googleMapsApiKey: hasValidGoogleKey ? apiKey : null,
      hasValidGoogleKey,
      usageCount,
      limit,
    });
  } catch (error: any) {
    console.error('Error fetching map configuration:', error);
    return NextResponse.json({
      success: false,
      provider: 'OPENSTREETMAP',
      requestedProvider: 'OPENSTREETMAP',
      googleMapsApiKey: null,
      hasValidGoogleKey: false,
      usageCount: 0,
      limit: 25000,
    });
  }
}

// Increment Google Maps usage count
export async function POST() {
  try {
    const updated = await prisma.platformConfig.update({
      where: { id: 'global_config' },
      data: {
        googleMapsUsageCount: { increment: 1 },
      },
      select: {
        googleMapsUsageCount: true,
        googleMapsLimit: true,
      },
    });

    return NextResponse.json({
      success: true,
      usageCount: updated.googleMapsUsageCount,
      limit: updated.googleMapsLimit,
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
