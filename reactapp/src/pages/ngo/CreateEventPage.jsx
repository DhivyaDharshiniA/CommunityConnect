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

// ✅ Defined OUTSIDE the parent component — prevents remount on every keystroke
const Field = ({ id, label, error, focused, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: error ? "#ef4444" : focused === id ? "#0d9488" : "#64748b",
      transition: "color 0.2s",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {label}
    </label>
    {children}
    {error && (
      <span style={{ fontSize: 11, color: "#ef4444", fontFamily: "'DM Sans', sans-serif" }}>
        ↑ {error}
      </span>
    )}
  </div>
);

// ✅ Stable pure function outside — no re-creation on render
function inputStyle(id, isError, focused) {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1.5px solid ${isError ? "#fca5a5" : focused === id ? "#0d9488" : "#e2e8f0"}`,
    background: focused === id ? "#f0fdfa" : "#f8fafc",
    fontSize: 14,
    color: "#1e293b",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box",
    boxShadow: focused === id ? "0 0 0 3px rgba(13,148,136,0.1)" : "none",
  };
}

function LocationPicker({ setForm, setMarker }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setMarker([lat, lng]);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        const city = data.address.city || data.address.town || data.address.village || "";
        const state = data.address.state || "";
        const venue = data.display_name || "";
        setForm((prev) => ({ ...prev, location: venue, city, state }));
      } catch (err) {
        console.error(err);
      }
    },
  });
  return null;
}

const EventLocationMap = memo(function EventLocationMap({
  marker, setMarker, setForm, searchLocation, setSearchLocation, handleLocationSearch
}) {
  return (
    <div style={{ margin: "0 20px 4px" }}>
      <label style={{
        fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "#64748b", fontFamily: "'DM Sans', sans-serif",
      }}>
        Pick Location From Map
      </label>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          placeholder="Search location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleLocationSearch())}
          style={{
            flex: 1, padding: "10px 12px", borderRadius: 8,
            border: "1.5px solid #e2e8f0", fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, outline: "none", background: "#f8fafc", color: "#1e293b",
          }}
        />
        <button
          type="button"
          onClick={handleLocationSearch}
          style={{
            background: "#0d9488", border: "none", color: "white",
            padding: "0 16px", borderRadius: 8, fontWeight: 600,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          }}
        >
          Search
        </button>
      </div>

      <div style={{ height: 300, borderRadius: 12, overflow: "hidden", marginTop: 10, border: "1px solid #e2e8f0" }}>
        <MapContainer center={marker} zoom={6} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker setForm={setForm} setMarker={setMarker} />
          <Marker position={marker} />
        </MapContainer>
      </div>

      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, marginBottom: 0 }}>
        Click on the map to auto-fill venue, city and state.
      </p>
    </div>
  );
});

const cats = ["Environment", "Health", "Education", "Sports", "Community"];

export default function CreateEventPage({ onSuccess }) {
  const [form, setForm] = useState({
    title: "", category: "", date: "", location: "", city: "", state: "",
    organizerName: "", contactEmail: "", contactPhone: "",
    description: "", requirements: "", benefits: "", bannerFile: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [focused, setFocused] = useState(null);
  const [marker, setMarker] = useState([20.5937, 78.9629]);
  const [searchLocation, setSearchLocation] = useState("");

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.category) e.category = "Select a category";
    if (!form.date) e.date = "Date is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.organizerName.trim()) e.organizerName = "Organizer name required";
    if (!form.contactEmail.trim()) e.contactEmail = "Email required";
    if (!form.contactPhone.trim()) e.contactPhone = "Phone required";
    if (!form.description.trim()) e.description = "Description required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setSubmitting(true);
      const data = new FormData();
      const formattedDate = form.date + ":00";
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("venue", form.location);
      data.append("city", form.city);
      data.append("state", form.state);
      data.append("organizerName", form.organizerName);
      data.append("contactEmail", form.contactEmail);
      data.append("contactPhone", form.contactPhone);
      data.append("startDateTime", formattedDate);
      data.append("endDateTime", formattedDate);
      data.append("requirements", form.requirements || "");
      data.append("benefits", form.benefits || "");
      if (form.bannerFile) data.append("bannerImage", form.bannerFile);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/events/create", data, {
        headers: { Authorization: "Bearer " + token },
      });
      setSubmitting(false);
      if (onSuccess) onSuccess("Event created successfully!");
      setForm({ title: "", category: "", date: "", location: "", city: "", state: "", organizerName: "", contactEmail: "", contactPhone: "", description: "", requirements: "", benefits: "", bannerFile: null });
      setBannerPreview(null);
    } catch (err) {
      console.error("Error creating event", err);
      setSubmitting(false);
      alert("Failed to create event.");
    }
  };

  const handleLocationSearch = async () => {
    if (!searchLocation) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMarker([lat, lon]);
        setForm((prev) => ({ ...prev, location: data[0].display_name }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .section-card {
          background: white; border-radius: 16px; border: 1px solid #e2e8f0;
          overflow: hidden; transition: box-shadow 0.2s;
        }
        .section-card:hover { box-shadow: 0 4px 24px rgba(13,148,136,0.07); }
        .section-label {
          display: flex; align-items: center; gap: 10px; padding: 16px 20px 0;
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #94a3b8; font-family: 'DM Sans', sans-serif;
        }
        .section-label::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }
        .section-fields { padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 16px; }
        .submit-btn {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #0d9488, #0ea5e9);
          color: white; border: none; padding: 14px 32px; border-radius: 12px;
          font-size: 14px; font-weight: 700; letter-spacing: 0.05em; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(13,148,136,0.35);
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(13,148,136,0.45); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .submit-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent); pointer-events: none; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .cat-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
        .cat-btn {
          padding: 8px 4px; border-radius: 8px; border: 1.5px solid #e2e8f0;
          background: #f8fafc; font-size: 12px; font-weight: 600; color: #64748b;
          cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; text-align: center;
        }
        .cat-btn.active { border-color: #0d9488; background: #f0fdfa; color: #0d9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
        .cat-btn:hover:not(.active) { border-color: #cbd5e1; background: white; }
        .drop-zone {
          border: 2px dashed #cbd5e1; border-radius: 12px; padding: 28px;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          cursor: pointer; transition: all 0.2s; background: #f8fafc; position: relative;
        }
        .drop-zone:hover { border-color: #0d9488; background: #f0fdfa; }
        .drop-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .banner-preview { width: 100%; height: 140px; object-fit: cover; border-radius: 10px; border: 1.5px solid #e2e8f0; }
        .step-dot {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #0d9488, #0ea5e9);
          color: white; font-size: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif; flex-shrink: 0;
        }
        @media (max-width: 580px) {
          .two-col { grid-template-columns: 1fr; }
          .cat-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", padding: "0 0 40px" }}>

        {/* Hero Header */}
        <div style={{
          background: "linear-gradient(135deg, #0f766e 0%, #0d9488 40%, #0ea5e9 100%)",
          borderRadius: 20, padding: "36px 32px", marginBottom: 24,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -20, right: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", top: 20, right: 100, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px",
              marginBottom: 14, backdropFilter: "blur(4px)",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                ✦ Event Management
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800,
              color: "white", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
            }}>
              Create New Event
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: "8px 0 0", fontWeight: 400 }}>
              Fill in the details below to publish your event to the community
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Section 1 — Basic Info */}
          <div className="section-card">
            <div className="section-label"><span className="step-dot">1</span>Basic Information</div>
            <div className="section-fields">

              <Field id="title" label="Event Title" error={errors.title} focused={focused}>
                <input
                  placeholder="e.g. Annual Beach Cleanup Drive"
                  value={form.title}
                  onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: "" }); }}
                  onFocus={() => setFocused("title")}
                  onBlur={() => setFocused(null)}
                  style={inputStyle("title", errors.title, focused)}
                />
              </Field>

              <Field id="category" label="Category" error={errors.category} focused={focused}>
                <div className="cat-grid">
                  {cats.map((c) => (
                    <button
                      key={c} type="button"
                      className={`cat-btn ${form.category === c ? "active" : ""}`}
                      onClick={() => { setForm({ ...form, category: c }); setErrors({ ...errors, category: "" }); }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {errors.category && <span style={{ fontSize: 11, color: "#ef4444" }}>↑ {errors.category}</span>}
              </Field>

              <Field id="date" label="Date & Time" error={errors.date} focused={focused}>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => { setForm({ ...form, date: e.target.value }); setErrors({ ...errors, date: "" }); }}
                  onFocus={() => setFocused("date")}
                  onBlur={() => setFocused(null)}
                  style={inputStyle("date", errors.date, focused)}
                />
              </Field>

            </div>
          </div>

          {/* Section 2 — Location */}
          <div className="section-card">
            <div className="section-label"><span className="step-dot">2</span>Location</div>
            <EventLocationMap
              marker={marker} setMarker={setMarker} setForm={setForm}
              searchLocation={searchLocation} setSearchLocation={setSearchLocation}
              handleLocationSearch={handleLocationSearch}
            />
            <div className="section-fields">
              <Field id="location" label="Venue / Address" error={errors.location} focused={focused}>
                <input
                  placeholder="e.g. Juhu Beach, Link Road"
                  value={form.location}
                  onChange={(e) => { setForm({ ...form, location: e.target.value }); setErrors({ ...errors, location: "" }); }}
                  onFocus={() => setFocused("location")}
                  onBlur={() => setFocused(null)}
                  style={inputStyle("location", errors.location, focused)}
                />
              </Field>
              <div className="two-col">
                <Field id="city" label="City" error={errors.city} focused={focused}>
                  <input
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={(e) => { setForm({ ...form, city: e.target.value }); setErrors({ ...errors, city: "" }); }}
                    onFocus={() => setFocused("city")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("city", errors.city, focused)}
                  />
                </Field>
                <Field id="state" label="State" error={errors.state} focused={focused}>
                  <input
                    placeholder="Maharashtra"
                    value={form.state}
                    onChange={(e) => { setForm({ ...form, state: e.target.value }); setErrors({ ...errors, state: "" }); }}
                    onFocus={() => setFocused("state")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("state", errors.state, focused)}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Section 3 — Organizer */}
          <div className="section-card">
            <div className="section-label"><span className="step-dot">3</span>Organizer Details</div>
            <div className="section-fields">
              <Field id="organizerName" label="Organizer Name" error={errors.organizerName} focused={focused}>
                <input
                  placeholder="Your name or organization"
                  value={form.organizerName}
                  onChange={(e) => { setForm({ ...form, organizerName: e.target.value }); setErrors({ ...errors, organizerName: "" }); }}
                  onFocus={() => setFocused("organizerName")}
                  onBlur={() => setFocused(null)}
                  style={inputStyle("organizerName", errors.organizerName, focused)}
                />
              </Field>
              <div className="two-col">
                <Field id="contactEmail" label="Contact Email" error={errors.contactEmail} focused={focused}>
                  <input
                    placeholder="hello@example.com"
                    value={form.contactEmail}
                    onChange={(e) => { setForm({ ...form, contactEmail: e.target.value }); setErrors({ ...errors, contactEmail: "" }); }}
                    onFocus={() => setFocused("contactEmail")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("contactEmail", errors.contactEmail, focused)}
                  />
                </Field>
                <Field id="contactPhone" label="Contact Phone" error={errors.contactPhone} focused={focused}>
                  <input
                    placeholder="+91 98765 43210"
                    value={form.contactPhone}
                    onChange={(e) => { setForm({ ...form, contactPhone: e.target.value }); setErrors({ ...errors, contactPhone: "" }); }}
                    onFocus={() => setFocused("contactPhone")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("contactPhone", errors.contactPhone, focused)}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Section 4 — About the Event */}
          <div className="section-card">
            <div className="section-label"><span className="step-dot">4</span>About the Event</div>
            <div className="section-fields">
              <Field id="description" label="Description" error={errors.description} focused={focused}>
                <textarea
                  rows={4}
                  placeholder="Describe what this event is about, its goals, and what participants can expect..."
                  value={form.description}
                  onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: "" }); }}
                  onFocus={() => setFocused("description")}
                  onBlur={() => setFocused(null)}
                  style={{ ...inputStyle("description", errors.description, focused), resize: "vertical" }}
                />
              </Field>
              <div className="two-col">
                <Field id="requirements" label="Requirements (optional)" focused={focused}>
                  <textarea
                    rows={3}
                    placeholder="What should volunteers bring or know?"
                    value={form.requirements}
                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                    onFocus={() => setFocused("requirements")}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle("requirements", false, focused), resize: "vertical" }}
                  />
                </Field>
                <Field id="benefits" label="Benefits (optional)" focused={focused}>
                  <textarea
                    rows={3}
                    placeholder="What will participants gain?"
                    value={form.benefits}
                    onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                    onFocus={() => setFocused("benefits")}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle("benefits", false, focused), resize: "vertical" }}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Section 5 — Banner Image */}
          <div className="section-card">
            <div className="section-label"><span className="step-dot">5</span>Banner Image</div>
            <div className="section-fields">
              {bannerPreview ? (
                <div style={{ position: "relative" }}>
                  <img src={bannerPreview} alt="Banner preview" className="banner-preview" />
                  <button
                    type="button"
                    onClick={() => { setBannerPreview(null); setForm({ ...form, bannerFile: null }); }}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      background: "rgba(0,0,0,0.5)", border: "none", borderRadius: 6,
                      color: "white", padding: "4px 10px", cursor: "pointer",
                      fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <div className="drop-zone">
                  <input
                    type="file" accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) { setForm({ ...form, bannerFile: file }); setBannerPreview(URL.createObjectURL(file)); }
                    }}
                  />
                  <div style={{ fontSize: 28 }}>🖼️</div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#475569" }}>
                    Drop image here or <span style={{ color: "#0d9488" }}>browse</span>
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>PNG, JPG, WEBP — recommended 1200×400px</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "white", borderRadius: "50%",
                    display: "inline-block", animation: "spin 0.7s linear infinite",
                  }} />
                  Publishing…
                </span>
              ) : "Publish Event →"}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}