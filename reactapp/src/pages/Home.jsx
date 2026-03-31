import React, { useEffect, useRef, useState, useCallback } from "react";

const BASE = "http://localhost:8080";

const NAV_LINKS = ["Features", "How It Works", "Impact", "Testimonials"];

const FEATURES = [
  { icon: "⚡", title: "Rapid Deployment", desc: "Match volunteers to active emergencies in under 60 seconds with our smart dispatch algorithm." },
  { icon: "🗺️", title: "Live Coordination Map", desc: "Real-time geo-tracking of all active volunteers and NGO response units in one unified view." },
  { icon: "🤝", title: "NGO Network", desc: "Tap into a verified network of NGOs across countries, ready to mobilize at any moment." },
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

const CATEGORY_ICONS = {
  flood: "🌊", medical: "🏥", shelter: "🏗️", food: "🍱", education: "📚",
  fire: "🔥", earthquake: "⛑️", drought: "💧", default: "🚨"
};

function getCategoryIcon(category = "", title = "") {
  const text = (category + " " + title).toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (text.includes(key)) return icon;
  }
  return CATEGORY_ICONS.default;
}

function getStatusClass(event) {
  const now = new Date();
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime);
  if (now >= start && now <= end) return { label: "LIVE", cls: "s-active" };
  if (now < start) return { label: "UPCOMING", cls: "s-open" };
  return { label: "ENDED", cls: "s-ended" };
}

export default function Home() {
  const canvasRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [counters, setCounters] = useState({ ngos: 0, vol: 0, events: 0, helpReqs: 0 });
  const statsRef = useRef(null);
  const countedRef = useRef(false);

  // API data
  const [liveEvents, setLiveEvents] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);

  // Fetch all public data
  useEffect(() => {
    const fetchAll = async () => {
      setApiLoading(true);
      try {
        const [eventsRes, ngosRes, helpRes] = await Promise.allSettled([
          fetch(`${BASE}/api/events/all`),
          fetch(`${BASE}/api/ngos/list`),
          fetch(`${BASE}/api/help/open`),
        ]);

        if (eventsRes.status === "fulfilled" && eventsRes.value.ok) {
          const data = await eventsRes.value.json();
          setLiveEvents(data.slice(0, 4));
        }
        if (ngosRes.status === "fulfilled" && ngosRes.value.ok) {
          const data = await ngosRes.value.json();
          setNgos(data);
        }
        if (helpRes.status === "fulfilled" && helpRes.value.ok) {
          const data = await helpRes.value.json();
          setHelpRequests(data.slice(0, 3));
        }
      } catch (e) {
        console.error("API fetch error:", e);
      } finally {
        setApiLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Animated canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    let tick = 0;
    const draw = () => {
      tick += 0.004;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const lineCount = 12;
      for (let i = 0; i <= lineCount; i++) {
        const y = (canvas.height / lineCount) * i;
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin(tick + i * 0.5) * 18);
        for (let x = 0; x <= canvas.width; x += 4) {
          ctx.lineTo(x, y + Math.sin(tick + i * 0.5 + x * 0.01) * 14);
        }
        ctx.strokeStyle = `rgba(200, 80, 10, ${0.07 + Math.sin(tick + i) * 0.025})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      const vCount = 8;
      for (let i = 0; i <= vCount; i++) {
        const x = (canvas.width / vCount) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = `rgba(200, 80, 10, 0.05)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
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

  // Counter animation driven by real API data
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !countedRef.current) {
        countedRef.current = true;
        const targets = {
          ngos: ngos.length || 12,
          vol: liveEvents.reduce((a, ev) => a + (ev.noOfVol || 0), 0) || 480,
          events: liveEvents.length || 8,
          helpReqs: helpRequests.length || 5,
        };
        let f = 0;
        const iv = setInterval(() => {
          f += 1;
          const pct = Math.min(f / 80, 1);
          setCounters({
            ngos: Math.round(targets.ngos * pct),
            vol: Math.round(targets.vol * pct),
            events: Math.round(targets.events * pct),
            helpReqs: Math.round(targets.helpReqs * pct),
          });
          if (f >= 80) clearInterval(iv);
        }, 20);
      }
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [ngos, liveEvents, helpRequests]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange: #D95F0A;
          --orange-bright: #F06B0F;
          --orange-deep: #B34D07;
          --orange-10: rgba(217,95,10,0.1);
          --orange-15: rgba(217,95,10,0.15);
          --orange-6: rgba(217,95,10,0.06);
          --white: #FFFFFF;
          --off-white: #FAFAF8;
          --paper: #F5F3EF;
          --ink: #111009;
          --ink-70: rgba(17,16,9,0.7);
          --ink-45: rgba(17,16,9,0.45);
          --ink-20: rgba(17,16,9,0.2);
          --ink-10: rgba(17,16,9,0.1);
          --ink-6: rgba(17,16,9,0.06);
          --rule: rgba(17,16,9,0.09);
          --hero-bg: #FFF8F2;
        }

        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: 'DM Sans', sans-serif; background: var(--off-white); color: var(--ink); -webkit-font-smoothing: antialiased; }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5vw; height: 64px;
          transition: background 0.4s, border-color 0.4s, box-shadow 0.4s;
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled {
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom-color: var(--rule);
          box-shadow: 0 1px 0 var(--rule);
        }
        .nav-logo {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          color: var(--ink); text-decoration: none;
          display: flex; align-items: center; gap: 9px; letter-spacing: -0.2px;
        }
        .nav-logo-mark {
          width: 28px; height: 28px; border-radius: 7px;
          background: var(--orange);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .nav-logo-mark svg { width: 14px; height: 14px; fill: white; }
        .nav-links { display: flex; gap: 32px; list-style: none; }
        .nav-links a {
          font-size: 13.5px; font-weight: 500; color: var(--ink-45);
          text-decoration: none; transition: color 0.2s; cursor: pointer; letter-spacing: 0.1px;
        }
        .nav-links a:hover { color: var(--orange) !important; }
        .nav-cta {
          padding: 8px 20px; border-radius: 7px; background: var(--orange); color: white;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          text-decoration: none; transition: background 0.2s, transform 0.2s; letter-spacing: 0.1px;
        }
        .nav-cta:hover { background: var(--orange-deep); transform: translateY(-1px); }
        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; background: none; border: none; padding: 4px;
        }
        .nav-hamburger span { width: 22px; height: 1.5px; background: var(--ink); display: block; transition: 0.3s; }

        /* ── HERO ── */
        .hero {
          position: relative; min-height: 100vh;
          background: var(--hero-bg);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; padding: 100px 5vw 80px;
          border-bottom: 1px solid var(--rule);
        }
        .hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.6; }
        .hero-geo-1 {
          position: absolute; top: 0; right: 0;
          width: 45vw; height: 100%;
          background: linear-gradient(135deg, transparent 0%, rgba(217,95,10,0.05) 100%);
          border-left: 1px solid rgba(217,95,10,0.12);
          clip-path: polygon(8% 0, 100% 0, 100% 100%, 0% 100%);
        }
        .hero-dot-grid {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(217,95,10,0.15) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent);
        }
        .hero-inner {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr 420px;
          gap: 80px; align-items: center;
          max-width: 1160px; width: 100%;
        }
        .hero-left { animation: riseIn 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-right { animation: riseIn 0.8s 0.15s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes riseIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .hero-label { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 28px; }
        .hero-label-line { width: 24px; height: 1px; background: var(--orange); }
        .hero-label-text {
          font-family: 'DM Mono', monospace; font-size: 10.5px;
          letter-spacing: 2px; text-transform: uppercase; color: var(--orange); font-weight: 500;
        }
        .hero-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(3rem, 5.5vw, 5.2rem); color: var(--ink);
          line-height: 1.06; letter-spacing: -1.5px; margin-bottom: 24px; font-weight: 400;
        }
        .hero-title em { font-style: italic; color: var(--orange-bright); }
        .hero-desc {
          color: var(--ink-45); font-size: 15.5px; font-weight: 300;
          line-height: 1.8; max-width: 440px; margin-bottom: 40px; letter-spacing: 0.1px;
        }
        .hero-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 52px; }
        .btn-primary {
          padding: 13px 28px; border-radius: 8px; background: var(--orange);
          color: white; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          text-decoration: none; transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover { background: var(--orange-deep); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(217,95,10,0.35); }
        .btn-ghost {
          padding: 12px 24px; border-radius: 8px; border: 1px solid var(--rule);
          color: var(--ink-45); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400;
          text-decoration: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-ghost:hover { border-color: var(--orange); color: var(--orange); }
        .btn-arrow { display: inline-block; transition: transform 0.2s; }
        .btn-ghost:hover .btn-arrow { transform: translateX(4px); }

        .hero-trust { display: flex; align-items: center; gap: 14px; }
        .trust-avatars { display: flex; }
        .trust-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          border: 1.5px solid var(--off-white);
          background: linear-gradient(135deg, var(--orange-deep), var(--orange-bright));
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 600; color: white; margin-left: -6px;
        }
        .trust-avatar:first-child { margin-left: 0; }
        .trust-text { color: var(--ink-45); font-size: 12px; letter-spacing: 0.2px; }
        .trust-text strong { color: var(--ink); font-weight: 600; }

        /* ── HERO CARD (Live Events) ── */
        .hero-card {
          background: var(--white); border: 1px solid var(--rule); border-radius: 14px;
          overflow: hidden; box-shadow: 0 4px 40px rgba(17,16,9,0.08), 0 1px 4px rgba(17,16,9,0.06);
        }
        .hc-topbar {
          background: var(--off-white); border-bottom: 1px solid var(--rule);
          padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;
        }
        .hc-dots { display: flex; gap: 6px; }
        .hc-dot { width: 8px; height: 8px; border-radius: 50%; }
        .hc-title { font-size: 12px; font-weight: 500; color: var(--ink-45); font-family: 'DM Mono', monospace; }
        .hc-live { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-45); font-family: 'DM Mono', monospace; }
        .hc-live-dot { width: 5px; height: 5px; border-radius: 50%; background: #16a34a; animation: blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hc-body { padding: 20px; }
        .hc-section-label { font-size: 10px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink-20); margin-bottom: 12px; font-family: 'DM Mono', monospace; }
        .hc-missions { display: flex; flex-direction: column; gap: 8px; }
        .hc-mission {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 9px; border: 1px solid var(--rule);
          transition: border-color 0.2s, background 0.2s; cursor: default;
        }
        .hc-mission:hover { border-color: rgba(217,95,10,0.2); background: var(--orange-6); }
        .hc-icon-wrap {
          width: 34px; height: 34px; border-radius: 8px; background: var(--paper);
          display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
        }
        .hc-info { flex: 1; min-width: 0; }
        .hc-name { color: var(--ink); font-size: 12.5px; font-weight: 500; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hc-loc { color: var(--ink-45); font-size: 11px; }
        .hc-status {
          font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 4px;
          letter-spacing: 0.8px; text-transform: uppercase; flex-shrink: 0; font-family: 'DM Mono', monospace;
        }
        .s-urgent { background: rgba(239,68,68,0.08); color: #dc2626; }
        .s-active { background: rgba(22,163,74,0.08); color: #16a34a; }
        .s-open { background: rgba(217,95,10,0.1); color: var(--orange); }
        .s-ended { background: rgba(17,16,9,0.05); color: var(--ink-45); }
        .hc-divider { height: 1px; background: var(--rule); margin: 16px 0; }
        .hc-footer { display: flex; align-items: center; justify-content: space-between; }
        .hc-stat-num { font-family: 'Instrument Serif', serif; font-size: 22px; color: var(--ink); line-height: 1; }
        .hc-stat-label { font-size: 10.5px; color: var(--ink-45); margin-top: 2px; font-family: 'DM Mono', monospace; }
        .hc-join-btn {
          padding: 9px 18px; border-radius: 7px; background: var(--orange); color: white;
          font-size: 12.5px; font-weight: 600; cursor: pointer; border: none;
          transition: background 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .hc-join-btn:hover { background: var(--orange-deep); }

        /* Skeleton */
        .skeleton { background: linear-gradient(90deg, var(--paper) 25%, var(--off-white) 50%, var(--paper) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── STATS ── */
        .stats-band { background: white; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 0 5vw; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); max-width: 1100px; margin: 0 auto; }
        .stat-item { padding: 48px 32px; border-right: 1px solid var(--rule); position: relative; }
        .stat-item:last-child { border-right: none; }
        .stat-num { font-family: 'Instrument Serif', Georgia, serif; font-size: 48px; font-weight: 400; color: var(--ink); line-height: 1; margin-bottom: 8px; letter-spacing: -1px; }
        .stat-num span { color: var(--orange); }
        .stat-label { color: var(--ink-45); font-size: 13px; font-weight: 400; }
        .stat-accent { position: absolute; bottom: 0; left: 32px; width: 24px; height: 2px; background: var(--orange); }

        /* ── SECTIONS ── */
        .section { padding: 96px 5vw; }
        .section-white { background: var(--white); }
        .section-off { background: var(--off-white); }
        .section-paper { background: var(--paper); }
        .section-ink { background: var(--ink); }

        .section-header { max-width: 1100px; margin: 0 auto 64px; }
        .section-header.center { text-align: center; }
        .section-header.center .section-sub { margin: 14px auto 0; }

        .section-eyebrow { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 18px; }
        .eyebrow-line { width: 20px; height: 1px; background: var(--orange); }
        .eyebrow-text { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--orange); font-weight: 500; }
        .section-title { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(2rem, 3.5vw, 3.2rem); color: var(--ink); line-height: 1.1; letter-spacing: -0.8px; font-weight: 400; }
        .section-title.light { color: white; }
        .section-title em { font-style: italic; color: var(--orange); }
        .section-sub { color: var(--ink-45); font-size: 15px; font-weight: 300; line-height: 1.75; max-width: 500px; margin-top: 14px; }
        .section-sub.light { color: rgba(255,255,255,0.4); }

        /* ── FEATURES ── */
        .features-wrap { max-width: 1100px; margin: 0 auto; }
        .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; border: 1px solid var(--rule); border-radius: 12px; overflow: hidden; background: var(--rule); }
        .feat-card { background: white; padding: 36px 32px; transition: background 0.25s; }
        .feat-card:hover { background: var(--off-white); }
        .feat-icon-wrap { width: 40px; height: 40px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 20px; border-radius: 10px; background: var(--orange-6); border: 1px solid var(--orange-10); }
        .feat-title { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 10px; }
        .feat-desc { color: var(--ink-45); font-size: 13.5px; line-height: 1.7; font-weight: 300; }
        .feat-link { display: inline-flex; align-items: center; gap: 5px; margin-top: 16px; font-size: 12.5px; font-weight: 500; color: var(--orange); text-decoration: none; transition: gap 0.2s; }
        .feat-link:hover { gap: 8px; }

        /* ── STEPS ── */
        .steps-wrap { max-width: 1100px; margin: 0 auto; }
        .steps-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 40px; }
        .step-card { position: relative; }
        .step-connector { position: absolute; top: 20px; left: calc(100% - 20px); width: calc(100% - 40px); height: 1px; background: repeating-linear-gradient(90deg, var(--orange) 0, var(--orange) 4px, transparent 4px, transparent 10px); z-index: 0; }
        .step-card:last-child .step-connector { display: none; }
        .step-num-wrap { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--orange); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; position: relative; z-index: 1; background: white; }
        .step-num { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500; color: var(--orange); }
        .step-title { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 10px; }
        .step-desc { color: var(--ink-45); font-size: 13.5px; line-height: 1.7; font-weight: 300; }

        /* ── LIVE EVENTS SECTION ── */
        .events-wrap { max-width: 1100px; margin: 0 auto; }
        .events-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
        .event-card {
          background: white; border: 1px solid var(--rule); border-radius: 12px;
          padding: 24px; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          display: flex; flex-direction: column; gap: 12px;
        }
        .event-card:hover { border-color: rgba(217,95,10,0.25); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(17,16,9,0.06); }
        .event-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .event-icon-title { display: flex; align-items: center; gap: 10px; }
        .event-icon { width: 38px; height: 38px; border-radius: 9px; background: var(--paper); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .event-title-text { font-size: 14px; font-weight: 600; color: var(--ink); line-height: 1.3; }
        .event-meta { display: flex; gap: 16px; flex-wrap: wrap; }
        .event-meta-item { font-size: 12px; color: var(--ink-45); display: flex; align-items: center; gap: 4px; }
        .event-desc { font-size: 13px; color: var(--ink-45); line-height: 1.6; font-weight: 300; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .event-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
        .event-vol-badge { font-size: 11px; color: var(--orange); font-family: 'DM Mono', monospace; background: var(--orange-6); padding: 3px 9px; border-radius: 4px; }
        .event-cta { font-size: 12px; font-weight: 600; color: var(--orange); text-decoration: none; display: flex; align-items: center; gap: 4px; }
        .event-cta:hover { gap: 7px; }

        /* ── HELP REQUESTS ── */
        .help-wrap { max-width: 1100px; margin: 0 auto; }
        .help-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .help-card {
          background: white; border: 1px solid var(--rule); border-radius: 12px;
          padding: 24px; display: flex; flex-direction: column; gap: 10px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .help-card:hover { border-color: rgba(217,95,10,0.25); transform: translateY(-2px); }
        .help-card-cat { font-size: 10px; font-family: 'DM Mono', monospace; letter-spacing: 1.5px; text-transform: uppercase; color: var(--orange); }
        .help-card-title { font-size: 14.5px; font-weight: 600; color: var(--ink); line-height: 1.3; }
        .help-card-desc { font-size: 13px; color: var(--ink-45); line-height: 1.6; font-weight: 300; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .help-card-amount { font-family: 'Instrument Serif', serif; font-size: 22px; color: var(--ink); }
        .help-card-amount small { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--ink-45); font-weight: 300; }
        .help-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; padding-top: 12px; border-top: 1px solid var(--rule); }
        .help-card-loc { font-size: 11.5px; color: var(--ink-45); }
        .help-donate-btn {
          padding: 7px 16px; border-radius: 6px; background: var(--orange); color: white;
          font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .help-donate-btn:hover { background: var(--orange-deep); }

        /* ── NGO SECTION ── */
        .ngos-wrap { max-width: 1100px; margin: 0 auto; }
        .ngos-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .ngo-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 24px;
          display: flex; flex-direction: column; gap: 10px;
          transition: border-color 0.25s, transform 0.25s;
        }
        .ngo-card:hover { border-color: rgba(217,95,10,0.3); transform: translateY(-2px); }
        .ngo-card-top { display: flex; align-items: center; gap: 12px; }
        .ngo-avatar {
          width: 42px; height: 42px; border-radius: 10px;
          background: var(--orange-deep);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: white; flex-shrink: 0;
          letter-spacing: -0.5px;
        }
        .ngo-name { font-size: 14px; font-weight: 600; color: white; line-height: 1.3; }
        .ngo-status { font-size: 10px; font-family: 'DM Mono', monospace; letter-spacing: 1px; }
        .ngo-status.verified { color: #4ade80; }
        .ngo-status.pending { color: rgba(255,255,255,0.3); }
        .ngo-cat { font-size: 11.5px; color: rgba(255,255,255,0.35); }
        .ngo-location { font-size: 11.5px; color: rgba(255,255,255,0.3); display: flex; align-items: center; gap: 4px; }

        /* ── TESTIMONIALS ── */
        .testi-wrap { max-width: 1100px; margin: 0 auto; }
        .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        .testi-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 36px 30px;
          transition: border-color 0.25s, transform 0.25s;
        }
        .testi-card:hover { border-color: rgba(217,95,10,0.3); transform: translateY(-3px); }
        .testi-mark { font-family: 'Instrument Serif', serif; font-size: 48px; line-height: 1; color: var(--orange); margin-bottom: 16px; display: block; opacity: 0.8; }
        .testi-text { color: rgba(255,255,255,0.55); font-size: 14px; line-height: 1.8; font-weight: 300; margin-bottom: 28px; font-style: italic; }
        .testi-rule { height: 1px; background: rgba(255,255,255,0.07); margin-bottom: 20px; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-av { width: 38px; height: 38px; border-radius: 50%; background: var(--orange-deep); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: white; flex-shrink: 0; }
        .testi-name { font-size: 13.5px; font-weight: 600; color: white; }
        .testi-role { font-size: 11.5px; color: rgba(255,255,255,0.3); margin-top: 2px; font-family: 'DM Mono', monospace; }

        /* ── CTA ── */
        .cta-band { background: var(--off-white); border-top: 1px solid var(--rule); padding: 80px 5vw; text-align: center; }
        .cta-inner { max-width: 600px; margin: 0 auto; }
        .cta-title { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(2rem, 3.5vw, 3rem); color: var(--ink); margin-bottom: 16px; letter-spacing: -0.8px; line-height: 1.1; font-weight: 400; }
        .cta-title em { font-style: italic; color: var(--orange); }
        .cta-sub { color: var(--ink-45); font-size: 15px; font-weight: 300; line-height: 1.75; margin-bottom: 36px; }
        .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-cta-primary { padding: 13px 28px; border-radius: 8px; background: var(--orange); color: white; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; transition: background 0.2s, transform 0.2s, box-shadow 0.2s; }
        .btn-cta-primary:hover { background: var(--orange-deep); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(217,95,10,0.35); }
        .btn-cta-secondary { padding: 12px 24px; border-radius: 8px; border: 1px solid var(--rule); color: var(--ink-70); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
        .btn-cta-secondary:hover { border-color: var(--orange); color: var(--orange); }

        /* ── FOOTER ── */
        .footer { background: var(--ink); padding: 64px 5vw 32px; }
        .footer-top { display: grid; grid-template-columns: 2.2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 56px; max-width: 1100px; margin-left: auto; margin-right: auto; padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .footer-brand-logo { display: flex; align-items: center; gap: 9px; margin-bottom: 14px; }
        .footer-brand-name { font-size: 14px; font-weight: 600; color: white; }
        .footer-brand-desc { color: rgba(255,255,255,0.28); font-size: 13px; line-height: 1.75; max-width: 240px; font-weight: 300; }
        .footer-col-title { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.25); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 18px; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 11px; }
        .footer-links a { color: rgba(255,255,255,0.4); font-size: 13px; text-decoration: none; transition: color 0.2s; font-weight: 300; }
        .footer-links a:hover { color: rgba(255,255,255,0.8); }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; max-width: 1100px; margin: 0 auto; }
        .footer-copy { color: rgba(255,255,255,0.2); font-size: 12px; font-family: 'DM Mono', monospace; }
        .footer-socials { display: flex; gap: 8px; }
        .social-btn { width: 32px; height: 32px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3); font-size: 13px; text-decoration: none; transition: all 0.2s; }
        .social-btn:hover { border-color: var(--orange); color: var(--orange); }

        /* ── MOBILE MENU ── */
        .mobile-menu {
          position: fixed; inset: 0; z-index: 99;
          background: rgba(255,248,242,0.98); backdrop-filter: blur(24px);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px;
          transform: translateY(-100%); transition: transform 0.4s cubic-bezier(0.77,0,0.175,1);
        }
        .mobile-menu.open { transform: translateY(0); }
        .mobile-menu a { font-family: 'Instrument Serif', serif; font-size: 32px; font-weight: 400; color: var(--ink); text-decoration: none; cursor: pointer; transition: color 0.2s; }
        .mobile-menu a:hover { color: var(--orange); }

        /* ── SCROLL HINT ── */
        .scroll-hint { position: absolute; bottom: 36px; left: 5vw; z-index: 2; display: flex; align-items: center; gap: 10px; color: var(--ink-20); font-size: 11px; font-family: 'DM Mono', monospace; letter-spacing: 1px; text-transform: uppercase; animation: fadeIn 2s 1s both; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .scroll-track { width: 1px; height: 40px; background: var(--ink-10); position: relative; overflow: hidden; }
        .scroll-thumb { width: 1px; height: 14px; background: var(--orange); animation: scrollDown 2s ease-in-out infinite; }
        @keyframes scrollDown { 0%{transform:translateY(-14px)} 100%{transform:translateY(40px)} }

        /* ── EMPTY STATE ── */
        .empty-state { text-align: center; padding: 48px 20px; color: var(--ink-45); font-size: 14px; }
        .empty-icon { font-size: 36px; margin-bottom: 12px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .features-grid { grid-template-columns: repeat(2,1fr); }
          .steps-grid { grid-template-columns: repeat(2,1fr); }
          .step-connector { display: none; }
          .testi-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr 1fr; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .events-grid { grid-template-columns: 1fr; }
          .help-grid { grid-template-columns: 1fr; }
          .ngos-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 600px) {
          .nav-links, .nav-cta { display: none; }
          .nav-hamburger { display: flex; }
          .features-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr; gap: 36px; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .ngos-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button onClick={() => setMenuOpen(false)} style={{position:"absolute",top:24,right:24,background:"none",border:"none",color:"var(--ink-45)",fontSize:24,cursor:"pointer"}}>✕</button>
        {NAV_LINKS.map(l => <a key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g,"-"))}>{l}</a>)}
        <a href="/login" style={{color:"var(--orange)",fontSize:"14px",fontFamily:"DM Sans",fontWeight:600}}>Login →</a>
      </div>

      {/* Navbar */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="7" r="2.5"/>
              <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.93 2.93l1.41 1.41M9.66 9.66l1.41 1.41M9.66 4.34l1.41-1.41M2.93 11.07l1.41-1.41" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          Community Connect
        </a>
        <ul className="nav-links">
          {NAV_LINKS.map(l => <li key={l}><a onClick={() => scrollTo(l.toLowerCase().replace(/ /g,"-"))}>{l}</a></li>)}
        </ul>
        <a href="/register" className="nav-cta">Get Started</a>
        <button className="nav-hamburger" onClick={() => setMenuOpen(true)}><span /><span /><span /></button>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-dot-grid" />
        <div className="hero-geo-1" />

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-label">
              <div className="hero-label-line" />
              <span className="hero-label-text">Emergency Response Platform</span>
            </div>
            <h1 className="hero-title">Unite. <em>Respond.</em><br />Change Lives.</h1>
            <p className="hero-desc">
              Connecting NGOs and volunteers to respond faster, help communities, and make a measurable impact — from local floods to global crises.
            </p>
            <div className="hero-actions">
              <a href="/register" className="btn-primary">Join the Network</a>
              <a href="#how-it-works" className="btn-ghost" onClick={e=>{e.preventDefault();scrollTo("how-it-works")}}>
                How It Works <span className="btn-arrow">→</span>
              </a>
            </div>
            <div className="hero-trust">
              <div className="trust-avatars">
                {["P","R","S","A","M"].map((l,i) => <div key={i} className="trust-avatar">{l}</div>)}
              </div>
              <span className="trust-text">Trusted by <strong>{ngos.length > 0 ? `${ngos.length}+` : "1,200+"}</strong> NGOs &amp; volunteers globally</span>
            </div>
          </div>

          {/* LIVE EVENTS CARD */}
          <div className="hero-right">
            <div className="hero-card">
              <div className="hc-topbar">
                <div className="hc-dots">
                  <div className="hc-dot" style={{background:"rgba(17,16,9,0.12)"}} />
                  <div className="hc-dot" style={{background:"rgba(17,16,9,0.08)"}} />
                  <div className="hc-dot" style={{background:"rgba(17,16,9,0.05)"}} />
                </div>
                <div className="hc-title">mission.dashboard</div>
                <div className="hc-live">
                  <span className="hc-live-dot" />
                  {apiLoading ? "loading..." : `${liveEvents.length} active`}
                </div>
              </div>
              <div className="hc-body">
                <div className="hc-section-label">Live Missions</div>
                <div className="hc-missions">
                  {apiLoading ? (
                    [1,2,3].map(i => (
                      <div key={i} style={{height:58,borderRadius:9}} className="skeleton" />
                    ))
                  ) : liveEvents.length > 0 ? (
                    liveEvents.slice(0,3).map((ev, i) => {
                      const status = getStatusClass(ev);
                      return (
                        <div key={i} className="hc-mission">
                          <div className="hc-icon-wrap">{getCategoryIcon(ev.category, ev.title)}</div>
                          <div className="hc-info">
                            <div className="hc-name">{ev.title}</div>
                            <div className="hc-loc">📍 {ev.city}{ev.state ? `, ${ev.state}` : ""}</div>
                          </div>
                          <span className={`hc-status ${status.cls}`}>{status.label}</span>
                        </div>
                      );
                    })
                  ) : (
                    [
                      {icon:"🌊",name:"Flood Relief — Kerala",loc:"Thrissur District",tag:"URGENT",cls:"s-urgent"},
                      {icon:"🏥",name:"Medical Camp Drive",loc:"Chennai, Tamil Nadu",tag:"ACTIVE",cls:"s-active"},
                      {icon:"🏗️",name:"Shelter Rebuild",loc:"Wayanad, Kerala",tag:"OPEN",cls:"s-open"},
                    ].map((m,i) => (
                      <div key={i} className="hc-mission">
                        <div className="hc-icon-wrap">{m.icon}</div>
                        <div className="hc-info">
                          <div className="hc-name">{m.name}</div>
                          <div className="hc-loc">📍 {m.loc}</div>
                        </div>
                        <span className={`hc-status ${m.cls}`}>{m.tag}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="hc-divider" />
                <div className="hc-footer">
                  <div>
                    <div className="hc-stat-num">
                      {liveEvents.reduce((a, ev) => a + (ev.noOfVol || 0), 0) || "342"}
                    </div>
                    <div className="hc-stat-label">volunteers needed</div>
                  </div>
                  <button className="hc-join-btn" onClick={() => window.location.href="/events"}>
                    View Events →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-track"><div className="scroll-thumb" /></div>
          Scroll
        </div>
      </section>

      {/* STATS — driven by real API counts */}
      <div ref={statsRef} id="impact">
        <div className="stats-band">
          <div className="stats-grid">
            {[
              { val: counters.ngos, suffix: "+", label: "Verified NGOs" },
              { val: counters.vol, suffix: "+", label: "Volunteer Slots Open" },
              { val: counters.events, suffix: "", label: "Active Events" },
              { val: counters.helpReqs, suffix: "", label: "Open Help Requests" },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-num">{s.val.toLocaleString()}<span>{s.suffix}</span></div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-accent" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section section-off" id="features">
        <div className="features-wrap">
          <div className="section-header">
            <div className="section-eyebrow">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Platform Features</span>
            </div>
            <h2 className="section-title">Everything your <em>mission</em> needs</h2>
            <p className="section-sub">Purpose-built tools for NGOs and volunteers to coordinate effectively at any scale.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-icon-wrap">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
                <a href="#" className="feat-link">Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-white" id="how-it-works">
        <div className="steps-wrap">
          <div className="section-header center">
            <div className="section-eyebrow" style={{justifyContent:"center"}}>
              <div className="eyebrow-line" />
              <span className="eyebrow-text">How It Works</span>
              <div className="eyebrow-line" />
            </div>
            <h2 className="section-title">From sign-up to <em>impact</em> in 4 steps</h2>
            <p className="section-sub">Simple, fast, and designed for the field — no lengthy onboarding required.</p>
          </div>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div key={i} className="step-card">
                {i < STEPS.length - 1 && <div className="step-connector" />}
                <div className="step-num-wrap"><div className="step-num">{s.num}</div></div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE EVENTS FROM API */}
      <section className="section section-off" id="impact">
        <div className="events-wrap">
          <div className="section-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:40}}>
            <div>
              <div className="section-eyebrow">
                <div className="eyebrow-line" />
                <span className="eyebrow-text">Live Events</span>
              </div>
              <h2 className="section-title">Active <em>missions</em> near you</h2>
            </div>
            <a href="/events" style={{fontSize:13,fontWeight:600,color:"var(--orange)",textDecoration:"none",whiteSpace:"nowrap"}}>View all events →</a>
          </div>

          {apiLoading ? (
            <div className="events-grid">
              {[1,2,3,4].map(i => <div key={i} style={{height:160,borderRadius:12}} className="skeleton" />)}
            </div>
          ) : liveEvents.length > 0 ? (
            <div className="events-grid">
              {liveEvents.map((ev, i) => {
                const status = getStatusClass(ev);
                return (
                  <div key={i} className="event-card">
                    <div className="event-card-top">
                      <div className="event-icon-title">
                        <div className="event-icon">{getCategoryIcon(ev.category, ev.title)}</div>
                        <div className="event-title-text">{ev.title}</div>
                      </div>
                      <span className={`hc-status ${status.cls}`}>{status.label}</span>
                    </div>
                    <div className="event-meta">
                      <span className="event-meta-item">📍 {ev.city}{ev.state ? `, ${ev.state}` : ""}</span>
                      <span className="event-meta-item">🏷️ {ev.category || "General"}</span>
                    </div>
                    {ev.description && <div className="event-desc">{ev.description}</div>}
                    <div className="event-footer">
                      <span className="event-vol-badge">👥 {ev.noOfVol || "?"} volunteers needed</span>
                      <a href={`/events/${ev.id}`} className="event-cta">Join <span className="btn-arrow">→</span></a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div>No events posted yet. Be the first to create a mission!</div>
              <a href="/events/create" className="btn-primary" style={{display:"inline-block",marginTop:16}}>Create Event</a>
            </div>
          )}
        </div>
      </section>

      {/* HELP REQUESTS FROM API */}
      {!apiLoading && helpRequests.length > 0 && (
        <section className="section section-white">
          <div className="help-wrap">
            <div className="section-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:40}}>
              <div>
                <div className="section-eyebrow">
                  <div className="eyebrow-line" />
                  <span className="eyebrow-text">Help Requests</span>
                </div>
                <h2 className="section-title">People who need <em>your help</em></h2>
              </div>
              <a href="/help" style={{fontSize:13,fontWeight:600,color:"var(--orange)",textDecoration:"none",whiteSpace:"nowrap"}}>View all requests →</a>
            </div>
            <div className="help-grid">
              {helpRequests.map((req, i) => (
                <div key={i} className="help-card">
                  <div className="help-card-cat">{req.category || "General"}</div>
                  <div className="help-card-title">{req.title}</div>
                  {req.description && <div className="help-card-desc">{req.description}</div>}
                  {req.amountNeeded && (
                    <div className="help-card-amount">
                      ₹{Number(req.amountNeeded).toLocaleString("en-IN")} <small>needed</small>
                    </div>
                  )}
                  <div className="help-card-footer">
                    <span className="help-card-loc">📍 {req.location || "India"}</span>
                    <button className="help-donate-btn" onClick={() => window.location.href=`/help/${req.id}`}>Donate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NGO NETWORK FROM API */}
      <section className="section section-ink" id="testimonials">
        <div className="ngos-wrap">
          <div className="section-header center">
            <div className="section-eyebrow" style={{justifyContent:"center"}}>
              <div className="eyebrow-line" />
              <span className="eyebrow-text" style={{color:"var(--orange)"}}>NGO Network</span>
              <div className="eyebrow-line" />
            </div>
            <h2 className="section-title light">Our verified <em>partner</em> NGOs</h2>
            <p className="section-sub light">A growing network of verified organizations making a difference every day.</p>
          </div>

          {apiLoading ? (
            <div className="ngos-grid">
              {[1,2,3].map(i => <div key={i} style={{height:100,borderRadius:12,background:"rgba(255,255,255,0.05)"}} className="skeleton" />)}
            </div>
          ) : ngos.length > 0 ? (
            <div className="ngos-grid" style={{marginBottom:48}}>
              {ngos.slice(0,6).map((ngo, i) => (
                <div key={i} className="ngo-card">
                  <div className="ngo-card-top">
                    <div className="ngo-avatar">
                      {(ngo.organizationName || ngo.name || "N").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="ngo-name">{ngo.organizationName || ngo.name}</div>
                      <div className={`ngo-status ${ngo.verificationStatus === "VERIFIED" ? "verified" : "pending"}`}>
                        {ngo.verificationStatus === "VERIFIED" ? "✓ Verified" : "⏳ Pending"}
                      </div>
                    </div>
                  </div>
                  {ngo.category && <div className="ngo-cat">🏷️ {ngo.category}</div>}
                  {(ngo.city || ngo.state) && (
                    <div className="ngo-location">📍 {[ngo.city, ngo.state].filter(Boolean).join(", ")}</div>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          {/* Testimonials always shown */}
          <div className="section-header center" style={{marginTop: ngos.length > 0 ? 64 : 0, marginBottom:40}}>
            <div className="section-eyebrow" style={{justifyContent:"center"}}>
              <div className="eyebrow-line" />
              <span className="eyebrow-text" style={{color:"var(--orange)"}}>Testimonials</span>
              <div className="eyebrow-line" />
            </div>
            <h2 className="section-title light">Voices from the <em>field</em></h2>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card">
                <span className="testi-mark">"</span>
                <p className="testi-text">{t.quote}</p>
                <div className="testi-rule" />
                <div className="testi-author">
                  <div className="testi-av">{t.avatar}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="cta-inner">
          <div className="cta-eyebrow section-eyebrow" style={{justifyContent:"center"}}>
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Get Started</span>
            <div className="eyebrow-line" />
          </div>
          <h2 className="cta-title">Ready to make a <em>difference?</em></h2>
          <p className="cta-sub">Join NGOs and volunteers already coordinating on Community Connect to respond faster and save more lives.</p>
          <div className="cta-actions">
            <a href="/register" className="btn-cta-primary">Create Free Account</a>
            <a href="/login" className="btn-cta-secondary">Login to Dashboard</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand-logo">
              <div className="nav-logo-mark">
                <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="7" r="2.5"/>
                  <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="footer-brand-name">Community Connect</span>
            </div>
            <p className="footer-brand-desc">Bridging the gap between NGOs and volunteers to create faster, smarter emergency response worldwide.</p>
          </div>
          {[
            { title:"Platform", links:["Events","Help Requests","NGO Network","Volunteer"] },
            { title:"Organization", links:["About Us","Blog","Careers","Press"] },
            { title:"Support", links:["Help Center","Contact","Privacy Policy","Terms"] },
          ].map((col, i) => (
            <div key={i}>
              <div className="footer-col-title">{col.title}</div>
              <ul className="footer-links">{col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 Community Connect. All rights reserved.</span>
          <div className="footer-socials">
            {["𝕏","in","f","▶"].map((s, i) => <a key={i} href="#" className="social-btn">{s}</a>)}
          </div>
        </div>
      </footer>
    </>
  );
}