// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// //
// // export default function JoinMemberRequest() {
// //   const token = localStorage.getItem("token");
// // //   const userEmail = localStorage.getItem("userEmail");
// //
// //   const [ngos, setNgos] = useState([]);
// //   const [messages, setMessages] = useState({});
// //   const [status, setStatus] = useState({});
// //   const [loading, setLoading] = useState(true);
// //
// //   useEffect(() => {
// //     fetchNGOs();
// //   }, []);
// //
// //   const fetchNGOs = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:8080/api/ngos/list");
// //       setNgos(res.data);
// //     } catch (err) {
// //       console.error("Error fetching NGOs:", err.response?.data || err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //
// //   const handleChange = (ngoId, value) => {
// //     setMessages({ ...messages, [ngoId]: value });
// //   };
// //
// //   const handleSubmit = async (ngoId) => {
// //     if (!token ) {
// //       alert("You must be logged in to send a request.");
// //       return;
// //     }
// //
// //     if (!messages[ngoId]?.trim()) {
// //       setStatus({ ...status, [ngoId]: "Message cannot be empty." });
// //       return;
// //     }
// //
// //     setStatus({ ...status, [ngoId]: "Sending request..." });
// //
// //     try {
// //       await axios.post(
// //         "http://localhost:8080/api/membership/request",
// //         { ngoId, message: messages[ngoId] },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //
// //       setStatus({ ...status, [ngoId]: "Request sent successfully!" });
// //       setMessages({ ...messages, [ngoId]: "" });
// //     } catch (err) {
// //       const errorMsg =
// //         err.response?.data || "Failed to send request. You might already be a member.";
// //       setStatus({ ...status, [ngoId]: errorMsg });
// //       console.error("Error sending request:", errorMsg);
// //     }
// //   };
// //
// //   if (loading) return <p className="text-center mt-10 text-gray-500">Loading NGOs...</p>;
// //
// //   if (!ngos.length)
// //     return <p className="text-center mt-10 text-gray-500">No NGOs available at the moment.</p>;
// //
// //   return (
// //     <div className="space-y-8 px-4 md:px-10">
// //       <h2 className="text-3xl font-bold text-center mb-6">Join an NGO</h2>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {ngos.map((ngo) => (
// //           <div
// //             key={ngo.id}
// //             className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-2xl transition duration-300"
// //           >
// //             <h3 className="text-xl font-semibold text-orange-600 mb-2">{ngo.organizationName}</h3>
// //             <p className="text-gray-700 mb-2">{ngo.description}</p>
// //             <p className="text-sm text-gray-500 mb-3">
// //               {ngo.city}, {ngo.state} | 📞 {ngo.phone} | 🌐{" "}
// //               <a
// //                 href={ngo.website}
// //                 target="_blank"
// //                 rel="noreferrer"
// //                 className="text-orange-500 hover:underline"
// //               >
// //                 {ngo.website}
// //               </a>
// //             </p>
// //
// //             <textarea
// //               className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
// //               rows="3"
// //               placeholder="Why do you want to become a member?"
// //               value={messages[ngo.id] || ""}
// //               onChange={(e) => handleChange(ngo.id, e.target.value)}
// //             />
// //
// //             <button
// //               onClick={() => handleSubmit(ngo.id)}
// //               disabled={status[ngo.id]?.includes("success")}
// //               className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition duration-200"
// //             >
// //               {status[ngo.id]?.includes("success") ? "Request Sent" : "Send Request"}
// //             </button>
// //
// //             {status[ngo.id] && (
// //               <p
// //                 className={`mt-2 text-sm ${
// //                   status[ngo.id].includes("success") ? "text-green-600" : "text-red-600"
// //                 }`}
// //               >
// //                 {status[ngo.id]}
// //               </p>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
//
//
// import React, { useEffect, useState } from "react";
// import axios from "axios";
//
// export default function JoinMemberRequest() {
//
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");   // 👈 get role
//
//   const [ngos, setNgos] = useState([]);
//   const [messages, setMessages] = useState({});
//   const [status, setStatus] = useState({});
//   const [loading, setLoading] = useState(true);
//
//   /* 🚫 Hide this page if NGO */
//
//   if (role === "NGO") {
//     return (
//       <div className="text-center mt-10 text-red-500 text-xl">
//         NGOs cannot send membership requests.
//       </div>
//     );
//   }
//
//   useEffect(() => {
//     fetchNGOs();
//   }, []);
//
//   const fetchNGOs = async () => {
//     try {
//       const res = await axios.get("http://localhost:8080/api/ngos/list");
//       setNgos(res.data);
//     } catch (err) {
//       console.error("Error fetching NGOs:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const handleChange = (ngoId, value) => {
//     setMessages({ ...messages, [ngoId]: value });
//   };
//
//   const handleSubmit = async (ngoId) => {
//
//     if (!token) {
//       alert("You must be logged in to send a request.");
//       return;
//     }
//
//     if (!messages[ngoId]?.trim()) {
//       setStatus({ ...status, [ngoId]: "Message cannot be empty." });
//       return;
//     }
//
//     setStatus({ ...status, [ngoId]: "Sending request..." });
//
//     try {
//
//       await axios.post(
//         "http://localhost:8080/api/membership/request",
//         { ngoId, message: messages[ngoId] },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//
//       setStatus({ ...status, [ngoId]: "Request sent successfully!" });
//       setMessages({ ...messages, [ngoId]: "" });
//
//     } catch (err) {
//
//       const errorMsg =
//         err.response?.data || "Failed to send request.";
//
//       setStatus({ ...status, [ngoId]: errorMsg });
//
//     }
//
//   };
//
//   if (loading)
//     return <p className="text-center mt-10 text-gray-500">Loading NGOs...</p>;
//
//   if (!ngos.length)
//     return <p className="text-center mt-10 text-gray-500">No NGOs available.</p>;
//
//   return (
//
//     <div className="space-y-8 px-4 md:px-10">
//
//       <h2 className="text-3xl font-bold text-center mb-6">
//         Join an NGO
//       </h2>
//
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//
//         {ngos.map((ngo) => (
//
//           <div
//             key={ngo.id}
//             className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-2xl transition duration-300"
//           >
//
//             <h3 className="text-xl font-semibold text-orange-600 mb-2">
//               {ngo.organizationName}
//             </h3>
//
//             <p className="text-gray-700 mb-2">
//               {ngo.description}
//             </p>
//
//             <p className="text-sm text-gray-500 mb-3">
//               {ngo.city}, {ngo.state} | 📞 {ngo.phone}
//             </p>
//
//             <textarea
//               className="w-full border rounded-lg p-3 mt-2"
//               rows="3"
//               placeholder="Why do you want to become a member?"
//               value={messages[ngo.id] || ""}
//               onChange={(e) => handleChange(ngo.id, e.target.value)}
//             />
//
//             <button
//               onClick={() => handleSubmit(ngo.id)}
//               className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
//             >
//               Send Request
//             </button>
//
//             {status[ngo.id] && (
//               <p className="mt-2 text-sm text-gray-600">
//                 {status[ngo.id]}
//               </p>
//             )}
//
//           </div>
//
//         ))}
//
//       </div>
//
//     </div>
//
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";

const statusConfig = {
  Pending: {
    bg: "#fffbeb",
    borderColor: "#fcd34d",
    color: "#92400e",
    icon: "⏳",
    label: "Pending Review",
  },
  APPROVED: {
    bg: "#ecfdf5",
    borderColor: "#6ee7b7",
    color: "#065f46",
    icon: "✅",
    label: "Approved",
  },
  REJECTED: {
    bg: "#fef2f2",
    borderColor: "#fca5a5",
    color: "#991b1b",
    icon: "❌",
    label: "Rejected",
  },
};

export default function JoinMemberRequest() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [ngos, setNgos] = useState([]);
  const [messages, setMessages] = useState({});
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [membershipStatuses, setMembershipStatuses] = useState([]);

  if (role === "NGO") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff7ed" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 48px", textAlign: "center", border: "1.5px solid #fca5a5", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚫</div>
          <p style={{ color: "#dc2626", fontSize: "1.15rem", fontWeight: 600 }}>NGOs cannot send membership requests.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchNGOs();
    fetchMyMembershipStatuses();
  }, []);

  const fetchNGOs = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/ngos/list");
      setNgos(res.data);
    } catch (err) {
      console.error("Error fetching NGOs:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyMembershipStatuses = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:8080/api/membership/my-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembershipStatuses(res.data);
    } catch (err) {
      console.error("Error fetching membership statuses:", err.response?.data || err.message);
    }
  };

  const getStatusForNgo = (ngoId) =>
    membershipStatuses.find((m) => String(m.ngoId) === String(ngoId));

  // The NGO the user is already an approved member of (if any)
  const approvedMembership = membershipStatuses.find((m) => m.status === "APPROVED");

  const handleChange = (ngoId, value) => {
    setMessages({ ...messages, [ngoId]: value });
  };

  const handleSubmit = async (ngoId) => {
    if (!token) {
      alert("You must be logged in to send a request.");
      return;
    }

    // Block if already a member of a DIFFERENT NGO
    if (approvedMembership && String(approvedMembership.ngoId) !== String(ngoId)) {
      setStatus({ ...status, [ngoId]: "already_member" });
      return;
    }

    // Block if already applied (pending) to this NGO
    const existing = getStatusForNgo(ngoId);
    if (existing?.status === "Pending") {
      setStatus({ ...status, [ngoId]: "already_applied" });
      return;
    }

    if (!messages[ngoId]?.trim()) {
      setStatus({ ...status, [ngoId]: "empty" });
      return;
    }

    setStatus({ ...status, [ngoId]: "sending" });
    try {
      await axios.post(
        "http://localhost:8080/api/membership/request",
        { ngoId, message: messages[ngoId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus({ ...status, [ngoId]: "success" });
      setMessages({ ...messages, [ngoId]: "" });
      fetchMyMembershipStatuses();
    } catch (err) {
      // Map backend error messages to friendly reasons
      const raw = err.response?.data || "";
      if (typeof raw === "string" && raw.toLowerCase().includes("already")) {
        setStatus({ ...status, [ngoId]: "already_applied" });
      } else if (typeof raw === "string" && raw.toLowerCase().includes("member")) {
        setStatus({ ...status, [ngoId]: "already_member" });
      } else {
        setStatus({ ...status, [ngoId]: "error" });
      }
    }
  };

  // Returns a styled inline notice based on status code
  const renderFeedback = (ngoId) => {
    const s = status[ngoId];
    if (!s) return null;
    const styles = {
      base: { fontSize: "0.78rem", marginTop: 8, borderRadius: 8, padding: "7px 11px", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 },
    };
    if (s === "sending") return <p style={{ ...styles.base, color: "#78716c", background: "#f9fafb", border: "1px solid #e5e7eb" }}>⏳ Sending your request...</p>;
    if (s === "success") return <p style={{ ...styles.base, color: "#065f46", background: "#ecfdf5", border: "1px solid #6ee7b7" }}>✅ Request sent successfully!</p>;
    if (s === "empty") return <p style={{ ...styles.base, color: "#92400e", background: "#fffbeb", border: "1px solid #fcd34d" }}>✏️ Please write a message before sending.</p>;
    if (s === "already_applied") return <p style={{ ...styles.base, color: "#1d4ed8", background: "#eff6ff", border: "1px solid #93c5fd" }}>📋 You have already applied to this NGO. Your request is under review.</p>;
    if (s === "already_member") return <p style={{ ...styles.base, color: "#7e22ce", background: "#faf5ff", border: "1px solid #d8b4fe" }}>🏛️ You are already a member of another NGO. You can only belong to one organisation at a time.</p>;
    if (s === "error") return <p style={{ ...styles.base, color: "#991b1b", background: "#fef2f2", border: "1px solid #fca5a5" }}>⚠️ Something went wrong. Please try again later.</p>;
    return null;
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fff7ed", gap: 12 }}>
        <div style={{ width: 40, height: 40, border: "4px solid #fb923c", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#78716c", fontWeight: 500 }}>Loading NGOs...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (!ngos.length)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff7ed" }}>
        <p style={{ color: "#a8a29e", fontSize: "1.1rem" }}>No NGOs available at the moment.</p>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        .jmr-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: linear-gradient(155deg, #fff7ed 0%, #ffffff 65%); padding: 44px 20px 64px; }
        .jmr-card { background: #fff; border-radius: 20px; border: 1.5px solid #e5e7eb; box-shadow: 0 2px 16px rgba(0,0,0,0.055); overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
        .jmr-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(234,88,12,0.12); }
        .jmr-textarea { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 10px 14px; font-size: 0.88rem; font-family: 'DM Sans', sans-serif; resize: vertical; background: #f9fafb; color: #374151; transition: border-color 0.18s, box-shadow 0.18s; box-sizing: border-box; }
        .jmr-textarea:focus { outline: none; border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.11); background: #fff; }
        .jmr-btn { background: linear-gradient(135deg,#f97316,#ea580c); color: #fff; border: none; border-radius: 12px; padding: 10px 0; width: 100%; font-size: 0.93rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; letter-spacing: 0.01em; transition: opacity 0.18s, transform 0.15s; margin-top: 10px; }
        .jmr-btn:hover { opacity: 0.87; transform: scale(0.99); }
        .jmr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; max-width: 1100px; margin: 0 auto; }
      `}</style>

      <div className="jmr-root">
        {/* Page header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: "2.3rem", color: "#1c1917", marginBottom: 8 }}>
            Join an NGO
          </h2>
          <p style={{ color: "#78716c", fontSize: "0.97rem", maxWidth: 460, margin: "0 auto" }}>
            Browse organisations and send a membership request to get involved.
          </p>
          <div style={{ width: 52, height: 4, background: "linear-gradient(90deg,#f97316,#fb923c)", borderRadius: 99, margin: "14px auto 0" }} />
        </div>

        <div className="jmr-grid">
          {ngos.map((ngo) => {
            const membership = getStatusForNgo(ngo.id);
            const memberStatus = membership?.status; // "Pending" | "APPROVED" | "REJECTED" | undefined
            const cfg = memberStatus ? statusConfig[memberStatus] : null;

            // Is the user already an approved member of a DIFFERENT NGO?
            const isBlockedByOtherMembership =
              approvedMembership && String(approvedMembership.ngoId) !== String(ngo.id);

            // Only hide the form if THIS card is APPROVED
            const hideForm = memberStatus === "APPROVED";

            return (
              <div key={ngo.id} className="jmr-card">
                {/* Card top strip */}
                <div style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", padding: "18px 22px 14px", borderBottom: "1.5px solid #fed7aa" }}>
                  <h3 style={{ fontFamily: "'Lora', serif", fontSize: "1.1rem", color: "#c2410c", marginBottom: 4 }}>
                    {ngo.organizationName}
                  </h3>
                  <p style={{ fontSize: "0.77rem", color: "#78716c" }}>
                    📍 {ngo.city}, {ngo.state} &nbsp;|&nbsp; 📞 {ngo.phone}
                  </p>
                </div>

                {/* Card body */}
                <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <p style={{ fontSize: "0.87rem", color: "#374151", lineHeight: 1.65, marginBottom: 14 }}>
                    {ngo.description}
                  </p>

                  {/* ── Status banner for THIS ngo's request ── */}
                  {cfg && (
                    <div style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      background: cfg.bg, border: `1.5px solid ${cfg.borderColor}`,
                      borderRadius: 12, padding: "10px 14px", marginBottom: 14,
                      color: cfg.color,
                    }}>
                      <span style={{ fontSize: "1.1rem", lineHeight: 1.3 }}>{cfg.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.83rem" }}>
                          Request Status: {cfg.label}
                        </div>
                        {membership?.message && (
                          <div style={{ fontSize: "0.74rem", opacity: 0.7, marginTop: 3 }}>
                            "{membership.message}"
                          </div>
                        )}
                        {memberStatus === "APPROVED" && (
                          <div style={{ fontSize: "0.78rem", marginTop: 5 }}>🎉 You are now a member of this NGO.</div>
                        )}
                        {memberStatus === "REJECTED" && (
                          <div style={{ fontSize: "0.78rem", marginTop: 5 }}>
                            Your application was rejected by this NGO. You may reapply below.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Blocked: already a member of another NGO ── */}
                  {isBlockedByOtherMembership && (
                    <div style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      background: "#faf5ff", border: "1.5px solid #d8b4fe",
                      borderRadius: 12, padding: "10px 14px", marginBottom: 14,
                      color: "#7e22ce",
                    }}>
                      <span style={{ fontSize: "1.1rem" }}>🏛️</span>
                      <div style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                        You are already a member of another NGO. You can only belong to <strong>one organisation</strong> at a time.
                      </div>
                    </div>
                  )}

                  {/* ── Request form ── */}
                  {/* Hide only if APPROVED on THIS card, or already member of another */}
                  {!hideForm && !isBlockedByOtherMembership && (
                    <>
                      {memberStatus === "REJECTED" && (
                        <p style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 6 }}>
                          Want to try again? Send a new request below.
                        </p>
                      )}
                      <textarea
                        className="jmr-textarea"
                        rows="3"
                        placeholder="Why do you want to become a member?"
                        value={messages[ngo.id] || ""}
                        onChange={(e) => handleChange(ngo.id, e.target.value)}
                      />
                      <button className="jmr-btn" onClick={() => handleSubmit(ngo.id)}>
                        {memberStatus === "Pending" ? "Update Request →"
                          : memberStatus === "REJECTED" ? "Reapply →"
                          : "Send Request →"}
                      </button>
                      {renderFeedback(ngo.id)}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}