# 📘 Sappy User Guide

Sappy is a **clickable prototype**. It runs entirely in your browser: nothing is saved, and **refreshing the page resets everything**.

## 1. Open it
- **Locally:** double-click `index.html` (Chrome or Edge). You need internet for the fonts and charts.
- **Online:** open the GitHub Pages link.
- **Shortcuts:** add `#tour` to the URL to start the guided demo, or `#garden`, `#crystal`, `#swipe` and so on to jump straight to a tab.

## 2. The screen
```
┌───────────────────────────────────────────────────────────────────────┐
│ 🐣 Sappy   [health bar]        ❓ Guide  🎬 Demo tour  I am [▼]  🔔  │  ← header
├───────────────────────────────────────────────────────────────────────┤
│      [🐣 MDM Workflow]  [🌏 Regional Insights]  [🛠️ Setup & Rollout]   │  ← 3 main tabs
│        🏠 Sappy's Room · 🍼 Feed · 👉 Swipe · 📦 Track & Diary         │  ← pages in that section
├───────────────────────────────────────────────────────────────────────┤
│                         page content                                  │
└───────────────────────────────────────────────────────────────────────┘
```
- **Health bar:** 0–100. It drops for overdue approvals (−15 each), duplicate records (−10 each) and open requests (−3 each).
- **❓ Guide:** a short in-app help screen.
- **🎬 Demo tour:** 14 guided steps that switch tabs and roles for you.
- **I am [▼]:** pick the person you're acting as.
- **🔔:** the Microsoft Teams notifications Sappy would send.

## 3. The people (switch with “I am”)
| Person | Role | What they can do |
|---|---|---|
| 👩‍🔬 Amy | Requestor (Product Manager, SPD) | Submit and track requests |
| 🧑‍💼 Marcus | Requestor (Regional Sales, new BU QTG) | Submit and track requests |
| 🧔 Daniel | BU Head | Approve step 1 |
| 🧮 Wei Jie | Finance | Approve credit terms and banking; **can unmask sensitive fields** |
| 🧪 Nurul | QA/RA | Approve IVD / regulated items |
| 📋 Siti | Business Support | Approve vendors and items |
| 🛠️ Priya | MDM | Final check → **🚀 push to SAP B1**; can unmask sensitive fields |

## 4. Tab by tab

### MDM workflow
| Tab | How to use it |
|---|---|
| 🏠 **Sappy's Room** | Read *why Sappy feels this way*. Click **Nudge in Teams** on overdue items and **💍 Merge** on suspected twins. Sappy's health goes up. |
| 🍼 **Feed Sappy** | Pick Customer / Vendor / Item / Cost Center → fill the form → **🍼 Feed Sappy**. Things to try: **Item → IVD = Yes** (the licence field and QA/RA step appear) · submit with blanks (Sappy spits it out) · **✨ Demo-fill** (triggers *It's a Match!*). |
| 👉 **Swipe Approvals** | Switch to an approver. **Drag the card right** to approve or **left** to send it back with a reason (or use ✔ / ✖). As Priya, **🚀** creates the SAP B1 record. Tap a 🔒 masked field to try to view it. |
| 📦 **Track & Diary** | Each request shows parcel-style steps and an ETA; tick *only mine* to filter. In the Diary: **😈 Try to tamper** → **🔍 Verify diary** shows tamper detection; **⬇️ Export CSV** downloads the audit log. |

### Regional insights
| Tab | How to use it |
|---|---|
| 🌱 **Sappy's Garden** | Each country is a garden plot. Flower height = 12-month PO units; ✨ = growing over 15%; 🥀 = shrinking. **Click a plot** to see its customers. Scroll down for the country × product table, the chart, the **recommended actions**, and the **PO vs enquiry vs MDM** table. ⬇️ downloads the PO data. |
| 🔮 **Crystal Ball** | Pick a country and product at the top. The shaded yellow area is the back-test and purple is the next 3 months. Compare 🧓 Grandma's Average with 🔮 Sappy. |
| 📮 **Inbox Sorter** | Click **🪄 Let Sappy sort**. Type your own email in *Try your own message*. 🐣 MDM emails can be opened as a pre-filled request. |

### Setup & rollout
| Tab | How to use it |
|---|---|
| 🧩 **Rule Lego** | Choose a domain. ⭐ = required, 🔒 = sensitive, ✕ = remove. **➕ Snap on** adds a field; **➕ Add approval step** adds a step; **➕ New domain** / **➕ New BU** add those. Changes show up in 🍼 straight away and are logged in the Diary. |
| 🏆 **Leaderboard** | Approver and BU speed, badges, and adoption tactics. |
| ⚙️ **Under the Hood** | Architecture to SAP B1, the 10-week build plan, cost, and what's not in v1. |

## 5. Good to know
- “Today” is fixed at **27 Oct 2026**. All customers, orders and requests are **synthetic** (seeded in `engine.js`, so the numbers are always the same).
- The SAP B1 connection is **simulated**: it shows the real Service Layer endpoint and payload that production would send.
- Flags show as letters (SG, MY…) on Windows. That's a Windows emoji limitation, not a bug.

## 6. Troubleshooting
| Problem | Fix |
|---|---|
| Charts are blank | You're offline. Chart.js loads from a CDN, so connect and refresh. |
| Swipe deck is empty | No requests are waiting for this role. Switch person, or follow the 🎬 tour order. |
| Demo got messy | Refresh the page to reset everything. |
