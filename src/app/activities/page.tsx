"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Activity } from "@/types";
import { sampleActivities } from "@/lib/seed-data";
import { formatTime, getWeekdayName } from "@/lib/utils";

export default function ActivitiesPage() {
  const [activities] = useState<Activity[]>(sampleActivities.map((a, i) => ({ ...a, id: `activity-${i}` })));
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  const today = new Date().getDay();

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <div className="pt-20">
        <div className="bg-primary-dark py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="font-serif text-3xl lg:text-5xl text-white font-bold mb-4 animate-fade-in-up">Weekly Activities</h1>
            <p className="text-white/60 text-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Join us throughout the week for fellowship, study, and prayer
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="space-y-4">
            {activities.map((activity, i) => {
              const isToday = activity.weekday === today;
              return (
                <div
                  key={activity.id}
                  className={`bg-white rounded-2xl p-6 shadow-sm border transition-all card-hover animate-fade-in-up ${
                    isToday ? "border-accent ring-1 ring-accent/20" : "border-stone-200"
                  }`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${isToday ? "bg-accent text-white" : "bg-accent/10 text-accent"}`}>
                      <span className="text-2xl font-bold font-serif">{getWeekdayName(activity.weekday).slice(0, 2)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-serif text-lg text-primary font-bold">{activity.title}</h3>
                        {isToday && (
                          <span className="bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-full">Today</span>
                        )}
                      </div>
                      <p className="text-text-muted text-sm">{activity.description}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-text">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {activity.location}
                        </span>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="flex-shrink-0 text-sm text-accent font-medium hover:underline flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add to Calendar
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-sm border border-stone-200 p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-primary font-bold">Weekly Reminders</h3>
              <p className="text-text-muted text-sm mt-1">Get our weekly schedule delivered to your inbox every Saturday</p>
            </div>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-sm"
                />
                <button
                  type="submit"
                  className="btn-shine px-6 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent-dark transition-colors text-sm"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="text-center animate-fade-in">
                <div className="inline-flex items-center gap-2 text-green-600 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  You&apos;re subscribed! Check your inbox on Saturdays.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
