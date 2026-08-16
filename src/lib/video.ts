/**
 * Utility for parsing and embedding YouTube, Vimeo, Google Drive, and Direct Video Files.
 */

export interface VideoSourceInfo {
  type: 'youtube' | 'vimeo' | 'gdrive' | 'direct' | 'none';
  embedUrl: string;
  originalUrl: string;
  isEmbeddable: boolean;
}

export function getVideoSourceInfo(url?: string | null): VideoSourceInfo {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { type: 'none', embedUrl: '', originalUrl: '', isEmbeddable: false };
  }

  const trimmed = url.trim();

  // Filter out any placeholder / dummy strings
  if (
    trimmed.toLowerCase().includes('placeholder') ||
    trimmed === '/placeholder-video.mp4' ||
    trimmed === '#' ||
    trimmed === 'null' ||
    trimmed === 'undefined' ||
    trimmed === 'N/A' ||
    trimmed === 'none'
  ) {
    return { type: 'none', embedUrl: '', originalUrl: '', isEmbeddable: false };
  }

  // 1. YouTube Watch / Share / Shorts / Embed
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/ ]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      originalUrl: trimmed,
      isEmbeddable: true,
    };
  }

  // 2. Vimeo Link
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i);
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
    const videoId = vimeoMatch[3] || vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      originalUrl: trimmed,
      isEmbeddable: true,
    };
  }

  // 3. Google Drive Video Link
  const gdriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      type: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
      originalUrl: trimmed,
      isEmbeddable: true,
    };
  }

  // 4. Direct Video Files (MP4, WebM, QuickTime, Cloudinary, Base64 data URI)
  const isDirectVideo =
    (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('data:video/') || trimmed.startsWith('blob:') || trimmed.startsWith('/uploads/')) &&
    (trimmed.endsWith('.mp4') ||
     trimmed.endsWith('.webm') ||
     trimmed.endsWith('.mov') ||
     trimmed.startsWith('data:video/') ||
     trimmed.includes('cloudinary.com') ||
     trimmed.includes('/video/upload/') ||
     trimmed.startsWith('blob:') ||
     trimmed.startsWith('/uploads/'));

  if (isDirectVideo) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      originalUrl: trimmed,
      isEmbeddable: true,
    };
  }

  return {
    type: 'none',
    embedUrl: '',
    originalUrl: trimmed,
    isEmbeddable: false,
  };
}
