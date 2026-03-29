import React, { useEffect, useState } from "react";
import axios from "axios";

const initials = (email = "") =>
  email.split("@")[0].slice(0, 2).toUpperCase();

export default function MembersPage() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role?.toUpperCase();

  const isNGO = role === "NGO";
  const isVolunteer = role === "VOLUNTEER" || role === "USER";

  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ngoName, setNgoName] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  const API = "http://localhost:8080/api/membership";

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    if (!isNGO) {
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    (async () => {
      try {
        const [req, mem] = await Promise.all([
          axios.get(`${API}/my-requests`, { headers }),
          axios.get(`${API}/members`, { headers }),
        ]);

        setRequests(Array.isArray(req.data) ? req.data : []);
        setMembers(Array.isArray(mem.data) ? mem.data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, isNGO]);

  const handleAction = async (id, action) => {
    try {
      await axios.put(`${API}/${action}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: action.toUpperCase() } : r
        )
      );

      showToast(action === "approve" ? "Approved successfully" : "Rejected");
    } catch {
      showToast("Something went wrong");
    }
  };

  const sendRequest = async () => {
    if (!ngoName.trim()) return;

    try {
      await axios.post(
        `${API}/request`,
        { ngoName, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Request sent!");
      setNgoName("");
      setMessage("");
    } catch (err) {
      showToast(err.response?.data || "Failed");
    }
  };

  // ───────── STATES ─────────

  if (!user || !token) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Please login
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Loading...
      </div>
    );
  }

  // ───────── NGO VIEW ─────────
  if (isNGO) {
    const pending = requests.filter((r) => r.status === "PENDING");

    return (
      <div className="space-y-6">

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Pending" value={pending.length} color="amber" />
          <StatCard label="Members" value={members.length} color="green" />
          <StatCard label="Requests" value={requests.length} color="blue" />
        </div>

        {/* PENDING REQUESTS */}
        <div className="bg-white rounded-2xl border p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Pending Requests
          </h3>

          {pending.length === 0 ? (
            <p className="text-slate-400 text-sm">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pending.map((r, i) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">

                  <Avatar initials={initials(r.userEmail)} idx={i} />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                      {r.userEmail}
                    </p>
                    <p className="text-xs text-slate-400">
                      Membership request
                    </p>
                  </div>

                  <Badge status={r.status} />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(r.id, "approve")}
                      className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(r.id, "reject")}
                      className="px-3 py-1.5 text-xs bg-red-100 text-red-600 rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ALL REQUESTS */}
        <div className="bg-white rounded-2xl border p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            All Requests
          </h3>

          {requests.length === 0 ? (
            <p className="text-slate-400 text-sm">No requests found</p>
          ) : (
            <div className="space-y-3">
              {requests.map((r, i) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">

                  <Avatar initials={initials(r.userEmail)} idx={i} />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                      {r.userEmail}
                    </p>
                    <p className="text-xs text-slate-400">
                      Membership request
                    </p>
                  </div>

                  <Badge status={r.status} />

                  {r.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(r.id, "approve")}
                        className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(r.id, "reject")}
                        className="px-3 py-1.5 text-xs bg-red-100 text-red-600 rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MEMBERS */}
        <div className="bg-white rounded-2xl border p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Active Members
          </h3>

          {members.length === 0 ? (
            <p className="text-slate-400 text-sm">No members yet</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {members.map((m, i) => (
                <div key={m.id} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-full">
                  <Avatar initials={initials(m.userEmail)} idx={i} size="sm" />
                  <span className="text-xs font-medium text-slate-700">
                    {m.userEmail}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {toast && (
          <div className="fixed bottom-5 right-5 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm">
            {toast}
          </div>
        )}
      </div>
    );
  }

  // ───────── VOLUNTEER VIEW ─────────
  if (isVolunteer) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">
          Join an NGO
        </h2>

        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="NGO Name"
          value={ngoName}
          onChange={(e) => setNgoName(e.target.value)}
        />

        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendRequest}
          className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-semibold"
        >
          Send Request
        </button>

        {toast && (
          <div className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm">
            {toast}
          </div>
        )}
      </div>
    );
  }

  return <div>Access Denied</div>;
}

// ───────── COMPONENTS ─────────

const Badge = ({ status }) => {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-600",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};

const Avatar = ({ initials, idx = 0, size = "md" }) => {
  const sizes = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-9 h-9 text-xs",
  };

  const colors = [
    "from-teal-400 to-cyan-500",
    "from-blue-400 to-blue-600",
    "from-purple-400 to-indigo-500",
  ];

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white font-bold`}>
      {initials}
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const map = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="bg-white border rounded-2xl p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${map[color]}`}>
        ●
      </div>
      <p className="text-xl font-bold text-slate-800 mt-2">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
};