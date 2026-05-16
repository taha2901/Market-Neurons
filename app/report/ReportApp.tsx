"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import "./report.css";

/* ─────────────────────────────────────────────
   Mini sparkline chart
───────────────────────────────────────────── */
function drawMiniChart(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const r = canvas.getBoundingClientRect();
  const W = r.width || 300;
  const H = r.height || 50;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pts = [40,42,41,39,43,47,45,50,48,53,51,56,54,58,57,61,60,64,63,67,66,65,70,72,69,74,76];
  const mn = Math.min(...pts);
  const mx = Math.max(...pts);
  const rng = mx - mn || 1;
  const x = (i: number) => (i / (pts.length - 1)) * W;
  const y = (v: number) => H - ((v - mn) / rng) * H * 0.82 - H * 0.08;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(13,122,95,0.2)");
  g.addColorStop(1, "rgba(13,122,95,0)");
  ctx.clearRect(0, 0, W, H);
  ctx.beginPath();
  ctx.moveTo(x(0), H);
  pts.forEach((v, i) => ctx.lineTo(x(i), y(v)));
  ctx.lineTo(x(pts.length - 1), H);
  ctx.closePath();
  ctx.fillStyle = g;
  ctx.fill();
  ctx.beginPath();
  pts.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
  ctx.strokeStyle = "#0d7a5f";
  ctx.lineWidth = 1.8;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x(pts.length - 1), y(pts[pts.length - 1]), 3, 0, Math.PI * 2);
  ctx.fillStyle = "#0d7a5f";
  ctx.fill();
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const COMMODITIES = [
  { name: "Urea",          price: "700",   chg: "+5.0%", pos: true  },
  { name: "DAP",           price: "500",   chg: "+1.0%", pos: true  },
  { name: "Natural Gas",   price: "2.50",  chg: "+2.0%", pos: true  },
  { name: "LNG",           price: "19.00", chg: "−1.0%", pos: false },
  { name: "Crude Oil WTI", price: "80.00", chg: "−5.0%", pos: false },
  { name: "Brent Oil",     price: "90.00", chg: "+5.0%", pos: true  },
  { name: "Wheat",         price: "200",   chg: "+1.0%", pos: true  },
  { name: "Corn",          price: "700",   chg: "+2.0%", pos: true  },
];

const STOCKS = [
  { name: "ABUK", price: "100", chg: "+5.0%", pos: true  },
  { name: "MPCO", price: "70",  chg: "+1.0%", pos: true  },
  { name: "YAR",  price: "20",  chg: "+2.0%", pos: true  },
  { name: "2020", price: "30",  chg: "−1.0%", pos: false },
  { name: "CF",   price: "26",  chg: "−5.0%", pos: false },
];

const RANK_DOTS = ["rank-1", "rank-2", "rank-3", "rank-4", "rank-4"] as const;

const EXPORTERS: [string, string][] = [
  ["Russia", "40"], ["S. Arabia", "40"], ["China", "30"], ["Egypt", "20"], ["Brazil", "3"],
];
const IMPORTERS: [string, string][] = [
  ["China", "2"], ["Brazil", "1"], ["Egypt", "0.5"], ["Russia", "0"], ["S. Arabia", "0"],
];
const CONSUMERS: [string, string][] = [
  ["S. Arabia", "160"], ["Egypt", "50"], ["Russia", "40"], ["China", "30"], ["Brazil", "2"],
];
const PRODUCERS: [string, string][] = [
  ["S. Arabia", "200"], ["Russia", "80"], ["Egypt", "70"], ["China", "60"], ["Brazil", "5"],
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function TradeBlock({ title, unit, rows }: { title: string; unit: string; rows: [string, string][] }) {
  return (
    <div className="trade-tbl-block">
      <div className="trade-tbl-title">
        {title} <span>{unit}</span>
      </div>
      {rows.map(([country, val], i) => (
        <div className="trade-row" key={country}>
          <span className="trade-country">
            <span className={`rank-dot ${RANK_DOTS[i]}`} />
            {country}
          </span>
          <span className="trade-val">{val}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function ReportApp() {
  const router = useRouter();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [mktTab, setMktTab] = useState<"commodities" | "stocks">("commodities");

  const redraw = useCallback(() => { drawMiniChart(chartRef.current); }, []);

  useEffect(() => {
    const t = window.setTimeout(redraw, 80);
    window.addEventListener("resize", redraw);
    return () => { clearTimeout(t); window.removeEventListener("resize", redraw); };
  }, [redraw]);

  const tableRows = mktTab === "commodities" ? COMMODITIES : STOCKS;
  const tableHeader = mktTab === "commodities" ? "Commodity" : "Ticker";

  return (
    <div className="report-root">

      {/* ══ NAVBAR ══ */}
      <nav className="navbar">
        <Link className="logo" href="/">
          <div className="logo-icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="logo-text">Market <span>Neurons</span></div>
            <div className="logo-tagline">Agri-Intelligence Platform</div>
          </div>
        </Link>

        <div className="search-wrap">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input className="search-input" placeholder="Search articles, tickers, commodities…" />
          <span className="search-hint">⌘K</span>
        </div>

        <div className="nav-actions">
          <button type="button" className="icon-btn" aria-label="Notifications">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div className="notif-dot" />
          </button>
          <button type="button" className="icon-btn" aria-label="Bookmarks">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <div className="nav-divider" />
          <button type="button" className="export-btn">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export PDF
          </button>
          <div className="nav-divider" />
          <div className="profile-pill">
            <div className="avatar">AM</div>
            <div>
              <div className="profile-name">Ahmed M.</div>
              <div className="profile-role">Senior Analyst</div>
            </div>
          </div>
        </div>
      </nav>

      {/* ══ BODY ══ */}
      <div className="app-body">

        {/* ══ SIDEBAR ══ */}
        <aside className="sidebar">
          <div className="sidebar-right-grid">

            {/* ── Block 1: Market Prices ── */}
            <div className="sidebar-right-block">
              <div className="sb-sec-header">
                <span className="sb-sec-title">Market Prices</span>
                <a className="sb-sec-link" href="#">See all ›</a>
              </div>

              <div className="market-data-section">
                {/* Tab strip */}
                <div className="mkt-tab-strip">
                  <button
                    type="button"
                    className={`mkt-tab-btn ${mktTab === "commodities" ? "active" : ""}`}
                    onClick={() => setMktTab("commodities")}
                  >
                    Commodities
                  </button>
                  <button
                    type="button"
                    className={`mkt-tab-btn ${mktTab === "stocks" ? "active" : ""}`}
                    onClick={() => setMktTab("stocks")}
                  >
                    Fert. Stocks
                  </button>
                </div>

                {/* Table — no row borders */}
                <div className="mkt-table-wrap">
                  <table className="mkt-table">
                    <thead>
                      <tr>
                        <th>{tableHeader}</th>
                        <th>Price</th>
                        <th>Chg %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map(({ name, price, chg, pos }) => (
                        <tr key={name}>
                          <td>{name}</td>
                          <td>{price}</td>
                          <td>
                            <span className={`chg-badge ${pos ? "pos" : "neg"}`}>{chg}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mkt-see-more">
                  <a href="#">More markets ›</a>
                </div>
              </div>
            </div>

            {/* ── Block 2: Urea Trade Data ── */}
            <div className="sidebar-right-block">
              <div className="sb-sec-header">
                <span className="sb-sec-title">Urea Trade Data</span>
                <a className="sb-sec-link" href="#">2024 ›</a>
              </div>

              <div className="trade-tables-section">
                <div className="trade-tables-grid">
                  <TradeBlock title="Top Exporters"  unit="mn ton" rows={EXPORTERS}  />
                  <TradeBlock title="Top Importers"  unit="mn ton" rows={IMPORTERS}  />
                  <TradeBlock title="Top Consumers"  unit="mn ton" rows={CONSUMERS}  />
                  <TradeBlock title="Top Producers"  unit="mn ton" rows={PRODUCERS}  />
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* ══ MAIN CONTENT ══ */}
        <div className="main">
          <div className="content">

            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>News &amp; Analysis</span>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span style={{ color: "var(--text-secondary)" }}>India Urea Import Record</span>
            </div>

            <h1 className="art-title">
              India to Import Record 2.5 Million Tons of Urea at Nearly Double the Price Paid Two Months Ago
            </h1>

            <div className="art-cat-row">
              <span className="art-date">22 April 2025 · 09:14 EST</span>
            </div>

            <div className="art-key-block">
              <p className="art-lead">
                India is set to import a record 2.5 million metric tons of urea in a single tender, signaling a dramatic
                tightening of global supply and pushing prices to multi-year highs — with downstream effects expected
                across the full fertilizer complex.
              </p>
              <div className="hbox">
                <div className="hbox-lbl">Key Context</div>
                The record purchase comes amid reduced Russian and Chinese export availability, gas price spikes in Europe
                reducing European urea output, and seasonal pre-kharif procurement demand in India. Analysts warn the
                ripple effects will reach DAP, MAP, and ammonia markets within 4–6 weeks.
              </div>
            </div>

            <div className="art-body">
              <p>
                India&apos;s government-backed fertilizer procurement agency has finalized a tender for{" "}
                <strong>2.5 million metric tons of granular urea</strong> — the largest single purchase ever recorded —
                at a price approaching <span className="mono">$700/ton</span>, nearly double the{" "}
                <span className="mono">~$360/ton</span> paid in February.
              </p>
              <p>
                Global urea supply has been under pressure since Q4 2024, with China implementing informal export
                restrictions to secure domestic food security. Russia continues to face logistical constraints due to
                ongoing sanctions. This structural tightening left India with limited sourcing options, forcing
                acceptance of significantly higher prices to secure the required volumes ahead of the critical planting
                season.
              </p>
              <p>
                The tender attracted bids from suppliers across the Middle East, North Africa, and South Asia.{" "}
                <strong>Saudi Arabia</strong> and <strong>Egypt</strong> were among the confirmed suppliers, with Saudi
                Aramco&apos;s fertilizer arm and Egypt&apos;s Abu Qir Fertilizers each contributing significant tonnage.
                Delivery is expected between May and June 2025.
              </p>
              <p>
                <strong>What to watch:</strong> Chinese export policy decisions expected in late May, ammonia contract
                rollovers in June, and India&apos;s post-tender domestic price pass-through which could affect
                crop-planting decisions in the following season.
              </p>
            </div>

            <div className="rel-title">Related Articles</div>
            <div className="rel-grid">
              {[
                {
                  cat: "Natural Gas",
                  title: "European Gas Prices Spike 18% — Urea Production Costs Set to Rise",
                  meta: "April 20, 2025 · 3 min read",
                },
                {
                  cat: "China Export",
                  title: "China Extends Urea Export Curb Through Q2 2025 Amid Food Security Concerns",
                  meta: "April 18, 2025 · 4 min read",
                },
                {
                  cat: "DAP / MAP",
                  title: "DAP Prices Climb on Phosphate Supply Disruptions in Morocco and Jordan",
                  meta: "April 15, 2025 · 3 min read",
                },
                {
                  cat: "Trade Flow",
                  title: "Brazil Accelerates Q2 Fertilizer Imports Ahead of Anticipated Price Rise",
                  meta: "April 12, 2025 · 5 min read",
                },
              ].map((r) => (
                <div
                  key={r.title}
                  className="rel-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push("/report")}
                >
                  <div className="rel-cat">{r.cat}</div>
                  <div className="rel-card-title">{r.title}</div>
                  <div className="rel-meta">{r.meta}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}