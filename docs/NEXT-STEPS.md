# First Chimney: what's next (for Dan)

Everything below is in order. Steps 1–3 switch on lead capture; the rest finishes the CRM.

## 1. Website ↔ CRM: done
The Vercel keys are in and live forms deliver to GHL (tested 2026-11-15). All 31 workflows are published, and the booking calendar exists. See `crm/WORKFLOWS.md`.

## 2. Phone and texting
1. GHL sub-account → Settings → Phone Numbers → buy a local number (or port the 757 line later). Forward it to Andrew's cell.
2. Trust Center → A2P 10DLC registration. Use https://www.firstchimneycontracting.com/privacy-policy as the policy URL; the opt-in is the website form checkbox. Approval takes days, and texts do not send until it is approved.

## 3. Fix the placeholders (10 minutes)
- Calendars → Chimney Service: set Andrew's real working hours and assign him once he is a user.
- Settings → Business Profile: replace "Virginia Beach, VA 23451" with Andrew's real business address (needed in marketing email footers).
- Confirm the inbox info@firstchimneycontracting.com exists, or change the account email.
- Add Andrew as a user (Settings → Users). Then switch internal notifications from +1 757-589-0783 and Dan's email to "Assigned user" if you prefer.

## 4. Automations: done
All 31 workflows are published, with re-entry on. Open any of them in GHL → Automation → Workflows to see the steps. To change wording, open the action and edit it, or use the workflow's AI panel.

## 5. Google Business Profile
Create and verify it (chapter 11 of the Owner's Manual). Then put the review link in:
- GHL → Settings → Custom Values → **Review Link**
- `src/data/content.ts` → `REVIEW_LINK` (turns on "Review us on Google" on the site)

## 6. Snapshot for future chimney clients
Once all workflows are published: Agency view → Account Snapshots → Create Snapshot → First Chimney Contracting → name it **Chimney Company OS v1**. For a new client: load the snapshot, run `node crm/setup.mjs values` against their env file, and update the notification recipients.

## 7. Hand Andrew his materials
- `marketing/owners-manual/First-Chimney-Owners-Operating-Manual.pdf` (31 pages)
- `marketing/owners-manual/First-Chimney-Team-Handbook.pdf` (13 pages, for every hire)
- Partner guides at firstchimneycontracting.com/resources (print a stack of each as leave-behinds)

## Housekeeping
- The test contact "QA Test Applicant" in GHL is tagged `QA Test - safe to delete`.
- Approvals still open: $199 terms, hours, brands, city list, homeowner photo permissions (COMPLETION-REPORT §7).
