"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Activity } from "@/types";
import { sampleActivities } from "@/lib/seed-data";
import { formatTime, getWeekdayName } from "@/lib/utils";

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

export default function ActivitiesPage() {
  useScrollReveal();
  const [activities] = useState<Activity[]>(
    sampleActivities.map((a, i) => ({ ...a, id: `activity-${i}` }))
  );
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  const todayNum = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.

  // Group activities by weekday (0 to 6)
  const activitiesByDay = Array.from({ length: 7 }, (_, dayIndex) => {
    return {
      dayIndex,
      dayName: getWeekdayName(dayIndex),
      dayActivities: activities.filter((act) => act.weekday === dayIndex),
    };
  });

  // Find if today has an activity for "Today's Highlight"
  const todayActivities = activities.filter((act) => act.weekday === todayNum);
  const featuredActivity = todayActivities.length > 0 ? todayActivities[0] : null;

  return (
    <main className="min-h-screen bg-bg text-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-primary-dark pt-32 pb-24 overflow-hidden pattern-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,230,58,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="reveal inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-6 text-accent-light text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
            Weekly Fellowship
          </div>
          <h1 className="reveal font-display text-4xl sm:text-5xl lg:text-7xl text-white font-bold tracking-tight mb-6">
            Weekly Activities & <span className="text-gradient-gold">Schedule</span>
          </h1>
          <p className="reveal text-white/75 text-lg sm:text-xl max-w-3xl mx-auto font-sans leading-relaxed">
            Join our vibrant church community throughout the week as we study God&apos;s Word, lift our voices in prayer, and fellowship with one another.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Today's Highlight */}
        {featuredActivity && (
          <section className="reveal max-w-4xl mx-auto">
            <div className="bg-primary border-2 border-accent rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden card-hover">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-1 bg-accent text-primary-dark text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 animate-bounce">
                    ⚡ Today&apos;s Highlight
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl text-white font-bold mb-3">
                    {featuredActivity.title}
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base max-w-2xl mb-6">
                    {featuredActivity.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-white/90">
                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(featuredActivity.startTime)} - {formatTime(featuredActivity.endTime)}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {featuredActivity.location}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href="#schedule-grid"
                    className="btn-gold inline-flex items-center gap-2 text-primary-dark font-bold px-6 py-3.5 rounded-2xl text-sm"
                  >
                    View Schedule
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Weekly Schedule Grid */}
        <section id="schedule-grid" className="space-y-10">
          <div className="reveal text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl text-primary-dark font-bold mb-3">
              Weekly Schedule Grid
            </h2>
            <div className="gold-divider mx-auto mb-4" />
            <p className="text-text-muted text-sm sm:text-base">
              Explore our full weekly roster. Today&apos;s column is specially highlighted to help you find active meetings.
            </p>
          </div>

          {/* Desktop: 7 Columns Grid | Mobile: Vertical list */}
          <div className="reveal grid grid-cols-1 md:grid-cols-7 gap-4 items-start">
            {activitiesByDay.map(({ dayIndex, dayName, dayActivities }) => {
              const isTodayColumn = dayIndex === todayNum;

              return (
                <div
                  key={dayIndex}
                  className={`rounded-2xl transition-all duration-300 p-4 ${
                    isTodayColumn
                      ? "bg-accent-light/10 border-2 border-accent ring-4 ring-accent/10 shadow-md transform -translate-y-1"
                      : "bg-white border border-stone-200"
                  }`}
                >
                  <div className="pb-3 mb-4 border-b border-stone-200 text-center">
                    <p className={`text-xs font-bold uppercase tracking-wider ${isTodayColumn ? "text-primary" : "text-text-muted"}`}>
                      {isTodayColumn ? "Today" : dayName.slice(0, 3)}
                    </p>
                    <h3 className={`font-serif text-lg font-extrabold ${isTodayColumn ? "text-primary-dark" : "text-primary"}`}>
                      {dayName}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {dayActivities.length > 0 ? (
                      dayActivities.map((act) => {
                        return (
                          <div
                            key={act.id}
                            className="bg-bg rounded-xl p-3 border border-stone-100 shadow-sm hover:shadow-md transition-all duration-200 text-left relative overflow-hidden group"
                          >
                            {isTodayColumn && (
                              <div className="absolute top-0 right-0 flex items-center justify-center">
                                <span className="text-[9px] font-extrabold text-primary bg-accent px-1.5 py-0.5 rounded-bl-lg tracking-wider animate-pulse uppercase">
                                  Today
                                </span>
                              </div>
                            )}
                            <p className="text-[10px] font-semibold text-primary tracking-wider uppercase mb-1">
                              ⏰ {formatTime(act.startTime)}
                            </p>
                            <h4 className="font-serif font-bold text-sm text-primary-dark line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                              {act.title}
                            </h4>
                            <p className="text-[11px] text-text-muted line-clamp-2 mb-2">
                              {act.description}
                            </p>
                            <div className="flex items-center justify-between gap-1.5 mt-2">
                              <span className="text-[9px] bg-primary-light/15 text-primary-light px-2 py-0.5 rounded-md font-semibold truncate">
                                📍 {act.location}
                              </span>
                              <span className="text-[9px] bg-stone-200/60 text-stone-700 px-1.5 py-0.5 rounded-md font-medium shrink-0">
                                {act.location.toLowerCase().includes("hall") ? "Hall" : act.location.toLowerCase().includes("sanctuary") ? "Sanctuary" : "Room"}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-xs text-stone-400 py-6 italic">
                        No activities scheduled
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="reveal max-w-4xl mx-auto">
          <div className="bg-primary-dark rounded-3xl p-8 sm:p-12 shadow-xl border border-white/5 relative overflow-hidden text-center">
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl sm:text-4xl text-white font-bold mb-4">
                Stay Updated with Weekly Reminders
              </h3>
              <p className="text-white/70 text-sm sm:text-base mb-8">
                Get our full weekly activity schedules, sermon guides, and special notices delivered straight to your inbox every Saturday morning.
              </p>

              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-4 bg-white/5 border border-white/15 focus:border-accent text-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 placeholder-white/40 transition-colors"
                  />
                  <button
                    type="submit"
                    className="btn-shine px-7 py-4 bg-accent text-primary-dark font-extrabold rounded-2xl hover:bg-accent-light transition-all text-sm shadow-md"
                  >
                    Subscribe Now
                  </button>
                </form>
              ) : (
                <div className="text-center animate-scale-in bg-white/5 border border-accent/20 rounded-2xl py-4 px-6 max-w-md mx-auto">
                  <div className="inline-flex items-center gap-2.5 text-accent font-bold">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Subscription Confirmed! See you on Saturday.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
