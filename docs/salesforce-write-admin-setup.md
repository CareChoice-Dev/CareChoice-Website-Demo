# Salesforce Admin Setup — Enquiry Write

The website's `/api/enquiry` route POSTs to Salesforce Lead/Case via the existing Connected App (`CareChoice Demo Site`, Client Credentials flow).

## Permissions needed

The integration user (the "Run As" user on the Connected App per Plan 1 Task 26) needs:

- **API Enabled** (System Permission)
- **Create + Read** on `Lead`
- **Create + Read** on `Case`

To check / grant:

1. Setup → Users → find the integration user
2. Permission Set Assignments → ensure they have a permission set granting the above, OR
3. Their Profile → System Permissions → API Enabled = true; Object Permissions → Lead/Case Create + Read

## Field mapping

### Audience = client (NDIS participant or family enquiry)
- Creates a **Lead** record
- Maps:
  - `FirstName` / `LastName` — split from form's `fullName`
  - `Email` — from form `email`
  - `Phone` — from form `phone`
  - `Company` — defaults to "Personal enquiry" (Salesforce Lead requires Company)
  - `LeadSource` — `"Website Demo"`
  - `Description` — concatenation of `serviceInterest`, `homePreference`, `message`

### Audience = career (job interest)
- Creates a **Lead** record
- Same mapping; `LeadSource = "Careers"`; `Description` includes `role`

### Audience = referrer (support coordinator / case manager)
- Creates a **Case** record (referrers are existing contacts to triage, not new leads)
- Maps:
  - `Subject` — `"Website enquiry — Referrer"` + organisation
  - `Description` — `organisation`, `role`, `fullName`, `email`, `phone`, `message`
  - `Origin` — `"Web"`
  - `Status` — `"New"`

## Demo verification

After a successful POST:
1. Open Salesforce UAT → Leads or Cases list
2. Filter by LeadSource = "Website Demo" or Origin = "Web"
3. Confirm new record exists with the form fields populated

## Failure handling

If the Salesforce write fails (network error, permission error, validation error), `/api/enquiry` still returns 200 to the client (so the user sees confirmation), but logs the failure with full payload to Vercel logs for ops follow-up.
