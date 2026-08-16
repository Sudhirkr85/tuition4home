import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
  bytes: number;
}

/**
 * Uploads a file buffer or base64 string to Cloudinary.
 * @param fileBuffer Base64 data URI or Buffer
 * @param folder Cloudinary folder name (e.g. 'tuitionforhome/avatars', 'tuitionforhome/kyc', 'tuitionforhome/videos')
 * @param resourceType 'image' | 'video' | 'raw' | 'auto'
 */
export async function uploadToCloudinary(
  fileBuffer: string | Buffer,
  folder: string = 'tuitionforhome/uploads',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<CloudinaryUploadResult> {
  const isMock = !process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY.includes('mock');

  if (isMock) {
    const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      url: `https://res.cloudinary.com/demo/image/upload/${mockId}.jpg`,
      secureUrl: `https://res.cloudinary.com/demo/image/upload/${mockId}.jpg`,
      publicId: `${folder}/${mockId}`,
      format: 'jpg',
      resourceType,
      bytes: 102400,
    };
  }

  try {
    let uploadSource: string;
    if (Buffer.isBuffer(fileBuffer)) {
      uploadSource = `data:${resourceType === 'video' ? 'video/mp4' : 'image/jpeg'};base64,${fileBuffer.toString('base64')}`;
    } else {
      uploadSource = fileBuffer;
    }

    const result = await cloudinary.uploader.upload(uploadSource, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    });

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format || 'jpg',
      resourceType: (result.resource_type as any) || resourceType,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

/**
 * Permanently deletes an asset from Cloudinary.
 * ONLY Admin / Super Admin can invoke this.
 * @param publicId Cloudinary public_id
 * @param resourceType 'image' | 'video' | 'raw'
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{ success: boolean; result: string }> {
  const isMock = !process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY.includes('mock');

  if (isMock) {
    return { success: true, result: 'ok' };
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    return {
      success: res.result === 'ok',
      result: res.result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete asset from Cloudinary');
  }
}

export default cloudinary;
