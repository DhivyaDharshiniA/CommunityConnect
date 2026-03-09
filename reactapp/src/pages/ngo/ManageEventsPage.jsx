import { useState, useEffect } from "react";
import { getMyEvents, deleteEvent } from "../../api/eventService";

// ─── Constants ────────────────────────────────────────────────────────────────

const catEmoji = {
  Environment: "🌿", Health: "❤️", Education: "📚",
  Welfare: "🤝", Community: "🏘️", Sports: "🏆",
};

const catColor = {
  Environment: { accent: "#059669", light: "#d1fae5", bg: "#ecfdf5", dark: "#064e3b" },
  Health:      { accent: "#e11d48", light: "#ffe4e6", bg: "#fff1f2", dark: "#881337" },
  Education:   { accent: "#2563eb", light: "#dbeafe", bg: "#eff6ff", dark: "#1e3a8a" },
  Welfare:     { accent: "#9333ea", light: "#f3e8ff", bg: "#fdf4ff", dark: "#581c87" },
  Community:   { accent: "#ea580c", light: "#ffedd5", bg: "#fff7ed", dark: "#7c2d12" },
  Sports:      { accent: "#0d9488", light: "#ccfbf1", bg: "#f0fdfa", dark: "#134e4a" },
};

const statusStyle = {
  Active:    { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  Upcoming:  { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
  Completed: { color: "#64748b", bg: "#f8fafc", border: "#cbd5e1" },
  ONGOING:   { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  UPCOMING:  { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" },
  COMPLETED: { color: "#64748b", bg: "#f8fafc", border: "#cbd5e1" },
};

const IMG_BASE = "http://localhost:8080/uploads/";

function bannerSrc(bannerImage) {
  if (!bannerImage) return null;
  if (bannerImage.startsWith("http")) return bannerImage;
  return IMG_BASE + bannerImage;
}

// ─── Split-Panel Modal ────────────────────────────────────────────────────────

function EventModal({ event, onClose, onDelete }) {
  if (!event) return null;

  const colors = catColor[event.category] || catColor.Community;
  const sc     = statusStyle[event.status] || statusStyle.Active;
  const banner = bannerSrc(event.bannerImage);
  const pct    = event.capacity > 0 ? Math.min(100, Math.round((event.volunteers / event.capacity) * 100)) : 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "overlayIn 0.22s ease both",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: "flex",
          width: "100%",
          maxWidth: 860,
          height: "min(82vh, 600px)",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 48px 120px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1)",
          animation: "modalIn 0.32s cubic-bezier(0.22,1.2,0.36,1) both",
          fontFamily: "'Outfit', sans-serif",
        }}
      >

        {/* ── LEFT PANEL: Banner Image ── */}
        <div style={{
          width: "42%",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Image or gradient fallback */}
          {banner ? (
            <img
              src={banner}
              alt="Event banner"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: `linear-gradient(160deg, ${colors.dark} 0%, ${colors.accent} 60%, ${colors.light} 130%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 90, opacity: 0.35, filter: "grayscale(20%)" }}>
                {catEmoji[event.category] || "📌"}
              </span>
            </div>
          )}

          {/* Overlay: gradient from bottom */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to top,
              rgba(0,0,0,0.82) 0%,
              rgba(0,0,0,0.3) 45%,
              rgba(0,0,0,0.05) 100%)`,
          }} />

          {/* Top-left: category pill */}
          <div style={{
            position: "absolute", top: 18, left: 18,
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 30, padding: "5px 12px",
          }}>
            <span style={{ fontSize: 14 }}>{catEmoji[event.category] || "📌"}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em" }}>
              {event.category}
            </span>
          </div>

          {/* Bottom text over image */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 22px 24px" }}>
            {/* Status */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: sc.bg, border: `1px solid ${sc.border}`,
              borderRadius: 20, padding: "4px 10px", marginBottom: 10,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: sc.color, display: "block",
                boxShadow: `0 0 5px ${sc.color}`,
              }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {event.status}
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 20, fontWeight: 800,
              color: "white", margin: 0,
              lineHeight: 1.25, letterSpacing: "-0.02em",
              textShadow: "0 2px 16px rgba(0,0,0,0.6)",
            }}>
              {event.title}
            </h2>

            {/* Organizer */}
            {event.organizerName && (
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                by {event.organizerName}
              </p>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL: Details ── */}
        <div style={{
          flex: 1,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Right panel header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f1f5f9",
            flexShrink: 0,
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Event Details
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 10,
                border: "1.5px solid #e2e8f0", background: "#f8fafc",
                color: "#64748b", fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
            >
              ✕
            </button>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px", scrollbarWidth: "thin" }}>

            {/* Volunteer progress card */}
            {event.capacity > 0 && (
              <div style={{
                background: `linear-gradient(135deg, ${colors.bg}, white)`,
                border: `1.5px solid ${colors.light}`,
                borderRadius: 14, padding: "14px 16px", marginBottom: 16,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Volunteer Capacity
                    </p>
                    <p style={{ margin: "3px 0 0", fontSize: 22, fontWeight: 800, color: colors.accent, fontFamily: "'Syne', sans-serif" }}>
                      {event.volunteers}
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginLeft: 4 }}>/ {event.capacity}</span>
                    </p>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 800, color: colors.accent,
                    background: colors.light, borderRadius: 8, padding: "4px 10px",
                  }}>
                    {pct}%
                  </span>
                </div>
                <div style={{ height: 6, background: colors.light, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}bb)`,
                    borderRadius: 99, transition: "width 0.8s ease",
                  }} />
                </div>
              </div>
            )}

            {/* Info grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 }}>
              {[
                { icon: "📅", label: "Date & Time",  value: event.date },
                { icon: "📍", label: "Location",     value: event.location },
                { icon: "🏛️", label: "Venue",        value: event.venue },
                { icon: "🏙️", label: "City / State", value: [event.city, event.state].filter(Boolean).join(", ") },
                { icon: "✉️", label: "Email",        value: event.contactEmail },
                { icon: "📞", label: "Phone",        value: event.contactPhone },
              ].filter(r => r.value).map((row, i, arr) => (
                <div key={row.label} style={{
                  display: "flex", alignItems: "center", gap: 11,
                  padding: "9px 10px",
                  borderRadius: 10,
                  background: i % 2 === 0 ? "#f8fafc" : "transparent",
                }}>
                  <span style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: colors.bg,
                    border: `1px solid ${colors.light}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13,
                  }}>
                    {row.icon}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {row.label}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#334155", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {row.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {event.description && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  About
                </p>
                <p style={{
                  margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.7,
                  background: "#f8fafc", borderRadius: 10, padding: "11px 13px",
                  border: "1px solid #f1f5f9",
                }}>
                  {event.description}
                </p>
              </div>
            )}

            {/* Requirements & Benefits */}
            {(event.requirements || event.benefits) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
                {event.requirements && (
                  <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "11px 12px" }}>
                    <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 700, color: "#92400e", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      ⚠️ Requirements
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: "#78350f", lineHeight: 1.5 }}>{event.requirements}</p>
                  </div>
                )}
                {event.benefits && (
                  <div style={{ background: colors.bg, border: `1px solid ${colors.light}`, borderRadius: 10, padding: "11px 12px" }}>
                    <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 700, color: colors.dark, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      ✨ Benefits
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: colors.dark, lineHeight: 1.5 }}>{event.benefits}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fixed action footer */}
          <div style={{
            padding: "14px 24px",
            borderTop: "1px solid #f1f5f9",
            display: "flex", gap: 10,
            flexShrink: 0,
            background: "white",
          }}>
            <button
              style={{
                flex: 1, padding: "11px 0", borderRadius: 12,
                border: `1.5px solid ${colors.light}`,
                background: colors.bg,
                fontSize: 13, fontWeight: 700, color: colors.accent,
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: "'Outfit', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
              onMouseOver={e => e.currentTarget.style.background = colors.light}
              onMouseOut={e => e.currentTarget.style.background = colors.bg}
            >
              ✏️ Edit Event
            </button>
            <button
              onClick={() => { onDelete(event.id); onClose(); }}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 12,
                border: "1.5px solid #fecaca",
                background: "#fff1f2",
                fontSize: 13, fontWeight: 700, color: "#e11d48",
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: "'Outfit', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
              onMouseOver={e => e.currentTarget.style.background = "#ffe4e6"}
              onMouseOut={e => e.currentTarget.style.background = "#fff1f2"}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event, onClick, onDelete }) {
  const colors = catColor[event.category] || catColor.Community;
  const sc     = statusStyle[event.status] || statusStyle.Active;
  const banner = bannerSrc(event.bannerImage);
  const pct    = event.capacity > 0 ? Math.min(100, Math.round((event.volunteers / event.capacity) * 100)) : 0;

  return (
    <div
      onClick={() => onClick(event)}
      style={{
        background: "white", borderRadius: 18,
        border: "1.5px solid #e2e8f0",
        overflow: "hidden", cursor: "pointer",
        transition: "all 0.22s",
        display: "flex", flexDirection: "column",
        fontFamily: "'Outfit', sans-serif",
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.1), 0 0 0 2px ${colors.accent}44`;
        e.currentTarget.style.borderColor = colors.accent + "66";
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* Banner thumbnail */}
      <div style={{ height: 110, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {banner ? (
          <img src={banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(135deg, ${colors.dark}88, ${colors.accent}66, ${colors.bg})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 40, opacity: 0.45 }}>{catEmoji[event.category] || "📌"}</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />

        <div style={{
          position: "absolute", top: 9, right: 9,
          display: "flex", alignItems: "center", gap: 4,
          background: sc.bg, border: `1px solid ${sc.border}`,
          borderRadius: 8, padding: "3px 8px",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, flexShrink: 0 }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: sc.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {event.status}
          </span>
        </div>

        <div style={{
          position: "absolute", top: 9, left: 9,
          background: colors.bg, border: `1px solid ${colors.light}`,
          borderRadius: 7, padding: "3px 8px",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ fontSize: 11 }}>{catEmoji[event.category] || "📌"}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: colors.accent }}>{event.category}</span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "13px 14px 0", flex: 1 }}>
        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14, fontWeight: 700, color: "#0f172a",
          margin: "0 0 8px", lineHeight: 1.3, letterSpacing: "-0.01em",
        }}>
          {event.title}
        </h3>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>📅 {event.date}</div>
        <div style={{ fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {event.location}</div>

        {event.capacity > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Volunteers</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: colors.accent }}>{event.volunteers}/{event.capacity}</span>
            </div>
            <div style={{ height: 4, background: colors.light, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: colors.accent, borderRadius: 99 }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, padding: "10px 14px 13px", marginTop: 10 }}>
        <button
          onClick={e => e.stopPropagation()}
          style={{
            flex: 1, padding: "7px 0", borderRadius: 8,
            border: "1px solid #e2e8f0", background: "#f8fafc",
            fontSize: 11, fontWeight: 600, color: "#475569",
            cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "background 0.15s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "#f1f5f9"}
          onMouseOut={e => e.currentTarget.style.background = "#f8fafc"}
        >
          ✏️ Edit
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete(event.id); }}
          style={{
            flex: 1, padding: "7px 0", borderRadius: 8,
            border: "1px solid #fecaca", background: "#fff1f2",
            fontSize: 11, fontWeight: 600, color: "#e11d48",
            cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "background 0.15s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "#ffe4e6"}
          onMouseOut={e => e.currentTarget.style.background = "#fff1f2"}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageEventsPage({ setActivePage, onAction }) {
  const [events, setEvents]          = useState([]);
  const [filter, setFilter]          = useState("All");
  const [search, setSearch]          = useState("");
  const [selectedEvent, setSelected] = useState(null);
  const [loading, setLoading]        = useState(true);

  const filters = ["All", "Active", "Upcoming", "Completed"];

  useEffect(() => { fetchEvents(); }, []);

  const getEventStatus = (startDateTime) => {
    if (!startDateTime) return "Active";

    const eventDate = new Date(startDateTime);
    const today = new Date();

    // remove time for accurate comparison
    today.setHours(0,0,0,0);

    const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

    if (eventDate < today) {
      return "Completed";
    }

    if (diffDays > 30) {
      return "Upcoming";
    }

    return "Active";
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getMyEvents();

      setEvents(
        res.map((e) => ({
          id: e.id,
          title: e.title || "Untitled Event",
          category: e.category || "Community",

          // ✅ Dynamic status
          status: getEventStatus(e.startDateTime),

          capacity: e.capacity || 0,
          volunteers: e.volunteerCount || 0,

          date: e.startDateTime
            ? new Date(e.startDateTime).toLocaleString()
            : "No date",

          location: e.venue || e.location || "No location",
          venue: e.venue,
          city: e.city,
          state: e.state,
          organizerName: e.organizerName,
          contactEmail: e.contactEmail,
          contactPhone: e.contactPhone,
          description: e.description,
          requirements: e.requirements,
          benefits: e.benefits,
          bannerImage: e.bannerImage,
        }))
      );
    } catch (err) {
      console.error("Error loading events", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = events.filter(e => {
    const matchFilter = filter === "All" || e.status === filter || e.status === filter.toUpperCase();
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      onAction?.("Event deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const counts = {
    All:       events.length,
    Active:    events.filter(e => e.status === "Active"    || e.status === "ONGOING").length,
    Upcoming:  events.filter(e => e.status === "Upcoming"  || e.status === "UPCOMING").length,
    Completed: events.filter(e => e.status === "Completed" || e.status === "COMPLETED").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
        @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn   {
          from { opacity: 0; transform: scale(0.92) translateY(32px) }
          to   { opacity: 1; transform: scale(1)    translateY(0) }
        }
        @keyframes cardIn { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        .event-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 16px; }
        @media (max-width: 700px) {
          .event-grid { grid-template-columns: 1fr; }
          .modal-inner { flex-direction: column !important; width: 95vw !important; height: 90vh !important; }
          .modal-left  { width: 100% !important; height: 200px !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Outfit', sans-serif" }}>

        {/* Page Header */}
        <div style={{
          background: "linear-gradient(135deg, #0f766e, #0d9488 45%, #0ea5e9)",
          borderRadius: 20, padding: "26px 28px", marginBottom: 18,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -15, right: 80, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                ✦ Dashboard
              </p>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
                Manage Events
              </h1>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                {events.length} event{events.length !== 1 ? "s" : ""} total
              </p>
            </div>
            <button
              onClick={() => setActivePage("create-event")}
              style={{
                background: "white", border: "none", borderRadius: 12,
                padding: "10px 20px", fontFamily: "'Outfit', sans-serif",
                fontSize: 13, fontWeight: 700, color: "#0d9488",
                cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              ＋ New Event
            </button>
          </div>
        </div>

        {/* Filter + Search */}
        <div style={{
          background: "white", borderRadius: 14, border: "1.5px solid #e2e8f0",
          padding: "12px 16px", marginBottom: 18,
          display: "flex", flexWrap: "wrap", gap: 10,
          alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 12px", borderRadius: 9,
                  border: filter === f ? "1.5px solid #0d9488" : "1.5px solid #e2e8f0",
                  background: filter === f ? "#f0fdfa" : "white",
                  fontSize: 12, fontWeight: 700,
                  color: filter === f ? "#0d9488" : "#64748b",
                  cursor: "pointer", transition: "all 0.15s",
                  fontFamily: "'Outfit', sans-serif",
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                {f}
                <span style={{
                  background: filter === f ? "#0d9488" : "#f1f5f9",
                  color: filter === f ? "white" : "#94a3b8",
                  borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 6px",
                }}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#94a3b8" }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events…"
              style={{
                paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                borderRadius: 9, border: "1.5px solid #e2e8f0",
                fontSize: 12, fontFamily: "'Outfit', sans-serif",
                color: "#334155", outline: "none", background: "#f8fafc", minWidth: 180,
              }}
              onFocus={e => e.target.style.borderColor = "#0d9488"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>
            <p style={{ margin: 0, fontSize: 14 }}>Loading events…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 16, border: "1.5px dashed #e2e8f0" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#475569", fontFamily: "'Syne', sans-serif" }}>No events found</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              {search ? `No results for "${search}"` : "Create your first event to get started"}
            </p>
          </div>
        ) : (
          <div className="event-grid">
            {filtered.map((event, i) => (
              <div key={event.id} style={{ animation: `cardIn 0.3s ease ${i * 0.04}s both` }}>
                <EventCard event={event} onClick={setSelected} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}