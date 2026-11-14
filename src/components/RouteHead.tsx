import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fullTitle, NOT_FOUND_META, routeFor, type RouteMeta } from '@/lib/routes';
import { SITE } from '@/lib/site';
import { track } from '@/lib/track';

function meta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function applyHead(r: RouteMeta) {
  const title = fullTitle(r);
  const url = `${SITE.domain}${r.path === '/' ? '/' : r.path}`;
  const image = r.image.startsWith('http') ? r.image : `${SITE.domain}${r.image}`;
  document.title = title;
  meta('name', 'description', r.description);
  meta('name', 'robots', r.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large');
  meta('property', 'og:type', r.path.startsWith('/blog/') ? 'article' : 'website');
  meta('property', 'og:site_name', SITE.name);
  meta('property', 'og:title', title);
  meta('property', 'og:description', r.description);
  meta('property', 'og:url', url);
  meta('property', 'og:image', image);
  meta('name', 'twitter:card', 'summary_large_image');
  meta('name', 'twitter:title', title);
  meta('name', 'twitter:description', r.description);
  meta('name', 'twitter:image', image);

  let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canon) {
    canon = document.createElement('link');
    canon.rel = 'canonical';
    document.head.appendChild(canon);
  }
  canon.href = url;

  document.head.querySelectorAll('script[data-route-ld]').forEach((n) => n.remove());
  for (const ld of r.jsonLd) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.dataset.routeLd = '1';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }
}

/** Keeps <head> in sync with the route registry, scrolls to top and records the page view. */
export default function RouteHead() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const meta = routeFor(pathname);
    // Shop category/product heads are set by the shop page itself (catalog loads lazily).
    if (meta) applyHead(meta);
    else if (!pathname.startsWith('/fireplace-shop/')) applyHead({ ...NOT_FOUND_META, path: pathname });
    track('page_view', { path: pathname });
  }, [pathname]);

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
