import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap'); body,*{font-family:'Sora',sans-serif;}`;

const AVAILABILITY = [
  "Full Day",
  "Morning Only",
  "Afternoon Only",
  "Evening Only",
  "Weekends Only",
  "Flexible"
];

const inp =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all placeholder-gray-300 resize-none";

const lbl =
  "block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5";

export default function VolunteerRegister() {

  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    skills: "",
    availability: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const change = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const setAvail = (v) =>
    setFormData({ ...formData, availability: v });

  const submit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setError("");

    try {

      await axios.post(
        `http://localhost:8080/api/volunteers/register/${eventId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setSuccess(true);

      /* Redirect back to browse events */
      setTimeout(() => {
        navigate("/user-dashboard");
      }, 1500);

    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f6] flex items-center justify-center p-4">

      <style>{FONTS}</style>

      <div className="w-full max-w-lg">

        {/* Header */}

        <div className="mb-6">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-orange-500 transition-colors mb-5"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Back
          </button>

          <p className="text-sm font-bold text-orange-500 tracking-wide mb-1">
            Community Connect
          </p>

          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Volunteer Registration
          </h1>

          <p className="text-xs text-gray-400 mt-1">
            Complete the form to submit your volunteer application.
          </p>

        </div>


        {/* Card */}

        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] p-7">

          {success ? (

            <div className="text-center py-8">

              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <p className="text-sm font-semibold text-gray-800 mb-1">
                Registration Successful
              </p>

              <p className="text-xs text-gray-500 mb-4">
                Redirecting to events...
              </p>

              <div className="w-5 h-5 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

            </div>

          ) : (

            <form onSubmit={submit} className="space-y-5">

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-600">
                  {error}
                </div>
              )}

              {/* Skills */}

              <div>
                <label className={lbl}>
                  Skills & Qualifications
                </label>

                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={change}
                  className={inp}
                  rows={3}
                  placeholder="List relevant skills or volunteer experience"
                  required
                />
              </div>


              {/* Availability */}

              <div>

                <label className={lbl}>
                  Availability
                </label>

                <div className="flex flex-wrap gap-2 mb-2">

                  {AVAILABILITY.map((opt) => (

                    <button
                      type="button"
                      key={opt}
                      onClick={() => setAvail(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        formData.availability === opt
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {opt}
                    </button>

                  ))}

                </div>

                <textarea
                  name="availability"
                  value={formData.availability}
                  onChange={change}
                  className={inp}
                  rows={1}
                  placeholder="Or describe your availability..."
                  required
                />

              </div>


              {/* Message */}

              <div>

                <label className={lbl}>
                  Statement of Interest
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={change}
                  className={inp}
                  rows={3}
                  placeholder="Why do you want to volunteer?"
                />

              </div>


              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all ${
                  loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >

                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}

              </button>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}