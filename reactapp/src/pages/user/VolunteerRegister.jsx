import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VolunteerRegister() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    skills: "",
    availability: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        `http://localhost:8080/api/volunteers/register/${eventId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccess("Successfully Registered! Redirecting...");
      setFormData({
        skills: "",
        availability: "",
        message: "",
      });

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/user-dashboard");
      }, 1500);

    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Volunteer Registration
      </h2>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium mb-1">
            Your Skills
          </label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="First Aid, Teamwork, Event Management..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Availability
          </label>
          <textarea
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Full Day, Morning Only..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Why do you want to volunteer?
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Tell us your motivation..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}