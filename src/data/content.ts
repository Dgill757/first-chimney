/**
 * Shared site content: FAQs, projects and reviews.
 *
 * PROJECTS and REVIEWS are empty on purpose. Only real First Chimney jobs and
 * real customer reviews go here. See docs/CRM-SETUP.md for the photo approval
 * workflow. The site renders honest empty states until these are filled.
 */
import { HOLIDAY_PROMO } from '../lib/promo';
import { SITE, STATE_LIST_TEXT } from '../lib/site';

export const GENERAL_FAQS: { q: string; a: string }[] = [
  {
    q: 'What is included in the $199 holiday special?',
    a: `${HOLIDAY_PROMO.title}. We clean the flue, smoke chamber and firebox, inspect the chimney and fireplace, and walk you through what we found. If anything needs repair, you get a quote first and nothing is done without your approval.`,
  },
  {
    q: 'What areas do you serve?',
    a: `First Chimney Contracting serves homeowners in ${STATE_LIST_TEXT}. Call or text ${SITE.phoneDisplay} with your address and we will confirm we can reach you before booking.`,
  },
  {
    q: 'Are you certified?',
    a: 'Yes. Andrew Paterini, the owner, holds F.I.R.E. certification for chimney inspection.',
  },
  {
    q: 'How often should my chimney be inspected and cleaned?',
    a: 'NFPA 211 recommends an inspection at least once a year, with cleaning when buildup is found. Most homes that use a wood fireplace regularly need cleaning every year.',
  },
  {
    q: 'Will you make a mess in my house?',
    a: 'No. Drop cloths and containment go down before we start and we clean up before we leave.',
  },
  {
    q: 'Do you give quotes before doing repairs?',
    a: 'Always. If we find something during an inspection, we explain it, show you photos where possible and give you a quote. You decide what happens next.',
  },
  {
    q: 'Is submitting a form the same as booking?',
    a: 'No. A form is a request. We will call or text you to confirm a time that works. Your appointment is set once we have confirmed it with you.',
  },
  {
    q: 'Can I design a new fireplace with you?',
    a: 'Yes. Use the Design Your Fireplace tool to explore styles, materials and finishes, then send the design to us. It is a starting point for a conversation, not a quote, and we confirm what is possible on site.',
  },
];

export type Project = {
  slug: string;
  title: string;
  service: string;
  city: string;
  state: string;
  summary: string;
  before?: string;
  after?: string;
  photos: { src: string; alt: string }[];
  /** Must be true: homeowner gave written permission to publish photos of their property. */
  permission: boolean;
};

export const PROJECTS: Project[] = [];

export type Review = {
  author: string;
  city?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  source: 'Google' | 'Facebook' | 'Direct';
  date: string;
};

export const REVIEWS: Review[] = [];

/** Where customers can leave a review. Fill in once the Google Business Profile is live. */
export const REVIEW_LINK = '';
