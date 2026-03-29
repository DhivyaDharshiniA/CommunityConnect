import { useState, useEffect } from "react";
import { getMyVolunteers } from "../../api/volunteerService";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS (matching dashboard style)
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const cfg = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
    Upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg[status] || cfg.Pending}`}>
      {status}
    </span>
  );
};

const Av = ({ initials, idx = 0, size = "md" }) => {
  const sz = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm" };
  const colors = [
    "from-teal-400 to-cyan-500", "from-blue-400 to-blue-600",
    "from-violet-400 to-purple-500", "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-500", "from-emerald-400 to-green-500"
  ];
  return (
    <div className={`${sz[size]} rounded-full bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
};

const ProgressBar = ({ value, max }) => {
  const p = Math.min(100, Math.round((value / max) * 100));
  const c = p >= 80 ? "bg-emerald-500" : p >= 50 ? "bg-amber-400" : "bg-teal-400";
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-slate-400">{value}/{max}</span>
        <span className="text-[10px] font-semibold text-slate-600">{p}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${c} rounded-full transition-all duration-500`} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, icon, color }) => {
  const icBg = {
    teal: "bg-teal-100 text-teal-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    green: "bg-emerald-100 text-emerald-600",
    purple: "bg-violet-100 text-violet-600"
  };
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${icBg[color] || "bg-slate-100"} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKILL TAG COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const SkillTag = ({ skill, idx }) => {
  const colors = [
    "bg-teal-50 text-teal-700 border-teal-200",
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-violet-50 text-violet-700 border-violet-200",
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-rose-50 text-rose-700 border-rose-200",
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  ];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${colors[idx % colors.length]}`}>
      {skill}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VOLUNTEER ROW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function VolunteerRow({ v, index, onViewDetails }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Main row */}
      <tr
        className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        {/* # */}
        <td className="px-4 py-3.5 text-center w-12">
          <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
        </td>

        {/* Volunteer */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Av initials={v.volunteerName?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "??"} idx={index} size="sm" />
            <div>
              <p className="text-sm font-bold text-slate-800">{v.volunteerName}</p>
              <p className="text-[11px] text-slate-400">{v.email}</p>
            </div>
          </div>
        </td>

        {/* Skills */}
        <td className="px-4 py-3.5">
          <div className="flex flex-wrap gap-1.5">
            {(v.skills || []).slice(0, 2).map((s, i) => (
              <SkillTag key={i} skill={s} idx={i} />
            ))}
            {(v.skills || []).length > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                +{v.skills.length - 2}
              </span>
            )}
          </div>
        </td>

        {/* Events */}
        <td className="px-4 py-3.5 text-center">
          <div className="inline-flex items-center gap-2">
            <span className="text-lg font-bold text-teal-600">{v.totalEventsRegistered || 0}</span>
            <span className="text-[10px] text-slate-400">events</span>
          </div>
        </td>

        {/* Joined Date */}
        <td className="px-4 py-3.5 text-center">
          <span className="text-xs text-slate-500">{v.joinedDate || "Mar 2025"}</span>
        </td>

        {/* Expand toggle */}
        <td className="px-4 py-3.5 text-center w-10">
          <div className={`transform transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-slate-50/80">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Applied Events */}
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Applied Events</h4>
                </div>
                <div className="space-y-2">
                  {(v.appliedEvents || []).length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No events applied yet</p>
                  ) : (
                    (v.appliedEvents || []).map((ev, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        <span className="text-xs text-slate-600">{ev}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* All Skills */}
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">All Skills</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(v.skills || []).length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4 w-full">No skills listed</p>
                  ) : (
                    (v.skills || []).map((s, i) => <SkillTag key={i} skill={s} idx={i} />)
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function MyVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    try {
      const data = await getMyVolunteers();
      // Add some mock data for demonstration
      const enrichedData = data.map((v, i) => ({
        ...v,
        joinedDate: v.joinedDate || ["Jan 2025", "Feb 2025", "Mar 2025"][i % 3],
        status: v.status || "Active",
      }));
      setVolunteers(enrichedData);
    } catch (err) {
      console.error("Error loading volunteers", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = volunteers.filter(v => {
    const matchesSearch =
      v.volunteerName?.toLowerCase().includes(search.toLowerCase()) ||
      v.email?.toLowerCase().includes(search.toLowerCase()) ||
      (v.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalEvents = volunteers.reduce((s, v) => s + (v.totalEventsRegistered || 0), 0);
  const totalSkills = new Set(volunteers.flatMap(v => v.skills || [])).size;
  const activeCount = volunteers.filter(v => v.status === "Active").length;

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Volunteers"
          value={volunteers.length}
          sub="Active participants"
          color="teal"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          label="Active Volunteers"
          value={activeCount}
          sub="Currently engaged"
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Event Registrations"
          value={totalEvents}
          sub="Total signups"
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Unique Skills"
          value={totalSkills}
          sub="Across all volunteers"
          color="purple"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-3.5">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-wrap gap-1.5">
            {["All", "Active", "Pending", "Completed"].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === filter
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or skills..."
              className="bg-transparent text-xs outline-none w-48 sm:w-64 text-slate-600 placeholder-slate-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Volunteers Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-slate-200" />
              <div className="flex-1">
                <div className="h-3 bg-slate-200 rounded w-32 mb-2" />
                <div className="h-2 bg-slate-100 rounded w-48" />
              </div>
              <div className="w-20 h-6 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-600 mb-1">
            {search ? `No volunteers match "${search}"` : "No volunteers yet"}
          </p>
          <p className="text-xs text-slate-400">
            Volunteers who register for your events will appear here
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">#</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Volunteer</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Skills</th>
                  <th className="text-center px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Events</th>
                  <th className="text-center px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="text-center px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((v, i) => (
                  <VolunteerRow key={i} v={v} index={i} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing {filtered.length} of {volunteers.length} volunteers
            </span>
            <span className="text-[10px] text-slate-400">
              Click any row to expand details
            </span>
          </div>
        </div>
      )}
    </div>
  );
}