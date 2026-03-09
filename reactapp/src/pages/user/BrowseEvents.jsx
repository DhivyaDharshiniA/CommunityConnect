// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
//
// export default function BrowseEvents({ events: propEvents, isMyEvents }) {
//   const [events, setEvents] = useState([]);
//   const [registeredEventIds, setRegisteredEventIds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//
//   useEffect(() => {
//     if (isMyEvents) {
//       setEvents(propEvents || []);
//       setLoading(false);
//     } else {
//       fetchData();
//     }
//   }, [isMyEvents, propEvents]);
//
//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//
//       const [eventsRes, registrationsRes] = await Promise.all([
//         axios.get("http://localhost:8080/api/events/others", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("http://localhost:8080/api/volunteers/my-registrations", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);
//
//       setEvents(eventsRes.data);
//       const ids = registrationsRes.data.map((reg) => reg.event.id);
//       setRegisteredEventIds(ids);
//     } catch (err) {
//       console.error("Error loading data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   if (loading) return <div className="text-center py-16 text-gray-500">Loading events...</div>;
//
//   if (events.length === 0)
//     return <div className="text-gray-500 text-center py-16">No events found</div>;
//
//   return (
//     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {events.map((ev) => (
//         <div key={ev.id} className="bg-white rounded-2xl shadow-md p-5 border">
//           <h2 className="text-lg font-semibold">{ev.title}</h2>
//           <p className="text-gray-500 text-sm mt-2">📅 {new Date(ev.startDateTime).toLocaleString()}</p>
//
//           {isMyEvents ? (
//             <button
//               onClick={() => navigate(`/event/${ev.id}`)}
//               className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
//             >
//               More Details
//             </button>
//           ) : registeredEventIds.includes(ev.id) ? (
//             <button disabled className="mt-4 bg-gray-400 text-white px-4 py-2 rounded w-full cursor-not-allowed">
//               Already Registered ✅
//             </button>
//           ) : (
//             <button
//               onClick={() => navigate(`/register/${ev.id}`)}
//               className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
//             >
//               Register as Volunteer
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FONTS } from "./UserDashboard";

function CalIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
}
function PinIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>;
}
function SearchIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
}

export default function BrowseEvents({ events: propEvents, isMyEvents }) {
  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    if (isMyEvents) { setEvents(propEvents || []); setLoading(false); }
    else { fetchData(); }
  }, [isMyEvents, propEvents]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [eventsRes, regRes] = await Promise.all([
        axios.get("http://localhost:8080/api/events/others", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/volunteers/my-registrations", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setEvents(eventsRes.data);
      setRegisteredEventIds(regRes.data.map(r => r.event.id));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const categories = ["All", ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];
  const filtered = events.filter(ev => {
    const q = search.toLowerCase();
    const matchSearch = !q || ev.title?.toLowerCase().includes(q) || ev.city?.toLowerCase().includes(q);
    const matchCat = filterCat === "All" || ev.category === filterCat;
    return matchSearch && matchCat;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-[3px] border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-medium">Loading events...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl anim">
      <style>{FONTS}</style>

      {/* Header */}
      <div className="mb-7 pb-5 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{isMyEvents ? "My Events" : "Browse Events"}</h1>
        <p className="text-sm text-gray-400 mt-1 font-light">
          {isMyEvents ? "Events you have created and are managing." : "Browse open volunteer opportunities in your community."}
        </p>
      </div>

      {/* Controls */}
      {!isMyEvents && (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"><SearchIcon /></span>
            <input
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all"
              placeholder="Search events or cities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${filterCat === cat ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mb-4">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-20 text-center">
          <p className="text-sm font-semibold text-gray-500">No events found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ev, i) => {
            const isReg = registeredEventIds.includes(ev.id);
            return (
              <div key={ev.id} className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] hover:shadow-[0_2px_12px_rgba(0,0,0,.09)] hover:border-gray-200 transition-all duration-200 overflow-hidden anim"
                style={{ animationDelay: `${i * 35}ms` }}>
                {ev.bannerImage
                  ? <img src={ev.bannerImage} alt={ev.title} className="w-full h-32 object-cover" />
                  : <div className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    </div>
                }
                <div className="p-4">
                  {ev.category && (
                    <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wide">{ev.category}</span>
                  )}
                  <h2 className="text-sm font-semibold text-gray-800 mt-2 mb-2.5 leading-snug">{ev.title}</h2>
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <CalIcon />{new Date(ev.startDateTime).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    {ev.city && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <PinIcon />{[ev.city, ev.state].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>

                  {isMyEvents ? (
                    <button onClick={() => navigate(`/event/${ev.id}`)}
                      className="w-full py-2 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                      View Details
                    </button>
                  ) : isReg ? (
                    <div className="w-full py-2 rounded-lg text-xs font-semibold text-center bg-gray-50 text-gray-400 border border-gray-100">
                      Registered
                    </div>
                  ) : (
                    <button onClick={() => navigate(`/register/${ev.id}`)}
                      className="w-full py-2 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                      Register as Volunteer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}