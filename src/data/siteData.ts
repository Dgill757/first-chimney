/** Adapter so the ported builder reads First Chimney's business facts from src/lib/site.ts. */
import { SITE } from '../lib/site';

export const BUSINESS = {
  name: SITE.name,
  phone: SITE.phoneDisplay,
  phoneHref: SITE.phoneHref,
  email: SITE.email,
};

/** Manufacturer room photography from the catalog (not any company's project photos). */
export const ASSETS = {
  family: '/catalog/kozy/gallery/gen-7220-single-livingroomb-horz-copy.webp',
  fireplace: '/catalog/kozy/gallery/chaska-34-bak-room-e1760551659771.webp',
};
