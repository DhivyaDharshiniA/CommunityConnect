import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function AttendancePage() {
  const { eventId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitAttendance = async () => {
    try {
      const res = await axios.post(
            `http://10.74.31.23:8080/api/attendance/mark/${eventId}`,
        {
          name,
          email,
        }
      );

      setMessage(res.data);
    } catch (err) {
      setMessage("Failed to mark attendance");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          Event Attendance
        </h2>

        <input
          type="text"
          placeholder="Enter Name"
          className="w-full border p-2 mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={submitAttendance}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Submit
        </button>

        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}