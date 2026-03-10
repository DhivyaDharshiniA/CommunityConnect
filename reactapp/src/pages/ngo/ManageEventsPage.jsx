import { useState, useEffect } from "react";
import { getMyEvents, deleteEvent, updateEvent } from "../../api/eventService";
import { getAllEvents } from "../../api/eventService";
import { getEventVolunteers } from "../../api/volunteerService";

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

const isCompleted = (status) => status === "Completed" || status === "COMPLETED";

// ─── Toast Notification ───────────────────────────────────────────────────────

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, []);

  const bg     = type === "error" ? "#fef2f2" : "#f0fdf4";
  const color  = type === "error" ? "#dc2626"  : "#16a34a";
  const border = type === "error" ? "#fecaca"  : "#bbf7d0";
  const icon   = type === "error" ? "✕" : "✓";

  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 10,
      background: bg, border: `1.5px solid ${border}`,
      borderRadius: 14, padding: "13px 18px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      fontFamily: "'Outfit', sans-serif",
      animation: "toastIn 0.3s cubic-bezier(0.22,1.2,0.36,1) both",
      minWidth: 240,
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: "50%",
        background: color, color: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800, flexShrink: 0,
      }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color }}>{message}</span>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "overlayIn 0.18s ease both",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 20,
          padding: "28px 28px 22px",
          maxWidth: 380, width: "100%",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
          animation: "modalIn 0.28s cubic-bezier(0.22,1.2,0.36,1) both",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12, textAlign: "center" }}>🗑️</div>
        <h3 style={{
          fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800,
          color: "#0f172a", margin: "0 0 8px", textAlign: "center",
        }}>Delete Event?</h3>
        <p style={{ margin: "0 0 22px", fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 1.6 }}>
          This action cannot be undone. The event and all related data will be permanently removed.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              border: "1.5px solid #e2e8f0", background: "#f8fafc",
              fontSize: 13, fontWeight: 700, color: "#475569",
              cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              border: "1.5px solid #fecaca", background: "#fff1f2",
              fontSize: 13, fontWeight: 700, color: "#e11d48",
              cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}
          >Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ event, onClose, onSaved }) {
  const [form, setForm] = useState({
    title:         event.title         || "",
    description:   event.description   || "",
    category:      event.category      || "Community",
    venue:         event.venue         || "",
    city:          event.city          || "",
    state:         event.state         || "",
    organizerName: event.organizerName || "",
    contactEmail:  event.contactEmail  || "",
    contactPhone:  event.contactPhone  || "",
    startDateTime: event.startDateTime || "",
    endDateTime:   event.endDateTime   || "",
    requirements:  event.requirements  || "",
    benefits:      event.benefits      || "",
  });
  const [saving, setSaving] = useState(false);
  const colors = catColor[form.category] || catColor.Community;

  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await updateEvent(event.id, form);
      onSaved("Event updated successfully!");
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      onSaved("Failed to update event.", "error");
      onClose();
    }
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 9,
    border: "1.5px solid #e2e8f0", fontSize: 12,
    fontFamily: "'Outfit', sans-serif", color: "#334155",
    outline: "none", background: "#f8fafc", boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: 10, fontWeight: 700, color: "#94a3b8",
    letterSpacing: "0.1em", textTransform: "uppercase",
    display: "block", marginBottom: 4,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1500,
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
          background: "white", borderRadius: 24,
          width: "100%", maxWidth: 620,
          maxHeight: "88vh", display: "flex", flexDirection: "column",
          boxShadow: "0 48px 120px rgba(0,0,0,0.3)",
          animation: "modalIn 0.32s cubic-bezier(0.22,1.2,0.36,1) both",
          fontFamily: "'Outfit', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0,
          background: `linear-gradient(135deg, ${colors.bg}, white)`,
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Editing Event
            </p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "3px 0 0" }}>
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 10,
              border: "1.5px solid #e2e8f0", background: "#f8fafc",
              color: "#64748b", fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* Scrollable form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", scrollbarWidth: "thin" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} value={form.title} onChange={handle("title")} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={handle("category")}>
                {Object.keys(catEmoji).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Organizer Name</label>
              <input style={inputStyle} value={form.organizerName} onChange={handle("organizerName")} />
            </div>
            <div>
              <label style={labelStyle}>Venue</label>
              <input style={inputStyle} value={form.venue} onChange={handle("venue")} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} value={form.city} onChange={handle("city")} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input style={inputStyle} value={form.state} onChange={handle("state")} />
            </div>
            <div>
              <label style={labelStyle}>Start Date & Time</label>
              <input type="datetime-local" style={inputStyle} value={form.startDateTime} onChange={handle("startDateTime")} />
            </div>
            <div>
              <label style={labelStyle}>End Date & Time</label>
              <input type="datetime-local" style={inputStyle} value={form.endDateTime} onChange={handle("endDateTime")} />
            </div>
            <div>
              <label style={labelStyle}>Contact Email</label>
              <input style={inputStyle} value={form.contactEmail} onChange={handle("contactEmail")} />
            </div>
            <div>
              <label style={labelStyle}>Contact Phone</label>
              <input style={inputStyle} value={form.contactPhone} onChange={handle("contactPhone")} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>
              <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={form.description} onChange={handle("description")} />
            </div>
            <div>
              <label style={labelStyle}>Requirements</label>
              <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={form.requirements} onChange={handle("requirements")} />
            </div>
            <div>
              <label style={labelStyle}>Benefits</label>
              <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={form.benefits} onChange={handle("benefits")} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px", borderTop: "1px solid #f1f5f9",
          display: "flex", gap: 10, flexShrink: 0, background: "white",
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 12,
              border: "1.5px solid #e2e8f0", background: "#f8fafc",
              fontSize: 13, fontWeight: 700, color: "#475569",
              cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            }}
          >Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              flex: 2, padding: "11px 0", borderRadius: 12,
              border: `1.5px solid ${colors.light}`,
              background: saving ? colors.light : colors.bg,
              fontSize: 13, fontWeight: 700, color: colors.accent,
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "'Outfit', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            {saving ? "Saving…" : "✔ Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EventCard ────────────────────────────────────────────────────────────────

function EventCard({ event, onClick, onDelete, onEdit, isAllEvents }) {
  const colors    = catColor[event.category] || catColor.Community;
  const sc        = statusStyle[event.status] || statusStyle.Active;
  const banner    = bannerSrc(event.bannerImage);
  const pct       = event.capacity > 0
    ? Math.min(100, Math.round((event.volunteers / event.capacity) * 100))
    : 0;
  const completed = isCompleted(event.status);

  const fillColor =
    pct >= 90 ? "#ef4444" :
    pct >= 60 ? "#f59e0b" :
                colors.accent;

  return (
    <div
      onClick={() => onClick(event)}
      style={{
        background: "#fff",
        borderRadius: 20,
        border: "1.5px solid #eef0f6",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.22s, box-shadow 0.22s, border-color 0.22s",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Outfit', sans-serif",
        position: "relative",
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.10), 0 0 0 2px ${colors.accent}33`;
        e.currentTarget.style.borderColor = colors.accent + "55";
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#eef0f6";
      }}
    >
      {/* ── Banner ── */}
      <div style={{ height: 130, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {banner ? (
          <img src={banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(135deg, ${colors.dark}cc, ${colors.accent}99)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 52, opacity: 0.45 }}>{catEmoji[event.category] || "📌"}</span>
          </div>
        )}

        {/* Dark scrim */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)" }} />

        {/* Status pill — top right */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          display: "flex", alignItems: "center", gap: 5,
          background: sc.bg, border: `1px solid ${sc.border}`,
          borderRadius: 30, padding: "3px 9px",
          backdropFilter: "blur(6px)",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.color, boxShadow: `0 0 5px ${sc.color}` }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: sc.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>{event.status}</span>
        </div>

        {/* Category pill — top left */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 30, padding: "3px 9px",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ fontSize: 11 }}>{catEmoji[event.category] || "📌"}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "0.06em" }}>{event.category}</span>
        </div>

        {/* Title + meta overlaid on banner bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 13px 11px" }}>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14, fontWeight: 800,
            color: "#fff", margin: "0 0 5px", lineHeight: 1.25,
            letterSpacing: "-0.01em",
            textShadow: "0 1px 8px rgba(0,0,0,0.55)",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{event.title}</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>📅 {event.date}</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "11px 13px 0", flex: 1 }}>
        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
          <span style={{ fontSize: 11 }}>📍</span>
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.location}</span>
        </div>

        {/* Volunteer progress bar */}
        {event.capacity > 0 && (
          <div style={{
            padding: "9px 11px 10px",
            background: "#f8fafc",
            borderRadius: 11,
            border: "1px solid #f1f5f9",
          }}>
            {/* Row: label + count + badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11 }}>🙋</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase" }}>Volunteers</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: fillColor, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{event.volunteers}</span>
                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>/{event.capacity}</span>
                <span style={{
                  marginLeft: 5, fontSize: 9, fontWeight: 800,
                  color: fillColor,
                  background: fillColor + "1a",
                  border: `1px solid ${fillColor}33`,
                  padding: "1px 6px", borderRadius: 5,
                }}>{pct}%</span>
              </div>
            </div>

            {/* Progress track */}
            <div style={{ position: "relative", height: 5, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${fillColor}bb, ${fillColor})`,
                borderRadius: 99,
                transition: "width 0.7s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: pct > 0 ? `0 0 6px ${fillColor}55` : "none",
              }} />
              {/* Tick marks at 25/50/75 */}
              {[25, 50, 75].map(p => (
                <div key={p} style={{
                  position: "absolute", left: `${p}%`, top: 0, bottom: 0,
                  width: 1.5, background: "#fff", opacity: 0.85,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer buttons ── */}
      <div style={{ display: "flex", gap: 7, padding: "10px 13px 13px", marginTop: 8 }}>
        {isAllEvents ? (
          <button
            onClick={e => { e.stopPropagation(); onClick(event); }}
            style={{
              flex: 1, padding: "7px 0", borderRadius: 9,
              border: `1.5px solid ${colors.light}`,
              background: colors.bg,
              fontSize: 11, fontWeight: 700, color: colors.accent,
              cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              transition: "background 0.15s",
            }}
            onMouseOver={e => e.currentTarget.style.background = colors.light}
            onMouseOut={e => e.currentTarget.style.background = colors.bg}
          >👁️ View Details</button>
        ) : (
          <>
            <button
              onClick={e => { e.stopPropagation(); if (!completed) onEdit(event); }}
              disabled={completed}
              title={completed ? "Cannot edit completed events" : "Edit"}
              style={{
                flex: 1, padding: "7px 0", borderRadius: 9,
                border: "1.5px solid #e2e8f0",
                background: completed ? "#f1f5f9" : "#f8fafc",
                fontSize: 11, fontWeight: 700,
                color: completed ? "#cbd5e1" : "#475569",
                cursor: completed ? "not-allowed" : "pointer",
                fontFamily: "'Outfit', sans-serif",
                transition: "background 0.15s",
                opacity: completed ? 0.55 : 1,
              }}
              onMouseOver={e => { if (!completed) e.currentTarget.style.background = "#f1f5f9"; }}
              onMouseOut={e => { if (!completed) e.currentTarget.style.background = "#f8fafc"; }}
            >✏️ Edit</button>
            <button
              onClick={e => { e.stopPropagation(); if (!completed) onDelete(event.id, null); }}
              disabled={completed}
              title={completed ? "Cannot delete completed events" : "Delete"}
              style={{
                flex: 1, padding: "7px 0", borderRadius: 9,
                border: completed ? "1.5px solid #e2e8f0" : "1.5px solid #fecaca",
                background: completed ? "#f1f5f9" : "#fff1f2",
                fontSize: 11, fontWeight: 700,
                color: completed ? "#cbd5e1" : "#e11d48",
                cursor: completed ? "not-allowed" : "pointer",
                fontFamily: "'Outfit', sans-serif",
                transition: "background 0.15s",
                opacity: completed ? 0.55 : 1,
              }}
              onMouseOver={e => { if (!completed) e.currentTarget.style.background = "#ffe4e6"; }}
              onMouseOut={e => { if (!completed) e.currentTarget.style.background = "#fff1f2"; }}
            >🗑️ Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── EventModal ───────────────────────────────────────────────────────────────

function EventModal({ event, onClose, onDelete, onEdit, isAllEvents, onVolunteerCountLoaded }) {
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoadingVolunteers(true);
      const data = await getEventVolunteers(event.id);
      setVolunteers(data);
      onVolunteerCountLoaded?.(event.id, data.length);  // ← only this line added
    } catch (err) {
      console.error("Error loading volunteers", err);
    } finally {
      setLoadingVolunteers(false);
    }
  };

  if (!event) return null;

  const colors    = catColor[event.category] || catColor.Community;
  const sc        = statusStyle[event.status] || statusStyle.Active;
  const banner    = bannerSrc(event.bannerImage);
  const pct       = event.capacity > 0
    ? Math.min(100, Math.round((event.volunteers / event.capacity) * 100))
    : 0;
  const completed = isCompleted(event.status);

  const fillColor =
    pct >= 90 ? "#ef4444" :
    pct >= 60 ? "#f59e0b" :
                colors.accent;

  // Avatar color cycling for variety
  const avatarPalettes = [
    { bg: "#eff6ff", border: "#bfdbfe", text: "#2563eb" },
    { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a" },
    { bg: "#fdf4ff", border: "#e9d5ff", text: "#9333ea" },
    { bg: "#fff7ed", border: "#fed7aa", text: "#ea580c" },
    { bg: "#f0fdfa", border: "#99f6e4", text: "#0d9488" },
    { bg: "#fef2f2", border: "#fecaca", text: "#dc2626" },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,16,30,0.68)",
        backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "overlayIn 0.2s ease both",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <style>{`
        @keyframes overlayIn { from { opacity:0 } to { opacity:1 } }
        @keyframes modalIn   { from { opacity:0; transform:scale(0.93) translateY(18px) } to { opacity:1; transform:none } }
        .em-tab-btn { border:none; background:transparent; cursor:pointer; font-family:'Outfit',sans-serif; transition:all 0.18s; outline:none; }
        .em-vol-row:hover { background:#f1f5f9 !important; }
        .em-scroll::-webkit-scrollbar { width:4px; }
        .em-scroll::-webkit-scrollbar-track { background:transparent; }
        .em-scroll::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:99px; }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: "flex",
          width: "100%",
          maxWidth: 900,
          height: "min(86vh, 630px)",
          borderRadius: 26,
          overflow: "hidden",
          boxShadow: "0 60px 140px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
          animation: "modalIn 0.32s cubic-bezier(0.22,1.2,0.36,1) both",
        }}
      >

        {/* ── LEFT PANEL ── */}
        <div style={{ width: "40%", flexShrink: 0, position: "relative", overflow: "hidden" }}>
          {banner ? (
            <img src={banner} alt="Event banner" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: `linear-gradient(155deg, ${colors.dark} 0%, ${colors.accent} 70%, ${colors.light} 130%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 100, opacity: 0.28 }}>{catEmoji[event.category] || "📌"}</span>
            </div>
          )}

          {/* Gradient scrim */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.38) 50%, rgba(0,0,0,0.06) 100%)" }} />

          {/* Category pill */}
          <div style={{
            position: "absolute", top: 18, left: 18,
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(0,0,0,0.48)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 30, padding: "5px 12px",
          }}>
            <span style={{ fontSize: 13 }}>{catEmoji[event.category] || "📌"}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.92)", letterSpacing: "0.04em" }}>{event.category}</span>
          </div>

          {/* Bottom text + progress */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 22px 26px" }}>
            {/* Status */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: sc.bg, border: `1px solid ${sc.border}`,
              borderRadius: 20, padding: "4px 10px", marginBottom: 11,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.color, boxShadow: `0 0 6px ${sc.color}` }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{event.status}</span>
            </div>

            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 21, fontWeight: 800,
              color: "#fff", margin: "0 0 5px",
              lineHeight: 1.22, letterSpacing: "-0.02em",
              textShadow: "0 2px 18px rgba(0,0,0,0.7)",
            }}>{event.title}</h2>

            {event.organizerName && (
              <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                by {event.organizerName}
              </p>
            )}

            {/* Volunteer progress — always visible on left panel */}
            {event.capacity > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    🙋 Volunteers
                  </span>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif" }}>{event.volunteers}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>/{event.capacity}</span>
                    <span style={{
                      marginLeft: 6, fontSize: 9, fontWeight: 800,
                      color: fillColor, background: fillColor + "28",
                      border: `1px solid ${fillColor}44`,
                      padding: "1px 7px", borderRadius: 5,
                    }}>{pct}%</span>
                  </span>
                </div>

                <div style={{ position: "relative", height: 7, background: "rgba(255,255,255,0.15)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${fillColor}cc, ${fillColor})`,
                    borderRadius: 99,
                    boxShadow: `0 0 10px ${fillColor}66`,
                    transition: "width 0.9s cubic-bezier(0.34,1.56,0.64,1)",
                  }} />
                  {[25, 50, 75].map(p => (
                    <div key={p} style={{
                      position: "absolute", left: `${p}%`, top: 0, bottom: 0,
                      width: 1.5, background: "rgba(255,255,255,0.45)",
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex: 1, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Tab header */}
          <div style={{ borderBottom: "1.5px solid #f1f5f9", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px 0" }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[
                  { key: "details",    label: "📋 Details" },
                  { key: "volunteers", label: `🙋 Volunteers${volunteers.length ? ` (${volunteers.length})` : ""}` },
                ].map(tab => (
                  <button
                    key={tab.key}
                    className="em-tab-btn"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: "7px 15px 11px",
                      fontSize: 12, fontWeight: 700,
                      color: activeTab === tab.key ? colors.accent : "#94a3b8",
                      borderBottom: activeTab === tab.key ? `2.5px solid ${colors.accent}` : "2.5px solid transparent",
                      marginBottom: -1.5,
                      letterSpacing: "0.01em",
                    }}
                  >{tab.label}</button>
                ))}
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 30, height: 30, borderRadius: 9,
                  border: "1.5px solid #e2e8f0", background: "#f8fafc",
                  color: "#64748b", fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s", flexShrink: 0,
                }}
                onMouseOver={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                onMouseOut={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >✕</button>
            </div>
          </div>

          {/* Scrollable tab content */}
          <div className="em-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>

            {/* ── DETAILS TAB ── */}
            {activeTab === "details" && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 14 }}>
                  {[
                    { icon: "📅", label: "Date & Time",  value: event.date },
                    { icon: "📍", label: "Location",     value: event.location },
                    { icon: "🏛️", label: "Venue",        value: event.venue },
                    { icon: "🏙️", label: "City / State", value: [event.city, event.state].filter(Boolean).join(", ") },
                    { icon: "✉️", label: "Email",        value: event.contactEmail },
                    { icon: "📞", label: "Phone",        value: event.contactPhone },
                  ].filter(r => r.value).map((row, i) => (
                    <div key={row.label} style={{
                      display: "flex", alignItems: "center", gap: 11,
                      padding: "8px 10px", borderRadius: 10,
                      background: i % 2 === 0 ? "#f8fafc" : "transparent",
                    }}>
                      <span style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: colors.bg, border: `1px solid ${colors.light}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                      }}>{row.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>{row.label}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#334155", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {event.description && (
                  <div style={{ marginBottom: 13 }}>
                    <p style={{ margin: "0 0 6px", fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>About</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.75, background: "#f8fafc", borderRadius: 11, padding: "12px 13px", border: "1px solid #f1f5f9" }}>{event.description}</p>
                  </div>
                )}

                {(event.requirements || event.benefits) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {event.requirements && (
                      <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 11, padding: "11px 13px" }}>
                        <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 700, color: "#92400e", letterSpacing: "0.1em", textTransform: "uppercase" }}>⚠️ Requirements</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#78350f", lineHeight: 1.6 }}>{event.requirements}</p>
                      </div>
                    )}
                    {event.benefits && (
                      <div style={{ background: colors.bg, border: `1.5px solid ${colors.light}`, borderRadius: 11, padding: "11px 13px" }}>
                        <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 700, color: colors.dark, letterSpacing: "0.1em", textTransform: "uppercase" }}>✨ Benefits</p>
                        <p style={{ margin: 0, fontSize: 11, color: colors.dark, lineHeight: 1.6 }}>{event.benefits}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ── VOLUNTEERS TAB ── */}
            {activeTab === "volunteers" && (
              <>
                {/* Capacity summary card */}
                {event.capacity > 0 && (
                  <div style={{
                    background: `linear-gradient(135deg, ${colors.bg}, #fff)`,
                    border: `1.5px solid ${colors.light}`,
                    borderRadius: 14, padding: "13px 15px", marginBottom: 14,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Capacity Filled</p>
                      <p style={{ margin: "3px 0 0", fontSize: 26, fontWeight: 900, color: fillColor, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
                        {event.volunteers}
                        <span style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", marginLeft: 4 }}>/ {event.capacity}</span>
                      </p>
                    </div>
                    <div style={{ flex: 1, maxWidth: 150 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 5 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: fillColor }}>{pct}%</span>
                      </div>
                      <div style={{ height: 8, background: colors.light, borderRadius: 99, overflow: "hidden", position: "relative" }}>
                        <div style={{
                          height: "100%", width: `${pct}%`,
                          background: `linear-gradient(90deg, ${fillColor}99, ${fillColor})`,
                          borderRadius: 99,
                          boxShadow: `0 0 8px ${fillColor}55`,
                        }} />
                        {[25, 50, 75].map(p => (
                          <div key={p} style={{ position: "absolute", left: `${p}%`, top: 0, bottom: 0, width: 1.5, background: "#fff" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Volunteer list */}
                {loadingVolunteers ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ height: 58, borderRadius: 12, background: "#f1f5f9" }} />
                    ))}
                  </div>
                ) : volunteers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "42px 0" }}>
                    <div style={{ fontSize: 42, marginBottom: 10 }}>🙋</div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#94a3b8" }}>No volunteers yet</p>
                    <p style={{ margin: "5px 0 0", fontSize: 12, color: "#cbd5e1" }}>Registrations will appear here</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {volunteers.map((v, idx) => {
                      const pal = avatarPalettes[idx % avatarPalettes.length];
                      return (
                        <div
                          key={v.id}
                          className="em-vol-row"
                          style={{
                            display: "flex", alignItems: "center",
                            gap: 12, padding: "10px 13px",
                            borderRadius: 12,
                            background: "#f8fafc",
                            border: "1px solid #eef0f6",
                            transition: "background 0.15s",
                          }}
                        >
                          {/* Avatar */}
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: pal.bg,
                            border: `2px solid ${pal.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 14, fontWeight: 800, color: pal.text,
                            flexShrink: 0,
                          }}>
                            {v.user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>

                          {/* Name + meta */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                              {v.user?.name || "Anonymous"}
                            </p>
                            {(v.skills || v.availability) && (
                              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {[v.skills, v.availability].filter(Boolean).join(" · ")}
                              </p>
                            )}
                          </div>

                          {/* No status badge — all volunteers are accepted */}
                          <span style={{
                            fontSize: 10, fontWeight: 700,
                            color: "#059669",
                            background: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            padding: "3px 9px", borderRadius: 7,
                            letterSpacing: "0.04em",
                            flexShrink: 0,
                          }}>✓ Registered</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer actions */}
          <div style={{
            padding: "12px 22px 16px",
            borderTop: "1.5px solid #f1f5f9",
            display: "flex", gap: 10, flexShrink: 0,
            background: "#fff",
          }}>
            {isAllEvents ? (
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 11,
                  border: "1.5px solid #e2e8f0", background: "#f8fafc",
                  fontSize: 13, fontWeight: 700, color: "#475569",
                  cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  transition: "all 0.15s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseOut={e => e.currentTarget.style.background = "#f8fafc"}
              >👁️ Viewing Only</button>
            ) : (
              <>
                <button
                  onClick={() => !completed && onEdit(event)}
                  disabled={completed}
                  title={completed ? "Cannot edit completed events" : "Edit event"}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 11,
                    border: completed ? "1.5px solid #e2e8f0" : `1.5px solid ${colors.light}`,
                    background: completed ? "#f8fafc" : colors.bg,
                    fontSize: 13, fontWeight: 700,
                    color: completed ? "#cbd5e1" : colors.accent,
                    cursor: completed ? "not-allowed" : "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    transition: "all 0.15s",
                    opacity: completed ? 0.6 : 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                  onMouseOver={e => { if (!completed) e.currentTarget.style.background = colors.light; }}
                  onMouseOut={e => { if (!completed) e.currentTarget.style.background = colors.bg; }}
                >✏️ Edit Event</button>
                <button
                  onClick={() => !completed && onDelete(event.id, onClose)}
                  disabled={completed}
                  title={completed ? "Cannot delete completed events" : "Delete event"}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 11,
                    border: completed ? "1.5px solid #e2e8f0" : "1.5px solid #fecaca",
                    background: completed ? "#f8fafc" : "#fff1f2",
                    fontSize: 13, fontWeight: 700,
                    color: completed ? "#cbd5e1" : "#e11d48",
                    cursor: completed ? "not-allowed" : "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    transition: "all 0.15s",
                    opacity: completed ? 0.6 : 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                  onMouseOver={e => { if (!completed) e.currentTarget.style.background = "#ffe4e6"; }}
                  onMouseOut={e => { if (!completed) e.currentTarget.style.background = "#fff1f2"; }}
                >🗑️ Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared event normaliser ──────────────────────────────────────────────────

const getEventStatus = (startDateTime) => {
  if (!startDateTime) return "Active";
  const eventDate = new Date(startDateTime);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
  if (eventDate < today) return "Completed";
  if (diffDays > 30) return "Upcoming";
  return "Active";
};

const normaliseEvent = (e) => ({
  id: e.id,
  title: e.title || "Untitled Event",
  category: e.category || "Community",
  status: getEventStatus(e.startDateTime),
  capacity: e.noOfVol || 0,
  volunteers: e.volunteers || e.volunteerCount || 0,
  date: e.startDateTime ? new Date(e.startDateTime).toLocaleString() : "No date",
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
  startDateTime: e.startDateTime,
  endDateTime: e.endDateTime,
});

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ManageEventsPage({ setActivePage, onAction }) {
  const [activeTab, setActiveTab]         = useState("my");
  const [myEvents, setMyEvents]           = useState([]);
  const [allEvents, setAllEvents]         = useState([]);
  const [filter, setFilter]               = useState("All");
  const [search, setSearch]               = useState("");
  const [selectedEvent, setSelected]      = useState(null);
  const [editingEvent, setEditingEvent]   = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [volCounts, setVolCounts] = useState({});

  const filters = ["All", "Active", "Upcoming", "Completed"];

  useEffect(() => { fetchMyEvents(); }, []);
  useEffect(() => { if (activeTab === "all" && allEvents.length === 0) fetchAllEvents(); }, [activeTab]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const res = await getMyEvents();
      setMyEvents(res.map(normaliseEvent));
    } catch (err) {
      console.error("Error loading my events", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const res = await getAllEvents();
      setAllEvents(res.map(normaliseEvent));
    } catch (err) {
      console.error("Error loading all events", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFilter("All");
    setSearch("");
    setSelected(null);
    setLoading(tab === "all" && allEvents.length === 0);
  };

  const requestDelete = (id, afterClose) => {
    setConfirmDelete({ id, afterClose });
  };

  const confirmDeleteAction = async () => {
    const { id, afterClose } = confirmDelete;
    setConfirmDelete(null);
    afterClose?.();
    try {
      await deleteEvent(id);
      setMyEvents(prev => prev.filter(e => e.id !== id));
      showToast("Event deleted successfully!");
      onAction?.("Event deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete event.", "error");
    }
  };

  const handleEditSaved = (message, type = "success") => {
    showToast(message, type);
    fetchMyEvents();
  };

  const events      = activeTab === "my" ? myEvents : allEvents;
  const isAllEvents = activeTab === "all";

  const filtered = events.filter(e => {
    const matchFilter = filter === "All" || e.status === filter || e.status === filter.toUpperCase();
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All:       events.length,
    Active:    events.filter(e => e.status === "Active"    || e.status === "ONGOING").length,
    Upcoming:  events.filter(e => e.status === "Upcoming"  || e.status === "UPCOMING").length,
    Completed: events.filter(e => e.status === "Completed" || e.status === "COMPLETED").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes overlayIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn   { from { opacity: 0; transform: scale(0.92) translateY(32px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        @keyframes cardIn    { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes toastIn   { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .event-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(268px, 1fr)); gap: 16px; }
        @media (max-width: 700px) {
          .event-grid { grid-template-columns: 1fr; }
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
              <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>✦ Dashboard</p>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>Manage Events</h1>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{events.length} event{events.length !== 1 ? "s" : ""} total</p>
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
            >＋ New Event</button>
          </div>
        </div>

        {/* Toggle Tabs */}
        <div style={{
          background: "white", borderRadius: 16, border: "1.5px solid #e2e8f0",
          padding: "5px", marginBottom: 12,
          display: "flex", width: "100%", boxSizing: "border-box",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          {[{ key: "my", label: "My Events", icon: "👤" }, { key: "all", label: "All Events", icon: "🌐" }].map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabSwitch(tab.key)}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
                background: activeTab === tab.key
                  ? "linear-gradient(135deg, #0f766e, #0d9488 60%, #0ea5e9)"
                  : "transparent",
                fontSize: 13, fontWeight: 700,
                color: activeTab === tab.key ? "white" : "#64748b",
                cursor: "pointer", transition: "all 0.2s ease",
                fontFamily: "'Outfit', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                boxShadow: activeTab === tab.key ? "0 4px 14px rgba(13,148,136,0.35)" : "none",
                letterSpacing: "0.01em",
              }}
              onMouseOver={e => { if (activeTab !== tab.key) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseOut={e => { if (activeTab !== tab.key) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 15 }}>{tab.icon}</span>
              {tab.label}
              <span style={{
                background: activeTab === tab.key ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                color: activeTab === tab.key ? "white" : "#94a3b8",
                borderRadius: 99, fontSize: 10, fontWeight: 800,
                padding: "2px 8px", marginLeft: 2,
              }}>
                {tab.key === "my" ? myEvents.length : allEvents.length}
              </span>
            </button>
          ))}
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
                key={f} onClick={() => setFilter(f)}
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
                }}>{counts[f]}</span>
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#94a3b8" }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…"
              style={{
                paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                borderRadius: 9, border: "1.5px solid #e2e8f0",
                fontSize: 12, fontFamily: "'Outfit', sans-serif", color: "#334155",
                outline: "none", background: "#f8fafc", minWidth: 180,
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
                <EventCard
                  event={{ ...event, volunteers: volCounts[event.id] ?? event.volunteers }}
                  onClick={setSelected}
                  onDelete={requestDelete}
                  onEdit={setEditingEvent}
                  isAllEvents={isAllEvents}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <EventModal
              event={{
                ...selectedEvent,
                volunteers: volCounts[selectedEvent.id] ?? selectedEvent.volunteers
              }}
            onClose={() => setSelected(null)}
            onDelete={requestDelete}
            onEdit={(ev) => { setSelected(null); setEditingEvent(ev); }}
            isAllEvents={isAllEvents}
            onVolunteerCountLoaded={(id, count) =>
              setVolCounts(prev => ({ ...prev, [id]: count }))
            }
          />
      )}

      {/* Edit modal */}
      {editingEvent && (
        <EditModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSaved={handleEditSaved}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <ConfirmDialog
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </>
  );
}