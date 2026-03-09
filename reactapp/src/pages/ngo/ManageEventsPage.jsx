// import { useState, useEffect } from "react";
// import { getMyEvents, deleteEvent } from "../../api/eventService";
// import { Badge, ProgressBar } from "../../components/layout/UI";
//
// const catEmoji = {
//   Environment: "🌿",
//   Health: "❤️jj",
//   Education: "📚",
//   Welfare: "🤝",
//   Community: "🏘️",
//   Sports: "🏆"
// };
//
// export default function ManageEventsPage({ setActivePage, onAction }) {
//
//   const [events, setEvents] = useState([]);
//   const [filter, setFilter] = useState("All");
//   const [search, setSearch] = useState("");
//
//   const filters = ["All", "Active", "Upcoming", "Completed"];
//
//   useEffect(() => {
//     fetchEvents();
//   }, []);
//
//   const fetchEvents = async () => {
//     try {
//
//       const res = await getMyEvents();
//
//       const formatted = res.data.map((e) => ({
//         id: e.id,
//         title: e.title,
//         category: e.category,
//         status: e.status || "Active",
//         capacity: e.capacity || 0,
//         volunteers: e.volunteerCount || 0,
//         date: e.startDateTime
//           ? new Date(e.startDateTime).toLocaleString()
//           : "No date",
//         location: e.venue || "No location"
//       }));
//
//       setEvents(formatted);
//
//     } catch (err) {
//       console.error("Error loading events", err);
//     }
//   };
//
//   const filtered = events.filter((e) => {
//
//     const matchFilter =
//       filter === "All" || e.status === filter;
//
//     const matchSearch =
//       e.title.toLowerCase().includes(search.toLowerCase()) ||
//       e.location.toLowerCase().includes(search.toLowerCase());
//
//     return matchFilter && matchSearch;
//   });
//
//   const handleDelete = async (id) => {
//
//     try {
//
//       await deleteEvent(id);
//
//       setEvents((prev) =>
//         prev.filter((e) => e.id !== id)
//       );
//
//       onAction?.("Event deleted successfully");
//
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };
//
//   return (
//     <div className="space-y-5">
//
//       {/* Controls */}
//       <div className="bg-white rounded-2xl border border-slate-100 p-4">
//
//         <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
//
//           <div className="flex flex-wrap gap-2">
//             {filters.map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
//                   filter === f
//                     ? "bg-teal-600 text-white"
//                     : "bg-slate-100 text-slate-600"
//                 }`}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>
//
//           <div className="flex items-center gap-2">
//
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search events…"
//               className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-lg"
//             />
//
//             <button
//               onClick={() => setActivePage("create-event")}
//               className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1.5 rounded-lg"
//             >
//               New Event
//             </button>
//
//           </div>
//
//         </div>
//
//       </div>
//
//       {/* Event Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//
//         {filtered.map((e) => (
//
//           <div
//             key={e.id}
//             className="bg-white rounded-2xl border border-slate-100 p-4"
//           >
//
//             <div className="flex items-center justify-between mb-2">
//
//               <div className="flex items-center gap-2">
//                 <span>{catEmoji[e.category] || "📌"}</span>
//                 <span className="text-xs text-slate-500">
//                   {e.category}
//                 </span>
//               </div>
//
//               <Badge status={e.status} />
//
//             </div>
//
//             <h3 className="font-semibold text-sm mb-2">
//               {e.title}
//             </h3>
//
//             <p className="text-xs text-slate-500">
//               📅 {e.date}
//             </p>
//
//             <p className="text-xs text-slate-500">
//               📍 {e.location}
//             </p>
//
//             <ProgressBar
//               value={e.volunteers}
//               max={e.capacity}
//             />
//
//             <div className="flex gap-2 mt-4">
//
//               <button className="flex-1 text-xs bg-slate-100 py-1.5 rounded-lg">
//                 Edit
//               </button>
//
//               <button
//                 onClick={() => handleDelete(e.id)}
//                 className="flex-1 text-xs bg-red-50 text-red-500 py-1.5 rounded-lg"
//               >
//                 Delete
//               </button>
//
//             </div>
//
//           </div>
//
//         ))}
//
//         {filtered.length === 0 && (
//           <div className="text-sm text-slate-400">
//             No events found
//           </div>
//         )}
//
//       </div>
//
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { getMyEvents, deleteEvent } from "../../api/eventService";
import { Badge, ProgressBar } from "../../components/layout/UI";

const catEmoji = {
  Environment: "🌿",
  Health: "❤️",
  Education: "📚",
  Welfare: "🤝",
  Community: "🏘️",
  Sports: "🏆",
};

export default function ManageEventsPage({ setActivePage, onAction }) {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filters = ["All", "Active", "Upcoming", "Completed"];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getMyEvents(); // res is already an array

      const formatted = res.map((e) => ({
        id: e.id,
        title: e.title || "Untitled Event",
        category: e.category || "Other",
        status: e.status || "Active",
        capacity: e.capacity || 0,
        volunteers: e.volunteerCount || 0,
        date: e.startDateTime
          ? new Date(e.startDateTime).toLocaleString()
          : "No date",
        location: e.venue || "No location",
      }));

      setEvents(formatted);
    } catch (err) {
      console.error("Error loading events", err);
    }
  };

  const filtered = events.filter((e) => {
    const matchFilter = filter === "All" || e.status === filter;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      onAction?.("Event deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                  filter === f
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events…"
              className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-lg"
            />

            <button
              onClick={() => setActivePage("create-event")}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1.5 rounded-lg"
            >
              New Event
            </button>
          </div>
        </div>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-2xl border border-slate-100 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{catEmoji[e.category] || "📌"}</span>
                <span className="text-xs text-slate-500">{e.category}</span>
              </div>
              <Badge status={e.status} />
            </div>

            <h3 className="font-semibold text-sm mb-2">{e.title}</h3>

            <p className="text-xs text-slate-500">📅 {e.date}</p>
            <p className="text-xs text-slate-500">📍 {e.location}</p>

            <ProgressBar value={e.volunteers} max={e.capacity} />

            <div className="flex gap-2 mt-4">
              <button className="flex-1 text-xs bg-slate-100 py-1.5 rounded-lg">
                Edit
              </button>

              <button
                onClick={() => handleDelete(e.id)}
                className="flex-1 text-xs bg-red-50 text-red-500 py-1.5 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-sm text-slate-400">No events found</div>
        )}
      </div>
    </div>
  );
}