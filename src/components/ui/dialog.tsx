import type { ReactNode } from 'react';
import { OverlayContent, OverlayDescription, OverlayRoot, OverlayTitle } from './overlay';

export const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: ReactNode }) => (
  <OverlayRoot open={open} onOpenChange={onOpenChange} variant="dialog">{children}</OverlayRoot>
);
export const DialogContent = ({ className, children }: { className?: string; showCloseButton?: boolean; children: ReactNode }) => <OverlayContent className={className}>{children}</OverlayContent>;
export const DialogTitle = OverlayTitle;
export const DialogDescription = OverlayDescription;
