import React, { useState, useEffect } from "react";
import BrowseEvents from "./BrowseEvents";
import axios from "axios";

export default function MyEvents() {
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

  if (!currentUser)
    return <p>Please log in to see and create your events.</p>;

  return (
    <div>

      {myEvents.length === 0 ? (
        <p className="text-gray-500">You haven't created any events yet.</p>
      ) : (
        <BrowseEvents events={myEvents} isMyEvents={true} />
      )}
    </div>
  );
}