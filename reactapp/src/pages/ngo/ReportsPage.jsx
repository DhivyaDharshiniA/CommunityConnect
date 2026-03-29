import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const token = () => localStorage.getItem("token");
const auth  = () => ({ headers: { Authorization: `Bearer ${token()}` } });
const get   = (url) => axios.get(`http://localhost:8080${url}`, auth());

/* ── Category config ─────────────────────────────────────────────────────── */
const CAT = {
  Environment: { color: "#0e7a5f", bg: "#f0faf6", border: "#c6e9dc" },
  Health:      { color: "#9b1c1c", bg: "#fff5f5", border: "#fecaca" },
  Education:   { color: "#1e3a8a", bg: "#eff6ff", border: "#bfdbfe" },
  Welfare:     { color: "#78350f", bg: "#fffbeb", border: "#fde68a" },
};
const catColor = (cat) => (CAT[cat]?.color || "#374151");
const catBg    = (cat) => (CAT[cat]?.bg    || "#f9fafb");
const catBord  = (cat) => (CAT[cat]?.border || "#e5e7eb");

/* ── Donut segment (SVG arc) ─────────────────────────────────────────────── */
function DonutChart({ segments, size = 120 }) {
  const r = 42, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
      {segments.map((seg, i) => {
        const pct  = seg.value / total;
        const dash = pct * circ;
        const gap  = circ - dash;
        const el = (
          <circle
            key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset * circ}
            strokeLinecap="butt"
            style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px", transition: "stroke-dasharray 0.8s ease" }}
          />
        );
        offset += pct;
        return el;
      })}
      <text x={cx} y={cy - 5} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fontFamily: "inherit", fill: "#111827" }}>
        {total}
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle" style={{ fontSize: 9, fill: "#9ca3af", fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        EVENTS
      </text>
    </svg>
  );
}

/* ── Inline bar ──────────────────────────────────────────────────────────── */
function Bar({ value, max, color = "#111827" }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ flex: 1, height: 4, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.7s ease" }} />
    </div>
  );
}

/* ── Divider ─────────────────────────────────────────────────────────────── */
const Divider = () => <div style={{ borderTop: "1px solid #f3f4f6" }} />;

/* ── Status chip ─────────────────────────────────────────────────────────── */
function Chip({ label, scheme }) {
  const schemes = {
    approved: { color: "#065f46", bg: "#ecfdf5", border: "#a7f3d0" },
    pending:  { color: "#78350f", bg: "#fffbeb", border: "#fde68a" },
    rejected: { color: "#7f1d1d", bg: "#fef2f2", border: "#fecaca" },
  };
  const s = schemes[scheme] || schemes.approved;
  return (
    <span style={{
      fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.03em",
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 6, padding: "2px 8px", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

/* ── Card ────────────────────────────────────────────────────────────────── */
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Card header ─────────────────────────────────────────────────────────── */
function CardHead({ title, sub, right }) {
  return (
    <div style={{ padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
      <div>
        <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>{title}</p>
        {sub && <p style={{ margin: "3px 0 0", fontSize: "0.72rem", color: "#6b7280" }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ── Spinner ─────────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 0", gap: 10 }}>
      <div style={{ width: 18, height: 18, border: "2px solid #e5e7eb", borderTopColor: "#111827", borderRadius: "50%", animation: "rp-spin 0.7s linear infinite" }} />
      <span style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 500 }}>Loading…</span>
    </div>
  );
}

/* ── Button ──────────────────────────────────────────────────────────────── */
function Btn({ children, onClick, variant = "ghost" }) {
  const [hov, setHov] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontSize: "0.75rem", fontWeight: 600, borderRadius: 8,
    padding: "7px 14px", cursor: "pointer", border: "none",
    fontFamily: "inherit", letterSpacing: "0.01em", transition: "all 0.15s",
  };
  const styles = {
    ghost:   { ...base, background: hov ? "#f9fafb" : "#fff", color: "#374151", border: "1px solid #e5e7eb" },
    primary: { ...base, background: hov ? "#111827" : "#1f2937", color: "#fff" },
  };
  return (
    <button style={styles[variant]} onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function ReportsPage({ onAction }) {
  const [events,      setEvents]      = useState([]);
  const [members,     setMembers]     = useState([]);
  const [requests,    setRequests]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sortField,   setSortField]   = useState("startDateTime");
  const [sortDir,     setSortDir]     = useState("desc");

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [evR, memR, reqR] = await Promise.allSettled([
        get("/api/events/all"),
        get("/api/membership/members"),
        get("/api/membership/my-requests"),
      ]);
      setEvents(evR.status   === "fulfilled" ? evR.value.data   || [] : []);
      setMembers(memR.status === "fulfilled" ? memR.value.data  || [] : []);
      setRequests(reqR.status === "fulfilled" ? reqR.value.data || [] : []);
      setLastUpdated(new Date());
    } catch {
      setError("Unable to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── derived ─────────────────────────────────────────────────────────── */
  const totalEvents   = events.length;
  const totalVols     = events.reduce((a, e) => a + (Number(e.noOfVol) || 0), 0);
  const avgVols       = totalEvents ? (totalVols / totalEvents).toFixed(1) : "—";
  const approvedReqs  = requests.filter(r => r.status === "APPROVED").length;
  const rejectedReqs  = requests.filter(r => r.status === "REJECTED").length;
  const pendingReqs   = requests.filter(r => r.status === "Pending").length;
  const approvalRate  = requests.length ? Math.round((approvedReqs / requests.length) * 100) : 0;
  const totalMembers  = members.length;

  const catCounts = ["Environment","Health","Education","Welfare"].map(c => ({
    cat: c, count: events.filter(e => e.category === c).length,
  }));
  const catDonutColors = { Environment:"#0e7a5f", Health:"#dc2626", Education:"#2563eb", Welfare:"#d97706" };

  const monthlyMap = {};
  events.forEach(e => {
    if (!e.startDateTime) return;
    const d = new Date(e.startDateTime);
    const k = d.toLocaleString("default", { month: "short", year: "2-digit" });
    monthlyMap[k] = (monthlyMap[k] || 0) + (Number(e.noOfVol) || 0);
  });
  const trend = Object.entries(monthlyMap)
    .sort((a, b) => new Date("1 " + a[0]) - new Date("1 " + b[0]))
    .slice(-6).map(([m, v]) => ({ m, v }));
  const maxTrend = Math.max(...trend.map(x => x.v), 1);

  const sortedEvents = [...events].sort((a, b) => {
    let va = a[sortField] || "", vb = b[sortField] || "";
    if (sortField === "noOfVol") { va = Number(va); vb = Number(vb); }
    if (sortField === "startDateTime") { va = new Date(va); vb = new Date(vb); }
    return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const handleSort = (f) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("asc"); }
  };

  const SortIcon = ({ field }) => (
    <span style={{ opacity: sortField === field ? 1 : 0.3, fontSize: "0.65rem", marginLeft: 3 }}>
      {sortField === field && sortDir === "desc" ? "↓" : "↑"}
    </span>
  );

  /* ── KPI data ─────────────────────────────────────────────────────────── */
  const kpis = [
    { label: "Total Events",          value: totalEvents,         sub: "All time" },
    { label: "Avg. Volunteers / Event",value: avgVols,            sub: "Based on noOfVol" },
    { label: "Active Members",        value: totalMembers,        sub: "Approved" },
    { label: "Approval Rate",         value: `${approvalRate}%`,  sub: `${approvedReqs} of ${requests.length} requests` },
    { label: "Pending Requests",      value: pendingReqs,         sub: "Awaiting review" },
    { label: "Rejected Requests",     value: rejectedReqs,        sub: "All time" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');
        @keyframes rp-spin    { to { transform: rotate(360deg); } }
        @keyframes rp-fade-up { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        .rp * { box-sizing: border-box; }
        .rp { font-family: 'Geist', 'Helvetica Neue', Arial, sans-serif; color: #111827; }
        .rp-th { cursor: pointer; user-select: none; }
        .rp-th:hover { color: #111827 !important; }
        .rp-tr:hover td, .rp-tr:hover { background: #f9fafb !important; }
        .rp-tr td:first-child { border-radius: 6px 0 0 6px; }
        .rp-tr td:last-child  { border-radius: 0 6px 6px 0; }
        scrollbar-width: thin; scrollbar-color: #e5e7eb transparent;
      `}</style>

      <div className="rp" style={{ background: "#f9fafb", minHeight: "100vh", padding: "32px 32px 64px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>

          {/* ── HEADER ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, animation: "rp-fade-up 0.35s ease both" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.025em" }}>
                Reports &amp; Analytics
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#9ca3af" }}>
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : "Organisation overview"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={fetchAll} variant="ghost">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
                Refresh
              </Btn>
              <Btn onClick={() => onAction?.("Report exported!")} variant="primary">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export
              </Btn>
            </div>
          </div>

          {/* ── ERROR ── */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: "0.8rem", color: "#7f1d1d" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
              <button onClick={fetchAll} style={{ marginLeft: "auto", fontSize: "0.72rem", color: "#7f1d1d", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>Retry</button>
            </div>
          )}

          {loading ? <Spinner /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* ── KPI ROW ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, animation: "rp-fade-up 0.4s ease both" }}>
                {kpis.map((k, i) => (
                  <Card key={k.label} style={{ padding: "18px 20px", animationDelay: `${i * 40}ms`, animation: "rp-fade-up 0.4s ease both" }}>
                    <p style={{ margin: "0 0 10px", fontSize: "0.68rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</p>
                    <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1 }}>{k.value}</p>
                    <p style={{ margin: "5px 0 0", fontSize: "0.68rem", color: "#9ca3af" }}>{k.sub}</p>
                  </Card>
                ))}
              </div>

              {/* ── CHARTS ROW ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 16, animation: "rp-fade-up 0.45s ease both" }}>

                {/* Trend */}
                <Card>
                  <CardHead title="Volunteer Trend" sub="Monthly slots required — last 6 months" />
                  <Divider />
                  <div style={{ padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: 13 }}>
                    {trend.length === 0
                      ? <p style={{ color: "#9ca3af", fontSize: "0.78rem", padding: "16px 0", textAlign: "center" }}>No data available.</p>
                      : trend.map(({ m, v }) => (
                          <div key={m} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: "0.72rem", color: "#6b7280", width: 40, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>{m}</span>
                            <Bar value={v} max={maxTrend} color="#111827" />
                            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#111827", width: 24, textAlign: "right", flexShrink: 0 }}>{v}</span>
                          </div>
                        ))
                    }
                  </div>
                </Card>

                {/* Request breakdown */}
                <Card>
                  <CardHead title="Request Breakdown" sub="Membership request outcomes" />
                  <Divider />
                  <div style={{ padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: 0 }}>
                    {[
                      { label: "Approved", value: approvedReqs,  bar: "#111827", chip: "approved" },
                      { label: "Pending",  value: pendingReqs,   bar: "#d97706", chip: "pending"  },
                      { label: "Rejected", value: rejectedReqs,  bar: "#dc2626", chip: "rejected" },
                    ].map((row, ri) => (
                      <div key={row.label}>
                        {ri > 0 && <div style={{ borderTop: "1px solid #f3f4f6", margin: "12px 0" }} />}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: "0.72rem", color: "#6b7280", width: 60, flexShrink: 0 }}>{row.label}</span>
                          <Bar value={row.value} max={requests.length || 1} color={row.bar} />
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827", width: 28, textAlign: "right", flexShrink: 0 }}>{row.value}</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #f3f4f6", margin: "16px 0 4px" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>Total requests</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#111827" }}>{requests.length}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>Approval rate</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#111827" }}>{approvalRate}%</span>
                    </div>
                  </div>
                </Card>

                {/* Category donut */}
                <Card>
                  <CardHead title="By Category" sub="Event distribution" />
                  <Divider />
                  <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <DonutChart
                      segments={catCounts.map(c => ({ value: c.count, color: catDonutColors[c.cat] || "#9ca3af" }))}
                    />
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                      {catCounts.map(c => (
                        <div key={c.cat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: catDonutColors[c.cat], display: "inline-block", flexShrink: 0 }} />
                            <span style={{ fontSize: "0.72rem", color: "#374151" }}>{c.cat}</span>
                          </div>
                          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#111827" }}>{c.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* ── EVENT TABLE ── */}
              <Card style={{ animation: "rp-fade-up 0.5s ease both", overflow: "hidden" }}>
                <CardHead
                  title="Events"
                  sub={`${events.length} total events — click column headers to sort`}
                  right={
                    <div style={{ display: "flex", gap: 6 }}>
                      {Object.entries(CAT).map(([k, v]) => (
                        <span key={k} style={{ fontSize: "0.65rem", fontWeight: 600, color: v.color, background: v.bg, border: `1px solid ${v.border}`, borderRadius: 5, padding: "2px 7px" }}>{k}</span>
                      ))}
                    </div>
                  }
                />
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
                        {[
                          { label: "Event",        field: "title",         w: "auto" },
                          { label: "Category",     field: "category",      w: 120    },
                          { label: "Location",     field: "city",          w: 140    },
                          { label: "Date",         field: "startDateTime", w: 120    },
                          { label: "Organiser",    field: "organizerName", w: 140    },
                          { label: "Vol. Slots",   field: "noOfVol",       w: 90     },
                        ].map(col => (
                          <th key={col.field} className="rp-th" onClick={() => handleSort(col.field)}
                            style={{ padding: "10px 16px", textAlign: "left", fontSize: "0.67rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", background: "#f9fafb", whiteSpace: "nowrap", width: col.w !== "auto" ? col.w : undefined, userSelect: "none" }}>
                            {col.label}<SortIcon field={col.field} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedEvents.length === 0 && (
                        <tr><td colSpan={6} style={{ padding: "32px 16px", textAlign: "center", color: "#9ca3af", fontSize: "0.78rem" }}>No events found.</td></tr>
                      )}
                      {sortedEvents.map((e, i) => {
                        const date = e.startDateTime
                          ? new Date(e.startDateTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                          : "—";
                        return (
                          <tr key={e.id || i} className="rp-tr" style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.1s" }}>
                            <td style={{ padding: "12px 16px" }}>
                              <p style={{ margin: 0, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 240 }}>{e.title || "—"}</p>
                              {e.contactEmail && <p style={{ margin: "2px 0 0", fontSize: "0.67rem", color: "#9ca3af" }}>{e.contactEmail}</p>}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: catColor(e.category), background: catBg(e.category), border: `1px solid ${catBord(e.category)}`, borderRadius: 5, padding: "2px 8px", whiteSpace: "nowrap" }}>
                                {e.category || "—"}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#374151", whiteSpace: "nowrap" }}>
                              {e.city}{e.state ? `, ${e.state}` : ""}
                            </td>
                            <td style={{ padding: "12px 16px", color: "#374151", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{date}</td>
                            <td style={{ padding: "12px 16px", color: "#374151", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.organizerName || "—"}</td>
                            <td style={{ padding: "12px 16px", fontWeight: 700, color: "#111827", textAlign: "right" }}>{e.noOfVol ?? "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {events.length > 0 && (
                  <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{events.length} rows</span>
                  </div>
                )}
              </Card>

              {/* ── MEMBERS ── */}
              <Card style={{ animation: "rp-fade-up 0.55s ease both", overflow: "hidden" }}>
                <CardHead
                  title="Approved Members"
                  sub={`${members.length} active member${members.length !== 1 ? "s" : ""}`}
                  right={<Chip label="APPROVED" scheme="approved" />}
                />
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
                        {["#","Member","Email","Status"].map(h => (
                          <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "0.67rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", background: "#f9fafb" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {members.length === 0 && (
                        <tr><td colSpan={4} style={{ padding: "32px 16px", textAlign: "center", color: "#9ca3af", fontSize: "0.78rem" }}>No approved members yet.</td></tr>
                      )}
                      {members.map((m, i) => {
                        const name  = m.user?.name || m.user?.fullName || m.user?.email || m.userEmail || "Member";
                        const email = m.user?.email || m.userEmail || "—";
                        const init  = name.slice(0, 2).toUpperCase();
                        return (
                          <tr key={m.id || i} className="rp-tr" style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.1s" }}>
                            <td style={{ padding: "12px 16px", color: "#9ca3af", fontVariantNumeric: "tabular-nums", width: 40 }}>{i + 1}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                  width: 32, height: 32, borderRadius: 8,
                                  background: "#f3f4f6", border: "1px solid #e5e7eb",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: "0.68rem", fontWeight: 700, color: "#374151", flexShrink: 0,
                                }}>{init}</div>
                                <span style={{ fontWeight: 600, color: "#111827" }}>{name}</span>
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#6b7280" }}>{email}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <Chip label="Active" scheme="approved" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {members.length > 0 && (
                  <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{members.length} rows</span>
                  </div>
                )}
              </Card>

            </div>
          )}
        </div>
      </div>
    </>
  );
}