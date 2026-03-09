import { mockChartData, mockEvents, mockMembers, mockRequests } from "../data/mockData";

function DonutSegment({ value, max, color, label, sublabel }) {
  const pct = (value / max) * 100;
  const circumference = 2 * Math.PI * 30;
  const strokeDash = (pct / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r="30" fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle cx="35" cy="35" r="30" fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round" className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-slate-800">{Math.round(pct)}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-700 mt-2 text-center">{label}</p>
      <p className="text-[10px] text-slate-400 text-center">{sublabel}</p>
    </div>
  );
}

function HBarChart({ data, valueKey, max, color }) {
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-600">{d.month}</span>
            <span className="text-xs font-bold text-slate-700">{d[valueKey]}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(d[valueKey] / max) * 100}%`, backgroundColor: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage({ onAction }) {
  const catBreakdown = [
    { cat: "Environment", count: mockEvents.filter((e) => e.category === "Environment").length },
    { cat: "Health", count: mockEvents.filter((e) => e.category === "Health").length },
    { cat: "Education", count: mockEvents.filter((e) => e.category === "Education").length },
    { cat: "Welfare", count: mockEvents.filter((e) => e.category === "Welfare").length },
  ];
  const catColors = { Environment: "#14b8a6", Health: "#ef4444", Education: "#3b82f6", Welfare: "#f59e0b" };
  const catTotal = catBreakdown.reduce((a, c) => a + c.count, 0);
  const maxVols = Math.max(...mockChartData.map((d) => d.volunteers));

  const kpis = [
    { l: "Avg Volunteers/Event", v: (mockEvents.reduce((a, e) => a + e.volunteers, 0) / mockEvents.length).toFixed(1) },
    { l: "Approval Rate", v: `${Math.round((mockRequests.filter((r) => r.status === "Approved").length / mockRequests.length) * 100)}%` },
    { l: "Active Members", v: mockMembers.filter((m) => m.status === "Active").length },
    { l: "Events This Quarter", v: mockEvents.filter((e) => e.status !== "Completed").length },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.l} className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-2xl font-bold text-slate-800">{k.v}</p>
            <p className="text-xs text-slate-500 mt-0.5">{k.l}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Volunteer Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Volunteer Participation Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly volunteer count — last 6 months</p>
            </div>
            <button onClick={() => onAction?.("Report exported!")} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
          </div>
          <HBarChart data={mockChartData} valueKey="volunteers" max={maxVols} color="#14b8a6" />
        </div>

        {/* Category Donut */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Event Categories</h3>
          <p className="text-xs text-slate-400 mb-5">Distribution across {catTotal} events</p>
          <div className="grid grid-cols-2 gap-5">
            {catBreakdown.map((c) => (
              <DonutSegment key={c.cat} value={c.count} max={catTotal} color={catColors[c.cat]} label={c.cat} sublabel={`${c.count} events`} />
            ))}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Event Performance Summary</h3>
            <p className="text-xs text-slate-400 mt-0.5">Capacity utilization per event</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-sm bg-teal-500 inline-block" />&gt;80% full</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-sm bg-amber-400 inline-block" />50–80%</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded-sm bg-blue-400 inline-block" />&lt;50%</span>
          </div>
        </div>
        <div className="space-y-3">
          {mockEvents.map((e) => {
            const pct = Math.round((e.volunteers / e.capacity) * 100);
            const barColor = pct >= 80 ? "bg-teal-500" : pct >= 50 ? "bg-amber-400" : "bg-blue-400";
            return (
              <div key={e.id} className="flex items-center gap-4">
                <div className="w-40 flex-shrink-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{e.title}</p>
                  <p className="text-[10px] text-slate-400">{e.status}</p>
                </div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <div className="w-24 text-right flex-shrink-0">
                  <span className="text-xs font-semibold text-slate-700">{pct}%</span>
                  <span className="text-[10px] text-slate-400 ml-1">({e.volunteers}/{e.capacity})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Top Active Members</h3>
        <div className="space-y-3">
          {[...mockMembers].sort((a, b) => b.events - a.events).slice(0, 5).map((m, i) => (
            <div key={m.id} className="flex items-center gap-3">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 0 ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-500"}`}>{i + 1}</span>
              <div className="w-32 flex-shrink-0">
                <p className="text-xs font-semibold text-slate-700">{m.name}</p>
                <p className="text-[10px] text-slate-400">{m.role}</p>
              </div>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(m.events / 20) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-700 w-8 text-right">{m.events}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
