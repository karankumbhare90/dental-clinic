
/**
 * Dynamic SEO Management Utility
 */

export interface SEOMetadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

/**
 * Updates page metadata for SEO and social sharing.
 * Call this inside page components or a global router hook.
 */
export const setPageMetadata = (meta: SEOMetadata) => {
  const siteName = "Lumina Dental";
  const fullTitle = meta.title ? `${meta.title} | ${siteName}` : siteName;

  // Update Title
  document.title = fullTitle;

  // Update Meta Description
  if (meta.description) {
    updateMetaTag('name', 'description', meta.description);
    updateMetaTag('property', 'og:description', meta.description);
    updateMetaTag('name', 'twitter:description', meta.description);
  }

  // Update OG Title
  updateMetaTag('property', 'og:title', fullTitle);
  updateMetaTag('name', 'twitter:title', fullTitle);

  // Update Image
  if (meta.image) {
    updateMetaTag('property', 'og:image', meta.image);
    updateMetaTag('name', 'twitter:image', meta.image);
  }

  // Update Type
  if (meta.type) {
    updateMetaTag('property', 'og:type', meta.type);
  }

  // Update Canonical URL
  if (meta.url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', meta.url);
    updateMetaTag('property', 'og:url', meta.url);
  }
};

/**
 * Internal helper to create or update meta tags
 */
function updateMetaTag(attr: string, key: string, content: string) {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}
