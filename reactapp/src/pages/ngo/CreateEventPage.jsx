import { useState } from "react";
import { createEvent } from "../../api/eventService";

export default function CreateEventPage({ onSuccess }) {

  const [form, setForm] = useState({
    title: "",
    category: "",
    date: "",
    location: "",
    capacity: "",
    description: "",
    requirements: "",
    contactPhone: "" // <-- added
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.category) e.category = "Select a category";
    if (!form.date) e.date = "Date is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1)
      e.capacity = "Enter a valid capacity";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.contactPhone.trim()) e.contactPhone = "Contact phone is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        requirements: form.requirements,
        venue: form.location,
        startDateTime: form.date,
        capacity: form.capacity,
        contactPhone: form.contactPhone  // <-- send phone
      };
      await createEvent(payload);
      setSubmitting(false);
      onSuccess?.("Event created successfully!");
      setForm({
        title: "",
        category: "",
        date: "",
        location: "",
        capacity: "",
        description: "",
        requirements: "",
        contactPhone: ""
      });
    } catch (err) {
      console.error("Error creating event", err);
      setSubmitting(false);
    }
  };

  const F = ({ id, label, required, error, children }) => (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = (err) =>
    `w-full px-3.5 py-2.5 rounded-xl border ${err ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"} text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 ${err ? "focus:ring-red-200" : "focus:ring-teal-200"} focus:border-teal-400 transition-all`;

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-5">
          <h2 className="text-lg font-bold text-white">Create New Event</h2>
          <p className="text-teal-100/80 text-xs mt-0.5">Fill in the details to publish your community event</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <F id="title" label="Event Title" required error={errors.title}>
            <input id="title" value={form.title} onChange={(e) => setForm({...form, title:e.target.value})} placeholder="Event title" className={inputCls(errors.title)} />
          </F>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F id="category" label="Category" required error={errors.category}>
              <select id="category" value={form.category} onChange={(e) => setForm({...form, category:e.target.value})} className={inputCls(errors.category)}>
                <option value="">Select category…</option>
                {["Environment","Health","Education","Welfare","Community","Sports","Culture"].map(c => <option key={c}>{c}</option>)}
              </select>
            </F>
            <F id="date" label="Event Date" required error={errors.date}>
              <input id="date" type="datetime-local" value={form.date} onChange={(e) => setForm({...form,date:e.target.value})} className={inputCls(errors.date)} />
            </F>
          </div>
          <F id="location" label="Location" required error={errors.location}>
            <input id="location" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} className={inputCls(errors.location)} />
          </F>
          <F id="capacity" label="Volunteer Capacity" required error={errors.capacity}>
            <input id="capacity" type="number" min="1" value={form.capacity} onChange={(e)=>setForm({...form, capacity:e.target.value})} className={inputCls(errors.capacity)} />
          </F>
          <F id="contactPhone" label="Contact Phone" required error={errors.contactPhone}>
            <input id="contactPhone" type="text" value={form.contactPhone} onChange={(e)=>setForm({...form, contactPhone:e.target.value})} className={inputCls(errors.contactPhone)} />
          </F>
          <F id="description" label="Description" required error={errors.description}>
            <textarea id="description" rows={4} value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className={inputCls(errors.description)+" resize-none"} />
          </F>
          <F id="requirements" label="Volunteer Requirements">
            <textarea id="requirements" rows={2} value={form.requirements} onChange={(e)=>setForm({...form, requirements:e.target.value})} className={inputCls(errors.requirements)+" resize-none"} />
          </F>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-semibold px-6 py-2.5 rounded-xl">{submitting ? "Creating…" : "Publish Event"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}