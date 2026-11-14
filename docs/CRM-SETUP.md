# CRM Setup: Website → Andrew's GoHighLevel

Andrew's CRM is the GoHighLevel sub-account provided by Summit Marketing Group. The website does **not** store leads and is **not** a second CRM. Every form posts to `/api/lead` (a Vercel function), which forwards to GHL.

> Use **Andrew's** sub-account credentials. Do not use Summit Voice AI's own location or token.

## 1. Connect (pick A, or do both)

### A. Inbound webhook (fastest, about 5 minutes)

1. In Andrew's sub-account: **Automation → Workflows → Create workflow → Start from scratch**.
2. Trigger: **Inbound Webhook**. Copy the webhook URL.
3. Vercel → project `first-chimney` → **Settings → Environment Variables** → add `GHL_WEBHOOK_URL` = that URL (Production + Preview). Redeploy.
4. Submit a test on `/holiday-chimney-special`. Back in the trigger, click **Fetch sample request** and you will see every field below.
5. Add action **Create/Update Contact** and map: `first_name`, `last_name`, `email`, `phone`, `address1`, `city`, `state`, `postal_code`.
6. Add action **Add Tag** using `{{inboundWebhookRequest.tags}}` (comma-separated) or add the fixed tags you want.
7. Add action **Add Note** with `{{inboundWebhookRequest.note}}` (full formatted summary incl. UTM and fireplace design).
8. Optional: **Create Opportunity** in the job pipeline. **Publish** the workflow (never leave it in draft).

Webhook fields: `ref, form, form_id, first_name, last_name, full_name, phone, email, address1, city, state, postal_code, service, timeframe, message, details, products, promotion, tags, sms_consent, source_page, landing_page, referrer, utm_source, utm_medium, utm_campaign, utm_content, note, submitted_at`.

### B. Private Integration token (richer, no workflow needed for intake)

1. Sub-account **Settings → Private Integrations → Create**. Scopes: `contacts.write`, `contacts.readonly`, `opportunities.write` (only if using pipelines).
2. Vercel env vars:
   - `GHL_PRIVATE_TOKEN` = `pit-...`
   - `GHL_LOCATION_ID` = the sub-account location id
   - Optional `GHL_PIPELINE_ID` + `GHL_PIPELINE_STAGE_ID` to open an opportunity per lead (holiday leads get `monetaryValue: 199`).
3. The function upserts the contact (no duplicates by email/phone), applies tags and adds a note.

The token lives only in Vercel's encrypted env vars. It is never in the browser, the repo or the logs.

If both are set, both run. A lead counts as delivered if at least one succeeds; otherwise the visitor sees "please call or text" (no fake success).

## 2. Tags the site applies

| Tag | When |
| --- | --- |
| `Website Lead` | Every submission |
| `Form: Holiday $199 Cleaning + Inspection` | Holiday form |
| **`Holiday Special - $199`** | Holiday form and saved-offer leads |
| `Fireplace Design Request` | Design Your Fireplace submission (note contains the full design + a link to reopen it) |
| `Product Quote Request` | Fireplace shop quote (note lists the products) |
| `Service: <name>` | When a service is chosen |
| `State: VA/NJ/CT/MA` | When a state is chosen |
| `Source: <utm_source>`, `Campaign: <utm_campaign>` | When the visitor arrived from a tagged link |
| `SMS Consent: Yes/No` | Always. Only text marketing to `Yes` |

## 3. Recommended workflows (build in GHL, publish, do not enable paid add-ons without approval)

| Workflow | Trigger | Steps |
| --- | --- | --- |
| New lead alert | Tag added `Website Lead` | Internal SMS + email to Andrew with name, phone, service, note. Assign to Andrew. |
| Holiday acknowledgement | Tag added `Holiday Special - $199` | Wait 1 min → SMS (only if `SMS Consent: Yes`) or email: "Got your $199 holiday request. Andrew will text you shortly to pick a time." Move opportunity to "New - Holiday". |
| Speed-to-lead | Tag `Website Lead` | If no reply/appointment in 15 min during business hours → internal reminder to call. |
| Missed-call text back | Call status: missed (on the GHL number) | SMS: "Sorry we missed you, this is Andrew at First Chimney. How can I help?" Requires the call to route through a GHL number. |
| Appointment confirm + reminders | Appointment booked | Confirmation now, reminder 24h and 2h before. |
| Unanswered inquiry follow-up | Tag `Website Lead`, no appointment after 1 day | Day 1, Day 3, Day 7 nudges, stop on reply. |
| Estimate follow-up | Opportunity stage = "Estimate sent" | Day 2 and Day 5 check-ins. |
| Job complete + review request | Opportunity stage = "Completed" | Thank-you SMS/email with Google review link (set `REVIEW_LINK` on the site too). |
| Annual reminder | Opportunity "Completed" | Wait 11 months → "Time for your yearly chimney inspection." |

Consent: only send marketing texts to contacts tagged `SMS Consent: Yes`; honor STOP automatically (GHL does). A2P 10DLC registration is required before texting at volume; the site's Privacy & SMS Terms page (`/privacy-policy`) has the language carriers look for.

## 4. Suggested job pipeline

`New lead → Contacted → Scheduled → Inspected/Cleaned → Estimate sent → Approved → Completed → Review requested`

## 5. Job photos at the customer's house (native first)

Simplest native flow in the **LeadConnector** mobile app:

1. Open the app → **Contacts** → search the customer.
2. Open their **Opportunity** (the job) or the contact record.
3. Upload photos to a **File Upload custom field** (create one called "Job Photos" on the opportunity, so photos stay grouped per job), or attach them in the contact's conversation as an internal comment.
4. Add a note with findings. Save.

To verify in Andrew's account before relying on it: (a) create the opportunity custom field "Job Photos" (type File Upload, allow multiple), (b) confirm it is editable from the mobile app on his phone. If the mobile app cannot upload to opportunity fields in his version, use contact-level File Upload fields or the conversation attachment method and note the job date in the caption. A custom uploader is only worth building if neither works.

**Website gallery:** customer photos are never published automatically. To feature a job, get the homeowner's written OK, pick photos, and add an entry in `src/data/content.ts → PROJECTS` with `permission: true`. The gallery, before/after slider and lightbox are already built and appear as soon as one project exists.

## 6. Verification checklist (do not call it live until all pass)

- [ ] Submit the holiday form with a real phone → contact appears in GHL within a minute
- [ ] Contact has tag `Holiday Special - $199` and the note with UTM info
- [ ] New-lead alert reaches Andrew's phone
- [ ] Holiday acknowledgement arrives (if SMS consent checked)
- [ ] Designer submission note contains the design summary and link
- [ ] Vercel → Functions logs show `[lead FC-...] webhook=true` (or `api=true`)
