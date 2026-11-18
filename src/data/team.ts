/**
 * First Chimney's own photography: Andrew, the crew and real jobs.
 * Originals provided by Summit Marketing Group on 2026-11-14 and optimized into
 * public/media/team (full size + "-sm" thumbnail).
 *
 * Experience figures supplied by Dan on 2026-11-14. Confirm with Andrew and edit here.
 */
export const EXPERIENCE = {
  ownerYears: 10,
  teamYears: 25,
};

const T = '/media/team/';
export type TeamPhoto = { src: string; sm: string; alt: string; category: GalleryCategory; w: number; h: number };
export type GalleryCategory = 'Andrew & the crew' | 'Masonry & rebuilds' | 'Caps, crowns & liners' | 'On the job';

const photo = (name: string, alt: string, category: GalleryCategory, w = 1448, h = 1086): TeamPhoto => ({ src: `${T}${name}.webp`, sm: `${T}${name}-sm.webp`, alt, category, w, h });

/** Named photos used in specific places across the site. */
export const TEAM = {
  portrait: photo('andrew-paterini-owner-portrait', 'Andrew Paterini, owner of First Chimney Contracting', 'Andrew & the crew', 1536, 1024),
  headshot: photo('andrew-paterini-headshot', 'Andrew Paterini smiling, owner of First Chimney Contracting', 'Andrew & the crew', 1536, 1024),
  // Replaced the leaning-on-truck image (distorted side mirror, 2026-11-17). Keep this key so existing pages still resolve.
  withTruck: photo('andrew-paterini-owner-portrait', 'Andrew Paterini, owner of First Chimney Contracting', 'Andrew & the crew', 1536, 1024),
  sweeping: photo('andrew-cleaning-fireplace-chimney-brush', 'Andrew cleaning a fireplace with a chimney brush, drop cloths down', 'Andrew & the crew', 1536, 1024),
  roofBrush: photo('andrew-brushing-chimney-flue-roof', 'Andrew brushing a chimney flue from the roof beside a chimney cap', 'Andrew & the crew', 1536, 1024),
  liner: photo('service-truck-stone-chimney-home', 'Technician feeding a flexible stainless steel liner into a stone chimney from the roof', 'Caps, crowns & liners'),
  crown: photo('andrew-chimney-crown-repair', 'Andrew finishing a new chimney crown on a brick chimney', 'Caps, crowns & liners', 1600, 900),
  capCrown: photo('stone-chimney-service-ladder', 'Technician installing a stainless chimney cap on a stone chimney', 'Caps, crowns & liners', 1600, 900),
  rebuild: photo('chimney-rebuild-scaffolding-new-brick', 'Chimney rebuild with scaffolding and new brick staged on site', 'Masonry & rebuilds', 1600, 900),
  roofProtection: photo('chimney-repair-roof-protection', 'Chimney repair with the roof protected under tarps', 'Masonry & rebuilds', 1371, 1086),
  inspectionRoof: photo('andrew-roof-brick-chimney-truck', 'Andrew on the roof at a brick chimney, First Chimney truck in the driveway', 'On the job'),
};

/** Every photo, in gallery order. */
export const JOB_PHOTOS: TeamPhoto[] = [
  TEAM.portrait,
  TEAM.sweeping,
  TEAM.crown,
  TEAM.rebuild,
  TEAM.roofBrush,
  photo('first-chimney-truck-brick-chimney-service', 'Andrew working on a brick chimney with the First Chimney truck parked out front', 'On the job'),
  photo('tall-brick-chimney-rebuild-ladder', 'Rebuilding a tall exterior brick chimney with new flue tiles staged on the lawn', 'Masonry & rebuilds', 1536, 1024),
  photo('chimney-masonry-scaffolding-repair', 'Masonry repair on a brick chimney from scaffolding', 'Masonry & rebuilds'),
  TEAM.inspectionRoof,
  photo('chimney-masonry-rebuild-in-progress', 'Chimney masonry rebuild in progress with the work area protected', 'Masonry & rebuilds'),
  TEAM.capCrown,
  TEAM.headshot,
  photo('tall-chimney-masonry-repair', 'Masonry repair at the top of a tall brick chimney', 'Masonry & rebuilds', 1536, 1024),
  TEAM.liner,
  TEAM.roofProtection,
  photo('chimney-service-call-brick-home', 'Chimney service at a home with a brick chimney', 'On the job', 1600, 900),
  photo('service-truck-roof-chimney-work', 'Andrew working on a chimney with the First Chimney service truck parked out front', 'On the job'),
  photo('roof-chimney-masonry-work', 'Masonry work on a brick chimney from the roof', 'Masonry & rebuilds', 1086, 1448),
];

export const GALLERY_CATEGORIES: GalleryCategory[] = ['Andrew & the crew', 'Masonry & rebuilds', 'Caps, crowns & liners', 'On the job'];
