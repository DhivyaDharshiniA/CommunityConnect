import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FONTS } from "./UserDashboard";

const statusMap = {
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");

        const ev = await axios.get(
          `http://localhost:8080/api/events/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvent(ev.data);

        try {
          const vols = await axios.get(
            `http://localhost:8080/api/volunteers/event/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setVolunteers(vols.data);
        } catch {
          setVolunteers([]);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh] pt-20">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );

  if (!event)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] pt-20">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-900 mb-2">Event not found</p>
          <p className="text-sm text-gray-500 mb-8">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Go back
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto anim px-4 py-8 lg:px-8">
      <style>{FONTS}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors duration-200 mb-8 lg:mb-12"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
        Back to events
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden mb-8 lg:mb-12">
        {event.bannerImage ? (
          <div className="relative">
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-64 lg:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        )}

        <div className="p-8 lg:p-10">
          {event.category && (
            <span className="inline-block text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
              {event.category}
            </span>
          )}

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
            {event.title}
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: "Starts",
                icon: "🕐",
                val: new Date(event.startDateTime).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              },
              {
                label: "Ends",
                icon: "🕔",
                val: new Date(event.endDateTime).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              },
              {
                label: "Location",
                icon: "📍",
                val: [event.venue, event.city, event.state].filter(Boolean).join(", ") || "TBD",
              },
            ].map((item) => (
              <div key={item.label} className="group bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{item.icon}</div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide group-hover:text-gray-600 transition-colors">
                    {item.label}
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-900 leading-tight">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl border border-gray-100 shadow-xl p-1 mb-10 lg:mb-12">
        {["overview", "volunteers"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-4 lg:py-5 px-4 rounded-lg text-sm lg:text-base font-bold transition-all duration-300 relative ${
              tab === t
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200/50 scale-[1.02]"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t === "volunteers"
              ? `Volunteers (${volunteers.length})`
              : "Event Overview"}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div className="space-y-8 lg:space-y-12">

          {/* About Section */}
          {event.description && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">About this Event</h2>
              </div>
              <div className="prose prose-sm lg:prose text-gray-700 leading-relaxed max-w-none">
                <p>{event.description}</p>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid xl:grid-cols-3 gap-8 lg:gap-10">

            {/* QR Code */}
            {event.qrCodePath && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 lg:p-10 xl:col-span-1">
                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118a6.004 6.004 0 011.846 4.118H13.97zm.828 5.118a6.002 6.002 0 01-.837 4.118 6.002 6.002 0 01-3.134 0 6.002 6.002 0 01-.837-4.118H10z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900">Event QR Code</h3>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg mb-6">
                    <img
                      src={event.qrCodePath}
                      alt="Event QR Code"
                      className="w-40 h-40 lg:w-48 lg:h-48 object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Scan at the event venue</p>
                </div>
              </div>
            )}

            {/* Requirements & Benefits */}
            <div className="space-y-6 xl:col-span-2">
              {event.requirements && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900">Requirements</h3>
                  </div>
                  <div className="prose prose-sm lg:prose text-gray-700 leading-relaxed max-w-none">
                    <p>{event.requirements}</p>
                  </div>
                </div>
              )}

              {event.benefits && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900">Benefits</h3>
                  </div>
                  <div className="prose prose-sm lg:prose text-gray-700 leading-relaxed max-w-none">
                    <p>{event.benefits}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Organizer */}
          {event.organizerName && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-25 rounded-xl border-2 border-orange-100 shadow-2xl p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-orange-200">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-xl border-4 border-white shadow-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl lg:text-3xl font-black text-orange-600">
                    {event.organizerName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-1">
                    {event.organizerName}
                  </h3>
                  <p className="text-lg font-semibold text-orange-700">Event Organizer</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {event.contactEmail && (
                  <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg border border-white/50">
                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 4.182A2 2 0 0110.73 12H3v6a1 1 0 001 1h14a1 1 0 001-1v-6l-7.27-4.182A2.001 2.001 0 0013.27 8H21V4a1 1 0 00-1-1H2a1 1 0 00-1 1v4z" />
                    </svg>
                    <span className="font-medium text-gray-800">{event.contactEmail}</span>
                  </div>
                )}
                {event.contactPhone && (
                  <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg border border-white/50">
                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-medium text-gray-800">{event.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VOLUNTEERS TAB */}
      {tab === "volunteers" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-2xl overflow-hidden">
          {volunteers.length === 0 ? (
            <div className="py-24 lg:py-32 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No volunteers yet</h3>
              <p className="text-lg text-gray-500">Be the first to join this event!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    {["Volunteer", "Skills", "Availability", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((vol, index) => (
                    <tr
                      key={vol.id}
                      className={`border-b border-gray-50 hover:bg-orange-50/40 transition-all duration-200 ${index % 2 === 0 ? "bg-gray-50/30" : ""}`}
                    >
                      <td className="px-6 py-6 font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
                            {vol.user?.name?.[0]?.toUpperCase()}
                          </div>
                          <span>{vol.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-600 max-w-xs">
                        {vol.skills || "No skills listed"}
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-600">
                        {vol.availability || "Not specified"}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-md border ${statusMap[vol.status]}`}>
                          {vol.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}