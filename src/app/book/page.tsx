"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Mock available weekdays (0=Sun,...,6=Sat) - in real app comes from admin settings
const AVAILABLE_WEEKDAYS = [1, 2, 3, 4]; // Mon-Thu
const TIME_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function BookPage() {
  useScrollReveal();
  const today = new Date();
  const [currentStep, setCurrentStep] = useState(1); // 1. Select Date, 2. Your Details, 3. Confirm

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    notes: "",
    meetingType: "in_person" as "in_person" | "video"
  });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const isAvailable = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const isToday = d.toDateString() === today.toDateString();
    const isPast = d < today && !isToday;
    if (isPast) return false;
    return AVAILABLE_WEEKDAYS.includes(d.getDay());
  };

  const isToday = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d.toDateString() === today.toDateString();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.toDateString() === new Date(viewYear, viewMonth, day).toDateString();
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(y => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth(m => m - 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(y => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(m => m + 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDayClick = (day: number) => {
    if (!isAvailable(day)) return;
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setSelectedTime(null);
  };

  const handleNextToStep2 = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep(2);
    }
  };

  const handleNextToStep3 = () => {
    if (formData.name && formData.email && formData.topic) {
      setCurrentStep(3);
    } else {
      setFormError("Please fill out all required fields (Name, Email, Purpose).");
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    // Simulate API booking submission
    try {
      // In a real application, you would make an API POST call here:
      // await fetch('/api/book', { method: 'POST', body: JSON.stringify({...}) });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch {
      setFormError("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg text-primary">
      <Navbar />

      {/* Hero: Compact header */}
      <section className="bg-primary-dark pt-32 pb-16 overflow-hidden pattern-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="reveal inline-flex items-center gap-2 glass-card rounded-full px-4 py-1 mb-4 text-accent-light text-xs font-semibold uppercase tracking-wider">
            🤝 One-On-One Sessions
          </div>
          <h1 className="reveal font-display text-3xl sm:text-5xl text-white font-bold tracking-tight">
            Book a <span className="text-gradient-gold">Session</span>
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {submitted ? (
          <div className="max-w-xl mx-auto text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-sm animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-primary-dark mb-3">Booking Requested!</h2>
            <p className="text-stone-500 mb-1">
              Your session with Rev&apos;d Dr S. O. Mosebolatan has been requested for:
            </p>
            <p className="font-serif font-black text-primary text-xl mb-6">
              {selectedDate?.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at {selectedTime}
            </p>
            <p className="text-text-muted text-sm mb-8">
              A confirmation email has been sent to <strong className="text-primary-dark">{formData.email}</strong>. Once approved, the meeting links/invites will follow.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedDate(null);
                setSelectedTime(null);
                setCurrentStep(1);
                setFormData({ name: "", email: "", phone: "", topic: "", notes: "", meetingType: "in_person" });
              }}
              className="btn-gold px-8 py-4 rounded-2xl text-sm font-extrabold shadow-md"
            >
              Book Another Session
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Col (2/3): Multi-Step Booking Form */}
            <div className="reveal lg:col-span-2 space-y-6">
              {/* Step indicator */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 flex items-center justify-between shadow-sm">
                {[
                  { step: 1, name: "Select Date" },
                  { step: 2, name: "Your Details" },
                  { step: 3, name: "Confirm" },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm transition-all duration-300 ${
                        currentStep === s.step
                          ? "bg-accent text-primary-dark scale-110 shadow-sm"
                          : currentStep > s.step
                          ? "bg-primary text-white"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      {currentStep > s.step ? "✓" : s.step}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-wider hidden sm:inline ${currentStep === s.step ? "text-primary-dark" : "text-stone-400"}`}>
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step Content Card */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-8">
                {/* STEP 1: SELECT DATE & TIME */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-primary-dark mb-1">Choose an Available Date</h3>
                      <p className="text-text-muted text-xs">Consultation sessions with our pastor are available Monday to Thursday.</p>
                    </div>

                    {/* Compact Calendar Grid Inside Multi-Step */}
                    <div className="bg-bg border border-stone-150 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-primary flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h4 className="font-serif font-black text-sm text-primary-dark uppercase">
                          {MONTHS[viewMonth]} {viewYear}
                        </h4>
                        <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-primary flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-text-muted uppercase tracking-wider mb-2">
                        {DAYS_SHORT.map(d => <div key={d} className="py-1">{d}</div>)}
                      </div>

                      <div className="grid grid-cols-7 gap-1.5">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const day = i + 1;
                          const avail = isAvailable(day);
                          const tod = isToday(day);
                          const sel = isSelected(day);

                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleDayClick(day)}
                              disabled={!avail}
                              className={`h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all duration-150
                                ${sel ? "bg-accent text-primary-dark ring-2 ring-accent shadow-sm" : ""}
                                ${tod && !sel ? "border-2 border-accent text-primary font-black" : ""}
                                ${avail && !sel ? "bg-white border border-stone-200 hover:bg-stone-50 text-primary" : ""}
                                ${!avail ? "text-stone-300 bg-stone-50/50 cursor-not-allowed" : ""}
                              `}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                      <div className="space-y-3 animate-fade-in-up">
                        <h4 className="font-serif text-base font-bold text-primary-dark">
                          Select a Preferred Time Slot
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {TIME_SLOTS.map((slot) => {
                            const isTimeSelected = selectedTime === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedTime(slot)}
                                className={`py-2 px-3 text-xs font-extrabold rounded-xl transition-all duration-150 ${
                                  isTimeSelected
                                    ? "bg-primary text-white ring-2 ring-primary/20 shadow-sm"
                                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-stone-100 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextToStep2}
                        disabled={!selectedDate || !selectedTime}
                        className="btn-gold px-6 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider disabled:opacity-50"
                      >
                        Next: Your Details ➜
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: DETAILS */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-primary-dark mb-1">Your Details</h3>
                      <p className="text-text-muted text-xs">Please provide your contact information and notes for the meeting.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="E.g., John Doe"
                          className="input-field w-full text-sm"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-1.5">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="E.g., name@example.com"
                            className="input-field w-full text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-1.5">Phone Number</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="E.g., +234..."
                            className="input-field w-full text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-1.5">Purpose of Session *</label>
                          <select
                            required
                            value={formData.topic}
                            onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                            className="input-field w-full text-sm bg-white"
                          >
                            <option value="">-- Choose Option --</option>
                            <option value="spiritual_counseling">Spiritual Counseling</option>
                            <option value="marriage_family">Marriage & Family Guidance</option>
                            <option value="prayer_request">Special Prayers & Blessing</option>
                            <option value="church_membership">Church Membership & Devotions</option>
                            <option value="other">Other Inquiry</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-1.5">Meeting Format</label>
                          <select
                            value={formData.meetingType}
                            onChange={(e) => setFormData(prev => ({ ...prev, meetingType: e.target.value as "in_person" | "video" }))}
                            className="input-field w-full text-sm bg-white"
                          >
                            <option value="in_person">In Person (Main Office)</option>
                            <option value="video">Video Call (Google Meet)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-primary-dark uppercase tracking-wider mb-1.5">Additional Notes</label>
                        <textarea
                          rows={3}
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Brief summary of your discussion points or special requests..."
                          className="input-field w-full text-sm resize-none"
                        />
                      </div>
                    </div>

                    {formError && (
                      <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                        ⚠️ {formError}
                      </p>
                    )}

                    <div className="pt-4 border-t border-stone-100 flex justify-between">
                      <button
                        type="button"
                        onClick={handleBackToStep1}
                        className="px-5 py-3 text-xs font-extrabold text-primary uppercase tracking-wider hover:text-primary-dark"
                      >
                        🠐 Back to Date
                      </button>
                      <button
                        type="button"
                        onClick={handleNextToStep3}
                        className="btn-gold px-6 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider"
                      >
                        Next: Confirm ➜
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: CONFIRMATION SUMMARY */}
                {currentStep === 3 && (
                  <form onSubmit={handleSubmitBooking} className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-primary-dark mb-1">Confirm and Book</h3>
                      <p className="text-text-muted text-xs">Review your appointment details below before booking.</p>
                    </div>

                    <div className="bg-bg border border-stone-200 rounded-2xl p-5 space-y-4">
                      <div className="border-b border-stone-200 pb-3">
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Appointment Time</p>
                        <p className="font-serif text-base font-black text-primary-dark">
                          {selectedDate?.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        <p className="text-sm font-semibold text-accent-dark">
                          ⏰ {selectedTime} ({formData.meetingType === "in_person" ? "In-Person Office" : "Video Call"})
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                        <div>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Your Name</p>
                          <p className="font-bold text-primary-dark">{formData.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Email Address</p>
                          <p className="font-bold text-primary-dark truncate">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Phone Number</p>
                          <p className="font-bold text-primary-dark">{formData.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Session Purpose</p>
                          <p className="font-bold text-primary-dark">
                            {formData.topic.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                          </p>
                        </div>
                      </div>

                      {formData.notes && (
                        <div className="pt-2 border-t border-stone-200">
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Brief Notes</p>
                          <p className="text-xs text-stone-600 whitespace-pre-wrap italic mt-0.5">{formData.notes}</p>
                        </div>
                      )}
                    </div>

                    {formError && (
                      <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                        ⚠️ {formError}
                      </p>
                    )}

                    <div className="pt-4 border-t border-stone-100 flex justify-between">
                      <button
                        type="button"
                        onClick={handleBackToStep2}
                        className="px-5 py-3 text-xs font-extrabold text-primary uppercase tracking-wider hover:text-primary-dark"
                      >
                        🠐 Back to Details
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-shine px-7 py-3.5 bg-primary text-white font-extrabold rounded-2xl hover:bg-primary-light transition-all text-xs uppercase tracking-wider disabled:opacity-50"
                      >
                        {submitting ? "Booking..." : "Confirm & Request Session ✓"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Col (1/3): Info Sidebar */}
            <div className="reveal space-y-6">
              {/* What to expect */}
              <div className="bg-primary-dark text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
                <h3 className="font-serif text-xl font-bold mb-4">What to Expect</h3>
                <div className="gold-divider mb-6" />
                <ul className="space-y-4 text-sm text-white/80">
                  <li className="flex gap-3">
                    <span className="text-accent text-lg">✦</span>
                    <p><strong>Confidential Environment:</strong> Your counseling topics, struggles, or requests are kept strictly private and safe.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent text-lg">✦</span>
                    <p><strong>Grace & Wisdom:</strong> Dr. Mosebolatan provides spiritual wisdom anchored in biblical truths and loving counsel.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent text-lg">✦</span>
                    <p><strong>Structured Support:</strong> Session formats are typically 30-45 minutes and focus heavily on healing, prayers, and clear guidance steps.</p>
                  </li>
                </ul>
              </div>

              {/* Service Times Sidebar reminder */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-primary-dark mb-2">Service Reminders</h3>
                <p className="text-xs text-text-muted mb-4">Please note our general fellowship hours as session availability may shift.</p>
                <div className="space-y-2 text-sm text-stone-600">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="font-semibold">Sunday Worship</span>
                    <span>09:00 AM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="font-semibold">Bible Study</span>
                    <span>Monday 05:00 PM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="font-semibold">Prayer Meeting</span>
                    <span>Wednesday 05:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Contact info card */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-primary-dark">Need Help Booking?</h3>
                <p className="text-xs text-stone-500">Reach out directly if you can&apos;t find suitable slots or need instant support.</p>
                <div className="space-y-3 text-xs sm:text-sm text-stone-600">
                  <p className="flex items-center gap-2">
                    <span>📞</span> <span>+234 803 XXX XXXX</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>✉️</span> <span>trinitybaptistchurchilora@gmail.com</span>
                  </p>
                </div>
                {/* Map placeholder */}
                <div className="h-28 bg-stone-100 rounded-2xl flex items-center justify-center border border-stone-200 text-xs text-stone-400">
                  🗺️ TBC Ilora Office Map Placeholder
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
