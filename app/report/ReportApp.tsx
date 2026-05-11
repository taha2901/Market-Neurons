"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import "./report.css";

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
  const pts = [40, 42, 41, 39, 43, 47, 45, 50, 48, 53, 51, 56, 54, 58, 57, 61, 60, 64, 63, 67, 66, 65, 70, 72, 69, 74, 76];
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

const SB_TABS = ["Indices", "Commod.", "Bonds", "Stocks"] as const;

type IndexRow = { code: "us" | null; name: string; price: string; chg: string; pos: boolean };

const INDEX_ROWS: IndexRow[] = [
  { code: "us", name: "US 30", price: "38,665.21", chg: "+471.4 +1.2% ▲", pos: true },
  { code: "us", name: "US 500", price: "5,127.79", chg: "+63.7 +1.3% ▲", pos: true },
  { code: "us", name: "Dow Jones", price: "38,589.16", chg: "−65.1 −0.2% ▼", pos: false },
  { code: "us", name: "S&P 500", price: "5,071.63", chg: "−36.2 −0.7% ▼", pos: false },
  { code: "us", name: "S&P 500 VIX", price: "17.70", chg: "−2.8 −14% ▼", pos: false },
  { code: "us", name: "Nasdaq", price: "16,302.76", chg: "+115.3 +0.7% ▲", pos: true },
  { code: null, name: "Dollar Index", price: "104.51", chg: "−0.4 −0.4% ▼", pos: false },
];

export default function ReportApp() {
  const router = useRouter();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [sbTab, setSbTab] = useState(0);
  const [idxSel, setIdxSel] = useState(0);
  const [rangeKey, setRangeKey] = useState("1W");
  const [mktPanel, setMktPanel] = useState<"commodities" | "symbols">("commodities");
  const [artTab, setArtTab] = useState<"news" | "analysis">("news");

  const redraw = useCallback(() => {
    drawMiniChart(chartRef.current);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(redraw, 80);
    window.addEventListener("resize", redraw);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", redraw);
    };
  }, [redraw]);

  return (
    <div className="report-root">
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
            <div className="logo-text">
              Market <span>Neurons</span>
            </div>
            <div className="logo-tagline">Agri-Intelligence Platform</div>
          </div>
        </Link>
        <div className="search-wrap">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
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

      <div className="app-body">
        <aside className="sidebar">
          <div className="sb-tabs" role="tablist">
            {SB_TABS.map((label, i) => (
              <button
                key={label}
                type="button"
                role="tab"
                className={`sb-tab ${sbTab === i ? "active" : ""}`}
                onClick={() => setSbTab(i)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="sb-chart-area">
            <div className="sb-chart-header">
              <span className="sb-chart-name">US 30 — Dow Jones</span>
              <span className="sb-chart-val">+471 ▲ 1.2%</span>
            </div>
            <canvas id="miniChart" ref={chartRef} />
            <div className="sb-time-range">
              {(["1D", "1W", "1M", "3M", "1Y", "Max"] as const).map((k) => (
                <button key={k} type="button" className={`sb-tr-btn ${rangeKey === k ? "active" : ""}`} onClick={() => setRangeKey(k)}>
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="sb-index-list">
            {INDEX_ROWS.map((row, i) => (
              <button
                key={row.name}
                type="button"
                className={`sb-index-row ${idxSel === i ? "selected" : ""}`}
                onClick={() => setIdxSel(i)}
              >
                <div className="sb-idx-name">
                  {row.code ? (
                    <span className="sb-idx-code">{row.code}</span>
                  ) : (
                    <span className="sb-idx-globe" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </span>
                  )}
                  <span className="sb-idx-label">{row.name}</span>
                </div>
                <div className="sb-idx-vals">
                  <div className="sb-idx-price">{row.price}</div>
                  <div className={`sb-idx-chg ${row.pos ? "pos" : "neg"}`}>{row.chg}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="sb-popular-wrap">
            <div className="sb-sec">Most Popular Articles</div>
            <div className="sb-art-tabs">
              <button type="button" className={`sb-atab ${artTab === "news" ? "active" : ""}`} onClick={() => setArtTab("news")}>
                News
              </button>
              <button type="button" className={`sb-atab ${artTab === "analysis" ? "active" : ""}`} onClick={() => setArtTab("analysis")}>
                Analysis
              </button>
            </div>
            <div className="sb-art-item">
              <div className="sb-art-thumb">
                <img src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=100&q=80" alt="" />
              </div>
              <div className="sb-art-body">
                <div className="sb-art-title">Oil rises after Norway feasibilities, set for weekly drop in price perspective</div>
                <div className="sb-art-meta">By investing.com · May 09, 2026</div>
              </div>
            </div>
            <div className="sb-art-item">
              <div className="sb-art-thumb">
                <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&q=80" alt="" />
              </div>
              <div className="sb-art-body">
                <div className="sb-art-title">Oil takes up after U.S. said to tilt Iran talks with new analysis ahead of proposal</div>
                <div className="sb-art-meta">By investing.com · May 04, 2026</div>
              </div>
            </div>
            <div className="sb-art-item">
              <div className="sb-art-thumb">
                <img src="https://images.unsplash.com/photo-1559526324-593bc073d938?w=100&q=80" alt="" />
              </div>
              <div className="sb-art-body">
                <div className="sb-art-title">U.S. stocks waver as traders await Fed&apos;s response to latest peace proposal</div>
                <div className="sb-art-meta">By investing.com · May 04, 2026</div>
              </div>
            </div>
            <div className="sb-more">
              <a href="#">More News ›</a>
            </div>
          </div>

          <div className="sb-sec">
            Market Prices <a href="#">›</a>
          </div>
          <div className="market-data-section">
            <div className="mkt-inner-tabs">
              <button type="button" className={`mkt-itab ${mktPanel === "commodities" ? "active" : ""}`} onClick={() => setMktPanel("commodities")}>
                Commodities
              </button>
              <button type="button" className={`mkt-itab ${mktPanel === "symbols" ? "active" : ""}`} onClick={() => setMktPanel("symbols")}>
                Symbols
              </button>
            </div>

            <div className={`mkt-panel ${mktPanel === "commodities" ? "active" : ""}`} id="panel-commodities">
              <div className="mkt-table-wrap">
                <table className="mkt-table">
                  <thead>
                    <tr>
                      <th>Commodity</th>
                      <th>Price</th>
                      <th>Chg %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Urea", "700", "+5%", true],
                      ["DAP", "500", "+1%", true],
                      ["Natural Gas", "2.5", "+2%", true],
                      ["LNG", "19", "−1%", false],
                      ["Crude Oil WTI", "80", "−5%", false],
                      ["Brent Oil", "90", "+5%", true],
                      ["Wheat", "200", "+1%", true],
                      ["Corn", "700", "+2%", true],
                    ].map(([name, price, chg, pos]) => (
                      <tr key={String(name)}>
                        <td>{name}</td>
                        <td>{price}</td>
                        <td className={pos ? "mkt-chg-pos" : "mkt-chg-neg"}>{chg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`mkt-panel ${mktPanel === "symbols" ? "active" : ""}`} id="panel-symbols">
              <div className="mkt-table-wrap">
                <table className="mkt-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Price</th>
                      <th>Chg %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["ABUK", "100", "+5%", true],
                      ["MPCO", "70", "+1%", true],
                      ["YAR", "20", "+2%", true],
                      ["2020", "30", "−1%", false],
                      ["CF", "26", "−5%", false],
                    ].map(([sym, price, chg, pos]) => (
                      <tr key={String(sym)}>
                        <td>{sym}</td>
                        <td>{price}</td>
                        <td className={pos ? "mkt-chg-pos" : "mkt-chg-neg"}>{chg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mkt-see-more">
                <a href="#">See More ›</a>
              </div>
            </div>
          </div>

          <div className="sb-sec">
            Urea Trade Data <a href="#">›</a>
          </div>
          <div className="trade-tables-section">
            <div className="trade-tables-grid">
              <div className="trade-tbl-block">
                <div className="trade-tbl-title">
                  Top Exporters <span>mn ton</span>
                </div>
                <table className="trade-tbl">
                  <tbody>
                    {[
                      ["Brazil", "3"],
                      ["China", "30"],
                      ["Russia", "40"],
                      ["S. Arabia", "40"],
                      ["Egypt", "20"],
                    ].map(([c, v]) => (
                      <tr key={String(c)}>
                        <td>{c}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="trade-tbl-block">
                <div className="trade-tbl-title">
                  Top Importers <span>mn ton</span>
                </div>
                <table className="trade-tbl">
                  <tbody>
                    {[
                      ["Brazil", "1"],
                      ["China", "2"],
                      ["Russia", "0"],
                      ["S. Arabia", "0"],
                      ["Egypt", "0.5"],
                    ].map(([c, v]) => (
                      <tr key={String(c)}>
                        <td>{c}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="trade-tbl-block">
                <div className="trade-tbl-title">
                  Top Consumers <span>mn ton</span>
                </div>
                <table className="trade-tbl">
                  <tbody>
                    {[
                      ["Brazil", "2"],
                      ["China", "30"],
                      ["Russia", "40"],
                      ["S. Arabia", "160"],
                      ["Egypt", "50"],
                    ].map(([c, v]) => (
                      <tr key={String(c)}>
                        <td>{c}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="trade-tbl-block">
                <div className="trade-tbl-title">
                  Top Producers <span>mn ton</span>
                </div>
                <table className="trade-tbl">
                  <tbody>
                    {[
                      ["Brazil", "5"],
                      ["China", "60"],
                      ["Russia", "80"],
                      ["S. Arabia", "200"],
                      ["Egypt", "70"],
                    ].map(([c, v]) => (
                      <tr key={String(c)}>
                        <td>{c}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </aside>

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

            <div className="art-cat-row">
              <span className="art-tag fert">Fertilizer</span>
              <span className="art-tag trade">Trade</span>
              <div className="live-badge">
                <span className="live-dot" />
                Live
              </div>
              <span className="art-date">22 April 2025 · 09:14 EST</span>
              <span className="art-source">Reuters</span>
            </div>

            <h1 className="art-title">India to Import Record 2.5 Million Tons of Urea at Nearly Double the Price Paid Two Months Ago</h1>

            <p className="art-lead">
              India is set to import a record 2.5 million metric tons of urea in a single tender, signaling a dramatic tightening of global supply and pushing prices to multi-year highs — with downstream effects expected across the full fertilizer complex.
            </p>

            <div className="art-meta-strip">
              <div className="meta-item">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                5 min read
              </div>
              <div className="meta-item">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                <strong>NEW DELHI</strong>
                &nbsp;·&nbsp; India Correspondent
              </div>
            </div>

            <div className="art-img-wrap">
              <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=85" alt="Fertilizer bags" />
              <div className="art-img-badge">📦 Trade Intelligence</div>
              <div className="art-img-caption">
                India&apos;s 2.5 million metric ton urea tender — the largest single purchase ever — covers ~25% of the country&apos;s annual imports · April 2025
              </div>
            </div>

            <div className="art-tags-section">
              {["#Urea", "#India", "#GlobalTrade", "#Fertilizer"].map((t) => (
                <span key={t} className="tag-chip">
                  {t}
                </span>
              ))}
            </div>

            <div className="kfig-grid">
              <div className="kfig">
                <div className="kfig-lbl">Import Volume</div>
                <div className="kfig-val">2.5M</div>
                <div className="kfig-sub">Metric tons · single tender</div>
                <div className="kfig-chg pos">▲ All-time record</div>
              </div>
              <div className="kfig">
                <div className="kfig-lbl">Current Price</div>
                <div className="kfig-val">$700</div>
                <div className="kfig-sub">per metric ton (FOB)</div>
                <div className="kfig-chg neg">▲ +95% vs 2 months ago</div>
              </div>
              <div className="kfig">
                <div className="kfig-lbl">Share of Annual Need</div>
                <div className="kfig-val">~25%</div>
                <div className="kfig-sub">of India&apos;s annual imports</div>
                <div className="kfig-chg" style={{ color: "var(--amber)" }}>
                  ● Supply pressure: High
                </div>
              </div>
            </div>

            <div className="art-body">
              <p>
                India&apos;s government-backed fertilizer procurement agency has finalized a tender for <strong>2.5 million metric tons of granular urea</strong> — the largest single purchase ever recorded — at a price approaching{" "}
                <span className="mono">$700/ton</span>, nearly double the <span className="mono">~$360/ton</span> paid in February.
              </p>
              <div className="hbox">
                <div className="hbox-lbl">📌 Key Context</div>
                The record purchase comes amid reduced Russian and Chinese export availability, gas price spikes in Europe reducing European urea output, and seasonal pre-kharif procurement demand in India. Analysts warn the ripple effects will reach DAP, MAP, and ammonia markets within 4–6 weeks.
              </div>
              <p>
                Global urea supply has been under pressure since Q4 2024, with China implementing informal export restrictions to secure domestic food security. Russia continues to face logistical constraints due to ongoing sanctions. This structural tightening left India with limited sourcing options, forcing acceptance of significantly higher prices to secure the required volumes ahead of the critical planting season.
              </p>
              <p>
                The tender attracted bids from suppliers across the Middle East, North Africa, and South Asia. <strong>Saudi Arabia</strong> and <strong>Egypt</strong> were among the confirmed suppliers, with Saudi Aramco&apos;s fertilizer arm and Egypt&apos;s Abu Qir Fertilizers each contributing significant tonnage. Delivery is expected between May and June 2025.
              </p>
              <p>
                <strong>What to watch:</strong> Chinese export policy decisions expected in late May, ammonia contract rollovers in June, and India&apos;s post-tender domestic price pass-through which could affect crop-planting decisions in the following season.
              </p>
            </div>

            <div className="rel-title">Related Articles</div>
            <div className="rel-grid">
              {[
                { cat: "Natural Gas", title: "European Gas Prices Spike 18% — Urea Production Costs Set to Rise", meta: "April 20, 2025 · 3 min read" },
                { cat: "China Export", title: "China Extends Urea Export Curb Through Q2 2025 Amid Food Security Concerns", meta: "April 18, 2025 · 4 min read" },
                { cat: "DAP / MAP", title: "DAP Prices Climb on Phosphate Supply Disruptions in Morocco and Jordan", meta: "April 15, 2025 · 3 min read" },
                { cat: "Trade Flow", title: "Brazil Accelerates Q2 Fertilizer Imports Ahead of Anticipated Price Rise", meta: "April 12, 2025 · 5 min read" },
              ].map((r) => (
                <div key={r.title} className="rel-card" role="button" tabIndex={0} onClick={() => router.push("/report")}>
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
