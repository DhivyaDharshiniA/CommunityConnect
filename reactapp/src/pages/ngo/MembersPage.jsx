import { useState } from "react";
import { mockMembers } from "../data/mockData";
import { Badge, Avatar, SectionHeader } from "../components/UI";

const roleColors = { Coordinator: "bg-violet-50 text-violet-700 border-violet-200", "Team Lead": "bg-blue-50 text-blue-700 border-blue-200", Volunteer: "bg-teal-50 text-teal-700 border-teal-200" };

export default function MembersPage() {
  const [members] = useState(mockMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const roles = ["All", "Team Lead", "Coordinator", "Volunteer"];
  const filtered = members.filter((m) => {
    const ms = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const mr = roleFilter === "All" || m.role === roleFilter;
    return ms && mr;
  });

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Total Members", v: members.length },
          { l: "Active", v: members.filter((m) => m.status === "Active").length },
          { l: "Team Leads", v: members.filter((m) => m.role === "Team Lead").length },
          { l: "Avg. Events/Member", v: (members.reduce((a, m) => a + m.events, 0) / members.length).toFixed(1) },
        ].map((s) => (
          <div key={s.l} className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-2xl font-bold text-slate-800">{s.v}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${roleFilter === r ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{r}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members…" className="bg-transparent text-xs text-slate-600 placeholder-slate-400 outline-none w-40" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Member", "Role", "Events Completed", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((m, i) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={m.avatar} size="md" colorIndex={i} />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{m.name}</p>
                        <p className="text-[10px] text-slate-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleColors[m.role] || "bg-slate-100 text-slate-600 border-slate-200"}`}>{m.role}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(m.events / 20) * 100}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{m.events}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{m.joined}</td>
                  <td className="px-4 py-3.5"><Badge status={m.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="text-xs text-teal-600 font-semibold hover:underline">View</button>
                      <button className="text-xs text-slate-500 font-semibold hover:underline">Message</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-sm text-slate-400">No members found.</div>}
      </div>
    </div>
  );
}
