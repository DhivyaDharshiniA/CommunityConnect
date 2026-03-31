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

  const config = {
    success: { bg: "#f0fdf4", border: "#bbf7d0", color: "#16a34a", icon: "✓" },
    error: { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", icon: "✕" },
  };
  const style = config[type] || config.success;

  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      display: "flex", alignItems: "center", gap: 12,
      background: style.bg, border: `1px solid ${style.border}`,
      borderRadius: 12, padding: "12px 20px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      animation: "toastSlideIn 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards",
      backdropFilter: "blur(8px)",
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: "50%",
        background: style.color, color: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700,
      }}>{style.icon}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#1f2937" }}>{message}</span>
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
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 20,
          padding: "28px 28px 24px",
          maxWidth: 400, width: "100%",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          fontFamily: "'Inter', sans-serif",
          animation: "scaleIn 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "#fef2f2", color: "#dc2626",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px",
          }}>🗑️</div>
          <h3 style={{
            fontSize: 18, fontWeight: 600, color: "#111827",
            margin: "0 0 8px", fontFamily: "'Inter', sans-serif",
          }}>Delete Event</h3>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, margin: 0 }}>
            This action cannot be undone. The event and all related data will be permanently removed.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              border: "1px solid #e5e7eb", background: "white",
              fontSize: 13, fontWeight: 500, color: "#374151",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#f9fafb"}
            onMouseOut={e => e.currentTarget.style.background = "white"}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              border: "none", background: "#dc2626",
              fontSize: 13, fontWeight: 500, color: "white",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#b91c1c"}
            onMouseOut={e => e.currentTarget.style.background = "#dc2626"}
          >Delete</button>
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
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1px solid #e5e7eb", fontSize: 13,
    fontFamily: "'Inter', sans-serif", color: "#1f2937",
    outline: "none", background: "#ffffff", boxSizing: "border-box",
    transition: "all 0.2s",
  };
  const labelStyle = {
    fontSize: 11, fontWeight: 600, color: "#6b7280",
    letterSpacing: "0.03em", textTransform: "uppercase",
    display: "block", marginBottom: 6,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1500,
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 24,
          width: "100%", maxWidth: 680,
          maxHeight: "90vh", display: "flex", flexDirection: "column",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          fontFamily: "'Inter', sans-serif",
          overflow: "hidden",
          animation: "scaleIn 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid #f3f4f6",
          background: "white",
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: colors.accent, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Edit Event
            </p>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "4px 0 0" }}>
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: "1px solid #e5e7eb", background: "white",
              color: "#6b7280", fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#d1d5db"; }}
            onMouseOut={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
          >✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
              <label style={labelStyle}>Organizer</label>
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

        <div style={{
          padding: "16px 24px", borderTop: "1px solid #f3f4f6",
          display: "flex", gap: 12, background: "white",
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              border: "1px solid #e5e7eb", background: "white",
              fontSize: 13, fontWeight: 500, color: "#374151",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              flex: 2, padding: "10px 0", borderRadius: 10,
              border: "none", background: colors.accent,
              fontSize: 13, fontWeight: 500, color: "white",
              cursor: saving ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
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
        background: "white",
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = colors.accent;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e5e7eb";
      }}
    >
      <div style={{ height: 140, position: "relative", overflow: "hidden", flexShrink: 0, background: colors.dark }}>
        {banner ? (
          <img src={banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(135deg, ${colors.dark}, ${colors.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 48, opacity: 0.3 }}>{catEmoji[event.category] || "📌"}</span>
          </div>
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
        }} />

        <div style={{
          position: "absolute", top: 12, right: 12,
          background: sc.bg, border: `1px solid ${sc.border}`,
          borderRadius: 20, padding: "4px 10px",
          backdropFilter: "blur(4px)",
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: sc.color, textTransform: "uppercase" }}>{event.status}</span>
        </div>

        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          borderRadius: 20, padding: "4px 10px",
        }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: "white" }}>{catEmoji[event.category]} {event.category}</span>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px" }}>
          <h3 style={{
            fontSize: 16, fontWeight: 600, color: "white",
            margin: "0 0 6px", lineHeight: 1.3,
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}>{event.title}</h3>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
            📅 {event.date}
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 16px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 12 }}>📍</span>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{event.location}</span>
        </div>

        {event.capacity > 0 && (
          <div style={{ marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: "#6b7280" }}>Volunteers</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: fillColor }}>
                {event.volunteers}/{event.capacity} ({pct}%)
              </span>
            </div>
            <div style={{ height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${pct}%`, height: "100%",
                background: fillColor,
                borderRadius: 3,
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, padding: "12px 16px 16px", borderTop: "1px solid #f3f4f6" }}>
        {isAllEvents ? (
          <button
            onClick={e => { e.stopPropagation(); onClick(event); }}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 8,
              border: `1px solid ${colors.light}`,
              background: colors.bg,
              fontSize: 12, fontWeight: 500, color: colors.accent,
              cursor: "pointer", transition: "all 0.2s",
            }}
          >View Details</button>
        ) : (
          <>
            <button
              onClick={e => { e.stopPropagation(); if (!completed) onEdit(event); }}
              disabled={completed}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 8,
                border: "1px solid #e5e7eb", background: completed ? "#f9fafb" : "white",
                fontSize: 12, fontWeight: 500, color: completed ? "#9ca3af" : "#374151",
                cursor: completed ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >Edit</button>
            <button
              onClick={e => { e.stopPropagation(); if (!completed) onDelete(event.id, null); }}
              disabled={completed}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 8,
                border: completed ? "1px solid #e5e7eb" : "1px solid #fecaca",
                background: completed ? "#f9fafb" : "#fef2f2",
                fontSize: 12, fontWeight: 500, color: completed ? "#9ca3af" : "#dc2626",
                cursor: completed ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >Delete</button>
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
      onVolunteerCountLoaded?.(event.id, data.length);
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

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.2s ease",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
        @keyframes toastSlideIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: "flex",
          width: "100%",
          maxWidth: 1000,
          height: "min(85vh, 700px)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
          animation: "scaleIn 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
        }}
      >
        <div style={{ width: "38%", flexShrink: 0, position: "relative", overflow: "hidden" }}>
          {banner ? (
            <img src={banner} alt="Event banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: `linear-gradient(135deg, ${colors.dark}, ${colors.accent})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 80, opacity: 0.3 }}>{catEmoji[event.category] || "📌"}</span>
            </div>
          )}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          }} />

          <div style={{
            position: "absolute", top: 20, left: 20,
            background: sc.bg, border: `1px solid ${sc.border}`,
            borderRadius: 20, padding: "6px 12px",
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: sc.color }}>{event.status}</span>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
              borderRadius: 20, padding: "4px 12px", marginBottom: 12,
            }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: "white" }}>{catEmoji[event.category]} {event.category}</span>
            </div>
            <h2 style={{
              fontSize: 24, fontWeight: 700, color: "white",
              margin: "0 0 8px", lineHeight: 1.3,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}>{event.title}</h2>
            {event.organizerName && (
              <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                Organized by {event.organizerName}
              </p>
            )}
            {event.capacity > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Volunteers</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>
                    {event.volunteers}/{event.capacity} ({pct}%)
                  </span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%",
                    background: fillColor,
                    borderRadius: 4,
                  }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, background: "white", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ borderBottom: "1px solid #f3f4f6", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => setActiveTab("details")}
                  style={{
                    padding: "8px 16px", borderRadius: 8,
                    border: "none", background: activeTab === "details" ? colors.bg : "transparent",
                    fontSize: 13, fontWeight: 500, color: activeTab === "details" ? colors.accent : "#6b7280",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >Details</button>
                <button
                  onClick={() => setActiveTab("volunteers")}
                  style={{
                    padding: "8px 16px", borderRadius: 8,
                    border: "none", background: activeTab === "volunteers" ? colors.bg : "transparent",
                    fontSize: 13, fontWeight: 500, color: activeTab === "volunteers" ? colors.accent : "#6b7280",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >Volunteers {volunteers.length > 0 && `(${volunteers.length})`}</button>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: "1px solid #e5e7eb", background: "white",
                  color: "#6b7280", fontSize: 16, cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >✕</button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {activeTab === "details" && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  <InfoRow icon="📅" label="Date & Time" value={event.date} colors={colors} />
                  <InfoRow icon="📍" label="Location" value={event.location} colors={colors} />
                  {event.venue && <InfoRow icon="🏛️" label="Venue" value={event.venue} colors={colors} />}
                  {event.city && event.state && <InfoRow icon="🏙️" label="City/State" value={`${event.city}, ${event.state}`} colors={colors} />}
                  {event.contactEmail && <InfoRow icon="✉️" label="Email" value={event.contactEmail} colors={colors} />}
                  {event.contactPhone && <InfoRow icon="📞" label="Phone" value={event.contactPhone} colors={colors} />}
                </div>

                {event.description && (
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>About</h4>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{event.description}</p>
                  </div>
                )}

                {(event.requirements || event.benefits) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {event.requirements && (
                      <div style={{ background: "#fffbeb", borderRadius: 12, padding: "12px 16px", borderLeft: `3px solid #f59e0b` }}>
                        <h4 style={{ fontSize: 11, fontWeight: 600, color: "#92400e", margin: "0 0 6px", textTransform: "uppercase" }}>Requirements</h4>
                        <p style={{ fontSize: 12, color: "#78350f", margin: 0 }}>{event.requirements}</p>
                      </div>
                    )}
                    {event.benefits && (
                      <div style={{ background: colors.bg, borderRadius: 12, padding: "12px 16px", borderLeft: `3px solid ${colors.accent}` }}>
                        <h4 style={{ fontSize: 11, fontWeight: 600, color: colors.dark, margin: "0 0 6px", textTransform: "uppercase" }}>Benefits</h4>
                        <p style={{ fontSize: 12, color: colors.dark, margin: 0 }}>{event.benefits}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === "volunteers" && (
              <>
                {loadingVolunteers ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <div style={{ width: 32, height: 32, border: "2px solid #e5e7eb", borderTopColor: colors.accent, borderRadius: "50%", animation: "spin 0.6s linear infinite", margin: "0 auto 12px" }} />
                    <p style={{ fontSize: 13, color: "#6b7280" }}>Loading volunteers...</p>
                  </div>
                ) : volunteers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 20px" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🙋</div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#374151", margin: 0 }}>No volunteers yet</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Registrations will appear here</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {volunteers.map((v, idx) => (
                      <div key={v.id} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px", borderRadius: 12,
                        background: "#f9fafb", border: "1px solid #f3f4f6",
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%",
                          background: colors.bg, border: `2px solid ${colors.light}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 600, color: colors.accent,
                        }}>
                          {v.user?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>
                            {v.user?.name || "Anonymous Volunteer"}
                          </p>
                          {(v.skills || v.availability) && (
                            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#6b7280" }}>
                              {[v.skills, v.availability].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 600, color: "#059669",
                          background: "#ecfdf5", padding: "4px 8px", borderRadius: 6,
                        }}>Registered</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{
            padding: "16px 24px", borderTop: "1px solid #f3f4f6",
            display: "flex", gap: 12, background: "white",
          }}>
            {isAllEvents ? (
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10,
                  border: "1px solid #e5e7eb", background: "white",
                  fontSize: 13, fontWeight: 500, color: "#374151",
                  cursor: "pointer",
                }}
              >Close</button>
            ) : (
              <>
                <button
                  onClick={() => !completed && onEdit(event)}
                  disabled={completed}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 10,
                    border: completed ? "1px solid #e5e7eb" : `1px solid ${colors.light}`,
                    background: completed ? "#f9fafb" : colors.bg,
                    fontSize: 13, fontWeight: 500, color: completed ? "#9ca3af" : colors.accent,
                    cursor: completed ? "not-allowed" : "pointer",
                  }}
                >Edit Event</button>
                <button
                  onClick={() => !completed && onDelete(event.id, onClose)}
                  disabled={completed}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 10,
                    border: completed ? "1px solid #e5e7eb" : "1px solid #fecaca",
                    background: completed ? "#f9fafb" : "#fef2f2",
                    fontSize: 13, fontWeight: 500, color: completed ? "#9ca3af" : "#dc2626",
                    cursor: completed ? "not-allowed" : "pointer",
                  }}
                >Delete Event</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, colors }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "8px 12px", borderRadius: 10,
      background: "#f9fafb", border: "1px solid #f3f4f6",
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 8,
        background: colors.bg, border: `1px solid ${colors.light}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14,
      }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 500, color: "#111827" }}>{value}</p>
      </div>
    </div>
  );
}

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
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        background: "linear-gradient(135deg, #0f766e, #0d9488 50%, #0ea5e9)",
        borderRadius: 20, padding: "32px 32px", marginBottom: 24,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
                Dashboard
              </p>
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "white", margin: "8px 0 4px", letterSpacing: "-0.02em" }}>
                Manage Events
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                {events.length} event{events.length !== 1 ? "s" : ""} • {counts.Active} active
              </p>
            </div>
            <button
              onClick={() => setActivePage("create-event")}
              style={{
                background: "white", border: "none", borderRadius: 12,
                padding: "10px 24px", fontSize: 14, fontWeight: 600,
                color: "#0d9488", cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              + Create New Event
            </button>
          </div>
        </div>
      </div>

      <div style={{
        background: "white", borderRadius: 16, border: "1px solid #e5e7eb",
        padding: "4px", marginBottom: 20,
        display: "flex", gap: 4,
      }}>
        <button
          onClick={() => handleTabSwitch("my")}
          style={{
            flex: 1, padding: "10px", borderRadius: 12, border: "none",
            background: activeTab === "my" ? "#0d9488" : "transparent",
            fontSize: 14, fontWeight: 500, color: activeTab === "my" ? "white" : "#6b7280",
            cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <span>👤</span> My Events
          <span style={{
            background: activeTab === "my" ? "rgba(255,255,255,0.2)" : "#f3f4f6",
            borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600,
          }}>{myEvents.length}</span>
        </button>
        <button
          onClick={() => handleTabSwitch("all")}
          style={{
            flex: 1, padding: "10px", borderRadius: 12, border: "none",
            background: activeTab === "all" ? "#0d9488" : "transparent",
            fontSize: 14, fontWeight: 500, color: activeTab === "all" ? "white" : "#6b7280",
            cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <span>🌐</span> All Events
          <span style={{
            background: activeTab === "all" ? "rgba(255,255,255,0.2)" : "#f3f4f6",
            borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 600,
          }}>{allEvents.length}</span>
        </button>
      </div>

      <div style={{
        background: "white", borderRadius: 12, border: "1px solid #e5e7eb",
        padding: "16px", marginBottom: 24,
        display: "flex", flexWrap: "wrap", gap: 12,
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {filters.map(f => (
            <button
              key={f} onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px", borderRadius: 8,
                border: filter === f ? "1px solid #0d9488" : "1px solid #e5e7eb",
                background: filter === f ? "#f0fdfa" : "white",
                fontSize: 13, fontWeight: 500, color: filter === f ? "#0d9488" : "#6b7280",
                cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {f}
              <span style={{
                background: filter === f ? "#0d9488" : "#f3f4f6",
                color: filter === f ? "white" : "#6b7280",
                borderRadius: 12, padding: "0px 6px", fontSize: 11, fontWeight: 600,
              }}>{counts[f]}</span>
            </button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#9ca3af" }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events..."
            style={{
              padding: "8px 12px 8px 36px", borderRadius: 8,
              border: "1px solid #e5e7eb", fontSize: 13,
              width: 220, outline: "none", transition: "all 0.2s",
            }}
            onFocus={e => e.currentTarget.style.borderColor = "#0d9488"}
            onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 16, border: "1px solid #e5e7eb" }}>
          <div style={{ width: 40, height: 40, border: "2px solid #e5e7eb", borderTopColor: "#0d9488", borderRadius: "50%", animation: "spin 0.6s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 14, color: "#6b7280" }}>Loading events...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 16, border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 16, fontWeight: 500, color: "#374151", margin: 0 }}>No events found</p>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
            {search ? `No results for "${search}"` : "Create your first event to get started"}
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}>
          {filtered.map((event, i) => (
            <div key={event.id} style={{ animation: `fadeIn 0.3s ease ${i * 0.03}s both` }}>
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

      {editingEvent && (
        <EditModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSaved={handleEditSaved}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
}