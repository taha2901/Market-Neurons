"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SPARK_GREEN, SPARK_MIX, SPARK_RED, TICKERS } from "./homeData";
import { drawSpark } from "./homeSpark";
import "./home.css";

const TABLE_TABS = ["Energy", "Metals", "Grains"] as const;

const SIDEBAR_ARTICLES: { img: string; title: string; meta: string }[] = [
  { img: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=100&q=80", title: "Decoding the Fed's Silent Language", meta: "Reuters · May 06, 2025" },
  { img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&q=80", title: "Crypto's Convergence with TradFi: A New Institutional Mandate", meta: "Bloomberg · May 05, 2025" },
  { img: "https://images.unsplash.com/photo-1543168256-418811576931?w=100&q=80", title: "Global Supply Chains: A Data Map", meta: "FT · May 04, 2025" },
  { img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=100&q=80", title: "India to Import Record 2.5M Tons of Urea at Near-Double Price", meta: "Reuters · May 03, 2025" },
];

export default function HomeApp() {
  const router = useRouter();
  const [sectorOpen, setSectorOpen] = useState(false);
  const [tableTab, setTableTab] = useState(0);
  const sectorRef = useRef<HTMLDivElement | null>(null);

  const goReport = useCallback(() => router.push("/report"), [router]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (sectorRef.current && !sectorRef.current.contains(e.target as Node)) setSectorOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const redrawSparks = useCallback(() => {
    drawSpark(document.getElementById("spark1") as HTMLCanvasElement | null, SPARK_GREEN, "#0d7a5f");
    drawSpark(document.getElementById("spark2") as HTMLCanvasElement | null, SPARK_RED, "#c0392b");
    drawSpark(document.getElementById("spark3") as HTMLCanvasElement | null, SPARK_MIX, "#0d7a5f");
    drawSpark(document.getElementById("spark4") as HTMLCanvasElement | null, SPARK_RED.slice(0, 12), "#c0392b");
    drawSpark(document.getElementById("secSpark1") as HTMLCanvasElement | null, [35, 38, 36, 40, 42, 44, 43, 47, 46, 50, 52, 54, 53, 57, 60], "#d97706");
    drawSpark(document.getElementById("secSpark2") as HTMLCanvasElement | null, [50, 48, 46, 49, 47, 45, 48, 46, 44, 43, 45, 44, 42, 41, 39], "#1a5499");
    drawSpark(document.getElementById("secSpark3") as HTMLCanvasElement | null, [30, 32, 34, 33, 36, 40, 42, 45, 48, 52, 56, 60, 62, 66, 70], "#0d7a5f");
  }, []);

  useEffect(() => {
    const t = window.setTimeout(redrawSparks, 100);
    window.addEventListener("resize", redrawSparks);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", redrawSparks);
    };
  }, [redrawSparks]);

  const tape = [...TICKERS, ...TICKERS];

  return (
    <>
      <nav className="navbar">
        <Link className="logo" href="/">
          <div className="logo-icon">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
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

        <div className="nav-links">
          <Link className="nav-link active" href="/">
            Dashboard
          </Link>
          <div
            ref={sectorRef}
            className={`nav-link nav-link-dropdown ${sectorOpen ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setSectorOpen((o) => !o);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSectorOpen((o) => !o)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
              Sector Neurons
              <span className="nav-link-arrow">▼</span>
            </span>
            <div className="dropdown-menu">
              <Link className="dropdown-item" href="/fertilizers" onClick={() => setSectorOpen(false)}>
                Fertilizers
              </Link>
            </div>
          </div>
          <span className="nav-link" style={{ cursor: "default" }}>
            Jewelry
          </span>
          <span className="nav-link" style={{ cursor: "default" }}>
            Insights
          </span>
        </div>

        <div className="search-wrap">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input className="search-input" placeholder="Search markets, tickers…" />
          <span className="search-hint">⌘K</span>
        </div>

        <div className="nav-actions">
          <div className="icon-btn">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div className="notif-dot" />
          </div>
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

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left animate-up">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span className="hero-badge-text">Neural Intelligence Active</span>
            </div>
            <h1 className="hero-title">
              Sector <span>Neurons</span> Insight
            </h1>
            <p className="hero-subtitle">
              Proprietary deep-learning analysis across global commodity sectors. Mapping correlations and institutional flow in real-time.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn-primary">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Full Archive
              </button>
              <button type="button" className="btn-secondary">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                </svg>
                Configure Neurons
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-val">+6.42%</div>
                <div className="hero-stat-lbl">YTD Agri Index</div>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.12)" }} />
              <div>
                <div className="hero-stat-val">34</div>
                <div className="hero-stat-lbl">Sectors Tracked</div>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.12)" }} />
              <div>
                <div className="hero-stat-val">Live</div>
                <div className="hero-stat-lbl" style={{ color: "#2ecc71" }}>
                  Data Active
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card">
              <div className="hero-card-header">
                <span className="hero-card-title">Market Terminal</span>
                <span className="hero-card-badge">
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      background: "var(--green)",
                      borderRadius: "50%",
                      animation: "pulse 2s infinite",
                      display: "inline-block",
                    }}
                  />
                  Live
                </span>
              </div>
              <div className="market-rows">
                {[
                  { icon: "🌾", bg: "rgba(200,168,75,0.15)", name: "Urea (Granular)", sub: "FOB Arab Gulf", id: "spark1", price: "$692.25", pos: true, chg: "+1.2%" },
                  { icon: "🌿", bg: "rgba(13,122,95,0.15)", name: "DAP", sub: "FOB Tampa", id: "spark2", price: "$624.00", pos: false, chg: "−0.8%" },
                  { icon: "⚗️", bg: "rgba(91,45,142,0.15)", name: "Ammonia", sub: "CFR South Asia", id: "spark3", price: "$440.50", pos: true, chg: "+2.1%" },
                  { icon: "🔶", bg: "rgba(180,83,9,0.15)", name: "Potash MOP", sub: "CFR Brazil", id: "spark4", price: "$312.00", pos: false, chg: "−0.4%" },
                ].map((row) => (
                  <div key={row.name} className="market-row">
                    <div className="market-row-left">
                      <div className="market-icon" style={{ background: row.bg }}>
                        {row.icon}
                      </div>
                      <div>
                        <div className="market-name">{row.name}</div>
                        <div className="market-sub">{row.sub}</div>
                      </div>
                    </div>
                    <canvas className="spark" id={row.id} />
                    <div className="market-row-right">
                      <div className="market-price">{row.price}</div>
                      <div className={`market-chg ${row.pos ? "pos" : "neg"}`}>
                        {row.pos ? "▲" : "▼"} {row.chg}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker-tape">
        <div className="ticker-label">
          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          LIVE
        </div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div className="ticker-scroll">
            {tape.map((t, i) => (
              <div key={`${t.sym}-${i}`} className="ticker-item">
                <span className="ticker-sym">{t.sym}</span>
                <span className="ticker-val">{t.val}</span>
                <span className={`ticker-chg ${t.pos ? "pos" : "neg"}`}>
                  {t.pos ? "▲" : "▼"} {t.chg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-body">
        <div style={{ marginBottom: "24px", padding: "18px 22px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.7px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "3px" }}>Market Intelligence</div>
            <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-secondary)" }}>Curated analysis for the professional architect.</div>
          </div>
          <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>Full Archive →</span>
        </div>

        <div className="section-header">
          <span className="section-title">
            Sector Pulse — <span style={{ color: "var(--text-muted)", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>Global asset correlation and momentum charts</span>
          </span>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button type="button" style={{ height: "30px", padding: "0 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}>
              Expert Report
            </button>
            <button type="button" style={{ height: "30px", padding: "0 14px", background: "var(--accent)", border: "none", borderRadius: "var(--radius-sm)", fontSize: "12px", fontWeight: 600, color: "#fff", cursor: "pointer" }}>
              Configure Neurons
            </button>
          </div>
        </div>

        <div className="sector-cards">
          <div className="sector-card metals">
            <div className="sector-card-top">
              <div className="sector-card-icon" style={{ background: "var(--amber-light)" }}>
                🥇
              </div>
              <span className="sector-card-badge badge-up">Bull Run</span>
            </div>
            <div className="sector-card-name">Metals</div>
            <div className="sector-card-desc">Driven by demand ship surge</div>
            <div className="sector-card-chg pos">+4.2%</div>
            <div className="sector-card-footer">Global direction: Recovering</div>
            <canvas className="sector-spark" id="secSpark1" />
          </div>
          <div className="sector-card stocks">
            <div className="sector-card-top">
              <div className="sector-card-icon" style={{ background: "var(--accent-light)" }}>
                📈
              </div>
              <span className="sector-card-badge badge-neutral">Neutral</span>
            </div>
            <div className="sector-card-name">Stocks</div>
            <div className="sector-card-desc">Tech displacing industrials</div>
            <div className="sector-card-chg neg">−0.8%</div>
            <div className="sector-card-footer">Global direction: Moderating</div>
            <canvas className="sector-spark" id="secSpark2" />
          </div>
          <div className="sector-card fert">
            <div className="sector-card-top">
              <div className="sector-card-icon" style={{ background: "var(--green-light)" }}>
                🌱
              </div>
              <span className="sector-card-badge badge-up">Supply Constraint</span>
            </div>
            <div className="sector-card-name">Fertilizers</div>
            <div className="sector-card-desc">China export cut · India tender</div>
            <div className="sector-card-chg pos">+12.4%</div>
            <div className="sector-card-footer">Global direction: Bullish</div>
            <canvas className="sector-spark" id="secSpark3" />
          </div>
        </div>

        <div className="section-header">
          <span className="section-title">Intelligence Feed</span>
          <span className="section-link">View All →</span>
        </div>

        <div className="intel-grid">
          <div className="featured-article" onClick={goReport} role="link" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && goReport()}>
            <img className="featured-img" src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80" alt="" />
            <div className="featured-body">
              <div className="featured-cat-row">
                <span className="cat-tag fert-tag">Fertilizer</span>
                <span className="cat-tag trade-tag">Trade</span>
                <span className="cat-date">22 April 2025</span>
              </div>
              <div className="featured-title">The Quantum Shift: Why AI is rewriting the rules of the S&P 500 volatility.</div>
              <p className="featured-lead">
                Deep-learning models suggest that technical correlations are breaking down in the face of algorithmic liquidity pools and rapid institutional rebalancing.
              </p>
              <div className="featured-footer">
                <div className="featured-author">
                  <div className="featured-av">JK</div>
                  <div>
                    <div className="featured-av-name">James K.</div>
                    <div className="featured-av-role">Chief Markets Editor</div>
                  </div>
                </div>
                <div className="read-time">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  5 min read
                </div>
              </div>
            </div>
          </div>

          <div className="intel-sidebar">
            <div className="intel-panel">
              <div className="intel-panel-header">
                <span className="intel-panel-title">Top Stories</span>
                <span className="intel-panel-link">More ›</span>
              </div>
              {SIDEBAR_ARTICLES.map((a) => (
                <div key={a.title} className="article-list-item" onClick={goReport} role="link" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && goReport()}>
                  <img className="article-thumb" src={a.img} alt="" />
                  <div>
                    <div className="article-info-title">{a.title}</div>
                    <div className="article-info-meta">{a.meta}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="intel-panel">
              <div className="intel-panel-header">
                <span className="intel-panel-title">Your Selection</span>
                <span className="intel-panel-link">Customize ›</span>
              </div>
              <div style={{ padding: "10px 0" }}>
                {[
                  ["ABUK", "EGP 100", "+5.0%", true],
                  ["NVDA", "$877.80", "+2.3%", true],
                  ["CF", "$28.00", "−5.0%", false],
                ].map(([sym, px, ch, pos]) => (
                  <div
                    key={String(sym)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 14px",
                      borderBottom: sym !== "CF" ? "1px solid var(--border-light)" : undefined,
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", fontWeight: 700, color: "var(--accent)" }}>{sym}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600 }}>{px}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: pos ? "var(--green)" : "var(--red)" }}>
                      {pos ? "▲" : "▼"} {ch}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="section-header">
          <span className="section-title">Market Overview</span>
          <span className="section-link">Full Terminal →</span>
        </div>

        <div className="market-table-section">
          <div className="market-table-header">
            <div className="market-table-title">Live Commodity Prices</div>
            <div className="table-tabs">
              {TABLE_TABS.map((label, i) => (
                <div key={label} className={`ttab ${tableTab === i ? "active" : ""}`} onClick={() => setTableTab(i)} role="button" tabIndex={0}>
                  {label}
                </div>
              ))}
            </div>
          </div>
          <table className="market-tbl">
            <thead>
              <tr>
                <th>Asset</th>
                <th className="r">Last Price</th>
                <th className="r">Low / High</th>
                <th className="r">Weekly Adj.</th>
                <th className="r">Institutional Flow</th>
                <th className="r">Trend</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "7px", background: "var(--amber-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                      🛢️
                    </div>
                    <div>
                      <div className="tbl-name">Brent Crude Oil</div>
                      <div className="tbl-sub">USD per barrel</div>
                    </div>
                  </div>
                </td>
                <td className="r">
                  <span className="tbl-price">$85.45</span>
                </td>
                <td className="r" style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", color: "var(--text-muted)" }}>
                  82.10 – 87.20
                </td>
                <td className="r">
                  <span className="chg-pos">▲ +1.34%</span>
                </td>
                <td className="r">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end" }}>
                    <div className="mini-bar" style={{ width: "60px" }}>
                      <div className="mini-bar-fill" style={{ width: "70%", background: "var(--green)" }} />
                    </div>
                    <span style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--green)" }}>Buying</span>
                  </div>
                </td>
                <td className="r" style={{ fontSize: "12px", color: "var(--green)", fontWeight: 600 }}>
                  Bullish
                </td>
                <td>
                  <span style={{ fontSize: "14px", cursor: "pointer", color: "var(--accent)" }}>+</span>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "7px", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                      🔥
                    </div>
                    <div>
                      <div className="tbl-name">Natural Gas</div>
                      <div className="tbl-sub">USD per MMBtu</div>
                    </div>
                  </div>
                </td>
                <td className="r">
                  <span className="tbl-price">$2.143</span>
                </td>
                <td className="r" style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", color: "var(--text-muted)" }}>
                  1.98 – 2.21
                </td>
                <td className="r">
                  <span className="chg-neg">▼ −2.18%</span>
                </td>
                <td className="r">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end" }}>
                    <div className="mini-bar" style={{ width: "60px" }}>
                      <div className="mini-bar-fill" style={{ width: "30%", background: "var(--red)" }} />
                    </div>
                    <span style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--red)" }}>Distribution</span>
                  </div>
                </td>
                <td className="r" style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                  Neutral
                </td>
                <td>
                  <span style={{ fontSize: "14px", cursor: "pointer", color: "var(--accent)" }}>+</span>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "7px", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                      🌿
                    </div>
                    <div>
                      <div className="tbl-name">EU Carbon Permits</div>
                      <div className="tbl-sub">EUR per tonne</div>
                    </div>
                  </div>
                </td>
                <td className="r">
                  <span className="tbl-price">€56.12</span>
                </td>
                <td className="r" style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px", color: "var(--text-muted)" }}>
                  54.40 – 58.00
                </td>
                <td className="r">
                  <span className="chg-pos">▲ +0.43%</span>
                </td>
                <td className="r">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end" }}>
                    <div className="mini-bar" style={{ width: "60px" }}>
                      <div className="mini-bar-fill" style={{ width: "55%", background: "var(--accent-mid)" }} />
                    </div>
                    <span style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--accent)" }}>Accumulation</span>
                  </div>
                </td>
                <td className="r" style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>
                  Bullish
                </td>
                <td>
                  <span style={{ fontSize: "14px", cursor: "pointer", color: "var(--accent)" }}>+</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="section-header">
          <span className="section-title">Top Brokers</span>
          <span className="section-link">View All →</span>
        </div>

        <div className="quick-grid">
          {[
            { title: "Interactive Brokers", desc: "Global access to equities, options, futures, forex, bonds and funds from a single platform.", icon: "leaf", bg: "var(--accent-light)", c: "var(--accent)" },
            { title: "TD Ameritrade", desc: "Advanced trading tools, real-time data, and comprehensive research in one platform.", icon: "activity", bg: "var(--green-light)", c: "var(--green)" },
            { title: "Fidelity Capital", desc: "Zero-fee index funds with institutional-grade research and portfolio analytics.", icon: "briefcase", bg: "var(--amber-light)", c: "var(--amber)" },
            { title: "Larissa Niemi", desc: "Emerging market specialist with AI-driven portfolio construction and risk overlay.", icon: "users", bg: "var(--purple-light)", c: "var(--purple)" },
          ].map((card) => (
            <div key={card.title} className="quick-card">
              <div className="quick-icon" style={{ background: card.bg, color: card.c }}>
                {card.icon === "leaf" && (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22V12M12 12C12 7 17 4 17 4M12 12C12 7 7 4 7 4" />
                  </svg>
                )}
                {card.icon === "activity" && (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                )}
                {card.icon === "briefcase" && (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                )}
                {card.icon === "users" && (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )}
              </div>
              <div className="quick-title">{card.title}</div>
              <div className="quick-desc">{card.desc}</div>
              <div className="quick-arrow">Open Account →</div>
            </div>
          ))}
        </div>

        <div className="bottom-grid">
          <div className="trending-panel">
            <div className="trending-panel-hdr">
              <div className="trending-panel-title">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Top Trending
              </div>
              <span className="section-link" style={{ fontSize: "11.5px" }}>
                All →
              </span>
            </div>
            {[
              { r: "1", sym: "ABUK", name: "Abu Qir Fertilizers", price: "EGP 100", pos: true, ch: "+5.0%", bg: undefined },
              { r: "2", sym: "NVDA", name: "NVIDIA Corp", price: "$877.80", pos: true, ch: "+2.3%", bg: "var(--green)" },
              { r: "3", sym: "TSLA", name: "Tesla Inc", price: "$170.18", pos: false, ch: "−3.2%", bg: "var(--red)" },
              { r: "4", sym: "MU", name: "Micron Technology", price: "$414.43", pos: true, ch: "+1.8%", bg: "var(--amber)" },
              { r: "5", sym: "MSTR", name: "MicroStrategy", price: "$1,620", pos: false, ch: "−5.5%", bg: "var(--purple)" },
            ].map((t) => (
              <div key={t.sym} className="trending-item">
                <div className="trending-left">
                  <span className="trending-rank">{t.r}</span>
                  <span className="trending-ticker-badge" style={t.bg ? { background: t.bg } : undefined}>
                    {t.sym}
                  </span>
                  <span className="trending-name">{t.name}</span>
                </div>
                <div className="trending-right">
                  <div className="trending-price">{t.price}</div>
                  <div className={`trending-chg ${t.pos ? "pos" : "neg"}`}>
                    {t.pos ? "▲" : "▼"} {t.ch}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="webinar-panel">
            <div className="webinar-panel-hdr">
              <div className="webinar-panel-title">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ verticalAlign: "middle", marginRight: "6px" }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Upcoming Webinars
              </div>
              <span className="section-link" style={{ fontSize: "11.5px" }}>
                All →
              </span>
            </div>
            <div className="webinar-item">
              <div className="webinar-date-badge">
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                May 30, 2025 · 2:00 PM EST
              </div>
              <div className="webinar-title">From Beginner to Pro: Navigating markets with Investing.com Pro</div>
              <div className="webinar-meta">
                <span>📍 Live Webinar</span>
                <span>·</span>
                <span>Free</span>
              </div>
              <div className="webinar-register">Register Now →</div>
            </div>
            <div className="webinar-item">
              <div className="webinar-date-badge">
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                June 12, 2025 · 10:00 AM EST
              </div>
              <div className="webinar-title">Global Fertilizer Market Outlook: Q3 2025 Supply &amp; Demand Analysis</div>
              <div className="webinar-meta">
                <span>📍 Live Webinar</span>
                <span>·</span>
                <span>Pro Members</span>
              </div>
              <div className="webinar-register">Register Now →</div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            Market <span>Neurons</span> · 2025
          </div>
          <div className="footer-links">
            <span className="footer-link">Terms of Service</span>
            <span className="footer-link">Privacy Policy</span>
            <span className="footer-link">API Documentation</span>
            <span className="footer-link">Support</span>
          </div>
          <div className="footer-copy">© 2025 LogicTrade AI. Intelligence-grade Investors only.</div>
        </div>
      </footer>
    </>
  );
}
