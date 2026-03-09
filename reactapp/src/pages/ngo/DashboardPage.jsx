import { mockStats, mockEvents, mockRequests, mockChartData } from "../data/mockData";
import { StatCard, Badge, Avatar, ProgressBar, SectionHeader } from "../components/UI";

const categoryEmoji = { Environment: "🌿", Health: "❤️", Education: "📚", Welfare: "🤝" };

// Mini bar chart component
function BarChart({ data }) {
  const maxV = Math.max(...data.map((d) => d.volunteers));
  return (
    <div className="flex items-end gap-2 h-28 pt-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col items-stretch gap-0.5" style={{ height: 88 }}>
            <div className="flex-1 flex items-end">
              <div
                className="w-full bg-teal-100 rounded-t-md relative overflow-hidden"
                style={{ height: `${(d.volunteers / maxV) * 100}%`, minHeight: 4 }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-teal-500 rounded-t-md"
                  style={{ height: `${(d.events / 7) * 100}%`, minHeight: 3 }}
                />
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage({ setActivePage, pendingCount }) {
  const recentEvents = mockEvents.slice(0, 3);
  const recentRequests = mockRequests.filter((r) => r.status === "Pending").slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -right-2 bottom-0 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-teal-100 text-sm font-medium mb-1">Welcome back 👋</p>
          <h1 className="text-2xl font-bold mb-1">GreenConnect NGO</h1>
          <p className="text-teal-100/80 text-sm">Here's what's happening with your organization today.</p>
        </div>
        <div className="absolute top-4 right-5 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm border border-white/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white/90">Verified NGO</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Events" value={mockStats.totalEvents} sub="Across all categories" trend={12}
          color="teal"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Volunteers Joined" value={mockStats.totalVolunteers} sub="Active participants" trend={8}
          color="blue"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Pending Requests" value={mockStats.pendingRequests} sub="Awaiting approval"
          color="amber"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Verification Status" value={mockStats.verificationStatus} sub="NGO certification"
          color="green"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
        />
      </div>

      {/* Charts + Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Activity Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5">
          <SectionHeader
            title="Activity Overview"
            subtitle="Events & volunteer trends — last 6 months"
            action={
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-teal-100 inline-block" />Volunteers</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-teal-500 inline-block" />Events</span>
              </div>
            }
          />
          <BarChart data={mockChartData} />
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-50">
            {[{ l: "Avg. Volunteers/Event", v: "7.8" }, { l: "Total Events (6mo)", v: "27" }, { l: "Completion Rate", v: "94%" }].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-lg font-bold text-slate-800">{s.v}</p>
                <p className="text-[10px] text-slate-400">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <SectionHeader
            title="Pending Requests"
            subtitle={`${recentRequests.length} awaiting review`}
            action={
              <button onClick={() => setActivePage("requests")} className="text-xs text-teal-600 font-semibold hover:underline">View all</button>
            }
          />
          {recentRequests.length === 0
            ? <div className="text-center py-8 text-slate-400 text-sm">No pending requests</div>
            : <div className="space-y-3">
              {recentRequests.map((r, i) => (
                <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <Avatar initials={r.avatar} size="sm" colorIndex={i} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{r.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{r.event}</p>
                  </div>
                  <Badge status="Pending" />
                </div>
              ))}
              <button onClick={() => setActivePage("requests")} className="w-full text-center text-xs text-teal-600 font-semibold py-2 rounded-lg hover:bg-teal-50 transition-colors mt-1">
                Review all requests →
              </button>
            </div>
          }
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <SectionHeader
          title="Recent Events"
          subtitle="Latest events across all categories"
          action={
            <button onClick={() => setActivePage("manage-events")} className="text-xs text-teal-600 font-semibold hover:underline">View all</button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recentEvents.map((e, i) => (
            <div key={e.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-sm hover:border-teal-100 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{categoryEmoji[e.category] || "📌"}</span>
                <Badge status={e.status} />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-1">{e.title}</h4>
              <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {e.date}
              </p>
              <ProgressBar value={e.volunteers} max={e.capacity} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
