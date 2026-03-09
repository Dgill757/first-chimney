import { useEffect } from 'react';
import { SITE } from '@/lib/site';

type SEOProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

function upsertMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (property) {
      el.setAttribute('property', name);
    } else {
      el.setAttribute('name', name);
    }
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function SEO({ title, description, path, image = SITE.ogImage }: SEOProps) {
  useEffect(() => {
    const canonical = `${SITE.domain}${path}`;
    document.title = `${title} | ${SITE.name}`;

    upsertMeta('description', description);
    upsertMeta('robots', 'index,follow');
    upsertMeta('og:type', 'website', true);
    upsertMeta('og:site_name', SITE.name, true);
    upsertMeta('og:title', `${title} | ${SITE.name}`, true);
    upsertMeta('og:description', description, true);
    upsertMeta('og:url', canonical, true);
    upsertMeta('og:image', `${SITE.domain}${image}`, true);
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', `${title} | ${SITE.name}`);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image', `${SITE.domain}${image}`);
    upsertLink('canonical', canonical);
  }, [description, image, path, title]);

  return null;
}