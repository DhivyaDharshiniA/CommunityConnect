import React, { useState } from "react";
import BrowseEvents from "./BrowseEvents";
import axios from "axios";

export default function MyEvents({ userId, events = [], onEventCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    dateTime: "",
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in to create an event.");

    try {
      await axios.post(
        "http://localhost:8080/api/events/create",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Reset form and tell parent to re-fetch
      setFormData({ title: "", description: "", location: "", dateTime: "" });
      if (onEventCreated) onEventCreated();
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event.");
    }
  };

  if (!currentUser) return <p>Please log in to see and create your events.</p>;

  return (
    <div>
      {/* --- Create Event Form --- */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Event
          </button>
        </form>
      </div>

      {/* --- Display My Events --- */}
      <h2 className="text-xl font-semibold mb-4">My Events</h2>
      {events.length === 0 ? (
        <p className="text-gray-500">You haven't created any events yet.</p>
      ) : (
        <BrowseEvents events={events} />
      )}
    </div>
  );
}