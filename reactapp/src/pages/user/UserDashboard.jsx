// import React, { useEffect, useState } from "react";
// import UserSidebar from "../../components/layout/UserSidebar";
// import BrowseEvents from "./BrowseEvents";
// import MyEvents from "./MyEvents";
// import SosPage from "./SosPage";
// import HelpRequestPage from "./HelpRequestPage";
// import HelpFeed from "./HelpFeed";
//
// import { getAllEvents } from "../../api/eventService";
//
// export default function UserDashboard() {
//
//   const [activeTab, setActiveTab] = useState(
//     () => sessionStorage.getItem("activeTab") || "dashboard"
//   );
//
//   const [events, setEvents] = useState([]);
//   const [sosHistory, setSosHistory] = useState([]);
//
//   const currentUser = JSON.parse(localStorage.getItem("user"));
//
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
//   const myEvents = events.filter(
//     (event) => event.createdBy?.id === currentUser?.id
//   );
//
//   return (
//     <div className="flex min-h-screen bg-stone-50">
//
//       <UserSidebar
//         activeTab={activeTab}
//         setActiveTab={handleSetActiveTab}
//         myEventsCount={myEvents.length}
//       />
//
//       <main className="ml-60 flex-1 p-8">
//
//         {/* Dashboard */}
//         {activeTab === "dashboard" && (
//           <div>
//             <h1 className="text-3xl font-serif font-semibold mb-4">
//               Welcome to your Dashboard
//             </h1>
//
//             <p className="text-gray-600 mb-6">
//               Here you can browse events, manage your events, request help,
//               donate to others, and use SOS features.
//             </p>
//
//             <div className="grid grid-cols-3 gap-6">
//
//               <div className="bg-white shadow rounded-xl p-5">
//                 <h3 className="text-lg font-semibold">Events Available</h3>
//                 <p className="text-2xl font-bold text-orange-500">
//                   {events.length}
//                 </p>
//               </div>
//
//               <div className="bg-white shadow rounded-xl p-5">
//                 <h3 className="text-lg font-semibold">My Events</h3>
//                 <p className="text-2xl font-bold text-orange-500">
//                   {myEvents.length}
//                 </p>
//               </div>
//
//               <div className="bg-white shadow rounded-xl p-5">
//                 <h3 className="text-lg font-semibold">SOS Requests</h3>
//                 <p className="text-2xl font-bold text-red-500">
//                   {sosHistory.length}
//                 </p>
//               </div>
//
//             </div>
//           </div>
//         )}
//
//         {/* Browse Events */}
//         {activeTab === "events" && (
//           <BrowseEvents events={events} refreshEvents={fetchEvents} />
//         )}
//
//         {/* My Events */}
//         {activeTab === "myevents" && (
//           currentUser ? (
//             <MyEvents
//               events={myEvents}
//               onEventCreated={fetchEvents}
//             />
//           ) : (
//             <p className="text-red-500">
//               Please log in to see and create your events.
//             </p>
//           )
//         )}
//
//         {/* Help Request */}
//         {activeTab === "helpRequest" && (
//           <HelpRequestPage />
//         )}
//
//         {/* Donation Feed */}
//         {activeTab === "helpFeed" && (
//           <HelpFeed />
//         )}
//
//         {/* SOS */}
//         {activeTab === "sos" && (
//           <SosPage
//             sosHistory={sosHistory}
//             setSosHistory={setSosHistory}
//           />
//         )}
//
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/layout/UserSidebar";
import BrowseEvents from "./BrowseEvents";
import MyEvents from "./MyEvents";
import SosPage from "./SosPage";
import HelpRequestPage from "./HelpRequestPage";
import HelpFeed from "./HelpFeed";
import { getAllEvents } from "../../api/eventService";

export const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body, * { font-family: 'Sora', sans-serif; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .anim { animation: fadeUp .26s ease both; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
`;

function StatCard({ label, value, sub, accent, delay, onClick }) {
  return (
    <div onClick={onClick} style={{ animationDelay: delay }}
      className={`bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] p-5 anim ${onClick ? "cursor-pointer hover:border-orange-200 hover:shadow-[0_2px_12px_rgba(234,88,12,.08)] transition-all duration-200" : ""}`}>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">{label}</p>
      <p className={`text-3xl font-bold tracking-tight ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
    </div>
  );
}

function QuickAction({ iconPath, iconColor = "text-orange-500", label, description, onClick, delay }) {
  return (
    <button onClick={onClick} style={{ animationDelay: delay }}
      className="group text-left bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] p-5 hover:border-orange-200 hover:shadow-[0_2px_12px_rgba(234,88,12,.08)] transition-all duration-200 anim w-full">
      <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-orange-50 transition-colors">
        <svg className={`w-4 h-4 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d={iconPath} />
        </svg>
      </div>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
    </button>
  );
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem("activeTab") || "dashboard");
  const [events, setEvents] = useState([]);
  const [sosHistory, setSosHistory] = useState([]);
  const userName = localStorage.getItem("name") || "there";
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const setTab = (tab) => { sessionStorage.setItem("activeTab", tab); setActiveTab(tab); };
  useEffect(() => { fetchEvents(); }, []);
  const fetchEvents = async () => { try { const data = await getAllEvents(); setEvents(data); } catch {} };
  const myEvents = events.filter(e => e.createdBy?.id === currentUser?.id);
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  return (
    <div className="flex min-h-screen bg-[#f7f7f6]">
      <style>{FONTS}</style>
      <UserSidebar activeTab={activeTab} setActiveTab={setTab} myEventsCount={myEvents.length} />

      <main className="ml-60 flex-1 p-8">
        {activeTab === "dashboard" && (
          <div className="max-w-4xl anim">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-gray-100">
              <p className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest mb-1.5">Good {timeOfDay}</p>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, {userName}</h1>
              <p className="text-sm text-gray-400 mt-1 font-light">Your activity summary for Community Connect.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatCard label="Available Events" value={events.length} sub="Open for registration" accent="text-gray-900" delay="0ms" onClick={() => setTab("events")} />
              <StatCard label="My Events" value={myEvents.length} sub="Events you created" accent="text-orange-500" delay="60ms" onClick={() => setTab("myevents")} />
              <StatCard label="SOS Alerts" value={sosHistory.length} sub="Active emergency alerts" accent="text-red-500" delay="120ms" onClick={() => setTab("sos")} />
            </div>

            {/* Quick actions */}
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <QuickAction label="Browse Events" description="Discover volunteer opportunities" iconPath="M8 7V3m8 4V3m-9 8h10M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" onClick={() => setTab("events")} delay="0ms" />
              <QuickAction label="Request Help" description="Submit a community request" iconPath="M12 5v14M5 12h14" onClick={() => setTab("helpRequest")} delay="50ms" />
              <QuickAction label="Donate" description="Support a cause in need" iconPath="M12 21C12 21 4 13.5 4 8.5a4.5 4.5 0 019-1 4.5 4.5 0 019 1C22 13.5 12 21 12 21z" onClick={() => setTab("helpFeed")} delay="100ms" />
              <QuickAction label="Emergency SOS" description="Raise an urgent alert" iconPath="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" iconColor="text-red-500" onClick={() => setTab("sos")} delay="150ms" />
            </div>

            {/* Recent events */}
            {events.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Recent Events</p>
                  <button onClick={() => setTab("events")} className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors">View all &rarr;</button>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Event Title", "Category", "Date", "City"].map(h => (
                          <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {events.slice(0, 5).map(ev => (
                        <tr key={ev.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer">
                          <td className="px-5 py-3.5 font-medium text-gray-800">{ev.title}</td>
                          <td className="px-5 py-3.5">
                            {ev.category
                              ? <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{ev.category}</span>
                              : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{new Date(ev.startDateTime).toLocaleDateString("en-IN")}</td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs">{ev.city || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "events" && <BrowseEvents events={events} refreshEvents={fetchEvents} />}
        {activeTab === "myevents" && (currentUser ? <MyEvents events={myEvents} onEventCreated={fetchEvents} /> : <p className="text-sm text-red-500">Please log in to manage your events.</p>)}
        {activeTab === "helpRequest" && <HelpRequestPage />}
        {activeTab === "helpFeed" && <HelpFeed />}
        {activeTab === "sos" && <SosPage sosHistory={sosHistory} setSosHistory={setSosHistory} />}
      </main>
    </div>
  );
}