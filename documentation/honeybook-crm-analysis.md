# HoneyBook CRM Research and Analysis

## Scope
This document summarizes a research pass on HoneyBook CRM using official HoneyBook product pages and Help Center documentation, with emphasis on:

- Feature coverage for a service business intake-to-payment workflow
- Pricing and plan gating
- Integration model and constraints
- Payment and operational considerations
- Fit analysis against your current website workflow
- Recommended adoption path

Research date: May 2, 2026

## Executive Summary
HoneyBook is a strong fit for service businesses that want lead capture, proposals/contracts, invoicing, and payments in one system with automation. For your current stack (custom website + Google Form + Sheet + Apps Script emails), HoneyBook can either:

1. Replace most of the intake and client management workflow, or
2. Sit behind your existing website as the back-office CRM/payments layer.

Best practical path for your case: keep the current website, then progressively route inquiries into HoneyBook (direct lead forms or API/Zapier bridge), and move proposals/contracts/payments to HoneyBook first before replacing front-end intake.

## What HoneyBook Includes (Verified)
Based on HoneyBook Help Center and pricing pages, all plans include core CRM/project tools such as:

- Unlimited clients and projects
- Custom fields and customizable project pipeline
- Inquiry reminders and client portal
- Smart files/templates and scheduled sharing
- Email/calendar integrations
- Mobile app
- Support and onboarding resources (including file setup service)

Source: Help Center membership plan matrix.

## Plan and Pricing Analysis
### Current pricing signals (official pages)
- Starter: $29/mo billed annually, or $36/mo billed monthly
- Essentials: $49/mo billed annually, or $59/mo billed monthly
- Premium: $109/mo billed annually, or $129/mo billed monthly

Source: HoneyBook pricing page + Help Center plan article.

### Important plan gating
- Advanced integrations (Zapier, QuickBooks, Meta Lead Ads, Zoom, Calendly, Prismm) are listed under Essentials+ in Help Center docs.
- QuickBooks integration requires Essentials or Premium, and supports QuickBooks Online only (not Desktop or Self-Employed).
- Starter has tighter limits for lead/contact forms and scheduler sessions.

Implication: if you need serious automation and accounting sync, evaluate at least Essentials.

## Integrations and Automation
### Native and semi-native model
HoneyBook offers direct integrations for some systems and a broad Zapier layer for many others.

Observed constraints from official docs:

- Zapier connection is API-key based from HoneyBook account settings.
- Zapier integration availability is tied to plan level (Essentials/Premium in Help docs).
- Custom fields are noted as not currently supported in Zapier in at least one Help article context.

Implication: design data mappings carefully. If your process depends on many custom fields, validate each sync path in a sandbox before rollout.

## Payments, Fees, and Cashflow Considerations
### Supported payment methods
HoneyBook documents support for:

- ACH / bank transfer
- Card payments (Visa/Mastercard/Amex/Discover)
- Card-on-file
- Apple Pay / Google Pay
- Cash/check (manually marked paid)

### Transaction fees (documented)
- ACH (US): 1.5%
- Visa/Mastercard: 2.9% + $0.25
- Amex/Discover: 3.4% + $0.09
- Card-on-file: 3.4% + $0.09
- Cash/check: no HoneyBook processing fee

### Deposit timing notes
Help docs indicate card payments are often faster than ACH, and some lead-form payment paths can have different timing windows.

Implication: for high-volume or tight-cashflow periods, you should model fee and settlement impact before switching all invoicing.

## Operational Constraints and Caveats (Important)
From official docs reviewed:

- You can sync only one external calendar with HoneyBook at a time (Google/Outlook/iCloud).
- QuickBooks sync supports one QuickBooks account per HoneyBook account.
- Some capabilities vary sharply by plan (forms, scheduler capacity, integrations, reports, team seats).
- Free trial and membership rules are favorable (no card needed to trial per help docs; no auto-charge at trial end if not subscribed).

These are not blockers, but they are architecture-level constraints you should account for early.

## Security and Compliance Findings
What is clearly verifiable from reviewed official sources:

- HoneyBook’s legal Privacy Policy and Terms pages are current (updated March 2026).
- HoneyBook references fraud protection and secure payment operations in plan/payment docs.

What was not clearly established from the official pages reviewed in this pass:

- A directly discoverable public trust page with downloadable SOC 2 report package
- A single consolidated security whitepaper with control-by-control detail

Recommendation: before full CRM migration, request from HoneyBook Sales/Support:

- Latest SOC 2 report/attestation access process
- DPA/subprocessor documentation
- Data retention/deletion policy detail
- Incident response and notification commitments

## Fit for Your Current Funnel
### Your current flow (today)
- Marketing site (custom frontend)
- Google Form capture from your site form mapping
- Google Sheet response log
- Apps Script formatted email notifications

### HoneyBook fit assessment
HoneyBook aligns well with your business flow if you want:

- Better proposal/contract/payment workflow after inquiry capture
- Reduced custom-script maintenance over time
- One workspace for lead -> booked project -> paid status

Potential friction areas:

- Migrating from custom front-end forms without hurting current SEO/UX
- Rebuilding existing notification automations and formatting exactly as today
- Feature gating costs if you need integrations/automation immediately

## Recommended Adoption Strategy (Phased)
### Phase 1: Parallel run (low risk)
- Keep current website + Google Form in production.
- Start HoneyBook with limited live intake (single service line or campaign).
- Use HoneyBook for proposal/contract/invoice only on selected leads.

### Phase 2: Integration bridge
- Route website inquiries into HoneyBook via:
  - HoneyBook lead form embed/link, or
  - Zapier/API ingestion from your current form endpoint.
- Keep current Apps Script email alerts until HoneyBook notifications satisfy your team.

### Phase 3: Consolidation
- Move primary pipeline stages and payment tracking to HoneyBook.
- Reduce duplicate data entry between Sheet and CRM.
- Keep Google Sheet as optional reporting mirror if needed.

## Website Rollout Plan (Option 1: Link-Out First)
Agreed starting model: use HoneyBook by linking out from existing site CTAs before any embed work.

### CTAs to point to HoneyBook first
1. Header navigation `Book Now`
2. Hero section `Book Your Event`
3. Service card `Book Now` buttons
4. Booking section submit action: replace with a `Continue to Booking` CTA that opens HoneyBook

### Why this first
- Fastest production launch
- Lowest implementation risk
- Easiest rollback
- Clear conversion validation before deeper integration

### Rollout sequence
1. Keep current on-site form active temporarily.
2. Point all `Book Now` CTAs to HoneyBook scheduler/lead form URL.
3. Run for 3–7 days and compare lead quality, completion, and response time.
4. Decide whether to keep the current form as fallback or fully move intake to HoneyBook.

## Decision Matrix (Practical)
Choose HoneyBook now if:
- You want to centralize proposals/contracts/payments quickly.
- You can operate at Essentials+ for integrations.
- You accept some process standardization around HoneyBook’s model.

Delay full migration if:
- You need deep custom field sync everywhere today.
- You require enterprise-grade governance documentation before adoption.
- Your current intake workflow is highly tailored and stable.

## Suggested Next Validation Steps
1. Run a 14-day pilot with 10-20 real inquiries in HoneyBook.
2. Validate exact automations needed (follow-up emails, reminders, team assignment).
3. Reconcile one payment cycle end-to-end including fee math and payout timing.
4. Validate QuickBooks sync behavior on your chart-of-accounts setup (if relevant).
5. Collect compliance artifacts from HoneyBook before long-term lock-in.

## Source Links
Official HoneyBook pages used in this analysis:

- Pricing: https://www.honeybook.com/pricing
- Plan matrix (Help Center): https://help.honeybook.com/en/articles/2418282-what-s-included-in-each-honeybook-membership-plan
- Plan/billing FAQ: https://help.honeybook.com/en/articles/7020217-top-questions-answered-about-honeybook-billing-and-membership
- Zapier automation: https://help.honeybook.com/en/articles/2209205-automate-tasks-with-zapier
- Integrations collection: https://help.honeybook.com/en/collections/68941-integrations-and-partnerships
- QuickBooks integration overview: https://help.honeybook.com/en/articles/2209038-quickbooks-integration-overview-faq
- Calendar sync constraints: https://help.honeybook.com/en/articles/2209101-sync-your-personal-calendar-with-honeybook
- Payment methods/fees: https://help.honeybook.com/en/articles/13211766-getting-paid-in-honeybook-payment-methods-fees-and-guidelines
- Payment processing timings: https://help.honeybook.com/en/articles/2209043-payment-processing-times-transaction-fees-and-client-payment-options
- Privacy policy: https://www.honeybook.com/legal/privacy
- Terms of service: https://www.honeybook.com/legal/terms-of-service

## Notes
- Pricing, limits, and plan features can change; confirm at purchase time.
- Any statements above marked as constraints are derived from current Help Center docs and should be rechecked during final procurement.
