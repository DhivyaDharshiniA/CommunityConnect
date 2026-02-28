// import React from "react";
// import { Link } from "react-router-dom";
//
// function Home() {
//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-green-100 px-6">
//
//       <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">
//         Community Connect 🌍
//       </h1>
//
//       <p className="text-gray-600 text-lg text-center max-w-xl mb-8">
//         Connecting NGOs and Volunteers to create meaningful impact together.
//       </p>
//
//       <div className="flex gap-6">
//         <Link
//           to="/login"
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
//         >
//           Login
//         </Link>
//
//         <Link
//           to="/register"
//           className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
//         >
//           Register
//         </Link>
//       </div>
//     </div>
//   );
// }
//
// export default Home;


import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 3 + 1.5,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(134,239,172,${0.18 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(134,239,172,0.55)";
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ink: #0d1f1a;
          --cream: #f5f0e8;
          --green: #1a6b4a;
          --green-mid: #2d9469;
          --green-light: #86efac;
          --amber: #e8a020;
        }

        .cc-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--ink);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .cc-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* Large decorative arc */
        .cc-arc {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          border: 1.5px solid rgba(45,148,105,0.18);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
        }
        .cc-arc-2 {
          width: 480px;
          height: 480px;
          border-color: rgba(45,148,105,0.12);
        }

        /* Grain overlay */
        .cc-grain {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          pointer-events: none;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        .cc-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem;
          animation: fadeUp 0.9s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cc-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(45,148,105,0.15);
          border: 1px solid rgba(45,148,105,0.35);
          border-radius: 999px;
          padding: 5px 16px;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--green-light);
          margin-bottom: 1.8rem;
          animation: fadeUp 0.9s ease 0.1s both;
        }

        .cc-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green-light);
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.7); }
        }

        .cc-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(3rem, 8vw, 5.5rem);
          line-height: 1.05;
          color: var(--cream);
          margin: 0 0 0.3em;
          animation: fadeUp 0.9s ease 0.2s both;
        }

        .cc-title-accent {
          color: var(--green-light);
          font-style: italic;
        }

        .cc-divider {
          width: 48px;
          height: 2px;
          background: var(--amber);
          margin: 1.2rem auto 1.4rem;
          border-radius: 2px;
          animation: fadeUp 0.9s ease 0.3s both;
        }

        .cc-sub {
          color: rgba(245,240,232,0.55);
          font-size: 1.05rem;
          font-weight: 300;
          max-width: 420px;
          line-height: 1.7;
          margin-bottom: 2.8rem;
          animation: fadeUp 0.9s ease 0.4s both;
        }

        .cc-actions {
          display: flex;
          gap: 1rem;
          animation: fadeUp 0.9s ease 0.55s both;
        }

        .cc-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.85rem 2.1rem;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
          cursor: pointer;
        }

        .cc-btn-primary {
          background: var(--green);
          color: #fff;
          border: 1.5px solid var(--green);
          box-shadow: 0 0 0 0 rgba(45,148,105,0);
        }
        .cc-btn-primary:hover {
          background: var(--green-mid);
          border-color: var(--green-mid);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(45,148,105,0.35);
        }

        .cc-btn-secondary {
          background: transparent;
          color: var(--cream);
          border: 1.5px solid rgba(245,240,232,0.22);
        }
        .cc-btn-secondary:hover {
          background: rgba(245,240,232,0.06);
          border-color: rgba(245,240,232,0.45);
          transform: translateY(-2px);
        }

        /* Stats row */
        .cc-stats {
          display: flex;
          gap: 2.5rem;
          margin-top: 3.5rem;
          animation: fadeUp 0.9s ease 0.7s both;
        }
        .cc-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .cc-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--cream);
          line-height: 1;
        }
        .cc-stat-num span {
          color: var(--green-light);
        }
        .cc-stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(245,240,232,0.38);
          font-weight: 500;
        }
        .cc-stat-sep {
          width: 1px;
          height: 36px;
          background: rgba(245,240,232,0.1);
          align-self: center;
        }

        /* Bottom label */
        .cc-tagline {
          position: absolute;
          bottom: 2rem;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.2);
          z-index: 2;
        }
      `}</style>

      <div className="cc-root">
        <canvas ref={canvasRef} className="cc-canvas" />
        <div className="cc-arc" />
        <div className="cc-arc cc-arc-2" />
        <div className="cc-grain" />

        <div className="cc-content">
          <div className="cc-badge">
            <span className="cc-badge-dot" />
            NGOs &amp; Volunteers
          </div>

          <h1 className="cc-title">
            Community<br />
            <span className="cc-title-accent">Connect</span> 🌍
          </h1>

          <div className="cc-divider" />

          <p className="cc-sub">
            Bridging NGOs and passionate volunteers to create lasting, meaningful impact in communities that need it most.
          </p>

          <div className="cc-actions">
            <Link to="/login" className="cc-btn cc-btn-primary">
              Login →
            </Link>
            <Link to="/register" className="cc-btn cc-btn-secondary">
              Create Account
            </Link>
          </div>

          <div className="cc-stats">
            <div className="cc-stat">
              <div className="cc-stat-num">1.2<span>k+</span></div>
              <div className="cc-stat-label">NGOs</div>
            </div>
            <div className="cc-stat-sep" />
            <div className="cc-stat">
              <div className="cc-stat-num">18<span>k+</span></div>
              <div className="cc-stat-label">Volunteers</div>
            </div>
            <div className="cc-stat-sep" />
            <div className="cc-stat">
              <div className="cc-stat-num">94<span>%</span></div>
              <div className="cc-stat-label">Impact Rate</div>
            </div>
          </div>
        </div>

        <div className="cc-tagline">Building a better world — together</div>
      </div>
    </>
  );
}

export default Home;