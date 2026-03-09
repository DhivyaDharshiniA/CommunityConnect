import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserSidebar({ activeTab, setActiveTab, myEventsCount }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-60 bg-white border-r flex flex-col py-6 px-3 fixed h-full shadow-sm">

      {/* Logo */}
      <div className="px-3 mb-8">
        <h2 className="font-bold text-orange-500">Community Connect</h2>
      </div>

      {/* User Info */}
      <div className="mb-6 px-3 py-2 bg-orange-50 rounded-xl">
        <p className="text-sm font-semibold">{userName}</p>
        <p className="text-xs text-orange-500">Volunteer</p>
      </div>

      <nav className="flex flex-col gap-2 flex-1">

        <NavItem
          icon="dashboard"
          label="Overview"
          active={activeTab === "dashboard"}
          onClick={() => setActiveTab("dashboard")}
        />

        <NavItem
          icon="events"
          label="Browse Events"
          active={activeTab === "events"}
          onClick={() => setActiveTab("events")}
        />

        <NavItem
          icon="myevents"
          label="My Events"
          active={activeTab === "myevents"}
          onClick={() => setActiveTab("myevents")}
          badge={myEventsCount}
        />

        <NavItem
          icon="createevent"
          label="Create Event"
          active={activeTab === "createEvent"}
          onClick={() => setActiveTab("createEvent")}
        />

        <NavItem
          icon="request"
          label="Request Help"
          active={activeTab === "helpRequest"}
          onClick={() => setActiveTab("helpRequest")}
        />

        <NavItem
          icon="donate"
          label="Donate"
          active={activeTab === "helpFeed"}
          onClick={() => setActiveTab("helpFeed")}
        />

        <NavItem
          icon="sos"
          label="SOS"
          active={activeTab === "sos"}
          onClick={() => setActiveTab("sos")}
        />

      </nav>

      <button
        onClick={handleLogout}
        className="text-red-500 text-sm font-semibold mt-4"
      >
        Logout
      </button>

    </aside>
  );
}


/* ================= NAV ITEM COMPONENT ================= */

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={
        "group relative flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 " +
        (active
          ? "bg-orange-100 text-orange-600"
          : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:scale-105")
      }
    >

      {/* Active indicator */}
      <span
        className={
          "absolute left-0 top-0 h-full w-1 rounded-r transition-all duration-200 " +
          (active ? "bg-orange-500" : "bg-transparent group-hover:bg-orange-300")
        }
      />

      <div className="flex items-center gap-2 transition-transform duration-200 group-hover:translate-x-1">
        <Icon type={icon} />
        <span>{label}</span>
      </div>

      {badge > 0 && (
        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full transition-transform duration-200 group-hover:scale-110">
          {badge}
        </span>
      )}

    </button>
  );
}


/* ================= ICON COMPONENT ================= */

function Icon({ type }) {
  const base = "w-4 h-4";

  switch (type) {

    case "dashboard":
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM3 21h8v-6H3v6zM13 9h8V3h-8v6z" />
        </svg>
      );

    case "events":
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M8 7V3M16 7V3M4 11h16M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
        </svg>
      );

    case "myevents":
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" />
        </svg>
      );

    case "createevent":
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );

    case "request":
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      );

    case "donate":
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 21C12 21 4 13 4 8a4 4 0 018-1 4 4 0 018 1c0 5-8 13-8 13z"/>
        </svg>
      );

    case "sos":
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      );

    default:
      return null;
  }
}