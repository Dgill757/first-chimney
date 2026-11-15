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
- Andrew is added as a user (admin, Paterini@yahoo.com). Done 2026-11-15. He is Cc'd on the owner-alert email in workflows 01 (new lead) and 24 (customer replied). The other alert emails still go to Dan only; add him as Cc in each if you want (open the Internal Notification action → Cc → Save action → Save).
- Assign Andrew to the Chimney Service calendar in the GHL UI (the API ignores teamMembers on this calendar type, and a partial PUT wipes the hours).
- Fix the white-label login domain: my.dlgsolutions.com does not load (dlgsolutions.com uses Afternic parking nameservers, so `my` resolves to parking IPs, not HighLevel). Add the CNAME HighLevel asks for in Agency View → Settings → Company → White Label, at the registrar's DNS. Until then Andrew logs in at app.gohighlevel.com, which his guide lists first.

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

## Andrew's guide
`marketing/andrew-guide/First-Chimney-Andrews-Guide.html` (interactive, one file, works offline) and `.pdf` (26 pages) plus the two manuals. Rebuild after edits: `python marketing/andrew-guide/build.py` (source is `guide.src.html`). Email the PDF and the HTML to Andrew (Paterini@yahoo.com).

## Housekeeping
- Test contacts in GHL: "QA Test Applicant", "QA Holiday Test", "QA Live Applicant" (tagged `QA Test - safe to delete`) and 12 "QA Final ..." contacts (emails `dangill+fcqa-<form>@summitmarketinggroup.co`, tag `source: qa-final`). Delete them when you are ready (contacts are never deleted automatically).
- Approvals still open: $199 terms, hours, brands, city list, homeowner photo permissions (COMPLETION-REPORT §7).
