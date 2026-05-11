"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CHART_X_LABELS,
  CROP_BG,
  CROP_ICONS,
  countryData,
  cropData,
  FLAG,
  PRICE_DATA,
  ROUTES,
  ROWS_PER_PAGE,
  stocksData,
} from "./fertilizersData";
import { ROUTE_DETAILS } from "./routeDetails";
import type { CountryRow, CropRow, Route, RouteCategory, Stock } from "./types";
import { DEFAULT_LEAF_ID, LEAF_META, expandStateForLeaf } from "./sidebarNav";
import "./fertilizers.css";

const FILTER_HOME = ["Egypt", "United States", "Brazil", "India", "China"] as const;
const FILTER_EXPORT = ["Europe", "Asia Pacific", "Middle East", "Americas", "Africa"] as const;
const FILTER_EXCHANGE = ["NASDAQ", "NYSE", "LSE", "EGX"] as const;

type MainTab = "fertilizers" | "market-profile" | "production";
type SubTab = "crop-market" | "country-data";
type CountryFilter = "all" | "importer" | "exporter";

const STOCK_KEYS: (keyof Stock)[] = ["symbol", "price", "change", "mktCap", "ranking", "exposure"];
const CROP_KEYS: (keyof CropRow)[] = ["crop", "consumption", "price", "change", "ureaRatio"];
const COUNTRY_KEYS: (keyof CountryRow)[] = ["country", "production", "consumption", "imports", "exports"];

const SearchIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

function sortByKey<T>(rows: T[], col: number, keys: (keyof T)[], dirs: Record<number, "asc" | "desc">): T[] {
  const asc = dirs[col] === "asc";
  const key = keys[col];
  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === "string" && typeof bv === "string") {
      const c = av.localeCompare(bv);
      return asc ? c : -c;
    }
    const n = Number(av) - Number(bv);
    return asc ? n : -n;
  });
}

/** Same control flow as `renderPagination` in fertilizers.html. */
function renderPaginationItems(currentPage: number, totalPages: number): (number | "dots")[] {
  const out: (number | "dots")[] = [];
  if (totalPages <= 6) {
    for (let p = 1; p <= totalPages; p++) out.push(p);
    return out;
  }
  for (let p = 1; p <= totalPages; p++) {
    if (totalPages > 6 && p > 2 && p < totalPages - 1 && Math.abs(p - currentPage) > 1) {
      if (p === 3 || p === totalPages - 2) out.push("dots");
      continue;
    }
    out.push(p);
  }
  return out;
}

function drawPriceChartStatic(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  data: number[],
  pad: { top: number; right: number; bottom: number; left: number },
  cw: number,
  ch: number,
  minV: number,
  maxV: number,
  xOf: (i: number) => number,
  yOf: (v: number) => number,
  grad: CanvasGradient,
) {
  ctx.strokeStyle = "rgba(8,48,107,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (ch / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cw, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(122,155,184,0.85)";
  ctx.font = "10px DM Mono, monospace";
  ctx.textAlign = "right";
  for (const v of [750, 700, 650, 600, 550, 500, 450, 400, 350]) {
    if (v >= minV && v <= maxV) {
      const y = yOf(v);
      if (y > pad.top + 6 && y < H - pad.bottom - 4) ctx.fillText(String(v), W - 5, y + 4);
    }
  }
  ctx.beginPath();
  ctx.moveTo(xOf(0), yOf(data[0]));
  for (let i = 1; i < data.length; i++) ctx.lineTo(xOf(i), yOf(data[i]));
  ctx.lineTo(xOf(data.length - 1), H - pad.bottom);
  ctx.lineTo(xOf(0), H - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(xOf(0), yOf(data[0]));
  for (let i = 1; i < data.length; i++) ctx.lineTo(xOf(i), yOf(data[i]));
  ctx.strokeStyle = "#08306B";
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.stroke();
  const lastX = xOf(data.length - 1);
  const lastY = yOf(data[data.length - 1]);
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#08306B";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(lastX, lastY, 7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(8,48,107,0.15)";
  ctx.fill();
}

export default function FertilizersPage() {
  const [mainTab, setMainTab] = useState<MainTab>("fertilizers");
  const [subTab, setSubTab] = useState<SubTab>("crop-market");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [mobileActive, setMobileActive] = useState("stocks");
  const [timeRange, setTimeRange] = useState("1Y");
  const [stocksQuery, setStocksQuery] = useState("");
  const [stocksSortCol, setStocksSortCol] = useState<number | null>(null);
  const [stocksSortDir, setStocksSortDir] = useState<Record<number, "asc" | "desc">>({});
  const [cropQuery, setCropQuery] = useState("");
  const [cropSortCol, setCropSortCol] = useState<number | null>(null);
  const [cropSortDir, setCropSortDir] = useState<Record<number, "asc" | "desc">>({});
  const [selectedCrop, setSelectedCrop] = useState<CropRow | null>(null);
  const [countryQuery, setCountryQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState<CountryFilter>("all");
  const [countrySortCol, setCountrySortCol] = useState<number | null>(null);
  const [countrySortDir, setCountrySortDir] = useState<Record<number, "asc" | "desc">>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [routeFilter, setRouteFilter] = useState<RouteCategory>("natural-gas");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const [sb, setSb] = useState({
    nitrogen: true,
    urea: true,
    ammonia: false,
    uan: false,
    phosphates: false,
    potash: false,
  });
  const [selectedLeafId, setSelectedLeafId] = useState(DEFAULT_LEAF_ID);
  const [homeCountry, setHomeCountry] = useState<string>(FILTER_HOME[0]);
  const [exportMarket, setExportMarket] = useState<string>(FILTER_EXPORT[0]);
  const [exchange, setExchange] = useState<string>(FILTER_EXCHANGE[0]);

  const selectLeaf = useCallback((id: string) => {
    setSelectedLeafId(id);
    setSb((s) => ({ ...s, ...expandStateForLeaf(id) }));
  }, []);

  const navMeta = LEAF_META[selectedLeafId] ?? LEAF_META[DEFAULT_LEAF_ID];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartWrapRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const gradRef = useRef<CanvasGradient | null>(null);

  const stocks = useMemo(() => {
    const base = stocksData.filter((r) => r.symbol.toLowerCase().includes(stocksQuery.toLowerCase()));
    if (stocksSortCol === null) return base;
    return sortByKey(base, stocksSortCol, STOCK_KEYS, stocksSortDir);
  }, [stocksQuery, stocksSortCol, stocksSortDir]);

  const crops = useMemo(() => {
    const base = cropData.filter((r) => r.crop.toLowerCase().includes(cropQuery.toLowerCase()));
    if (cropSortCol === null) return base;
    return sortByKey(base, cropSortCol, CROP_KEYS, cropSortDir);
  }, [cropQuery, cropSortCol, cropSortDir]);

  const maxCropCons = useMemo(() => Math.max(...crops.map((r) => r.consumption), 1), [crops]);

  const countriesFiltered = useMemo(() => {
    let rows = countryData.filter((r) => r.country.toLowerCase().includes(countryQuery.toLowerCase()));
    if (countryFilter === "importer") rows = rows.filter((r) => r.imports > r.exports);
    if (countryFilter === "exporter") rows = rows.filter((r) => r.exports > r.imports);
    if (countrySortCol !== null) rows = sortByKey(rows, countrySortCol, COUNTRY_KEYS, countrySortDir);
    return rows;
  }, [countryFilter, countryQuery, countrySortCol, countrySortDir]);

  const maxProd = useMemo(
    () => Math.max(...countriesFiltered.map((r) => r.production), 1),
    [countriesFiltered],
  );

  const pageCountries = useMemo(
    () => countriesFiltered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE),
    [countriesFiltered, currentPage],
  );

  const totalPages = Math.max(1, Math.ceil(countriesFiltered.length / ROWS_PER_PAGE));
  const pageItems = useMemo(
    () => renderPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const routes = useMemo(() => ROUTES.filter((r) => r.category === routeFilter), [routeFilter]);

  useEffect(() => setCurrentPage(1), [countryFilter, countryQuery]);
  useEffect(() => setSelectedCrop(null), [cropQuery]);

  const commitChart = useCallback(
    (hover?: { mx: number; my: number }) => {
      const canvas = canvasRef.current;
      const wrap = chartWrapRef.current;
      if (!canvas || !wrap) return;
      const dpr = window.devicePixelRatio || 1;
      const W = wrap.clientWidth || 360;
      const H = 160;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const pad = { top: 12, right: 36, bottom: 10, left: 10 };
      const cw = W - pad.left - pad.right;
      const ch = H - pad.top - pad.bottom;
      const data = PRICE_DATA;
      const minV = Math.min(...data) - 20;
      const maxV = Math.max(...data) + 20;
      const xOf = (i: number) => pad.left + (i / (data.length - 1)) * cw;
      const yOf = (v: number) => pad.top + ch - ((v - minV) / (maxV - minV)) * ch;
      let grad = gradRef.current;
      if (!grad) {
        grad = ctx.createLinearGradient(0, pad.top, 0, H);
        grad.addColorStop(0, "rgba(8,48,107,0.15)");
        grad.addColorStop(1, "rgba(8,48,107,0.01)");
        gradRef.current = grad;
      }
      ctx.clearRect(0, 0, W, H);
      drawPriceChartStatic(ctx, W, H, data, pad, cw, ch, minV, maxV, xOf, yOf, grad);

      const tooltip = tooltipRef.current;
      if (hover === undefined) {
        if (tooltip) tooltip.style.opacity = "0";
      } else {
        const idx = Math.round(((hover.mx - pad.left) / cw) * (data.length - 1));
        if (idx >= 0 && idx < data.length) {
          const val = data[idx];
          const x = xOf(idx);
          const y = yOf(val);
          ctx.save();
          ctx.strokeStyle = "rgba(8,48,107,0.3)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(x, pad.top);
          ctx.lineTo(x, H - pad.bottom);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(pad.left, y);
          ctx.lineTo(pad.left + cw, y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = "#08306B";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(8,48,107,0.18)";
          ctx.fill();
          if (tooltip) {
            tooltip.style.opacity = "1";
            tooltip.style.left = `${Math.min(Math.max(x, 40), W - 40)}px`;
            tooltip.style.top = `${Math.max(y - 42, 5)}px`;
            tooltip.textContent = `$${val.toFixed(2)}`;
          }
        } else if (tooltip) tooltip.style.opacity = "0";
      }
    },
    [],
  );

  useEffect(() => {
    gradRef.current = null;
    commitChart();
    const onResize = () => {
      gradRef.current = null;
      commitChart();
      if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
    };
    window.addEventListener("resize", onResize);
    const t = window.setTimeout(() => {
      gradRef.current = null;
      commitChart();
    }, 150);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, [commitChart]);

  const onChartMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const wrap = chartWrapRef.current;
    if (!canvas || !wrap) return;
    const rect = canvas.getBoundingClientRect();
    commitChart({ mx: e.clientX - rect.left, my: e.clientY - rect.top });
  };

  const onChartLeave = () => {
    const tooltip = tooltipRef.current;
    if (tooltip) tooltip.style.opacity = "0";
    gradRef.current = null;
    commitChart();
  };

  const selectMobileTab = (tab: MainTab, key: string) => {
    setMainTab(tab);
    setMobileActive(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rightSoilText =
    selectedRoute && ROUTE_DETAILS[selectedRoute.id]
      ? ROUTE_DETAILS[selectedRoute.id].soilUse
      : 'Select a production route from "Production Inputs / Process" tab to see soil recommendations.';

  const detail = selectedRoute ? ROUTE_DETAILS[selectedRoute.id] : null;

  const toggleStockSort = (col: number) => {
    setStocksSortCol(col);
    setStocksSortDir((d) => ({ ...d, [col]: d[col] === "asc" ? "desc" : "asc" }));
  };

  const toggleCropSort = (col: number) => {
    setCropSortCol(col);
    setCropSortDir((d) => ({ ...d, [col]: d[col] === "asc" ? "desc" : "asc" }));
  };

  const toggleCountrySort = (col: number) => {
    setCountrySortCol(col);
    setCountrySortDir((d) => ({ ...d, [col]: d[col] === "asc" ? "desc" : "asc" }));
  };

  const cropDetailCols: { title: string; key: keyof Pick<CropRow, "topConsumers" | "topProducers" | "topExporters" | "topImporters"> }[] = [
    { title: "Top Consumers", key: "topConsumers" },
    { title: "Top Producers", key: "topProducers" },
    { title: "Top Exporters", key: "topExporters" },
    { title: "Top Importers", key: "topImporters" },
  ];

  return (
    <>
      <div className={`drawer-overlay ${drawerOpen ? "visible" : ""}`} onClick={() => setDrawerOpen(false)} />
      <nav className="navbar">
        <a className="logo" href="#" onClick={(e) => e.preventDefault()}>
          <div className="logo-icon">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="logo-text">
              Market <span>Neurons</span>
            </div>
            <div className="logo-tagline">Commodity Intelligence</div>
          </div>
        </a>

        <div className="search-wrap">
          <SearchIcon />
          <input className="search-input" type="text" placeholder="Search markets, tickers, reports…" />
          <span className="search-hint">⌘K</span>
        </div>

        <div className="nav-actions">
          <button type="button" className="hamburger-btn" aria-label="Open Menu" onClick={() => setDrawerOpen((v) => !v)}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <button type="button" className="icon-btn" aria-label="Notifications">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notif-dot" />
          </button>
          <button type="button" className="icon-btn" aria-label="Live Feed">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            </svg>
          </button>
          <button type="button" className="icon-btn" aria-label="Help">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </button>

          <div className="nav-divider" />

          <button type="button" className="export-btn">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Data
          </button>

          <div className="profile-pill">
            <div className="avatar">IT</div>
            <div>
              <div className="profile-name">Institutional Trader</div>
              <div className="profile-role">Terminal v4.2</div>
            </div>
          </div>
        </div>
      </nav>

      <div className="app-body">
        <aside className={`sidebar ${drawerOpen ? "open" : ""}`}>
          <div className="sidebar-section-header">Sector</div>
          <div className="sidebar-category-badge">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 22V12M12 12C12 7 17 4 17 4M12 12C12 7 7 4 7 4" />
            </svg>
            Fertilizers
          </div>

          <div className="sidebar-group">
            <div
              className={`sidebar-parent ${sb.nitrogen ? "open" : ""}`}
              onClick={() => setSb((s) => ({ ...s, nitrogen: !s.nitrogen }))}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSb((s) => ({ ...s, nitrogen: !s.nitrogen })))}
              role="button"
              tabIndex={0}
            >
              <div className="sidebar-parent-label">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2v20M2 12h20" />
                </svg>
                Nitrogen
              </div>
              <svg className="sidebar-chevron" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <div className={`sidebar-children ${sb.nitrogen ? "open" : ""}`}>
              <div className="sidebar-children-inner">
                <div
                  className={`sidebar-parent ${sb.urea ? "open" : ""}`}
                  style={{ fontSize: "12.5px", fontWeight: 500, paddingLeft: "28px", color: "var(--text-secondary)" }}
                  onClick={() => setSb((s) => ({ ...s, urea: !s.urea }))}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSb((s) => ({ ...s, urea: !s.urea })))}
                  role="button"
                  tabIndex={0}
                >
                  <div className="sidebar-parent-label">Urea</div>
                  <svg className="sidebar-chevron" style={{ width: "12px", height: "12px" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <div className={`sidebar-children ${sb.urea ? "open" : ""}`}>
                  <div className="sidebar-children-inner">
                    {(
                      [
                        ["granular-urea", "Granular urea"],
                        ["prilled-urea", "Prilled urea"],
                        ["sulfur-coated-urea", "Sulfur-coated urea"],
                        ["polymer-coated-urea", "Polymer-coated urea"],
                        ["urease-inhibitor-urea", "Urease inhibitor urea"],
                        ["liquid-urea", "Liquid Urea"],
                        ["industrial-urea", "Industrial Urea"],
                      ] as const
                    ).map(([id, label]) => (
                      <button key={id} type="button" className={`sidebar-item ${selectedLeafId === id ? "active" : ""}`} onClick={() => selectLeaf(id)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`sidebar-parent ${sb.ammonia ? "open" : ""}`}
                  style={{ fontSize: "12.5px", fontWeight: 500, paddingLeft: "28px", color: "var(--text-secondary)" }}
                  onClick={() => setSb((s) => ({ ...s, ammonia: !s.ammonia }))}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSb((s) => ({ ...s, ammonia: !s.ammonia })))}
                  role="button"
                  tabIndex={0}
                >
                  <div className="sidebar-parent-label">Ammonia</div>
                  <svg className="sidebar-chevron" style={{ width: "12px", height: "12px" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <div className={`sidebar-children ${sb.ammonia ? "open" : ""}`}>
                  <div className="sidebar-children-inner">
                    {(
                      [
                        ["ammonium-nitrate", "Ammonium Nitrate"],
                        ["ammonia-product", "Ammonia"],
                        ["ammonium-sulphate", "Ammonium Sulphate"],
                        ["calcium-ammonium-nitrate", "Calcium Ammonium Nitrate"],
                      ] as const
                    ).map(([id, label]) => (
                      <button key={id} type="button" className={`sidebar-item ${selectedLeafId === id ? "active" : ""}`} onClick={() => selectLeaf(id)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`sidebar-parent ${sb.uan ? "open" : ""}`}
                  style={{ fontSize: "12.5px", fontWeight: 500, paddingLeft: "28px", color: "var(--text-secondary)" }}
                  onClick={() => setSb((s) => ({ ...s, uan: !s.uan }))}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSb((s) => ({ ...s, uan: !s.uan })))}
                  role="button"
                  tabIndex={0}
                >
                  <div className="sidebar-parent-label">UAN</div>
                  <svg className="sidebar-chevron" style={{ width: "12px", height: "12px" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <div className={`sidebar-children ${sb.uan ? "open" : ""}`}>
                  <div className="sidebar-children-inner">
                    {(
                      [
                        ["uan-28", "UAN 28%"],
                        ["uan-32", "UAN 32%"],
                        ["liquid-uan", "Liquid UAN"],
                      ] as const
                    ).map(([id, label]) => (
                      <button key={id} type="button" className={`sidebar-item ${selectedLeafId === id ? "active" : ""}`} onClick={() => selectLeaf(id)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-group">
            <div
              className={`sidebar-parent ${sb.phosphates ? "open" : ""}`}
              onClick={() => setSb((s) => ({ ...s, phosphates: !s.phosphates }))}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSb((s) => ({ ...s, phosphates: !s.phosphates })))}
              role="button"
              tabIndex={0}
            >
              <div className="sidebar-parent-label">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Phosphates
              </div>
              <svg className="sidebar-chevron" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <div className={`sidebar-children ${sb.phosphates ? "open" : ""}`}>
              <div className="sidebar-children-inner">
                {(
                  [
                    ["phosphate-rocks", "Phosphate Rocks"],
                    ["diammonium-phosphate", "Diammonium Phosphate"],
                    ["monoammonium-phosphate", "Monoammonium Phosphate"],
                    ["single-superphosphate", "Single Superphosphate"],
                    ["triple-superphosphate", "Triple Superphosphate"],
                  ] as const
                ).map(([id, label]) => (
                  <button key={id} type="button" className={`sidebar-item ${selectedLeafId === id ? "active" : ""}`} onClick={() => selectLeaf(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar-group">
            <div
              className={`sidebar-parent ${sb.potash ? "open" : ""}`}
              onClick={() => setSb((s) => ({ ...s, potash: !s.potash }))}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSb((s) => ({ ...s, potash: !s.potash })))}
              role="button"
              tabIndex={0}
            >
              <div className="sidebar-parent-label">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                Potash
              </div>
              <svg className="sidebar-chevron" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <div className={`sidebar-children ${sb.potash ? "open" : ""}`}>
              <div className="sidebar-children-inner">
                {(
                  [
                    ["muriate-of-potash", "Muriate of Potash"],
                    ["sulfate-of-potash", "Sulfate of Potash"],
                    ["potassium-nitrate", "Potassium Nitrate"],
                  ] as const
                ).map(([id, label]) => (
                  <button key={id} type="button" className={`sidebar-item ${selectedLeafId === id ? "active" : ""}`} onClick={() => selectLeaf(id)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="main-inner">
            <div className="content">
              <div className="page-header">
                <div className="page-header-left">
                  <div className="breadcrumb">
                    <span>Commodities</span>
                    {navMeta.crumbs.map((seg, i) => (
                      <Fragment key={`${seg}-${i}`}>
                        <span className="bc-sep">›</span>
                        {i < navMeta.crumbs.length - 1 ? (
                          <span>{seg}</span>
                        ) : (
                          <span style={{ color: "var(--accent)", fontWeight: 600 }}>{seg}</span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                  <h1 className="page-title">{navMeta.title}</h1>
                  <div className="page-meta-row">
                    <span className="page-badge n46">{navMeta.badge}</span>
                    <span className="page-badge live">
                      <span className="live-dot" /> Live Data
                    </span>
                  </div>
                </div>
              </div>

              <div className="main-tabs">
                <div className={`main-tab ${mainTab === "fertilizers" ? "active" : ""}`} onClick={() => setMainTab("fertilizers")}>
                  Fertilizers Stocks
                </div>
                <div className={`main-tab ${mainTab === "market-profile" ? "active" : ""}`} onClick={() => setMainTab("market-profile")}>
                  Market Profile
                </div>
                <div className={`main-tab ${mainTab === "production" ? "active" : ""}`} onClick={() => setMainTab("production")}>
                  Production Inputs / Process
                </div>
              </div>

              <div id="tab-fertilizers" className={`tab-panel ${mainTab === "fertilizers" ? "active" : ""}`}>
                <div className="filters-row">
                  <div className="filter-group">
                    <label className="filter-label" htmlFor="filter-home">
                      Home country
                    </label>
                    <div className="filter-select-shell">
                      <select
                        id="filter-home"
                        className="filter-select-native"
                        value={homeCountry}
                        onChange={(e) => setHomeCountry(e.target.value)}
                      >
                        {FILTER_HOME.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <svg className="filter-select-chevron" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                  <div className="filter-group">
                    <label className="filter-label" htmlFor="filter-export">
                      Export market
                    </label>
                    <div className="filter-select-shell">
                      <select
                        id="filter-export"
                        className="filter-select-native"
                        value={exportMarket}
                        onChange={(e) => setExportMarket(e.target.value)}
                      >
                        {FILTER_EXPORT.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <svg className="filter-select-chevron" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                  <div className="filter-group">
                    <label className="filter-label" htmlFor="filter-exchange">
                      Exchange
                    </label>
                    <div className="filter-select-shell">
                      <select
                        id="filter-exchange"
                        className="filter-select-native"
                        value={exchange}
                        onChange={(e) => setExchange(e.target.value)}
                      >
                        {FILTER_EXCHANGE.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <svg className="filter-select-chevron" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                  <div className="search-mini" style={{ marginLeft: "auto" }}>
                    <SearchIcon />
                    <input value={stocksQuery} onChange={(e) => setStocksQuery(e.target.value)} placeholder="Search stocks…" />
                  </div>
                </div>
                <div className="table-outer">
                  <div className="table-wrap">
                    <table id="stocks-table">
                      <thead>
                        <tr>
                          <th onClick={() => toggleStockSort(0)}>
                            Symbol <span className="sort-icon">↕</span>
                          </th>
                          <th className="num" onClick={() => toggleStockSort(1)}>
                            Price <span className="sort-icon">↕</span>
                          </th>
                          <th className="num" onClick={() => toggleStockSort(2)}>
                            Change % <span className="sort-icon">↕</span>
                          </th>
                          <th className="num" onClick={() => toggleStockSort(3)}>
                            Mkt Cap BN <span className="sort-icon">↕</span>
                          </th>
                          <th className="num" onClick={() => toggleStockSort(4)}>
                            Ranking / 100 <span className="sort-icon">↕</span>
                          </th>
                          <th className="num" onClick={() => toggleStockSort(5)}>
                            Exposure <span className="sort-icon">↕</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody id="stocks-tbody">
                        {stocks.map((row, idx) => (
                          <tr key={`${row.symbol}-${idx}`}>
                            <td>
                              <span className="ticker-badge">{row.symbol}</span>
                            </td>
                            <td className="num">
                              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{row.price}</span>
                            </td>
                            <td className="num">
                              {row.change >= 0 ? (
                                <span className="change-pos">▲ {row.change}</span>
                              ) : (
                                <span className="change-neg">▼ {Math.abs(row.change)}</span>
                              )}
                            </td>
                            <td className="num">
                              <span style={{ fontFamily: "var(--font-mono)" }}>{row.mktCap}</span>
                            </td>
                            <td className="num">
                              <div className="ranking-bar-wrap">
                                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)" }}>{row.ranking}</span>
                                <div className="ranking-bar">
                                  <div className="ranking-bar-fill" style={{ width: `${row.ranking}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="num">
                              <span className="exposure-badge">{row.exposure}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div id="tab-market-profile" className={`tab-panel ${mainTab === "market-profile" ? "active" : ""}`}>
                <div className="sub-tabs-wrap">
                  <div className="sub-tabs" role="tablist" aria-label="Market profile view">
                    <div
                      className={`sub-tab ${subTab === "crop-market" ? "active" : ""}`}
                      onClick={() => setSubTab("crop-market")}
                      role="tab"
                      tabIndex={0}
                      aria-selected={subTab === "crop-market"}
                    >
                      <svg className="sub-tab-icon" fill="none" stroke="currentColor" strokeWidth="1.85" viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 22V12M12 12C12 7 17 4 17 4M12 12C12 7 7 4 7 4" />
                      </svg>
                      <span className="sub-tab-label">Crop Market</span>
                      <span className="sub-tab-badge">5</span>
                    </div>
                    <div
                      className={`sub-tab ${subTab === "country-data" ? "active" : ""}`}
                      onClick={() => setSubTab("country-data")}
                      role="tab"
                      tabIndex={0}
                      aria-selected={subTab === "country-data"}
                    >
                      <svg className="sub-tab-icon" fill="none" stroke="currentColor" strokeWidth="1.85" viewBox="0 0 24 24" aria-hidden>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <span className="sub-tab-label">Country Data</span>
                      <span className="sub-tab-badge">32</span>
                    </div>
                  </div>
                  <div className="search-mini">
                    <SearchIcon />
                    <input type="text" value={cropQuery} onChange={(e) => setCropQuery(e.target.value)} placeholder="Search crop…" />
                  </div>
                </div>

                <div id="sub-crop-market" className={`sub-panel ${subTab === "crop-market" ? "active" : ""}`}>
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Crop Market Overview</span>
                      <div className="card-meta">
                        <span className="live-dot" />
                        <span>Urea demand by crop</span>
                      </div>
                    </div>
                    <div className="table-wrap">
                      <table id="crop-table">
                        <thead>
                          <tr>
                            <th onClick={() => toggleCropSort(0)}>
                              Crop <span className="sort-icon">↕</span>
                            </th>
                            <th className="num" onClick={() => toggleCropSort(1)}>
                              Urea Consumption <span className="sort-icon">↕</span>
                            </th>
                            <th className="num" onClick={() => toggleCropSort(2)}>
                              Price / ton <span className="sort-icon">↕</span>
                            </th>
                            <th className="num" onClick={() => toggleCropSort(3)}>
                              Change % <span className="sort-icon">↕</span>
                            </th>
                            <th className="num" onClick={() => toggleCropSort(4)}>
                              Urea/Crop Price <span className="sort-icon">↕</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody id="crop-tbody">
                          {crops.map((row) => {
                            const pct = Math.round((row.consumption / maxCropCons) * 100);
                            return (
                              <tr
                                key={row.crop}
                                className={selectedCrop?.crop === row.crop ? "selected" : ""}
                                onClick={() => setSelectedCrop(row)}
                              >
                                <td>
                                  <div className="crop-name">
                                    <div className="crop-icon" style={{ background: CROP_BG[row.crop] }}>
                                      {CROP_ICONS[row.crop]}
                                    </div>
                                    {row.crop}
                                  </div>
                                </td>
                                <td className="num">
                                  <div className="prod-bar-wrap">
                                    {row.consumption}
                                    <div className="prod-bar">
                                      <div className="prod-bar-fill prod" style={{ width: `${pct}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="num">
                                  <span className="price-tag">${row.price}</span>
                                </td>
                                <td className="num">
                                  {row.change >= 0 ? (
                                    <span className="change-pos">▲ {row.change}%</span>
                                  ) : (
                                    <span className="change-neg">▼ {Math.abs(row.change)}%</span>
                                  )}
                                </td>
                                <td className="num">
                                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{row.ureaRatio}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div id="crop-detail-section" className={`crop-detail-section ${selectedCrop ? "active" : ""}`}>
                      <div className="crop-detail-title">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span id="selected-crop-name">
                          {selectedCrop
                            ? `${CROP_ICONS[selectedCrop.crop]} ${selectedCrop.crop} — Global Trade Data`
                            : "Select a crop above"}
                        </span>
                      </div>
                      {selectedCrop && (
                        <div className="crop-detail-grid" id="crop-detail-grid">
                          {cropDetailCols.map(({ title, key }) => (
                            <div className="detail-col" key={key}>
                              <div className="detail-col-header">{title}</div>
                              <div className="detail-items-list">
                                {selectedCrop[key].map((d, i) => (
                                  <div className="detail-item" key={`${d.c}-${i}`}>
                                    <div className="detail-item-country">
                                      <span>{FLAG[d.c] || "🌐"}</span>
                                      <span>{d.c}</span>
                                    </div>
                                    <div className="detail-item-value">{d.v}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div id="sub-country-data" className={`sub-panel ${subTab === "country-data" ? "active" : ""}`}>
                  <div className="card">
                    <div className="card-header">
                      <span className="card-title">Country Trade Data</span>
                      <div className="card-meta">
                        <span>Production · Consumption · Imports · Exports</span>
                      </div>
                    </div>
                    <div className="country-filter-row">
                      <div className={`filter-chip ${countryFilter === "all" ? "active" : ""}`} onClick={() => setCountryFilter("all")}>
                        All
                      </div>
                      <div
                        className={`filter-chip ${countryFilter === "importer" ? "active" : ""}`}
                        onClick={() => setCountryFilter("importer")}
                      >
                        Net Importers
                      </div>
                      <div
                        className={`filter-chip ${countryFilter === "exporter" ? "active" : ""}`}
                        onClick={() => setCountryFilter("exporter")}
                      >
                        Net Exporters
                      </div>
                      <div className="search-mini" style={{ marginLeft: "auto" }}>
                        <SearchIcon />
                        <input value={countryQuery} onChange={(e) => setCountryQuery(e.target.value)} placeholder="Search country…" />
                      </div>
                    </div>
                    <div className="table-wrap">
                      <table id="country-table">
                        <thead>
                          <tr>
                            <th onClick={() => toggleCountrySort(0)}>
                              Country <span className="sort-icon">↕</span>
                            </th>
                            <th className="num" onClick={() => toggleCountrySort(1)}>
                              Production <span className="sort-icon">↕</span>
                            </th>
                            <th className="num" onClick={() => toggleCountrySort(2)}>
                              Consumption <span className="sort-icon">↕</span>
                            </th>
                            <th className="num" onClick={() => toggleCountrySort(3)}>
                              Imports <span className="sort-icon">↕</span>
                            </th>
                            <th className="num" onClick={() => toggleCountrySort(4)}>
                              Exports <span className="sort-icon">↕</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody id="country-tbody">
                          {pageCountries.map((row, idx) => {
                            const pp = Math.round((row.production / maxProd) * 100);
                            const cp = Math.round((row.consumption / maxProd) * 100);
                            const ip = Math.round((row.imports / maxProd) * 100);
                            const ep = Math.round((row.exports / maxProd) * 100);
                            return (
                              <tr key={`${row.country}-${idx}`}>
                                <td>
                                  <span className="country-chip">
                                    <span>{FLAG[row.country] || "🌐"}</span>
                                    {row.country}
                                  </span>
                                </td>
                                <td className="num">
                                  <div className="prod-bar-wrap">
                                    {row.production}
                                    <div className="prod-bar">
                                      <div className="prod-bar-fill prod" style={{ width: `${pp}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="num">
                                  <div className="prod-bar-wrap">
                                    {row.consumption}
                                    <div className="prod-bar">
                                      <div className="prod-bar-fill cons" style={{ width: `${cp}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="num">
                                  <div className="prod-bar-wrap">
                                    {row.imports}
                                    <div className="prod-bar">
                                      <div className="prod-bar-fill imp" style={{ width: `${ip}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="num">
                                  <div className="prod-bar-wrap">
                                    {row.exports}
                                    <div className="prod-bar">
                                      <div className="prod-bar-fill exp" style={{ width: `${ep}%` }} />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="pagination-row">
                      <div className="page-info" id="page-info">
                        Showing{" "}
                        <strong>
                          {Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, countriesFiltered.length)}–
                          {Math.min(currentPage * ROWS_PER_PAGE, countriesFiltered.length)}
                        </strong>{" "}
                        of <strong>{countriesFiltered.length}</strong> countries
                      </div>
                      <div className="page-btns" id="page-btns">
                        <button
                          type="button"
                          className="page-btn"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          aria-label="Previous page"
                        >
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="15 18 9 12 15 6" />
                          </svg>
                        </button>
                        {pageItems.map((item, i) =>
                          item === "dots" ? (
                            <span key={`dots-${i}`} className="page-dots">
                              …
                            </span>
                          ) : (
                            <button
                              key={item}
                              type="button"
                              className={`page-btn ${currentPage === item ? "active" : ""}`}
                              onClick={() => setCurrentPage(item)}
                            >
                              {item}
                            </button>
                          ),
                        )}
                        <button
                          type="button"
                          className="page-btn"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          aria-label="Next page"
                        >
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="tab-production" className={`tab-panel ${mainTab === "production" ? "active" : ""}`}>
                <div className="prod-layout">
                  <div className="prod-left">
                    <div className="prod-section-title">Production Routes</div>
                    <div className="route-filter-row">
                      <div
                        className={`route-chip ${routeFilter === "natural-gas" ? "active" : ""}`}
                        onClick={() => {
                          setRouteFilter("natural-gas");
                          setSelectedRoute(null);
                        }}
                      >
                        <span className="route-chip-dot" style={{ background: "#08306B" }} />
                        Natural Gas
                      </div>
                      <div
                        className={`route-chip ${routeFilter === "coal" ? "active" : ""}`}
                        onClick={() => {
                          setRouteFilter("coal");
                          setSelectedRoute(null);
                        }}
                      >
                        <span className="route-chip-dot" style={{ background: "#374151" }} />
                        Coal
                      </div>
                      <div
                        className={`route-chip ${routeFilter === "green" ? "active" : ""}`}
                        onClick={() => {
                          setRouteFilter("green");
                          setSelectedRoute(null);
                        }}
                      >
                        <span className="route-chip-dot" style={{ background: "#0d7a5f" }} />
                        Green
                      </div>
                    </div>
                    <div className="route-cards" id="routeCards">
                      {routes.map((r) => (
                        <div
                          key={r.id}
                          className={`route-card ${selectedRoute?.id === r.id ? "active" : ""}`}
                          onClick={() => setSelectedRoute(r)}
                        >
                          {r.shortName || r.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="prod-right">
                    <div className="prod-section-title">Process Details</div>
                    <div className="output-panel">
                      {!detail ? (
                        <div className="output-empty" id="outputEmpty">
                          <div className="output-empty-icon">
                            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
                            </svg>
                          </div>
                          <h3>No Route Selected</h3>
                          <p>Select a production route above to view inputs and process details</p>
                        </div>
                      ) : (
                        selectedRoute && (
                          <div className="output-content visible" id="outputContent">
                            <div
                              className="output-header"
                              style={{
                                background: `linear-gradient(135deg,${detail.color} 0%,${detail.color}dd 100%)`,
                              }}
                            >
                              <div className="output-title">{detail.title}</div>
                              <div className="output-subtitle">{detail.subtitle}</div>
                            </div>
                            <div className="new-grid">
                              <div className="output-left">
                                <div className="input-block">
                                  <div
                                    className="input-block-title"
                                    style={{
                                      background: detail.color,
                                      color: "#fff",
                                      borderBottom: "1px solid rgba(255,255,255,0.12)",
                                    }}
                                  >
                                    Direct Inputs <span className="input-unit" style={{ color: "rgba(255,255,255,0.75)" }}>(per ton urea)</span>
                                  </div>
                                  <div className="data-list">
                                    {detail.inputs.direct.map((r) => (
                                      <div className="data-row" key={r.label}>
                                        <span className="data-label">{r.label}</span>
                                        <span className="data-value">{r.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="input-block">
                                  <div
                                    className="input-block-title"
                                    style={{
                                      background: detail.color,
                                      color: "#fff",
                                      borderBottom: "1px solid rgba(255,255,255,0.12)",
                                    }}
                                  >
                                    Ammonia Production Inputs
                                  </div>
                                  <div className="data-list">
                                    {detail.inputs.ammonia.map((r) => (
                                      <div className="data-row" key={r.label}>
                                        <span className="data-label">{r.label}</span>
                                        <span className="data-value">{r.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="input-block">
                                  <div
                                    className="input-block-title"
                                    style={{
                                      background: detail.color,
                                      color: "#fff",
                                      borderBottom: "1px solid rgba(255,255,255,0.12)",
                                    }}
                                  >
                                    Key Metrics{" "}
                                    <span className="input-unit" style={{ color: "rgba(255,255,255,0.75)", fontSize: "10px" }}>
                                      (per ton urea)
                                    </span>
                                  </div>
                                  <div className="data-list">
                                    {detail.inputs.totals.map((r) => (
                                      <div className="data-row" key={r.label}>
                                        <span className="data-label">{r.label}</span>
                                        <span className="data-value" style={{ color: detail.color }}>
                                          {r.value}
                                        </span>
                                      </div>
                                    ))}
                                    <div className="data-row">
                                      <span className="data-label">{detail.inputs.activeIngredient.name}</span>
                                      <span className="data-value" style={{ color: detail.color }}>
                                        {detail.inputs.activeIngredient.pct}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="output-right">
                                <div className="timeline-container">
                                  <div className="timeline-title" style={{ color: selectedRoute.color }}>
                                    <svg width="14" height="14" fill="none" stroke={selectedRoute.color} strokeWidth="2" viewBox="0 0 24 24">
                                      <rect x="2" y="4" width="20" height="16" rx="2" />
                                      <path d="M8 12h8M12 8v8" />
                                    </svg>
                                    Manufacturing Process
                                  </div>
                                  <div className="timeline">
                                    {detail.steps.map((s, i) => (
                                      <div className="timeline-step" key={s.title}>
                                        <div
                                          className="timeline-marker"
                                          style={{
                                            background: selectedRoute.color,
                                            color: "#fff",
                                            borderColor: selectedRoute.color,
                                          }}
                                        >
                                          {i + 1}
                                        </div>
                                        <div className="timeline-content">
                                          <div className="timeline-step-title">{s.title}</div>
                                          <div className="timeline-step-desc">{s.body}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="right-panel">
              <div
                className={`right-panel-toggle ${rightOpen ? "open" : ""}`}
                onClick={() => setRightOpen((v) => !v)}
              >
                <span>📊 Market Info &amp; Price Chart</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className={`right-panel-inner ${rightOpen ? "open" : ""}`}>
                <div>
                  <div className="panel-section-title">Commodity Overview</div>
                  <div className="commodity-name">Granular Urea</div>
                  <p className="commodity-desc">
                    Solid nitrogenous fertilizer produced through granulation of liquid urea. Primary nitrogen source for large-scale agriculture due to high nutrient density and favorable handling characteristics.
                  </p>
                </div>
                <div className="price-section">
                  <div className="chart-header">
                    <div>
                      <div className="chart-title">Urea Price (USD/T)</div>
                      <div className="chart-subtitle">1 Year · Daily</div>
                    </div>
                    <span className="chart-badge neg">▼ −0.36%</span>
                  </div>
                  <div className="price-info-row">
                    <span className="price-big">692.25</span>
                    <span className="price-change-small">−2.50</span>
                    <span className="price-label">USD / Ton</span>
                  </div>
                  <div className="line-chart-wrap" ref={chartWrapRef}>
                    <canvas
                      ref={canvasRef}
                      height={160}
                      style={{ display: "block", width: "100%", cursor: "crosshair" }}
                      onMouseMove={onChartMove}
                      onMouseLeave={onChartLeave}
                    />
                    <div ref={tooltipRef} className="chart-tooltip" style={{ opacity: 0, position: "absolute", top: 8, left: "50%" }} />
                  </div>
                  <div className="chart-x-labels" id="chartXLabels">
                    {CHART_X_LABELS.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                  <div className="chart-time-range">
                    {["1Y", "5Y", "All"].map((t) => (
                      <button key={t} type="button" className={`time-range-btn ${timeRange === t ? "active" : ""}`} onClick={() => setTimeRange(t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="soil-info-box" id="rightPanelSoilContext">
                  <div className="soil-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22V12M12 12C12 7 17 4 17 4M12 12C12 7 7 4 7 4" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="soil-info-title">Soil Use Context</div>
                    <div id="rightPanelSoilUseText" className="soil-info-text">
                      {rightSoilText}
                    </div>
                  </div>
                </div>
                <div className="stat-cards">
                  <div className="stat-card">
                    <div className="stat-card-label">Input Cost Index</div>
                    <div className="stat-card-value">114.2</div>
                    <div className="stat-change pos">▲ 2.1</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-label">Energy Delta</div>
                    <div className="stat-card-value">
                      −2.4<span className="unit">%</span>
                    </div>
                    <div className="stat-change neg">▼ 2.4%</div>
                  </div>
                </div>
                <div>
                  <div className="panel-section-title">Market Bulletin</div>
                  <div className="bulletin-list">
                    <div className="bulletin-item">
                      <div className="bulletin-headline">Black Sea export restrictions causing price volatility in Mediterranean markets.</div>
                      <div className="bulletin-meta">
                        <span>2 hours ago</span>
                        <span className="bulletin-dot">•</span>
                        <span className="bulletin-source">Reuters</span>
                      </div>
                    </div>
                    <div className="bulletin-item">
                      <div className="bulletin-headline">CF Industries reports record Q3 production efficiency in Louisiana plant.</div>
                      <div className="bulletin-meta">
                        <span>5 hours ago</span>
                        <span className="bulletin-dot">•</span>
                        <span className="bulletin-source">Bloomberg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <nav className="mobile-bottom-nav">
        <div className={`mobile-nav-item ${mobileActive === "stocks" ? "active" : ""}`} onClick={() => selectMobileTab("fertilizers", "stocks")}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          Stocks
        </div>
        <div className={`mobile-nav-item ${mobileActive === "market" ? "active" : ""}`} onClick={() => selectMobileTab("market-profile", "market")}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          Market
        </div>
        <div className={`mobile-nav-item ${mobileActive === "process" ? "active" : ""}`} onClick={() => selectMobileTab("production", "process")}>
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
          </svg>
          Process
        </div>
        <div
          className={`mobile-nav-item ${mobileActive === "info" ? "active" : ""}`}
          onClick={() => {
            setRightOpen(true);
            setMobileActive("info");
          }}
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Info
        </div>
      </nav>
    </>
  );
}
