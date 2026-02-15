
/**
 * Utility for image optimization and format conversion
 */

/**
 * Transforms a standard image URL into an optimized .avif format.
 * Uses the wsrv.nl (Cloudflare-backed) image proxy for high-performance conversion.
 */
export const getOptimizedImage = (
  url: string,
  width?: number,
  height?: number
): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.endsWith('.svg')) return url;

  const cleanUrl = url.replace(/^https?:\/\//, '');

  const params = new URLSearchParams({
    url: cleanUrl,
    output: 'webp', // 👈 change here
    q: '85',
  });

  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  if (width && height) params.append('fit', 'cover');

  return `https://wsrv.nl/?${params.toString()}`;
};


