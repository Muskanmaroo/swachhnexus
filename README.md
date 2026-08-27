# SwachhNexus

**Signal → action → proof.**

SwachhNexus is an independent hackathon prototype that reimagines how Indian
citizens report and track municipal cleanliness problems. It is built for the
Build What Moves India 2026 hackathon.

## The problem

A citizen can report overflowing waste, a clogged drain, or an unsafe public
space, but the experience often becomes opaque after submission. SwachhNexus
demonstrates a clearer end-to-end journey: report the issue, review a suggested
route, receive a reference number, follow progress, and inspect resolution
evidence.

## Citizen journey

1. Describe the problem and confirm a safe, non-sensitive location.
2. Review simulated category, urgency, ward routing, and duplicate detection.
3. Create or support a report and receive a reference number without login.
4. Follow the status timeline from reported to resolved.
5. Inspect before/after evidence and confirm the result or request review.

## Portal sections

- `/` — citizen service hub and city pulse
- `/report` — guided three-step complaint form
- `/track` — public status timeline and before/after verification
- `/map` — interactive city signal map with status filters
- `/dashboard` — ward officer priority queue, metrics and predictive signals
- `/future` — consent-based social and civic API integration roadmap

## Future prospects

- Optional browser geolocation now captures consented latitude and longitude and
  lets the citizen review the pin in Google Maps before submitting.
- With approved social-platform APIs, opted-in public hashtags could lead a
  citizen to a confirmation page that pre-fills the image and suggested issue.
- A social post would never lodge a complaint on its own: the citizen confirms
  intent and location, while spam checks and human review remain in the loop.
- Confirmed reports could later route through an official municipal API or
  authority-approved sandbox, with a visible audit trail and resolution proof.

## Designed for India

- report-location coverage for all 28 states and 8 Union Territories, with a
  searchable India-only snapshot of 4,242 city, town and urban-locality records
- keyboard-accessible location matching plus free entry for a village or small
  locality that is not present in the directory snapshot
- ten guided cleanliness categories plus an “Other” option for missed issues
- English plus all 22 languages in the Constitution's Eighth Schedule for
  essential navigation and citizen guidance
- persistent language preference and optional device text-to-speech guidance
- mobile-first responsive layout
- separate decrease, reset and increase text-size controls
- high-contrast and reduced-motion support
- no account or OTP required in the prototype
- simple language, visible status, and strong keyboard focus states
- explicit consent and privacy guidance

## Transparency

This is not an official government service. All complaints, locations,
classification results, ward routing, response times, staff actions, and city
metrics are synthetic or simulated. The prototype does not connect to a live
government system, store uploaded photographs, or submit a real complaint.

The India location snapshot is derived from the CountryStateCity database
(ODbL-1.0). India’s state and Union Territory structure was checked against
Government of India sources. The manual place field remains available because
no third-party city directory should be treated as a complete village census.

Codex was meaningfully used to research the brief, design the product journey,
build the interface and interactions, add responsive and accessibility
behaviour, write tests, and validate the production build.

## Local development

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
npm run build
npm test
```

The site uses React and vinext with Cloudflare-compatible output. No API keys or
external service accounts are required for the demo.
