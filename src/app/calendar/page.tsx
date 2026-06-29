"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarEvent } from "@/types";
import { sampleCalendarEvents } from "@/lib/seed-data";
import { getDaysInMonth, getFirstDayOfMonth, getMonthName, formatDate } from "@/lib/utils";

const EVENT_TYPE_STYLES: Record<string, string> = {
  service: "bg-primary text-white",
  special: "bg-accent text-white",
  meeting: "bg-blue-600 text-white",
  fellowship: "bg-green-600 text-white",
  other: "bg-stone-500 text-white",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  service: "Service",
  special: "Special",
  meeting: "Meeting",
  fellowship: "Fellowship",
  other: "Other",
};

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events] = useState<CalendarEvent[]>(sampleCalendarEvents.map((e, i) => ({ ...e, id: `event-${i}` })));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    });
    return map;
  }, [events]);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date(today.toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <div className="pt-20">
        <div className="bg-primary-dark py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-serif text-3xl lg:text-5xl text-white font-bold mb-4 animate-fade-in-up">Church Calendar</h1>
            <p className="text-white/60 text-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Stay updated with all our upcoming events and activities
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="font-serif text-xl text-primary font-bold">
                    {getMonthName(currentMonth)} {currentYear}
                  </h2>
                  <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-text-muted uppercase py-2">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const dayEvents = eventsByDate[dateStr] || [];
                    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

                    return (
                      <button
                        key={day}
                        onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
                        className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-start transition-all ${
                          isToday
                            ? "bg-accent/10 ring-2 ring-accent font-bold"
                            : dayEvents.length > 0
                            ? "bg-stone-50 hover:bg-stone-100"
                            : "hover:bg-stone-50"
                        }`}
                      >
                        <span className={`text-sm ${isToday ? "text-accent" : "text-primary"}`}>{day}</span>
                        {dayEvents.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                            {dayEvents.slice(0, 3).map((e, ei) => (
                              <span key={ei} className={`w-1.5 h-1.5 rounded-full ${EVENT_TYPE_STYLES[e.type]?.split(" ")[0] || "bg-stone-400"}`} />
                            ))}
                            {dayEvents.length > 3 && <span className="text-[8px] text-text-muted">+</span>}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-stone-100">
                  {Object.entries(EVENT_TYPE_LABELS).map(([type, label]) => (
                    <div key={type} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${EVENT_TYPE_STYLES[type]?.split(" ")[0] || "bg-stone-400"}`} />
                      <span className="text-xs text-text-muted">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h3 className="font-serif text-lg text-primary font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left p-3 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${EVENT_TYPE_STYLES[event.type]?.split(" ")[0] || "bg-stone-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate">{event.title}</p>
                          <p className="text-xs text-text-muted">{formatDate(event.date)}</p>
                          {event.startTime && (
                            <p className="text-xs text-text-muted">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-text-muted hover:text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-3 ${EVENT_TYPE_STYLES[selectedEvent.type] || "bg-stone-500 text-white"}`}>
              {EVENT_TYPE_LABELS[selectedEvent.type] || "Event"}
            </span>
            <h3 className="font-serif text-xl text-primary font-bold mb-2">{selectedEvent.title}</h3>
            <p className="text-text-muted text-sm mb-4">{formatDate(selectedEvent.date)}</p>
            {selectedEvent.startTime && (
              <p className="text-sm text-text mb-1 flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {selectedEvent.startTime}{selectedEvent.endTime ? ` - ${selectedEvent.endTime}` : ""}
              </p>
            )}
            {selectedEvent.location && (
              <p className="text-sm text-text mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selectedEvent.location}
              </p>
            )}
            {selectedEvent.description && <p className="text-sm text-text-muted">{selectedEvent.description}</p>}
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
