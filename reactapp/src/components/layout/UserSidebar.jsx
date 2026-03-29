import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      {
        id: "dashboard", label: "Overview",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
      },
      {
        id: "events", label: "Browse Events",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2.5"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="12" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/></svg>
      },
      {
        id: "myevents", label: "My Events", hasBadge: true,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
      },
      {
        id: "createEvent", label: "Create Event",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2.5"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>
      },
    ]
  },
  {
    label: "Community",
    items: [
      {
        id: "helpRequest", label: "Request Help",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H6a2 2 0 00-2 2v16l4-4h10a2 2 0 002-2V4a2 2 0 00-2-2z"/><path d="M12 8v4M12 14h.01"/></svg>
      },
      {
        id: "helpFeed", label: "Donate",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      },
      {
        id: "profile", label: "My Profile",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
      },
      {
        id: "joinMember", label: "Become Member",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
      },
    ]
  }
];

const SOS_ITEM = {
  id: "sos", label: "SOS Alert",
  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
};

export default function UserSidebar({ activeTab, setActiveTab, myEventsCount }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "User";
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const W = collapsed ? "72px" : "248px";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@1&display=swap');

        .cc-sidebar {
          font-family: 'DM Sans', sans-serif;
          position: fixed; left: 0; top: 0; bottom: 0;
          width: ${W};
          background: #111110;
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column;
          transition: width 0.32s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
          z-index: 100;
          box-shadow: 4px 0 32px rgba(0,0,0,0.4);
        }

        /* warm glow blob */
        .cc-sidebar::before {
          content: '';
          position: absolute;
          top: -80px; left: -50px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        .cc-sidebar > * { position: relative; z-index: 1; }

        /* ── Header ── */
        .cc-header {
          display: flex; align-items: center; gap: 10px;
          padding: 18px 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .cc-logomark {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 18px rgba(249,115,22,0.4);
        }

        .cc-logotxt {
          flex: 1; overflow: hidden;
          transition: opacity 0.2s ease, width 0.32s ease;
          opacity: ${collapsed ? 0 : 1};
          width: ${collapsed ? 0 : "auto"};
          white-space: nowrap;
        }

        .cc-logotxt-main {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          font-size: 15px; color: #fff; line-height: 1.15;
        }

        .cc-logotxt-main span { color: #f97316; }
        .cc-logotxt-sub { font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 1px; }

        .cc-toggle {
          margin-left: auto; flex-shrink: 0;
          width: 26px; height: 26px; border-radius: 7px;
          background: rgba(255,255,255,0.06); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.35);
          transition: background 0.2s, color 0.2s;
        }
        .cc-toggle:hover { background: rgba(255,255,255,0.13); color: #fff; }

        /* ── User card ── */
        .cc-usercard {
          margin: 12px 10px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
          transition: padding 0.32s ease, justify-content 0.32s ease;
          justify-content: ${collapsed ? "center" : "flex-start"};
        }
        .cc-usercard:hover { background: rgba(255,255,255,0.07); }

        .cc-avatar {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          background: linear-gradient(135deg, #f97316, #ef4444);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: white;
          box-shadow: 0 2px 10px rgba(249,115,22,0.35);
        }

        .cc-userinfo {
          overflow: hidden; flex: 1;
          opacity: ${collapsed ? 0 : 1};
          width: ${collapsed ? 0 : "auto"};
          transition: opacity 0.18s ease, width 0.32s ease;
          pointer-events: ${collapsed ? "none" : "auto"};
        }

        .cc-username { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cc-userrole { font-size: 10.5px; font-weight: 500; color: #f97316; letter-spacing: 0.06em; text-transform: uppercase; }

        /* ── Nav ── */
        .cc-nav { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 4px 8px; scrollbar-width: none; }
        .cc-nav::-webkit-scrollbar { display: none; }

        .cc-group-label {
          font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(255,255,255,0.18);
          padding: 10px 8px 5px;
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          max-height: ${collapsed ? 0 : "30px"};
          overflow: hidden;
          transition: opacity 0.2s ease, max-height 0.32s ease;
        }

        .cc-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 6px 8px; }

        /* ── Nav Item ── */
        .cc-navitem {
          position: relative;
          display: flex; align-items: center; gap: 10px;
          width: 100%; border: none; cursor: pointer;
          border-radius: 10px; margin-bottom: 1px;
          padding: 9px 10px;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.42);
          transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
          text-align: left;
          justify-content: ${collapsed ? "center" : "flex-start"};
          overflow: visible;
        }

        .cc-navitem:hover {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.85);
          transform: translateX(${collapsed ? 0 : 2}px);
        }

        .cc-navitem.active {
          background: rgba(249,115,22,0.13);
          color: #fb923c;
        }

        .cc-navitem.sos-item { color: rgba(239,68,68,0.55); }
        .cc-navitem.sos-item:hover { background: rgba(239,68,68,0.08); color: #f87171; }
        .cc-navitem.sos-item.active { background: rgba(239,68,68,0.14); color: #ef4444; }

        .cc-pip {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 55%; border-radius: 0 3px 3px 0;
          background: #f97316;
        }
        .cc-pip.sos { background: #ef4444; }

        .cc-navicon { width: 17px; height: 17px; flex-shrink: 0; }

        .cc-navlabel {
          flex: 1; white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          max-width: ${collapsed ? 0 : "200px"};
          overflow: hidden;
          transition: opacity 0.15s ease, max-width 0.32s ease;
          pointer-events: ${collapsed ? "none" : "auto"};
        }

        .cc-badge {
          background: #f97316; color: white;
          font-size: 10px; font-weight: 700;
          padding: 1px 6px; border-radius: 20px; flex-shrink: 0;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.15s ease;
        }

        /* tooltip when collapsed */
        .cc-tooltip {
          position: absolute;
          left: calc(100% + 10px); top: 50%; transform: translateY(-50%);
          background: #1c1c1b; border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 12px; font-weight: 500;
          padding: 5px 10px; border-radius: 8px;
          white-space: nowrap; pointer-events: none;
          opacity: 0; transition: opacity 0.15s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          z-index: 999;
        }
        .cc-navitem:hover .cc-tooltip { opacity: ${collapsed ? 1 : 0}; }

        /* ── Footer ── */
        .cc-footer {
          padding: 10px 8px 14px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .cc-logout {
          display: flex; align-items: center; gap: 10px;
          width: 100%; border: none; cursor: pointer;
          border-radius: 10px;
          padding: 9px 10px;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.3);
          transition: background 0.18s ease, color 0.18s ease;
          justify-content: ${collapsed ? "center" : "flex-start"};
        }
        .cc-logout:hover { background: rgba(239,68,68,0.1); color: #f87171; }
        .cc-logout-label {
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          max-width: ${collapsed ? 0 : "160px"};
          overflow: hidden;
          transition: opacity 0.15s ease, max-width 0.32s ease;
        }
      `}</style>

      <aside className="cc-sidebar">

        {/* Header */}
        <div className="cc-header">
          <div className="cc-logomark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div className="cc-logotxt">
            <div className="cc-logotxt-main">Community <span>Connect</span></div>
            <div className="cc-logotxt-sub">Volunteer Platform</div>
          </div>
          <button className="cc-toggle" onClick={() => setCollapsed(c => !c)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
            </svg>
          </button>
        </div>

        {/* User Card */}
        <div className="cc-usercard">
          <div className="cc-avatar">{initials}</div>
          <div className="cc-userinfo">
            <div className="cc-username">{userName}</div>
            <div className="cc-userrole">Volunteer</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="cc-nav">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && <div className="cc-divider" />}
              <div className="cc-group-label">{group.label}</div>
              {group.items.map((item, ii) => {
                const isActive = activeTab === item.id;
                const delay = (gi * 4 + ii) * 35;
                return (
                  <button
                    key={item.id}
                    className={`cc-navitem${isActive ? " active" : ""}`}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? (collapsed ? "none" : "translateX(0)") : "translateX(-10px)",
                      transition: `opacity 0.3s ease ${delay}ms, transform 0.3s ease ${delay}ms, background 0.18s, color 0.18s`,
                    }}
                  >
                    {isActive && <span className="cc-pip" />}
                    <span className="cc-navicon">{item.icon}</span>
                    <span className="cc-navlabel">{item.label}</span>
                    {item.hasBadge && myEventsCount > 0 && (
                      <span className="cc-badge">{myEventsCount}</span>
                    )}
                    <span className="cc-tooltip">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}

          <div className="cc-divider" />

          {/* SOS */}
          {(() => {
            const isActive = activeTab === SOS_ITEM.id;
            return (
              <button
                className={`cc-navitem sos-item${isActive ? " active" : ""}`}
                onClick={() => setActiveTab(SOS_ITEM.id)}
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: "opacity 0.3s ease 280ms, background 0.18s, color 0.18s",
                }}
              >
                {isActive && <span className="cc-pip sos" />}
                <span className="cc-navicon">{SOS_ITEM.icon}</span>
                <span className="cc-navlabel">{SOS_ITEM.label}</span>
                <span className="cc-tooltip">{SOS_ITEM.label}</span>
              </button>
            );
          })()}
        </nav>

        {/* Footer */}
        <div className="cc-footer">
          <button className="cc-logout" onClick={handleLogout}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="cc-logout-label">Log out</span>
            <span className="cc-tooltip">Log out</span>
          </button>
        </div>

      </aside>
    </>
  );
}