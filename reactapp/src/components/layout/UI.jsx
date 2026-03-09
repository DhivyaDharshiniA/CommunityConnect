// Stat Card
export function StatCard({ label, value, sub, icon, color, trend }) {
  const colors = {
    teal: "from-teal-50 to-teal-50/30 border-teal-100 text-teal-600 bg-teal-100",
    blue: "from-blue-50 to-blue-50/30 border-blue-100 text-blue-600 bg-blue-100",
    amber: "from-amber-50 to-amber-50/30 border-amber-100 text-amber-600 bg-amber-100",
    green: "from-emerald-50 to-emerald-50/30 border-emerald-100 text-emerald-600 bg-emerald-100",
    red: "from-red-50 to-red-50/30 border-red-100 text-red-600 bg-red-100",
  };
  const [gradBg, , borderC, textC, iconBg] = colors[color]?.split(" ") || colors.teal.split(" ");

  return (
    <div className={`bg-white rounded-2xl border ${borderC} p-5 hover:shadow-md transition-all duration-200 group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} ${textC} flex items-center justify-center flex-shrink-0`}>{icon}</div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

// Badge
export function Badge({ status }) {
  const cfg = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-50 text-red-600 border-red-200",
    Verified: "bg-teal-50 text-teal-700 border-teal-200",
    Inactive: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg[status] || cfg.Pending}`}>{status}</span>
  );
}

// Avatar
export function Avatar({ initials, size = "md", colorIndex = 0 }) {
  const colors = ["from-teal-400 to-cyan-500", "from-blue-400 to-blue-600", "from-violet-400 to-purple-600", "from-amber-400 to-orange-500", "from-rose-400 to-pink-600", "from-emerald-400 to-green-600"];
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-xs", lg: "w-11 h-11 text-sm" };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${colors[colorIndex % colors.length]} flex items-center justify-center text-white font-bold flex-shrink-0`}>{initials}</div>
  );
}

// Toast
export function Toast({ message, type = "success", onDismiss }) {
  const styles = { success: "bg-emerald-600", error: "bg-red-500", info: "bg-slate-700" };
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 ${styles[type]} text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-[fadeUp_0.3s_ease]`}>
      <span>{type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100 text-base leading-none">×</button>
    </div>
  );
}

// Section Header
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Empty State
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

// Progress Bar
export function ProgressBar({ value, max, color = "teal" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const trackColor = { teal: "bg-teal-500", blue: "bg-blue-500", amber: "bg-amber-500", red: "bg-red-500" };
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-slate-500">{value}/{max} volunteers</span>
        <span className="text-xs font-semibold text-slate-600">{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${trackColor[pct > 80 ? "red" : pct > 50 ? "amber" : "teal"]} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Avatar Component ──
export const Av = ({ initials, idx = 0, size = "md" }) => {
  const colors = ["bg-teal-200", "bg-blue-200", "bg-amber-200", "bg-green-200"];
  const color = colors[idx % colors.length];
  const sizes = { sm: "w-6 h-6 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-lg" };
  return (
    <div className={`${color} ${sizes[size]} rounded-full flex items-center justify-center font-bold text-slate-800`}>
      {initials}
    </div>
  );
};


// ── BarChart Component ──
export const BarChart = ({ data }) => {
  // simple placeholder bar chart
  return (
    <div className="w-full h-32 flex items-end gap-2">
      {data.map((d, i) => {
        const maxEvents = Math.max(...data.map(d => d.events), 1);
        const maxVols = Math.max(...data.map(d => d.volunteers), 1);
        const eventHeight = (d.events / maxEvents) * 100;
        const volHeight = (d.volunteers / maxVols) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1">
            <div className="flex flex-col gap-1 w-full items-center">
              <div className="w-3 bg-teal-500" style={{ height: `${volHeight}%` }} />
              <div className="w-3 bg-teal-200" style={{ height: `${eventHeight}%` }} />
            </div>
            <p className="text-[9px] text-slate-400">{d.month}</p>
          </div>
        );
      })}
    </div>
  );
};
