// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// //
// // // ── Icons ──
// // const Icon = ({ d, size = "w-5 h-5" }) => (
// //   <svg className={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
// //     <path d={d} />
// //   </svg>
// // );
// //
// // const icons = {
// //   dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
// //   events: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
// //   myevents: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
// //   sos: "M22 12h-4l-3 9L9 3l-3 9H2",
// //   logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
// //   bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
// //   check: "M20 6L9 17l-5-5",
// //   calendar: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
// //   map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z",
// //   alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
// //   qr: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h.01M18 14h.01M14 18h.01M18 18h.01M16 14v1M14 16h1M16 18v1M18 16h1",
// //   user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
// //   search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
// //   filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
// //   heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
// //   send: "M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z",
// // };
// //
// // const NavItem = ({ icon, label, active, onClick, badge }) => (
// //   <button onClick={onClick}
// //     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
// //       ${active ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}>
// //     <Icon d={icons[icon]} size="w-4 h-4" />
// //     <span>{label}</span>
// //     {badge && (
// //       <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
// //     )}
// //   </button>
// // );
// //
// // // ── Mock Data ──
// // const allEvents = [
// //   { id: 1, title: "Beach Cleanup Drive", date: "2026-03-01", location: "Marina Beach, Chennai", ngo: "Green Earth NGO", skills: ["Logistics", "General"], volunteers: 24, maxVol: 30, category: "Environment", registered: false },
// //   { id: 2, title: "Blood Donation Camp", date: "2026-03-08", location: "City Hospital, Anna Nagar", ngo: "LifeAid Foundation", skills: ["Medical", "General"], volunteers: 12, maxVol: 20, category: "Health", registered: true },
// //   { id: 3, title: "Free Coding Workshop", date: "2026-03-15", location: "Online", ngo: "TechForAll NGO", skills: ["Technical", "Teaching"], volunteers: 8, maxVol: 25, category: "Education", registered: false },
// //   { id: 4, title: "Old Age Home Visit", date: "2026-03-20", location: "Adyar, Chennai", ngo: "CareBridge NGO", skills: ["General", "Medical"], volunteers: 15, maxVol: 20, category: "Community", registered: false },
// // ];
// //
// // const categoryColors = {
// //   Environment: "bg-green-100 text-green-700",
// //   Health:      "bg-red-100 text-red-600",
// //   Education:   "bg-blue-100 text-blue-700",
// //   Community:   "bg-purple-100 text-purple-700",
// // };
// //
// // // ── SOS Form ──
// // const SosForm = ({ onSubmit, onClose }) => {
// //   const [sos, setSos] = useState({ type: "", location: "", description: "" });
// //   const types = ["Medical Emergency", "Flood / Water Rescue", "Fire Assistance", "Missing Person", "Other"];
// //
// //   return (
// //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// //       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
// //         <div className="flex items-center gap-3 mb-5">
// //           <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
// //             <Icon d={icons.alert} size="w-5 h-5" />
// //           </div>
// //           <div>
// //             <h2 className="font-serif text-xl font-semibold text-slate-800">Raise SOS Alert</h2>
// //             <p className="text-xs text-red-500 font-medium">For genuine emergencies only</p>
// //           </div>
// //         </div>
// //
// //         <div className="space-y-4">
// //           <div>
// //             <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">Emergency Type</label>
// //             <select value={sos.type} onChange={e => setSos({ ...sos, type: e.target.value })} required
// //               className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all">
// //               <option value="">Select type...</option>
// //               {types.map(t => <option key={t} value={t}>{t}</option>)}
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">Your Location</label>
// //             <input type="text" placeholder="Street, Area, City" value={sos.location}
// //               onChange={e => setSos({ ...sos, location: e.target.value })}
// //               className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all" />
// //           </div>
// //           <div>
// //             <label className="block text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-1.5">Brief Description</label>
// //             <textarea rows={3} placeholder="Describe the emergency briefly..." value={sos.description}
// //               onChange={e => setSos({ ...sos, description: e.target.value })}
// //               className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all resize-none" />
// //           </div>
// //         </div>
// //
// //         <div className="flex gap-3 mt-5">
// //           <button onClick={onClose}
// //             className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
// //             Cancel
// //           </button>
// //           <button onClick={() => { if (sos.type && sos.location) { onSubmit(sos); onClose(); } }}
// //             className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2">
// //             <Icon d={icons.send} size="w-4 h-4" /> Send SOS
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
// //
// // // ── QR Scanner Placeholder ──
// // const QrScanner = ({ onClose }) => (
// //   <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
// //     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
// //       <h2 className="font-serif text-xl font-semibold text-slate-800 mb-2">Scan QR Code</h2>
// //       <p className="text-slate-400 text-sm mb-6">Point camera at event QR code to mark attendance</p>
// //       <div className="w-48 h-48 mx-auto border-4 border-dashed border-orange-300 rounded-2xl flex items-center justify-center bg-orange-50 mb-6 relative overflow-hidden">
// //         <div className="absolute top-0 left-0 w-full h-1 bg-orange-400 animate-bounce" />
// //         <Icon d={icons.qr} size="w-16 h-16" />
// //       </div>
// //       <p className="text-xs text-slate-400 mb-5">Camera access required. Make sure the QR code is well-lit.</p>
// //       <div className="flex gap-3">
// //         <button onClick={onClose}
// //           className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
// //           Close
// //         </button>
// //         <button
// //           className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 shadow-lg shadow-orange-200">
// //           Open Camera
// //         </button>
// //       </div>
// //     </div>
// //   </div>
// // );
// //
// // export default function UserDashboard() {
// //   const [activeTab, setActiveTab] = useState("dashboard");
// //   const [events, setEvents] = useState(allEvents);
// //   const [search, setSearch] = useState("");
// //   const [showSos, setShowSos] = useState(false);
// //   const [showQr, setShowQr] = useState(false);
// //   const [sosHistory, setSosHistory] = useState([]);
// //   const [notification, setNotification] = useState(null);
// //   const navigate = useNavigate();
// //
// //   const userName = localStorage.getItem("name") || "Alex Johnson";
// //   const userSkill = "Medical";
// //
// //   const notify = (msg) => {
// //     setNotification(msg);
// //     setTimeout(() => setNotification(null), 3500);
// //   };
// //
// //   const handleRegister = (id) => {
// //     setEvents(events.map(e => e.id === id ? { ...e, registered: true, volunteers: e.volunteers + 1 } : e));
// //     notify("✅ Successfully registered as volunteer!");
// //   };
// //
// //   const handleSosSubmit = (sos) => {
// //     setSosHistory([{ ...sos, id: Date.now(), time: "Just now", status: "pending" }, ...sosHistory]);
// //     notify("🆘 SOS alert sent! Nearby responders are being notified.");
// //   };
// //
// //   const myEvents = events.filter(e => e.registered);
// //   const filteredEvents = events.filter(e =>
// //     e.title.toLowerCase().includes(search.toLowerCase()) ||
// //     e.location.toLowerCase().includes(search.toLowerCase()) ||
// //     e.category.toLowerCase().includes(search.toLowerCase())
// //   );
// //
// //   const handleLogout = () => {
// //     localStorage.clear();
// //     navigate("/login");
// //   };
// //
// //   return (
// //     <div className="min-h-screen bg-stone-50 flex font-sans">
// //
// //       {/* ── Toast Notification ── */}
// //       {notification && (
// //         <div className="fixed top-6 right-6 z-[999] bg-slate-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl animate-bounce">
// //           {notification}
// //         </div>
// //       )}
// //
// //       {showSos && <SosForm onSubmit={handleSosSubmit} onClose={() => setShowSos(false)} />}
// //       {showQr && <QrScanner onClose={() => setShowQr(false)} />}
// //
// //       {/* ── SIDEBAR ── */}
// //       <aside className="w-60 bg-white border-r border-stone-100 flex flex-col py-6 px-3 fixed h-full z-20 shadow-sm">
// //         {/* Logo */}
// //         <div className="px-3 mb-8">
// //           <div className="flex items-center gap-2.5">
// //             <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
// //               <span className="text-white text-xs font-bold">CC</span>
// //             </div>
// //             <div>
// //               <p className="text-xs font-bold text-slate-800 leading-none">Community</p>
// //               <p className="text-xs text-orange-500 font-semibold">Connect</p>
// //             </div>
// //           </div>
// //         </div>
// //
// //         {/* User info */}
// //         <div className="mx-3 mb-6 px-3 py-2.5 bg-orange-50 border border-orange-100 rounded-xl">
// //           <div className="flex items-center gap-2.5">
// //             <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 text-sm font-bold">
// //               {userName.charAt(0)}
// //             </div>
// //             <div>
// //               <p className="text-sm font-semibold text-slate-700 leading-none truncate">{userName}</p>
// //               <p className="text-[10px] text-orange-500 font-medium mt-0.5">{userSkill} · Volunteer</p>
// //             </div>
// //           </div>
// //         </div>
// //
// //         {/* Nav */}
// //         <nav className="flex flex-col gap-1 flex-1">
// //           <NavItem icon="dashboard" label="Overview"      active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
// //           <NavItem icon="events"    label="Browse Events" active={activeTab === "events"}    onClick={() => setActiveTab("events")} />
// //           <NavItem icon="myevents" label="My Events"      active={activeTab === "myevents"}  onClick={() => setActiveTab("myevents")} badge={myEvents.length || null} />
// //           <NavItem icon="sos"       label="SOS"           active={activeTab === "sos"}       onClick={() => setActiveTab("sos")} />
// //         </nav>
// //
// //         {/* SOS Quick button */}
// //         <button onClick={() => setShowSos(true)}
// //           className="mx-3 mb-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-all duration-200">
// //           <Icon d={icons.alert} size="w-4 h-4" /> Raise SOS
// //         </button>
// //
// //         {/* Logout */}
// //         <button onClick={handleLogout}
// //           className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
// //           <Icon d={icons.logout} size="w-4 h-4" /> Logout
// //         </button>
// //       </aside>
// //
// //       {/* ── MAIN ── */}
// //       <main className="ml-60 flex-1 p-8">
// //
// //         {/* ════ OVERVIEW ════ */}
// //         {activeTab === "dashboard" && (
// //           <div>
// //             <div className="mb-8">
// //               <p className="text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-1">Welcome back</p>
// //               <h1 className="text-3xl font-serif font-semibold text-slate-800">Hello, {userName.split(" ")[0]} 👋</h1>
// //               <p className="text-slate-400 text-sm mt-1">Here's your volunteer activity at a glance.</p>
// //             </div>
// //
// //             {/* Stats */}
// //             <div className="grid grid-cols-4 gap-4 mb-8">
// //               {[
// //                 { icon: "myevents", label: "Events Joined",    value: myEvents.length, sub: "Total",       color: "bg-orange-50 text-orange-500" },
// //                 { icon: "check",    label: "Attended",          value: "3",            sub: "Completed",    color: "bg-green-50 text-green-600" },
// //                 { icon: "heart",    label: "Impact Points",     value: "840",          sub: "Earned",       color: "bg-pink-50 text-pink-500" },
// //                 { icon: "sos",      label: "SOS Raised",        value: sosHistory.length, sub: "All time", color: "bg-red-50 text-red-500" },
// //               ].map(s => (
// //                 <div key={s.label} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200">
// //                   <div className="flex items-start justify-between mb-3">
// //                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
// //                       <Icon d={icons[s.icon]} size="w-5 h-5" />
// //                     </div>
// //                     <span className="text-xs text-slate-400 font-medium">{s.sub}</span>
// //                   </div>
// //                   <p className="text-2xl font-bold text-slate-800 font-serif">{s.value}</p>
// //                   <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
// //                 </div>
// //               ))}
// //             </div>
// //
// //             {/* Upcoming events for me */}
// //             <div className="grid grid-cols-3 gap-4 mb-6">
// //               <div className="col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
// //                 <div className="flex items-center justify-between mb-5">
// //                   <h2 className="font-serif text-lg font-semibold text-slate-800">Upcoming Events</h2>
// //                   <button onClick={() => setActiveTab("events")} className="text-xs text-orange-500 font-semibold hover:underline">Browse all →</button>
// //                 </div>
// //                 <div className="space-y-3">
// //                   {allEvents.slice(0, 3).map(ev => (
// //                     <div key={ev.id} className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
// //                       <div className="flex items-center gap-3">
// //                         <div className={`w-2 h-10 rounded-full ${ev.registered ? "bg-orange-400" : "bg-stone-200"}`} />
// //                         <div>
// //                           <p className="text-sm font-semibold text-slate-700">{ev.title}</p>
// //                           <p className="text-xs text-slate-400">{ev.date} · {ev.ngo}</p>
// //                         </div>
// //                       </div>
// //                       <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${categoryColors[ev.category]}`}>{ev.category}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //
// //               {/* Skills card */}
// //               <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
// //                 <p className="text-xs font-bold tracking-widest uppercase text-orange-100 mb-2">Your Profile</p>
// //                 <p className="font-serif text-xl font-semibold mb-4">{userName}</p>
// //                 <div className="space-y-2 mb-6">
// //                   {["Medical", "First Aid", "Logistics"].map(skill => (
// //                     <div key={skill} className="flex items-center gap-2">
// //                       <span className="w-1.5 h-1.5 rounded-full bg-orange-200" />
// //                       <span className="text-sm text-orange-100">{skill}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 <button onClick={() => setShowQr(true)}
// //                   className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl transition-all border border-white/20">
// //                   <Icon d={icons.qr} size="w-4 h-4" /> Scan QR
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //
// //         {/* ════ BROWSE EVENTS ════ */}
// //         {activeTab === "events" && (
// //           <div>
// //             <div className="flex items-center justify-between mb-8">
// //               <div>
// //                 <p className="text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-1">Discover</p>
// //                 <h1 className="text-3xl font-serif font-semibold text-slate-800">Browse Events</h1>
// //               </div>
// //               <button onClick={() => setShowQr(true)}
// //                 className="flex items-center gap-2 border border-stone-200 text-stone-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:border-orange-300 hover:text-orange-600 transition-all">
// //                 <Icon d={icons.qr} size="w-4 h-4" /> Scan QR Attendance
// //               </button>
// //             </div>
// //
// //             {/* Search */}
// //             <div className="relative mb-6">
// //               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
// //                 <Icon d={icons.search} size="w-4 h-4" />
// //               </span>
// //               <input type="text" placeholder="Search events by name, location, or category..."
// //                 value={search} onChange={e => setSearch(e.target.value)}
// //                 className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all shadow-sm" />
// //             </div>
// //
// //             {/* Event Cards */}
// //             <div className="grid grid-cols-2 gap-4">
// //               {filteredEvents.map(ev => (
// //                 <div key={ev.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
// //                   <div className="flex items-start justify-between mb-3">
// //                     <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColors[ev.category]}`}>{ev.category}</span>
// //                     {ev.registered && (
// //                       <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
// //                         <Icon d={icons.check} size="w-3 h-3" /> Registered
// //                       </span>
// //                     )}
// //                   </div>
// //
// //                   <h3 className="font-serif font-semibold text-slate-800 mb-1">{ev.title}</h3>
// //                   <p className="text-xs text-slate-400 mb-1">📅 {ev.date}</p>
// //                   <p className="text-xs text-slate-400 mb-3">📍 {ev.location}</p>
// //                   <p className="text-xs text-slate-500 mb-3">by <span className="font-semibold text-slate-600">{ev.ngo}</span></p>
// //
// //                   {/* Skills needed */}
// //                   <div className="flex gap-1.5 flex-wrap mb-4">
// //                     {ev.skills.map(sk => (
// //                       <span key={sk} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border
// //                         ${sk === userSkill ? "bg-orange-100 border-orange-300 text-orange-700" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
// //                         {sk === userSkill ? "⭐ " : ""}{sk}
// //                       </span>
// //                     ))}
// //                   </div>
// //
// //                   {/* Progress bar */}
// //                   <div className="mb-4">
// //                     <div className="flex justify-between text-[10px] text-slate-400 mb-1">
// //                       <span>{ev.volunteers} volunteers</span>
// //                       <span>{ev.maxVol} spots</span>
// //                     </div>
// //                     <div className="w-full bg-stone-100 rounded-full h-1.5">
// //                       <div className="bg-orange-400 h-1.5 rounded-full transition-all duration-500"
// //                         style={{ width: `${Math.min((ev.volunteers / ev.maxVol) * 100, 100)}%` }} />
// //                     </div>
// //                   </div>
// //
// //                   <button
// //                     disabled={ev.registered || ev.volunteers >= ev.maxVol}
// //                     onClick={() => handleRegister(ev.id)}
// //                     className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
// //                       ${ev.registered
// //                         ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
// //                         : ev.volunteers >= ev.maxVol
// //                           ? "bg-slate-100 text-slate-400 cursor-not-allowed"
// //                           : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0"
// //                       }`}>
// //                     {ev.registered ? "✓ Registered" : ev.volunteers >= ev.maxVol ? "Full" : "Register as Volunteer"}
// //                   </button>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //
// //         {/* ════ MY EVENTS ════ */}
// //         {activeTab === "myevents" && (
// //           <div>
// //             <div className="mb-8">
// //               <p className="text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-1">Your Activity</p>
// //               <h1 className="text-3xl font-serif font-semibold text-slate-800">My Events</h1>
// //               <p className="text-slate-400 text-sm mt-1">{myEvents.length} events you've signed up for</p>
// //             </div>
// //
// //             {myEvents.length === 0 ? (
// //               <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
// //                 <span className="text-5xl">🌱</span>
// //                 <p className="text-slate-500 mt-4 font-medium">You haven't joined any events yet.</p>
// //                 <button onClick={() => setActiveTab("events")}
// //                   className="mt-4 bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all">
// //                   Browse Events
// //                 </button>
// //               </div>
// //             ) : (
// //               <div className="grid gap-4">
// //                 {myEvents.map(ev => (
// //                   <div key={ev.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition-shadow">
// //                     <div className="flex items-center gap-4">
// //                       <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
// //                         <Icon d={icons.calendar} size="w-5 h-5" />
// //                       </div>
// //                       <div>
// //                         <h3 className="font-serif font-semibold text-slate-800">{ev.title}</h3>
// //                         <p className="text-xs text-slate-400 mt-0.5">{ev.date} · 📍 {ev.location}</p>
// //                         <p className="text-xs text-slate-500 mt-1">by {ev.ngo}</p>
// //                       </div>
// //                     </div>
// //                     <div className="flex items-center gap-3">
// //                       <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColors[ev.category]}`}>{ev.category}</span>
// //                       <button onClick={() => setShowQr(true)}
// //                         className="flex items-center gap-1.5 border border-stone-200 text-stone-600 text-xs font-semibold px-3 py-2 rounded-lg hover:border-orange-300 hover:text-orange-600 transition-all">
// //                         <Icon d={icons.qr} size="w-3 h-3" /> Scan QR
// //                       </button>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}
// //
// //         {/* ════ SOS ════ */}
// //         {activeTab === "sos" && (
// //           <div>
// //             <div className="flex items-center justify-between mb-8">
// //               <div>
// //                 <p className="text-[11px] font-bold tracking-widest uppercase text-red-500 mb-1">Emergency</p>
// //                 <h1 className="text-3xl font-serif font-semibold text-slate-800">SOS Alerts</h1>
// //                 <p className="text-slate-400 text-sm mt-1">Raise an alert — nearby skilled volunteers will be notified</p>
// //               </div>
// //               <button onClick={() => setShowSos(true)}
// //                 className="flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 hover:-translate-y-0.5 transition-all duration-200">
// //                 <Icon d={icons.alert} size="w-4 h-4" /> Raise SOS
// //               </button>
// //             </div>
// //
// //             {/* Info card */}
// //             <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
// //               <span className="text-xl mt-0.5">⚠️</span>
// //               <div>
// //                 <p className="text-sm font-semibold text-amber-800">For genuine emergencies only</p>
// //                 <p className="text-xs text-amber-600 mt-0.5">Raising a false SOS alert may result in account suspension. Nearby volunteers with matching skills will be instantly notified.</p>
// //               </div>
// //             </div>
// //
// //             {sosHistory.length === 0 ? (
// //               <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
// //                 <span className="text-5xl">🛡️</span>
// //                 <p className="text-slate-500 mt-4 font-medium">No SOS alerts raised yet.</p>
// //                 <p className="text-slate-400 text-sm">Stay safe. Help is always nearby.</p>
// //               </div>
// //             ) : (
// //               <div className="grid gap-4">
// //                 {sosHistory.map(s => (
// //                   <div key={s.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
// //                     <div className="flex items-start justify-between">
// //                       <div className="flex items-start gap-3">
// //                         <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mt-0.5">
// //                           <Icon d={icons.alert} size="w-5 h-5" />
// //                         </div>
// //                         <div>
// //                           <h3 className="font-semibold text-slate-800">{s.type}</h3>
// //                           <p className="text-xs text-slate-400 mt-0.5">📍 {s.location} · 🕐 {s.time}</p>
// //                           {s.description && <p className="text-xs text-slate-500 mt-1">{s.description}</p>}
// //                         </div>
// //                       </div>
// //                       <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.status === "pending" ? "bg-amber-100 text-amber-700 animate-pulse" : "bg-green-100 text-green-700"}`}>
// //                         {s.status === "pending" ? "⏳ Finding responders..." : "✓ Responder Assigned"}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }
//
// import React, { useEffect, useState } from "react";
// import UserSidebar from "../../components/layout/UserSidebar";
// import BrowseEvents from "./BrowseEvents";
// import MyEvents from "./MyEvents";
// import SosPage from "./SosPage";
// import { getAllEvents } from "../../api/eventService";
//
// export default function UserDashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [events, setEvents] = useState([]);
//   const [sosHistory, setSosHistory] = useState([]);
//
//   // Get current user from localStorage
// //   const currentUser = JSON.parse(localStorage.getItem("user")); // { id: 1, name: "DHIVYADHARSHINI" }
//
//  const currentUser = JSON.parse(localStorage.getItem("user"));
//
//
//   useEffect(() => {
//     fetchEvents();
//   }, []);
//
//   const fetchEvents = async () => {
//     try {
//       const data = await getAllEvents();
//       setEvents(data);
//     } catch (error) {
//       console.error("Error fetching events", error);
//     }
//   };
//
//   const myEvents = events.filter(e => e.createdBy?.id === currentUser?.id);
//
//   return (
//     <div className="flex min-h-screen bg-stone-50">
//       <UserSidebar
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         myEventsCount={myEvents.length}
//       />
//
//       <main className="ml-60 flex-1 p-8">
//         {activeTab === "dashboard" && (
//           <h1 className="text-3xl font-serif font-semibold">
//             Welcome to your Dashboard
//           </h1>
//         )}
//
//         {activeTab === "events" && <BrowseEvents events={events} />}
//
//         {activeTab === "myevents" && currentUser && (
//
//           <MyEvents userId={currentUser.id} events={myEvents} />
//         )}
//
//         {activeTab === "sos" && (
//           <SosPage sosHistory={sosHistory} setSosHistory={setSosHistory} />
//         )}
//
//         {!currentUser && activeTab === "myevents" && (
//           <p>Please log in to see and create your events.</p>
//         )}
//       </main>
//     </div>
//   );
// }

//
// import React, { useEffect, useState } from "react";
// import UserSidebar from "../../components/layout/UserSidebar";
// import BrowseEvents from "./BrowseEvents";
// import MyEvents from "./MyEvents";
// import SosPage from "./SosPage";
// import { getAllEvents } from "../../api/eventService";
//
// export default function UserDashboard() {
//   // Persist activeTab so reloading doesn't send user back to "dashboard"
//   const [activeTab, setActiveTab] = useState(
//     () => sessionStorage.getItem("activeTab") || "dashboard"
//   );
//   const [events, setEvents] = useState([]);
//   const [sosHistory, setSosHistory] = useState([]);
//
//   const currentUser = JSON.parse(localStorage.getItem("user"));
//
//   // Sync activeTab to sessionStorage whenever it changes
//   const handleSetActiveTab = (tab) => {
//     sessionStorage.setItem("activeTab", tab);
//     setActiveTab(tab);
//   };
//
//   useEffect(() => {
//     fetchEvents();
//   }, []);
//
//   const fetchEvents = async () => {
//     try {
//       const data = await getAllEvents();
//       setEvents(data);
//     } catch (error) {
//       console.error("Error fetching events", error);
//     }
//   };
//
//   const myEvents = events.filter((e) => e.createdBy?.id === currentUser?.id);
//
//   return (
//     <div className="flex min-h-screen bg-stone-50">
//       <UserSidebar
//         activeTab={activeTab}
//         setActiveTab={handleSetActiveTab}
//         myEventsCount={myEvents.length}
//       />
//
//       <main className="ml-60 flex-1 p-8">
//         {activeTab === "dashboard" && (
//           <h1 className="text-3xl font-serif font-semibold">
//             Welcome to your Dashboard
//           </h1>
//         )}
//
//         {activeTab === "events" && <BrowseEvents events={events} />}
//
//         {activeTab === "myevents" && currentUser ? (
//           <MyEvents userId={currentUser.id} events={myEvents} onEventCreated={fetchEvents} />
//         ) : (
//           activeTab === "myevents" && (
//             <p>Please log in to see and create your events.</p>
//           )
//         )}
//
//         {activeTab === "sos" && (
//           <SosPage sosHistory={sosHistory} setSosHistory={setSosHistory} />
//         )}
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/layout/UserSidebar";
import BrowseEvents from "./BrowseEvents";
import MyEvents from "./MyEvents";
import SosPage from "./SosPage";
import { getAllEvents } from "../../api/eventService";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState(
    () => sessionStorage.getItem("activeTab") || "dashboard"
  );
  const [events, setEvents] = useState([]);
  const [sosHistory, setSosHistory] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleSetActiveTab = (tab) => {
    sessionStorage.setItem("activeTab", tab);
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const myEvents = events.filter(
    (event) => event.createdBy?.id === currentUser?.id
  );

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <UserSidebar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        myEventsCount={myEvents.length}
      />

      {/* Main Content */}
      <main className="ml-60 flex-1 p-8">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-serif font-semibold mb-4">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-600">
              Here you can browse events, manage your events, and use SOS features.
            </p>
          </div>
        )}

        {activeTab === "events" && (
          <BrowseEvents events={events} refreshEvents={fetchEvents} />
        )}

        {activeTab === "myevents" && (
          <>
            {currentUser ? (
              <MyEvents
                userId={currentUser.id}
                events={myEvents}
                onEventCreated={fetchEvents}
              />
            ) : (
              <p className="text-red-500">
                Please log in to see and create your events.
              </p>
            )}
          </>
        )}

        {activeTab === "sos" && (
          <SosPage
            sosHistory={sosHistory}
            setSosHistory={setSosHistory}
          />
        )}
      </main>
    </div>
  );
}