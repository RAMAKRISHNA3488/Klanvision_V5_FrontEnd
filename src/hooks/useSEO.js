// ============================================================
// useSEO.js
// A reusable hook to dynamically update per-page SEO meta tags.
// Call this at the top of every page component.
// ============================================================

import { useEffect } from 'react';

export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = '/og-image.jpg',
}) {
  useEffect(() => {
    // ── Dynamic URL Resolver ─────────────────────────────────
    let finalCanonical = canonical;
    if (canonical) {
      if (canonical.startsWith('/')) {
        finalCanonical = window.location.origin + canonical;
      } else if (!canonical.startsWith('http')) {
        finalCanonical = window.location.origin + '/' + canonical;
      }
    }

    let finalOgImage = ogImage;
    if (ogImage) {
      if (ogImage.startsWith('/')) {
        finalOgImage = window.location.origin + ogImage;
      } else if (!ogImage.startsWith('http')) {
        finalOgImage = window.location.origin + '/' + ogImage;
      }
    }

    // ── Title ────────────────────────────────────────────────
    document.title = title;

    // ── Helper: get or create a <meta> tag ───────────────────
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = attr.split('=');
        el.setAttribute(attrName, attrVal.replace(/"/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // ── Standard Meta ────────────────────────────────────────
    setMeta('meta[name="description"]', 'name=description', description);
    if (keywords) setMeta('meta[name="keywords"]', 'name=keywords', keywords);

    // ── Canonical ────────────────────────────────────────────
    if (finalCanonical) setLink('canonical', finalCanonical);

    // ── Open Graph ───────────────────────────────────────────
    setMeta('meta[property="og:title"]', 'property=og:title', title);
    setMeta('meta[property="og:description"]', 'property=og:description', description);
    setMeta('meta[property="og:image"]', 'property=og:image', finalOgImage);
    if (finalCanonical) setMeta('meta[property="og:url"]', 'property=og:url', finalCanonical);

    // ── Twitter ──────────────────────────────────────────────
    setMeta('meta[name="twitter:title"]', 'name=twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name=twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name=twitter:image', finalOgImage);

    // ── Cleanup: restore home defaults on unmount ─────────────
    return () => {
      document.title = 'Klanvision';
      setMeta('meta[name="description"]', 'name=description',
        'Klanvision – Unique, Safe, and Scalable Digital Innovations for Corporate Success. Web development, mobile apps, cloud services, SEO and more.');
      setLink('canonical', window.location.origin + '/');
    };
  }, [title, description, keywords, canonical, ogImage]);
}
