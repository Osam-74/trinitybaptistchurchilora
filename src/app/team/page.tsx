"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { listApprovedMembers } from "@/lib/choir";
import { ChoirMember } from "@/types";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); } }); },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function TeamDirectoryPage() {
  useScrollReveal();
  const [members, setMembers] = useState<ChoirMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState<string>("loading...");

  useEffect(() => {
    listApprovedMembers()
      .then(data => {
        setMembers(data);
        setLoading(false);
        setDebug(`fetched ${data.length} approved members`);
      })
      .catch(err => {
        setLoading(false);
        setDebug(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
      });
  }, []);

  // Group by department
  const departments = members.reduce<Record<string, ChoirMember[]>>((acc, m) => {
    const dept = m.department || "Choir";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(m);
    return acc;
  }, {});

  const deptOrder = ["Choir", "Instrumentalist", "Media Team"];
  const sortedDepts = Object.keys(departments).sort((a, b) => {
    const ia = deptOrder.indexOf(a); const ib = deptOrder.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              OUR TEAM
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Choir &amp; <span className="text-gradient-gold">Media Team</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Meet the gifted individuals who lead our worship and media ministry.
            </p>
          </div>
        </div>
      </div>

      {/* TEMP DEBUG — remove once directory display is confirmed working */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <p className="text-xs font-mono bg-accent/10 text-primary border border-accent/30 rounded-lg px-3 py-2 text-center">
          [debug] {debug} — build 2026-07-03
        </p>
      </div>

      {/* Directory */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"/>
            </div>
          )}

          {!loading && members.length === 0 && (
            <div className="text-center py-16">
              <p className="text-text-muted text-lg">Team directory will be displayed here once members are approved.</p>
            </div>
          )}

          {sortedDepts.map((dept, di) => (
            <div key={dept} className="mb-12" style={{ animationDelay: `${di * 0.1}s` }}>
              <h2 className="font-serif text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                <span className="w-1 h-7 bg-accent rounded-full"/>
                {dept}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {departments[dept].map((m) => (
                  <div key={m.id} className="text-center group">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-primary/10 group-hover:scale-105 transition-transform duration-300"/>
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt={m.fullName} className="w-full h-full object-cover"/>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <svg className="w-14 h-14 text-primary/30" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-serif text-sm font-bold text-primary leading-tight">{m.fullName}</h3>
                    {m.section && (
                      <p className="text-primary-light text-xs font-medium mt-1">{m.section}</p>
                    )}
                    <p className="text-text-muted text-xs mt-0.5">{m.department}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
