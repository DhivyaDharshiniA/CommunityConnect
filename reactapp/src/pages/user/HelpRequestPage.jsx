import { useState } from "react";
import axios from "axios";

const categories = [
  { id: "medical", label: "Medical", icon: "🏥", desc: "Hospital bills, treatments" },
  { id: "education", label: "Education", icon: "📚", desc: "Tuition fees, books" },
  { id: "disaster", label: "Disaster Relief", icon: "🏠", desc: "Flood, fire, earthquake" },
  { id: "food", label: "Food & Nutrition", icon: "🍱", desc: "Meals, groceries" },
  { id: "other", label: "Other", icon: "💛", desc: "Any urgent need" },
];

export default function HelpRequestPage() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amountNeeded, setAmountNeeded] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState("");
  const [medicalDoc, setMedicalDoc] = useState(null);
  const [feeReceipt, setFeeReceipt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!title.trim()) e.title = "Please enter a title";
      if (!category) e.category = "Please select a category";
      if (!description.trim()) e.description = "Please describe your need";
    }
    if (s === 2) {
      if (!amountNeeded || isNaN(amountNeeded) || Number(amountNeeded) <= 0)
        e.amountNeeded = "Enter a valid amount";
      if (!contactNumber.trim()) e.contactNumber = "Contact number is required";
      if (!location.trim()) e.location = "Location is required";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    const e = validate(2);
    if (Object.keys(e).length) { setErrors(e); return; }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("amountNeeded", amountNeeded);
    formData.append("contactNumber", contactNumber);
    formData.append("location", location);
    if (medicalDoc) formData.append("medicalDoc", medicalDoc);
    if (feeReceipt) formData.append("feeReceipt", feeReceipt);
    axios.post("http://localhost:8080/api/help/create", formData)
      .then(() => setSubmitted(true))
      .catch(err => console.error(err));
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false); setStep(1); setTitle(""); setCategory("");
    setDescription(""); setAmountNeeded(""); setContactNumber("");
    setLocation(""); setMedicalDoc(null); setFeeReceipt(null); setErrors({});
  };

  const stepLabels = ["Your Story", "Details & Contact", "Documents"];

  const inputCls = (err) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm font-sans transition-all duration-150 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${err ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-orange-300"}`;

  const FileBox = ({ label, hint, icon, file, onChange, id }) => (
    <div
      onClick={() => document.getElementById(id).click()}
      className={`flex-1 cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all duration-150 hover:border-orange-400 hover:bg-orange-50 ${file ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-gray-50"}`}
    >
      <input id={id} type="file" className="hidden" onChange={onChange} />
      <div className="text-2xl mb-1">{file ? "✅" : icon}</div>
      <p className="text-sm font-semibold text-gray-700 font-serif">{file ? file.name : label}</p>
      <p className="text-xs text-gray-400 mt-1">{file ? "Tap to change" : hint}</p>
    </div>
  );

  if (submitted) return (
    <div className="max-w-xl mx-auto mt-10">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap'); * { font-family: 'DM Sans', sans-serif; } h1,h2,h3,.font-serif { font-family: 'DM Serif Display', serif; }`}</style>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🌟</div>
        <h2 className="text-2xl font-serif text-gray-800 mb-2">Request Submitted!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">Your help request has been received. Our team will review it and connect you with the right support soon.</p>
        <div className="inline-block bg-orange-50 border border-orange-200 rounded-lg px-5 py-2.5 mb-6">
          <span className="text-xs text-orange-400 font-semibold uppercase tracking-wide">Request ID </span>
          <span className="text-orange-600 font-bold font-mono">#{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
        </div>
        <div><button onClick={reset} className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">Submit Another Request</button></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap'); * { font-family: 'DM Sans', sans-serif; } h1,h2,h3,.font-serif { font-family: 'DM Serif Display', serif; } @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } } .fade-up { animation: fadeUp 0.3s ease; }`}</style>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-orange-500 text-xl">🤝</span>
          <h1 className="text-2xl font-serif text-gray-800">Request Help</h1>
        </div>
        <p className="text-sm text-gray-400">Fill out the form below and our community will connect with you.</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-4">
        <div className="flex items-center">
          {stepLabels.map((label, i) => {
            const s = i + 1;
            const done = step > s;
            const active = step === s;
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${done ? "bg-orange-500 text-white" : active ? "bg-orange-500 text-white ring-4 ring-orange-100" : "bg-gray-100 text-gray-400"}`}>
                    {done ? "✓" : s}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${active ? "text-orange-500" : done ? "text-gray-500" : "text-gray-300"}`}>{label}</span>
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 mx-3 rounded transition-all duration-300 ${step > s ? "bg-orange-400" : "bg-gray-100"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-7">

        {/* Step 1 */}
        {step === 1 && (
          <div className="fade-up">
            <h2 className="text-xl font-serif text-gray-800 mb-1">Tell us your story</h2>
            <p className="text-xs text-gray-400 mb-6">Every request matters. Share what you need help with.</p>

            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Request Title <span className="text-orange-400">*</span>
            </label>
            <input
              className={inputCls(errors.title)}
              placeholder="e.g. Help with my mother's surgery bill"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}

            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mt-5 mb-2">
              Category <span className="text-orange-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-1">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`relative rounded-xl p-3.5 text-left border-2 transition-all duration-150 hover:border-orange-300 hover:bg-orange-50 ${category === c.id ? "border-orange-500 bg-orange-50" : "border-gray-100 bg-gray-50"}`}
                >
                  {category === c.id && <span className="absolute top-2 right-2 text-orange-500 text-xs font-bold">✓</span>}
                  <div className="text-xl mb-1">{c.icon}</div>
                  <div className={`text-xs font-semibold font-serif ${category === c.id ? "text-orange-600" : "text-gray-700"}`}>{c.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-tight">{c.desc}</div>
                </button>
              ))}
            </div>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}

            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mt-5 mb-1.5">
              Describe Your Need <span className="text-orange-400">*</span>
            </label>
            <textarea
              className={`${inputCls(errors.description)} resize-none`}
              rows={4}
              placeholder="Please share your situation in detail. The more you share, the better we can help..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <div className="flex justify-between items-center mt-0.5">
              {errors.description ? <p className="text-xs text-red-500">{errors.description}</p> : <span />}
              <span className="text-xs text-gray-300">{description.length} chars</span>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="fade-up">
            <h2 className="text-xl font-serif text-gray-800 mb-1">Support Details</h2>
            <p className="text-xs text-gray-400 mb-6">Help us understand the scope and reach you if needed.</p>

            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Amount Needed (₹) <span className="text-orange-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
              <input
                className={`${inputCls(errors.amountNeeded)} pl-8`}
                type="number"
                placeholder="0"
                value={amountNeeded}
                onChange={e => setAmountNeeded(e.target.value)}
              />
            </div>
            {errors.amountNeeded && <p className="text-xs text-red-500 mt-1">{errors.amountNeeded}</p>}
            {amountNeeded > 0 && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">
                <span className="text-orange-400 text-xs">Requesting</span>
                <span className="text-orange-600 text-sm font-bold font-serif">₹{Number(amountNeeded).toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Contact Number <span className="text-orange-400">*</span>
                </label>
                <input
                  className={inputCls(errors.contactNumber)}
                  placeholder="+91 00000 00000"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                />
                {errors.contactNumber && <p className="text-xs text-red-500 mt-1">{errors.contactNumber}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Location <span className="text-orange-400">*</span>
                </label>
                <input
                  className={inputCls(errors.location)}
                  placeholder="City, State"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4">
              <span className="text-orange-400 text-lg mt-0.5">🔒</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">Your data is safe</p>
                <p className="text-xs text-gray-400 mt-0.5">Contact details are only shared with verified donors and our support team.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="fade-up">
            <h2 className="text-xl font-serif text-gray-800 mb-1">Supporting Documents</h2>
            <p className="text-xs text-gray-400 mb-6">Optional but recommended — documents help build trust and speed up verification.</p>

            <div className="flex gap-3 mb-6">
              <FileBox label="Medical Document" hint="Prescription, reports, discharge summary" icon="🏥" file={medicalDoc} onChange={e => setMedicalDoc(e.target.files[0])} id="file-medical" />
              <FileBox label="Fee Receipt / Invoice" hint="Hospital bill, fee challan, invoice" icon="🧾" file={feeReceipt} onChange={e => setFeeReceipt(e.target.files[0])} id="file-receipt" />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">📋 Request Summary</p>
              <div className="space-y-2">
                {[
                  ["Title", title],
                  ["Category", categories.find(c => c.id === category)?.label],
                  ["Amount", `₹${Number(amountNeeded).toLocaleString("en-IN")}`],
                  ["Location", location],
                  ["Contact", contactNumber],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs border-b border-gray-100 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-gray-400">{k}</span>
                    <span className="text-gray-700 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Nav */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
          {step > 1
            ? <button onClick={() => { setErrors({}); setStep(s => s - 1); }} className="text-sm text-gray-400 hover:text-gray-600 font-semibold flex items-center gap-1 transition-colors">← Back</button>
            : <div />
          }
          {step < 3
            ? <button onClick={next} className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm shadow-orange-200">Continue →</button>
            : <button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-7 py-2.5 rounded-lg transition-colors shadow-sm shadow-orange-200 flex items-center gap-2">🌟 Submit Request</button>
          }
        </div>
      </div>

      <p className="text-center text-xs text-gray-300 mt-4">All requests are reviewed within 24 hours · Community Guidelines apply</p>
    </div>
  );
}