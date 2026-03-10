import React, { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="11" rx="3"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await API.post("/login", formData);

    // Save token
    localStorage.setItem("token", response.data.token);

    // Save full user info including ID
    const user = {
      id: response.data.id,          // <-- backend should return user ID
      email: response.data.email,
      role: response.data.role,
      name: response.data.name || ""
    };
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("email", response.data.email);

    // Save role separately (optional)
    localStorage.setItem("role", user.role === "ROLE_NGO" ? "NGO" : "USER");

    // Navigate based on role
    if (user.role === "ROLE_NGO") {
      navigate("/ngo-dashboard");
    } else {
      navigate("/user-dashboard");
    }

  } catch (error) {
    alert("Invalid credentials");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex bg-stone-50 font-sans">

      {/* ── LEFT — Hero Image Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-stone-900">

        {/* Background photo */}
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80"
          alt="Community"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-100 hover:scale-105 transition-transform duration-[8000ms]"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />

        {/* Top-left badge */}
        <div className="absolute top-8 left-8 z-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Community Connect
          </span>
        </div>

        {/* Top-right corner accent */}
        <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-amber-400/50 rounded-tr-md" />

        {/* Hero text bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
          <h1 className="text-5xl font-serif font-semibold text-white leading-[1.15] mb-3">
            Where <span className="italic text-amber-400">people</span>
            <br />come together
          </h1>
          <p className="text-stone-300 text-[15px] leading-relaxed max-w-[28ch]">
            Join thousands building meaningful connections every single day.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-8 pt-8 border-t border-white/10">
            {[["12k+", "Members"], ["4.9★", "Rated"], ["50+", "Cities"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-white font-bold text-lg leading-none">{val}</p>
                <p className="text-stone-400 text-xs tracking-wide mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-14 relative overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-100 rounded-full opacity-70 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-amber-50 rounded-full opacity-80 blur-3xl pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10">

          {/* Heading */}
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500 mb-1">
            Welcome back
          </p>
          <h2 className="text-[2.6rem] font-serif font-semibold text-stone-800 leading-none mb-2">
            Sign in 👋
          </h2>
          <p className="text-stone-400 text-sm mb-8 leading-relaxed">
            Good to see you again — let's pick up where you left off.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-stone-600">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder-stone-300
                    focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100/70 focus:bg-white
                    hover:border-stone-300 hover:bg-white
                    transition-all duration-200"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-stone-600">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder-stone-300
                    focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100/70 focus:bg-white
                    hover:border-stone-300 hover:bg-white
                    transition-all duration-200"
                />
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-stone-400 hover:text-orange-500 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide overflow-hidden group
                bg-gradient-to-r from-orange-500 to-red-500
                shadow-lg shadow-orange-200
                hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5
                active:translate-y-0 active:shadow-md
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                transition-all duration-200"
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    Signing in...
                  </>
                ) : "Login"}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium
                hover:border-stone-300 hover:bg-stone-50 hover:-translate-y-0.5 hover:shadow-md
                active:translate-y-0 transition-all duration-200"
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium
                hover:border-stone-300 hover:bg-stone-50 hover:-translate-y-0.5 hover:shadow-md
                active:translate-y-0 transition-all duration-200"
            >
              <span className="w-4 h-4 flex items-center justify-center rounded-sm bg-blue-600 text-white text-xs font-bold leading-none">f</span>
              Facebook
            </button>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-stone-400 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-500 font-semibold hover:text-orange-600 underline underline-offset-2 decoration-orange-200 hover:decoration-orange-400 transition-all duration-200"
            >
              Create one free
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;