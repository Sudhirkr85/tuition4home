import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'tuitionforhome/uploads';
    const uploadType = (formData.get('type') as string) || 'image'; // 'image' | 'video' | 'raw'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // 1. File Size Validation
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
    const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10 MB
    const MAX_VIDEO_SIZE = 60 * 1024 * 1024; // 60 MB

    if (uploadType === 'image' && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ success: false, error: 'Image file size exceeds 5MB limit' }, { status: 400 });
    }
    if (uploadType === 'raw' && file.size > MAX_DOC_SIZE) {
      return NextResponse.json({ success: false, error: 'Document file size exceeds 10MB limit' }, { status: 400 });
    }
    if (uploadType === 'video' && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json({ success: false, error: 'Video file size exceeds 60MB limit' }, { status: 400 });
    }

    // 2. MIME Type Validation
    const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const allowedDocMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (uploadType === 'image' && !allowedImageMimes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Only JPG, PNG, or WEBP images are allowed' }, { status: 400 });
    }
    if (uploadType === 'raw' && !allowedDocMimes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Only PDF or image documents are allowed' }, { status: 400 });
    }
    if (uploadType === 'video' && !allowedVideoMimes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Only MP4, WEBM, or MOV videos are allowed' }, { status: 400 });
    }

    // 3. Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload to Cloudinary
    const resourceType = uploadType === 'video' ? 'video' : uploadType === 'raw' ? 'raw' : 'image';
    const result = await uploadToCloudinary(buffer, folder, resourceType);

    return NextResponse.json({
      success: true,
      url: result.secureUrl || result.url,
      publicId: result.publicId,
      format: result.format,
      bytes: result.bytes,
      message: 'File uploaded successfully to Cloudinary',
    });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal upload error' }, { status: 500 });
  }
}
