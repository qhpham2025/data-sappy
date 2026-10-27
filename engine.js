/* Sappy engine: synthetic data, dedupe matching, forecasting and inbox classification.
   Pure functions, no DOM. Works in the browser (window.ENGINE) and in Node (module.exports).
   ALL DATA IS SYNTHETIC (seeded, reproducible) and is labelled as such in the app. */
(function (G) {
  const NOW = Date.parse('2026-10-27T10:00:00+08:00'), HOUR = 36e5, DAY = 24 * HOUR;

  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const R = rng(20261027);

  // 24 months of history (Nov '24 – Oct '26) + 3 forecast months (Nov '26 – Jan '27)
  const NH = 24, MONTHS = [];
  for (let i = 0; i < NH + 3; i++) {
    const d = new Date(Date.UTC(2024, 10 + i, 1));
    MONTHS.push({ m: d.getUTCMonth(), y: d.getUTCFullYear(), label: d.toLocaleString('en', { month: 'short', timeZone: 'UTC' }) + " '" + String(d.getUTCFullYear()).slice(2) });
  }
  // True seasonal shape used to generate data: Feb dip (Lunar New Year / Tết), Apr dip (Songkran / Hari Raya), Q4 budget flush
  const SEAS_TRUE = [0.95, 0.80, 1.00, 0.93, 1.00, 1.04, 1.00, 1.02, 1.06, 1.10, 1.15, 1.22];

  const COUNTRIES = [
    { c: 'SG', n: 'Singapore', f: '🇸🇬', g: 0.004 },
    { c: 'MY', n: 'Malaysia', f: '🇲🇾', g: 0.010 },
    { c: 'TH', n: 'Thailand', f: '🇹🇭', g: 0.006 },
    { c: 'VN', n: 'Vietnam', f: '🇻🇳', g: 0.028 },
    { c: 'ID', n: 'Indonesia', f: '🇮🇩', g: 0.018 },
  ];
  const PRODUCTS = [
    { p: 'A', n: 'Product A', d: 'IVD reagents', base: [80, 200], e: '🌷' },
    { p: 'B', n: 'Product B', d: 'Analyzer consumables', base: [40, 110], e: '🌻' },
    { p: 'C', n: 'Product C', d: 'Lab equipment & service', base: [6, 22], e: '🌼' },
  ];

  // [code, name, country, entity, scale, products never bought (cross-sell gaps), churn pattern]
  const CUSTOMERS = [
    ['C-SG-00012', 'National University Hospital', 'SG', 'SPD', 1.4, [], null],
    ['C-SG-00031', 'Singapore General Hospital', 'SG', 'SPD', 1.6, [], null],
    ['C-SG-00077', 'Tan Tock Seng Hospital', 'SG', 'QTS', 1.1, [], null],
    ['C-SG-00105', 'Raffles Medical Clinic Network', 'SG', 'QTG', 0.6, ['C'], null],
    ['C-MY-00014', 'Sunway Medical Centre', 'MY', 'SPD', 1.0, [], null],
    ['C-MY-00052', 'Gleneagles Kuala Lumpur', 'MY', 'QTS', 0.9, [], null],
    ['C-MY-00090', 'Hospital Kuala Lumpur', 'MY', 'QTG', 1.3, [], null],
    ['C-MY-00118', 'Pantai Premier Pathology', 'MY', 'QTS', 0.7, ['B'], null],
    ['C-TH-00021', 'Bumrungrad International Hospital', 'TH', 'SPD', 1.3, [], null],
    ['C-TH-00045', 'Siriraj Hospital', 'TH', 'SPD', 1.5, [], null],
    ['C-TH-00063', 'Bangkok Hospital', 'TH', 'QTS', 1.1, [], { p: 'A', from: 19, k: 0.80 }],
    ['C-TH-00110', 'N Health Pathology', 'TH', 'QTG', 0.7, ['C'], null],
    ['C-VN-00008', 'Cho Ray Hospital', 'VN', 'SPD', 1.3, ['C'], null],
    ['C-VN-00019', 'Bach Mai Hospital', 'VN', 'SPD', 1.2, [], null],
    ['C-VN-00040', 'FV Hospital', 'VN', 'QTS', 0.8, [], null],
    ['C-VN-00066', 'Medlatec Laboratory', 'VN', 'QTG', 0.7, ['B', 'C'], null],
    ['C-ID-00015', 'RSUPN Cipto Mangunkusumo', 'ID', 'SPD', 1.4, [], null],
    ['C-ID-00033', 'Siloam Hospitals Kebon Jeruk', 'ID', 'QTS', 1.0, [], null],
    ['C-ID-00058', 'Prodia Clinical Laboratory', 'ID', 'QTG', 0.9, ['B'], null],
    ['C-ID-00092', 'Mayapada Hospital', 'ID', 'QTS', 0.8, [], { p: '*', from: 19, k: 0.85 }],
  ];
  // Duplicate customer records already living in SAP B1. From month `from`, a share of orders gets booked under the twin.
  const DUPS = [
    { code: 'C-SG-00388', type: 'Customer', name: 'Natl. Univ. Hospital', country: 'SG', entity: 'QTS', dupOf: 'C-SG-00012', from: 21, share: 0.6 },
    { code: 'C-ID-00241', type: 'Customer', name: 'Siloam Hosp. Kebon Jeruk', country: 'ID', entity: 'SPD', dupOf: 'C-ID-00033', from: 21, share: 0.5 },
  ];

  const MASTER = [
    ...CUSTOMERS.map(c => ({ code: c[0], type: 'Customer', name: c[1], country: c[2], entity: c[3] })),
    ...DUPS.map(d => ({ code: d.code, type: d.type, name: d.name, country: d.country, entity: d.entity, dupOf: d.dupOf })),
    { code: 'V-SG-00021', type: 'Vendor', name: 'BioNova Reagents Pte Ltd', country: 'SG', entity: 'SPD' },
    { code: 'V-SG-00093', type: 'Vendor', name: 'Bio-Nova Reagents Pte. Ltd.', country: 'SG', entity: 'QTS', dupOf: 'V-SG-00021' },
    { code: 'V-MY-00017', type: 'Vendor', name: 'Sinar Lab Supplies Sdn Bhd', country: 'MY', entity: 'QTS' },
    { code: 'V-VN-00009', type: 'Vendor', name: 'Mekong Medical Logistics', country: 'VN', entity: 'QTG' },
    { code: 'V-TH-00030', type: 'Vendor', name: 'Siam Cold Chain Co., Ltd', country: 'TH', entity: 'SPD' },
    { code: 'V-ID-00012', type: 'Vendor', name: 'PT Nusantara Medika Distribusi', country: 'ID', entity: 'QTS' },
    { code: 'A-24-0012', type: 'Item', name: 'Product A — HbA1c Reagent Kit 100T', country: 'SG', entity: 'SPD' },
    { code: 'A-24-0019', type: 'Item', name: 'Product A — CRP Reagent Kit 200T', country: 'SG', entity: 'SPD' },
    { code: 'B-24-0004', type: 'Item', name: 'Product B — Analyzer Cuvette Pack 500', country: 'SG', entity: 'QTS' },
    { code: 'B-25-0011', type: 'Item', name: 'Product B — Sample Cups 2mL x1000', country: 'SG', entity: 'QTS' },
    { code: 'C-25-0002', type: 'Item', name: 'Product C — Analyzer Annual Service Plan', country: 'SG', entity: 'QTG' },
    { code: 'C-25-0007', type: 'Item', name: 'Product C — Benchtop Centrifuge 24-place', country: 'SG', entity: 'QTG' },
  ];

  // ---- synthetic monthly purchase-order lines ----
  const ORDERS = []; // {code, country, p, mi, units}
  CUSTOMERS.forEach(([code, , cc, , scale, gaps, churn]) => {
    const C = COUNTRIES.find(x => x.c === cc);
    const dup = DUPS.find(x => x.dupOf === code);
    PRODUCTS.forEach(P => {
      if (gaps.includes(P.p)) return;
      const base = (P.base[0] + R() * (P.base[1] - P.base[0])) * scale;
      for (let mi = 0; mi < NH; mi++) {
        let v = base * Math.pow(1 + C.g, mi) * SEAS_TRUE[MONTHS[mi].m] * (0.88 + R() * 0.24);
        if (churn && (churn.p === '*' || churn.p === P.p) && mi >= churn.from) v *= Math.pow(churn.k, mi - churn.from + 1);
        let u = Math.max(0, Math.round(v));
        if (dup && mi >= dup.from) { const s = Math.round(u * dup.share); ORDERS.push({ code: dup.code, country: cc, p: P.p, mi, units: s }); u -= s; }
        ORDERS.push({ code, country: cc, p: P.p, mi, units: u });
      }
    });
  });

  // ---- inbound mailbox volumes: purchase orders vs enquiries vs follow-ups vs MDM setup requests ----
  const INBOX_COUNTS = {}; // cc -> array of {po, enq, fup, mdm} per month
  COUNTRIES.forEach(C => {
    INBOX_COUNTS[C.c] = MONTHS.slice(0, NH).map((_, mi) => {
      const po = ORDERS.filter(o => o.country === C.c && o.mi === mi && o.units > 0).length;
      return {
        po,
        enq: Math.round(po * (0.55 + R() * 0.3)),
        fup: Math.round(po * (0.15 + R() * 0.1)),
        mdm: 1 + Math.floor(R() * 3) + (C.c === 'VN' ? 2 : C.c === 'ID' ? 1 : 0),
      };
    });
  });

  const sum = (a, i = 0, j = a.length) => a.slice(i, j).reduce((s, x) => s + x, 0);

  function countrySeries(cc, p) {
    const a = Array(NH).fill(0);
    ORDERS.forEach(o => { if ((cc === 'ALL' || o.country === cc) && (p === 'ALL' || o.p === p)) a[o.mi] += o.units; });
    return a;
  }

  // Growth measure. Primary = YoY: latest 3 months (Aug–Oct '26) vs same 3 months last year (season-fair).
  // Secondary = momentum: latest 3 months vs previous 3 months (early-warning signal for churn).
  function growth(a) {
    const last = sum(a, 21, 24), ly = sum(a, 9, 12), prev = sum(a, 18, 21);
    return { yoy: ly ? last / ly - 1 : null, mom: prev ? last / prev - 1 : null, last, prev, w12: sum(a, 12, 24) };
  }

  function linreg(y) {
    const n = y.length; let sx = 0, sy = 0, sxy = 0, sxx = 0;
    y.forEach((v, i) => { sx += i; sy += v; sxy += i * v; sxx += i * i; });
    const b = (n * sxy - sx * sy) / ((n * sxx - sx * sx) || 1);
    return { a: (sy - b * sx) / n, b };
  }

  // Seasonality pooled across all 15 country×product series (one series alone is too noisy to learn it)
  function seasonalIndex(train) {
    const s = Array(12).fill(0), c = Array(12).fill(0);
    COUNTRIES.forEach(C => PRODUCTS.forEach(P => {
      const y = countrySeries(C.c, P.p).slice(0, train), { a, b } = linreg(y);
      y.forEach((v, i) => { const t = a + b * i; if (t > 0) { s[MONTHS[i].m] += v / t; c[MONTHS[i].m]++; } });
    }));
    const idx = s.map((v, i) => c[i] ? v / c[i] : 1), mean = sum(idx) / 12;
    return idx.map(v => v / mean);
  }

  // Today's method: flat average of the last 6 months
  function fcBaseline(y, train, h) { const m = sum(y, train - 6, train) / 6; return Array(h).fill(m); }

  // Sappy's method: de-seasonalise → linear trend on last 12 months → re-seasonalise
  function fcSappy(y, train, h, S) {
    const d = y.slice(0, train).map((v, i) => v / S[MONTHS[i].m]).slice(-12), { a, b } = linreg(d);
    return Array.from({ length: h }, (_, j) => Math.max(0, (a + b * (12 + j)) * S[MONTHS[train + j].m]));
  }

  // Back-test: train on Nov '24 – Jul '26, predict Aug – Oct '26, score with WAPE
  function backtest() {
    const S = seasonalIndex(21), rows = []; let eb = 0, es = 0, act = 0;
    COUNTRIES.forEach(C => PRODUCTS.forEach(P => {
      const y = countrySeries(C.c, P.p), b = fcBaseline(y, 21, 3), s = fcSappy(y, 21, 3, S), a = y.slice(21, 24);
      let rb = 0, rs = 0, ra = 0;
      a.forEach((v, i) => { rb += Math.abs(v - b[i]); rs += Math.abs(v - s[i]); ra += v; });
      eb += rb; es += rs; act += ra;
      rows.push({ c: C.c, p: P.p, wb: rb / ra, ws: rs / ra });
    }));
    return { rows, wb: eb / act, ws: es / act, S };
  }

  function forward(cc, p) {
    const y = countrySeries(cc, p), S = seasonalIndex(NH);
    return { base: fcBaseline(y, NH, 3), sappy: fcSappy(y, NH, 3, S) };
  }

  // Customer-level view. `merged` = Set of duplicate codes already merged into their golden record.
  function customerRows(cc, merged) {
    const rows = {};
    ORDERS.forEach(o => {
      if (o.country !== cc) return;
      let code = o.code; const d = DUPS.find(x => x.code === code);
      if (d && merged.has(code)) code = d.dupOf;
      const r = rows[code] = rows[code] || { code, A: Array(NH).fill(0), B: Array(NH).fill(0), C: Array(NH).fill(0) };
      r[o.p][o.mi] += o.units;
    });
    const list = Object.values(rows).map(r => {
      const m = MASTER.find(x => x.code === r.code);
      const out = { code: r.code, name: m.name, entity: m.entity, isDup: !!m.dupOf, series: {}, g: {}, churn: [], gaps: [] };
      PRODUCTS.forEach(P => {
        out.series[P.p] = r[P.p]; const g = out.g[P.p] = growth(r[P.p]);
        if (g.prev >= 15 && g.mom <= -0.3) out.churn.push(P.p);
        if (!out.isDup && g.w12 === 0) out.gaps.push(P.p);
      });
      return out;
    });
    // cross-sell potential = 50% of the median monthly volume of peers in the same country (assumption)
    list.forEach(c => {
      c.potential = {};
      c.gaps.forEach(p => {
        const peers = list.filter(x => !x.isDup && x.g[p].w12 > 0).map(x => sum(x.series[p], 18, 24) / 6).sort((a, b) => a - b);
        const med = peers.length ? peers[Math.floor(peers.length / 2)] : 0;
        c.potential[p] = Math.round(med * 0.5);
      });
    });
    return list;
  }

  // ---- duplicate matching ----
  const ABBR = { natl: 'national', nat: 'national', univ: 'university', uni: 'university', hosp: 'hospital', hosps: 'hospitals', gen: 'general', intl: 'international', med: 'medical', ctr: 'centre', center: 'centre', spec: 'specialist', kl: 'kuala lumpur', sg: 'singapore', hcm: 'ho chi minh', co: '', pte: '', ltd: '', the: '', inc: '', sdn: '', bhd: '', tbk: '', pt: '' };
  function norm(s) {
    return String(s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
      .map(w => ABBR[w] !== undefined ? ABBR[w] : w).join(' ').replace(/\s+/g, ' ').trim();
  }
  function bigrams(s) { s = s.replace(/ /g, ''); const a = []; for (let i = 0; i < s.length - 1; i++) a.push(s.slice(i, i + 2)); return a; }
  function dice(a, b) {
    const A = bigrams(a), B = bigrams(b); if (!A.length || !B.length) return 0;
    const m = new Map(); A.forEach(x => m.set(x, (m.get(x) || 0) + 1)); let n = 0;
    B.forEach(x => { const c = m.get(x); if (c) { n++; m.set(x, c - 1); } });
    return 2 * n / (A.length + B.length);
  }
  function tokJ(a, b) { const A = new Set(a.split(' ')), B = new Set(b.split(' ')); let i = 0; A.forEach(x => B.has(x) && i++); return i / ((A.size + B.size - i) || 1); }
  function similarity(a, b) { a = norm(a); b = norm(b); if (!a || !b) return 0; if (a === b) return 1; return 0.65 * dice(a, b) + 0.35 * tokJ(a, b); }

  // ---- inbox classifier (transparent keyword model; production would swap in an Azure AI / small LLM classifier) ----
  const CLASSES = {
    PO: { label: 'Purchase order', icon: '🛒', pats: [[/\bpo\b/i, 3], [/purchase order/i, 3], [/kindly supply|please supply|we (would like|wish) to order|confirm(ing)? (our )?order/i, 3], [/deliver by|delivery date/i, 1]] },
    ENQ: { label: 'Enquiry', icon: '💬', pats: [[/quot/i, 2], [/pric/i, 2], [/how much/i, 2], [/availab/i, 2], [/brochure|catalog/i, 2], [/lead time/i, 2], [/interested|demo/i, 2], [/\?/, 1]] },
    FUP: { label: 'Follow-up', icon: '🔁', pats: [[/follow(ing)?[ -]?up/i, 2.5], [/any update|status of/i, 2.5], [/still not|not (yet )?received|when will/i, 2.5], [/chasing|reminder/i, 2]] },
    MDM: { label: 'MDM setup', icon: '🐣', pats: [[/set ?up|setup/i, 3], [/new (customer|vendor|supplier|item)/i, 3], [/register/i, 2], [/item code|vendor code|customer code/i, 3], [/onboard|account opening|bank details|master data/i, 3]] },
  };
  function classify(text) {
    const qty = text.match(/(\d+)\s*(kits?|boxes|units|pcs|cartons|visits)/i), prod = text.match(/product\s*([abc])\b/i);
    const scores = {};
    Object.entries(CLASSES).forEach(([k, c]) => { scores[k] = c.pats.reduce((s, [re, w]) => s + (re.test(text) ? w : 0), 0); });
    if (qty) scores.PO += 1;
    const ex = Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, Math.exp(v / 1.5)])), tot = sum(Object.values(ex));
    const best = Object.keys(scores).reduce((a, b) => scores[b] > scores[a] ? b : a, 'ENQ');
    return { cls: best, conf: ex[best] / tot, qty: qty ? +qty[1] : null, unit: qty ? qty[2] : null, product: prod ? prod[1].toUpperCase() : null };
  }
  const INBOX = [
    { from: 'Bumrungrad Lab Procurement', cc: 'TH', text: 'Hi team, please find attached PO #BH-7781 for 120 kits of Product A HbA1c reagent. Deliver by 15 Nov.' },
    { from: 'Cho Ray Hospital', cc: 'VN', text: 'Could you send a quotation and lead time for the Product C analyzer service contract?' },
    { from: 'Marcus (Regional Sales)', cc: 'MY', text: 'Need to set up a new customer account for Pantai Hospital Ipoh — please register them so we can quote.' },
    { from: 'NUH Procurement', cc: 'SG', text: 'Kindly supply 40 boxes of Product B cuvette packs. Our PO ref NUH/PO/2210 attached.' },
    { from: 'Prodia Clinical Laboratory', cc: 'ID', text: 'Is Product B available in Indonesia? Do you have a brochure and pricing?' },
    { from: 'Medlatec Laboratory', cc: 'VN', text: 'Following up on our order last week — when will the 60 kits arrive?' },
    { from: 'Amy (Product Manager)', cc: 'SG', text: 'New item code needed for Product A Lyme IgG kit (IVD). Supplier is BioNova.' },
    { from: 'Siriraj Hospital', cc: 'TH', text: 'PO attached: 25 units of Product C preventive service visits for 2027.' },
    { from: 'Sunway Medical Centre', cc: 'MY', text: 'Any update on the delivery for PO SMC-221? Still not received.' },
    { from: 'Siloam Hospitals', cc: 'ID', text: 'What is the price for 200 kits of Product A? Planning next quarter budget.' },
  ];

  const E = { NOW, HOUR, DAY, NH, MONTHS, SEAS_TRUE, COUNTRIES, PRODUCTS, CUSTOMERS, DUPS, MASTER, ORDERS, INBOX_COUNTS, INBOX, CLASSES,
    sum, countrySeries, growth, linreg, seasonalIndex, fcBaseline, fcSappy, backtest, forward, customerRows, norm, similarity, classify };
  if (typeof module !== 'undefined' && module.exports) module.exports = E; else G.ENGINE = E;
})(typeof window !== 'undefined' ? window : globalThis);
