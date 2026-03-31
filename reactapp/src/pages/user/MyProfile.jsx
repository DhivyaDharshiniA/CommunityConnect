// import React, { useEffect, useState } from "react";
// import axios from "axios";
//
// export default function MyProfile() {
//   const currentUser = JSON.parse(localStorage.getItem("user"));
//
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     location: "",
//     bio: ""
//   });
//
//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     fetchProfile();
//   }, []);
//
//   // ✅ FETCH PROFILE
//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:8080/api/profile/${currentUser.id}`
//       );
//
//       setUser({
//         name: res.data.name || "",
//         email: res.data.email || "",
//         phone: res.data.phone || "",
//         location: res.data.location || "",
//         bio: res.data.bio || ""
//       });
//
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // ✅ HANDLE INPUT
//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };
//
//   // ✅ UPDATE PROFILE
//   const updateProfile = async () => {
//     try {
//       await axios.put(
//         `http://localhost:8080/api/profile/${currentUser.id}`,
//         {
//           phone: user.phone,
//           location: user.location,
//           bio: user.bio
//         }
//       );
//
//       setEditing(false);
//       alert("✅ Profile updated successfully");
//
//     } catch (err) {
//       console.error("Error updating profile:", err);
//     }
//   };
//
//   if (loading) {
//     return (
//       <div className="text-center mt-20 text-gray-500">
//         Loading profile...
//       </div>
//     );
//   }
//
//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
//
//       {/* HEADER */}
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//         My Profile
//       </h2>
//
//       {/* USER CARD */}
//       <div className="flex items-center gap-4 mb-6">
//         <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
//           {user.name?.charAt(0) || "U"}
//         </div>
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
//           <p className="text-gray-400 text-sm">{user.email}</p>
//         </div>
//       </div>
//
//       {/* FORM */}
//       <div className="space-y-4">
//
//         {/* NAME */}
//         <input
//           value={user.name}
//           disabled
//           className="w-full p-3 border rounded bg-gray-100"
//         />
//
//         {/* EMAIL */}
//         <input
//           value={user.email}
//           disabled
//           className="w-full p-3 border rounded bg-gray-100"
//         />
//
//         {/* PHONE */}
//         <input
//           name="phone"
//           value={user.phone}
//           onChange={handleChange}
//           disabled={!editing}
//           placeholder="Enter phone number"
//           className="w-full p-3 border rounded"
//         />
//
//         {/* LOCATION */}
//         <input
//           name="location"
//           value={user.location}
//           onChange={handleChange}
//           disabled={!editing}
//           placeholder="Enter location"
//           className="w-full p-3 border rounded"
//         />
//
//         {/* BIO */}
//         <textarea
//           name="bio"
//           value={user.bio}
//           onChange={handleChange}
//           disabled={!editing}
//           placeholder="Write something about yourself..."
//           className="w-full p-3 border rounded h-24"
//         />
//       </div>
//
//       {/* BUTTONS */}
//       <div className="mt-6 flex gap-3">
//         {!editing ? (
//           <button
//             onClick={() => setEditing(true)}
//             className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded transition"
//           >
//             Edit Profile
//           </button>
//         ) : (
//           <>
//             <button
//               onClick={updateProfile}
//               className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded transition"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setEditing(false)}
//               className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded transition"
//             >
//               Cancel
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream: #f9f6f1;
    --ink: #1a1612;
    --amber: #c8773a;
    --amber-light: #e8935a;
    --amber-muted: #f0d9c8;
    --stone: #8c8279;
    --border: #e4ddd6;
    --white: #ffffff;
  }

  .profile-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .profile-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .profile-card {
    background: var(--white);
    width: 100%;
    max-width: 680px;
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 4px 40px rgba(26,22,18,0.08), 0 1px 4px rgba(26,22,18,0.04);
  }

  /* ── BANNER ── */
  .profile-banner {
    background: var(--ink);
    position: relative;
    padding: 2.5rem 2.5rem 3.5rem;
    overflow: hidden;
  }

  .profile-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 110% 50%, rgba(200,119,58,0.25) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at -10% 80%, rgba(200,119,58,0.12) 0%, transparent 60%);
    pointer-events: none;
  }

  .profile-banner-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 1.8rem;
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .profile-banner-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(200,119,58,0.3);
  }

  .profile-identity {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    position: relative;
  }

  .profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--amber), var(--amber-light));
    color: var(--white);
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(200,119,58,0.3), 0 0 0 6px rgba(200,119,58,0.1);
    transition: box-shadow 0.3s ease;
  }

  .profile-avatar:hover {
    box-shadow: 0 0 0 3px rgba(200,119,58,0.5), 0 0 0 10px rgba(200,119,58,0.15);
  }

  .profile-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--white);
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .profile-email-tag {
    margin-top: 0.3rem;
    font-size: 0.8rem;
    font-weight: 400;
    color: rgba(249,246,241,0.5);
    letter-spacing: 0.01em;
  }

  .profile-status {
    margin-top: 0.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--amber);
  }

  .profile-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--amber);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.4); }
  }

  /* ── BODY ── */
  .profile-body {
    padding: 2rem 2.5rem 2.5rem;
  }

  .section-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--stone);
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.2rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .form-group.full {
    grid-column: 1 / -1;
  }

  .form-label {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--stone);
  }

  .form-input, .form-textarea {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--ink);
    background: var(--cream);
    border: 1.5px solid var(--border);
    border-radius: 4px;
    padding: 0.75rem 1rem;
    width: 100%;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    -webkit-appearance: none;
  }

  .form-input::placeholder, .form-textarea::placeholder {
    color: #c4bdb6;
    font-style: italic;
  }

  .form-input:disabled, .form-textarea:disabled {
    background: #f4f1ee;
    color: var(--stone);
    cursor: default;
    border-color: transparent;
  }

  .form-input:not(:disabled):focus,
  .form-textarea:not(:disabled):focus {
    border-color: var(--amber);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(200,119,58,0.1);
  }

  .form-input:not(:disabled):hover,
  .form-textarea:not(:disabled):hover {
    border-color: #c8b9ad;
  }

  .form-textarea {
    resize: none;
    height: 100px;
    line-height: 1.6;
  }

  /* readonly locked fields */
  .field-locked {
    position: relative;
  }

  .lock-icon {
    position: absolute;
    right: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    color: #c4bdb6;
    font-size: 0.75rem;
    pointer-events: none;
  }

  /* ── DIVIDER ── */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 1.5rem 0;
  }

  /* ── FOOTER ── */
  .profile-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
  }

  .footer-hint {
    font-size: 0.72rem;
    color: #b8b0a8;
    font-weight: 400;
  }

  .btn-group {
    display: flex;
    gap: 0.6rem;
  }

  .btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.65rem 1.4rem;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .btn-primary {
    background: var(--ink);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--amber);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(200,119,58,0.35);
  }

  .btn-save {
    background: var(--amber);
    color: var(--white);
  }

  .btn-save:hover {
    background: #b86832;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(200,119,58,0.4);
  }

  .btn-cancel {
    background: transparent;
    color: var(--stone);
    border: 1.5px solid var(--border);
  }

  .btn-cancel:hover {
    background: var(--cream);
    border-color: #c4bdb6;
    color: var(--ink);
  }

  /* ── LOADING ── */
  .loading-state {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem;
    color: var(--stone);
    font-size: 0.85rem;
    letter-spacing: 0.05em;
  }

  .loading-spinner {
    width: 28px;
    height: 28px;
    border: 2px solid var(--border);
    border-top-color: var(--amber);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── EDITING INDICATOR ── */
  .editing-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--amber);
    background: rgba(200,119,58,0.1);
    border: 1px solid rgba(200,119,58,0.25);
    padding: 0.3rem 0.7rem;
    border-radius: 100px;
  }

  .editing-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--amber);
    animation: pulse 1.5s infinite;
  }
`;

export default function MyProfile() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/profile/${currentUser.id}`
      );
      setUser({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        location: res.data.location || "",
        bio: res.data.bio || ""
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/profile/${currentUser.id}`,
        {
          phone: user.phone,
          location: user.location,
          bio: user.bio
        }
      );
      setEditing(false);
      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="profile-root">
          <div className="loading-state">
            <div className="loading-spinner" />
            Fetching your profile…
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="profile-root">
        <div className="profile-card">

          {/* ── BANNER ── */}
          <div className="profile-banner">
            <div className="profile-banner-label">Member Profile</div>
            <div className="profile-identity">
              <div className="profile-avatar">
                {user.name?.charAt(0) || "U"}
              </div>
              <div>
                <div className="profile-name">{user.name || "Your Name"}</div>
                <div className="profile-email-tag">{user.email}</div>
                <div className="profile-status">
                  <span className="profile-status-dot" />
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="profile-body">

            {/* Account Info */}
            <div className="section-title">Account</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="field-locked">
                  <input value={user.name} disabled className="form-input" />
                  <span className="lock-icon">🔒</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="field-locked">
                  <input value={user.email} disabled className="form-input" />
                  <span className="lock-icon">🔒</span>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="section-title" style={{ marginTop: "1.4rem" }}>Personal Info</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g. +91 98765 43210"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  name="location"
                  value={user.location}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="City, Country"
                  className="form-input"
                />
              </div>
              <div className="form-group full">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="A short line about yourself…"
                  className="form-textarea"
                />
              </div>
            </div>

            <div className="divider" />

            {/* Footer */}
            <div className="profile-footer">
              <div>
                {editing && (
                  <span className="editing-badge">
                    <span className="editing-dot" />
                    Editing
                  </span>
                )}
                {!editing && (
                  <span className="footer-hint">Click Edit to update your details</span>
                )}
              </div>
              <div className="btn-group">
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="btn btn-primary">
                    ✏ Edit Profile
                  </button>
                ) : (
                  <>
                    <button onClick={() => setEditing(false)} className="btn btn-cancel">
                      Cancel
                    </button>
                    <button onClick={updateProfile} className="btn btn-save">
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}