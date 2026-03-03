import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/layout/UserSidebar";
import BrowseEvents from "./BrowseEvents";
import MyEvents from "./MyEvents";
import SosPage from "./SosPage";
import { getAllEvents } from "../../api/eventService";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem("activeTab") || "dashboard");
  const [events, setEvents] = useState([]);
  const [sosHistory, setSosHistory] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleSetActiveTab = (tab) => {
    sessionStorage.setItem("activeTab", tab);
    setActiveTab(tab);
  };

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const myEvents = events.filter(event => event.createdBy?.id === currentUser?.id);

  return (
    <div className="flex min-h-screen bg-stone-50">
      <UserSidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} myEventsCount={myEvents.length} />

      <main className="ml-60 flex-1 p-8">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-serif font-semibold mb-4">Welcome to your Dashboard</h1>
            <p className="text-gray-600">Here you can browse events, manage your events, and use SOS features.</p>
          </div>
        )}

        {activeTab === "events" && <BrowseEvents events={events} refreshEvents={fetchEvents} />}

        {activeTab === "myevents" && (
          currentUser ? <MyEvents events={myEvents} onEventCreated={fetchEvents} /> :
          <p className="text-red-500">Please log in to see and create your events.</p>
        )}

        {activeTab === "sos" && <SosPage sosHistory={sosHistory} setSosHistory={setSosHistory} />}
      </main>
    </div>
  );
}