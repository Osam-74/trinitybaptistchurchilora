"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CalendarEvent } from "@/types";
import { sampleCalendarEvents } from "@/lib/seed-data";
import { getDaysInMonth, getFirstDayOfMonth, getMonthName, formatDate } from "@/lib/utils";

const EVENT_TYPE_STYLES: Record<string, string> = {
  service: "bg-primary text-white border-primary",
  special: "bg-amber-600 text-white border-amber-600",
  meeting: "bg-blue-600 text-white border-blue-600",
  fellowship: "bg-green-600 text-white border-green-600",
  other: "bg-stone-500 text-white border-stone-500",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  service: "Service",
  special: "Special",
  meeting: "Meeting",
  fellowship: "Fellowship",
  other: "Other",
};

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

export default function CalendarPage() {
  useScrollReveal();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events] = useState<CalendarEvent[]>(
    sampleCalendarEvents.map((e, i) => ({ ...e, id: `event-${i}` }))
  );
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDayNum, setSelectedDayNum] = useState<number | null>(today.getDate());

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
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDayNum(null);
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDayNum(null);
    setSelectedEvent(null);
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  // Filter events scheduled on the selected day
  const selectedDateStr = selectedDayNum
    ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDayNum).padStart(2, "0")}`
    : null;
  const selectedDayBookings = selectedDateStr ? eventsByDate[selectedDateStr] || [] : [];

  // Next 5 upcoming events for the compact sidebar/list
  const next5Events = useMemo(() => {
    return events
      .filter((e) => new Date(e.date) >= new Date(today.toDateString()))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [events, today]);

  return (
    <main className="min-h-screen bg-bg text-primary">
      <Navbar />

      {/* Hero: Simple compact header */}
      <section className="bg-primary-dark pt-32 pb-16 overflow-hidden pattern-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="reveal inline-flex items-center gap-2 glass-card rounded-full px-4 py-1 mb-4 text-accent-light text-xs font-semibold uppercase tracking-wider">
            📅 Monthly Calendar
          </div>
          <h1 className="reveal font-display text-3xl sm:text-5xl text-white font-bold tracking-tight">
            Church <span className="text-gradient-gold">Calendar</span>
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar main panel (Col-span 2) */}
          <div className="reveal lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={prevMonth}
                  className="w-10 h-10 rounded-xl bg-bg hover:bg-stone-150 flex items-center justify-center text-primary border border-stone-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="font-serif text-2xl text-primary-dark font-black tracking-tight uppercase">
                  {getMonthName(currentMonth)} {currentYear}
                </h2>
                <button
                  onClick={nextMonth}
                  className="w-10 h-10 rounded-xl bg-bg hover:bg-stone-150 flex items-center justify-center text-primary border border-stone-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* 7-column Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-text-muted uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                  <div key={dayName} className="py-2">{dayName}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, i) => {
                  if (day === null) {
                    return <div key={`empty-${i}`} className="aspect-square bg-stone-50/20 rounded-xl border border-transparent" />;
                  }

                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dayEvents = eventsByDate[dateStr] || [];
                  const hasEvents = dayEvents.length > 0;

                  const isCurrentDay =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();

                  const isSelectedDay = selectedDayNum === day;

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDayNum(day);
                        if (hasEvents) {
                          setSelectedEvent(dayEvents[0]);
                        } else {
                          setSelectedEvent(null);
                        }
                      }}
                      className={`calendar-day aspect-square rounded-2xl flex flex-col justify-between p-2.5 transition-all duration-200 relative group
                        ${
                          isSelectedDay
                            ? "bg-accent text-primary-dark ring-2 ring-accent font-black shadow-md scale-105"
                            : isCurrentDay
                            ? "bg-primary/5 border-2 border-accent text-primary-dark font-bold"
                            : hasEvents
                            ? "bg-bg border border-stone-200 text-primary hover:bg-stone-50"
                            : "bg-white border border-stone-100 text-stone-600 hover:bg-stone-50"
                        }
                      `}
                    >
                      <span className="text-sm font-extrabold">{day}</span>

                      {/* Event Dot Indicators */}
                      {hasEvents && (
                        <div className="flex flex-wrap gap-1 justify-center w-full mt-auto pt-1">
                          {dayEvents.slice(0, 3).map((ev, evIdx) => (
                            <span
                              key={evIdx}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelectedDay ? "bg-primary-dark" : "bg-primary-light"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legends */}
              <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-stone-100 text-xs font-semibold text-text-muted">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-lg bg-bg border border-stone-200" />
                  <span>Has Events</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-lg bg-primary/5 border-2 border-accent" />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-lg bg-accent" />
                  <span>Selected</span>
                </div>
              </div>
            </div>

            {/* Selected Date's Bookings/Events */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8">
              <h3 className="font-serif text-xl font-bold text-primary-dark mb-4">
                Events on {selectedDateStr ? formatDate(selectedDateStr) : "Selected Day"}
              </h3>
              {selectedDayBookings.length === 0 ? (
                <p className="text-sm text-text-muted italic">No events scheduled on this day.</p>
              ) : (
                <div className="space-y-4">
                  {selectedDayBookings.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-sm
                        ${
                          selectedEvent?.id === event.id
                            ? "bg-primary/5 border-primary/20"
                            : "bg-stone-50/50 border-stone-100"
                        }
                      `}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md mb-2 ${EVENT_TYPE_STYLES[event.type] || "bg-stone-600 text-white"}`}>
                            {EVENT_TYPE_LABELS[event.type] || event.type}
                          </span>
                          <h4 className="font-serif text-lg font-bold text-primary-dark">{event.title}</h4>
                          <p className="text-xs text-text-muted mt-1">Time: {event.startTime}</p>
                          {event.location && <p className="text-xs text-text-muted">Location: {event.location}</p>}
                        </div>
                        <button className="text-primary hover:text-accent font-semibold text-xs shrink-0">
                          View Details &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area (Col-span 1) */}
          <div className="space-y-6">
            {/* Event Detail Card (active selection) */}
            {selectedEvent && (
              <div className="reveal bg-white rounded-3xl shadow-sm border border-stone-200 p-6 space-y-4">
                <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md ${EVENT_TYPE_STYLES[selectedEvent.type] || "bg-stone-600 text-white"}`}>
                  {EVENT_TYPE_LABELS[selectedEvent.type] || selectedEvent.type}
                </span>
                <h3 className="font-serif text-2xl font-bold text-primary-dark leading-snug">
                  {selectedEvent.title}
                </h3>
                <div className="space-y-2 text-sm text-text-muted border-t border-b border-stone-100 py-4 my-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{selectedEvent.startTime}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4.5 h-4.5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
                {selectedEvent.description && (
                  <p className="text-sm text-text-muted leading-relaxed">
                    {selectedEvent.description}
                  </p>
                )}
              </div>
            )}

            {/* Upcoming List */}
            <div className="reveal bg-white rounded-3xl shadow-sm border border-stone-200 p-6">
              <h3 className="font-serif text-xl font-bold text-primary-dark mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {next5Events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => {
                      const dateObj = new Date(event.date);
                      setCurrentMonth(dateObj.getMonth());
                      setCurrentYear(dateObj.getFullYear());
                      setSelectedDayNum(dateObj.getDate());
                      setSelectedEvent(event);
                    }}
                    className="flex gap-4 items-start p-3 hover:bg-stone-50 rounded-2xl cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex flex-col items-center justify-center shrink-0 border border-stone-100">
                      <span className="text-[10px] uppercase font-bold text-[#0D4A35]">
                        {new Date(event.date).toLocaleString("default", { month: "short" })}
                      </span>
                      <span className="text-base font-black text-primary-dark -mt-1">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif text-sm font-bold text-primary-dark truncate">{event.title}</h4>
                      <p className="text-xs text-text-muted truncate mt-0.5">{event.startTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
