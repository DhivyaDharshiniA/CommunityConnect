// import React, { useState, useEffect } from "react";
// import axios from "axios";
//
// export default function BrowseEvents() {
//   const [events, setEvents] = useState([]);
//   const [selectedQR, setSelectedQR] = useState(null);
//
//   // Fetch all events
//   useEffect(() => {
//     axios.get("http://localhost:8080/api/events/all")
//       .then(res => setEvents(res.data))
//       .catch(err => console.error("Error fetching events:", err));
//   }, []);
//
//   const isPastEvent = (date) => new Date(date) < new Date();
//
//   if (!events || events.length === 0) {
//     return <div className="text-center py-16 text-gray-500 text-lg">No events available.</div>;
//   }
//
//   return (
//     <>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map(ev => (
//           <div key={ev.id} className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-xl transition duration-300">
//             <h3 className="font-bold text-xl mb-1 text-gray-800">{ev.title}</h3>
//
//             <span className={`text-xs px-3 py-1 rounded-full ${
//               isPastEvent(ev.dateTime) ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
//             }`}>
//               {isPastEvent(ev.dateTime) ? "Past Event" : "Upcoming Event"}
//             </span>
//
//             <p className="text-sm text-gray-600 mt-3">📍 {ev.location}</p>
//             <p className="text-sm text-gray-500">📅 {new Date(ev.dateTime).toLocaleString()}</p>
//
//             {ev.description && <p className="text-sm text-gray-600 mt-3 line-clamp-3">{ev.description}</p>}
//
//             {ev.qrCodePath && (
//               <div className="mt-4">
//                 <button
//                   onClick={() => setSelectedQR(`http://localhost:8080/${ev.qrCodePath}`)}
//                   className="text-blue-600 text-sm hover:underline"
//                 >
//                   View QR Code
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//
//       {/* QR Modal */}
//       {selectedQR && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow-lg text-center">
//             <h3 className="font-semibold mb-4">Event QR Code</h3>
//             <img src={selectedQR} alt="QR Code" className="w-48 mx-auto" />
//             <button
//               onClick={() => setSelectedQR(null)}
//               className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BrowseEvents({ events: propEvents }) {
  const [events, setEvents] = useState(propEvents || []);
  const [selectedQR, setSelectedQR] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!propEvents) {
      axios
        .get("http://localhost:8080/api/events/all")
        .then((res) => setEvents(res.data))
        .catch((err) => console.error("Error fetching events:", err));
    }
  }, [propEvents]);

  const isPastEvent = (date) => new Date(date) < new Date();

  const filteredEvents = events
    .filter((ev) => {
      if (filter === "upcoming") return !isPastEvent(ev.dateTime);
      if (filter === "past") return isPastEvent(ev.dateTime);
      return true;
    })
    .filter((ev) =>
      ev.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Community Events</h1>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          className="border p-2 rounded-lg w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past Events</option>
        </select>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-gray-500 text-center py-16">
          No events found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{ev.title}</h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    isPastEvent(ev.dateTime)
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {isPastEvent(ev.dateTime) ? "Past" : "Upcoming"}
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-2">
                📍 {ev.location}
              </p>

              <p className="text-gray-500 text-sm">
                📅 {new Date(ev.dateTime).toLocaleString()}
              </p>

              {ev.description && (
                <p className="text-sm mt-3 text-gray-600">
                  {ev.description}
                </p>
              )}

              {ev.qrCodePath && (
                <button
                  onClick={() =>
                    setSelectedQR(`http://localhost:8080/${ev.qrCodePath}`)
                  }
                  className="mt-4 text-blue-600 hover:underline text-sm"
                >
                  View Event QR
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* QR Modal */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <h2 className="font-semibold mb-4 text-lg">
              Event QR Code
            </h2>

            <img
              src={selectedQR}
              alt="QR Code"
              className="w-56 mx-auto"
            />

            <button
              onClick={() => setSelectedQR(null)}
              className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}