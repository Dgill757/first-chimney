/**
 * Chimney fire news from local outlets across the U.S. Each entry is a short summary in our own
 * words with a link to the original reporting. Never copy article text. Add new items at the top.
 * Collected 2026-11-15.
 */

export type NewsTag = 'Creosote' | 'Animal nest' | 'Gas fireplace' | 'Wood stove' | 'Total loss' | 'Spread into home' | 'Contained to chimney' | 'Cause under investigation';

export type NewsItem = {
  title: string;
  place: string;
  state: string;
  date: string; // YYYY-MM or YYYY-MM-DD
  source: string;
  url: string;
  summary: string;
  lesson: string;
  tags: NewsTag[];
};

const RAW: NewsItem[] = [
  {
    title: 'Chimney fire spreads into a Morris County home',
    place: 'Washington Township',
    state: 'NJ',
    date: '2026-11-15',
    source: 'WRNJ Radio',
    url: 'https://wrnjradio.com/chimney-fire-spreads-into-home-in-morris-county/',
    summary: 'Crews called shortly after midnight found a chimney fire that had already moved into the house. Firefighters opened walls to reach the flames before they spread further.',
    lesson: 'A chimney fire can travel into walls you cannot see. A yearly inspection checks the flue and the clearances around it.',
    tags: ['Spread into home'],
  },
  {
    title: 'Gas fireplace chimney fire traced to an animal nest',
    place: 'Fond du Lac',
    state: 'WI',
    date: '2026-11-12',
    source: 'WBAY',
    url: 'https://www.wbay.com/2026/11/13/nest-blamed-fond-du-lac-chimney-fire/',
    summary: 'Flames and smoke came from the chimney of a natural gas fireplace. Investigators blamed nesting material, and crews kept the fire to the chimney.',
    lesson: 'Gas fireplaces need their venting checked too. A proper cap keeps animals out.',
    tags: ['Animal nest', 'Gas fireplace', 'Contained to chimney'],
  },
  {
    title: 'Roof collapses around a chimney after an unattended fire',
    place: 'Adams County',
    state: 'IL',
    date: '2026-11-13',
    source: 'WGEM',
    url: 'https://www.wgem.com/2026/11/14/chimney-fire-causes-roof-collapse-along-hunter-road/',
    summary: 'A neighbor spotted smoke and called 911. Part of the roof around the chimney collapsed while firefighters worked, and the cause is under investigation.',
    lesson: 'Never leave a fire unattended, and keep working smoke alarms on every level.',
    tags: ['Cause under investigation', 'Spread into home'],
  },
  {
    title: 'Chimney fire closes a road in Andover',
    place: 'Andover',
    state: 'MA',
    date: '2026-11-11',
    source: 'Andover News',
    url: 'https://andovermanews.com/nov-11-public-safety-notebook-chimney-fire-closes-clark-road-police-investigate-man-claiming-to-be-federal-agent/',
    summary: 'Firefighters found smoke coming from the chimney of a two-and-a-half-story home, and police closed the street for the response.',
    lesson: 'Early fall is when buildup from last season causes trouble. Clean before the first fire.',
    tags: ['Contained to chimney'],
  },
  {
    title: 'Creosote fire knocked down in Southampton',
    place: 'Southampton',
    state: 'MA',
    date: '2026-10-31',
    source: 'WWLP',
    url: 'https://www.wwlp.com/news/local-news/hampshire-county/southampton-crews-put-out-chimney-fire-on-wolcott-road/',
    summary: 'A thermal camera showed parts of the chimney well over 200 degrees. Crews used a weighted chain to knock down burning creosote, and officials reminded residents to get chimneys cleaned.',
    lesson: 'Creosote is fuel. A cleaning removes it before it can ignite.',
    tags: ['Creosote', 'Contained to chimney'],
  },
  {
    title: 'Firefighters stop a chimney fire before it reaches the house',
    place: 'Gloucester Township',
    state: 'NJ',
    date: '2026-10-23',
    source: 'Shore News Network',
    url: 'https://www.shorenewsnetwork.com/firefighters-stop-chimney-fire-from-spreading-into-gloucester-township-home/',
    summary: 'Crews contained the fire to the chimney and fireplace and kept it from spreading into the home.',
    lesson: 'Fast calls save homes. If you hear roaring or see sparks from the chimney, get out and call 911.',
    tags: ['Contained to chimney'],
  },
  {
    title: 'Chimney fire damages walls of a Peshtigo home',
    place: 'Town of Peshtigo',
    state: 'WI',
    date: '2026-05-17',
    source: 'FOX 11',
    url: 'https://fox11online.com/news/local/chimney-fire-damages-home-in-town-of-peshtigo-rivers-edge-drive-flames-walls-crews-hotspots-injuries',
    summary: 'The fire moved from the chimney into the facade and interior walls around it, and crews spent time chasing hot spots.',
    lesson: 'Cracked flue liners let heat reach wood framing. A camera inspection finds the cracks.',
    tags: ['Spread into home'],
  },
  {
    title: 'Hidden chimney fire causes major damage in Attleboro',
    place: 'Attleboro',
    state: 'MA',
    date: '2026-04-23',
    source: 'WJAR NBC 10',
    url: 'https://turnto10.com/news/local/chimney-fire-causes-significant-damage-to-attleboro-house-rocklawn-avenue-april-27-2026',
    summary: 'Fire spread into concealed spaces behind walls and between floors. The family was displaced and damage was estimated at a quarter million dollars or more.',
    lesson: 'Most of the cost of a chimney fire is what it reaches inside the walls.',
    tags: ['Spread into home'],
  },
  {
    title: 'Chimney fire grows to a second alarm in Torrington',
    place: 'Torrington',
    state: 'CT',
    date: '2026-02-28',
    source: 'WTNH',
    url: 'https://www.wtnh.com/news/connecticut/litchfield/no-injuries-reported-after-house-fire-in-torrington/',
    summary: 'A reported chimney fire turned into flames through the roof and on the second floor. Everyone got out safely.',
    lesson: 'Working smoke alarms and a practiced escape plan matter as much as a clean chimney.',
    tags: ['Spread into home'],
  },
  {
    title: 'Police help a resident out during a chimney fire',
    place: 'Great Barrington',
    state: 'MA',
    date: '2026-02-17',
    source: 'iBerkshires',
    url: 'https://www.iberkshires.com/story/81732/Great-Barrington-Fire-Police-Respond-to-Chimney-Fire.html',
    summary: 'Firefighters quickly knocked down a fire in a metal chimney that left burn marks where it meets the eaves.',
    lesson: 'Factory-built metal chimneys need clearances and inspections too.',
    tags: ['Contained to chimney'],
  },
  {
    title: 'Chimney fire destroys a Vilas County home',
    place: 'Land O’ Lakes',
    state: 'WI',
    date: '2026-02-01',
    source: 'WSAW',
    url: 'https://www.wsaw.com/2026/02/01/chimney-fire-destroys-vilas-county-home/',
    summary: 'An overnight chimney fire spread to the roof. Everyone got out, but the house was a total loss.',
    lesson: 'Peak winter burning is peak chimney fire season. Clean before the cold sets in.',
    tags: ['Total loss'],
  },
  {
    title: 'Chimney fire destroys a Cedarburg home',
    place: 'Town of Cedarburg',
    state: 'WI',
    date: '2026-01-31',
    source: 'WISN 12',
    url: 'https://www.wisn.com/article/chimney-fire-destroys-cedarburg-home/70214951',
    summary: 'More than fifteen departments responded. Investigators believe the fire started in the chimney, and the home was declared a total loss.',
    lesson: 'A yearly inspection costs a few hundred dollars. A total loss costs everything.',
    tags: ['Total loss'],
  },
  {
    title: 'Fast-moving chimney fire destroys a Lodi home',
    place: 'Lodi',
    state: 'NY',
    date: '2026-01',
    source: 'Finger Lakes Daily News',
    url: 'https://www.fingerlakesdailynews.com/local/lodi-ny/chimney-fire-destroys-lodi-home/',
    summary: 'Crews fought the fire for hours in extreme cold. The home and its contents were a total loss, though belongings were saved early on.',
    lesson: 'Heavy use in cold snaps builds creosote fast. Heavy burners may need more than one cleaning a season.',
    tags: ['Total loss'],
  },
  {
    title: 'Chimney fire kept out of a Sussex County home',
    place: 'Stillwater Township',
    state: 'NJ',
    date: '2026-01',
    source: 'WRNJ Radio',
    url: 'https://wrnjradio.com/firefighters-extinguish-chimney-fire-at-sussex-county-home-without-structural-damage/',
    summary: 'Several departments put out a chimney fire with no extension into the home and no injuries.',
    lesson: 'A sound liner and crown can keep a chimney fire inside the chimney.',
    tags: ['Contained to chimney'],
  },
  {
    title: 'Creosote blamed for a fire that reached walls and attic',
    place: 'Newberry',
    state: 'FL',
    date: '2025-12-23',
    source: 'Mainstreet Daily News',
    url: 'https://www.mainstreetdailynews.com/news/firefighters-extinguish-chimney-fire',
    summary: 'Fire spread from the chimney into walls and the attic before crews stopped it. Officials noted that hardwoods like oak still produce creosote.',
    lesson: 'All firewood makes creosote. Dry, seasoned wood makes less, but nothing makes zero.',
    tags: ['Creosote', 'Spread into home'],
  },
  {
    title: 'Creosote plug causes a second-alarm fire',
    place: 'Thornton',
    state: 'NH',
    date: '2025-11-22',
    source: 'WMUR',
    url: 'https://www.wmur.com/article/second-alarm-thornton-nh-fire-creosote-plug-112325/69522733',
    summary: 'A fire that started in the chimney spread into the attic. Smoke alarms woke the residents, and officials pointed to a creosote plug.',
    lesson: 'Smoke alarms saved lives here. A cleaning would have removed the fuel.',
    tags: ['Creosote', 'Spread into home'],
  },
  {
    title: 'Clogged spark arrestor leads to a damaging fire',
    place: 'Kamiah',
    state: 'ID',
    date: '2025-04-19',
    source: 'Idaho County Free Press',
    url: 'https://www.idahocountyfreepress.com/news/creosote-buildup-cause-for-saturday-fire-in-kamiah/article_1e6dac91-360d-4c8e-9b67-bf7bbcfa34c1.html',
    summary: 'The state fire marshal traced the fire to a spark arrestor clogged with creosote, which trapped superheated gases.',
    lesson: 'Caps and spark arrestors get cleaned during a sweep. A blocked cap is a hazard, not a protection.',
    tags: ['Creosote', 'Spread into home'],
  },
  {
    title: 'Wood stove creosote fire kept in the chimney',
    place: 'Groveland',
    state: 'MA',
    date: '2025-01-27',
    source: 'WHAV',
    url: 'https://whav.net/2025/01/28/groveland-fire-department-blames-creosote-buildup-for-wood-stove-chimney-fire/',
    summary: 'Firefighters contained a wood stove fire, blamed on creosote buildup, to the home’s metal chimney.',
    lesson: 'Wood stoves running daily can need cleaning more than once a winter.',
    tags: ['Creosote', 'Wood stove', 'Contained to chimney'],
  },
];

/** Newest first, whatever order items are added in. */
export const NEWS: NewsItem[] = [...RAW].sort((a, b) => b.date.localeCompare(a.date));

export const NEWS_STATS = {
  source: 'U.S. Fire Administration',
  url: 'https://www.usfa.fema.gov/statistics/reports/fire-causes/heating-fires-residential-buildings-v21i10.html',
  trendUrl: 'https://www.usfa.fema.gov/statistics/residential-fires/heating.html',
  lines: [
    'An estimated 34,200 heating fires in residential buildings were reported each year from 2017 to 2019, causing about 165 deaths and $367 million in property loss a year.',
    'Most of those were confined fires in chimneys, flues or fuel burners.',
    'Heating fires peak in January and are lowest in summer.',
  ],
};
