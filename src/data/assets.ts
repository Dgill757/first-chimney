/** Hero photo per builder/shop topic, all manufacturer marketing photography from the catalog. */
const HEROES: Record<string, { file: string; alt: string }> = {
  'new-fireplace-installation': { file: '/catalog/kozy/gallery/gen-7220-single-livingroomb-horz-copy.webp', alt: 'Linear gas fireplace built into a wall in a bright living room' },
  'gas-inserts': { file: '/catalog/kozy/gallery/chaska29-crushed-glass-livingroom-e1760551265147.webp', alt: 'Gas insert installed in a red brick fireplace' },
  'freestanding-wood-stove': { file: '/catalog/kozy/gallery/oakport-prairie-room.webp', alt: 'Freestanding stove on a hearth in a living room' },
  'woodstove-inserts': { file: '/catalog/kozy/gallery/chaska-34-bak-room-e1760551659771.webp', alt: 'Fireplace insert in a stacked stone surround' },
  'electric-fireplace-installation': { file: '/catalog/modernflames/gallery/multi-56-roomw.webp', alt: 'Electric linear fireplace with wood storage' },
};

export function heroAsset(folder: string): { file: string; alt: string } | undefined {
  return HEROES[folder] ?? HEROES['new-fireplace-installation'];
}
