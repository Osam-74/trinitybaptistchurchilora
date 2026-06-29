"use client";

import {useState} from "react";
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

export default function BookPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", topic: "", meetingType: "in_person" as "in_person" | "video" });

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
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null); setSelectedTime(null); setShowForm(false);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null); setSelectedTime(null); setShowForm(false);
  };

  const handleDayClick = (day: number) => {
    if (!isAvailable(day)) return;
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setSelectedTime(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              BOOK A SESSION
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Meet the <span className="text-gradient-gold">Pastor</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Schedule a one-on-one session with Rev&apos;d Dr S. O. Mosebolatan
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {submitted ? (
          <div className="max-w-xl mx-auto text-center py-20 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="font-serif text-3xl font-bold text-primary mb-3">Booking Requested!</h2>
            <p className="text-text-muted mb-2">
              Your session with Rev&apos;d Dr S. O. Mosebolatan has been requested for:
            </p>
            <p className="font-semibold text-primary text-lg mb-6">
              {selectedDate?.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at {selectedTime}
            </p>
            <p className="text-text-muted text-sm mb-8">A confirmation will be sent to <strong>{formData.email}</strong> once approved.</p>
            <button onClick={() => { setSubmitted(false); setSelectedDate(null); setSelectedTime(null); setShowForm(false); setFormData({ name:"", email:"", phone:"", topic:"", meetingType:"in_person" }); }}
              className="btn-gold px-8 py-3.5 rounded-xl font-semibold">
              Book Another Session
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Calendar column */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
                {/* Calendar header */}
                <div className="bg-primary p-6 flex items-center justify-between">
                  <button onClick={prevMonth} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <div className="text-center">
                    <p className="text-accent text-xs font-semibold uppercase tracking-wider">{viewYear}</p>
                    <h3 className="text-white font-serif text-2xl font-bold">{MONTHS[viewMonth]}</h3>
                  </div>
                  <button onClick={nextMonth} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>

                <div className="p-5">
                  {/* Day labels */}
                  <div className="grid grid-cols-7 mb-2">
                    {DAYS_SHORT.map(d => (
                      <div key={d} className="text-center text-xs font-semibold text-text-muted py-2">{d}</div>
                    ))}
                  </div>
                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`}/>)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const avail = isAvailable(day);
                      const tod = isToday(day);
                      const sel = isSelected(day);
                      return (
                        <button
                          key={day}
                          onClick={() => handleDayClick(day)}
                          disabled={!avail}
                          className={`calendar-day h-10 flex items-center justify-center text-sm font-medium mx-auto w-full
                            ${sel ? "calendar-day selected" : ""}
                            ${tod && !sel ? "calendar-day today" : ""}
                            ${avail && !sel ? "calendar-day available text-primary hover:text-primary-dark" : ""}
                            ${!avail ? "calendar-day disabled text-stone-300" : ""}
                          `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone-100 text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-md bg-accent/15 border border-accent/40"/>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-md" style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c97a)' }}/>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-md bg-stone-100 border border-stone-200"/>
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div className="mt-6 bg-white rounded-3xl shadow-sm border border-stone-100 p-6 animate-fade-in-up">
                  <h3 className="font-serif text-lg font-bold text-primary mb-4">
                    Available Times —{" "}
                    <span className="text-accent">{selectedDate.toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })}</span>
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {TIME_SLOTS.map(time => (
                      <button
                        key={time}
                        onClick={() => { setSelectedTime(time); setShowForm(true); }}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                          selectedTime === time
                            ? "bg-accent text-primary-dark border-accent shadow-md"
                            : "border-stone-200 text-text-muted hover:border-accent hover:text-accent hover:bg-accent/5"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form / Info column */}
            <div className="lg:col-span-2">
              {/* Pastor card */}
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-primary-dark font-bold text-xl shadow-lg">
                    RM
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-primary">Rev&apos;d Dr S. O. Mosebolatan</h3>
                    <p className="text-accent text-sm font-medium">Senior Pastor</p>
                    <p className="text-text-muted text-xs">Trinity Baptist Church, Ilora</p>
                  </div>
                </div>
                <div className="gold-divider mb-4"/>
                <div className="space-y-2 text-sm text-text-muted">
                  {[
                    { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: "30-minute sessions" },
                    { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", text: "Mon – Thu available" },
                    { icon: "M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", text: "In-person or video call" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                      </svg>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking form */}
              {showForm && selectedDate && selectedTime && (
                <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 animate-fade-in-up">
                  <div className="flex items-center gap-2 bg-accent/10 rounded-xl px-4 py-2.5 mb-5 border border-accent/20">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span className="text-sm font-semibold text-accent">
                      {selectedDate.toLocaleDateString("en-NG", { month: "short", day: "numeric" })} at {selectedTime}
                    </span>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { label: "Full Name *", key: "name", type: "text", required: true },
                      { label: "Email Address *", key: "email", type: "email", required: true },
                      { label: "Phone Number", key: "phone", type: "tel", required: false },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">{f.label}</label>
                        <input type={f.type} required={f.required} value={(formData as unknown)[f.key]}
                          onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                          className="input-field"/>
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Topic / Purpose *</label>
                      <textarea value={formData.topic} onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))} required rows={3}
                        placeholder="What would you like to discuss?" className="input-field resize-none"/>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-2 uppercase tracking-wide">Meeting Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {([["in_person", "In Person", "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"], ["video", "Video Call", "M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"]] as [string, string, string][]).map(([value, label, icon]) => (
                          <button type="button" key={value} onClick={() => setFormData(prev => ({ ...prev, meetingType: value as unknown }))}
                            className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all text-sm font-medium ${
                              formData.meetingType === value ? "border-accent bg-accent/8 text-primary" : "border-stone-200 text-text-muted hover:border-accent/40"
                            }`}>
                            <svg className={`w-5 h-5 ${formData.meetingType === value ? "text-accent" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon}/>
                            </svg>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="w-full btn-shine btn-gold py-4 rounded-2xl font-bold text-base mt-2">
                      Confirm Booking
                    </button>
                  </form>
                </div>
              )}

              {!showForm && (
                <div className="bg-accent/5 border-2 border-dashed border-accent/30 rounded-3xl p-6 text-center">
                  <svg className="w-10 h-10 text-accent/50 mx-auto mb-3 animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p className="text-text-muted text-sm">{selectedDate ? "Select a time slot to continue" : "Select an available date on the calendar"}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
