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
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    // Subtle grid lines animated
    let tick = 0;
    const draw = () => {
      tick += 0.004;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Horizontal lines
      const lineCount = 12;
      for (let i = 0; i <= lineCount; i++) {
        const y = (canvas.height / lineCount) * i;
        const wave = Math.sin(tick + i * 0.5) * 18;
        ctx.beginPath();
        ctx.moveTo(0, y + wave);
        for (let x = 0; x <= canvas.width; x += 4) {
          ctx.lineTo(x, y + Math.sin(tick + i * 0.5 + x * 0.01) * 14);
        }
        ctx.strokeStyle = `rgba(200, 80, 10, ${0.07 + Math.sin(tick + i) * 0.025})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Vertical lines
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
          --hero-surface: #FFFFFF;
        }

        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: 'DM Sans', sans-serif; background: var(--off-white); color: var(--ink); -webkit-font-smoothing: antialiased; }

        /* ── NAV ───────────────────────────────────── */
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
          display: flex; align-items: center; gap: 9px;
          letter-spacing: -0.2px;
        }
        .nav.scrolled .nav-logo { color: var(--ink); }
        .nav-logo-mark {
          width: 28px; height: 28px; border-radius: 7px;
          background: var(--orange);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .nav-logo-mark svg { width: 14px; height: 14px; fill: white; }
        .nav-links { display: flex; gap: 32px; list-style: none; }
        .nav-links a {
          font-size: 13.5px; font-weight: 500;
          color: var(--ink-45);
          text-decoration: none; transition: color 0.2s; cursor: pointer;
          letter-spacing: 0.1px;
        }
        .nav.scrolled .nav-links a { color: var(--ink-45); }
        .nav-links a:hover { color: var(--orange) !important; }
        .nav-cta {
          padding: 8px 20px; border-radius: 7px;
          background: var(--orange); color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
          letter-spacing: 0.1px;
        }
        .nav-cta:hover { background: var(--orange-deep); transform: translateY(-1px); }
        .nav-hamburger {
          display: none; flex-direction: column; gap: 5px;
          cursor: pointer; background: none; border: none; padding: 4px;
        }
        .nav-hamburger span { width: 22px; height: 1.5px; background: var(--ink); display: block; transition: 0.3s; }
        .nav.scrolled .nav-hamburger span { background: var(--ink); }

        /* ── HERO ──────────────────────────────────── */
        .hero {
          position: relative; min-height: 100vh;
          background: var(--hero-bg);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; padding: 100px 5vw 80px;
          border-bottom: 1px solid var(--rule);
        }
        .hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.6; }

        /* Geometric accent shapes */
        .hero-geo-1 {
          position: absolute; top: 0; right: 0;
          width: 45vw; height: 100%;
          background: linear-gradient(135deg, transparent 0%, rgba(217,95,10,0.05) 100%);
          border-left: 1px solid rgba(217,95,10,0.12);
          clip-path: polygon(8% 0, 100% 0, 100% 100%, 0% 100%);
        }
        .hero-geo-2 {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(217,95,10,0.25) 30%, rgba(217,95,10,0.25) 70%, transparent);
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

        .hero-label {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 28px;
        }
        .hero-label-line { width: 24px; height: 1px; background: var(--orange); }
        .hero-label-text {
          font-family: 'DM Mono', monospace;
          font-size: 10.5px; letter-spacing: 2px;
          text-transform: uppercase; color: var(--orange);
          font-weight: 500;
        }

        .hero-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(3rem, 5.5vw, 5.2rem);
          color: var(--ink);
          line-height: 1.06;
          letter-spacing: -1.5px;
          margin-bottom: 24px;
          font-weight: 400;
        }
        .hero-title em {
          font-style: italic;
          color: var(--orange-bright);
        }

        .hero-desc {
          color: var(--ink-45);
          font-size: 15.5px;
          font-weight: 300;
          line-height: 1.8;
          max-width: 440px;
          margin-bottom: 40px;
          letter-spacing: 0.1px;
        }

        .hero-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 52px; }
        .btn-primary {
          padding: 13px 28px; border-radius: 8px;
          background: var(--orange);
          color: white; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.1px;
        }
        .btn-primary:hover {
          background: var(--orange-deep);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(217,95,10,0.35);
        }
        .btn-ghost {
          padding: 12px 24px; border-radius: 8px;
          border: 1px solid var(--rule);
          color: var(--ink-45);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 8px;
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

        /* ── HERO CARD ─────────────────────────────── */
        .hero-card {
          background: var(--white);
          border: 1px solid var(--rule);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 40px rgba(17,16,9,0.08), 0 1px 4px rgba(17,16,9,0.06);
        }
        .hc-topbar {
          background: var(--off-white);
          border-bottom: 1px solid var(--rule);
          padding: 14px 20px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .hc-dots { display: flex; gap: 6px; }
        .hc-dot { width: 8px; height: 8px; border-radius: 50%; }
        .hc-title { font-size: 12px; font-weight: 500; color: var(--ink-45); font-family: 'DM Mono', monospace; letter-spacing: 0.5px; }
        .hc-live { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-45); font-family: 'DM Mono', monospace; }
        .hc-live-dot { width: 5px; height: 5px; border-radius: 50%; background: #16a34a; animation: blink 2s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hc-body { padding: 20px; }
        .hc-section-label {
          font-size: 10px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--ink-20); margin-bottom: 12px; font-family: 'DM Mono', monospace;
        }
        .hc-missions { display: flex; flex-direction: column; gap: 8px; }
        .hc-mission {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 9px;
          border: 1px solid var(--rule);
          transition: border-color 0.2s, background 0.2s;
          cursor: default;
        }
        .hc-mission:hover { border-color: rgba(217,95,10,0.2); background: var(--orange-6); }
        .hc-icon-wrap {
          width: 34px; height: 34px; border-radius: 8px;
          background: var(--paper);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .hc-info { flex: 1; min-width: 0; }
        .hc-name { color: var(--ink); font-size: 12.5px; font-weight: 500; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hc-loc { color: var(--ink-45); font-size: 11px; }
        .hc-status {
          font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 4px;
          letter-spacing: 0.8px; text-transform: uppercase; flex-shrink: 0;
          font-family: 'DM Mono', monospace;
        }
        .s-urgent { background: rgba(239,68,68,0.08); color: #dc2626; }
        .s-active { background: rgba(22,163,74,0.08); color: #16a34a; }
        .s-open { background: rgba(217,95,10,0.1); color: var(--orange); }
        .hc-divider { height: 1px; background: var(--rule); margin: 16px 0; }
        .hc-footer { display: flex; align-items: center; justify-content: space-between; }
        .hc-stat { }
        .hc-stat-num { font-family: 'Instrument Serif', serif; font-size: 22px; color: var(--ink); line-height: 1; }
        .hc-stat-label { font-size: 10.5px; color: var(--ink-45); margin-top: 2px; font-family: 'DM Mono', monospace; letter-spacing: 0.5px; }
        .hc-join-btn {
          padding: 9px 18px; border-radius: 7px;
          background: var(--orange); color: white;
          font-size: 12.5px; font-weight: 600; cursor: pointer; border: none;
          transition: background 0.2s; font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.2px;
        }
        .hc-join-btn:hover { background: var(--orange-deep); }

        /* ── STATS ─────────────────────────────────── */
        .stats-band {
          background: white;
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          padding: 0 5vw;
        }
        .stats-grid {
          display: grid; grid-template-columns: repeat(4,1fr);
          max-width: 1100px; margin: 0 auto;
        }
        .stat-item {
          padding: 48px 32px;
          border-right: 1px solid var(--rule);
          position: relative;
        }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 48px; font-weight: 400;
          color: var(--ink); line-height: 1;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }
        .stat-num span { color: var(--orange); }
        .stat-label { color: var(--ink-45); font-size: 13px; font-weight: 400; letter-spacing: 0.2px; }
        .stat-accent {
          position: absolute; bottom: 0; left: 32px;
          width: 24px; height: 2px; background: var(--orange);
        }

        /* ── SECTIONS ──────────────────────────────── */
        .section { padding: 96px 5vw; }
        .section-white { background: var(--white); }
        .section-off { background: var(--off-white); }
        .section-paper { background: var(--paper); }
        .section-ink { background: var(--ink); }

        .section-header { max-width: 1100px; margin: 0 auto 64px; }
        .section-header.center { text-align: center; }
        .section-header.center .section-sub { margin: 14px auto 0; }

        .section-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 18px;
        }
        .eyebrow-line { width: 20px; height: 1px; background: var(--orange); }
        .eyebrow-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--orange); font-weight: 500;
        }
        .section-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          color: var(--ink); line-height: 1.1;
          letter-spacing: -0.8px; font-weight: 400;
        }
        .section-title.light { color: white; }
        .section-title em { font-style: italic; color: var(--orange); }
        .section-sub {
          color: var(--ink-45); font-size: 15px;
          font-weight: 300; line-height: 1.75;
          max-width: 500px; margin-top: 14px;
          letter-spacing: 0.1px;
        }
        .section-sub.light { color: rgba(255,255,255,0.4); }

        /* ── FEATURES ──────────────────────────────── */
        .features-wrap { max-width: 1100px; margin: 0 auto; }
        .features-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 1px;
          border: 1px solid var(--rule); border-radius: 12px; overflow: hidden;
          background: var(--rule);
        }
        .feat-card {
          background: white; padding: 36px 32px;
          transition: background 0.25s;
          position: relative;
        }
        .feat-card:hover { background: var(--off-white); }
        .feat-icon-wrap {
          width: 40px; height: 40px; margin-bottom: 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          border-radius: 10px; background: var(--orange-6);
          border: 1px solid var(--orange-10);
        }
        .feat-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          color: var(--ink); margin-bottom: 10px; letter-spacing: -0.2px;
        }
        .feat-desc { color: var(--ink-45); font-size: 13.5px; line-height: 1.7; font-weight: 300; }
        .feat-link {
          display: inline-flex; align-items: center; gap: 5px;
          margin-top: 16px; font-size: 12.5px; font-weight: 500;
          color: var(--orange); text-decoration: none;
          transition: gap 0.2s;
        }
        .feat-link:hover { gap: 8px; }

        /* ── HOW IT WORKS ──────────────────────────── */
        .steps-wrap { max-width: 1100px; margin: 0 auto; }
        .steps-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 40px; }
        .step-card { position: relative; }
        .step-connector {
          position: absolute; top: 20px; left: calc(100% - 20px);
          width: calc(100% - 40px); height: 1px;
          background: repeating-linear-gradient(90deg, var(--orange) 0, var(--orange) 4px, transparent 4px, transparent 10px);
          z-index: 0;
        }
        .step-card:last-child .step-connector { display: none; }
        .step-num-wrap {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1.5px solid var(--orange);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px; position: relative; z-index: 1;
          background: white;
        }
        .step-num {
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 500;
          color: var(--orange); letter-spacing: 0.5px;
        }
        .step-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          color: var(--ink); margin-bottom: 10px; letter-spacing: -0.2px;
        }
        .step-desc { color: var(--ink-45); font-size: 13.5px; line-height: 1.7; font-weight: 300; }

        /* ── TESTIMONIALS ──────────────────────────── */
        .testi-wrap { max-width: 1100px; margin: 0 auto; }
        .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        .testi-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 36px 30px;
          transition: border-color 0.25s, transform 0.25s;
        }
        .testi-card:hover { border-color: rgba(217,95,10,0.3); transform: translateY(-3px); }
        .testi-mark {
          font-family: 'Instrument Serif', serif;
          font-size: 48px; line-height: 1; color: var(--orange);
          margin-bottom: 16px; display: block; opacity: 0.8;
        }
        .testi-text {
          color: rgba(255,255,255,0.55); font-size: 14px;
          line-height: 1.8; font-weight: 300; margin-bottom: 28px;
          font-style: italic;
        }
        .testi-rule { height: 1px; background: rgba(255,255,255,0.07); margin-bottom: 20px; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-av {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--orange-deep);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; color: white; flex-shrink: 0;
          letter-spacing: 0.5px;
        }
        .testi-name { font-size: 13.5px; font-weight: 600; color: white; letter-spacing: -0.1px; }
        .testi-role { font-size: 11.5px; color: rgba(255,255,255,0.3); margin-top: 2px; font-family: 'DM Mono', monospace; letter-spacing: 0.3px; }

        /* ── CTA ───────────────────────────────────── */
        .cta-band {
          background: var(--off-white);
          border-top: 1px solid var(--rule);
          padding: 80px 5vw;
          text-align: center;
        }
        .cta-inner { max-width: 600px; margin: 0 auto; }
        .cta-eyebrow { margin-bottom: 20px; }
        .cta-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          color: var(--ink); margin-bottom: 16px;
          letter-spacing: -0.8px; line-height: 1.1; font-weight: 400;
        }
        .cta-title em { font-style: italic; color: var(--orange); }
        .cta-sub {
          color: var(--ink-45); font-size: 15px; font-weight: 300;
          line-height: 1.75; margin-bottom: 36px;
        }
        .cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-cta-primary {
          padding: 13px 28px; border-radius: 8px;
          background: var(--orange); color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .btn-cta-primary:hover {
          background: var(--orange-deep); transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(217,95,10,0.35);
        }
        .btn-cta-secondary {
          padding: 12px 24px; border-radius: 8px;
          border: 1px solid var(--rule); color: var(--ink-70);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-cta-secondary:hover { border-color: var(--orange); color: var(--orange); }

        /* ── FOOTER ────────────────────────────────── */
        .footer {
          background: var(--ink);
          padding: 64px 5vw 32px;
        }
        .footer-top {
          display: grid; grid-template-columns: 2.2fr 1fr 1fr 1fr;
          gap: 60px; margin-bottom: 56px;
          max-width: 1100px; margin-left: auto; margin-right: auto;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .footer-brand-logo {
          display: flex; align-items: center; gap: 9px; margin-bottom: 14px;
        }
        .footer-brand-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; color: white; letter-spacing: -0.2px;
        }
        .footer-brand-desc {
          color: rgba(255,255,255,0.28); font-size: 13px;
          line-height: 1.75; max-width: 240px; font-weight: 300;
        }
        .footer-col-title {
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.25);
          letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 18px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 11px; }
        .footer-links a {
          color: rgba(255,255,255,0.4); font-size: 13px;
          text-decoration: none; transition: color 0.2s; font-weight: 300;
        }
        .footer-links a:hover { color: rgba(255,255,255,0.8); }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1100px; margin: 0 auto;
        }
        .footer-copy { color: rgba(255,255,255,0.2); font-size: 12px; font-family: 'DM Mono', monospace; letter-spacing: 0.3px; }
        .footer-socials { display: flex; gap: 8px; }
        .social-btn {
          width: 32px; height: 32px; border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.3); font-size: 13px;
          text-decoration: none; transition: all 0.2s;
        }
        .social-btn:hover { border-color: var(--orange); color: var(--orange); }

        /* ── MOBILE MENU ───────────────────────────── */
        .mobile-menu {
          position: fixed; inset: 0; z-index: 99;
          background: rgba(255,248,242,0.98); backdrop-filter: blur(24px);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 28px;
          transform: translateY(-100%);
          transition: transform 0.4s cubic-bezier(0.77,0,0.175,1);
        }
        .mobile-menu.open { transform: translateY(0); }
        .mobile-menu a {
          font-family: 'Instrument Serif', serif;
          font-size: 32px; font-weight: 400;
          color: var(--ink); text-decoration: none; cursor: pointer; transition: color 0.2s;
        }
        .mobile-menu a:hover { color: var(--orange); }

        /* ── SCROLL HINT ───────────────────────────── */
        .scroll-hint {
          position: absolute; bottom: 36px; left: 5vw; z-index: 2;
          display: flex; align-items: center; gap: 10px;
          color: var(--ink-20); font-size: 11px;
          font-family: 'DM Mono', monospace; letter-spacing: 1px; text-transform: uppercase;
          animation: fadeIn 2s 1s both;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .scroll-track {
          width: 1px; height: 40px; background: var(--ink-10);
          position: relative; overflow: hidden;
        }
        .scroll-thumb {
          width: 1px; height: 14px; background: var(--orange);
          animation: scrollDown 2s ease-in-out infinite;
        }
        @keyframes scrollDown { 0%{transform:translateY(-14px)} 100%{transform:translateY(40px)} }

        /* ── RESPONSIVE ────────────────────────────── */
        @media (max-width: 960px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .features-grid { grid-template-columns: repeat(2,1fr); }
          .steps-grid { grid-template-columns: repeat(2,1fr); }
          .step-connector { display: none; }
          .testi-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr 1fr; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item:nth-child(3) { border-top: 1px solid var(--rule); }
          .stat-item:nth-child(4) { border-right: none; border-top: 1px solid var(--rule); }
        }
        @media (max-width: 600px) {
          .nav-links, .nav-cta { display: none; }
          .nav-hamburger { display: flex; }
          .features-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr; gap: 36px; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .testi-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button onClick={() => setMenuOpen(false)} style={{position:"absolute",top:24,right:24,background:"none",border:"none",color:"var(--ink-45)",fontSize:24,cursor:"pointer",fontFamily:"DM Sans"}}>✕</button>
        {NAV_LINKS.map(l => <a key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g,"-"))}>{l}</a>)}
        <a href="/login" style={{color:"var(--orange)",fontSize:"14px",fontFamily:"DM Sans",fontWeight:600,letterSpacing:"0.5px"}}>Login →</a>
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
        <a href="/login" className="nav-cta">Get Started</a>
        <button className="nav-hamburger" onClick={() => setMenuOpen(true)}><span /><span /><span /></button>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-dot-grid" />
        <div className="hero-geo-1" />
        <div className="hero-geo-2" />

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-label">
              <div className="hero-label-line" />
              <span className="hero-label-text">Emergency Response Platform</span>
            </div>
            <h1 className="hero-title">
              Unite. <em>Respond.</em><br />Change Lives.
            </h1>
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
              <span className="trust-text">Trusted by <strong>18,000+</strong> volunteers globally</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card">
              <div className="hc-topbar">
                <div className="hc-dots">
                  <div className="hc-dot" style={{background:"rgba(255,255,255,0.12)"}} />
                  <div className="hc-dot" style={{background:"rgba(255,255,255,0.08)"}} />
                  <div className="hc-dot" style={{background:"rgba(255,255,255,0.05)"}} />
                </div>
                <div className="hc-title">mission.dashboard</div>
                <div className="hc-live"><span className="hc-live-dot" /> 14 active</div>
              </div>
              <div className="hc-body">
                <div className="hc-section-label">Live Missions</div>
                <div className="hc-missions">
                  {[
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
                  ))}
                </div>
                <div className="hc-divider" />
                <div className="hc-footer">
                  <div className="hc-stat">
                    <div className="hc-stat-num">342</div>
                    <div className="hc-stat-label">volunteers deployed</div>
                  </div>
                  <button className="hc-join-btn">Join Mission →</button>
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

      {/* STATS */}
      <div ref={statsRef} id="impact">
        <div className="stats-band">
          <div className="stats-grid">
            {[
              {val:counters.ngos.toLocaleString(),suffix:"+",label:"Verified NGOs"},
              {val:counters.vol.toLocaleString(),suffix:"+",label:"Active Volunteers"},
              {val:counters.rate,suffix:"%",label:"Mission Success Rate"},
              {val:counters.countries,suffix:"+",label:"Countries Covered"},
            ].map((s,i) => (
              <div key={i} className="stat-item">
                <div className="stat-num">{s.val}<span>{s.suffix}</span></div>
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
            {FEATURES.map((f,i) => (
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
            {STEPS.map((s,i) => (
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

      {/* TESTIMONIALS */}
      <section className="section section-ink" id="testimonials">
        <div className="testi-wrap">
          <div className="section-header center">
            <div className="section-eyebrow" style={{justifyContent:"center"}}>
              <div className="eyebrow-line" />
              <span className="eyebrow-text" style={{color:"var(--orange)"}}>Testimonials</span>
              <div className="eyebrow-line" />
            </div>
            <h2 className="section-title light">Voices from the <em>field</em></h2>
            <p className="section-sub light">Real stories from the people making a difference every day.</p>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map((t,i) => (
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
          <p className="cta-sub">Join thousands of NGOs and volunteers already coordinating on Community Connect.</p>
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