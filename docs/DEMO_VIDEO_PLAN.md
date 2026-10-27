# 🎬 Demo Video Plan (target 2:45, hard max 3:00)

**Goal:** in under 3 minutes, show the judges (1) we understand the problem, (2) a working prototype, (3) the regional view and AI forecast, (4) impact and feasibility. The scoring weights are Solution 30% · Impact 25% · Problem 20% · Innovation 15% · Communication 10%, so most of the time goes to the live prototype.

## Structure at a glance
| # | Act | Time | Length | Tab(s) | Scoring criterion |
|---|---|---|---|---|---|
| 1 | **Hook**: meet Sappy | 0:00–0:15 | 15 s | 🏠 | Communication, Innovation |
| 2 | **Problem** in one breath | 0:15–0:30 | 15 s | 🏠 | Problem understanding |
| 3 | **Clean intake**: smart form + duplicate match | 0:30–1:00 | 30 s | 🍼 | Solution |
| 4 | **Fast approvals → SAP B1** | 1:00–1:25 | 25 s | 👉 📦 | Solution |
| 5 | **Trust & flexibility**: audit + Rule Lego | 1:25–1:45 | 20 s | 📦 🧩 | Solution, Innovation |
| 6 | **Regional view + the twin plot twist** | 1:45–2:10 | 25 s | 🌱 🏠 | Impact, Innovation |
| 7 | **AI forecast + inbox sorter** | 2:10–2:30 | 20 s | 🔮 📮 | Impact, DS/AI |
| 8 | **Close**: feasibility + impact | 2:30–2:45 | 15 s | ⚙️ 🏠 | Impact |

> 💡 The in-app **🎬 Demo tour** follows exactly this order. Open `index.html#tour` and press *Next* between shots.

## Shot list & voice-over

### Act 1: Hook (0:00–0:15) · 🏠 Sappy's Room
**Do:** Start on the sick green Sappy. Hover over the health bar.
**Say:** “Meet Sappy, Lives Group's Master Data Pet. Sappy's health *is* the health of SAP B1 master data. And right now… Sappy is sick.”

### Act 2: Problem (0:15–0:30) · 🏠 (point to the reasons list)
**Say:** “Requests travel by email, so approvals get stuck for days, duplicates sneak in, nobody knows the status, and the 5-country forecast is a spreadsheet average. Amy's item code took 18 days. One root cause: dirty data in.”

### Act 3: Clean intake (0:30–1:00) · 🍼 Feed Sappy
**Do:**
1. As Amy, choose **Item** and set **IVD = Yes**. The licence field and the yellow QA/RA step appear.
2. Click **Feed** with blanks. Sappy spits it out.
3. Switch to Marcus → **Customer** → **✨ Demo-fill** → **Feed** → *It's a Match!* → **💍 Use existing**.

**Say:** “The form only asks what matters, and adds Regulatory sign-off automatically. Incomplete requests never reach an approver. And when Marcus types ‘Natl Univ Hosp’… it's a match! That hospital already exists, so no duplicate is born.”

### Act 4: Fast approvals → SAP B1 (1:00–1:25) · 👉 then 📦
**Do:**
1. Switch to **Nurul** → drag right. Then **Siti** → drag right.
2. Switch to **Priya** → 🚀 → show the terminal and payload → 🎉.

**Say:** “Approvers get a Teams card and just swipe. Sappy nudges at 24 hours and escalates at 72. Priya does one final check, and the record is created in SAP B1 through the Service Layer, with no re-keying. Amy gets pinged the moment it's live.”

### Act 5: Trust & flexibility (1:25–1:45) · 📦 then 🧩
**Do:**
1. In 📦 click **😈 Try to tamper** → **🔍 Verify**. Sappy is shocked.
2. In 🧩 click **➕ New domain** (“Clinical Trial Site”). Confetti.

**Say:** “Every approval is sealed in a tamper-proof diary, and bank details stay masked except for Finance. New business unit or new rule? The MDM team snaps on a block. No IT ticket.”

### Act 6: Regional view + plot twist (1:45–2:10) · 🌱 → 🏠 → 🌱
**Do:**
1. Pan across the garden and point at Vietnam ✨. Click the **Singapore** plot and show **NUH 🥀**.
2. Go to 🏠 and click **💍 Merge** on both twins. Sappy recovers.
3. Go back to 🌱. NUH is healthy, and the actions list has updated.

**Say:** “Five countries, three products. Vietnam is up 35%. But National University Hospital looks like it's leaving… it isn't! Its orders were going to a duplicate record. Merge the twin, and the truth appears. Clean data equals the right sales call.”

### Act 7: AI forecast + inbox (2:10–2:30) · 🔮 → 📮
**Do:** Show the two error cards and the December peak. Then in 📮 click **🪄 Let Sappy sort**.
**Say:** “Today's forecast, Grandma's 6-month average, is off by 12.6%. Sappy learns seasonality across all markets and is off by 4.6%, and it sees the December peak. Sappy also separates real purchase orders from enquiries and setup requests, so only real demand counts.”

### Act 8: Close (2:30–2:45) · ⚙️ → 🏠 (happy Sappy)
**Say:** “Built on the Microsoft 365 Lives Group already owns, in about 10 weeks for around S$25k. Requests go to SAP in 3 days instead of 18, and the team saves about 60 hours a month. Keep Sappy happy, and the business grows with it.”
**End card (2 s):** Sappy + “Sappy · Team ___ · GitHub link”.

## Recording checklist
- [ ] **Refresh the page** right before recording (this resets state). Close other tabs and notifications.
- [ ] Browser zoom **90%**, window maximised, 1920×1080.
- [ ] Tool: **OBS** (free) or **Win + Alt + R** (Xbox Game Bar). Record voice separately if your mic is noisy.
- [ ] Rehearse once with the 🎬 tour; aim for 2:45 so there's buffer under 3:00.
- [ ] Move the mouse slowly and pause 1 s after each click so viewers can follow.
- [ ] Trim dead air; add captions if possible (YouTube auto-captions are fine).
- [ ] Upload to YouTube as **Unlisted**, title it “Sappy: Master Data Pet · SMU DSA Case 2026”, and paste the link into `summary.html` + README.

## Division of labour (if recording as a team)
| Person | Job |
|---|---|
| Driver | Clicks through the demo |
| Narrator | Reads the voice-over (can be recorded separately and laid over) |
| Editor | Trims, adds the title and end card, uploads |
