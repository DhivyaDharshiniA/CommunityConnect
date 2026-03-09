import React, { useState, useRef } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

// ── Icons ──
const UserIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/>
  </svg>
);
const LockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="11" rx="3"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v5c0 5 4 9 9 10 5-1 9-5 9-10V7L12 2z"/>
  </svg>
);
const UploadIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const CheckIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowLeft = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
  </svg>
);

// ── Step Indicator ──
const StepDot = ({ step, current, label }) => {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
        ${done ? "bg-orange-500 text-white" : active ? "bg-orange-100 border-2 border-orange-500 text-orange-600" : "bg-stone-100 border-2 border-stone-200 text-stone-400"}`}>
        {done ? <CheckIcon /> : step}
      </div>
      <span className={`text-[10px] font-semibold tracking-wide uppercase ${active ? "text-orange-500" : done ? "text-stone-500" : "text-stone-300"}`}>
        {label}
      </span>
    </div>
  );
};

// ── OTP Input ──
const OtpInput = ({ value, onChange }) => {
  const inputsRef = useRef([]);
  const digits = (value + "      ").slice(0, 6).split("");

  const handleKey = (e, i) => {
    if (e.key === "Backspace") {
      const next = value.slice(0, i) + value.slice(i + 1);
      onChange(next);
      if (i > 0) inputsRef.current[i - 1]?.focus();
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const next = value.slice(0, i) + e.key + value.slice(i + 1);
    onChange(next.slice(0, 6));
    if (i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => inputsRef.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={() => {}}
          onKeyDown={e => handleKey(e, i)}
          className="w-11 h-13 text-center text-xl font-bold rounded-xl border-2 border-stone-200 bg-stone-50 text-stone-800
            focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:bg-white
            transition-all duration-200 py-3"
        />
      ))}
    </div>
  );
};

// ── Main Component ──
function Register() {
  const [step, setStep] = useState(1); // 1=Info, 2=Verify OTP, 3=Done
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "ROLE_USER" });
  const [proofFile, setProofFile] = useState(null);
  const [proofDrag, setProofDrag] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFile = (file) => {
    if (file && ["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      setProofFile(file);
    } else {
      setError("Only PDF, JPG, or PNG files accepted.");
    }
  };

  // Step 1 → Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.role === "ROLE_NGO" && !proofFile) {
      setError("Please upload NGO proof document.");
      return;
    }

    setIsSending(true);
    try {
      // Call your backend to send OTP to email
      await API.post("/send-otp", { email: formData.email });
      setOtpSent(true);
      setStep(2);
      startCountdown();
    } catch (err) {
      const msg = err.response?.data || "Failed to send OTP. Try again.";
      setError(typeof msg === "string" ? msg : "Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  // Countdown for resend
  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setIsSending(true);
    try {
      await API.post("/send-otp", { email: formData.email });
      startCountdown();
      setOtp("");
      setError("");
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setIsSending(false);
    }
  };

  // Step 2 → Verify OTP + Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("Please enter the complete 6-digit OTP."); return; }
    setError("");
    setIsLoading(true);

    try {
      // Verify OTP first
      await API.post("/verify-otp", { email: formData.email, otp });

      // Then register
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      if (formData.role === "ROLE_NGO") {
        formDataToSend.append("organizationName", formData.organizationName);
        formDataToSend.append("registrationNumber", formData.registrationNumber);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("website", formData.website);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("state", formData.state);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("proof", proofFile);
      }

      await API.post("/register", formDataToSend);
      setStep(3);
    } catch (err) {
      const msg = err.response?.data || "Invalid OTP. Please try again.";
      setError(typeof msg === "string" ? msg : "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-stone-50 font-sans">

      {/* ── LEFT HERO ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-stone-900">
        <img
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80"
          alt="Community"
          className="absolute inset-0 w-full h-full object-cover opacity-45 scale-100 hover:scale-105 transition-transform duration-[8000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />

        {/* Badge */}
        <div className="absolute top-8 left-8 z-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Community Connect
          </span>
        </div>
        <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-amber-400/50 rounded-tr-md" />

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
          <h1 className="text-5xl font-serif font-semibold text-white leading-[1.15] mb-3">
            Start your <span className="italic text-amber-400">journey</span>
            <br />with us today
          </h1>
          <p className="text-stone-300 text-[15px] leading-relaxed max-w-[28ch]">
            Create an account and become part of a thriving, supportive community.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 mt-8 pt-8 border-t border-white/10">
            {[
              ["🔒", "Secure & private by design"],
              ["🌍", "Connect across 50+ cities"],
              ["🤝", "NGO partnerships welcome"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-stone-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
        {/* Blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-100 rounded-full opacity-60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-amber-50 rounded-full opacity-80 blur-3xl pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10">

          {/* Step tracker */}
          {step < 3 && (
            <div className="flex items-center justify-center gap-4 mb-8">
              <StepDot step={1} current={step} label="Details" />
              <div className={`flex-1 max-w-[60px] h-0.5 rounded transition-all duration-500 ${step >= 2 ? "bg-orange-400" : "bg-stone-200"}`} />
              <StepDot step={2} current={step} label="Verify" />
              <div className={`flex-1 max-w-[60px] h-0.5 rounded transition-all duration-500 ${step >= 3 ? "bg-orange-400" : "bg-stone-200"}`} />
              <StepDot step={3} current={step} label="Done" />
            </div>
          )}

          {/* ════ STEP 1 — Registration Form ════ */}
          {step === 1 && (
            <>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500 mb-1">Get started</p>
              <h2 className="text-[2.4rem] font-serif font-semibold text-stone-800 leading-none mb-2">
                Create account
              </h2>
              <p className="text-stone-400 text-sm mb-7 leading-relaxed">
                Fill in your details. We'll verify your email before registering.
              </p>

              {error && (
                <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  <span className="mt-0.5">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-stone-600">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none"><UserIcon /></span>
                    <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder-stone-300 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100/70 focus:bg-white hover:border-stone-300 hover:bg-white transition-all duration-200" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-stone-600">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none"><MailIcon /></span>
                    <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder-stone-300 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100/70 focus:bg-white hover:border-stone-300 hover:bg-white transition-all duration-200" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-stone-600">Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none"><LockIcon /></span>
                    <input type="password" name="password" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} required minLength={8}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm placeholder-stone-300 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100/70 focus:bg-white hover:border-stone-300 hover:bg-white transition-all duration-200" />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-stone-600">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[["ROLE_USER", "👤", "User", "Personal account"], ["ROLE_NGO", "🏛️", "NGO", "Organisation account"]].map(([val, icon, label, sub]) => (
                      <button key={val} type="button" onClick={() => { setFormData(f => ({ ...f, role: val })); setProofFile(null); setError(""); }}
                        className={`flex flex-col items-start p-3.5 rounded-xl border-2 text-left transition-all duration-200
                          ${formData.role === val ? "border-orange-400 bg-orange-50 shadow-sm" : "border-stone-200 bg-white hover:border-stone-300"}`}>
                        <span className="text-xl mb-1">{icon}</span>
                        <span className={`text-sm font-semibold ${formData.role === val ? "text-orange-600" : "text-stone-700"}`}>{label}</span>
                        <span className="text-xs text-stone-400">{sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* NGO Proof Upload */}
                {formData.role === "ROLE_NGO" && (
                  <div className="space-y-1.5">
                     <input
                          name="organizationName"
                          placeholder="Organization Name"
                          onChange={handleChange}
                          className="input"
                        />

                        <input
                          name="registrationNumber"
                          placeholder="Registration Number"
                          onChange={handleChange}
                          className="input"
                        />

                        <input
                          name="category"
                          placeholder="Category (Environment / Health / Education)"
                          onChange={handleChange}
                          className="input"
                        />

                        <input
                          name="phone"
                          placeholder="Phone"
                          onChange={handleChange}
                          className="input"
                        />

                        <input
                          name="website"
                          placeholder="Website"
                          onChange={handleChange}
                          className="input"
                        />

                        <input
                          name="city"
                          placeholder="City"
                          onChange={handleChange}
                          className="input"
                        />

                        <input
                          name="state"
                          placeholder="State"
                          onChange={handleChange}
                          className="input"
                        />

                        <textarea
                          name="description"
                          placeholder="Describe your NGO"
                          onChange={handleChange}
                          className="input"
                        />
                    <label className="block text-[11px] font-bold tracking-[0.15em] uppercase text-stone-600">
                      NGO Proof Document <span className="text-red-400">*</span>
                    </label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setProofDrag(true); }}
                      onDragLeave={() => setProofDrag(false)}
                      onDrop={e => { e.preventDefault(); setProofDrag(false); handleFile(e.dataTransfer.files[0]); }}
                      className={`relative flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
                        ${proofDrag ? "border-orange-400 bg-orange-50" : proofFile ? "border-green-400 bg-green-50" : "border-stone-200 bg-stone-50 hover:border-orange-300 hover:bg-orange-50/50"}`}>
                      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                      {proofFile ? (
                        <>
                          <span className="text-2xl">✅</span>
                          <p className="text-sm font-semibold text-green-700 text-center truncate max-w-[200px]">{proofFile.name}</p>
                          <p className="text-xs text-green-500">Click to change file</p>
                        </>
                      ) : (
                        <>
                          <span className="text-stone-400"><UploadIcon /></span>
                          <p className="text-sm font-medium text-stone-600">Drop file or <span className="text-orange-500 font-semibold">browse</span></p>
                          <p className="text-xs text-stone-400">PDF, JPG, PNG accepted</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={isSending}
                  className="relative w-full py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide overflow-hidden group
                    bg-gradient-to-r from-orange-500 to-red-500
                    shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5
                    active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    transition-all duration-200">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSending ? (
                      <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> Sending OTP...</>
                    ) : (
                      <><span>✉️</span> Send Verification Code</>
                    )}
                  </span>
                </button>
              </form>

              <p className="text-center text-sm text-stone-400 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600 underline underline-offset-2 decoration-orange-200 hover:decoration-orange-400 transition-all duration-200">
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* ════ STEP 2 — OTP Verification ════ */}
          {step === 2 && (
            <>
              <button onClick={() => { setStep(1); setOtp(""); setError(""); }}
                className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-6">
                <ArrowLeft /> Back
              </button>

              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                  <span className="text-3xl">📬</span>
                </div>
              </div>

              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-orange-500 mb-1 text-center">Check your inbox</p>
              <h2 className="text-[2rem] font-serif font-semibold text-stone-800 leading-none mb-2 text-center">
                Verify your email
              </h2>
              <p className="text-stone-400 text-sm mb-1 text-center leading-relaxed">
                We sent a 6-digit code to
              </p>
              <p className="text-orange-500 font-semibold text-sm text-center mb-7">{formData.email}</p>

              {error && (
                <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  <span className="mt-0.5">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                <OtpInput value={otp} onChange={setOtp} />

                <button type="submit" disabled={isLoading || otp.length !== 6}
                  className="relative w-full py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide overflow-hidden group
                    bg-gradient-to-r from-orange-500 to-red-500
                    shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5
                    active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    transition-all duration-200">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> Verifying & Registering...</>
                    ) : "Verify & Create Account"}
                  </span>
                </button>
              </form>

              {/* Resend */}
              <div className="text-center mt-6">
                <p className="text-stone-400 text-sm">
                  Didn't receive it?{" "}
                  {countdown > 0 ? (
                    <span className="text-stone-400">Resend in <span className="font-semibold text-orange-400">{countdown}s</span></span>
                  ) : (
                    <button onClick={handleResend} disabled={isSending}
                      className="text-orange-500 font-semibold hover:text-orange-600 underline underline-offset-2 decoration-orange-200 hover:decoration-orange-400 transition-all duration-200 disabled:opacity-50">
                      {isSending ? "Sending..." : "Resend code"}
                    </button>
                  )}
                </p>
              </div>
            </>
          )}

          {/* ════ STEP 3 — Success ════ */}
          {step === 3 && (
            <div className="text-center">
              {/* Animated checkmark */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-30" />
                </div>
              </div>

              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-green-500 mb-1">You're in!</p>
              <h2 className="text-[2.2rem] font-serif font-semibold text-stone-800 leading-none mb-3">
                Account Created! 🎉
              </h2>
              <p className="text-stone-400 text-sm leading-relaxed mb-8 max-w-[28ch] mx-auto">
                Welcome to Community Connect,{" "}
                <span className="text-stone-600 font-semibold">{formData.name}</span>. Your account is ready.
                {formData.role === "ROLE_NGO" && (
                  <span className="block mt-2 text-amber-600">
                    Your NGO proof is under review. You'll hear from us soon.
                  </span>
                )}
              </p>

              <button onClick={() => navigate("/login")}
                className="relative inline-flex px-8 py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide overflow-hidden group
                  bg-gradient-to-r from-orange-500 to-red-500
                  shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5
                  active:translate-y-0 transition-all duration-200">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                <span className="relative z-10">Go to Login →</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Register;