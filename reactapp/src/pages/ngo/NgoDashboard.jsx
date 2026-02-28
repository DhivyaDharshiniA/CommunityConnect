import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Icons ──
const Icon = ({ d, size = "w-5 h-5" }) => (
  <svg className={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  events: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  volunteers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  sos: "M22 12h-4l-3 9L9 3l-3 9H2",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  plus: "M12 5v14M5 12h14",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  check: "M20 6L9 17l-5-5",
  users: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  qr: "M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z",
  alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  calendar: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
  chart: "M18 20V10 M12 20V4 M6 20v-6",
};

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative
      ${active ? "bg-teal-600 text-white shadow-lg shadow-teal-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}>
    <Icon d={icons[icon]} size="w-4 h-4" />
    <span>{label}</span>
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
    )}
  </button>
);

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon d={icons[icon]} size="w-5 h-5" />
      </div>
      <span className="text-xs text-slate-400 font-medium">{sub}</span>
    </div>
    <p className="text-2xl font-bold text-slate-800 font-serif">{value}</p>
    <p className="text-sm text-slate-500 mt-0.5">{label}</p>
  </div>
);

// ── Mock Data ──
const mockEvents = [
  { id: 1, title: "Beach Cleanup Drive", date: "2026-03-01", location: "Marina Beach", volunteers: 24, maxVol: 30, status: "active" },
  { id: 2, title: "Blood Donation Camp", date: "2026-03-08", location: "City Hospital", volunteers: 12, maxVol: 20, status: "active" },
  { id: 3, title: "Tree Plantation", date: "2026-02-15", location: "Central Park", volunteers: 45, maxVol: 50, status: "completed" },
];

const mockVolunteers = [
  { id: 1, name: "Ananya Sharma", skill: "Medical", event: "Blood Donation Camp", attended: true },
  { id: 2, name: "Rahul Verma", skill: "Logistics", event: "Beach Cleanup Drive", attended: false },
  { id: 3, name: "Priya Nair", skill: "Teaching", event: "Beach Cleanup Drive", attended: true },
  { id: 4, name: "Karthik M", skill: "Technical", event: "Tree Plantation", attended: true },
];

const mockSOS = [
  { id: 1, type: "Medical Emergency", location: "Anna Nagar, Chennai", distance: "1.2 km", time: "2 min ago", status: "open" },
  { id: 2, type: "Flood Rescue", location: "Velachery", distance: "3.5 km", time: "8 min ago", status: "assigned" },
];

export default function NgoDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", date: "", location: "", description: "", maxVolunteers: "" });
  const [events, setEvents] = useState(mockEvents);
  const [sosAlerts, setSosAlerts] = useState(mockSOS);
  const navigate = useNavigate();
  const ngoName = localStorage.getItem("name") || "Green Earth NGO";

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: events.length + 1,
      title: eventForm.title,
      date: eventForm.date,
      location: eventForm.location,
      volunteers: 0,
      maxVol: parseInt(eventForm.maxVolunteers) || 30,
      status: "active",
    };
    setEvents([newEvent, ...events]);
    setShowCreateEvent(false);
    setEventForm({ title: "", date: "", location: "", description: "", maxVolunteers: "" });
  };

  const handleAcceptSOS = (id) => {
    setSosAlerts(sosAlerts.map(s => s.id === id ? { ...s, status: "assigned" } : s));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      {/* ── SIDEBAR ── */}
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col py-6 px-3 fixed h-full z-20 shadow-sm">
        {/* Logo */}
        <div className="px-3 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CC</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-none">Community</p>
              <p className="text-xs text-teal-600 font-semibold">Connect</p>
            </div>
          </div>
        </div>

        {/* NGO Badge */}
        <div className="mx-3 mb-6 px-3 py-2.5 bg-teal-50 border border-teal-100 rounded-xl">
          <p className="text-[10px] font-bold tracking-widest uppercase text-teal-500">NGO Account</p>
          <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">{ngoName}</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem icon="dashboard" label="Overview"    active={activeTab === "dashboard"}   onClick={() => setActiveTab("dashboard")} />
          <NavItem icon="events"    label="My Events"   active={activeTab === "events"}      onClick={() => setActiveTab("events")} />
          <NavItem icon="volunteers" label="Volunteers" active={activeTab === "volunteers"}  onClick={() => setActiveTab("volunteers")} />
          <NavItem icon="sos"       label="SOS Alerts"  active={activeTab === "sos"}         onClick={() => setActiveTab("sos")} badge={sosAlerts.filter(s => s.status === "open").length || null} />
        </nav>

        {/* Logout */}
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mx-0 mt-4">
          <Icon d={icons.logout} size="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="ml-60 flex-1 p-8">

        {/* ════ OVERVIEW ════ */}
        {activeTab === "dashboard" && (
          <div>
            <div className="mb-8">
              <p className="text-[11px] font-bold tracking-widest uppercase text-teal-500 mb-1">NGO Dashboard</p>
              <h1 className="text-3xl font-serif font-semibold text-slate-800">Good morning 👋</h1>
              <p className="text-slate-400 text-sm mt-1">Here's what's happening with your organisation today.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard icon="events"     label="Active Events"       value="2"  sub="This month"  color="bg-teal-50 text-teal-600" />
              <StatCard icon="volunteers" label="Total Volunteers"    value="81" sub="Registered"   color="bg-amber-50 text-amber-600" />
              <StatCard icon="check"      label="Attendance Rate"     value="87%" sub="Avg"         color="bg-green-50 text-green-600" />
              <StatCard icon="sos"        label="SOS Responded"       value="5"  sub="All time"     color="bg-red-50 text-red-500" />
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-lg font-semibold text-slate-800">Recent Events</h2>
                <button onClick={() => setActiveTab("events")} className="text-xs text-teal-600 font-semibold hover:underline">View all →</button>
              </div>
              <div className="space-y-3">
                {events.slice(0, 3).map(ev => (
                  <div key={ev.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                        <Icon d={icons.calendar} size="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{ev.title}</p>
                        <p className="text-xs text-slate-400">{ev.date} · {ev.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-slate-700">{ev.volunteers}/{ev.maxVol}</p>
                        <p className="text-[10px] text-slate-400">volunteers</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${ev.status === "active" ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"}`}>
                        {ev.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SOS Preview */}
            {sosAlerts.filter(s => s.status === "open").length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon d={icons.alert} size="w-4 h-4" />
                  <p className="text-sm font-bold text-red-700">Active SOS Alert</p>
                </div>
                {sosAlerts.filter(s => s.status === "open").map(s => (
                  <div key={s.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-red-800">{s.type}</p>
                      <p className="text-xs text-red-500">{s.location} · {s.distance} · {s.time}</p>
                    </div>
                    <button onClick={() => { handleAcceptSOS(s.id); setActiveTab("sos"); }}
                      className="bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Respond
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════ EVENTS ════ */}
        {activeTab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-teal-500 mb-1">Manage</p>
                <h1 className="text-3xl font-serif font-semibold text-slate-800">Events</h1>
              </div>
              <button onClick={() => setShowCreateEvent(true)}
                className="flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-200 hover:-translate-y-0.5 transition-all duration-200">
                <Icon d={icons.plus} size="w-4 h-4" /> Create Event
              </button>
            </div>

            {/* Create Event Modal */}
            {showCreateEvent && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                  <h2 className="font-serif text-xl font-semibold text-slate-800 mb-5">Create New Event</h2>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    {[
                      { name: "title", placeholder: "Event title", type: "text" },
                      { name: "location", placeholder: "Location", type: "text" },
                      { name: "date", placeholder: "Date", type: "date" },
                      { name: "maxVolunteers", placeholder: "Max volunteers", type: "number" },
                    ].map(f => (
                      <input key={f.name} type={f.type} placeholder={f.placeholder} value={eventForm[f.name]}
                        onChange={e => setEventForm({ ...eventForm, [f.name]: e.target.value })} required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all" />
                    ))}
                    <textarea placeholder="Description (optional)" value={eventForm.description}
                      onChange={e => setEventForm({ ...eventForm, description: e.target.value })} rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all resize-none" />
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setShowCreateEvent(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancel
                      </button>
                      <button type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200">
                        Create Event
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Events List */}
            <div className="grid gap-4">
              {events.map(ev => (
                <div key={ev.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif font-semibold text-slate-800">{ev.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.status === "active" ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"}`}>
                          {ev.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{ev.date} · 📍 {ev.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-teal-600 font-serif">{ev.volunteers}</p>
                      <p className="text-[10px] text-slate-400">/ {ev.maxVol} volunteers</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                    <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((ev.volunteers / ev.maxVol) * 100, 100)}%` }} />
                  </div>

                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-teal-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-teal-300 transition-all">
                      <Icon d={icons.users} size="w-3 h-3" /> View Volunteers
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-teal-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-teal-300 transition-all">
                      <Icon d={icons.qr} size="w-3 h-3" /> QR Attendance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ VOLUNTEERS ════ */}
        {activeTab === "volunteers" && (
          <div>
            <div className="mb-8">
              <p className="text-[11px] font-bold tracking-widest uppercase text-teal-500 mb-1">People</p>
              <h1 className="text-3xl font-serif font-semibold text-slate-800">Volunteers</h1>
              <p className="text-slate-400 text-sm mt-1">{mockVolunteers.length} registered volunteers across your events</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["Volunteer", "Skill", "Event", "Attendance"].map(h => (
                      <th key={h} className="text-left text-[11px] font-bold tracking-widest uppercase text-slate-400 px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockVolunteers.map((v, i) => (
                    <tr key={v.id} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold">
                            {v.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-700">{v.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">{v.skill}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{v.event}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold w-fit px-2.5 py-1 rounded-full ${v.attended ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${v.attended ? "bg-green-500" : "bg-slate-400"}`} />
                          {v.attended ? "Present" : "Absent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ SOS ════ */}
        {activeTab === "sos" && (
          <div>
            <div className="mb-8">
              <p className="text-[11px] font-bold tracking-widest uppercase text-red-500 mb-1">Emergency</p>
              <h1 className="text-3xl font-serif font-semibold text-slate-800">SOS Alerts</h1>
              <p className="text-slate-400 text-sm mt-1">Nearby emergencies that need skilled responders</p>
            </div>

            <div className="grid gap-4">
              {sosAlerts.map(s => (
                <div key={s.id} className={`rounded-2xl border p-5 transition-all ${s.status === "open" ? "bg-red-50 border-red-200 shadow-sm shadow-red-100" : "bg-white border-slate-100"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 ${s.status === "open" ? "bg-red-100" : "bg-slate-100"}`}>
                        <Icon d={icons.alert} size="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-800">{s.type}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.status === "open" ? "bg-red-200 text-red-700 animate-pulse" : "bg-green-100 text-green-700"}`}>
                            {s.status === "open" ? "● OPEN" : "✓ ASSIGNED"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-3">
                          <span>📍 {s.location}</span>
                          <span>📏 {s.distance}</span>
                          <span>🕐 {s.time}</span>
                        </p>
                      </div>
                    </div>
                    {s.status === "open" && (
                      <button onClick={() => handleAcceptSOS(s.id)}
                        className="bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                        Accept & Respond
                      </button>
                    )}
                    {s.status === "assigned" && (
                      <span className="text-green-600 text-sm font-semibold flex items-center gap-1.5">
                        <Icon d={icons.check} size="w-4 h-4" /> Responder Assigned
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}