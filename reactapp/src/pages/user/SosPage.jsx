import React, { useState } from "react";
import { FONTS } from "./UserDashboard";

const TYPES = [
  { id: "medical", label: "Medical Emergency", sub: "Injury, illness, or cardiac event" },
  { id: "fire", label: "Fire or Explosion", sub: "Structure fire or gas leak" },
  { id: "flood", label: "Flood or Disaster", sub: "Natural disaster or hazard" },
  { id: "accident", label: "Road Accident", sub: "Vehicular or road incident" },
  { id: "violence", label: "Violence or Threat", sub: "Physical threat or assault" },
  { id: "other", label: "Other Emergency", sub: "Any other urgent situation" },
];

const SEVERITY = [
  { id: "critical", label: "Critical", sub: "Immediate life risk", cls: "border-red-400 bg-red-50 text-red-700", active: "border-red-500 bg-red-50" },
  { id: "high", label: "High", sub: "Urgent — hours matter", cls: "border-orange-400 bg-orange-50 text-orange-700", active: "border-orange-500 bg-orange-50" },
  { id: "medium", label: "Medium", sub: "Important, not critical", cls: "border-yellow-400 bg-yellow-50 text-yellow-700", active: "border-yellow-500 bg-yellow-50" },
];

const historyBadge = {
  critical: "bg-red-50 text-red-600 border-red-200",
  high: "bg-orange-50 text-orange-600 border-orange-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default function SosPage({ sosHistory, setSosHistory }) {
  const [type, setType] = useState("");
  const [customType, setCustomType] = useState("");
  const [severity, setSeverity] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const inp = (err) => `w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 ${err ? "border-red-400" : "border-gray-200 hover:border-gray-300"}`;

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      p => { setLocation(`${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`); setGeoLoading(false); },
      () => setGeoLoading(false)
    );
  };

  const submit = () => {
    const e = {};
    if (!type) e.type = "Select an emergency type";
    if (!severity) e.severity = "Select a severity level";
    if (!location.trim()) e.location = "Location is required";
    if (Object.keys(e).length) { setErrors(e); return; }

    const label = type === "other" ? (customType.trim() || "Other Emergency") : TYPES.find(t => t.id === type)?.label;
    setSosHistory([{ id: Date.now(), type: label, severity, location, details, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), date: new Date().toLocaleDateString("en-IN") }, ...sosHistory]);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setType(""); setCustomType(""); setSeverity(""); setLocation(""); setDetails(""); setErrors({}); }, 3500);
  };

  return (
    <div className="max-w-3xl anim">
      <style>{FONTS}</style>

      {/* Header */}
      <div className="mb-7 pb-5 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Emergency SOS</h1>
        <p className="text-sm text-gray-400 mt-1 font-light">Alert the community to an emergency situation.</p>
      </div>

      {/* Advisory */}
      <div className="flex items-start gap-3.5 bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6">
        <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4m0 4h.01"/></svg>
        <div>
          <p className="text-sm font-semibold text-red-700">For life-threatening situations, call 112 immediately.</p>
          <p className="text-xs text-red-500 mt-0.5">This form alerts nearby volunteers but is not a substitute for official emergency services.</p>
        </div>
      </div>

      {/* Success */}
      {submitted && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6">
          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p className="text-sm font-semibold text-green-700">Alert sent. Community volunteers have been notified.</p>
        </div>
      )}

      {!submitted && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-5 pb-4 border-b border-gray-100">Alert Details</h2>

          {/* Type */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Emergency Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TYPES.map(t => (
                <button key={t.id} onClick={() => setType(t.id)}
                  className={`text-left px-4 py-3 rounded-lg border-2 transition-all duration-150 ${type === t.id ? "border-red-500 bg-red-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
                  <p className={`text-xs font-semibold ${type === t.id ? "text-red-700" : "text-gray-700"}`}>{t.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{t.sub}</p>
                </button>
              ))}
            </div>
            {errors.type && <p className="text-xs text-red-500 mt-1.5">{errors.type}</p>}
            {type === "other" && (
              <input value={customType} onChange={e => setCustomType(e.target.value)}
                placeholder="Describe the emergency type"
                className="w-full mt-2.5 px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all" />
            )}
          </div>

          {/* Severity */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Severity <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              {SEVERITY.map(s => (
                <button key={s.id} onClick={() => setSeverity(s.id)}
                  className={`flex-1 py-3 px-3 rounded-lg border-2 text-center transition-all duration-150 ${severity === s.id ? s.active : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
                  <p className={`text-xs font-semibold ${severity === s.id ? s.cls.split(" ")[2] : "text-gray-700"}`}>{s.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
                </button>
              ))}
            </div>
            {errors.severity && <p className="text-xs text-red-500 mt-1.5">{errors.severity}</p>}
          </div>

          {/* Location */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
              Location <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="Street address or landmark"
                className={`flex-1 ${inp(errors.location)}`} />
              <button onClick={detectLocation} disabled={geoLoading}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all whitespace-nowrap">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                {geoLoading ? "Detecting..." : "Detect"}
              </button>
            </div>
            {errors.location && <p className="text-xs text-red-500 mt-1.5">{errors.location}</p>}
          </div>

          {/* Details */}
          <div className="mb-6">
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Additional Details</label>
            <textarea value={details} onChange={e => setDetails(e.target.value)}
              placeholder="Describe the situation: number of people affected, visible injuries, any hazards present, or other relevant information."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all resize-none"
              rows={3} />
          </div>

          <button onClick={submit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            Send SOS Alert
          </button>
        </div>
      )}

      {/* History */}
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Alert History {sosHistory.length > 0 && `(${sosHistory.length})`}
        </p>

        {sosHistory.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 py-12 text-center">
            <p className="text-sm text-gray-400">No alerts have been sent yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Emergency", "Severity", "Location", "Time"].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sosHistory.map(sos => (
                  <tr key={sos.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{sos.type}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${historyBadge[sos.severity] || "bg-gray-50 text-gray-500 border-gray-200"}`}>
                        {sos.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{sos.location}</td>
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{sos.time} · {sos.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}