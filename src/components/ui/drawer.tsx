import type { ReactNode } from 'react';
import { OverlayContent, OverlayDescription, OverlayRoot, OverlayTitle } from './overlay';

export const Drawer = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: ReactNode }) => (
  <OverlayRoot open={open} onOpenChange={onOpenChange} variant="drawer">{children}</OverlayRoot>
);
export const DrawerContent = OverlayContent;
export const DrawerTitle = OverlayTitle;
export const DrawerDescription = OverlayDescription;
