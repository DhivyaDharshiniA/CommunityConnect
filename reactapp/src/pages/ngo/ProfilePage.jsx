import React, { useState, useEffect } from "react";
import axios from "axios";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white:       #ffffff;
    --bg:          #f5f6f8;
    --surface:     #ffffff;
    --border:      #e4e7ec;
    --border-light:#f0f2f5;
    --text-primary:#111827;
    --text-secondary:#4b5563;
    --text-muted:  #9ca3af;
    --accent:      #1a56db;
    --accent-light:#eff3ff;
    --accent-mid:  #c7d7fd;
    --green:       #057a55;
    --green-bg:    #f0fdf4;
    --green-border:#bbf7d0;
    --amber:       #b45309;
    --amber-bg:    #fffbeb;
    --amber-border:#fde68a;
    --shadow-sm:   0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md:   0 4px 12px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04);
    --radius-sm:   6px;
    --radius-md:   10px;
    --radius-lg:   14px;
  }

  .p-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--text-primary);
  }

  .topbar {
    height: 56px;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 32px;
    gap: 8px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .topbar-crumb { font-size: 13px; color: var(--text-muted); font-weight: 400; }
  .topbar-sep   { color: var(--border); font-size: 16px; margin: 0 2px; }
  .topbar-current { font-size: 13px; color: var(--text-primary); font-weight: 600; }
  .topbar-actions { margin-left: auto; display: flex; gap: 8px; align-items: center; }

  .p-layout {
    display: grid;
    grid-template-columns: 272px 1fr;
    gap: 22px;
    max-width: 1180px;
    margin: 0 auto;
    padding: 26px 28px;
  }

  /* Sidebar */
  .sidebar { display: flex; flex-direction: column; gap: 14px; }

  /* ── Profile Card ─────────────────────────────────────────── */
  .profile-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  /* Gradient cover — soft blue-to-indigo, no texture */
  .profile-cover {
    height: 88px;
    background: linear-gradient(135deg, #dbeafe 0%, #c7d7fd 45%, #ddd6fe 100%);
    position: relative;
    overflow: hidden;
  }

  /* Subtle light circle accents inside the gradient */
  .profile-cover::before {
    content: '';
    position: absolute;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: rgba(255,255,255,0.35);
    top: -40px; right: -30px;
  }

  .profile-cover::after {
    content: '';
    position: absolute;
    width: 70px; height: 70px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    bottom: -20px; left: 20px;
  }

  /* Hide old pattern div — kept in JSX but invisible */
  .profile-cover-pattern { display: none; }

  /* Body */
  .profile-body { padding: 0 20px 20px; }

  .status-verified { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
  .status-pending  { background: var(--amber-bg); color: var(--amber); border: 1px solid var(--amber-border); }
  .status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* Name + category */
  .profile-name {
    font-family: 'Fraunces', serif;
    font-size: 30.5px; font-weight: 600;
    color: var(--text-primary); line-height: 1.3; margin-bottom: 3px;
  }

  .profile-category {
    font-size: 11.5px; color: var(--text-muted); font-weight: 400;
    margin-bottom: 10px; line-height: 1.4;
  }

  /* Reg number chip */
  .reg-pill {
    font-size: 10.5px;
    color: var(--accent); background: var(--accent-light);
    border: 1px solid var(--accent-mid); border-radius: var(--radius-sm);
    padding: 2px 8px; display: inline-block; letter-spacing: 0.04em; font-weight: 600;
  }

  /* Separator */
  .divider { height: 1px; background: var(--border-light); margin: 14px 0; }

  /* Info rows */
  .info-list { display: flex; flex-direction: column; gap: 0; }

  .info-row {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 0;
    border-bottom: 1px solid var(--border-light);
  }

  .info-row:last-child { border-bottom: none; padding-bottom: 0; }
  .info-row:first-child { padding-top: 0; }

  .info-icon {
    width: 28px; height: 28px; border-radius: 7px;
    background: var(--bg); border: 1px solid var(--border-light);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .info-icon svg { width: 12px; height: 12px; color: var(--text-muted); }

  .info-content { display: flex; flex-direction: column; gap: 1px; min-width: 0; }

  .info-label {
    font-size: 9.5px; color: var(--text-muted); font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
  }

  .info-val {
    font-size: 12px; color: var(--text-secondary); font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .info-val a { color: var(--accent); text-decoration: none; }
  .info-val a:hover { text-decoration: underline; }

  /* Stats */
  .stats-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); padding: 14px 18px;
  }

  .stats-title {
    font-size: 10.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 10px;
  }

  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

  .stat-item {
    background: var(--bg); border: 1px solid var(--border-light);
    border-radius: var(--radius-md); padding: 11px 12px;
  }

  .stat-num {
    font-family: 'Fraunces', serif; font-size: 21px; font-weight: 600;
    color: var(--text-primary); line-height: 1; margin-bottom: 2px;
  }

  .stat-lbl { font-size: 10.5px; color: var(--text-muted); font-weight: 500; }

  /* Mission/Vision */
  .mv-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden;
  }

  .mv-item { padding: 14px 18px; border-bottom: 1px solid var(--border-light); }
  .mv-item:last-child { border-bottom: none; }

  .mv-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; margin-bottom: 6px;
    display: flex; align-items: center; gap: 5px;
  }

  .mv-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .mv-mission-label { color: var(--accent); }
  .mv-mission-dot   { background: var(--accent); }
  .mv-vision-label  { color: #7c3aed; }
  .mv-vision-dot    { background: #7c3aed; }

  .mv-text {
    font-size: 12px; color: var(--text-secondary); line-height: 1.65;
    font-style: italic; font-family: 'Fraunces', serif; font-weight: 300;
  }

  /* Main area */
  .main-area { display: flex; flex-direction: column; gap: 14px; }

  .section-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden;
  }

  .section-head {
    padding: 14px 22px; border-bottom: 1px solid var(--border-light);
    display: flex; align-items: center; gap: 10px;
  }

  .section-head-icon {
    width: 28px; height: 28px; border-radius: var(--radius-sm);
    background: var(--accent-light); border: 1px solid var(--accent-mid);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .section-head-icon svg { width: 13px; height: 13px; color: var(--accent); }
  .section-head-text { font-size: 13.5px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.01em; }
  .section-head-sub  { font-size: 11.5px; color: var(--text-muted); font-weight: 400; }

  .section-body { padding: 20px 22px; }

  .form-row { display: grid; gap: 14px; margin-bottom: 14px; }
  .form-row:last-child { margin-bottom: 0; }
  .cols-2 { grid-template-columns: 1fr 1fr; }
  .cols-3 { grid-template-columns: 1fr 1fr 1fr; }
  .cols-1 { grid-template-columns: 1fr; }

  .field { display: flex; flex-direction: column; gap: 5px; }

  .field-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }

  .field-input, .field-select, .field-textarea {
    width: 100%; padding: 8px 11px;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--text-primary); background: var(--white);
    outline: none; transition: border-color 0.14s, box-shadow 0.14s; font-weight: 400;
  }

  .field-input::placeholder, .field-textarea::placeholder { color: var(--text-muted); font-weight: 300; }

  .field-input:focus, .field-select:focus, .field-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(26,86,219,0.09);
  }

  .field-input:hover:not(:focus),
  .field-select:hover:not(:focus),
  .field-textarea:hover:not(:focus) { border-color: #c4cad4; }

  .field-select option { font-family: 'Plus Jakarta Sans', sans-serif; }

  .field-textarea { resize: vertical; line-height: 1.6; }

  .field-with-prefix {
    display: flex; align-items: center;
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    overflow: hidden; transition: border-color 0.14s, box-shadow 0.14s;
  }

  .field-with-prefix:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(26,86,219,0.09);
  }

  .field-with-prefix:hover:not(:focus-within) { border-color: #c4cad4; }

  .field-prefix {
    padding: 8px 10px; font-size: 12px; color: var(--text-muted);
    background: var(--bg); border-right: 1.5px solid var(--border);
    white-space: nowrap; font-weight: 500;
  }

  .field-with-prefix input {
    flex: 1; padding: 8px 11px; border: none; outline: none;
    font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--text-primary); background: var(--white);
  }

  .field-with-prefix input::placeholder { color: var(--text-muted); font-weight: 300; }

  /* Action bar */
  .action-bar {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
    padding: 14px 22px; display: flex; align-items: center; justify-content: space-between;
  }

  .action-meta { font-size: 12px; color: var(--text-muted); }
  .action-meta strong { color: var(--text-secondary); font-weight: 600; }

  .btn-group { display: flex; gap: 8px; }

  .btn {
    padding: 8px 16px; border-radius: var(--radius-sm);
    font-size: 12.5px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; border: none; transition: all 0.14s; letter-spacing: 0.01em;
  }

  .btn-ghost {
    background: transparent; color: var(--text-secondary);
    border: 1.5px solid var(--border);
  }
  .btn-ghost:hover { background: var(--bg); border-color: #c4cad4; }

  .btn-primary {
    background: var(--accent); color: white;
    box-shadow: 0 1px 4px rgba(26,86,219,0.22);
  }
  .btn-primary:hover {
    background: #1447c4;
    box-shadow: 0 3px 10px rgba(26,86,219,0.28);
    transform: translateY(-1px);
  }
  .btn-primary:active { transform: none; }

  /* Loading */
  .loading-wrap {
    display: flex; align-items: center; justify-content: center;
    min-height: 60vh; flex-direction: column; gap: 14px;
  }

  .spinner {
    width: 30px; height: 30px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }

  @media (max-width: 900px) {
    .p-layout { grid-template-columns: 1fr; padding: 18px 16px; }
    .cols-2, .cols-3 { grid-template-columns: 1fr; }
    .topbar { padding: 0 16px; }
  }

  .profile-card{
  position:relative;
  border-radius:14px;
  overflow:hidden;
  background:white;
  }

  /* Gradient cover */
  .profile-cover{
  height:100px;
  background:linear-gradient(135deg,#2563eb,#4f46e5);
  position:relative;
  }

  /* Avatar wrapper */
  .profile-avatar-wrap{
  position:absolute;
  top:60px; /* pushes avatar into body */
  left:20px;

  display:flex;
  align-items:center;
  gap:14px;
  }

  /* Avatar */
  .profile-avatar{
  width:72px;
  height:72px;
  border-radius:50%;
  background:#fff;
  color:#2563eb;
  font-weight:700;
  font-size:35px;

  display:flex;
  align-items:center;
  justify-content:center;

  border:4px solid white;
  box-shadow:0 4px 12px rgba(0,0,0,0.15);
  }

  /* Body spacing so content starts below avatar */
  .profile-body{
  padding:50px 24px 24px;
  }

  /* Status badge */
  .profile-status{
  display:flex;
  align-items:center;
  gap:6px;
  padding:6px 12px;
  border-radius:20px;
  font-size:13px;
  font-weight:600;
  }

  .status-verified{
  background:#e6f7ee;
  color:#16a34a;
  }

  .status-pending{
  background:#fff4e5;
  color:#f59e0b;
  }

  .status-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:currentColor;
  }
`;

/* ─── SVG Icons ─────────────────────────────────────────────────── */
const BuildingIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="3" width="14" height="14" rx="2"/>
    <path d="M7 7h2M11 7h2M7 11h2M11 11h2M7 15h6" strokeLinecap="round"/>
  </svg>
);
const ContactIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M4 4h12a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"/>
    <path d="M3 6l7 5 7-5" strokeLinecap="round"/>
  </svg>
);
const LocationIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M10 2C7.24 2 5 4.24 5 7c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5z"/>
    <circle cx="10" cy="7" r="2"/>
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="10" cy="10" r="7"/>
    <path d="M10 3c-2.33 3-2.33 11 0 14M3 10h14M3.93 6.5h12.14M3.93 13.5h12.14"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M6.5 3h3l1.5 3.5-2 1.5c.83 1.83 2 3 3.83 3.83l1.5-2L18 11v3a1 1 0 01-1 1C9.27 15 5 10.73 5 3a1 1 0 011-1h.5z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M10 2l6 2.5v5C16 14 13.33 17 10 18c-3.33-1-6-4-6-8.5V4.5L10 2z" strokeLinejoin="round"/>
    <path d="M7.5 10l1.5 1.5L13 8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="3" y="4" width="14" height="13" rx="2"/>
    <path d="M3 8h14M7 2v4M13 2v4" strokeLinecap="round"/>
  </svg>
);

/* ─── Main Component ────────────────────────────────────────────── */
export default function NGOProfileBlue() {
  const token = localStorage.getItem("token");
  const NGO_ID = 1;

  const [ngo, setNgo] = useState({
    organizationName: "", registrationNumber: "",
    category: "", description: "", address: "",
    city: "", state: "", phone: "", website: "",
    mission: "", vision: "",
    email: "", volunteers: 0, rating: 0,
    verificationStatus: "", verifiedAt: null, createdAt: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/ngos/${NGO_ID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNgo(res.data);
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setNgo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/ngos/${NGO_ID}`, ngo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const fmt = (dt) =>
    dt ? new Date(dt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const isVerified = ngo.verificationStatus?.toLowerCase() === "verified";

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="p-root">
          <div className="loading-wrap">
            <div className="spinner" />
            <span className="loading-label">Loading profile…</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="p-root">

        <div className="p-layout">

          {/* ── SIDEBAR ───────────────────────────────── */}
          <div className="sidebar">

            <div className="profile-card">
              <div className="profile-cover">
                <div className="profile-cover-pattern" />
              </div>
              <div className="profile-body">
                {/* Avatar row — avatar left, status badge right */}
{/*                 <div className="profile-avatar-wrap"> */}
{/*                   <div className="profile-avatar"> */}
{/*                     {ngo.organizationName?.charAt(0) || "N"} */}
{/*                   </div> */}
{/*                   <span className={`profile-status ${isVerified ? "status-verified" : "status-pending"}`}> */}
{/*                     <span className="status-dot" /> */}
{/*                     {ngo.verificationStatus || "Pending"} */}
{/*                   </span> */}
{/*                 </div> */}

    <div className="profile-avatar-wrap">
      <div className="profile-avatar">
        {ngo.organizationName?.charAt(0) || "N"}
      </div>

      <span className={`profile-status ${isVerified ? "status-verified" : "status-pending"}`}>
        <span className="status-dot" />
        {ngo.verificationStatus || "Pending"}
      </span>
      </div>

                <div className="profile-name">{ngo.organizationName || "Organization Name"}</div>
                <div className="profile-category">
                  {ngo.category || "—"}{ngo.city ? ` · ${ngo.city}` : ""}{ngo.state ? `, ${ngo.state}` : ""}
                </div>
                {ngo.registrationNumber && (
                  <span className="reg-pill">Reg# {ngo.registrationNumber}</span>
                )}

                <div className="divider" />

                <div className="info-list">
                  {ngo.email && (
                    <div className="info-row">
                      <div className="info-icon"><ContactIcon /></div>
                      <div className="info-content">
                        <div className="info-label">Email</div>
                        <div className="info-val">{ngo.email}</div>
                      </div>
                    </div>
                  )}
                  {ngo.phone && (
                    <div className="info-row">
                      <div className="info-icon"><PhoneIcon /></div>
                      <div className="info-content">
                        <div className="info-label">Phone</div>
                        <div className="info-val">{ngo.phone}</div>
                      </div>
                    </div>
                  )}
                  {ngo.website && (
                    <div className="info-row">
                      <div className="info-icon"><GlobeIcon /></div>
                      <div className="info-content">
                        <div className="info-label">Website</div>
                        <div className="info-val">
                          <a href={ngo.website.startsWith("http") ? ngo.website : `https://${ngo.website}`} target="_blank" rel="noreferrer">
                            {ngo.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  {ngo.address && (
                    <div className="info-row">
                      <div className="info-icon"><LocationIcon /></div>
                      <div className="info-content">
                        <div className="info-label">Address</div>
                        <div className="info-val">
                          {ngo.address}{ngo.city ? `, ${ngo.city}` : ""}{ngo.state ? `, ${ngo.state}` : ""}
                        </div>
                      </div>
                    </div>
                  )}
                  {isVerified && ngo.verifiedAt && (
                    <div className="info-row">
                      <div className="info-icon"><ShieldIcon /></div>
                      <div className="info-content">
                        <div className="info-label">Verified On</div>
                        <div className="info-val" style={{ color: "var(--green)" }}>{fmt(ngo.verifiedAt)}</div>
                      </div>
                    </div>
                  )}
                  <div className="info-row">
                    <div className="info-icon"><CalendarIcon /></div>
                    <div className="info-content">
                      <div className="info-label">Member Since</div>
                      <div className="info-val">{fmt(ngo.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-card">
              <div className="stats-title">Overview</div>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-num">{ngo.volunteers || 0}</div>
                  <div className="stat-lbl">Volunteers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">{ngo.rating || "—"}</div>
                  <div className="stat-lbl">Rating</div>
                </div>
              </div>
            </div>

            {(ngo.mission || ngo.vision) && (
              <div className="mv-card">
                {ngo.mission && (
                  <div className="mv-item">
                    <div className="mv-label mv-mission-label">
                      <span className="mv-dot mv-mission-dot" /> Mission
                    </div>
                    <p className="mv-text">{ngo.mission}</p>
                  </div>
                )}
                {ngo.vision && (
                  <div className="mv-item">
                    <div className="mv-label mv-vision-label">
                      <span className="mv-dot mv-vision-dot" /> Vision
                    </div>
                    <p className="mv-text">{ngo.vision}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── MAIN FORM ─────────────────────────────── */}
          <div className="main-area">

            {/* Organization Details */}
            <div className="section-card">
              <div className="section-head">
                <div className="section-head-icon"><BuildingIcon /></div>
                <div>
                  <div className="section-head-text">Organization Details</div>
                  <div className="section-head-sub">Legal identity and classification</div>
                </div>
              </div>
              <div className="section-body">
                <div className="form-row cols-2">
                  <div className="field">
                    <label className="field-label">Organization Name</label>
                    <input className="field-input" name="organizationName" value={ngo.organizationName} onChange={handleChange} placeholder="Full legal name" />
                  </div>
                  <div className="field">
                    <label className="field-label">Registration Number</label>
                    <input className="field-input" name="registrationNumber" value={ngo.registrationNumber} onChange={handleChange} placeholder="Unique registration ID" />
                  </div>
                </div>
                <div className="form-row cols-2">
                  <div className="field">
                    <label className="field-label">Category / Focus Area</label>
                    <select className="field-select" name="category" value={ngo.category} onChange={handleChange}>
                      <option value="">Select a category</option>
                      <option>Environment</option>
                      <option>Education</option>
                      <option>Health</option>
                      <option>Community Development</option>
                      <option>Human Rights</option>
                      <option>Animal Welfare</option>
                      <option>Disaster Relief</option>
                    </select>
                  </div>
                </div>
                <div className="form-row cols-1">
                  <div className="field">
                    <label className="field-label">Description</label>
                    <textarea className="field-textarea" rows={3} name="description" value={ngo.description} onChange={handleChange} placeholder="A brief overview of your organization and its work…" />
                  </div>
                </div>
                <div className="form-row cols-2">
                  <div className="field">
                    <label className="field-label">Mission Statement</label>
                    <textarea className="field-textarea" rows={3} name="mission" value={ngo.mission} onChange={handleChange} placeholder="What is your core purpose?" />
                  </div>
                  <div className="field">
                    <label className="field-label">Vision Statement</label>
                    <textarea className="field-textarea" rows={3} name="vision" value={ngo.vision} onChange={handleChange} placeholder="What future do you aim to create?" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="section-card">
              <div className="section-head">
                <div className="section-head-icon"><ContactIcon /></div>
                <div>
                  <div className="section-head-text">Contact Information</div>
                  <div className="section-head-sub">How people and partners can reach you</div>
                </div>
              </div>
              <div className="section-body">
                <div className="form-row cols-2">
                  <div className="field">
                    <label className="field-label">Email Address</label>
                    <input className="field-input" name="email" value={ngo.email} onChange={handleChange} placeholder="contact@organization.org" />
                  </div>
                  <div className="field">
                    <label className="field-label">Phone Number</label>
                    <input className="field-input" name="phone" value={ngo.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="form-row cols-1">
                  <div className="field">
                    <label className="field-label">Website</label>
                    <div className="field-with-prefix">
                      <span className="field-prefix">https://</span>
                      <input
                        name="website"
                        value={ngo.website?.replace(/^https?:\/\//, "") || ""}
                        onChange={(e) => setNgo((p) => ({ ...p, website: e.target.value }))}
                        placeholder="yourorganization.org"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="section-card">
              <div className="section-head">
                <div className="section-head-icon"><LocationIcon /></div>
                <div>
                  <div className="section-head-text">Location</div>
                  <div className="section-head-sub">Registered address and operating region</div>
                </div>
              </div>
              <div className="section-body">
                <div className="form-row cols-1">
                  <div className="field">
                    <label className="field-label">Street Address</label>
                    <input className="field-input" name="address" value={ngo.address} onChange={handleChange} placeholder="Building, street name and number" />
                  </div>
                </div>
                <div className="form-row cols-2">
                  <div className="field">
                    <label className="field-label">City</label>
                    <input className="field-input" name="city" value={ngo.city} onChange={handleChange} placeholder="City" />
                  </div>
                  <div className="field">
                    <label className="field-label">State / Province</label>
                    <input className="field-input" name="state" value={ngo.state} onChange={handleChange} placeholder="State" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
              <div className="action-meta">
                 Created By: <strong>{fmt(ngo.createdAt)}</strong>
                {isVerified && ngo.verifiedAt && (
                  <>&nbsp;&nbsp;·&nbsp;&nbsp;Verified: <strong style={{ color: "var(--green)" }}>{fmt(ngo.verifiedAt)}</strong></>
                )}
              </div>
              <div className="btn-group">
                <button className="btn btn-ghost" onClick={fetchProfile}>Discard</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}