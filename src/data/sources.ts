/** External references for technical and safety claims. URLs verified 2026-11-14. */
export const SOURCES = {
  nfpa211: {
    label: 'NFPA 211: Standard for Chimneys, Fireplaces, Vents, and Solid Fuel-Burning Appliances',
    publisher: 'National Fire Protection Association',
    url: 'https://www.nfpa.org/codes-and-standards/nfpa-211-standard-development/211',
  },
  nfpaHeating: {
    label: 'Heating safety',
    publisher: 'National Fire Protection Association',
    url: 'https://www.nfpa.org/education-and-research/home-fire-safety/heating',
  },
  usfaHeating: {
    label: 'Heating fire safety',
    publisher: 'U.S. Fire Administration (FEMA)',
    url: 'https://www.usfa.fema.gov/prevention/home-fires/prevent-fires/heating/',
  },
  usfaAppliance: {
    label: 'Appliance and electrical fire safety (clothes dryers)',
    publisher: 'U.S. Fire Administration (FEMA)',
    url: 'https://www.usfa.fema.gov/prevention/home-fires/prevent-fires/appliance-and-electrical/',
  },
  epaBurnWise: {
    label: 'Burn Wise: best wood-burning practices',
    publisher: 'U.S. Environmental Protection Agency',
    url: 'https://www.epa.gov/burnwise/best-wood-burning-practices',
  },
} as const;

export type SourceId = keyof typeof SOURCES;
