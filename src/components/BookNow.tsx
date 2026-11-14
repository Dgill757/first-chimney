import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/** "Book a visit" button used by the ported builder. Routes to the request form. */
export function BookNow({ className, label, children }: { className?: string; label?: string; children: ReactNode }) {
  return (
    <Link to="/contact?service=Fireplace%20design%20or%20product" className={className} aria-label={label?.replace(' (opens in a new tab)', '')}>
      {children}
    </Link>
  );
}
