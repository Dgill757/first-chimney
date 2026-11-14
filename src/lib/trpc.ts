/**
 * Adapter: the ported builder calls `trpc.leads.submit.useMutation()`. Here that
 * posts to /api/lead (GoHighLevel) through the same pipeline as every other form.
 * Throws on failure so the builder shows its call/email fallback.
 */
import { useState } from 'react';
import { submitLead } from './leads';

type CccLead = {
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  serviceCategory?: string;
  serviceRequested?: string;
  projectDescription?: string;
  leadSource?: string;
  landingPage?: string;
  referrer?: string;
  preferredContactMethod?: string;
  consent?: boolean;
  zip?: string;
};

function useSubmit() {
  const [isPending, setPending] = useState(false);
  return {
    isPending,
    mutateAsync: async (v: CccLead) => {
      setPending(true);
      try {
        const res = await submitLead({
          formId: v.leadSource === 'shop' ? 'shop-quote' : 'fireplace-designer',
          name: [v.firstName, v.lastName].filter(Boolean).join(' '),
          phone: v.phone,
          email: v.email,
          zip: v.zip,
          service: v.serviceCategory,
          message: v.serviceRequested,
          details: v.projectDescription,
          consent: v.consent === true,
        });
        if (!res.ok) throw new Error(res.message);
        return { id: res.ref };
      } finally {
        setPending(false);
      }
    },
  };
}

export const trpc = { leads: { submit: { useMutation: useSubmit } } };
