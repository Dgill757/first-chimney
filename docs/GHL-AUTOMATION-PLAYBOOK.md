# First Chimney: GoHighLevel Automation Playbook

The full back office for a one-man chimney company, built inside Andrew's own GoHighLevel sub-account. The website already sends every form with the right tags (see `CRM-SETUP.md` to connect it). This document is everything that happens *after* a form arrives.

The goal: Andrew answers the phone and does the work. The system does the follow-up, reminders, reviews, referrals and rebooking.

> Build every workflow, test it with your own phone number, then **publish**. Nothing below needs a paid add-on except A2P texting registration and (optionally) a GHL phone number for missed-call text back.

---

## 0. Before anything else (one-time, ~1 hour)

1. **Business profile:** Settings → Business Profile. Name `First Chimney Contracting`, phone `(757) 589-0783`, email, logo, time zone (Eastern).
2. **A2P 10DLC registration:** Settings → Phone Numbers → Trust Center. Required before texting. Use the privacy and SMS terms page `https://www.firstchimneycontracting.com/privacy-policy` as the opt-in policy URL, and describe the opt-in as "checkbox on website forms". Approval takes several days, so start it first.
3. **Phone number:** Buy a local GHL number and forward it to Andrew's cell (or port the 757 number in later). This enables call tracking, missed-call text back and recorded calls.
4. **Custom values** (Settings → Custom Values) so every message stays consistent:
   - `{{custom_values.review_link}}` → Google review link (once the profile is live)
   - `{{custom_values.booking_link}}` → GHL calendar link
   - `{{custom_values.owner_cell}}` → Andrew's cell, for internal alerts
5. **Calendar:** Calendars → New → "Chimney Service" (60–90 min, buffer 30 min, Andrew as the only member). Turn on confirmation and reminder notifications.
6. **Connect the website:** create the Inbound Webhook workflow from `CRM-SETUP.md` §1A and put its URL in Vercel as `GHL_WEBHOOK_URL`. Redeploy.

---

## 1. Pipelines

### Jobs (homeowners)
`New Lead → Contacted → Scheduled → Inspected / Cleaned → Estimate Sent → Approved → Job Complete → Review Requested → Lost`

### Partners (realtors, home inspectors, property managers)
`New Partner → Intro Call → First Referral Sent → Active Partner → Inactive`

### Recruiting
`Applied → Phone Screen → Working Interview → Offer → Hired → Not a Fit`

**Custom fields worth adding** (Settings → Custom Fields):
- Contact: `Fireplace type` (Wood / Gas / Insert / Stove / Pellet), `Number of flues`, `Last service date` (date), `Referred by` (text), `Partner company` (text)
- Opportunity: `Job photos` (file upload, multiple), `Findings` (large text), `Quote amount` (monetary)

`Last service date` is what drives the yearly reminder, so set it on every completed job.

---

## 2. What the website sends (tags → what to do)

| Form on the site | Tags applied | Workflow |
| --- | --- | --- |
| Holiday $199 popup / page | `Website Lead`, `Holiday Special - $199` | W1, W2, W3 |
| Contact / service request | `Website Lead`, `Service: …` | W1, W3 |
| Chimney Health Check | `Website Lead`, `Chimney Health Check`, `Health Check: Urgent/Soon/Good` | W1, W4 |
| Build Your Fireplace / shop quote | `Website Lead`, `Fireplace Design Request` or `Product Quote Request` | W1, W3 |
| Refer a friend | `Website Lead`, `Referral` | W10 |
| Real estate partner | `Referral Partner`, `Partner: Realtor` (etc.) | W11 |
| Job application | `Recruiting`, `Job Applicant`, `Applied: …` | W12 |
| Testimonial | `Testimonial` | W9 |
| Yearly reminder signup | `Annual Reminder` | W8 |
| Every form | `Website Form`, `Form: …`, `SMS Consent: Yes/No` | |

`Website Lead` is only applied to people who may need work, so Andrew's new-lead alert never fires for job applicants or newsletter sign-ups.

**Consent rule for every workflow below:** add an If/Else at the start of any marketing text. Text only when the contact has `SMS Consent: Yes`; otherwise send the email version. Transactional replies to someone who just asked for help are fine by text if they gave a phone number and checked the contact box, but keep them about their request.

---

## 3. Workflows

Copy is written in Andrew's voice: short, friendly, no pressure. Replace nothing except the custom values.

### W1. New lead: instant alert + instant reply
**Trigger:** Contact tag added `Website Lead`
1. **Internal notification (SMS to Andrew):** `New lead: {{contact.name}} {{contact.phone}}. {{contact.city}}. Tap to call. Note in GHL.`
2. **Create/Update opportunity** → Jobs pipeline → `New Lead`.
3. **SMS to lead (immediately):**
   > Hi {{contact.first_name}}, this is Andrew with First Chimney. Got your request. I'm usually on a roof during the day, so I'll call you shortly. If texting is easier, just reply here.
4. **Wait 10 minutes** (business hours only).
5. **If** opportunity still in `New Lead` → internal SMS to Andrew: `Still waiting: {{contact.name}} {{contact.phone}}. Call now.`

Speed matters more than anything else in this business. The first company to call back usually gets the job.

### W2. Holiday $199 follow-up
**Trigger:** Tag added `Holiday Special - $199`
1. Move opportunity to `New Lead`, value $199.
2. If no appointment after **1 day**:
   > Hi {{contact.first_name}}, Andrew again. Still want to get your chimney cleaned and inspected for $199 before the holidays? Reply with a day that works and I'll lock it in.
3. If no reply after **3 days**: email "Your $199 spot is still open" with a booking link.
4. If no reply after **7 days**: last SMS:
   > Last note from me so I'm not a pest. If you want the $199 cleaning + inspection later, just text this number anytime.
5. **Stop the workflow** if the contact replies or books (Workflow settings → "Stop on response").

### W3. Unanswered inquiry nudges
**Trigger:** Opportunity in `New Lead` or `Contacted` for 1 day with no appointment.
- Day 1 SMS: `Hi {{contact.first_name}}, Andrew from First Chimney. Is now a good time to get you on the schedule?`
- Day 3 email: short recap of what they asked for and a booking link.
- Day 7 SMS: `Just checking in one last time. Text me whenever you're ready.`
- Stop on reply.

### W4. Health Check: route by result
**Trigger:** Tag added `Chimney Health Check`
- **If** tag `Health Check: Urgent` → internal SMS to Andrew marked URGENT, and SMS to the homeowner:
  > Hi {{contact.first_name}}, Andrew here. Based on your answers, please don't use the fireplace until I take a look. I'll call you today to get you scheduled.
- **If** `Health Check: Soon` → normal W1 flow, plus email "What your health check means" with a link to the matching blog guide.
- **If** `Health Check: Good` → add tag `Annual Reminder` (starts W8).

### W5. Appointment confirmations and reminders
**Trigger:** Appointment booked (Chimney Service calendar)
- Immediately: `You're booked for {{appointment.start_time}}. Andrew from First Chimney. Please clear the area around the fireplace and don't burn for 24 hours before so it's cool.`
- 24 hours before: reminder with the same note.
- 2 hours before: `On my way soon. See you at {{appointment.start_time}}.`
- Move opportunity to `Scheduled`.

### W6. Estimate follow-up
**Trigger:** Opportunity moved to `Estimate Sent`
- Day 2: `Hi {{contact.first_name}}, any questions on the estimate? Happy to walk through it on the phone.`
- Day 5: email with the photos and findings again.
- Day 10: `Want me to hold a spot on the schedule for this? No pressure either way.`
- Day 30: move to `Lost` if no response, and tag `Estimate - No Decision` (W14 picks it up next season).

### W7. Job complete → review request
**Trigger:** Opportunity moved to `Job Complete`
1. Set `Last service date` = today.
2. **2 hours later:** SMS:
   > Thanks for having me out today, {{contact.first_name}}. If you were happy with the work, a quick Google review helps a small business like mine more than you know: {{custom_values.review_link}}
3. **3 days later** (if no review detected): email version of the same ask.
4. Move to `Review Requested`. Add tag `Annual Reminder`.

**Rules:** ask *every* customer, not just the happy ones (selective asking breaks Google policy). Never offer anything in exchange for a review. Never write one for a customer.

### W8. Yearly inspection reminder (the recurring revenue engine)
**Trigger:** Tag added `Annual Reminder`
- **Wait until** `Last service date` + 11 months (or 11 months from today if empty).
- SMS/email:
  > Hi {{contact.first_name}}, it's Andrew from First Chimney. It's been about a year since your chimney was looked at. Want to get on the schedule before the fall rush? Reply with a good day.
- If no reply in 7 days, one email follow-up. Then repeat next year.

This is the single most valuable automation. Every completed job becomes a yearly customer with no extra marketing spend.

### W9. Testimonial received
**Trigger:** Tag added `Testimonial`
- Internal email to Dan + Andrew with the testimonial text (it's in the contact note, with publish permission recorded).
- Reply to the customer: `Thank you, {{contact.first_name}}. That means a lot. Andrew`
- If the customer's words are good, also send them the Google review link (W7 rule: ask, never pressure).
- To publish on the website: add to `REVIEWS` in `src/data/content.ts` (first name + town only).

### W10. Referral received
**Trigger:** Tag added `Referral`
1. Internal SMS to Andrew: `Referral from {{contact.name}}. Who to call is in the note.`
2. Thank the referrer right away:
   > Thank you for sending your friend my way, {{contact.first_name}}. I'll reach out to them today and let them know you sent me.
3. Andrew creates a contact for the friend with `Referred by` = referrer name, then the normal Jobs flow.
4. When that friend's job is marked complete, send the referrer a thank-you (and the reward, once Andrew picks one; set `REFERRAL_REWARD` in `src/data/growth.ts` so the site matches).

### W11. Real estate partner nurture
**Trigger:** Tag added `Referral Partner`
1. Opportunity → Partners pipeline → `New Partner`. Internal SMS to Andrew.
2. Immediately, email:
   > Subject: chimney inspections for your clients
   > Thanks for reaching out. I'm Andrew Paterini, F.I.R.E. Certified Technician and owner of First Chimney. When a listing or a buyer's inspection turns up a chimney question, I can usually get out quickly and give a plain-English answer with photos. My cell is (757) 589-0783. Text me anytime with an address and a deadline.
3. Day 3: Andrew calls (task assigned).
4. Monthly: one short, useful email (for example the Level 2 inspection guide link). Never more than once a month.
5. After a partner sends a job, move to `Active Partner` and send a personal thank-you text.

### W12. Job applicant
**Trigger:** Tag added `Job Applicant`
1. Opportunity → Recruiting → `Applied`. Internal email to Andrew with the application.
2. Reply to the applicant:
   > Thanks for applying to First Chimney, {{contact.first_name}}. Andrew reads every application himself. If it looks like a fit, he'll call you to set up a quick phone chat.
3. Task for Andrew: review within 3 days.
4. If moved to `Not a Fit`, send a polite closing message within a week. Nobody should be left hanging.

### W13. Missed call text back
**Trigger:** Call status: missed / no answer (GHL number)
> Sorry I missed you. This is Andrew with First Chimney, probably on a roof right now. What can I help you with? I'll call you back as soon as I'm down.

Creates the contact automatically and drops it into W1 when they reply.

### W14. Seasonal reactivation (twice a year)
**Trigger:** Manual, or a scheduled bulk action in **late August** and **early March**.
**Audience:** Past customers and `Estimate - No Decision`, `SMS Consent: Yes` only.
- August: `Fall is the busy season for chimneys. Want to get your cleaning and inspection done before the rush? Reply with a day.`
- March: `Spring is the best time to fix leaks and masonry before summer storms. Want me to take a look at anything?`

---

## 4. Reporting (5 minutes every Monday)

Dashboard → add widgets:
- New leads this week, by source (tag `Source: …` / `Form: …`)
- Speed to first contact (from W1)
- Appointments booked
- Estimates sent vs approved (close rate)
- Revenue won
- Reviews requested vs received
- Contacts with `Annual Reminder` (the size of the recurring base)

---

## 5. Test checklist (do not call it live until all pass)

- [ ] Submit each website form with your own phone: holiday, contact, health check (answer "Yes" to smoke → Urgent), refer, partner, careers, testimonial, reminder
- [ ] Each contact shows the tags in §2 and a note with the details
- [ ] Andrew's phone gets the W1 alert within a minute for `Website Lead` forms only
- [ ] Job applicant does **not** trigger the new-lead alert and does **not** appear in the Jobs pipeline
- [ ] Health Check Urgent sends the "please don't use the fireplace" text
- [ ] Moving a test opportunity to `Job Complete` sends the review request with the real Google link
- [ ] Missed call to the GHL number sends the text back
- [ ] Replying "STOP" to a text unsubscribes (GHL handles this automatically)
