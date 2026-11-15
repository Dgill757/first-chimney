# First Chimney: what's next (for Dan)

Everything below is in order. Steps 1–3 switch on lead capture; the rest finishes the CRM.

## 1. Connect the website to the CRM (5 minutes)
1. Vercel → project **first-chimney** → Settings → Environment Variables.
2. Add `GHL_PRIVATE_TOKEN`: value from `C:\Users\DanGi\.first-chimney-ghl.env`, type **Sensitive**, Production + Preview.
3. Add `GHL_LOCATION_ID` = `agCfqvrQiesd0B3Fjb7n`, Production + Preview + Development.
4. Deployments → latest → **Redeploy**.
5. Test: submit the holiday form, the health check (answer Yes to smoke), a partner guide request and a job application. Each should appear in GHL within a minute with tags, filled fields and an opportunity in the right pipeline.

## 2. Phone and texting
1. GHL sub-account → Settings → Phone Numbers → buy a local number (or port the 757 line later). Forward it to Andrew's cell.
2. Trust Center → A2P 10DLC registration. Use https://www.firstchimneycontracting.com/privacy-policy as the policy URL; the opt-in is the website form checkbox. Approval takes days, and texts do not send until it is approved.

## 3. Fix the placeholders
- Settings → Business Profile: replace "Virginia Beach, VA 23451" with Andrew's real business address (needed in marketing email footers).
- Confirm the inbox info@firstchimneycontracting.com exists, or change the account email.
- Add Andrew as a user (Settings → Users). Then switch internal notifications from +1 757-589-0783 and Dan's email to "Assigned user" if you prefer.

## 4. Finish the automations
Workflows 01–05 are published. Build 06–21 from `crm/WORKFLOWS.md`: GHL → Automation → Workflows → **Build using AI** → paste → check each If/Else → **Publish**. About a minute each. Or open a session and say "finish the GHL workflows" and I will build them in the browser.

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
