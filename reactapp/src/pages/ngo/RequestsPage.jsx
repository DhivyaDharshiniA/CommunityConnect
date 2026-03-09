import { useState } from "react";
import { mockRequests } from "../data/mockData";
import { Badge, Avatar, SectionHeader } from "../components/UI";

export default function RequestsPage({ onAction }) {
  const [requests, setRequests] = useState(mockRequests);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const handleApprove = (id) => {
    setRequests((r) => r.map((x) => x.id === id ? { ...x, status: "Approved" } : x));
    onAction?.("Volunteer approved!");
  };
  const handleReject = (id) => {
    setRequests((r) => r.map((x) => x.id === id ? { ...x, status: "Rejected" } : x));
    onAction?.("Request rejected.", "error");
  };

  const filters = ["All", "Pending", "Approved", "Rejected"];
  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  const filtered = requests.filter((r) => {
    const mf = filter === "All" || r.status === filter;
    const ms = r.name.toLowerCase().includes(search.toLowerCase()) || r.event.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { l: "Total Requests", v: requests.length, c: "slate" },
          { l: "Pending Review", v: pendingCount, c: "amber" },
          { l: "Approved", v: requests.filter((r) => r.status === "Approved").length, c: "teal" },
        ].map((s) => (
          <div key={s.l} className={`bg-white rounded-2xl border ${s.c === "amber" ? "border-amber-100" : s.c === "teal" ? "border-teal-100" : "border-slate-100"} p-4`}>
            <p className={`text-2xl font-bold ${s.c === "amber" ? "text-amber-600" : s.c === "teal" ? "text-teal-600" : "text-slate-800"}`}>{s.v}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {f}
                  {f === "Pending" && pendingCount > 0 && (
                    <span className="ml-1.5 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[9px] font-bold">{pendingCount}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or event…" className="bg-transparent text-xs text-slate-600 placeholder-slate-400 outline-none w-44" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Volunteer", "Applied For", "Skills", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={r.avatar} size="sm" colorIndex={i} />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{r.name}</p>
                        <p className="text-[10px] text-slate-400">{r.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-medium text-slate-700 max-w-[160px] truncate">{r.event}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {r.skills.map((s) => (
                        <span key={s} className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-3.5"><Badge status={r.status} /></td>
                  <td className="px-4 py-3.5">
                    {r.status === "Pending" ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleApprove(r.id)} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Approve
                        </button>
                        <button onClick={() => handleReject(r.id)} className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-red-100">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-sm text-slate-400">No requests found.</div>}
      </div>
    </div>
  );
}
