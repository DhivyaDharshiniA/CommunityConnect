import React, { useState, useEffect } from "react";
import BrowseEvents from "./BrowseEvents";
import axios from "axios";

export default function MyEvents() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    venue: "",
    city: "",
    state: "",
    organizerName: "",
    contactEmail: "",
    contactPhone: "",
    startDateTime: "",
    endDateTime: "",
    requirements: "",
    benefits: ""
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/events/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMyEvents(res.data);
    } catch (err) {
      console.error("Error fetching my events", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setBannerFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser)
      return alert("You must be logged in to create an event.");

    try {
      const data = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append file
      if (bannerFile) {
        data.append("bannerImage", bannerFile);
      }

      await axios.post(
        "http://localhost:8080/api/events/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Event created successfully!");

      setFormData({
        title: "",
        description: "",
        category: "",
        venue: "",
        city: "",
        state: "",
        organizerName: "",
        contactEmail: "",
        contactPhone: "",
        startDateTime: "",
        endDateTime: "",
        requirements: "",
        benefits: ""
      });

      setBannerFile(null);
      fetchMyEvents();

    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event.");
    }
  };

  if (!currentUser)
    return <p>Please log in to see and create your events.</p>;

  return (
    <div>
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

          <input type="text" name="title" value={formData.title}
            onChange={handleChange} placeholder="Event Title"
            className="p-2 border rounded" required />

          <input type="text" name="category" value={formData.category}
            onChange={handleChange} placeholder="Category"
            className="p-2 border rounded" />

          <input type="text" name="venue" value={formData.venue}
            onChange={handleChange} placeholder="Venue"
            className="p-2 border rounded" />

          <input type="text" name="city" value={formData.city}
            onChange={handleChange} placeholder="City"
            className="p-2 border rounded" />

          <input type="text" name="state" value={formData.state}
            onChange={handleChange} placeholder="State"
            className="p-2 border rounded" />

          <input type="text" name="organizerName" value={formData.organizerName}
            onChange={handleChange} placeholder="Organizer Name"
            className="p-2 border rounded" />

          <input type="email" name="contactEmail" value={formData.contactEmail}
            onChange={handleChange} placeholder="Contact Email"
            className="p-2 border rounded" />

          <input type="text" name="contactPhone" value={formData.contactPhone}
            onChange={handleChange} placeholder="Contact Phone"
            className="p-2 border rounded" />

          <input type="datetime-local" name="startDateTime"
            value={formData.startDateTime}
            onChange={handleChange}
            className="p-2 border rounded w-full" required />

          <input type="datetime-local" name="endDateTime"
            value={formData.endDateTime}
            onChange={handleChange}
            className="p-2 border rounded w-full" required />

          <textarea name="description" value={formData.description}
            onChange={handleChange} placeholder="Event Description"
            className="p-2 border rounded md:col-span-2" />

          <textarea name="requirements" value={formData.requirements}
            onChange={handleChange} placeholder="Requirements"
            className="p-2 border rounded md:col-span-2" />

          <textarea name="benefits" value={formData.benefits}
            onChange={handleChange} placeholder="Benefits"
            className="p-2 border rounded md:col-span-2" />

          {/* 🔥 IMAGE UPLOAD FIELD */}
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="p-2 border rounded md:col-span-2"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 md:col-span-2"
          >
            Create Event
          </button>

        </form>
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Events</h2>

      {myEvents.length === 0 ? (
        <p className="text-gray-500">You haven't created any events yet.</p>
      ) : (
        <BrowseEvents events={myEvents} isMyEvents={true} />
      )}
    </div>
  );
}