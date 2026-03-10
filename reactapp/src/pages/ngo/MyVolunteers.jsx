import { useEffect, useState } from "react";
import { getMyVolunteers } from "../../api/volunteerService";

// ── Palette cycling for avatar + row accents ──────────────────────────────────
const PALETTES = [
  { grad: "linear-gradient(135deg,#6366f1,#8b5cf6)", light: "#ede9fe", text: "#6d28d9", dot: "#8b5cf6" },
  { grad: "linear-gradient(135deg,#0ea5e9,#06b6d4)",  light: "#e0f2fe", text: "#0369a1", dot: "#0ea5e9" },
  { grad: "linear-gradient(135deg,#f59e0b,#f97316)",  light: "#fff7ed", text: "#b45309", dot: "#f59e0b" },
  { grad: "linear-gradient(135deg,#10b981,#059669)",  light: "#ecfdf5", text: "#065f46", dot: "#10b981" },
  { grad: "linear-gradient(135deg,#e11d48,#f43f5e)",  light: "#fff1f2", text: "#9f1239", dot: "#e11d48" },
  { grad: "linear-gradient(135deg,#f97316,#eab308)",  light: "#fefce8", text: "#92400e", dot: "#f97316" },
];

// ── Skill tag colours ─────────────────────────────────────────────────────────
const SKILL_COLORS = [
  { bg: "#ede9fe", color: "#6d28d9" },
  { bg: "#e0f2fe", color: "#0369a1" },
  { bg: "#ecfdf5", color: "#065f46" },
  { bg: "#fff7ed", color: "#b45309" },
  { bg: "#fce7f3", color: "#9d174d" },
  { bg: "#f0fdf4", color: "#166534" },
];

function Avatar({ name, palette, size = 44 }) {
  const initials = name
    ? name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: palette.grad,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 800, color: "#fff",
      fontFamily: "'Syne', sans-serif",
      flexShrink: 0,
      boxShadow: `0 4px 14px ${palette.dot}55`,
    }}>{initials}</div>
  );
}

// ── Expandable row ────────────────────────────────────────────────────────────
function VolunteerRow({ v, index, palette }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Main row */}
      <tr
        onClick={() => setExpanded(x => !x)}
        style={{
          cursor: "pointer",
          background: expanded ? palette.light : index % 2 === 0 ? "#fafbff" : "#fff",
          transition: "background 0.2s",
          animation: `rowIn 0.35s ease ${index * 0.055}s both`,
        }}
        onMouseOver={e => { if (!expanded) e.currentTarget.style.background = palette.light + "bb"; }}
        onMouseOut={e => { if (!expanded) e.currentTarget.style.background = index % 2 === 0 ? "#fafbff" : "#fff"; }}
      >
        {/* # */}
        <td style={{ padding: "14px 16px", textAlign: "center", width: 48 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 26, height: 26, borderRadius: "50%",
            background: palette.grad,
            fontSize: 11, fontWeight: 800, color: "#fff",
            fontFamily: "'Syne', sans-serif",
            boxShadow: `0 2px 8px ${palette.dot}44`,
          }}>{index + 1}</span>
        </td>

        {/* Volunteer */}
        <td style={{ padding: "14px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={v.volunteerName} palette={palette} />
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a", fontFamily: "'Syne', sans-serif" }}>
                {v.volunteerName}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>📧 {v.email}</p>
            </div>
          </div>
        </td>

        {/* Skills */}
        <td style={{ padding: "14px 12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {(v.skills || []).slice(0, 3).map((s, i) => {
              const sc = SKILL_COLORS[i % SKILL_COLORS.length];
              return (
                <span key={i} style={{
                  fontSize: 10, fontWeight: 700,
                  background: sc.bg, color: sc.color,
                  padding: "3px 9px", borderRadius: 99,
                  letterSpacing: "0.03em",
                }}>{s}</span>
              );
            })}
            {(v.skills || []).length > 3 && (
              <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", background: "#f1f5f9", padding: "3px 9px", borderRadius: 99 }}>
                +{v.skills.length - 3}
              </span>
            )}
          </div>
        </td>

        {/* Events applied */}
        <td style={{ padding: "14px 12px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{
              fontSize: 20, fontWeight: 900,
              color: palette.dot, fontFamily: "'Syne', sans-serif",
            }}>{v.totalEventsRegistered}</span>
            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>events</span>
          </div>
        </td>

        {/* Expand toggle */}
        <td style={{ padding: "14px 16px", textAlign: "center", width: 48 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: expanded ? palette.light : "#f1f5f9",
            border: `1.5px solid ${expanded ? palette.dot + "55" : "#e2e8f0"}`,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: expanded ? palette.dot : "#94a3b8",
            transition: "all 0.2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}>▾</div>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr style={{ background: palette.light, animation: "expandIn 0.22s ease both" }}>
          <td colSpan={5} style={{ padding: "0 20px 18px 80px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingTop: 4 }}>

              {/* Applied events */}
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: "14px 16px",
                border: `1.5px solid ${palette.dot}33`,
              }}>
                <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 800, color: palette.text, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  🗓 Applied Events
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(v.appliedEvents || []).map((ev, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "7px 10px", borderRadius: 8,
                      background: i % 2 === 0 ? palette.light : "transparent",
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: palette.dot, flexShrink: 0,
                        boxShadow: `0 0 5px ${palette.dot}88`,
                      }} />
                      <span style={{ fontSize: 12, color: "#334155", fontWeight: 600 }}>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All skills */}
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: "14px 16px",
                border: `1.5px solid ${palette.dot}33`,
              }}>
                <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 800, color: palette.text, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  ⚡ All Skills
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(v.skills || []).map((s, i) => {
                    const sc = SKILL_COLORS[i % SKILL_COLORS.length];
                    return (
                      <span key={i} style={{
                        fontSize: 11, fontWeight: 700,
                        background: sc.bg, color: sc.color,
                        padding: "4px 11px", borderRadius: 99,
                        border: `1px solid ${sc.color}22`,
                      }}>{s}</span>
                    );
                  })}
                </div>
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function MyVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");

  useEffect(() => { loadVolunteers(); }, []);

  const loadVolunteers = async () => {
    try {
      const data = await getMyVolunteers();
      setVolunteers(data);
    } catch (err) {
      console.error("Error loading volunteers", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = volunteers.filter(v =>
    v.volunteerName?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase()) ||
    (v.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const totalEvents = volunteers.reduce((s, v) => s + (v.totalEventsRegistered || 0), 0);
  const totalSkills = new Set(volunteers.flatMap(v => v.skills || [])).size;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeDown  { from { opacity:0; transform:translateY(-18px) } to { opacity:1; transform:none } }
        @keyframes rowIn     { from { opacity:0; transform:translateX(-10px) } to { opacity:1; transform:none } }
        @keyframes expandIn  { from { opacity:0; transform:scaleY(0.92); transform-origin:top } to { opacity:1; transform:scaleY(1) } }
        @keyframes shimmer   { 0%,100% { opacity:.55 } 50% { opacity:1 } }
        @keyframes floatDot  { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
        .mv-table tr { border-bottom: 1px solid #f1f5f9; }
        .mv-table tr:last-child { border-bottom: none; }
        .mv-search:focus { outline:none; border-color:#6366f1 !important; box-shadow:0 0 0 3px #6366f133; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>

        {/* ── Hero Header ───────────────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 75%, #6366f1 100%)",
          borderRadius: 22,
          padding: "30px 30px 28px",
          marginBottom: 22,
          position: "relative",
          overflow: "hidden",
          animation: "fadeDown 0.4s ease both",
        }}>
          {/* Decorative blobs */}
          {[
            { w:160, h:160, top:-40, right:-30, op:0.08 },
            { w:100, h:100, bottom:-20, right:120, op:0.1 },
            { w:60,  h:60,  top:20,   right:200, op:0.07 },
          ].map((b,i) => (
            <div key={i} style={{
              position:"absolute", width:b.w, height:b.h, borderRadius:"50%",
              background:"white", opacity:b.op,
              top:b.top, bottom:b.bottom, right:b.right,
              animation:`floatDot ${2.5 + i*0.7}s ease-in-out infinite`,
            }}/>
          ))}

          <div style={{ position:"relative", zIndex:1 }}>
            <p style={{ margin:"0 0 3px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>
              ✦ Volunteer Hub
            </p>
            <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:28, fontWeight:900, color:"#fff", margin:"0 0 18px", letterSpacing:"-0.02em" }}>
              My Volunteers
            </h1>

            {/* Stats row */}
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              {[
                { icon:"👥", label:"Total Volunteers", value: volunteers.length },
                { icon:"🗓", label:"Event Registrations", value: totalEvents },
                { icon:"⚡", label:"Unique Skills", value: totalSkills },
              ].map((stat, i) => (
                <div key={i} style={{
                  background:"rgba(255,255,255,0.1)",
                  backdropFilter:"blur(8px)",
                  border:"1px solid rgba(255,255,255,0.18)",
                  borderRadius:14, padding:"12px 18px",
                  animation:`fadeDown 0.4s ease ${0.1 + i*0.07}s both`,
                }}>
                  <p style={{ margin:0, fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                    {stat.icon} {stat.label}
                  </p>
                  <p style={{ margin:"4px 0 0", fontSize:26, fontWeight:900, color:"#fff", fontFamily:"'Syne', sans-serif", lineHeight:1 }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Search bar ────────────────────────────────────────────────── */}
        <div style={{
          background:"#fff", borderRadius:14,
          border:"1.5px solid #e2e8f0",
          padding:"10px 16px", marginBottom:18,
          display:"flex", alignItems:"center", gap:10,
          boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
          animation:"fadeDown 0.4s ease 0.15s both",
        }}>
          <span style={{ fontSize:15, color:"#94a3b8" }}>🔍</span>
          <input
            className="mv-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email or skills…"
            style={{
              flex:1, border:"none", background:"transparent",
              fontSize:13, color:"#334155", fontFamily:"'DM Sans', sans-serif",
              outline:"none",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              border:"none", background:"#f1f5f9", borderRadius:6,
              width:22, height:22, cursor:"pointer", fontSize:11, color:"#64748b",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>✕</button>
          )}
          <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", whiteSpace:"nowrap" }}>
            {filtered.length} of {volunteers.length}
          </span>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        {loading ? (
          /* Skeleton */
          <div style={{ background:"#fff", borderRadius:18, overflow:"hidden", border:"1.5px solid #e2e8f0" }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:14, padding:"18px 20px",
                borderBottom:"1px solid #f1f5f9",
                animation:`shimmer 1.4s ease ${i*0.12}s infinite`,
              }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"#f1f5f9" }} />
                <div style={{ flex:1 }}>
                  <div style={{ height:13, background:"#f1f5f9", borderRadius:6, width:"40%", marginBottom:7 }} />
                  <div style={{ height:10, background:"#f8fafc", borderRadius:6, width:"60%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign:"center", padding:"70px 20px",
            background:"#fff", borderRadius:18,
            border:"1.5px dashed #e2e8f0",
            animation:"fadeDown 0.4s ease both",
          }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🙋</div>
            <p style={{ margin:0, fontSize:16, fontWeight:800, color:"#475569", fontFamily:"'Syne', sans-serif" }}>
              {search ? `No match for "${search}"` : "No volunteers yet"}
            </p>
            <p style={{ margin:"7px 0 0", fontSize:13, color:"#94a3b8" }}>
              Volunteers who register for your events will appear here
            </p>
          </div>
        ) : (
          <div style={{
            background:"#fff", borderRadius:18,
            border:"1.5px solid #e2e8f0",
            overflow:"hidden",
            boxShadow:"0 4px 24px rgba(99,102,241,0.07)",
            animation:"fadeDown 0.4s ease 0.2s both",
          }}>
            <table className="mv-table" style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{
                  background:"linear-gradient(135deg, #1e1b4b, #4f46e5)",
                }}>
                  {["#","Volunteer","Skills","Events",""].map((h, i) => (
                    <th key={i} style={{
                      padding: i === 0 ? "14px 16px" : "14px 12px",
                      textAlign: [0,3,4].includes(i) ? "center" : "left",
                      fontSize: 10, fontWeight: 800,
                      color: "rgba(255,255,255,0.7)",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      fontFamily: "'DM Sans', sans-serif",
                      whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <VolunteerRow
                    key={i}
                    v={v}
                    index={i}
                    palette={PALETTES[i % PALETTES.length]}
                  />
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div style={{
              padding:"12px 20px",
              borderTop:"1.5px solid #f1f5f9",
              background:"#fafbff",
              display:"flex", alignItems:"center", justifyContent:"space-between",
            }}>
              <span style={{ fontSize:12, color:"#94a3b8", fontWeight:600 }}>
                Showing {filtered.length} volunteer{filtered.length !== 1 ? "s" : ""}
              </span>
              <span style={{ fontSize:11, color:"#c7d2fe", fontWeight:700, letterSpacing:"0.05em" }}>
                ✦ Click any row to expand details
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}