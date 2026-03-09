// import React, { useEffect, useState } from "react";
// import axios from "axios";
//
// const HelpFeed = () => {
//   const [requests, setRequests] = useState([]);
//
//   useEffect(() => {
//     axios.get("http://localhost:8080/api/help/all")
//       .then(res => setRequests(res.data))
//       .catch(err => console.error(err));
//   }, []);
//
//   return (
//     <div className="help-feed">
//       <h2>All Help Requests</h2>
//       {requests.map(req => (
//         <div key={req.id} className="help-card">
//           <h3>{req.title}</h3>
//           <p>{req.description}</p>
//           <p>Category: {req.category}</p>
//           <p>Needed: ${req.amountNeeded} | Raised: ${req.amountRaised}</p>
//           <p>Status: {req.status}</p>
//         </div>
//       ))}
//     </div>
//   );
// };
//
// export default HelpFeed;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { FONTS } from "./UserDashboard";

function DonateModal({ request, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState("input"); // input | confirm | done
  const [loading, setLoading] = useState(false);

  const progress = request.amountNeeded
    ? Math.min((request.amountRaised / request.amountNeeded) * 100, 100) : 0;
  const remaining = Math.max((request.amountNeeded || 0) - (request.amountRaised || 0), 0);

  const submit = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/donation/donate", { amount: parseFloat(amount), helpRequest: { id: request.id } });
      setStage("done");
      setTimeout(() => { onSuccess(); onClose(); }, 2200);
    } catch { alert("Donation failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden">

        {/* Modal header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">{request.category}</p>
            <h2 className="text-base font-semibold text-gray-900 leading-snug">{request.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/60">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Raised: <span className="font-semibold text-gray-800">₹{(request.amountRaised || 0).toLocaleString("en-IN")}</span></span>
            <span>Goal: <span className="font-semibold text-gray-800">₹{(request.amountNeeded || 0).toLocaleString("en-IN")}</span></span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">₹{remaining.toLocaleString("en-IN")} remaining to reach the goal</p>
        </div>

        <div className="px-6 py-5">
          {stage === "done" ? (
            <div className="text-center py-5">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <p className="text-base font-semibold text-gray-800 mb-1">Donation Successful</p>
              <p className="text-sm text-gray-500">Your contribution of <span className="font-semibold text-gray-800">₹{Number(amount).toLocaleString("en-IN")}</span> has been recorded.</p>
            </div>

          ) : stage === "confirm" ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">Please confirm your donation:</p>
              <div className="bg-gray-50 rounded-lg border border-gray-100 px-5 py-4 text-center mb-5">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Donation Amount</p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">₹{Number(amount).toLocaleString("en-IN")}</p>
                <p className="text-xs text-gray-400 mt-1">to {request.title}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStage("input")} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button onClick={submit} disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${loading ? "bg-gray-300" : "bg-orange-500 hover:bg-orange-600"}`}>
                  {loading ? <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing</> : "Confirm Donation"}
                </button>
              </div>
            </div>

          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Enter Amount (₹)</label>
              <div className="relative mb-3">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">₹</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all"
                  placeholder="0" />
              </div>
              <div className="flex gap-2 mb-5">
                {[100, 500, 1000, 2000].map(n => (
                  <button key={n} onClick={() => setAmount(String(n))}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${amount == n ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}>
                    ₹{n}
                  </button>
                ))}
              </div>
              <button onClick={() => { if (Number(amount) > 0) setStage("confirm"); }}
                className="w-full py-2.5 rounded-lg text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    OPEN: "bg-green-50 text-green-700 border-green-200",
    CLOSED: "bg-gray-100 text-gray-500 border-gray-200",
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${map[status] || map.PENDING}`}>
      {status}
    </span>
  );
}

export default function HelpFeed() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchRequests(); }, []);
  const fetchRequests = async () => {
    try { const res = await axios.get("http://localhost:8080/api/help/all"); setRequests(res.data); }
    catch {} finally { setLoading(false); }
  };

  const statuses = ["All", ...Array.from(new Set(requests.map(r => r.status).filter(Boolean)))];
  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    return (!q || r.title?.toLowerCase().includes(q) || r.category?.toLowerCase().includes(q))
      && (filterStatus === "All" || r.status === filterStatus);
  });

  const totalRaised = requests.reduce((s, r) => s + (r.amountRaised || 0), 0);
  const totalNeeded = requests.reduce((s, r) => s + (r.amountNeeded || 0), 0);
  const openCount = requests.filter(r => r.status === "OPEN").length;

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-[3px] border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-medium">Loading requests...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl anim">
      <style>{FONTS}</style>

      {/* Header */}
      <div className="mb-7 pb-5 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Donate &amp; Support</h1>
        <p className="text-sm text-gray-400 mt-1 font-light">Browse open help requests and contribute to your community.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Open Requests", value: openCount },
          { label: "Total Raised", value: `₹${totalRaised.toLocaleString("en-IN")}` },
          { label: "Still Needed", value: `₹${Math.max(totalNeeded - totalRaised, 0).toLocaleString("en-IN")}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] px-5 py-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </span>
          <input className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all"
            placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${filterStatus === s ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">{filtered.length} request{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 py-20 text-center">
          <p className="text-sm font-semibold text-gray-500">No requests found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((req, i) => {
            const progress = req.amountNeeded ? Math.min((req.amountRaised / req.amountNeeded) * 100, 100) : 0;
            return (
              <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,.06)] hover:shadow-[0_2px_12px_rgba(0,0,0,.09)] hover:border-gray-200 transition-all duration-200 flex flex-col anim"
                style={{ animationDelay: `${i * 35}ms` }}>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      {req.category && <p className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wide inline-block mb-1.5">{req.category}</p>}
                      <h3 className="text-sm font-semibold text-gray-800 leading-snug">{req.title}</h3>
                    </div>
                    {req.status && <StatusBadge status={req.status} />}
                  </div>

                  {req.description && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{req.description}</p>
                  )}

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>₹{(req.amountRaised || 0).toLocaleString("en-IN")} raised</span>
                      <span className="font-semibold text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">of ₹{(req.amountNeeded || 0).toLocaleString("en-IN")} goal</p>
                  </div>

                  {req.location && (
                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
                      {req.location}
                    </p>
                  )}

                  <button onClick={() => setSelected(req)}
                    className="mt-auto w-full py-2 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                    Donate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && <DonateModal request={selected} onClose={() => setSelected(null)} onSuccess={fetchRequests} />}
    </div>
  );
}