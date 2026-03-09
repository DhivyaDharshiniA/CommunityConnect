import { useState, memo } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const T = {
  orange:       "#f97316",
  orangeDark:   "#ea580c",
  orangeDeeper: "#c2410c",
  orangeLight:  "#fff7ed",
  orangeMid:    "#fed7aa",
  orangeGlow:   "rgba(249,115,22,0.14)",
  orangeBorder: "rgba(249,115,22,0.35)",
  grad:         "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",

  white:        "#ffffff",
  bg:           "#fafaf9",
  bgAlt:        "#f5f5f4",
  border:       "#e7e5e4",
  borderHover:  "#d6d3d1",

  text:         "#1c1917",
  textSub:      "#44403c",
  textMuted:    "#78716c",
  textLight:    "#a8a29e",

  error:        "#dc2626",
  errorBg:      "#fef2f2",
  errorBorder:  "#fecaca",
};

const Field = ({ id, label, error, focused, optional, hint, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: error ? T.error : T.textSub, letterSpacing: "0.01em" }}>
        {label}
        {!optional && <span style={{ color: T.error, marginLeft: 3 }}>*</span>}
      </label>
      {optional && (
        <span style={{ fontSize: 10.5, color: T.textLight, fontFamily: "'DM Sans', sans-serif", background: T.bgAlt, padding: "1px 7px", borderRadius: 20, border: `1px solid ${T.border}` }}>
          Optional
        </span>
      )}
    </div>
    {children}
    {hint && !error && <p style={{ margin: 0, fontSize: 11.5, color: T.textLight, fontFamily: "'DM Sans', sans-serif" }}>{hint}</p>}
    {error && (
      <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.errorBg, border: `1px solid ${T.errorBorder}`, borderRadius: 6, padding: "5px 10px" }}>
        <span style={{ color: T.error, fontSize: 12 }}>●</span>
        <span style={{ fontSize: 11.5, color: T.error, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{error}</span>
      </div>
    )}
  </div>
);

function inputStyle(id, isError, focused) {
  const isFoc = focused === id;
  return {
    width: "100%", padding: "10px 13px", borderRadius: 8,
    border: `1.5px solid ${isError ? T.error : isFoc ? T.orange : T.border}`,
    background: isFoc ? "#fffbf7" : T.white,
    fontSize: 13.5, color: T.text, outline: "none",
    transition: "all 0.18s", fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
    boxShadow: isFoc ? `0 0 0 3px ${T.orangeGlow}` : isError ? "0 0 0 3px rgba(220,38,38,0.08)" : "none",
  };
}

function LocationPicker({ setForm, setMarker }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setMarker([lat, lng]);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        setForm(prev => ({
          ...prev,
          location: data.display_name || "",
          city: data.address.city || data.address.town || data.address.village || "",
          state: data.address.state || "",
        }));
      } catch (err) { console.error(err); }
    },
  });
  return null;
}

const EventLocationMap = memo(function EventLocationMap({ marker, setMarker, setForm, searchLocation, setSearchLocation, handleLocationSearch }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Search a place or address…"
          value={searchLocation}
          onChange={e => setSearchLocation(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleLocationSearch())}
          style={{ flex: 1, padding: "10px 13px", borderRadius: 8, border: `1.5px solid ${T.border}`, background: T.white, color: T.text, fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "all 0.18s" }}
          onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = `0 0 0 3px ${T.orangeGlow}`; }}
          onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
        />
        <button type="button" onClick={handleLocationSearch}
          style={{ background: T.grad, border: "none", color: "white", padding: "0 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(249,115,22,0.3)", transition: "opacity 0.15s" }}
          onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
          onMouseOut={e => e.currentTarget.style.opacity = "1"}>
          Search
        </button>
      </div>
      <div style={{ height: 260, borderRadius: 10, overflow: "hidden", border: `1.5px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <MapContainer center={marker} zoom={6} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker setForm={setForm} setMarker={setMarker} />
          <Marker position={marker} />
        </MapContainer>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: T.textLight, fontFamily: "'DM Sans', sans-serif" }}>
        <span style={{ color: T.orange }}>📍</span> Click the map to auto-fill venue, city, and state
      </p>
    </div>
  );
});

function StepHeader({ number, title, description }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, paddingBottom: 20, marginBottom: 24, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: T.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", fontFamily: "'DM Sans', sans-serif", flexShrink: 0, marginTop: 2, boxShadow: "0 3px 10px rgba(249,115,22,0.35)" }}>
        {number}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: T.text, fontFamily: "'Fraunces', serif", letterSpacing: "-0.02em" }}>{title}</h3>
        {description && <p style={{ margin: "3px 0 0", fontSize: 12.5, color: T.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{description}</p>}
      </div>
    </div>
  );
}

function Section({ number, title, description, children, delay = 0 }) {
  return (
    <div className="section-card" style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, padding: "28px 30px", boxShadow: "0 1px 3px rgba(28,25,23,0.05), 0 4px 16px rgba(28,25,23,0.03)", animationDelay: `${delay}s` }}>
      <StepHeader number={number} title={title} description={description} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>{children}</div>
    </div>
  );
}

const cats = [
  { name: "Environment", icon: "🌿" },
  { name: "Health",      icon: "❤️" },
  { name: "Education",   icon: "📚" },
  { name: "Sports",      icon: "🏆" },
  { name: "Community",   icon: "🏘️" },
];

function ProgressBar({ steps = 5 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {Array.from({ length: steps }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", fontFamily: "'DM Sans', sans-serif", flexShrink: 0, zIndex: 1, boxShadow: "0 2px 8px rgba(249,115,22,0.3)" }}>
            {i + 1}
          </div>
          {i < steps - 1 && <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${T.orangeMid}, ${T.orangeLight})`, margin: "0 -1px" }} />}
        </div>
      ))}
    </div>
  );
}

export default function CreateEventPage({ onSuccess }) {
  const [form, setForm] = useState({ title: "", category: "", date: "", location: "", city: "", state: "", organizerName: "", contactEmail: "", contactPhone: "", description: "", requirements: "", benefits: "", bannerFile: null });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [focused, setFocused] = useState(null);
  const [marker, setMarker] = useState([20.5937, 78.9629]);
  const [searchLocation, setSearchLocation] = useState("");

  const validate = () => {
    const e = {};
    if (!form.title.trim())         e.title         = "Event title is required";
    if (!form.category)             e.category      = "Please select a category";
    if (!form.date)                 e.date          = "Date and time are required";
    if (!form.location.trim())      e.location      = "Venue address is required";
    if (!form.city.trim())          e.city          = "City is required";
    if (!form.state.trim())         e.state         = "State is required";
    if (!form.organizerName.trim()) e.organizerName = "Organizer name is required";
    if (!form.contactEmail.trim())  e.contactEmail  = "Contact email is required";
    if (!form.contactPhone.trim())  e.contactPhone  = "Contact phone is required";
    if (!form.description.trim())   e.description   = "Event description is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setSubmitting(true);
      const data = new FormData();
      Object.entries({ title: form.title, description: form.description, category: form.category, venue: form.location, city: form.city, state: form.state, organizerName: form.organizerName, contactEmail: form.contactEmail, contactPhone: form.contactPhone, startDateTime: form.date + ":00", endDateTime: form.date + ":00", requirements: form.requirements || "", benefits: form.benefits || "" }).forEach(([k, v]) => data.append(k, v));
      if (form.bannerFile) data.append("bannerImage", form.bannerFile);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/events/create", data, { headers: { Authorization: "Bearer " + token } });
      setSubmitting(false);
      if (onSuccess) onSuccess("Event created successfully!");
      setForm({ title: "", category: "", date: "", location: "", city: "", state: "", organizerName: "", contactEmail: "", contactPhone: "", description: "", requirements: "", benefits: "", bannerFile: null });
      setBannerPreview(null);
    } catch (err) { console.error(err); setSubmitting(false); alert("Failed to create event."); }
  };

  const handleLocationSearch = async () => {
    if (!searchLocation) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`);
      const data = await res.json();
      if (data.length > 0) { setMarker([parseFloat(data[0].lat), parseFloat(data[0].lon)]); setForm(prev => ({ ...prev, location: data[0].display_name })); }
    } catch (err) { console.error(err); }
  };

  const set  = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const clrE = (key)      => setErrors(prev => ({ ...prev, [key]: "" }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { background: ${T.bg}; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: ${T.borderHover}; border-radius: 99px; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .two-col { grid-template-columns: 1fr; } }

        .cat-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .cat-pill {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 15px; border-radius: 8px;
          border: 1.5px solid ${T.border}; background: ${T.white};
          font-size: 13px; font-weight: 500; color: ${T.textSub};
          cursor: pointer; transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 1px 2px rgba(28,25,23,0.04);
        }
        .cat-pill:hover { border-color: ${T.orangeBorder}; color: ${T.orangeDark}; background: ${T.orangeLight}; box-shadow: 0 0 0 3px ${T.orangeGlow}; }
        .cat-pill.active { border-color: ${T.orange}; background: ${T.orangeLight}; color: ${T.orangeDark}; font-weight: 600; box-shadow: 0 0 0 3px ${T.orangeGlow}; }

        .drop-zone {
          border: 2px dashed ${T.border}; border-radius: 10px;
          padding: 36px 24px; display: flex; flex-direction: column;
          align-items: center; gap: 10px; cursor: pointer;
          transition: all 0.2s; background: ${T.bg};
          position: relative; text-align: center;
        }
        .drop-zone:hover { border-color: ${T.orange}; background: ${T.orangeLight}; }
        .drop-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .submit-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white; border: none; padding: 13px 36px; border-radius: 10px;
          font-size: 14.5px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.18s;
          box-shadow: 0 2px 8px rgba(249,115,22,0.35);
        }
        .submit-btn:hover:not(:disabled) { background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(249,115,22,0.45); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .section-card { animation: slideUp 0.35s ease both; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>

        {/* NAV */}
        <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 3px rgba(28,25,23,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: "0 2px 8px rgba(249,115,22,0.35)" }}>🌿</div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: "-0.03em" }}>VolunteerHub</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12.5, color: T.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Create new event</span>
            <span style={{ color: T.border }}>·</span>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.orange, boxShadow: `0 0 0 3px ${T.orangeLight}` }} />
          </div>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "36px 24px 72px" }}>

          {/* HEADER */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: T.orangeLight, border: `1px solid ${T.orangeBorder}`, borderRadius: 20, padding: "4px 12px", marginBottom: 14 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.orange }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: T.orangeDark, letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>Event Management</span>
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 800, color: T.text, margin: "0 0 10px", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              Create a New Event
            </h1>
            <p style={{ fontSize: 14.5, color: T.textMuted, fontFamily: "'DM Sans', sans-serif", margin: 0, maxWidth: 460, lineHeight: 1.65 }}>
              Fill in the details below to publish your event and connect with your community.
            </p>
          </div>

          <ProgressBar steps={5} />

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <Section number="1" title="Basic Information" description="Event name, category, and schedule" delay={0.04}>
              <Field id="title" label="Event Title" error={errors.title} focused={focused} hint="Be descriptive — a great title improves discoverability">
                <input placeholder="e.g. Annual Beach Cleanup Drive" value={form.title}
                  onChange={e => { set("title", e.target.value); clrE("title"); }}
                  onFocus={() => setFocused("title")} onBlur={() => setFocused(null)}
                  style={inputStyle("title", errors.title, focused)} />
              </Field>
              <Field id="category" label="Category" error={errors.category} focused={focused}>
                <div className="cat-pills">
                  {cats.map(c => (
                    <button key={c.name} type="button" className={`cat-pill ${form.category === c.name ? "active" : ""}`}
                      onClick={() => { set("category", c.name); clrE("category"); }}>
                      <span style={{ fontSize: 15 }}>{c.icon}</span> {c.name}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.errorBg, border: `1px solid ${T.errorBorder}`, borderRadius: 6, padding: "5px 10px" }}>
                    <span style={{ color: T.error, fontSize: 12 }}>●</span>
                    <span style={{ fontSize: 11.5, color: T.error, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{errors.category}</span>
                  </div>
                )}
              </Field>
              <Field id="date" label="Date & Time" error={errors.date} focused={focused}>
                <input type="datetime-local" value={form.date}
                  onChange={e => { set("date", e.target.value); clrE("date"); }}
                  onFocus={() => setFocused("date")} onBlur={() => setFocused(null)}
                  style={{ ...inputStyle("date", errors.date, focused), colorScheme: "light" }} />
              </Field>
            </Section>

            <Section number="2" title="Event Location" description="Set venue details using the map or enter manually" delay={0.08}>
              <EventLocationMap marker={marker} setMarker={setMarker} setForm={setForm} searchLocation={searchLocation} setSearchLocation={setSearchLocation} handleLocationSearch={handleLocationSearch} />
              <Field id="location" label="Venue / Full Address" error={errors.location} focused={focused}>
                <input placeholder="e.g. Juhu Beach, Link Road, Mumbai" value={form.location}
                  onChange={e => { set("location", e.target.value); clrE("location"); }}
                  onFocus={() => setFocused("location")} onBlur={() => setFocused(null)}
                  style={inputStyle("location", errors.location, focused)} />
              </Field>
              <div className="two-col">
                <Field id="city" label="City" error={errors.city} focused={focused}>
                  <input placeholder="Mumbai" value={form.city} onChange={e => { set("city", e.target.value); clrE("city"); }} onFocus={() => setFocused("city")} onBlur={() => setFocused(null)} style={inputStyle("city", errors.city, focused)} />
                </Field>
                <Field id="state" label="State" error={errors.state} focused={focused}>
                  <input placeholder="Maharashtra" value={form.state} onChange={e => { set("state", e.target.value); clrE("state"); }} onFocus={() => setFocused("state")} onBlur={() => setFocused(null)} style={inputStyle("state", errors.state, focused)} />
                </Field>
              </div>
            </Section>

            <Section number="3" title="Organizer Details" description="Contact information for this event" delay={0.12}>
              <Field id="organizerName" label="Organizer Name" error={errors.organizerName} focused={focused}>
                <input placeholder="Your name or organization name" value={form.organizerName} onChange={e => { set("organizerName", e.target.value); clrE("organizerName"); }} onFocus={() => setFocused("organizerName")} onBlur={() => setFocused(null)} style={inputStyle("organizerName", errors.organizerName, focused)} />
              </Field>
              <div className="two-col">
                <Field id="contactEmail" label="Contact Email" error={errors.contactEmail} focused={focused}>
                  <input type="email" placeholder="hello@example.com" value={form.contactEmail} onChange={e => { set("contactEmail", e.target.value); clrE("contactEmail"); }} onFocus={() => setFocused("contactEmail")} onBlur={() => setFocused(null)} style={inputStyle("contactEmail", errors.contactEmail, focused)} />
                </Field>
                <Field id="contactPhone" label="Contact Phone" error={errors.contactPhone} focused={focused}>
                  <input type="tel" placeholder="+91 98765 43210" value={form.contactPhone} onChange={e => { set("contactPhone", e.target.value); clrE("contactPhone"); }} onFocus={() => setFocused("contactPhone")} onBlur={() => setFocused(null)} style={inputStyle("contactPhone", errors.contactPhone, focused)} />
                </Field>
              </div>
            </Section>

            <Section number="4" title="About the Event" description="Help volunteers understand what they're signing up for" delay={0.16}>
              <Field id="description" label="Event Description" error={errors.description} focused={focused} hint="Describe the event goals, what to expect, and why it matters">
                <textarea rows={5} placeholder="Describe what this event is about…" value={form.description} onChange={e => { set("description", e.target.value); clrE("description"); }} onFocus={() => setFocused("description")} onBlur={() => setFocused(null)} style={{ ...inputStyle("description", errors.description, focused), resize: "vertical", minHeight: 110 }} />
              </Field>
              <div className="two-col">
                <Field id="requirements" label="Requirements" optional focused={focused} hint="What should volunteers bring or prepare?">
                  <textarea rows={3} placeholder="e.g. Comfortable shoes, water bottle…" value={form.requirements} onChange={e => set("requirements", e.target.value)} onFocus={() => setFocused("requirements")} onBlur={() => setFocused(null)} style={{ ...inputStyle("requirements", false, focused), resize: "vertical" }} />
                </Field>
                <Field id="benefits" label="Benefits" optional focused={focused} hint="What will participants gain?">
                  <textarea rows={3} placeholder="e.g. Certificate, lunch, networking…" value={form.benefits} onChange={e => set("benefits", e.target.value)} onFocus={() => setFocused("benefits")} onBlur={() => setFocused(null)} style={{ ...inputStyle("benefits", false, focused), resize: "vertical" }} />
                </Field>
              </div>
            </Section>

            <Section number="5" title="Banner Image" description="Upload a cover image that represents your event" delay={0.2}>
              {bannerPreview ? (
                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1.5px solid ${T.border}` }}>
                  <img src={bannerPreview} alt="Banner preview" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)", pointerEvents: "none" }} />
                  <button type="button" onClick={() => { setBannerPreview(null); set("bannerFile", null); }}
                    style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.92)", border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, backdropFilter: "blur(6px)" }}>
                    ✕ Remove
                  </button>
                  <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 11.5, color: "rgba(255,255,255,0.9)", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>✓ Banner uploaded</div>
                </div>
              ) : (
                <div className="drop-zone">
                  <input type="file" accept="image/*" onChange={e => { const file = e.target.files[0]; if (file) { set("bannerFile", file); setBannerPreview(URL.createObjectURL(file)); } }} />
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: T.orangeLight, border: `1.5px solid ${T.orangeBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🖼️</div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T.textSub, fontFamily: "'DM Sans', sans-serif" }}>
                    Drop an image or <span style={{ color: T.orange, textDecoration: "underline", textDecorationStyle: "dotted" }}>browse files</span>
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: T.textLight, fontFamily: "'DM Sans', sans-serif" }}>PNG, JPG or WEBP · Recommended 1200 × 400 px</p>
                </div>
              )}
            </Section>

            {/* SUBMIT FOOTER */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, boxShadow: "0 1px 3px rgba(28,25,23,0.04)" }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text, fontFamily: "'DM Sans', sans-serif" }}>Ready to publish?</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: T.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Fields marked with <span style={{ color: T.error }}>*</span> are required</p>
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? (
                  <><span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />Publishing…</>
                ) : <>Publish Event &nbsp;→</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}