# 🐣 Sappy: the Master Data Pet for Lives Group

**SMU DSA Data Case Competition 2026 — Modernizing Master Data Management at Lives Group**

Bad master data is invisible, so nobody owns it. We gave it a face. **Sappy's health is the health of Lives Group's SAP B1 master data**: stuck approvals make it hungry, duplicates make it sick, clean data makes it bloom.

- 🎥 Demo video: https://www.youtube.com/watch?v=-ALEWzCikEM
- 🌐 Live prototype: https://data-sappy.vercel.app/
- 📄 2-slide summary: [`Sappy_Summary_2_slides.pdf`](Sappy_Summary_2_slides.pdf) (source: `summary.html`)

## Run it
Double-click `index.html` (needs internet only for fonts and Chart.js). No install, no backend.
Tip: `index.html#tour` starts the guided demo; `#garden`, `#crystal` and so on open a tab directly.

## What's inside (feature → pain point)
| Tab | What it does | Brief pain point |
|---|---|---|
| 🏠 Sappy's Room | Health score, the reasons behind it, and a duplicate-merge queue | Visibility, duplicates |
| 🍼 Feed Sappy | Dynamic form per domain; required-field validation ("spits out" incomplete requests); conditional routing (IVD → QA/RA) | No standard form, Amy's missing regulatory step |
| 💕 It's a Match! | Live fuzzy duplicate detection against SAP B1 records and in-flight requests; overrides need a reason | Duplicates |
| 👉 Swipe Approvals | Tinder-style approval deck per role (Teams adaptive cards in production); nudge at 24 h, escalate at 72 h | 2–3 week approvals, Wei Jie never sees the email |
| 📦 Track & Diary | Parcel-style tracking with ETA; hash-chained audit log with tamper detection and CSV export; masked sensitive fields with logged access | Status, audit, sensitive fields |
| 🚀 SAP B1 push | Final MDM check builds the SAP B1 Service Layer payload (`BusinessPartners`, `Items`, `ProfitCenters`), with no re-keying | Manual keying, SAP B1 connection |
| 🧩 Rule Lego | MDM team edits fields, required/sensitive flags, approval steps, new BUs and new domains, with no IT involvement | Flexibility |
| 🌱 Sappy's Garden | Regional view: 5 countries × Products A/B/C, Nov '25–Oct '26; YoY and momentum; churn and cross-sell; recommended actions; PO vs enquiry vs MDM split | Regional business view |
| 🔮 Crystal Ball | Seasonal + trend forecast vs today's 6-month average, back-tested | Forecasting |
| 📮 Inbox Sorter | Classifies emails into PO / enquiry / follow-up / MDM setup and extracts quantity and product | Distinguish POs from enquiries |
| 🏆 Leaderboard | Light gamification and adoption levers | Adoption |
| ⚙️ Under the Hood | Architecture → SAP B1, build plan, cost, what we're not building in v1 | Feasibility |

## Data science method
- **Data**: synthetic and seeded (`engine.js`). 20 hospitals and labs across SG/MY/TH/VN/ID and 3 entities, 24 months of PO lines, built-in seasonality, two real churners, cross-sell gaps, and **two duplicate customer records that start stealing orders in Aug '26** (which creates a false churn alarm until they're merged).
- **Growth measure**: primary = **YoY**, PO units Aug–Oct 2026 ÷ Aug–Oct 2025 − 1. Secondary = **3-month momentum** (Aug–Oct ÷ May–Jul), used for churn alerts (≤ −30%). Only customer POs are counted; enquiries, follow-ups and MDM setup requests are tracked separately.
- **Forecast**: (1) merge duplicates → (2) seasonal index pooled across all 15 country×product series → (3) linear trend on de-seasonalised last 12 months → (4) re-seasonalise.
- **Back-test** (train to Jul '26, predict Aug–Oct '26): **WAPE 12.6% (6-month average) → 4.6% (Sappy)**, which is 63% less error; Sappy wins 13 of 15 series.
- **Dedupe**: name normalisation (abbreviations such as Natl/Univ/Hosp expanded; Pte Ltd/Sdn Bhd removed) + character-bigram Dice + token Jaccard.

## Production architecture (M365 + SAP B1)
Power Apps form (Teams tab) → rules in SharePoint list / Dataverse → Power Automate approvals with Teams adaptive cards → Dataverse audit log → **SAP B1 Service Layer** (custom connector built by an outside partner) → nightly PO extract → Python / Power BI forecast.
About 10 weeks and S$20–25k cash (assumption). Not in v1: auto-creation without a human check, LLM chatbot intake, ML dedupe, mobile app.

## Assumptions (labelled)
~60 MDM requests per month; 45 min of chasing + 15 min of re-keying saved per request (≈60 h/month ≈ 0.4 FTE); current duplicate rate ~8%; licence and partner prices are indicative; pilot leaderboard numbers are illustrative.

---

## 📚 Docs
- 📘 [User guide](docs/USER_GUIDE.md): how to use every tab, the roles, and troubleshooting
- 🎬 [Demo video plan](docs/DEMO_VIDEO_PLAN.md): an 8-act structure, shot list, voice-over and recording checklist
- In the app: **❓ Guide** and **🎬 Demo tour** (or open `index.html#tour`)

## 📁 Repo structure
```n├── index.html                   # the prototype (UI)
├── engine.js                    # synthetic data, dedupe, forecast, classifier
├── summary.html                 # 2-slide pitch summary (source)
├── Sappy_Summary_2_slides.pdf   # 2-slide pitch summary (submit this)
├── README.md
└── docs/
    ├── USER_GUIDE.md
    └── DEMO_VIDEO_PLAN.md
```n
## ✅ Submission checklist (due Wed 28 Oct 2026, 12:00 PM SGT)
1. Create a public GitHub repo → upload everything in this folder (including `docs/`).
2. Settings → Pages → deploy from `main` / root → copy the `https://<user>.github.io/<repo>/` link.
3. Record the video → upload to YouTube (Unlisted is fine) → copy the link.
4. Replace `YOUTUBE_LINK` / `GITHUB_LINK` in `summary.html` and this README → re-export the PDF (Chrome → Print → Save as PDF, no margins).
5. Submit at https://forms.gle/ApCcjxN7YedCzTas7
