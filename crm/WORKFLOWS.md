# First Chimney: GHL workflows (all 31 published) and their source prompts

Sub-account: **First Chimney Contracting** (location `agCfqvrQiesd0B3Fjb7n`).
Pipelines, custom fields, custom values and tags are created by `node crm/setup.mjs` (already run).

## How to rebuild or add one (about 1 minute each)

1. GHL → First Chimney sub-account → **Automation → Workflows → Build using AI**.
2. Paste the prompt below and send. If the builder asks a question, pick the option noted.
3. Open each If/Else and confirm the condition is filled in (the builder sometimes leaves it blank).
   Contact-tag workflows can only check **contact** fields and tags, not opportunity stages.
4. Toggle **Publish**.

## Status: 31 workflows, all published (2026-11-15)

Every workflow below is **published** and has **Allow re-entry ON**, so repeat customers flow through again. All internal alerts go to Andrew by SMS (+1 757-589-0783) and to Dan by email. Customer texts only send once a phone number and A2P registration are live; emails send now.

| # | Workflow | Trigger | What it does |
| --- | --- | --- | --- |
| 01 | New Lead: Instant Reply + Owner Alert | Tag `Website Lead` | Jobs opportunity, owner SMS + email, instant SMS + email to lead, 10-minute "still not called" nag |
| 02 | Jobs Pipeline: Stage Tags | Jobs stage changed | Keeps `Contacted`, `Scheduled`, `Job Complete`, `Past Customer`, `Annual Reminder`, `Estimate - No Decision` in sync |
| 03 | Holiday $199 Follow-Up | Tag `Holiday Special - $199` | Day 1 SMS, day 3 email, day 7 SMS; skips anyone `Scheduled`; stops on reply |
| 04 | Health Check Router | Tag `Chimney Health Check` | Urgent → owner alert + "don't use the fireplace" text; Good → yearly list; Soon → guidance email |
| 05 | Appointment Confirm + Reminders | Appointment confirmed | Confirmation SMS + email with prep tips, 24 h and 2 h reminders |
| 06 | Estimate Follow-Up | Jobs → Estimate Sent | Day 2, 5, 10 follow-ups; Lost + `Estimate - No Decision` at day 30 |
| 07 | Job Complete: Review Request | Jobs → Job Complete | Past Customer + yearly list, review SMS at 2 h, email at day 3, → Review Requested |
| 08 | Annual Reminder: Yearly Rebook | Tag `Annual Reminder` | Welcome email, then every ~365 days an SMS (with consent) or email and a follow-up; loops forever |
| 09 | Testimonial Received | Tag `Testimonial` | Alerts with the text and publish permission; thanks the customer, invites a Google review |
| 10 | Referral Received | Tag `Referral` | Owner alert with the friend's details, thanks the referrer ($25/$25), reminder next day |
| 11 | Referral Partner Nurture | Tag `Referral Partner` | Partners opportunity, intro email with guide + 10% rate, call reminder, 3 monthly value emails |
| 12 | Job Applicant | Tag `Job Applicant` | Alert with position, experience and resume link; applicant auto-reply; 3-day review reminder |
| 13 | Missed Call Text Back | Inbound call no-answer / busy / voicemail | Instant text-back, owner alert, 2-hour callback nag |
| 14 | Fireplace Project Lead | Tags `Fireplace Design Request` / `Product Quote Request` | Alert with design/products, email, day 2 SMS, day 7 and 21 emails |
| 15 | Door Knock Follow-Up | Tag `Door Knock` | 1-hour health check text, day 3 nudge, day 10 email + yearly list |
| 16 | Campaign: Fall Rush | Tag `Campaign: Fall Rush` | DNC check, SMS or email by consent, follow-up, removes tag |
| 17 | Campaign: Spring Masonry | Tag `Campaign: Spring Masonry` | Same pattern, leaks and masonry |
| 18 | Campaign: Pre-Snow | Tag `Campaign: Pre-Snow` | Same pattern, $199 before the first snow |
| 19 | Campaign: Database Reactivation | Tag `Campaign: Reactivation` | "Still interested?" email, SMS by consent, close-the-loop email |
| 20 | Do Not Contact | Tag `Do Not Contact` | DND on all channels, removes from all workflows, marks opportunity lost, alert |
| 21 | Referral Reward Owed | Tag `Referral Reward Owed` | Owner alert to apply the $25 credit, SMS + email to the referrer, `VIP / Repeat` |
| 22 | Appointment No-Show Recovery | Appointment no-show | `No Show`, owner alert, rebook SMS, email day 1, last SMS day 4 |
| 23 | Appointment Cancelled: Rebook | Appointment cancelled | Rebook SMS, email day 2, yearly list at day 16 if not rebooked |
| 24 | Customer Replied: Owner Alert | Any customer reply | SMS + email to the owner with the message (applicants go to email only) |
| 25 | Stale Lead Alert | Jobs opportunity idle 2 days in New Lead / Contacted / Inspected | Owner SMS + email |
| 26 | Inspection Done: Estimate Coming | Jobs → Inspected / Cleaned | Thank-you SMS, yearly list, next-day reminder to send the estimate |
| 27 | Job Approved: Confirmation | Jobs → Approved | Owner alert (materials, deposit), customer SMS + "what happens next" email |
| 28 | Post-Job Check-In + Referral Ask | Jobs → Job Complete | Day 7 check-in SMS, day 14 referral email, day 44 fireplace tips |
| 29 | Campaign: Holiday $199 Blast | Tag `Campaign: Holiday 199` | DNC check, offer by consent, 2 follow-ups, removes tag |
| 30 | Lost Lead Long-Term Nurture | Tag `Estimate - No Decision` | Day 30 and 90 emails, then hands off to Reactivation at day 180 |
| 31 | Review Left: Thank You | Tag `Review Left` | Thank-you SMS, `VIP / Repeat`, alert to reply on Google |

**Calendar:** "Chimney Service" (90-minute visits, Mon–Fri 8–5, Sat 9–1, placeholder hours) with booking page https://api.leadconnectorhq.com/widget/booking/95Ph3MxzG1csiA2CyruI, saved as the custom value **Booking Link**.

**Returning contacts:** the website API removes and re-adds trigger tags for existing contacts, so every repeat inquiry fires the automations again.

**Live test (2026-11-15):** a holiday form submission on the live site created the contact with the right tags, one Jobs/New Lead opportunity, and workflow 01 fired its steps. The customer SMS shows "failed" only because no phone number is connected yet.

**Before any text goes out:** buy or port a phone number in the sub-account and finish A2P 10DLC registration. Until then SMS steps are skipped and emails still send. Internal SMS alerts go to Andrew at +1 757-589-0783 and internal emails to dangill@summitmarketinggroup.co (change in each workflow once Andrew has a CRM login).

---

### 06 Estimate Follow-Up
```
Workflow name: 06 Estimate Follow-Up. Trigger: Pipeline Stage Changed, pipeline 'Jobs', stage is 'Estimate Sent'. Stop on response on. Actions: (1) Wait 2 days. (2) If/Else: if opportunity pipeline stage is 'Estimate Sent' then Send SMS: 'Hi {{contact.first_name}}, Andrew from First Chimney. Any questions on the estimate? Happy to walk through it on the phone or send more photos.' otherwise end. (3) Wait 3 days. (4) If/Else: if stage is still 'Estimate Sent' then Send Email subject 'your chimney estimate' body: 'Hi {{contact.first_name}}, following up on the estimate I sent. If anything is unclear, I am glad to go through each item with you. The photos show exactly what I found, and items are sorted by what is a safety issue now, what should be done this year, and what can wait. Reply here or call/text (757) 589-0783. Andrew Paterini, First Chimney Contracting' otherwise end. (5) Wait 5 days. (6) If/Else: if stage is still 'Estimate Sent' then Send SMS: 'Want me to hold a spot on the schedule for this? No pressure either way. Andrew' otherwise end. (7) Wait 20 days. (8) If/Else: if stage is still 'Estimate Sent' then Add Tag 'Estimate - No Decision' and move the opportunity to stage 'Lost' in pipeline 'Jobs'.
```

### 07 Job Complete: Review Request
```
Workflow name: 07 Job Complete - Review Request. Trigger: Pipeline Stage Changed, pipeline 'Jobs', stage is 'Job Complete'. Actions: (1) Add Tags 'Past Customer' and 'Annual Reminder'. (2) Wait 2 hours. (3) Send SMS: 'Thanks for having me out today, {{contact.first_name}}. If you were happy with the work, a quick Google review helps a small business like mine more than you know: {{custom_values.review_link}} Andrew, First Chimney' (4) Wait 3 days. (5) If/Else: if contact Tags does not include 'Review Left' then Send Email subject 'how did we do?' body: 'Hi {{contact.first_name}}, thank you again for choosing First Chimney. If you have a minute, a short review helps neighbors find an honest chimney company: {{custom_values.review_link}} And if anything was not right, reply here and I will make it right. Andrew Paterini'. (6) Move the opportunity to stage 'Review Requested' in pipeline 'Jobs'.
```
Rule: this goes to **every** completed customer. Never filter to happy customers, never offer anything for a review.

### 08 Annual Reminder (yearly rebook loop)
```
Workflow name: 08 Annual Reminder - Yearly Rebook. Trigger: Contact Tag Added, tag is 'Annual Reminder'. Allow re-entry on. Actions: (1) Send Email subject 'you are on the list' body: 'Hi {{contact.first_name}}, you are on the First Chimney yearly reminder list. Once a year, before the busy season, I will send one friendly note so you can book early. Andrew Paterini, (757) 589-0783'. (2) Wait 335 days. (3) If/Else: if contact Tags include 'SMS Consent: Yes' then Send SMS: 'Hi {{contact.first_name}}, it is Andrew from First Chimney. It has been about a year since your chimney was looked at. Want to get on the schedule before the fall rush? Reply with a good day.' otherwise Send Email subject 'time for your yearly chimney check' body: 'Hi {{contact.first_name}}, it has been about a year since your chimney was looked at. NFPA 211 recommends a yearly inspection, and booking before the fall rush gets you the best times. Reply here or call/text (757) 589-0783. Andrew Paterini'. (4) Wait 7 days. (5) Send Email subject 'still want a spot?' body: 'Hi {{contact.first_name}}, just making sure my note did not get buried. Reply with a day that works and I will get you scheduled. Andrew'. (6) Remove Tag 'Annual Reminder'. (7) Add Tag 'Annual Reminder'.
```
Steps 6–7 restart the loop so the reminder repeats every year.

### 09 Testimonial Received
```
Workflow name: 09 Testimonial Received. Trigger: Contact Tag Added, tag is 'Testimonial'. Actions: (1) Internal Notification email to dangill@summitmarketinggroup.co subject 'New First Chimney testimonial' body: 'From {{contact.name}} ({{contact.city}}). Publish permission: {{contact.publish_permission}}. Text: {{contact.testimonial_text}}. To publish, add it to REVIEWS in src/data/content.ts.' (2) Send Email to contact subject 'thank you' body: 'Thank you, {{contact.first_name}}. That means a lot. If you have a minute, sharing the same words on Google helps neighbors find us: {{custom_values.review_link}} Andrew Paterini, First Chimney'.
```

### 10 Referral Received
```
Workflow name: 10 Referral Received. Trigger: Contact Tag Added, tag is 'Referral'. Actions: (1) Internal Notification SMS to +17575890783 and email to dangill@summitmarketinggroup.co: 'New referral from {{contact.name}} {{contact.phone}}. Who to call: {{contact.referred_friend_details}}. Friend gets $25 off with NEIGHBOR25.' (2) Send SMS to contact: 'Thank you for sending your friend my way, {{contact.first_name}}. I will reach out to them and let them know you sent me. Your $25 credit is applied after their first job. Andrew, First Chimney' (3) Send Email subject 'thank you for the referral' body: 'Hi {{contact.first_name}}, thank you for the referral. I will take great care of them. They get $25 off their first service with code NEIGHBOR25, and you get $25 off your next service once their first job is done. Andrew Paterini'.
```

### 11 Referral Partner Nurture
```
Workflow name: 11 Referral Partner Nurture. Trigger: Contact Tag Added, tag is 'Referral Partner'. Actions: (1) Internal Notification SMS to +17575890783: 'New partner: {{contact.name}} {{contact.phone}} ({{contact.partner_role}}, {{contact.partner_company}}). Call within 3 days.' (2) Send Email subject 'chimney inspections for your clients' body: 'Hi {{contact.first_name}}, thanks for reaching out. I am Andrew Paterini, F.I.R.E. Certified Technician and owner of First Chimney. When a listing or a buyer inspection turns up a chimney question, I can usually get out quickly and give a plain-English answer with photos. Here is a page you can send clients: {{custom_values.realtor_link}} Your free partner guide and our 10% partner rate are here: {{custom_values.partner_guides_link}} My cell is (757) 589-0783. Text me an address and a deadline anytime. Andrew'. (3) Wait 3 days. (4) Add Task assigned to the user: 'Call partner {{contact.name}} {{contact.phone}}' due in 1 day. (5) Wait 30 days. (6) Send Email subject 'why most home inspections miss chimney problems' body: 'Hi {{contact.first_name}}, quick one for your clients: a general home inspection usually looks at the chimney from the outside, but cracked flue tiles and liner gaps are only visible with a camera. NFPA 211 calls for a Level 2 inspection when a home is sold. If a deal needs one, text me. Andrew'. (7) Wait 30 days. (8) Send Email subject 'a chimney checklist for your listings' body: 'Hi {{contact.first_name}}, sellers can avoid last-minute chimney surprises with an inspection before listing. Feel free to forward: {{custom_values.realtor_link}} Andrew Paterini, (757) 589-0783'.
```

### 12 Job Applicant
```
Workflow name: 12 Job Applicant. Trigger: Contact Tag Added, tag is 'Job Applicant'. Actions: (1) Internal Notification email to dangill@summitmarketinggroup.co subject 'New applicant: {{contact.position_applied}}' body: '{{contact.name}} {{contact.phone}} {{contact.email}}. Position: {{contact.position_applied}}. Experience: {{contact.years_of_experience}}. Start: {{contact.available_start_date}}. License: {{contact.driver_license}}. Roofs: {{contact.comfortable_on_roofs}}. Resume: {{contact.resume_link}}' and SMS to +17575890783: 'New job applicant: {{contact.name}} for {{contact.position_applied}}. Details in the CRM Recruiting pipeline.' (2) Send Email to contact subject 'thanks for applying' body: 'Hi {{contact.first_name}}, thanks for applying to First Chimney Contracting. Andrew reads every application himself. If it looks like a fit, he will call you for a short phone chat. Andrew Paterini, Owner'. (3) Add Task: 'Review application from {{contact.name}}' due in 3 days.
```

### 13 Missed Call Text-Back
```
Workflow name: 13 Missed Call Text Back. Trigger: Call Status is no-answer or missed, direction inbound. Actions: (1) Add Tag 'Missed Call'. (2) Send SMS: 'Sorry I missed you. This is Andrew with First Chimney, probably on a roof right now. What can I help you with? I will call you back as soon as I am down.' (3) Internal Notification SMS to +17575890783: 'Missed call from {{contact.phone}} {{contact.name}}. Auto-text sent.'
```
Needs a GHL phone number with calls forwarded through it.

### 14 Fireplace Project Lead
```
Workflow name: 14 Fireplace Project Lead. Trigger: Contact Tag Added, tag is 'Fireplace Design Request' or tag is 'Product Quote Request'. Stop on response on. Actions: (1) Internal Notification SMS to +17575890783 and email to dangill@summitmarketinggroup.co: 'Fireplace project lead: {{contact.name}} {{contact.phone}}. Design: {{contact.fireplace_design_summary}} Products: {{contact.products_of_interest}}'. (2) Send Email subject 'your fireplace design' body: 'Hi {{contact.first_name}}, thanks for designing your fireplace with First Chimney. I have your selections and will reach out to talk through fit, venting and installation, and to confirm pricing for your exact model. Andrew Paterini, (757) 589-0783'. (3) Wait 2 days. (4) Send SMS: 'Hi {{contact.first_name}}, Andrew from First Chimney about your fireplace design. When is a good time for a quick call or a free in-home look?' (5) Wait 5 days. (6) Send Email subject 'still thinking about your fireplace?' body: 'Hi {{contact.first_name}}, no rush at all. When you are ready, I will measure the space, confirm the model fits and walk you through installation. Andrew'.
```

### 15 Door Knock Follow-Up
```
Workflow name: 15 Door Knock Follow-Up. Trigger: Contact Tag Added, tag is 'Door Knock'. Actions: (1) Wait 1 hour. (2) Send SMS: 'Great meeting you today, {{contact.first_name}}. Here is the free 2-minute chimney check: {{custom_values.health_check_link}} Text me anytime. Andrew, First Chimney' (3) Wait 3 days. (4) If/Else: if Tags does not include 'Scheduled' then Send SMS: 'Hi {{contact.first_name}}, Andrew again. While I am working in your area this week I have a couple of openings. Want me to take a look at your chimney?' otherwise end.
```

### 16 Campaign: Fall Rush (late August)
```
Workflow name: 16 Campaign - Fall Rush. Trigger: Contact Tag Added, tag is 'Campaign: Fall Rush'. Actions: (1) If/Else: if Tags include 'Do Not Contact' then end. (2) If/Else: if Tags include 'SMS Consent: Yes' then Send SMS: 'Hi {{contact.first_name}}, Andrew from First Chimney. Fall is the busy season for chimneys. Want your cleaning and inspection done before the rush? Reply with a day.' otherwise Send Email subject 'beat the fall chimney rush' body: 'Hi {{contact.first_name}}, the first cold night is when everyone calls at once. Book your cleaning and inspection now and you get the best times. Reply here or call/text (757) 589-0783. Andrew Paterini'. (3) Wait 7 days. (4) If/Else: if Tags does not include 'Scheduled' then Send Email subject 'a few fall spots left' body: 'Hi {{contact.first_name}}, I still have a few fall openings near you. Reply with a day that works. Andrew'. (5) Remove Tag 'Campaign: Fall Rush'.
```

### 17 Campaign: Spring Masonry (early March)
```
Workflow name: 17 Campaign - Spring Masonry. Trigger: Contact Tag Added, tag is 'Campaign: Spring Masonry'. Actions: (1) If/Else: if Tags include 'Do Not Contact' then end. (2) If/Else: if Tags include 'SMS Consent: Yes' then Send SMS: 'Hi {{contact.first_name}}, Andrew from First Chimney. Spring is the best time to fix leaks, crowns and loose brick before summer storms. Want me to take a look?' otherwise Send Email subject 'spring chimney check' body: 'Hi {{contact.first_name}}, winter is hard on masonry. Spring is the right time to fix crown cracks, flashing and loose brick before summer storms push water inside. Reply and I will take a look. Andrew Paterini, (757) 589-0783'. (3) Remove Tag 'Campaign: Spring Masonry'.
```

### 18 Campaign: Pre-Snow (November)
```
Workflow name: 18 Campaign - Pre-Snow. Trigger: Contact Tag Added, tag is 'Campaign: Pre-Snow'. Actions: (1) If/Else: if Tags include 'Do Not Contact' then end. (2) If/Else: if Tags include 'SMS Consent: Yes' then Send SMS: 'Hi {{contact.first_name}}, Andrew from First Chimney. Before the first snow: chimney cleaning + inspection is $199 this holiday season. Want a spot? {{custom_values.holiday_offer_link}}' otherwise Send Email subject 'before the first snow' body: 'Hi {{contact.first_name}}, before you light the first fire of the season: chimney cleaning + inspection is $199 this holiday season. Details: {{custom_values.holiday_offer_link}} Andrew Paterini'. (3) Remove Tag 'Campaign: Pre-Snow'.
```

### 19 Campaign: Database Reactivation
```
Workflow name: 19 Campaign - Reactivation. Trigger: Contact Tag Added, tag is 'Campaign: Reactivation'. Stop on response on. Actions: (1) If/Else: if Tags include 'Do Not Contact' then end. (2) Send Email subject 'quick question' body: 'Hi {{contact.first_name}}, Andrew from First Chimney here. Are you still thinking about getting your chimney looked at? Just reply yes or no. Andrew'. (3) Wait 3 days. (4) If/Else: if Tags include 'SMS Consent: Yes' then Send SMS: 'Hi {{contact.first_name}}, Andrew from First Chimney. Still need help with your chimney? Reply yes and I will find you a time.' otherwise end. (5) Wait 7 days. (6) Send Email subject 'closing the loop' body: 'Hi {{contact.first_name}}, I will stop reaching out so I am not a bother. If you ever need a chimney question answered, just reply or call (757) 589-0783. Andrew'. (7) Remove Tag 'Campaign: Reactivation'.
```

### 20 Do Not Contact
```
Workflow name: 20 Do Not Contact. Trigger: Contact Tag Added, tag is 'Do Not Contact'. Actions: (1) Enable DND on all channels for the contact. (2) Remove contact from all other workflows. (3) Internal Notification email to dangill@summitmarketinggroup.co: '{{contact.name}} marked Do Not Contact.'
```

### 21 Referral Reward Owed
```
Workflow name: 21 Referral Reward Owed. Trigger: Contact Tag Added, tag is 'Referral Reward Owed'. Actions: (1) Add Task: 'Apply $25 referral credit for {{contact.name}} (referrer). Their friend finished a first job.' due in 1 day. (2) Send SMS: 'Good news, {{contact.first_name}}: your friend's job is done, so your $25 credit is on your account for your next service. Thank you for the referral. Andrew, First Chimney'
```
When a referred customer's job is complete, Andrew adds `Referral Reward Owed` to the **referrer's** contact.

---

## Running the seasonal campaigns
Contacts → filter (e.g. tag `Past Customer`, not `Do Not Contact`) → select all → **Add tag** `Campaign: Fall Rush` (late August), `Campaign: Spring Masonry` (early March), `Campaign: Pre-Snow` (November) or `Campaign: Reactivation` (old leads, any slow month). The workflow sends, then removes the tag so it can run again next year.

## Snapshot for future chimney clients
Agency view → **Account Snapshots → Create snapshot** → choose First Chimney Contracting → name it `Chimney Company OS v1`. It carries pipelines, fields, values, tags and workflows. In a new client, load the snapshot, then update the custom values (name, phone, links) and internal notification recipients.
