import React, { useState } from "react";

export default function SosPage({ sosHistory, setSosHistory }) {

  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    const newSos = {
      id: Date.now(),
      type,
      location,
      time: "Just now"
    };

    setSosHistory([newSos, ...sosHistory]);
    setType("");
    setLocation("");
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold mb-6">
        SOS Alerts
      </h1>

      <input
        placeholder="Emergency type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 mr-2"
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 mr-2"
      />

      <button
        onClick={handleSubmit}
        className="bg-red-500 text-white px-4 py-2 rounded">
        Raise SOS
      </button>
    </div>
  );
}