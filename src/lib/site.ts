export const SITE = {
  name: 'First Chimney',
  domain: 'https://firstchimneycontracting.com',
  displayDomain: 'firstchimneycontracting.com',
  phoneDisplay: '757-589-0783',
  phoneHref: 'tel:+17575890783',
  serviceRegions: 'VA, MD, WV, & PA',
  email: 'info@firstchimneycontracting.com',
  logo: '/images/logos/logo-white.png',
  ogImage: '/images/hero-images/hayden-scott-lyTgIeUBOUE-unsplash-768x513.jpg',
  social: {
    facebook: 'https://www.facebook.com/firstchimneycontracting',
    instagram: 'https://www.instagram.com/firstchimneycontracting',
    linkedin: 'https://www.linkedin.com/company/first-chimney-contracting',
  },
};

export const IMAGE_ASSETS = {
  hero: '/images/hero-images/hayden-scott-lyTgIeUBOUE-unsplash-768x513.jpg',
  heroAlt: '/images/hero-images/chimney-cleaning-inspection.jpg',
  chimneySweep1: '/images/chimney-sweeping/sweep.jpg',
  chimneySweep2: '/images/chimney-sweeping/4L6A9294.jpg',
  chimneySweep3: '/images/chimney-sweeping/4L6A5532.jpg',
  inspection: '/images/hero-images/chimney-cleaning-inspection.jpg',
  inspectionAlt: '/images/chimney-sweeping/DSC05553.webp',
  cap: '/images/chimney-cap/Chimney.png',
  crown: '/images/chimney-crown/chimney-repair-image.webp',
  masonry: '/images/masonry/outdoor-fireplaces-monster-Home-services-e1659378925446.jpg',
  beforeAfter1: '/images/before-after-images/BA_fireplace-facelift-copy.jpg',
  beforeAfter2: '/images/before-after-images/Stone-Chimney.jpg',
  beforeAfter3: '/images/before-after-images/Before.webp',
  rebuild: '/images/before-after-images/1000s.jpg',
  fireplace: '/images/hero-images/7360968-640w.webp',
  heroVideo: '/images/videos/970176-hd_1920_1080_24fps.mp4',
};

export const SERVICES = [
  { id: 'chimney-inspection', title: 'Chimney Inspection' },
  { id: 'chimney-sweeping', title: 'Chimney Sweeping' },
  { id: 'masonry-rebuilds', title: 'Masonry & Rebuilds' },
  { id: 'leak-repair', title: 'Leak Repair & Waterproofing' },
  { id: 'chimney-cap', title: 'Chimney Cap & Chase Cover Installation' },
  { id: 'chimney-crown', title: 'Chimney Crown Repair' },
  { id: 'fireplace-repair', title: 'Fireplace Repair' },
  { id: 'dryer-vent-cleaning', title: 'Dryer Vent Cleaning' },
] as const;
