import { useState } from "react";
import { mockNotifications } from "../data/mockData";

export default function Header({ activePage, setActivePage }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  const pageLabels = {
    dashboard: "Dashboard",
    "create-event": "Create Event",
    "manage-events": "Manage Events",
    requests: "Volunteer Requests",
    members: "Members",
    reports: "Reports & Analytics",
    profile: "Profile",
  };

  const notifIcons = {
    request: "👥",
    event: "📅",
    verify: "✅",
    member: "⭐",
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0 z-40 relative">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">CommunityConnect</span>
        <span className="text-slate-200">/</span>
        <span className="text-sm font-semibold text-slate-700">{pageLabels[activePage] || "Dashboard"}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 w-52">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input placeholder="Search…" className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
            className="relative w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Notifications</span>
                <span className="text-xs text-teal-600 font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {mockNotifications.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${n.unread ? "bg-teal-50/30" : ""}`}>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base flex-shrink-0">{notifIcons[n.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-snug">{n.msg}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                    {n.unread && <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">GC</div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-700 leading-tight">GreenConnect</p>
              <p className="text-[10px] text-slate-400">Admin</p>
            </div>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-700">GreenConnect NGO</p>
                <p className="text-[10px] text-slate-400">admin@greenconnect.in</p>
              </div>
              {[{ l: "View Profile", p: "profile" }, { l: "Reports", p: "reports" }].map((x) => (
                <button key={x.p} onClick={() => { setActivePage(x.p); setProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors">{x.l}</button>
              ))}
              <div className="border-t border-slate-100">
                <button onClick={() => setActivePage("logout")} className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors">Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
