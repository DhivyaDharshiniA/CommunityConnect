import { useState, useEffect } from "react";
import ProfilePage from "./ProfilePage";
import ManageEventsPage from "./ManageEventsPage";

// ─────────────────────────────────────────────────────────────────────────────
// FONTS
// ─────────────────────────────────────────────────────────────────────────────
const loadFonts = () => {
  if (document.getElementById("cc-fonts")) return;
  const l = document.createElement("link");
  l.id = "cc-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&display=swap";
  document.head.appendChild(l);
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const mockStats = { totalEvents: 24, totalVolunteers: 187, pendingRequests: 5, verificationStatus: "Verified" };

const mockEvents = [
  { id: 1, title: "Coastal Cleanup Drive", date: "2026-03-20", location: "Marina Beach, Chennai", volunteers: 34, capacity: 50, status: "Active", category: "Environment" },
  { id: 2, title: "Free Health Camp", date: "2026-03-25", location: "Tambaram Community Hall", volunteers: 22, capacity: 30, status: "Active", category: "Health" },
  { id: 3, title: "Digital Literacy Workshop", date: "2026-04-02", location: "Sholinganallur Tech Park", volunteers: 18, capacity: 25, status: "Upcoming", category: "Education" },
  { id: 4, title: "Tree Plantation Drive", date: "2026-04-10", location: "Adyar Eco Park", volunteers: 41, capacity: 60, status: "Upcoming", category: "Environment" },
  { id: 5, title: "Blood Donation Camp", date: "2026-02-14", location: "Anna Nagar, Chennai", volunteers: 55, capacity: 50, status: "Completed", category: "Health" },
  { id: 6, title: "Youth Leadership Summit", date: "2026-02-28", location: "IIT Madras", volunteers: 80, capacity: 100, status: "Completed", category: "Education" },
];

const initRequests = [
  { id: 1, name: "Deepa Raghavan", email: "deepa.r@email.com", event: "Coastal Cleanup Drive", date: "Mar 12", skills: ["Logistics", "Swimming"], status: "Pending", av: "DR" },
  { id: 2, name: "Karthik Subramanian", email: "karthik.s@email.com", event: "Free Health Camp", date: "Mar 11", skills: ["First Aid", "Nursing"], status: "Pending", av: "KS" },
  { id: 3, name: "Nithya Balaji", email: "nithya.b@email.com", event: "Digital Literacy Workshop", date: "Mar 10", skills: ["Teaching", "Computers"], status: "Pending", av: "NB" },
  { id: 4, name: "Surya Prakash", email: "surya.p@email.com", event: "Tree Plantation Drive", date: "Mar 9", skills: ["Gardening", "Driving"], status: "Pending", av: "SP" },
  { id: 5, name: "Aishwarya Murugan", email: "aish.m@email.com", event: "Coastal Cleanup Drive", date: "Mar 8", skills: ["Outreach", "Social Media"], status: "Pending", av: "AM" },
  { id: 6, name: "Rahul Venkatesh", email: "rahul.v@email.com", event: "Blood Donation Camp", date: "Mar 7", skills: ["Medical", "Counseling"], status: "Approved", av: "RV" },
  { id: 7, name: "Preethi Srinivasan", email: "preethi.s@email.com", event: "Youth Leadership Summit", date: "Mar 6", skills: ["Public Speaking", "Events"], status: "Rejected", av: "PS" },
];

const mockMembers = [
  { id: 1, name: "Arjun Krishnamurthy", email: "arjun.k@email.com", role: "Team Lead", events: 14, joined: "Jan 2024", status: "Active", av: "AK" },
  { id: 2, name: "Meenakshi Iyer", email: "meenakshi.i@email.com", role: "Coordinator", events: 9, joined: "Mar 2024", status: "Active", av: "MI" },
  { id: 3, name: "Vijay Anand", email: "vijay.a@email.com", role: "Volunteer", events: 7, joined: "Jun 2024", status: "Active", av: "VA" },
  { id: 4, name: "Divya Chandrasekaran", email: "divya.c@email.com", role: "Team Lead", events: 19, joined: "Nov 2023", status: "Active", av: "DC" },
  { id: 5, name: "Balaji Natarajan", email: "balaji.n@email.com", role: "Volunteer", events: 5, joined: "Aug 2024", status: "Inactive", av: "BN" },
  { id: 6, name: "Kavitha Rajan", email: "kavitha.r@email.com", role: "Coordinator", events: 11, joined: "Feb 2024", status: "Active", av: "KR" },
  { id: 7, name: "Senthil Kumar", email: "senthil.k@email.com", role: "Volunteer", events: 3, joined: "Oct 2024", status: "Active", av: "SK" },
  { id: 8, name: "Lakshmi Narayanan", email: "lakshmi.n@email.com", role: "Team Lead", events: 16, joined: "Dec 2023", status: "Active", av: "LN" },
];

const chartData = [
  { month: "Oct", events: 3, volunteers: 42 }, { month: "Nov", events: 5, volunteers: 68 },
  { month: "Dec", events: 2, volunteers: 31 }, { month: "Jan", events: 7, volunteers: 94 },
  { month: "Feb", events: 6, volunteers: 87 }, { month: "Mar", events: 4, volunteers: 55 },
];

const notifications = [
  { id: 1, msg: "5 new volunteer requests need review", time: "2 min ago", icon: "👥", unread: true },
  { id: 2, msg: "Coastal Cleanup Drive starts in 3 days", time: "1 hr ago", icon: "📅", unread: true },
  { id: 3, msg: "Your NGO verification was approved", time: "2 hr ago", icon: "✅", unread: true },
  { id: 4, msg: "Arjun completed 14 events milestone", time: "1 day ago", icon: "⭐", unread: false },
];

const catEmoji = { Environment: "🌿", Health: "❤️", Education: "📚", Welfare: "🤝" };
const avColors = ["from-teal-400 to-cyan-500", "from-blue-400 to-blue-600", "from-violet-400 to-purple-500", "from-amber-400 to-orange-500", "from-rose-400 to-pink-500", "from-emerald-400 to-green-500"];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const cfg = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200", Upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    Completed: "bg-slate-100 text-slate-600 border-slate-200", Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200", Rejected: "bg-red-50 text-red-600 border-red-200",
    Verified: "bg-teal-50 text-teal-700 border-teal-200", Inactive: "bg-slate-100 text-slate-500 border-slate-200",
    "Team Lead": "bg-blue-50 text-blue-700 border-blue-200", Coordinator: "bg-violet-50 text-violet-700 border-violet-200",
    Volunteer: "bg-teal-50 text-teal-700 border-teal-100",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg[status] || cfg.Pending}`}>{status}</span>;
};

const Av = ({ initials, idx = 0, size = "md" }) => {
  const sz = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm" };
  return <div className={`${sz[size]} rounded-full bg-gradient-to-br ${avColors[idx % avColors.length]} flex items-center justify-center text-white font-bold flex-shrink-0`}>{initials}</div>;
};

const ProgressBar = ({ value, max }) => {
  const p = Math.min(100, Math.round((value / max) * 100));
  const c = p >= 80 ? "bg-emerald-500" : p >= 50 ? "bg-amber-400" : "bg-blue-400";
  return (
    <div>
      <div className="flex justify-between mb-1"><span className="text-[10px] text-slate-400">{value}/{max} volunteers</span><span className="text-[10px] font-semibold text-slate-600">{p}%</span></div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${c} rounded-full`} style={{ width: `${p}%` }} /></div>
    </div>
  );
};

const Toast = ({ msg, type, onClose }) => (
  <div className={`fixed bottom-5 right-5 z-[999] flex items-center gap-3 ${type === "error" ? "bg-red-600" : "bg-slate-800"} text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium`} style={{ animation: "fadeUp .3s ease" }}>
    <span>{type === "error" ? "✕" : "✓"}</span><span>{msg}</span>
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 text-lg leading-none">×</button>
  </div>
);

const StatCard = ({ label, value, sub, trend, icon, color }) => {
  const icBg = { teal: "bg-teal-100 text-teal-600", blue: "bg-blue-100 text-blue-600", amber: "bg-amber-100 text-amber-600", green: "bg-emerald-100 text-emerald-600" };
  const bd = { teal: "border-teal-100", blue: "border-blue-100", amber: "border-amber-100", green: "border-emerald-100" };
  return (
    <div className={`bg-white rounded-2xl border ${bd[color] || "border-slate-100"} p-5 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${icBg[color] || "bg-slate-100"} flex items-center justify-center`}>{icon}</div>
        {trend !== undefined && <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>{trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>}
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { id: "create-event", label: "Create Event", icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> },
  { id: "manage-events", label: "Manage Events", icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { id: "requests", label: "Volunteer Requests", badge: true, icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { id: "members", label: "Members", icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  { id: "reports", label: "Reports", icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { id: "profile", label: "Profile", icon: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
];

function Sidebar({ activePage, setActivePage, pendingCount, collapsed, setCollapsed }) {
  return (
    <aside className={`flex flex-col h-screen bg-slate-900 text-white transition-all duration-300 flex-shrink-0 ${collapsed ? "w-[60px]" : "w-[230px]"}`}>
      <div className={`flex items-center gap-3 p-4 border-b border-slate-700/50 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
        </div>
        {!collapsed && <div><p className="text-sm font-bold leading-tight">CommunityConnect</p><p className="text-[10px] text-teal-400 tracking-widest uppercase font-semibold">NGO Platform</p></div>}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = activePage === item.id;
          return (
            <button key={item.id} onClick={() => setActivePage(item.id)} title={collapsed ? item.label : ""} className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${collapsed ? "justify-center" : ""} ${active ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"}`}>
              <span className={`flex-shrink-0 ${active ? "text-teal-400" : ""}`}>{item.icon}</span>
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && item.badge && pendingCount > 0 && <span className="bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{pendingCount}</span>}
              {collapsed && item.badge && pendingCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-slate-700/50 space-y-0.5">
        <button onClick={() => setActivePage("logout")} className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${collapsed ? "justify-center" : ""}`}>
          <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          {!collapsed && "Logout"}
        </button>
        <button onClick={() => setCollapsed((c) => !c)} className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all ${collapsed ? "justify-center" : ""}`}>
          <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────────────────────
function Header({ activePage, setActivePage }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profOpen, setProfOpen] = useState(false);
  const labels = { dashboard: "Dashboard", "create-event": "Create Event", "manage-events": "Manage Events", requests: "Volunteer Requests", members: "Members", reports: "Reports & Analytics", profile: "Profile", logout: "Sign Out" };
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-5 flex-shrink-0 z-30 relative">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium hidden sm:block">CommunityConnect</span>
        <span className="text-slate-200 hidden sm:block">/</span>
        <span className="text-sm font-bold text-slate-700">{labels[activePage] || "Dashboard"}</span>
      </div>
      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-200 w-44">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input placeholder="Search…" className="bg-transparent text-xs text-slate-600 placeholder-slate-400 outline-none w-full" />
        </div>
        {/* Notif */}
        <div className="relative">
          <button onClick={() => { setNotifOpen((o) => !o); setProfOpen(false); }} className="relative w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {unread > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-76 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Notifications</span>
                <span className="text-[10px] text-teal-600 font-semibold cursor-pointer">Mark all read</span>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer ${n.unread ? "bg-teal-50/20" : ""}`}>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">{n.icon}</div>
                  <div className="flex-1"><p className="text-xs text-slate-700 leading-snug">{n.msg}</p><p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p></div>
                  {n.unread && <div className="w-2 h-2 rounded-full bg-teal-500 mt-1 flex-shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Profile */}
{/*         <div className="relative"> */}
{/*           <button onClick={() => { setProfOpen((o) => !o); setNotifOpen(false); }} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"> */}
{/*             <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-[9px] font-bold">GC</div> */}
{/*             <div className="hidden sm:block text-left"><p className="text-xs font-semibold text-slate-700 leading-tight">GreenConnect</p></div> */}
{/*             <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg> */}
{/*           </button> */}
{/*           {profOpen && ( */}
{/*             <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"> */}
{/*               <div className="px-3 py-2.5 border-b border-slate-100"><p className="text-xs font-bold text-slate-700">GreenConnect NGO</p><p className="text-[10px] text-slate-400">admin@greenconnect.in</p></div> */}
{/*               {[["View Profile", "profile"], ["Reports", "reports"]].map(([l, p]) => ( */}
{/*                 <button key={p} onClick={() => { setActivePage(p); setProfOpen(false); }} className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">{l}</button> */}
{/*               ))} */}
{/*               <div className="border-t border-slate-100"><button onClick={() => setActivePage("logout")} className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50">Sign Out</button></div> */}
{/*             </div> */}
{/*           )} */}
{/*         </div> */}
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI BAR CHART
// ─────────────────────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const maxV = Math.max(...data.map((d) => d.volunteers));
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex items-end" style={{ height: 88 }}>
            <div className="w-full bg-teal-100 rounded-t-lg relative overflow-hidden" style={{ height: `${(d.volunteers / maxV) * 100}%`, minHeight: 5 }}>
              <div className="absolute bottom-0 left-0 right-0 bg-teal-500 rounded-t-lg" style={{ height: `${(d.events / 7) * 100}%`, minHeight: 3 }} />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGES
// ─────────────────────────────────────────────────────────────────────────────

// Dashboard
function DashboardPage({ setActivePage, requests }) {
  const pending = requests.filter((r) => r.status === "Pending");
  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute right-4 bottom-0 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-teal-100 text-xs font-semibold mb-1">Welcome back 👋</p>
          <h1 className="text-xl font-extrabold mb-0.5">GreenConnect NGO</h1>
          <p className="text-teal-100/70 text-xs">Here's what's happening with your organization today.</p>
        </div>
        <div className="absolute top-4 right-16 flex items-center gap-1.5 bg-white/10 rounded-xl px-2.5 py-1.5 backdrop-blur-sm border border-white/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[10px] font-bold text-white/90">Verified NGO</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Events" value={mockStats.totalEvents} sub="All categories" trend={12} color="teal" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        <StatCard label="Volunteers Joined" value={mockStats.totalVolunteers} sub="Active participants" trend={8} color="blue" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatCard label="Pending Requests" value={pending.length} sub="Awaiting review" color="amber" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard label="Verification" value="Verified" sub="NGO certification" color="green" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>} />
      </div>

      {/* Chart + Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-start justify-between mb-3">
            <div><h3 className="text-sm font-bold text-slate-800">Activity Overview</h3><p className="text-xs text-slate-400">Events & volunteer trends</p></div>
            <div className="flex gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-teal-100 inline-block" />Volunteers</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-teal-500 inline-block" />Events</span>
            </div>
          </div>
          <BarChart data={chartData} />
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-50">
            {[{ l: "Avg Vols/Event", v: "7.8" }, { l: "6-Month Events", v: "27" }, { l: "Completion", v: "94%" }].map((s) => (
              <div key={s.l} className="text-center"><p className="text-base font-bold text-slate-800">{s.v}</p><p className="text-[9px] text-slate-400">{s.l}</p></div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div><h3 className="text-sm font-bold text-slate-800">Pending Requests</h3><p className="text-xs text-slate-400">{pending.length} awaiting</p></div>
            <button onClick={() => setActivePage("requests")} className="text-xs text-teal-600 font-semibold hover:underline">View all</button>
          </div>
          {pending.length === 0
            ? <p className="text-center text-sm text-slate-400 py-8">All caught up! 🎉</p>
            : <div className="space-y-2">
              {pending.slice(0, 4).map((r, i) => (
                <div key={r.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50">
                  <Av initials={r.av} idx={i} size="sm" />
                  <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-slate-700 truncate">{r.name}</p><p className="text-[10px] text-slate-400 truncate">{r.event}</p></div>
                  <Badge status="Pending" />
                </div>
              ))}
              <button onClick={() => setActivePage("requests")} className="w-full text-center text-xs text-teal-600 font-semibold py-1.5 rounded-lg hover:bg-teal-50 transition-colors">Review all →</button>
            </div>
          }
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-sm font-bold text-slate-800">Recent Events</h3><p className="text-xs text-slate-400">Latest across all categories</p></div>
          <button onClick={() => setActivePage("manage-events")} className="text-xs text-teal-600 font-semibold hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockEvents.slice(0, 3).map((e) => (
            <div key={e.id} className="border border-slate-100 rounded-xl p-3.5 hover:shadow-sm hover:border-teal-100 transition-all">
              <div className="flex justify-between items-start mb-2"><span className="text-xl">{catEmoji[e.category] || "📌"}</span><Badge status={e.status} /></div>
              <h4 className="text-xs font-bold text-slate-800 mb-1 line-clamp-1">{e.title}</h4>
              <p className="text-[10px] text-slate-400 mb-3">📅 {e.date}</p>
              <ProgressBar value={e.volunteers} max={e.capacity} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Create Event
function CreateEventPage({ onSuccess }) {
  const [form, setForm] = useState({ title: "", category: "", date: "", location: "", capacity: "", description: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.category) e.category = "Required";
    if (!form.date) e.date = "Required";
    if (!form.location.trim()) e.location = "Required";
    if (!form.capacity || isNaN(form.capacity)) e.capacity = "Enter a number";
    if (!form.description.trim()) e.description = "Required";
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setTimeout(() => { setSaving(false); onSuccess(); }, 1000);
  };

  const ic = (k) => `w-full px-3.5 py-2.5 rounded-xl border ${errors[k] ? "border-red-300 bg-red-50 focus:ring-red-200" : "border-slate-200 bg-white focus:ring-teal-200"} text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:border-teal-400 transition-all`;

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4">
          <h2 className="text-base font-bold text-white">Create New Event</h2>
          <p className="text-teal-100/70 text-xs mt-0.5">Fill in the details to publish your community event</p>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Event Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Coastal Cleanup Drive 2026" className={ic("title")} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={ic("category")}>
                <option value="">Select…</option>
                {["Environment", "Health", "Education", "Welfare", "Community", "Sports"].map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={ic("date")} />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location *</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Marina Beach, Chennai" className={ic("location")} />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Capacity *</label>
              <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="50" className={ic("capacity")} />
              {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description *</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the event, purpose and what volunteers will do…" className={ic("description") + " resize-none"} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
          {form.title && (
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-3.5">
              <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-1.5">📋 Preview</p>
              <p className="text-sm font-bold text-slate-800">{form.title}</p>
              <div className="flex flex-wrap gap-3 mt-1">
                {form.category && <span className="text-xs text-slate-500">🏷 {form.category}</span>}
                {form.date && <span className="text-xs text-slate-500">📅 {form.date}</span>}
                {form.location && <span className="text-xs text-slate-500">📍 {form.location}</span>}
                {form.capacity && <span className="text-xs text-slate-500">👥 {form.capacity} volunteers</span>}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              {saving ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating…</> : "Publish Event"}
            </button>
            <button type="button" onClick={() => setForm({ title: "", category: "", date: "", location: "", capacity: "", description: "" })} className="text-sm text-slate-500 hover:text-slate-700 font-medium px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Manage Events

// Requests
function RequestsPage({ requests, setRequests, onAction }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const handleApprove = (id) => { setRequests((r) => r.map((x) => x.id === id ? { ...x, status: "Approved" } : x)); onAction("Volunteer approved!"); };
  const handleReject = (id) => { setRequests((r) => r.map((x) => x.id === id ? { ...x, status: "Rejected" } : x)); onAction("Request rejected.", "error"); };

  const pending = requests.filter((r) => r.status === "Pending").length;
  const filtered = requests.filter((r) => {
    const mf = filter === "All" || r.status === filter;
    const ms = r.name.toLowerCase().includes(search.toLowerCase()) || r.event.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[{ l: "Total Requests", v: requests.length, c: "slate" }, { l: "Pending", v: pending, c: "amber" }, { l: "Approved", v: requests.filter((r) => r.status === "Approved").length, c: "teal" }].map((s) => (
          <div key={s.l} className={`bg-white rounded-2xl border ${s.c === "amber" ? "border-amber-100" : s.c === "teal" ? "border-teal-100" : "border-slate-100"} p-4`}>
            <p className={`text-2xl font-bold ${s.c === "amber" ? "text-amber-600" : s.c === "teal" ? "text-teal-600" : "text-slate-800"}`}>{s.v}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-3.5 border-b border-slate-50 flex flex-col sm:flex-row gap-2.5 justify-between">
          <div className="flex flex-wrap gap-1.5">
            {["All", "Pending", "Approved", "Rejected"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {f}{f === "Pending" && pending > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 text-[8px] font-bold">{pending}</span>}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="bg-transparent text-xs outline-none w-36 text-slate-600 placeholder-slate-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50 border-b border-slate-100">{["Volunteer", "Applied For", "Skills", "Date", "Status", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r, i) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2"><Av initials={r.av} idx={i} size="sm" /><div><p className="font-bold text-slate-800">{r.name}</p><p className="text-[10px] text-slate-400">{r.email}</p></div></div>
                  </td>
                  <td className="px-4 py-3.5"><p className="font-medium text-slate-700 max-w-[140px] truncate">{r.event}</p></td>
                  <td className="px-4 py-3.5"><div className="flex flex-wrap gap-1">{r.skills.map((s) => <span key={s} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">{s}</span>)}</div></td>
                  <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-3.5"><Badge status={r.status} /></td>
                  <td className="px-4 py-3.5">
                    {r.status === "Pending"
                      ? <div className="flex gap-1.5">
                        <button onClick={() => handleApprove(r.id)} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Approve</button>
                        <button onClick={() => handleReject(r.id)} className="flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 font-bold px-2.5 py-1.5 rounded-lg border border-red-100 transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>Reject</button>
                      </div>
                      : <span className="text-slate-400 italic">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center py-10 text-sm text-slate-400">No requests found.</p>}
      </div>
    </div>
  );
}

// Members
function MembersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const filtered = mockMembers.filter((m) => {
    const ms = m.name.toLowerCase().includes(search.toLowerCase());
    const mr = roleFilter === "All" || m.role === roleFilter;
    return ms && mr;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ l: "Total Members", v: mockMembers.length }, { l: "Active", v: mockMembers.filter((m) => m.status === "Active").length }, { l: "Team Leads", v: mockMembers.filter((m) => m.role === "Team Lead").length }, { l: "Avg Events", v: (mockMembers.reduce((a, m) => a + m.events, 0) / mockMembers.length).toFixed(1) }].map((s) => (
          <div key={s.l} className="bg-white rounded-2xl border border-slate-100 p-4"><p className="text-2xl font-bold text-slate-800">{s.v}</p><p className="text-xs text-slate-500 mt-0.5">{s.l}</p></div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-3.5 border-b border-slate-50 flex flex-col sm:flex-row gap-2.5 justify-between">
          <div className="flex flex-wrap gap-1.5">
            {["All", "Team Lead", "Coordinator", "Volunteer"].map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${roleFilter === r ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{r}</button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="bg-transparent text-xs outline-none w-32 text-slate-600 placeholder-slate-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50 border-b border-slate-100">{["Member", "Role", "Events", "Joined", "Status", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((m, i) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><Av initials={m.av} idx={i} /><div><p className="font-bold text-slate-800">{m.name}</p><p className="text-[10px] text-slate-400">{m.email}</p></div></div></td>
                  <td className="px-4 py-3.5"><Badge status={m.role} /></td>
                  <td className="px-4 py-3.5"><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full" style={{ width: `${(m.events / 20) * 100}%` }} /></div><span className="font-bold text-slate-700">{m.events}</span></div></td>
                  <td className="px-4 py-3.5 text-slate-500">{m.joined}</td>
                  <td className="px-4 py-3.5"><Badge status={m.status} /></td>
                  <td className="px-4 py-3.5"><div className="flex gap-2"><button className="text-teal-600 font-bold hover:underline">View</button><button className="text-slate-500 font-bold hover:underline">Message</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center py-10 text-sm text-slate-400">No members found.</p>}
      </div>
    </div>
  );
}

// Reports
function ReportsPage({ onAction }) {
  const maxV = Math.max(...chartData.map((d) => d.volunteers));
  const cats = [{ c: "Environment", n: 2, col: "#14b8a6" }, { c: "Health", n: 2, col: "#ef4444" }, { c: "Education", n: 2, col: "#3b82f6" }];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ l: "Avg Volunteers/Event", v: "7.8" }, { l: "Approval Rate", v: "71%" }, { l: "Active Members", v: "7" }, { l: "Trust Score", v: "94/100" }].map((k) => (
          <div key={k.l} className="bg-white rounded-2xl border border-slate-100 p-4"><p className="text-2xl font-bold text-slate-800">{k.v}</p><p className="text-xs text-slate-500 mt-0.5">{k.l}</p></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div><h3 className="text-sm font-bold text-slate-800">Volunteer Participation Trend</h3><p className="text-xs text-slate-400">Monthly — last 6 months</p></div>
            <button onClick={() => onAction("Report exported!")} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Export
            </button>
          </div>
          <div className="space-y-2.5">
            {chartData.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 w-6 flex-shrink-0">{d.month}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${(d.volunteers / maxV) * 100}%` }} /></div>
                <span className="text-xs font-bold text-slate-700 w-6 text-right">{d.volunteers}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Event Categories</h3>
          <div className="space-y-3">
            {cats.map((c) => (
              <div key={c.c}>
                <div className="flex justify-between mb-1"><span className="text-xs font-medium text-slate-600">{c.c}</span><span className="text-xs font-bold text-slate-700">{c.n} events</span></div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(c.n / 6) * 100}%`, backgroundColor: c.col }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 mb-3">Event Performance</h4>
            <div className="space-y-2.5">
              {mockEvents.slice(0, 4).map((e) => {
                const p = Math.round((e.volunteers / e.capacity) * 100);
                return (
                  <div key={e.id} className="flex items-center gap-2">
                    <p className="text-[10px] text-slate-600 font-medium w-24 truncate flex-shrink-0">{e.title}</p>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${p >= 80 ? "bg-emerald-500" : p >= 50 ? "bg-amber-400" : "bg-blue-400"}`} style={{ width: `${p}%` }} /></div>
                    <span className="text-[10px] font-bold text-slate-600 w-8 text-right">{p}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Top Active Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...mockMembers].sort((a, b) => b.events - a.events).slice(0, 6).map((m, i) => (
            <div key={m.id} className="flex items-center gap-3">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${i === 0 ? "bg-amber-400 text-white" : "bg-slate-100 text-slate-500"}`}>{i + 1}</span>
              <Av initials={m.av} idx={i} size="sm" />
              <div className="flex-1 min-w-0"><p className="text-xs font-bold text-slate-700 truncate">{m.name}</p><p className="text-[10px] text-slate-400">{m.role}</p></div>
              <div className="w-20 flex items-center gap-1.5"><div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full" style={{ width: `${(m.events / 20) * 100}%` }} /></div><span className="text-[10px] font-bold text-slate-700 w-4">{m.events}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Logout
function LogoutPage({ setActivePage }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4">👋</div>
      <h2 className="text-lg font-black text-slate-800 mb-2">See you soon!</h2>
      <p className="text-sm text-slate-500 mb-6">You've been signed out of CommunityConnect.</p>
      <button onClick={() => setActivePage("dashboard")} className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">Back to Dashboard</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(loadFonts, []);
  const [activePage, setActivePage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  const [requests, setRequests] = useState(initRequests);

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); };

  const handleNavToCreateEvent = () => { setActivePage("create-event"); };

  const pageMap = {
    dashboard: <DashboardPage setActivePage={setActivePage} requests={requests} />,
    "create-event": <CreateEventPage onSuccess={() => { showToast("Event created successfully!"); setActivePage("manage-events"); }} />,
    "manage-events": <ManageEventsPage setActivePage={setActivePage} />,
    requests: <RequestsPage requests={requests} setRequests={setRequests} onAction={showToast} />,
    members: <MembersPage />,
    reports: <ReportsPage onAction={showToast} />,
    profile: <ProfilePage onAction={showToast} />,
    logout: <LogoutPage setActivePage={setActivePage} />,
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }} className="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
      <Sidebar activePage={activePage} setActivePage={setActivePage} pendingCount={pendingCount} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header activePage={activePage} setActivePage={setActivePage} />
        <main className="flex-1 overflow-y-auto p-5">{pageMap[activePage] || pageMap.dashboard}</main>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:4px; }
        ::-webkit-scrollbar-thumb:hover { background:#94a3b8; }
      `}</style>
    </div>
  );
}
