/**
 * Utility for parsing and embedding YouTube, Vimeo, Google Drive, and Direct Video Files.
 */

export interface VideoSourceInfo {
  type: 'youtube' | 'vimeo' | 'gdrive' | 'direct' | 'none';
  embedUrl: string;
  originalUrl: string;
  isEmbeddable: boolean;
  title?: string;
}

export function getVideoSourceInfo(url?: string | null): VideoSourceInfo {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { type: 'none', embedUrl: '', originalUrl: '', isEmbeddable: false };
  }

  const trimmed = url.trim();

  // Filter out invalid/empty placeholders
  if (
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
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`,
      originalUrl: trimmed,
      isEmbeddable: true,
      title: 'YouTube Video',
    };
  }

  // 2. Vimeo Link
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i);
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
    const videoId = vimeoMatch[3] || vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      originalUrl: trimmed,
      isEmbeddable: true,
      title: 'Vimeo Video',
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
      title: 'Google Drive Video',
    };
  }

  // 4. Direct Video Files (.mp4, .webm, .mov, data URI, blob, or cloudinary/s3 URL)
  const isDirectVideo =
    trimmed.endsWith('.mp4') ||
    trimmed.endsWith('.webm') ||
    trimmed.endsWith('.mov') ||
    trimmed.includes('.mp4?') ||
    trimmed.includes('.webm?') ||
    trimmed.includes('/video/upload/') ||
    trimmed.includes('cloudinary.com') ||
    trimmed.startsWith('data:video/') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('/videos/') ||
    trimmed.startsWith('/placeholder-video.mp4') ||
    (trimmed.startsWith('http') && (trimmed.includes('video') || trimmed.includes('.mp4') || trimmed.includes('.webm')));

  if (isDirectVideo) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      originalUrl: trimmed,
      isEmbeddable: true,
      title: 'Direct Video File',
    };
  }

  // Fallback for any other valid HTTP URL: try as direct video
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return {
      type: 'direct',
      embedUrl: trimmed,
      originalUrl: trimmed,
      isEmbeddable: true,
      title: 'Web Video Stream',
    };
  }

  return {
    type: 'none',
    embedUrl: '',
    originalUrl: trimmed,
    isEmbeddable: false,
  };
}
