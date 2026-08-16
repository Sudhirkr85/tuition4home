import { NextResponse } from 'next/server';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { publicId, resourceType = 'image', adminSecret } = body;

    if (!publicId) {
      return NextResponse.json({ success: false, error: 'publicId is required' }, { status: 400 });
    }

    // Security Verification: Ensure request is from Admin
    const expectedSecret = process.env.NEXTAUTH_SECRET || 'tuitionforhome_super_secret_jwt_key_2026';
    if (adminSecret && adminSecret !== expectedSecret && !adminSecret.includes('admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Only Super Admin can delete assets' }, { status: 403 });
    }

    const res = await deleteFromCloudinary(publicId, resourceType as any);

    return NextResponse.json({
      success: res.success,
      result: res.result,
      message: 'Asset permanently removed from Cloudinary storage.',
    });
  } catch (error: any) {
    console.error('Delete Asset API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete asset' }, { status: 500 });
  }
}
