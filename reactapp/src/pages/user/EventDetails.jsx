import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhone } from "react-icons/fa";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Fetch event details
      const eventRes = await axios.get(
        `http://localhost:8080/api/events/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvent(eventRes.data);

      // 2️⃣ Fetch volunteers (creator only)
      try {
        const volRes = await axios.get(
          `http://localhost:8080/api/volunteers/event/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVolunteers(volRes.data);
      } catch (err) {
        // If not creator → 403
        setVolunteers([]);
      }

    } catch (err) {
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading event details...
      </div>
    );
  }

  // ---------------- EVENT NOT FOUND ----------------
  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Event not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium mb-4"
      >
        ← <span>Back</span>
      </button>

      {/* EVENT HEADER */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
        {event.bannerImage && (
          <img
            src={event.bannerImage}
            alt="Event Banner"
            className="w-full h-80 object-cover"
          />
        )}

        <div className="p-8 space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-gray-600">
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" />
              {event.venue}, {event.city}, {event.state}
            </p>

            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-green-500" />
              {new Date(event.startDateTime).toLocaleString()} -{" "}
              {new Date(event.endDateTime).toLocaleString()}
            </p>

            {event.category && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                {event.category}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">
              {event.description || "No description provided."}
            </p>
          </div>

          {/* REQUIREMENTS & BENEFITS */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {event.requirements && (
              <div className="bg-gray-50 p-4 rounded-xl border shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                <p className="text-gray-700">{event.requirements}</p>
              </div>
            )}

            {event.benefits && (
              <div className="bg-gray-50 p-4 rounded-xl border shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Benefits</h3>
                <p className="text-gray-700">{event.benefits}</p>
              </div>
            )}
          </div>

          {/* ORGANIZER INFO */}
          <div className="mt-6 border-t pt-4 space-y-2 text-gray-700">
            <p><strong>Organizer:</strong> {event.organizerName}</p>
            <p className="flex items-center gap-2">
              <FaEnvelope /> {event.contactEmail}
            </p>
            <p className="flex items-center gap-2">
              <FaPhone /> {event.contactPhone}
            </p>
          </div>
        </div>
      </div>

      {/* VOLUNTEERS SECTION */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">
          Registered Volunteers ({volunteers.length})
        </h2>

        {volunteers.length === 0 ? (
          <p className="text-gray-500">
            No volunteers have registered yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {volunteers.map((vol) => (
              <div
                key={vol.id}
                className="border rounded-xl p-5 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg text-gray-800">
                  {vol.user?.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {vol.user?.email}
                </p>

                <div className="mt-3 text-gray-700 space-y-1 text-sm">
                  <p><strong>Skills:</strong> {vol.skills}</p>
                  <p><strong>Availability:</strong> {vol.availability}</p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        vol.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : vol.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {vol.status}
                    </span>
                  </p>
                </div>

                {vol.message && (
                  <div className="mt-3 text-gray-600 text-sm">
                    <strong>Message:</strong>
                    <p>{vol.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}