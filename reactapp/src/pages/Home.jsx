// import React, { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
//
// function Home() {
//   const canvasRef = useRef(null);
//   const [count, setCount] = useState({ ngos: 0, volunteers: 0, impact: 0 });
//
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//
//     let mouse = { x: null, y: null };
//
//     window.addEventListener("mousemove", (e) => {
//       mouse.x = e.x;
//       mouse.y = e.y;
//     });
//
//     const nodes = Array.from({ length: 40 }, () => ({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height,
//       vx: (Math.random() - 0.5) * 0.5,
//       vy: (Math.random() - 0.5) * 0.5,
//       r: Math.random() * 3 + 1,
//     }));
//
//     let animId;
//
//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//       nodes.forEach((n) => {
//         n.x += n.vx;
//         n.y += n.vy;
//
//         if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
//         if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
//
//         const dx = mouse.x - n.x;
//         const dy = mouse.y - n.y;
//         const dist = Math.sqrt(dx * dx + dy * dy);
//
//         if (dist < 120) {
//           n.x -= dx * 0.002;
//           n.y -= dy * 0.002;
//         }
//       });
//
//       for (let i = 0; i < nodes.length; i++) {
//         for (let j = i + 1; j < nodes.length; j++) {
//           const dx = nodes[i].x - nodes[j].x;
//           const dy = nodes[i].y - nodes[j].y;
//           const dist = Math.sqrt(dx * dx + dy * dy);
//
//           if (dist < 140) {
//             ctx.beginPath();
//             ctx.moveTo(nodes[i].x, nodes[i].y);
//             ctx.lineTo(nodes[j].x, nodes[j].y);
//             ctx.strokeStyle = `rgba(134,239,172,${0.2 * (1 - dist / 140)})`;
//             ctx.stroke();
//           }
//         }
//       }
//
//       nodes.forEach((n) => {
//         ctx.beginPath();
//         ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
//         ctx.fillStyle = "rgba(134,239,172,0.6)";
//         ctx.fill();
//       });
//
//       animId = requestAnimationFrame(draw);
//     };
//
//     draw();
//
//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//
//     window.addEventListener("resize", resize);
//
//     return () => {
//       cancelAnimationFrame(animId);
//       window.removeEventListener("resize", resize);
//     };
//   }, []);
//
//   /* Animated counters */
//   useEffect(() => {
//     let ngo = 0;
//     let vol = 0;
//     let imp = 0;
//
//     const interval = setInterval(() => {
//       ngo += 15;
//       vol += 220;
//       imp += 1;
//
//       if (ngo >= 1200) ngo = 1200;
//       if (vol >= 18000) vol = 18000;
//       if (imp >= 94) imp = 94;
//
//       setCount({ ngos: ngo, volunteers: vol, impact: imp });
//
//       if (ngo === 1200 && vol === 18000 && imp === 94) {
//         clearInterval(interval);
//       }
//     }, 20);
//
//     return () => clearInterval(interval);
//   }, []);
//
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
//
//         :root {
//           --ink: #0d1f1a;
//           --cream: #f5f0e8;
//           --green: #1a6b4a;
//           --green-mid: #2d9469;
//           --green-light: #86efac;
//           --amber: #e8a020;
//         }
//
//         body {
//           margin: 0;
//         }
//
//         .cc-root {
//           font-family: 'DM Sans', sans-serif;
//           background: radial-gradient(circle at top, #0f2e27, #071410);
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           overflow: hidden;
//           position: relative;
//         }
//
//         .cc-canvas {
//           position: absolute;
//           inset: 0;
//           z-index: 0;
//         }
//
//         /* Glow effect */
//         .cc-glow {
//           position: absolute;
//           width: 600px;
//           height: 600px;
//           background: radial-gradient(circle, rgba(134,239,172,0.15), transparent);
//           filter: blur(80px);
//           animation: float 8s infinite ease-in-out;
//         }
//
//         @keyframes float {
//           0%,100% { transform: translateY(0px); }
//           50% { transform: translateY(-40px); }
//         }
//
//         .cc-content {
//           position: relative;
//           z-index: 2;
//           backdrop-filter: blur(12px);
//           background: rgba(0,0,0,0.35);
//           border: 1px solid rgba(255,255,255,0.08);
//           padding: 50px;
//           border-radius: 20px;
//           text-align: center;
//           animation: fadeUp 1s ease;
//         }
//
//         @keyframes fadeUp {
//           from {opacity:0; transform: translateY(40px);}
//           to {opacity:1; transform: translateY(0);}
//         }
//
//         .cc-title {
//           font-family: 'Playfair Display', serif;
//           font-size: clamp(3rem, 6vw, 5rem);
//           color: var(--cream);
//           margin-bottom: 10px;
//         }
//
//         .cc-title span {
//           color: var(--green-light);
//         }
//
//         .cc-sub {
//           color: rgba(255,255,255,0.6);
//           max-width: 450px;
//           margin: auto;
//           margin-bottom: 30px;
//           line-height: 1.6;
//         }
//
//         .cc-actions {
//           display: flex;
//           gap: 15px;
//           justify-content: center;
//           margin-bottom: 30px;
//         }
//
//         .cc-btn {
//           padding: 12px 28px;
//           border-radius: 8px;
//           text-decoration: none;
//           font-weight: 500;
//           transition: 0.3s;
//         }
//
//         .cc-btn-primary {
//           background: var(--green);
//           color: white;
//         }
//
//         .cc-btn-primary:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 10px 25px rgba(45,148,105,0.4);
//         }
//
//         .cc-btn-secondary {
//           border: 1px solid rgba(255,255,255,0.3);
//           color: white;
//         }
//
//         .cc-btn-secondary:hover {
//           background: rgba(255,255,255,0.08);
//         }
//
//         /* Stats */
//         .cc-stats {
//           display: flex;
//           gap: 40px;
//           justify-content: center;
//           margin-top: 20px;
//         }
//
//         .cc-stat-num {
//           font-size: 28px;
//           font-weight: bold;
//           color: white;
//         }
//
//         .cc-stat-label {
//           font-size: 12px;
//           color: rgba(255,255,255,0.5);
//           letter-spacing: 1px;
//         }
//
//         /* Scroll indicator */
//         .scroll-indicator {
//           position: absolute;
//           bottom: 25px;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 24px;
//           height: 40px;
//           border: 2px solid rgba(255,255,255,0.3);
//           border-radius: 20px;
//         }
//
//         .scroll-indicator::after {
//           content: "";
//           position: absolute;
//           top: 8px;
//           left: 50%;
//           width: 4px;
//           height: 6px;
//           background: white;
//           border-radius: 2px;
//           transform: translateX(-50%);
//           animation: scroll 2s infinite;
//         }
//
//         @keyframes scroll {
//           0% {opacity:0; transform: translate(-50%,0);}
//           50% {opacity:1;}
//           100% {opacity:0; transform: translate(-50%,12px);}
//         }
//       `}</style>
//
//       <div className="cc-root">
//         <canvas ref={canvasRef} className="cc-canvas" />
//         <div className="cc-glow" />
//
//         <div className="cc-content">
//           <h1 className="cc-title">
//             Community <span>Connect</span>
//           </h1>
//
//           <p className="cc-sub">
//             Connecting NGOs and volunteers to respond faster,
//             help communities, and make a real impact in emergencies.
//           </p>
//
//           <div className="cc-actions">
//             <Link to="/login" className="cc-btn cc-btn-primary">
//               Login
//             </Link>
//             <Link to="/register" className="cc-btn cc-btn-secondary">
//               Create Account
//             </Link>
//           </div>
//
//           <div className="cc-stats">
//             <div>
//               <div className="cc-stat-num">{count.ngos}+</div>
//               <div className="cc-stat-label">NGOs</div>
//             </div>
//             <div>
//               <div className="cc-stat-num">{count.volunteers}+</div>
//               <div className="cc-stat-label">Volunteers</div>
//             </div>
//             <div>
//               <div className="cc-stat-num">{count.impact}%</div>
//               <div className="cc-stat-label">Impact</div>
//             </div>
//           </div>
//         </div>
//
//         <div className="scroll-indicator" />
//       </div>
//     </>
//   );
// }
//
// export default Home;

import React, { useEffect, useRef, useState } from "react";

const NAV_LINKS = ["Features", "How It Works", "Impact", "Testimonials"];

const FEATURES = [
  { icon: "⚡", title: "Rapid Deployment", desc: "Match volunteers to active emergencies in under 60 seconds with our smart dispatch algorithm." },
  { icon: "🗺️", title: "Live Coordination Map", desc: "Real-time geo-tracking of all active volunteers and NGO response units in one unified view." },
  { icon: "🤝", title: "NGO Network", desc: "Tap into a verified network of 1,200+ NGOs across 40+ countries, ready to mobilize." },
  { icon: "📊", title: "Impact Analytics", desc: "Measure and report community impact with automated dashboards and exportable reports." },
  { icon: "🔔", title: "Smart Alerts", desc: "AI-powered push notifications route the right volunteers to the right events instantly." },
  { icon: "🔒", title: "Verified & Secure", desc: "Every volunteer and NGO is KYC-verified. Enterprise-grade encryption protects all data." },
];

const STEPS = [
  { num: "01", title: "Register Your Organization", desc: "NGOs and individual volunteers sign up in minutes with guided onboarding and instant verification." },
  { num: "02", title: "Post or Find a Mission", desc: "NGOs post emergency missions. Volunteers browse, filter, and apply with a single tap." },
  { num: "03", title: "Coordinate in Real Time", desc: "Use the live map, group chat, and resource tracker to execute missions seamlessly." },
  { num: "04", title: "Measure Your Impact", desc: "Automated impact reports showcase your contribution to donors, stakeholders, and communities." },
];

const TESTIMONIALS = [
  { quote: "Community Connect cut our volunteer mobilization time from 3 hours to under 20 minutes during the flood relief.", name: "Priya Nair", role: "Field Director, HelpBridge NGO", avatar: "PN" },
  { quote: "As a volunteer, the app makes it incredibly easy to find meaningful work close to home. I have joined 14 missions.", name: "Rajan Mehta", role: "Independent Volunteer", avatar: "RM" },
  { quote: "The impact analytics helped us secure significant new donor funding by showing real, measurable outcomes.", name: "Sarah Thomas", role: "CEO, CareForward Foundation", avatar: "ST" },
];

export default function Home() {
  const canvasRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [counters, setCounters] = useState({ ngos: 0, vol: 0, rate: 0, countries: 0 });
  const statsRef = useRef(null);
  const countedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let mouse = { x: null, y: null };
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    const nodes = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45, r: Math.random() * 2.5 + 1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        if (Math.hypot(dx, dy) < 120) { n.x -= dx * 0.002; n.y -= dy * 0.002; }
      });
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 140) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255,150,50,${0.18 * (1 - d / 140)})`; ctx.lineWidth = 1; ctx.stroke();
          }
        }
      nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,140,40,0.5)"; ctx.fill(); });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !countedRef.current) {
        countedRef.current = true;
        let f = 0;
        const iv = setInterval(() => {
          f += 1;
          setCounters({ ngos: Math.min(Math.round(f * 12), 1200), vol: Math.min(Math.round(f * 180), 18000), rate: Math.min(Math.round(f * 0.94), 94), countries: Math.min(Math.round(f * 0.4), 40) });
          if (f >= 100) clearInterval(iv);
        }, 18);
      }
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --orange: #e8620a; --orange-dark: #c04d06; --orange-mid: #f07830; --orange-light: #ffb870;
          --orange-pale: #fff3e8; --orange-subtle: #fde8d4; --bg-dark: #130800; --bg-hero: #1e0d00;
          --white: #ffffff; --cream: #fff8f2; --ink: #1a0900; --text-body: #4a2e1a;
          --text-muted: #9a7060; --border: rgba(232,98,10,0.15);
        }
        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: 'Manrope', sans-serif; background: var(--cream); color: var(--ink); }

        /* NAV */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 6vw; height: 68px; transition: background 0.3s, box-shadow 0.3s; }
        .nav.scrolled { background: rgba(255,255,255,0.93); backdrop-filter: blur(16px); box-shadow: 0 2px 20px rgba(232,98,10,0.1); border-bottom: 1px solid var(--border); }
        .nav-logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: var(--white); text-decoration: none; letter-spacing: -0.3px; display: flex; align-items: center; gap: 8px; }
        .nav.scrolled .nav-logo { color: var(--ink); }
        .nav-logo-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--orange-mid); flex-shrink: 0; }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75); text-decoration: none; transition: color 0.2s; cursor: pointer; }
        .nav.scrolled .nav-links a { color: var(--text-muted); }
        .nav-links a:hover { color: var(--orange-mid) !important; }
        .nav-cta { padding: 9px 22px; border-radius: 8px; background: var(--orange); color: white; font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 600; text-decoration: none; transition: all 0.25s; box-shadow: 0 4px 14px rgba(232,98,10,0.3); }
        .nav-cta:hover { background: var(--orange-dark); transform: translateY(-2px); }
        .nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
        .nav-hamburger span { width: 24px; height: 2px; background: white; border-radius: 2px; transition: 0.3s; display: block; }
        .nav.scrolled .nav-hamburger span { background: var(--ink); }

        /* HERO */
        .hero { position: relative; min-height: 100vh; background: radial-gradient(ellipse at 25% 0%, #3d1800 0%, #1e0d00 45%, #0d0500 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 100px 6vw 80px; }
        .hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
        .hero-glow-1 { position: absolute; top: -100px; left: -80px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(232,98,10,0.2), transparent 65%); filter: blur(60px); animation: floatA 10s ease-in-out infinite; }
        .hero-glow-2 { position: absolute; bottom: -60px; right: -40px; width: 420px; height: 420px; background: radial-gradient(circle, rgba(255,184,112,0.15), transparent 65%); filter: blur(70px); animation: floatB 13s ease-in-out infinite; }
        @keyframes floatA { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-40px) scale(1.08)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(30px)} }
        .hero-inner { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; max-width: 1180px; width: 100%; }
        .hero-left { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-right { animation: fadeUp 0.9s 0.2s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        .hero-badge { display: inline-flex; align-items: center; gap: 7px; background: rgba(232,98,10,0.15); border: 1px solid rgba(232,98,10,0.3); color: var(--orange-light); font-size: 11px; font-weight: 600; letter-spacing: 1.8px; text-transform: uppercase; padding: 5px 14px 5px 10px; border-radius: 100px; margin-bottom: 22px; }
        .badge-pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--orange-mid); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.65)} }
        .hero-title { font-family: 'Syne', sans-serif; font-size: clamp(2.8rem, 5.5vw, 5rem); font-weight: 800; color: white; line-height: 1.05; letter-spacing: -1px; margin-bottom: 22px; }
        .hero-title .accent { background: linear-gradient(120deg, var(--orange-mid), var(--orange-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-desc { color: rgba(255,220,180,0.65); font-size: 16px; font-weight: 300; line-height: 1.75; max-width: 460px; margin-bottom: 36px; }
        .hero-actions { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; margin-bottom: 44px; }
        .btn-primary { padding: 14px 32px; border-radius: 10px; background: linear-gradient(135deg, var(--orange), var(--orange-dark)); color: white; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 6px 24px rgba(232,98,10,0.4); display: inline-block; }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(232,98,10,0.55); }
        .btn-ghost { padding: 14px 28px; border-radius: 10px; border: 1px solid rgba(255,184,112,0.25); color: var(--orange-light); font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 500; text-decoration: none; transition: all 0.25s; display: inline-flex; align-items: center; gap: 7px; }
        .btn-ghost:hover { background: rgba(255,140,40,0.1); border-color: rgba(255,184,112,0.5); transform: translateY(-2px); }
        .btn-arrow { transition: transform 0.25s; }
        .btn-ghost:hover .btn-arrow { transform: translateX(5px); }
        .hero-trust { display: flex; align-items: center; gap: 12px; color: rgba(255,220,180,0.45); font-size: 12px; letter-spacing: 0.5px; }
        .trust-avatars { display: flex; }
        .trust-avatar { width: 30px; height: 30px; border-radius: 50%; border: 2px solid rgba(255,140,40,0.4); background: linear-gradient(135deg, var(--orange-dark), var(--orange-mid)); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; margin-left: -8px; }
        .trust-avatar:first-child { margin-left: 0; }

        /* HERO CARD */
        .hero-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,184,112,0.15); border-radius: 20px; padding: 28px; position: relative; overflow: hidden; }
        .hero-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,184,112,0.4), transparent); }
        .hc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .hc-title { font-family: 'Syne', sans-serif; color: white; font-size: 15px; font-weight: 700; }
        .hc-live { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--orange-light); font-weight: 600; }
        .hc-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; animation: pulse 1.5s infinite; }
        .hc-missions { display: flex; flex-direction: column; gap: 10px; }
        .hc-mission { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,184,112,0.1); border-radius: 12px; padding: 12px 14px; transition: background 0.2s; }
        .hc-mission:hover { background: rgba(255,255,255,0.07); }
        .hc-icon { font-size: 20px; flex-shrink: 0; }
        .hc-info { flex: 1; min-width: 0; }
        .hc-name { color: white; font-size: 13px; font-weight: 600; margin-bottom: 2px; }
        .hc-loc { color: rgba(255,220,180,0.45); font-size: 11px; }
        .hc-badge-tag { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 100px; letter-spacing: 0.5px; flex-shrink: 0; }
        .urgent { background: rgba(239,68,68,0.2); color: #fca5a5; }
        .active { background: rgba(74,222,128,0.15); color: #86efac; }
        .open { background: rgba(232,98,10,0.2); color: var(--orange-light); }
        .hc-footer { margin-top: 18px; display: flex; align-items: center; justify-content: space-between; }
        .hc-vol-count { color: rgba(255,220,180,0.5); font-size: 12px; }
        .hc-vol-count strong { color: var(--orange-light); }
        .hc-join { padding: 8px 18px; border-radius: 8px; background: var(--orange); color: white; font-size: 12px; font-weight: 700; cursor: pointer; border: none; transition: 0.2s; }
        .hc-join:hover { background: var(--orange-dark); }

        /* STATS */
        .stats-band { background: var(--ink); padding: 56px 6vw; display: flex; justify-content: center; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; max-width: 960px; width: 100%; }
        .stat-item { text-align: center; padding: 24px; border-right: 1px solid rgba(255,184,112,0.1); }
        .stat-item:last-child { border-right: none; }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800; background: linear-gradient(135deg, var(--orange-mid), var(--orange-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; margin-bottom: 8px; }
        .stat-label { color: rgba(255,184,112,0.5); font-size: 12px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; }

        /* SECTIONS */
        .section { padding: 100px 6vw; }
        .section-white { background: var(--white); }
        .section-pale { background: var(--orange-pale); }
        .section-dark { background: var(--bg-dark); }
        .section-header { text-align: center; margin-bottom: 64px; }
        .section-eyebrow { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--orange); margin-bottom: 14px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,3rem); font-weight: 800; color: var(--ink); line-height: 1.1; letter-spacing: -0.5px; }
        .section-title.light { color: white; }
        .section-sub { color: var(--text-muted); font-size: 16px; font-weight: 300; line-height: 1.7; max-width: 520px; margin: 14px auto 0; }
        .section-sub.light { color: rgba(255,220,180,0.55); }

        /* FEATURES */
        .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; max-width: 1100px; margin: 0 auto; }
        .feat-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 32px 28px; transition: all 0.3s; position: relative; overflow: hidden; }
        .feat-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--orange), var(--orange-light)); transform: scaleX(0); transform-origin: left; transition: transform 0.3s; }
        .feat-card:hover { box-shadow: 0 12px 40px rgba(232,98,10,0.12); transform: translateY(-4px); border-color: rgba(232,98,10,0.3); }
        .feat-card:hover::after { transform: scaleX(1); }
        .feat-icon { width: 52px; height: 52px; border-radius: 14px; background: var(--orange-subtle); display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 18px; }
        .feat-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
        .feat-desc { color: var(--text-muted); font-size: 14px; line-height: 1.7; }

        /* HOW IT WORKS */
        .steps-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 30px; max-width: 1100px; margin: 0 auto; position: relative; }
        .steps-grid::before { content: ''; position: absolute; top: 36px; left: 12.5%; right: 12.5%; height: 1px; background: linear-gradient(90deg, transparent, rgba(232,98,10,0.25) 20%, rgba(232,98,10,0.25) 80%, transparent); }
        .step-card { text-align: center; }
        .step-num-wrap { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, var(--orange), var(--orange-dark)); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; position: relative; z-index: 1; box-shadow: 0 8px 24px rgba(232,98,10,0.35); }
        .step-num { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: white; }
        .step-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
        .step-desc { color: var(--text-muted); font-size: 13.5px; line-height: 1.7; }

        /* TESTIMONIALS */
        .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; max-width: 1100px; margin: 0 auto; }
        .testi-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,184,112,0.15); border-radius: 18px; padding: 32px 28px; transition: transform 0.3s; }
        .testi-card:hover { transform: translateY(-5px); border-color: rgba(255,184,112,0.3); }
        .testi-quote-icon { font-size: 36px; color: var(--orange-mid); margin-bottom: 14px; line-height: 1; }
        .testi-text { color: rgba(255,220,180,0.75); font-size: 14.5px; line-height: 1.75; font-weight: 300; margin-bottom: 24px; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-av { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--orange-dark), var(--orange-mid)); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; flex-shrink: 0; }
        .testi-name { font-weight: 700; color: white; font-size: 14px; }
        .testi-role { color: rgba(255,184,112,0.45); font-size: 12px; margin-top: 2px; }

        /* CTA */
        .cta-band { background: linear-gradient(135deg, var(--orange-dark) 0%, var(--orange) 50%, var(--orange-mid) 100%); padding: 80px 6vw; text-align: center; }
        .cta-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,3.2rem); font-weight: 800; color: white; margin-bottom: 16px; letter-spacing: -0.5px; }
        .cta-sub { color: rgba(255,255,255,0.75); font-size: 16px; font-weight: 300; margin-bottom: 36px; }
        .cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .btn-white { padding: 14px 32px; border-radius: 10px; background: white; color: var(--orange-dark); font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.25s; box-shadow: 0 6px 20px rgba(0,0,0,0.15); display: inline-block; }
        .btn-white:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.25); }
        .btn-outline-white { padding: 14px 32px; border-radius: 10px; border: 2px solid rgba(255,255,255,0.5); color: white; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.25s; display: inline-block; }
        .btn-outline-white:hover { background: rgba(255,255,255,0.15); border-color: white; transform: translateY(-2px); }

        /* FOOTER */
        .footer { background: #0d0500; padding: 60px 6vw 32px; border-top: 1px solid rgba(255,184,112,0.1); }
        .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
        .footer-brand-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: white; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .footer-brand-desc { color: rgba(255,184,112,0.4); font-size: 13.5px; line-height: 1.7; max-width: 260px; }
        .footer-col-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--orange-light); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a { color: rgba(255,184,112,0.4); font-size: 13.5px; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--orange-light); }
        .footer-bottom { border-top: 1px solid rgba(255,184,112,0.08); padding-top: 24px; display: flex; align-items: center; justify-content: space-between; }
        .footer-copy { color: rgba(255,184,112,0.3); font-size: 12.5px; }
        .footer-socials { display: flex; gap: 12px; }
        .social-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid rgba(255,184,112,0.15); display: flex; align-items: center; justify-content: center; color: rgba(255,184,112,0.4); font-size: 14px; text-decoration: none; transition: all 0.2s; }
        .social-btn:hover { border-color: var(--orange-mid); color: var(--orange-light); background: rgba(232,98,10,0.1); }

        /* MOBILE MENU */
        .mobile-menu { position: fixed; inset: 0; z-index: 99; background: rgba(19,8,0,0.97); backdrop-filter: blur(20px); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 32px; transform: translateY(-100%); transition: transform 0.4s cubic-bezier(0.77,0,0.175,1); }
        .mobile-menu.open { transform: translateY(0); }
        .mobile-menu a { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: white; text-decoration: none; cursor: pointer; transition: color 0.2s; }
        .mobile-menu a:hover { color: var(--orange-mid); }

        /* SCROLL INDICATOR */
        .scroll-ind { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); width: 22px; height: 38px; border: 2px solid rgba(255,184,112,0.25); border-radius: 20px; z-index: 2; }
        .scroll-ind::after { content: ''; position: absolute; top: 7px; left: 50%; width: 4px; height: 6px; background: var(--orange-light); border-radius: 2px; transform: translateX(-50%); animation: scrollDot 2s infinite; }
        @keyframes scrollDot { 0%{opacity:0;transform:translate(-50%,0)} 40%{opacity:1} 100%{opacity:0;transform:translate(-50%,13px)} }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .features-grid { grid-template-columns: repeat(2,1fr); }
          .steps-grid { grid-template-columns: repeat(2,1fr); }
          .steps-grid::before { display: none; }
          .testi-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr 1fr; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .stat-item { border-right: none; border-bottom: 1px solid rgba(255,184,112,0.1); }
          .stat-item:nth-child(2n) { border-right: none; }
        }
        @media (max-width: 600px) {
          .nav-links, .nav-cta { display: none; }
          .nav-hamburger { display: flex; }
          .features-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button onClick={() => setMenuOpen(false)} style={{position:"absolute",top:24,right:24,background:"none",border:"none",color:"white",fontSize:28,cursor:"pointer"}}>✕</button>
        {NAV_LINKS.map(l => <a key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g,"-"))}>{l}</a>)}
        <a href="/login" style={{color:"var(--orange-mid)"}}>Login →</a>
      </div>

      {/* Navbar */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="nav-logo"><span className="nav-logo-dot" /> Community Connect</a>
        <ul className="nav-links">
          {NAV_LINKS.map(l => <li key={l}><a onClick={() => scrollTo(l.toLowerCase().replace(/ /g,"-"))}>{l}</a></li>)}
        </ul>
        <a href="/login" className="nav-cta">Get Started</a>
        <button className="nav-hamburger" onClick={() => setMenuOpen(true)}><span /><span /><span /></button>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-glow-1" /><div className="hero-glow-2" />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge"><span className="badge-pulse" /> Emergency Response Platform</div>
            <h1 className="hero-title">Unite. <span className="accent">Respond.</span><br />Change Lives.</h1>
            <p className="hero-desc">Connecting NGOs and volunteers to respond faster, help communities, and make a measurable impact in every emergency — from local floods to global crises.</p>
            <div className="hero-actions">
              <a href="/register" className="btn-primary">Join the Network</a>
              <a href="#how-it-works" className="btn-ghost" onClick={e=>{e.preventDefault();scrollTo("how-it-works")}}>
                See How It Works <span className="btn-arrow">→</span>
              </a>
            </div>
            <div className="hero-trust">
              <div className="trust-avatars">
                {["P","R","S","A","M"].map((l,i) => <div key={i} className="trust-avatar">{l}</div>)}
              </div>
              <span>Trusted by <strong style={{color:"var(--orange-light)"}}>18,000+</strong> volunteers globally</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-card">
              <div className="hc-header">
                <div className="hc-title">🚨 Live Missions</div>
                <div className="hc-live"><span className="hc-live-dot" /> 14 Active</div>
              </div>
              <div className="hc-missions">
                {[
                  {icon:"🌊",name:"Flood Relief — Kerala",loc:"Thrissur District",tag:"URGENT",cls:"urgent"},
                  {icon:"🏥",name:"Medical Camp Drive",loc:"Chennai, Tamil Nadu",tag:"ACTIVE",cls:"active"},
                  {icon:"🏗️",name:"Shelter Rebuild",loc:"Wayanad, Kerala",tag:"OPEN",cls:"open"},
                ].map((m,i) => (
                  <div key={i} className="hc-mission">
                    <div className="hc-icon">{m.icon}</div>
                    <div className="hc-info"><div className="hc-name">{m.name}</div><div className="hc-loc">📍 {m.loc}</div></div>
                    <span className={`hc-badge-tag ${m.cls}`}>{m.tag}</span>
                  </div>
                ))}
              </div>
              <div className="hc-footer">
                <div className="hc-vol-count"><strong>342</strong> volunteers deployed today</div>
                <button className="hc-join">Join →</button>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-ind" />
      </section>

      {/* STATS */}
      <div ref={statsRef} id="impact">
        <div className="stats-band">
          <div className="stats-grid">
            {[
              {val:`${counters.ngos.toLocaleString()}+`,label:"Verified NGOs"},
              {val:`${counters.vol.toLocaleString()}+`,label:"Active Volunteers"},
              {val:`${counters.rate}%`,label:"Mission Success Rate"},
              {val:`${counters.countries}+`,label:"Countries Covered"},
            ].map((s,i) => (
              <div key={i} className="stat-item">
                <div className="stat-num">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section section-white" id="features">
        <div className="section-header">
          <span className="section-eyebrow">Platform Features</span>
          <h2 className="section-title">Everything your mission needs</h2>
          <p className="section-sub">Purpose-built tools for NGOs and volunteers to coordinate effectively at any scale.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f,i) => (
            <div key={i} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-pale" id="how-it-works">
        <div className="section-header">
          <span className="section-eyebrow">How It Works</span>
          <h2 className="section-title">From sign-up to impact in 4 steps</h2>
          <p className="section-sub">Simple, fast, and designed for the field — no lengthy onboarding required.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s,i) => (
            <div key={i} className="step-card">
              <div className="step-num-wrap"><div className="step-num">{s.num}</div></div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-dark" id="testimonials">
        <div className="section-header">
          <span className="section-eyebrow" style={{color:"var(--orange-light)"}}>Testimonials</span>
          <h2 className="section-title light">Voices from the field</h2>
          <p className="section-sub light">Real stories from the people making a difference every day.</p>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t,i) => (
            <div key={i} className="testi-card">
              <div className="testi-quote-icon">"</div>
              <p className="testi-text">{t.quote}</p>
              <div className="testi-author">
                <div className="testi-av">{t.avatar}</div>
                <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <h2 className="cta-title">Ready to make a difference?</h2>
        <p className="cta-sub">Join thousands of NGOs and volunteers already coordinating on Community Connect.</p>
        <div className="cta-actions">
          <a href="/register" className="btn-white">Create Free Account</a>
          <a href="/login" className="btn-outline-white">Login to Dashboard</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">
              <span style={{width:8,height:8,borderRadius:"50%",background:"var(--orange-mid)",display:"inline-block",flexShrink:0}} />
              Community Connect
            </div>
            <p className="footer-brand-desc">Bridging the gap between NGOs and volunteers to create faster, smarter emergency response worldwide.</p>
          </div>
          {[
            {title:"Platform",links:["Features","How It Works","Security","Pricing"]},
            {title:"Organization",links:["About Us","Blog","Careers","Press"]},
            {title:"Support",links:["Help Center","Contact","Privacy Policy","Terms"]},
          ].map((col,i) => (
            <div key={i}>
              <div className="footer-col-title">{col.title}</div>
              <ul className="footer-links">{col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 Community Connect. All rights reserved.</span>
          <div className="footer-socials">
            {["𝕏","in","f","▶"].map((s,i) => <a key={i} href="#" className="social-btn">{s}</a>)}
          </div>
        </div>
      </footer>
    </>
  );
}