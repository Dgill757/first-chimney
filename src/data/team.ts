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
  withTruck: photo('andrew-paterini-first-chimney-truck', 'Andrew Paterini leaning on a First Chimney Contracting truck', 'Andrew & the crew', 1536, 1024),
  sweeping: photo('andrew-cleaning-fireplace-chimney-brush', 'Andrew cleaning a fireplace with a chimney brush, drop cloths down', 'Andrew & the crew', 1536, 1024),
  roofBrush: photo('andrew-brushing-chimney-flue-roof', 'Andrew brushing a chimney flue from the roof beside a chimney cap', 'Andrew & the crew', 1536, 1024),
  liner: photo('andrew-carrying-stainless-chimney-liner', 'Andrew carrying a stainless steel chimney liner up a ladder', 'Caps, crowns & liners', 1536, 1024),
  crown: photo('andrew-chimney-crown-repair', 'Andrew finishing a new chimney crown on a brick chimney', 'Caps, crowns & liners', 1600, 900),
  capCrown: photo('andrew-chimney-cap-crown-seal', 'Andrew sealing a chimney crown around a new stainless chimney cap', 'Caps, crowns & liners'),
  rebuild: photo('chimney-rebuild-scaffolding-new-brick', 'Chimney rebuild with scaffolding and new brick staged on site', 'Masonry & rebuilds', 1600, 900),
  teardown: photo('chimney-teardown-rebuild-tarps', 'Chimney torn down to the roofline for a rebuild, home protected with tarps', 'Masonry & rebuilds'),
  roofProtection: photo('chimney-repair-roof-protection', 'Chimney repair with the roof protected under tarps', 'Masonry & rebuilds', 1371, 1086),
  inspectionRoof: photo('chimney-inspection-roof-truck', 'Andrew inspecting a chimney from the roof, First Chimney truck in the driveway', 'On the job'),
  truckDoor: photo('first-chimney-truck-phone-number', 'First Chimney Contracting truck door with the phone number (757) 589-0783', 'On the job', 1141, 570),
};

/** Every photo, in gallery order. */
export const JOB_PHOTOS: TeamPhoto[] = [
  TEAM.withTruck,
  TEAM.sweeping,
  TEAM.liner,
  TEAM.crown,
  TEAM.rebuild,
  TEAM.capCrown,
  TEAM.roofBrush,
  TEAM.teardown,
  photo('first-chimney-truck-brick-chimney-service', 'Andrew working on a brick chimney with the First Chimney truck parked out front', 'On the job'),
  photo('tall-brick-chimney-rebuild-ladder', 'Rebuilding a tall exterior brick chimney with new flue tiles staged on the lawn', 'Masonry & rebuilds', 1536, 1024),
  TEAM.portrait,
  photo('chimney-masonry-scaffolding-repair', 'Masonry repair on a brick chimney from scaffolding', 'Masonry & rebuilds'),
  photo('andrew-roof-brick-chimney-truck', 'Andrew on the roof at a brick chimney, First Chimney truck in the driveway', 'On the job'),
  photo('chimney-masonry-rebuild-in-progress', 'Chimney masonry rebuild in progress with the work area protected', 'Masonry & rebuilds'),
  photo('stone-chimney-service-ladder', 'Servicing a stone chimney with a stainless cap', 'Caps, crowns & liners', 1600, 900),
  TEAM.headshot,
  photo('tall-chimney-masonry-repair', 'Masonry repair at the top of a tall brick chimney', 'Masonry & rebuilds', 1536, 1024),
  photo('service-truck-stone-chimney-home', 'First Chimney service truck at a home with a stone chimney', 'On the job'),
  TEAM.roofProtection,
  photo('chimney-service-call-brick-home', 'Chimney service at a home with a brick chimney', 'On the job', 1600, 900),
  photo('service-truck-roof-chimney-work', 'Andrew working on a chimney with the First Chimney service truck parked out front', 'On the job'),
  photo('roof-chimney-masonry-work', 'Masonry work on a brick chimney from the roof', 'Masonry & rebuilds', 1086, 1448),
  photo('chimney-service-truck-colonial-home', 'First Chimney truck at a colonial home during chimney service', 'On the job'),
  TEAM.inspectionRoof,
  TEAM.truckDoor,
];

export const GALLERY_CATEGORIES: GalleryCategory[] = ['Andrew & the crew', 'Masonry & rebuilds', 'Caps, crowns & liners', 'On the job'];
