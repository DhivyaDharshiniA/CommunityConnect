// import { useState, useEffect } from "react";
// import axios from "axios";
//
// /* ── Constants ─────────────────────────────────────────────────────────────── */
// const CATEGORIES = [
//   { id: "medical",   label: "Medical",        icon: "🏥", desc: "Hospital bills & treatments",  color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
//   { id: "education", label: "Education",       icon: "📚", desc: "Tuition fees & books",          color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
//   { id: "disaster",  label: "Disaster Relief", icon: "🏠", desc: "Flood, fire, earthquake",       color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
//   { id: "food",      label: "Food & Nutrition",icon: "🍱", desc: "Meals & groceries",             color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
//   { id: "other",     label: "Other",           icon: "💛", desc: "Any urgent need",               color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
// ];
//
// const STATUS_STYLE = {
//   PENDING:  { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Pending" },
//   APPROVED: { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", label: "Approved" },
//   REJECTED: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Rejected" },
//   CLOSED:   { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", label: "Closed" },
// };
//
// const getCatMeta = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[4];
//
// /* ── Progress Bar (step indicator) ────────────────────────────────────────── */
// function StepBar({ step }) {
//   const steps = ["Basic Info", "Details", "Documents"];
//   return (
//     <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
//       {steps.map((s, i) => {
//         const num   = i + 1;
//         const done  = step > num;
//         const active = step === num;
//         return (
//           <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
//               <div style={{
//                 width: 34, height: 34, borderRadius: "50%",
//                 background: done ? "#16a34a" : active ? "#f97316" : "#f1f5f9",
//                 border: `2px solid ${done ? "#16a34a" : active ? "#f97316" : "#e2e8f0"}`,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontSize: done ? 14 : 13, fontWeight: 800,
//                 color: done || active ? "#fff" : "#94a3b8",
//                 transition: "all 0.25s",
//                 boxShadow: active ? "0 0 0 4px #f9731622" : "none",
//               }}>
//                 {done ? "✓" : num}
//               </div>
//               <span style={{ fontSize: 10, fontWeight: 700, color: active ? "#f97316" : done ? "#16a34a" : "#94a3b8", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
//                 {s}
//               </span>
//             </div>
//             {i < 2 && (
//               <div style={{ flex: 1, height: 2, background: done ? "#16a34a" : "#e2e8f0", margin: "0 8px", marginBottom: 18, transition: "background 0.3s" }} />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
//
// /* ── Request Card ──────────────────────────────────────────────────────────── */
// function RequestCard({ req, showStatus }) {
//   const cat = getCatMeta(req.category);
//   const st  = STATUS_STYLE[req.status?.toUpperCase()] || STATUS_STYLE.PENDING;
//   const pct = req.amountNeeded > 0
//     ? Math.min(100, Math.round((req.amountRaised / req.amountNeeded) * 100))
//     : 0;
//
//   return (
//     <div style={{
//       background: "#fff",
//       border: "1.5px solid #e2e8f0",
//       borderRadius: 18,
//       overflow: "hidden",
//       boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
//       transition: "transform 0.2s, box-shadow 0.2s",
//     }}
//       onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"; }}
//       onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
//     >
//       {/* Color strip */}
//       <div style={{ height: 5, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)` }} />
//
//       <div style={{ padding: "18px 20px" }}>
//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
//           <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1 }}>
//             <div style={{
//               width: 40, height: 40, borderRadius: 11,
//               background: cat.bg, border: `1.5px solid ${cat.border}`,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: 18, flexShrink: 0,
//             }}>{cat.icon}</div>
//             <div style={{ minWidth: 0 }}>
//               <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, fontFamily: "'Outfit', sans-serif" }}>
//                 {req.title}
//               </h3>
//               <span style={{
//                 display: "inline-block", marginTop: 4,
//                 fontSize: 10, fontWeight: 700, color: cat.color,
//                 background: cat.bg, border: `1px solid ${cat.border}`,
//                 padding: "2px 8px", borderRadius: 99, letterSpacing: "0.04em",
//               }}>{cat.label}</span>
//             </div>
//           </div>
//           {showStatus && (
//             <span style={{
//               fontSize: 10, fontWeight: 800,
//               color: st.color, background: st.bg,
//               border: `1px solid ${st.border}`,
//               padding: "3px 10px", borderRadius: 99,
//               letterSpacing: "0.06em", textTransform: "uppercase",
//               flexShrink: 0,
//             }}>{st.label}</span>
//           )}
//         </div>
//
//         {/* Description */}
//         <p style={{
//           margin: "0 0 14px", fontSize: 12, color: "#475569",
//           lineHeight: 1.65,
//           display: "-webkit-box", WebkitLineClamp: 2,
//           WebkitBoxOrient: "vertical", overflow: "hidden",
//           fontFamily: "'Outfit', sans-serif",
//         }}>{req.description}</p>
//
//         {/* Funding progress */}
//         <div style={{ marginBottom: 12 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
//             <div>
//               <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase" }}>Raised</span>
//               <span style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", fontFamily: "'Outfit', sans-serif", marginLeft: 6 }}>
//                 ₹{(req.amountRaised || 0).toLocaleString()}
//               </span>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase" }}>Goal</span>
//               <span style={{ fontSize: 14, fontWeight: 700, color: "#475569", marginLeft: 6, fontFamily: "'Outfit', sans-serif" }}>
//                 ₹{(req.amountNeeded || 0).toLocaleString()}
//               </span>
//             </div>
//           </div>
//           <div style={{ height: 7, background: "#f1f5f9", borderRadius: 99, overflow: "hidden", position: "relative" }}>
//             <div style={{
//               height: "100%", width: `${pct}%`,
//               background: pct >= 100 ? "#16a34a" : pct >= 60 ? cat.color : `${cat.color}bb`,
//               borderRadius: 99,
//               boxShadow: `0 0 8px ${cat.color}44`,
//               transition: "width 0.8s ease",
//             }} />
//           </div>
//           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
//             <span style={{ fontSize: 10, fontWeight: 800, color: cat.color }}>{pct}% funded</span>
//             <span style={{ fontSize: 10, color: "#94a3b8" }}>📍 {req.location}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//
// /* ── File Upload Box ───────────────────────────────────────────────────────── */
// function FileBox({ label, hint, icon, file, onChange, id }) {
//   return (
//     <div
//       onClick={() => document.getElementById(id).click()}
//       style={{
//         flex: 1, cursor: "pointer",
//         borderRadius: 14, border: `2px dashed ${file ? "#f97316" : "#e2e8f0"}`,
//         padding: "22px 16px", textAlign: "center",
//         background: file ? "#fff7ed" : "#f8fafc",
//         transition: "all 0.2s",
//       }}
//       onMouseOver={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.background = "#fff7ed"; }}
//       onMouseOut={e => { if (!file) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; } }}
//     >
//       <input id={id} type="file" style={{ display: "none" }} onChange={onChange} />
//       <div style={{ fontSize: 32, marginBottom: 8 }}>{file ? "✅" : icon}</div>
//       <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#334155", fontFamily: "'Outfit', sans-serif" }}>
//         {file ? file.name : label}
//       </p>
//       <p style={{ margin: "5px 0 0", fontSize: 11, color: "#94a3b8" }}>{file ? "Click to change" : hint}</p>
//     </div>
//   );
// }
//
// /* ── Main Component ────────────────────────────────────────────────────────── */
// export default function HelpRequestPage() {
//   const [activeTab, setActiveTab] = useState("create");
//   const [allRequests, setAllRequests] = useState([]);
//   const [myRequests, setMyRequests]   = useState([]);
//
//   // Form state
//   const [step, setStep]               = useState(1);
//   const [title, setTitle]             = useState("");
//   const [category, setCategory]       = useState("");
//   const [description, setDescription] = useState("");
//   const [amountNeeded, setAmountNeeded] = useState("");
//   const [contactNumber, setContactNumber] = useState("");
//   const [location, setLocation]       = useState("");
//   const [medicalDoc, setMedicalDoc]   = useState(null);
//   const [feeReceipt, setFeeReceipt]   = useState(null);
//   const [submitted, setSubmitted]     = useState(false);
//   const [errors, setErrors]           = useState({});
//   const [submitting, setSubmitting]   = useState(false);
//
//   const userEmail = localStorage.getItem("email");
//
//   useEffect(() => {
//     axios.get("http://localhost:8080/api/help/all")
//       .then(res => setAllRequests(res.data))
//       .catch(console.error);
//     if (userEmail) {
//       axios.get(`http://localhost:8080/api/help/my/${userEmail}`)
//         .then(res => setMyRequests(res.data))
//         .catch(console.error);
//     }
//   }, [userEmail]);
//
//   const validate = (s) => {
//     const e = {};
//     if (s === 1) {
//       if (!title.trim())       e.title       = "Title is required";
//       if (!category)           e.category    = "Please select a category";
//       if (!description.trim()) e.description = "Description is required";
//     }
//     if (s === 2) {
//       if (!amountNeeded || isNaN(amountNeeded) || Number(amountNeeded) <= 0)
//         e.amountNeeded  = "Enter a valid amount";
//       if (!contactNumber.trim()) e.contactNumber = "Contact number is required";
//       if (!location.trim())      e.location      = "Location is required";
//     }
//     return e;
//   };
//
//   const next = () => {
//     const e = validate(step);
//     if (Object.keys(e).length) { setErrors(e); return; }
//     setErrors({});
//     setStep(s => s + 1);
//   };
//
//   const handleSubmit = async () => {
//     const e = validate(2);
//     if (Object.keys(e).length) { setErrors(e); return; }
//     setSubmitting(true);
//     const fd = new FormData();
//     fd.append("title", title);
//     fd.append("category", category);
//     fd.append("description", description);
//     fd.append("amountNeeded", amountNeeded);
//     fd.append("contactNumber", contactNumber);
//     fd.append("location", location);
//     fd.append("createdBy", userEmail);
//     if (medicalDoc)  fd.append("medicalDoc",  medicalDoc);
//     if (feeReceipt)  fd.append("feeReceipt",  feeReceipt);
//     try {
//       await axios.post("http://localhost:8080/api/help/create", fd);
//       setSubmitted(true);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };
//
//   const reset = () => {
//     setSubmitted(false); setStep(1);
//     setTitle(""); setCategory(""); setDescription("");
//     setAmountNeeded(""); setContactNumber(""); setLocation("");
//     setMedicalDoc(null); setFeeReceipt(null); setErrors({});
//   };
//
//   const inputStyle = (err) => ({
//     width: "100%", padding: "10px 13px",
//     borderRadius: 10, border: `1.5px solid ${err ? "#fca5a5" : "#e2e8f0"}`,
//     fontSize: 13, fontFamily: "'Outfit', sans-serif",
//     color: "#0f172a", background: err ? "#fff5f5" : "#fff",
//     outline: "none", boxSizing: "border-box",
//     transition: "border-color 0.15s",
//   });
//   const labelStyle = {
//     fontSize: 11, fontWeight: 800, color: "#64748b",
//     letterSpacing: "0.08em", textTransform: "uppercase",
//     display: "block", marginBottom: 6,
//     fontFamily: "'Outfit', sans-serif",
//   };
//   const errStyle = { fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 600 };
//
//   const TABS = [
//     { id: "create", label: "✦ Create Request",  count: null },
//     { id: "all",    label: "🌐 All Requests",    count: allRequests.length },
//     { id: "my",     label: "👤 My Requests",     count: myRequests.length  },
//   ];
//
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Syne:wght@700;800;900&display=swap');
//         @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
//         @keyframes scaleIn  { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
//         @keyframes confetti { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(8deg) scale(1.05)} 100%{transform:rotate(0deg) scale(1)} }
//         .hrp-input:focus { border-color: #f97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.12) !important; }
//         .hrp-textarea:focus { border-color: #f97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.12) !important; }
//         .req-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:16px; }
//       `}</style>
//
//       <div style={{ fontFamily: "'Outfit', sans-serif" }}>
//
//         {/* ── Page Header ── */}
//         <div style={{
//           background: "linear-gradient(135deg, #431407 0%, #9a3412 40%, #ea580c 80%, #f97316 100%)",
//           borderRadius: 22, padding: "28px 30px 26px",
//           marginBottom: 22, position: "relative", overflow: "hidden",
//           animation: "fadeUp 0.4s ease both",
//         }}>
//           {/* Decorative circles */}
//           {[[160,160,-50,-40,0.07],[90,90,null,-20,0.09,120],[55,55,18,null,0.06,190]].map(([w,h,top,bottom,op,right='-30'],i)=>(
//             <div key={i} style={{
//               position:"absolute", width:w, height:h, borderRadius:"50%",
//               background:"rgba(255,255,255,0.12)",
//               top:top??undefined, bottom:bottom??undefined, right,
//               animation:`confetti ${3+i*0.8}s ease-in-out infinite`,
//             }}/>
//           ))}
//           {/* Grid texture */}
//           <div style={{
//             position:"absolute", inset:0, opacity:0.04,
//             backgroundImage:"radial-gradient(circle, #fff 1px, transparent 1px)",
//             backgroundSize:"22px 22px",
//           }}/>
//
//           <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
//             <div>
//               <p style={{ margin:"0 0 4px", fontSize:10, fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)" }}>
//                 ✦ Community Support
//               </p>
//               <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:30, fontWeight:900, color:"#fff", margin:"0 0 4px", letterSpacing:"-0.02em" }}>
//                 Help Requests
//               </h1>
//               <p style={{ margin:0, fontSize:13, color:"rgba(255,255,255,0.65)" }}>
//                 Submit a request or support someone in need
//               </p>
//             </div>
//
//             <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
//               {[
//                 { icon:"🙏", label:"Total Requests", value: allRequests.length },
//                 { icon:"👤", label:"My Requests",    value: myRequests.length  },
//               ].map((s,i) => (
//                 <div key={i} style={{
//                   background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)",
//                   border:"1px solid rgba(255,255,255,0.2)",
//                   borderRadius:14, padding:"12px 18px",
//                   animation:`fadeUp 0.4s ease ${0.1+i*0.08}s both`,
//                 }}>
//                   <p style={{ margin:0, fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.6)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
//                     {s.icon} {s.label}
//                   </p>
//                   <p style={{ margin:"4px 0 0", fontSize:26, fontWeight:900, color:"#fff", fontFamily:"'Syne', sans-serif", lineHeight:1 }}>
//                     {s.value}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//
//         {/* ── Tab bar ── */}
//         <div style={{
//           background:"#fff", borderRadius:16, border:"1.5px solid #e2e8f0",
//           padding:"5px", marginBottom:22,
//           display:"flex", gap:4,
//           boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
//           animation:"fadeUp 0.4s ease 0.08s both",
//         }}>
//           {TABS.map(tab => (
//             <button key={tab.id} onClick={() => setActiveTab(tab.id)}
//               style={{
//                 flex:1, padding:"10px 8px", borderRadius:12, border:"none",
//                 background: activeTab === tab.id
//                   ? "linear-gradient(135deg, #431407, #ea580c 60%, #f97316)"
//                   : "transparent",
//                 fontSize:12, fontWeight:700,
//                 color: activeTab === tab.id ? "#fff" : "#64748b",
//                 cursor:"pointer", transition:"all 0.2s",
//                 fontFamily:"'Outfit', sans-serif",
//                 display:"flex", alignItems:"center", justifyContent:"center", gap:6,
//                 boxShadow: activeTab === tab.id ? "0 4px 14px rgba(234,88,12,0.35)" : "none",
//               }}
//               onMouseOver={e => { if(activeTab!==tab.id) e.currentTarget.style.background="#f8fafc"; }}
//               onMouseOut={e => { if(activeTab!==tab.id) e.currentTarget.style.background="transparent"; }}
//             >
//               {tab.label}
//               {tab.count !== null && (
//                 <span style={{
//                   background: activeTab===tab.id ? "rgba(255,255,255,0.25)" : "#f1f5f9",
//                   color: activeTab===tab.id ? "#fff" : "#94a3b8",
//                   fontSize:10, fontWeight:800,
//                   padding:"1px 7px", borderRadius:99,
//                 }}>{tab.count}</span>
//               )}
//             </button>
//           ))}
//         </div>
//
//         {/* ── CREATE TAB ── */}
//         {activeTab === "create" && (
//           <div style={{ animation:"fadeUp 0.35s ease both" }}>
//             {submitted ? (
//               /* Success state */
//               <div style={{
//                 background:"#fff", borderRadius:22, border:"1.5px solid #e2e8f0",
//                 padding:"60px 30px", textAlign:"center",
//                 boxShadow:"0 4px 24px rgba(0,0,0,0.06)",
//                 animation:"scaleIn 0.4s ease both",
//               }}>
//                 <div style={{ fontSize:68, marginBottom:16, animation:"confetti 1s ease-in-out infinite" }}>🎉</div>
//                 <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:24, fontWeight:900, color:"#0f172a", margin:"0 0 8px" }}>
//                   Request Submitted!
//                 </h2>
//                 <p style={{ fontSize:13, color:"#64748b", margin:"0 0 28px" }}>
//                   Your help request has been received. We'll review it shortly.
//                 </p>
//                 <button onClick={reset} style={{
//                   background:"linear-gradient(135deg,#ea580c,#f97316)",
//                   color:"#fff", border:"none",
//                   padding:"12px 32px", borderRadius:12,
//                   fontSize:14, fontWeight:700, cursor:"pointer",
//                   fontFamily:"'Outfit', sans-serif",
//                   boxShadow:"0 4px 18px rgba(234,88,12,0.35)",
//                 }}>+ Submit Another Request</button>
//               </div>
//             ) : (
//               <div style={{
//                 background:"#fff", borderRadius:22,
//                 border:"1.5px solid #e2e8f0",
//                 overflow:"hidden",
//                 boxShadow:"0 4px 24px rgba(0,0,0,0.06)",
//               }}>
//                 {/* Form header */}
//                 <div style={{
//                   background:"linear-gradient(135deg,#fff7ed,#fff)",
//                   padding:"22px 28px 18px",
//                   borderBottom:"1.5px solid #f1f5f9",
//                 }}>
//                   <p style={{ margin:"0 0 2px", fontSize:11, fontWeight:800, color:"#ea580c", letterSpacing:"0.1em", textTransform:"uppercase" }}>
//                     Step {step} of 3
//                   </p>
//                   <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:20, fontWeight:800, color:"#0f172a", margin:0 }}>
//                     {step===1 ? "Tell us about your need" : step===2 ? "Contact & financial details" : "Supporting documents"}
//                   </h2>
//                 </div>
//
//                 <div style={{ padding:"24px 28px" }}>
//                   <StepBar step={step} />
//
//                   {/* ── STEP 1 ── */}
//                   {step === 1 && (
//                     <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
//                       <div>
//                         <label style={labelStyle}>Request Title</label>
//                         <input
//                           className="hrp-input"
//                           style={inputStyle(errors.title)}
//                           placeholder="e.g. Need help for my father's surgery…"
//                           value={title}
//                           onChange={e => setTitle(e.target.value)}
//                         />
//                         {errors.title && <p style={errStyle}>⚠ {errors.title}</p>}
//                       </div>
//
//                       <div>
//                         <label style={labelStyle}>Category</label>
//                         <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
//                           {CATEGORIES.map(c => (
//                             <button key={c.id} onClick={() => setCategory(c.id)} style={{
//                               border: `2px solid ${category===c.id ? c.color : "#e2e8f0"}`,
//                               background: category===c.id ? c.bg : "#f8fafc",
//                               borderRadius:12, padding:"12px 14px",
//                               cursor:"pointer", textAlign:"left",
//                               transition:"all 0.15s",
//                               fontFamily:"'Outfit', sans-serif",
//                             }}>
//                               <div style={{ fontSize:22, marginBottom:5 }}>{c.icon}</div>
//                               <p style={{ margin:0, fontSize:12, fontWeight:800, color: category===c.id ? c.color : "#334155" }}>{c.label}</p>
//                               <p style={{ margin:"2px 0 0", fontSize:10, color:"#94a3b8", fontWeight:500 }}>{c.desc}</p>
//                             </button>
//                           ))}
//                         </div>
//                         {errors.category && <p style={errStyle}>⚠ {errors.category}</p>}
//                       </div>
//
//                       <div>
//                         <label style={labelStyle}>Description</label>
//                         <textarea
//                           className="hrp-textarea"
//                           style={{ ...inputStyle(errors.description), resize:"vertical" }}
//                           rows={4}
//                           placeholder="Describe your situation in detail. Be specific about why you need help…"
//                           value={description}
//                           onChange={e => setDescription(e.target.value)}
//                         />
//                         {errors.description && <p style={errStyle}>⚠ {errors.description}</p>}
//                       </div>
//                     </div>
//                   )}
//
//                   {/* ── STEP 2 ── */}
//                   {step === 2 && (
//                     <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
//                       <div>
//                         <label style={labelStyle}>Amount Needed (₹)</label>
//                         <div style={{ position:"relative" }}>
//                           <span style={{
//                             position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
//                             fontSize:15, fontWeight:800, color:"#94a3b8",
//                           }}>₹</span>
//                           <input
//                             className="hrp-input"
//                             type="number"
//                             style={{ ...inputStyle(errors.amountNeeded), paddingLeft:28 }}
//                             placeholder="0.00"
//                             value={amountNeeded}
//                             onChange={e => setAmountNeeded(e.target.value)}
//                           />
//                         </div>
//                         {errors.amountNeeded && <p style={errStyle}>⚠ {errors.amountNeeded}</p>}
//                       </div>
//
//                       <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
//                         <div>
//                           <label style={labelStyle}>Contact Number</label>
//                           <input
//                             className="hrp-input"
//                             style={inputStyle(errors.contactNumber)}
//                             placeholder="+91 XXXXX XXXXX"
//                             value={contactNumber}
//                             onChange={e => setContactNumber(e.target.value)}
//                           />
//                           {errors.contactNumber && <p style={errStyle}>⚠ {errors.contactNumber}</p>}
//                         </div>
//                         <div>
//                           <label style={labelStyle}>Location</label>
//                           <input
//                             className="hrp-input"
//                             style={inputStyle(errors.location)}
//                             placeholder="City, State"
//                             value={location}
//                             onChange={e => setLocation(e.target.value)}
//                           />
//                           {errors.location && <p style={errStyle}>⚠ {errors.location}</p>}
//                         </div>
//                       </div>
//
//                       {/* Amount preview card */}
//                       {amountNeeded > 0 && (
//                         <div style={{
//                           background:"linear-gradient(135deg,#fff7ed,#fff)",
//                           border:"1.5px solid #fed7aa",
//                           borderRadius:14, padding:"16px 18px",
//                           display:"flex", alignItems:"center", gap:14,
//                         }}>
//                           <div style={{ fontSize:32 }}>💰</div>
//                           <div>
//                             <p style={{ margin:0, fontSize:10, fontWeight:700, color:"#ea580c", letterSpacing:"0.08em", textTransform:"uppercase" }}>
//                               Requesting
//                             </p>
//                             <p style={{ margin:"2px 0 0", fontFamily:"'Syne', sans-serif", fontSize:26, fontWeight:900, color:"#0f172a" }}>
//                               ₹{Number(amountNeeded).toLocaleString()}
//                             </p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//
//                   {/* ── STEP 3 ── */}
//                   {step === 3 && (
//                     <div>
//                       <p style={{ margin:"0 0 18px", fontSize:13, color:"#64748b", lineHeight:1.6 }}>
//                         Upload supporting documents to strengthen your request. These are optional but help build trust.
//                       </p>
//                       <div style={{ display:"flex", gap:14 }}>
//                         <FileBox
//                           label="Medical Document" hint="PDF or image" icon="🏥"
//                           file={medicalDoc}
//                           onChange={e => setMedicalDoc(e.target.files[0])}
//                           id="medfile"
//                         />
//                         <FileBox
//                           label="Fee Receipt" hint="Invoice or bill" icon="🧾"
//                           file={feeReceipt}
//                           onChange={e => setFeeReceipt(e.target.files[0])}
//                           id="receiptfile"
//                         />
//                       </div>
//                     </div>
//                   )}
//
//                   {/* Navigation buttons */}
//                   <div style={{ display:"flex", justifyContent: step > 1 ? "space-between" : "flex-end", marginTop:28 }}>
//                     {step > 1 && (
//                       <button onClick={() => setStep(s => s - 1)} style={{
//                         padding:"10px 22px", borderRadius:11,
//                         border:"1.5px solid #e2e8f0", background:"#f8fafc",
//                         fontSize:13, fontWeight:700, color:"#475569",
//                         cursor:"pointer", fontFamily:"'Outfit', sans-serif",
//                       }}>← Back</button>
//                     )}
//                     {step < 3 ? (
//                       <button onClick={next} style={{
//                         padding:"10px 28px", borderRadius:11,
//                         background:"linear-gradient(135deg,#ea580c,#f97316)",
//                         border:"none", color:"#fff",
//                         fontSize:13, fontWeight:700, cursor:"pointer",
//                         fontFamily:"'Outfit', sans-serif",
//                         boxShadow:"0 4px 14px rgba(234,88,12,0.3)",
//                         transition:"all 0.2s",
//                       }}
//                         onMouseOver={e => e.currentTarget.style.transform="translateY(-1px)"}
//                         onMouseOut={e => e.currentTarget.style.transform="translateY(0)"}
//                       >Continue →</button>
//                     ) : (
//                       <button onClick={handleSubmit} disabled={submitting} style={{
//                         padding:"10px 28px", borderRadius:11,
//                         background: submitting ? "#fed7aa" : "linear-gradient(135deg,#ea580c,#f97316)",
//                         border:"none", color:"#fff",
//                         fontSize:13, fontWeight:700,
//                         cursor: submitting ? "not-allowed" : "pointer",
//                         fontFamily:"'Outfit', sans-serif",
//                         boxShadow:"0 4px 14px rgba(234,88,12,0.3)",
//                       }}>
//                         {submitting ? "Submitting…" : "🙏 Submit Request"}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//
//         {/* ── ALL REQUESTS TAB ── */}
//         {activeTab === "all" && (
//           <div style={{ animation:"fadeUp 0.35s ease both" }}>
//             {allRequests.length === 0 ? (
//               <div style={{ textAlign:"center", padding:"70px 20px", background:"#fff", borderRadius:18, border:"1.5px dashed #e2e8f0" }}>
//                 <div style={{ fontSize:48, marginBottom:12 }}>🙏</div>
//                 <p style={{ margin:0, fontFamily:"'Syne', sans-serif", fontSize:18, fontWeight:800, color:"#475569" }}>No requests yet</p>
//               </div>
//             ) : (
//               <div className="req-grid">
//                 {allRequests.map(req => <RequestCard key={req.id} req={req} showStatus={false} />)}
//               </div>
//             )}
//           </div>
//         )}
//
//         {/* ── MY REQUESTS TAB ── */}
//         {activeTab === "my" && (
//           <div style={{ animation:"fadeUp 0.35s ease both" }}>
//             {myRequests.length === 0 ? (
//               <div style={{ textAlign:"center", padding:"70px 20px", background:"#fff", borderRadius:18, border:"1.5px dashed #e2e8f0" }}>
//                 <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
//                 <p style={{ margin:0, fontFamily:"'Syne', sans-serif", fontSize:18, fontWeight:800, color:"#475569" }}>No requests submitted yet</p>
//                 <button onClick={() => setActiveTab("create")} style={{
//                   marginTop:16, padding:"10px 24px", borderRadius:11,
//                   background:"linear-gradient(135deg,#ea580c,#f97316)",
//                   border:"none", color:"#fff",
//                   fontSize:13, fontWeight:700, cursor:"pointer",
//                   fontFamily:"'Outfit', sans-serif",
//                 }}>Create a Request</button>
//               </div>
//             ) : (
//               <div className="req-grid">
//                 {myRequests.map(req => <RequestCard key={req.id} req={req} showStatus={true} />)}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }


import { useState, useEffect } from "react";
import axios from "axios";

/* ── Constants ─────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "medical",   label: "Medical",        icon: "🏥", desc: "Hospital bills & treatments",  color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
  { id: "education", label: "Education",       icon: "📚", desc: "Tuition fees & books",          color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  { id: "disaster",  label: "Disaster Relief", icon: "🏠", desc: "Flood, fire, earthquake",       color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { id: "food",      label: "Food & Nutrition",icon: "🍱", desc: "Meals & groceries",             color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
  { id: "other",     label: "Other",           icon: "💛", desc: "Any urgent need",               color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
];

const STATUS_STYLE = {
  PENDING:  { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Pending" },
  APPROVED: { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", label: "Approved" },
  REJECTED: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Rejected" },
  CLOSED:   { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", label: "Closed" },
};

const getCatMeta = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[4];

/* ── Progress Bar (step indicator) ────────────────────────────────────────── */
function StepBar({ step }) {
  const steps = ["Basic Info", "Details", "Documents"];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {steps.map((s, i) => {
        const num   = i + 1;
        const done  = step > num;
        const active = step === num;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: done ? "#16a34a" : active ? "#f97316" : "#f1f5f9",
                border: `2px solid ${done ? "#16a34a" : active ? "#f97316" : "#e2e8f0"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: done ? 14 : 13, fontWeight: 800,
                color: done || active ? "#fff" : "#94a3b8",
                transition: "all 0.25s",
                boxShadow: active ? "0 0 0 4px #f9731622" : "none",
              }}>
                {done ? "✓" : num}
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: active ? "#f97316" : done ? "#16a34a" : "#94a3b8", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                {s}
              </span>
            </div>
            {i < 2 && (
              <div style={{ flex: 1, height: 2, background: done ? "#16a34a" : "#e2e8f0", margin: "0 8px", marginBottom: 18, transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Request Card ──────────────────────────────────────────────────────────── */
function RequestCard({ req, showStatus }) {
  const cat = getCatMeta(req.category);
  const st  = STATUS_STYLE[req.status?.toUpperCase()] || STATUS_STYLE.PENDING;
  const pct = req.amountNeeded > 0
    ? Math.min(100, Math.round((req.amountRaised / req.amountNeeded) * 100))
    : 0;

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e2e8f0",
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"; }}
      onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
    >
      {/* Color strip */}
      <div style={{ height: 5, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)` }} />

      <div style={{ padding: "18px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: cat.bg, border: `1.5px solid ${cat.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>{cat.icon}</div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, fontFamily: "'DM Sans', sans-serif" }}>
                {req.title}
              </h3>
              <span style={{
                display: "inline-block", marginTop: 4,
                fontSize: 10, fontWeight: 700, color: cat.color,
                background: cat.bg, border: `1px solid ${cat.border}`,
                padding: "2px 8px", borderRadius: 99, letterSpacing: "0.04em",
              }}>{cat.label}</span>
            </div>
          </div>
          {showStatus && (
            <span style={{
              fontSize: 10, fontWeight: 800,
              color: st.color, background: st.bg,
              border: `1px solid ${st.border}`,
              padding: "3px 10px", borderRadius: 99,
              letterSpacing: "0.06em", textTransform: "uppercase",
              flexShrink: 0,
            }}>{st.label}</span>
          )}
        </div>

        {/* Description */}
        <p style={{
          margin: "0 0 14px", fontSize: 12, color: "#475569",
          lineHeight: 1.65,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
        }}>{req.description}</p>

        {/* Funding progress */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase" }}>Raised</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", fontFamily: "'DM Sans', sans-serif", marginLeft: 6 }}>
                ₹{(req.amountRaised || 0).toLocaleString()}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em", textTransform: "uppercase" }}>Goal</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#475569", marginLeft: 6, fontFamily: "'DM Sans', sans-serif" }}>
                ₹{(req.amountNeeded || 0).toLocaleString()}
              </span>
            </div>
          </div>
          <div style={{ height: 7, background: "#f1f5f9", borderRadius: 99, overflow: "hidden", position: "relative" }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: pct >= 100 ? "#16a34a" : pct >= 60 ? cat.color : `${cat.color}bb`,
              borderRadius: 99,
              boxShadow: `0 0 8px ${cat.color}44`,
              transition: "width 0.8s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: cat.color }}>{pct}% funded</span>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>📍 {req.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── File Upload Box ───────────────────────────────────────────────────────── */
function FileBox({ label, hint, icon, file, onChange, id }) {
  return (
    <div
      onClick={() => document.getElementById(id).click()}
      style={{
        flex: 1, cursor: "pointer",
        borderRadius: 14, border: `2px dashed ${file ? "#f97316" : "#e2e8f0"}`,
        padding: "22px 16px", textAlign: "center",
        background: file ? "#fff7ed" : "#f8fafc",
        transition: "all 0.2s",
      }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.background = "#fff7ed"; }}
      onMouseOut={e => { if (!file) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc"; } }}
    >
      <input id={id} type="file" style={{ display: "none" }} onChange={onChange} />
      <div style={{ fontSize: 32, marginBottom: 8 }}>{file ? "✅" : icon}</div>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#334155", fontFamily: "'DM Sans', sans-serif" }}>
        {file ? file.name : label}
      </p>
      <p style={{ margin: "5px 0 0", fontSize: 11, color: "#94a3b8" }}>{file ? "Click to change" : hint}</p>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────────── */
export default function HelpRequestPage() {
  const [activeTab, setActiveTab] = useState("create");
  const [allRequests, setAllRequests] = useState([]);
  const [myRequests, setMyRequests]   = useState([]);

  // Form state
  const [step, setStep]               = useState(1);
  const [title, setTitle]             = useState("");
  const [category, setCategory]       = useState("");
  const [description, setDescription] = useState("");
  const [amountNeeded, setAmountNeeded] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation]       = useState("");
  const [medicalDoc, setMedicalDoc]   = useState(null);
  const [feeReceipt, setFeeReceipt]   = useState(null);
  const [submitted, setSubmitted]     = useState(false);
  const [errors, setErrors]           = useState({});
  const [submitting, setSubmitting]   = useState(false);

  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    axios.get("http://localhost:8080/api/help/all")
      .then(res => setAllRequests(res.data))
      .catch(console.error);
    if (userEmail) {
      axios.get(`http://localhost:8080/api/help/my/${userEmail}`)
        .then(res => setMyRequests(res.data))
        .catch(console.error);
    }
  }, [userEmail]);

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!title.trim())       e.title       = "Title is required";
      if (!category)           e.category    = "Please select a category";
      if (!description.trim()) e.description = "Description is required";
    }
    if (s === 2) {
      if (!amountNeeded || isNaN(amountNeeded) || Number(amountNeeded) <= 0)
        e.amountNeeded  = "Enter a valid amount";
      if (!contactNumber.trim()) e.contactNumber = "Contact number is required";
      if (!location.trim())      e.location      = "Location is required";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const e = validate(2);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("category", category);
    fd.append("description", description);
    fd.append("amountNeeded", amountNeeded);
    fd.append("contactNumber", contactNumber);
    fd.append("location", location);
    fd.append("createdBy", userEmail);
    if (medicalDoc)  fd.append("medicalDoc",  medicalDoc);
    if (feeReceipt)  fd.append("feeReceipt",  feeReceipt);
    try {
      await axios.post("http://localhost:8080/api/help/create", fd);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(false); setStep(1);
    setTitle(""); setCategory(""); setDescription("");
    setAmountNeeded(""); setContactNumber(""); setLocation("");
    setMedicalDoc(null); setFeeReceipt(null); setErrors({});
  };

  const inputStyle = (err) => ({
    width: "100%", padding: "10px 13px",
    borderRadius: 10, border: `1.5px solid ${err ? "#fca5a5" : "#e2e8f0"}`,
    fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    color: "#0f172a", background: err ? "#fff5f5" : "#fff",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s",
  });
  const labelStyle = {
    fontSize: 11, fontWeight: 800, color: "#64748b",
    letterSpacing: "0.08em", textTransform: "uppercase",
    display: "block", marginBottom: 6,
    fontFamily: "'DM Sans', sans-serif",
  };
  const errStyle = { fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 600 };

  const TABS = [
    { id: "create", label: "✦ Create Request",  count: null },
    { id: "all",    label: "🌐 All Requests",    count: allRequests.length },
    { id: "my",     label: "👤 My Requests",     count: myRequests.length  },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
        @keyframes confetti { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(8deg) scale(1.05)} 100%{transform:rotate(0deg) scale(1)} }
        .hrp-input:focus { border-color: #f97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.12) !important; }
        .hrp-textarea:focus { border-color: #f97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.12) !important; }
        .req-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:16px; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Page Header ── */}
        <div style={{
          background: "linear-gradient(135deg, #431407 0%, #9a3412 40%, #ea580c 80%, #f97316 100%)",
          borderRadius: 22, padding: "28px 30px 26px",
          marginBottom: 22, position: "relative", overflow: "hidden",
          animation: "fadeUp 0.4s ease both",
        }}>
          {/* Decorative circles */}
          {[[160,160,-50,-40,0.07],[90,90,null,-20,0.09,120],[55,55,18,null,0.06,190]].map(([w,h,top,bottom,op,right='-30'],i)=>(
            <div key={i} style={{
              position:"absolute", width:w, height:h, borderRadius:"50%",
              background:"rgba(255,255,255,0.12)",
              top:top??undefined, bottom:bottom??undefined, right,
              animation:`confetti ${3+i*0.8}s ease-in-out infinite`,
            }}/>
          ))}
          {/* Grid texture */}
          <div style={{
            position:"absolute", inset:0, opacity:0.04,
            backgroundImage:"radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize:"22px 22px",
          }}/>

          <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <p style={{ margin:"0 0 4px", fontSize:10, fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)", fontFamily:"'DM Sans', sans-serif" }}>
                ✦ Community Support
              </p>
              <h1 style={{ fontFamily:"'Instrument Serif', Georgia, serif", fontSize:30, fontWeight:400, fontStyle:"italic", color:"#fff", margin:"0 0 4px", letterSpacing:"-0.02em" }}>
                Help Requests
              </h1>
              <p style={{ margin:0, fontSize:13, color:"rgba(255,255,255,0.65)", fontFamily:"'DM Sans', sans-serif" }}>
                Submit a request or support someone in need
              </p>
            </div>

            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {[
                { icon:"🙏", label:"Total Requests", value: allRequests.length },
                { icon:"👤", label:"My Requests",    value: myRequests.length  },
              ].map((s,i) => (
                <div key={i} style={{
                  background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)",
                  border:"1px solid rgba(255,255,255,0.2)",
                  borderRadius:14, padding:"12px 18px",
                  animation:`fadeUp 0.4s ease ${0.1+i*0.08}s both`,
                }}>
                  <p style={{ margin:0, fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.6)", letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'DM Sans', sans-serif" }}>
                    {s.icon} {s.label}
                  </p>
                  <p style={{ margin:"4px 0 0", fontSize:26, fontWeight:700, color:"#fff", fontFamily:"'Instrument Serif', Georgia, serif", lineHeight:1 }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          background:"#fff", borderRadius:16, border:"1.5px solid #e2e8f0",
          padding:"5px", marginBottom:22,
          display:"flex", gap:4,
          boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
          animation:"fadeUp 0.4s ease 0.08s both",
        }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                flex:1, padding:"10px 8px", borderRadius:12, border:"none",
                background: activeTab === tab.id
                  ? "linear-gradient(135deg, #431407, #ea580c 60%, #f97316)"
                  : "transparent",
                fontSize:12, fontWeight:700,
                color: activeTab === tab.id ? "#fff" : "#64748b",
                cursor:"pointer", transition:"all 0.2s",
                fontFamily:"'DM Sans', sans-serif",
                display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                boxShadow: activeTab === tab.id ? "0 4px 14px rgba(234,88,12,0.35)" : "none",
              }}
              onMouseOver={e => { if(activeTab!==tab.id) e.currentTarget.style.background="#f8fafc"; }}
              onMouseOut={e => { if(activeTab!==tab.id) e.currentTarget.style.background="transparent"; }}
            >
              {tab.label}
              {tab.count !== null && (
                <span style={{
                  background: activeTab===tab.id ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                  color: activeTab===tab.id ? "#fff" : "#94a3b8",
                  fontSize:10, fontWeight:800,
                  padding:"1px 7px", borderRadius:99,
                }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── CREATE TAB ── */}
        {activeTab === "create" && (
          <div style={{ animation:"fadeUp 0.35s ease both" }}>
            {submitted ? (
              /* Success state */
              <div style={{
                background:"#fff", borderRadius:22, border:"1.5px solid #e2e8f0",
                padding:"60px 30px", textAlign:"center",
                boxShadow:"0 4px 24px rgba(0,0,0,0.06)",
                animation:"scaleIn 0.4s ease both",
              }}>
                <div style={{ fontSize:68, marginBottom:16, animation:"confetti 1s ease-in-out infinite" }}>🎉</div>
                <h2 style={{ fontFamily:"'Instrument Serif', Georgia, serif", fontSize:24, fontWeight:400, fontStyle:"italic", color:"#0f172a", margin:"0 0 8px" }}>
                  Request Submitted!
                </h2>
                <p style={{ fontSize:13, color:"#64748b", margin:"0 0 28px", fontFamily:"'DM Sans', sans-serif" }}>
                  Your help request has been received. We'll review it shortly.
                </p>
                <button onClick={reset} style={{
                  background:"linear-gradient(135deg,#ea580c,#f97316)",
                  color:"#fff", border:"none",
                  padding:"12px 32px", borderRadius:12,
                  fontSize:14, fontWeight:700, cursor:"pointer",
                  fontFamily:"'DM Sans', sans-serif",
                  boxShadow:"0 4px 18px rgba(234,88,12,0.35)",
                }}>+ Submit Another Request</button>
              </div>
            ) : (
              <div style={{
                background:"#fff", borderRadius:22,
                border:"1.5px solid #e2e8f0",
                overflow:"hidden",
                boxShadow:"0 4px 24px rgba(0,0,0,0.06)",
              }}>
                {/* Form header */}
                <div style={{
                  background:"linear-gradient(135deg,#fff7ed,#fff)",
                  padding:"22px 28px 18px",
                  borderBottom:"1.5px solid #f1f5f9",
                }}>
                  <p style={{ margin:"0 0 2px", fontSize:11, fontWeight:800, color:"#ea580c", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'DM Sans', sans-serif" }}>
                    Step {step} of 3
                  </p>
                  <h2 style={{ fontFamily:"'Instrument Serif', Georgia, serif", fontSize:20, fontWeight:400, fontStyle:"italic", color:"#0f172a", margin:0 }}>
                    {step===1 ? "Tell us about your need" : step===2 ? "Contact & financial details" : "Supporting documents"}
                  </h2>
                </div>

                <div style={{ padding:"24px 28px" }}>
                  <StepBar step={step} />

                  {/* ── STEP 1 ── */}
                  {step === 1 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                      <div>
                        <label style={labelStyle}>Request Title</label>
                        <input
                          className="hrp-input"
                          style={inputStyle(errors.title)}
                          placeholder="e.g. Need help for my father's surgery…"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                        />
                        {errors.title && <p style={errStyle}>⚠ {errors.title}</p>}
                      </div>

                      <div>
                        <label style={labelStyle}>Category</label>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
                          {CATEGORIES.map(c => (
                            <button key={c.id} onClick={() => setCategory(c.id)} style={{
                              border: `2px solid ${category===c.id ? c.color : "#e2e8f0"}`,
                              background: category===c.id ? c.bg : "#f8fafc",
                              borderRadius:12, padding:"12px 14px",
                              cursor:"pointer", textAlign:"left",
                              transition:"all 0.15s",
                              fontFamily:"'DM Sans', sans-serif",
                            }}>
                              <div style={{ fontSize:22, marginBottom:5 }}>{c.icon}</div>
                              <p style={{ margin:0, fontSize:12, fontWeight:800, color: category===c.id ? c.color : "#334155" }}>{c.label}</p>
                              <p style={{ margin:"2px 0 0", fontSize:10, color:"#94a3b8", fontWeight:500 }}>{c.desc}</p>
                            </button>
                          ))}
                        </div>
                        {errors.category && <p style={errStyle}>⚠ {errors.category}</p>}
                      </div>

                      <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                          className="hrp-textarea"
                          style={{ ...inputStyle(errors.description), resize:"vertical" }}
                          rows={4}
                          placeholder="Describe your situation in detail. Be specific about why you need help…"
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                        />
                        {errors.description && <p style={errStyle}>⚠ {errors.description}</p>}
                      </div>
                    </div>
                  )}

                  {/* ── STEP 2 ── */}
                  {step === 2 && (
                    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                      <div>
                        <label style={labelStyle}>Amount Needed (₹)</label>
                        <div style={{ position:"relative" }}>
                          <span style={{
                            position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
                            fontSize:15, fontWeight:800, color:"#94a3b8",
                          }}>₹</span>
                          <input
                            className="hrp-input"
                            type="number"
                            style={{ ...inputStyle(errors.amountNeeded), paddingLeft:28 }}
                            placeholder="0.00"
                            value={amountNeeded}
                            onChange={e => setAmountNeeded(e.target.value)}
                          />
                        </div>
                        {errors.amountNeeded && <p style={errStyle}>⚠ {errors.amountNeeded}</p>}
                      </div>

                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                        <div>
                          <label style={labelStyle}>Contact Number</label>
                          <input
                            className="hrp-input"
                            style={inputStyle(errors.contactNumber)}
                            placeholder="+91 XXXXX XXXXX"
                            value={contactNumber}
                            onChange={e => setContactNumber(e.target.value)}
                          />
                          {errors.contactNumber && <p style={errStyle}>⚠ {errors.contactNumber}</p>}
                        </div>
                        <div>
                          <label style={labelStyle}>Location</label>
                          <input
                            className="hrp-input"
                            style={inputStyle(errors.location)}
                            placeholder="City, State"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                          />
                          {errors.location && <p style={errStyle}>⚠ {errors.location}</p>}
                        </div>
                      </div>

                      {/* Amount preview card */}
                      {amountNeeded > 0 && (
                        <div style={{
                          background:"linear-gradient(135deg,#fff7ed,#fff)",
                          border:"1.5px solid #fed7aa",
                          borderRadius:14, padding:"16px 18px",
                          display:"flex", alignItems:"center", gap:14,
                        }}>
                          <div style={{ fontSize:32 }}>💰</div>
                          <div>
                            <p style={{ margin:0, fontSize:10, fontWeight:700, color:"#ea580c", letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'DM Sans', sans-serif" }}>
                              Requesting
                            </p>
                            <p style={{ margin:"2px 0 0", fontFamily:"'Instrument Serif', Georgia, serif", fontSize:26, fontWeight:400, color:"#0f172a" }}>
                              ₹{Number(amountNeeded).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── STEP 3 ── */}
                  {step === 3 && (
                    <div>
                      <p style={{ margin:"0 0 18px", fontSize:13, color:"#64748b", lineHeight:1.6, fontFamily:"'DM Sans', sans-serif" }}>
                        Upload supporting documents to strengthen your request. These are optional but help build trust.
                      </p>
                      <div style={{ display:"flex", gap:14 }}>
                        <FileBox
                          label="Medical Document" hint="PDF or image" icon="🏥"
                          file={medicalDoc}
                          onChange={e => setMedicalDoc(e.target.files[0])}
                          id="medfile"
                        />
                        <FileBox
                          label="Fee Receipt" hint="Invoice or bill" icon="🧾"
                          file={feeReceipt}
                          onChange={e => setFeeReceipt(e.target.files[0])}
                          id="receiptfile"
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div style={{ display:"flex", justifyContent: step > 1 ? "space-between" : "flex-end", marginTop:28 }}>
                    {step > 1 && (
                      <button onClick={() => setStep(s => s - 1)} style={{
                        padding:"10px 22px", borderRadius:11,
                        border:"1.5px solid #e2e8f0", background:"#f8fafc",
                        fontSize:13, fontWeight:700, color:"#475569",
                        cursor:"pointer", fontFamily:"'DM Sans', sans-serif",
                      }}>← Back</button>
                    )}
                    {step < 3 ? (
                      <button onClick={next} style={{
                        padding:"10px 28px", borderRadius:11,
                        background:"linear-gradient(135deg,#ea580c,#f97316)",
                        border:"none", color:"#fff",
                        fontSize:13, fontWeight:700, cursor:"pointer",
                        fontFamily:"'DM Sans', sans-serif",
                        boxShadow:"0 4px 14px rgba(234,88,12,0.3)",
                        transition:"all 0.2s",
                      }}
                        onMouseOver={e => e.currentTarget.style.transform="translateY(-1px)"}
                        onMouseOut={e => e.currentTarget.style.transform="translateY(0)"}
                      >Continue →</button>
                    ) : (
                      <button onClick={handleSubmit} disabled={submitting} style={{
                        padding:"10px 28px", borderRadius:11,
                        background: submitting ? "#fed7aa" : "linear-gradient(135deg,#ea580c,#f97316)",
                        border:"none", color:"#fff",
                        fontSize:13, fontWeight:700,
                        cursor: submitting ? "not-allowed" : "pointer",
                        fontFamily:"'DM Sans', sans-serif",
                        boxShadow:"0 4px 14px rgba(234,88,12,0.3)",
                      }}>
                        {submitting ? "Submitting…" : "🙏 Submit Request"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ALL REQUESTS TAB ── */}
        {activeTab === "all" && (
          <div style={{ animation:"fadeUp 0.35s ease both" }}>
            {allRequests.length === 0 ? (
              <div style={{ textAlign:"center", padding:"70px 20px", background:"#fff", borderRadius:18, border:"1.5px dashed #e2e8f0" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🙏</div>
                <p style={{ margin:0, fontFamily:"'Instrument Serif', Georgia, serif", fontSize:18, fontWeight:400, fontStyle:"italic", color:"#475569" }}>No requests yet</p>
              </div>
            ) : (
              <div className="req-grid">
                {allRequests.map(req => <RequestCard key={req.id} req={req} showStatus={false} />)}
              </div>
            )}
          </div>
        )}

        {/* ── MY REQUESTS TAB ── */}
        {activeTab === "my" && (
          <div style={{ animation:"fadeUp 0.35s ease both" }}>
            {myRequests.length === 0 ? (
              <div style={{ textAlign:"center", padding:"70px 20px", background:"#fff", borderRadius:18, border:"1.5px dashed #e2e8f0" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
                <p style={{ margin:0, fontFamily:"'Instrument Serif', Georgia, serif", fontSize:18, fontWeight:400, fontStyle:"italic", color:"#475569" }}>No requests submitted yet</p>
                <button onClick={() => setActiveTab("create")} style={{
                  marginTop:16, padding:"10px 24px", borderRadius:11,
                  background:"linear-gradient(135deg,#ea580c,#f97316)",
                  border:"none", color:"#fff",
                  fontSize:13, fontWeight:700, cursor:"pointer",
                  fontFamily:"'DM Sans', sans-serif",
                }}>Create a Request</button>
              </div>
            ) : (
              <div className="req-grid">
                {myRequests.map(req => <RequestCard key={req.id} req={req} showStatus={true} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}