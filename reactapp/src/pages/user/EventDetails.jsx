// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhone } from "react-icons/fa";
//
// export default function EventDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//
//   const [event, setEvent] = useState(null);
//   const [volunteers, setVolunteers] = useState([]);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     fetchEventDetails();
//   }, []);
//
//   const fetchEventDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//
//       // 1️⃣ Fetch event details
//       const eventRes = await axios.get(
//         `http://localhost:8080/api/events/${id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//
//       setEvent(eventRes.data);
//
//       // 2️⃣ Fetch volunteers (creator only)
//       try {
//         const volRes = await axios.get(
//           `http://localhost:8080/api/volunteers/event/${id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setVolunteers(volRes.data);
//       } catch (err) {
//         // If not creator → 403
//         setVolunteers([]);
//       }
//
//     } catch (err) {
//       console.error("Error fetching event:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // ---------------- LOADING ----------------
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
//         Loading event details...
//       </div>
//     );
//   }
//
//   // ---------------- EVENT NOT FOUND ----------------
//   if (!event) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500 text-lg">
//         Event not found.
//       </div>
//     );
//   }
//
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
//
//       {/* BACK BUTTON */}
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium mb-4"
//       >
//         ← <span>Back</span>
//       </button>
//
//       {/* EVENT HEADER */}
//       <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
//         {event.bannerImage && (
//           <img
//             src={event.bannerImage}
//             alt="Event Banner"
//             className="w-full h-80 object-cover"
//           />
//         )}
//
//         <div className="p-8 space-y-4">
//           <h1 className="text-4xl font-bold text-gray-800">
//             {event.title}
//           </h1>
//
//           <div className="flex flex-wrap gap-4 text-gray-600">
//             <p className="flex items-center gap-2">
//               <FaMapMarkerAlt className="text-blue-500" />
//               {event.venue}, {event.city}, {event.state}
//             </p>
//
//             <p className="flex items-center gap-2">
//               <FaCalendarAlt className="text-green-500" />
//               {new Date(event.startDateTime).toLocaleString()} -{" "}
//               {new Date(event.endDateTime).toLocaleString()}
//             </p>
//
//             {event.category && (
//               <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
//                 {event.category}
//               </span>
//             )}
//           </div>
//
//           {/* DESCRIPTION */}
//           <div className="mt-6">
//             <h2 className="text-2xl font-semibold mb-2">Description</h2>
//             <p className="text-gray-700">
//               {event.description || "No description provided."}
//             </p>
//           </div>
//
//           {/* REQUIREMENTS & BENEFITS */}
//           <div className="grid md:grid-cols-2 gap-6 mt-6">
//             {event.requirements && (
//               <div className="bg-gray-50 p-4 rounded-xl border shadow-sm">
//                 <h3 className="font-semibold text-lg mb-2">Requirements</h3>
//                 <p className="text-gray-700">{event.requirements}</p>
//               </div>
//             )}
//
//             {event.benefits && (
//               <div className="bg-gray-50 p-4 rounded-xl border shadow-sm">
//                 <h3 className="font-semibold text-lg mb-2">Benefits</h3>
//                 <p className="text-gray-700">{event.benefits}</p>
//               </div>
//             )}
//           </div>
//
//           {/* ORGANIZER INFO */}
//           <div className="mt-6 border-t pt-4 space-y-2 text-gray-700">
//             <p><strong>Organizer:</strong> {event.organizerName}</p>
//             <p className="flex items-center gap-2">
//               <FaEnvelope /> {event.contactEmail}
//             </p>
//             <p className="flex items-center gap-2">
//               <FaPhone /> {event.contactPhone}
//             </p>
//           </div>
//         </div>
//       </div>
//
//       {/* VOLUNTEERS SECTION */}
//       <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200">
//         <h2 className="text-2xl font-semibold mb-4">
//           Registered Volunteers ({volunteers.length})
//         </h2>
//
//         {volunteers.length === 0 ? (
//           <p className="text-gray-500">
//             No volunteers have registered yet.
//           </p>
//         ) : (
//           <div className="grid md:grid-cols-2 gap-6">
//             {volunteers.map((vol) => (
//               <div
//                 key={vol.id}
//                 className="border rounded-xl p-5 hover:shadow-lg transition"
//               >
//                 <h3 className="font-semibold text-lg text-gray-800">
//                   {vol.user?.name}
//                 </h3>
//
//                 <p className="text-sm text-gray-500">
//                   {vol.user?.email}
//                 </p>
//
//                 <div className="mt-3 text-gray-700 space-y-1 text-sm">
//                   <p><strong>Skills:</strong> {vol.skills}</p>
//                   <p><strong>Availability:</strong> {vol.availability}</p>
//
//                   <p>
//                     <strong>Status:</strong>{" "}
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         vol.status === "APPROVED"
//                           ? "bg-green-100 text-green-700"
//                           : vol.status === "REJECTED"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {vol.status}
//                     </span>
//                   </p>
//                 </div>
//
//                 {vol.message && (
//                   <div className="mt-3 text-gray-600 text-sm">
//                     <strong>Message:</strong>
//                     <p>{vol.message}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FONTS } from "./UserDashboard";

const statusMap = {
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const ev = await axios.get(`http://localhost:8080/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setEvent(ev.data);
        try {
          const vols = await axios.get(`http://localhost:8080/api/volunteers/event/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          setVolunteers(vols.data);
        } catch { setVolunteers([]); }
      } catch {} finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-7 h-7 border-[3px] border-gray-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  if (!event) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <p className="text-sm font-semibold text-gray-500 mb-3">Event not found.</p>
      <button onClick={() => navigate(-1)} className="text-xs font-semibold text-orange-500 hover:underline">&larr; Go back</button>
    </div>
  );

  return (
    <div className="max-w-4xl anim">
      <style>{FONTS}</style>

      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-orange-500 transition-colors mb-5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
        Back
      </button>

      {/* Hero */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] overflow-hidden mb-4">
        {event.bannerImage
          ? <img src={event.bannerImage} alt={event.title} className="w-full h-52 object-cover" />
          : <div className="w-full h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            </div>
        }
        <div className="p-6">
          {event.category && (
            <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wide">{event.category}</span>
          )}
          <h1 className="text-xl font-bold text-gray-900 tracking-tight mt-2 mb-4">{event.title}</h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: "M8 7V3m8 4V3m-9 8h10M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z", label: "Starts", val: new Date(event.startDateTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
              { icon: "M8 7V3m8 4V3m-9 8h10M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z", label: "Ends", val: new Date(event.endDateTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
              { icon: "M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z M14.121 11.121A3 3 0 118 9", label: "Location", val: [event.venue, event.city, event.state].filter(Boolean).join(", ") || "—" },
            ].map(({ icon, label, val }) => (
              <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d={icon}/></svg>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-xs font-medium text-gray-700 mt-0.5">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] p-1 mb-4">
        {["overview", "volunteers"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${tab === t ? "bg-orange-500 text-white" : "text-gray-400 hover:text-gray-600"}`}>
            {t === "volunteers" ? `Volunteers (${volunteers.length})` : "Overview"}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="space-y-4">
          {event.description && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] p-6">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">About this Event</p>
              <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          )}

          {(event.requirements || event.benefits) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {event.requirements && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] p-5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Requirements</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.requirements}</p>
                </div>
              )}
              {event.benefits && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] p-5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Benefits</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.benefits}</p>
                </div>
              )}
            </div>
          )}

          {event.organizerName && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] p-6">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Organizer</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-bold">
                  {event.organizerName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{event.organizerName}</p>
                  <p className="text-xs text-gray-400">Event Organizer</p>
                </div>
              </div>
              <div className="space-y-2">
                {event.contactEmail && (
                  <a href={`mailto:${event.contactEmail}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-orange-500 transition-colors">
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {event.contactEmail}
                  </a>
                )}
                {event.contactPhone && (
                  <a href={`tel:${event.contactPhone}`} className="flex items-center gap-2 text-xs text-gray-500 hover:text-orange-500 transition-colors">
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.82a19.79 19.79 0 01-3.07-8.72A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.27-.55a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                    {event.contactPhone}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Volunteers tab */}
      {tab === "volunteers" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] overflow-hidden">
          {volunteers.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-gray-400">No volunteers have registered yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Volunteer", "Skills", "Availability", "Status"].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {volunteers.map(vol => (
                  <tr key={vol.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold flex-shrink-0">
                          {vol.user?.name?.[0]?.toUpperCase() || "V"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs">{vol.user?.name}</p>
                          <p className="text-gray-400 text-[11px]">{vol.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 max-w-[160px]"><p className="line-clamp-2">{vol.skills || "—"}</p></td>
                    <td className="px-5 py-4 text-xs text-gray-500">{vol.availability || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${statusMap[vol.status] || statusMap.PENDING}`}>
                        {vol.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}