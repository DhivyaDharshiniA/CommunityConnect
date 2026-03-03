import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BrowseEvents({ events: propEvents, isMyEvents }) {
  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isMyEvents) {
      setEvents(propEvents || []);
      setLoading(false);
    } else {
      fetchData();
    }
  }, [isMyEvents, propEvents]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [eventsRes, registrationsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/events/others", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/volunteers/my-registrations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setEvents(eventsRes.data);
      const ids = registrationsRes.data.map((reg) => reg.event.id);
      setRegisteredEventIds(ids);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-500">Loading events...</div>;

  if (events.length === 0)
    return <div className="text-gray-500 text-center py-16">No events found</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((ev) => (
        <div key={ev.id} className="bg-white rounded-2xl shadow-md p-5 border">
          <h2 className="text-lg font-semibold">{ev.title}</h2>
          <p className="text-gray-500 text-sm mt-2">📅 {new Date(ev.startDateTime).toLocaleString()}</p>

          {isMyEvents ? (
            <button
              onClick={() => navigate(`/event/${ev.id}`)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
            >
              More Details
            </button>
          ) : registeredEventIds.includes(ev.id) ? (
            <button disabled className="mt-4 bg-gray-400 text-white px-4 py-2 rounded w-full cursor-not-allowed">
              Already Registered ✅
            </button>
          ) : (
            <button
              onClick={() => navigate(`/register/${ev.id}`)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
            >
              Register as Volunteer
            </button>
          )}
        </div>
      ))}
    </div>
  );
}