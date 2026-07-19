"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { listLeaders, defaultLeaders } from "@/lib/leaders";
import { listApprovedMembers } from "@/lib/choir";
import { Leader, ChoirMember } from "@/types";
import SignUpModal from "@/components/SignUpModal";

export default function TeamPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [choirMembers, setChoirMembers] = useState<ChoirMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingChoir, setLoadingChoir] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    listLeaders()
      .then((data) => {
        const active = data.filter((l) => l.active);
        // Bugfix: set leaders to active (which is the filtered active leaders), not data (which has all of them).
        setLeaders(active.length > 0 ? active : defaultLeaders);
        setLoading(false);
      })
      .catch(() => {
        setLeaders(defaultLeaders);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    listApprovedMembers()
      .then((data) => {
        setChoirMembers(data || []);
        setLoadingChoir(false);
      })
      .catch((err) => {
        console.error("Error loading approved choir members:", err);
        setChoirMembers([]);
        setLoadingChoir(false);
      });
  }, []);

  // Pastor is the featured first element (or finding Rev'd Dr S. O. Mosebolatan)
  const leadPastor = leaders.find((l) => l.role.toLowerCase().includes("senior pastor")) || leaders[0] || defaultLeaders[0];
  const otherLeaders = leaders.filter((l) => l.id !== leadPastor?.id);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              CHURCH EXECUTIVES
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Church <span className="text-gradient-gold">Leadership</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Dedicated executives and spiritual leaders shepherding and serving the flock of God with holy diligence.
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pastor Featured Large Card */}
          {leadPastor && (
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/50 shadow-xl mb-16 p-8 lg:p-12 relative group card-hover">
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5 h-[340px] rounded-3xl overflow-hidden relative shadow-md bg-primary-dark">
                  <img
                    src={leadPastor.photoUrl}
                    alt={leadPastor.name}
                    className="w-full h-full object-cover img-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent" />
                </div>
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <span className="bg-accent text-primary-dark text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-3">
                    {leadPastor.role}
                  </span>
                  <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary mb-4">
                    {leadPastor.name}
                  </h2>
                  <p className="text-stone-700 leading-relaxed text-sm lg:text-base mb-6">
                    {leadPastor.bio}
                  </p>
                  <p className="text-accent-dark font-semibold text-xs uppercase tracking-wider">
                    Trinity Baptist Church, Ilora • Senior Leadership
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rest of leadership in 3-column grid */}
          <div className="mb-24">
            <h3 className="font-serif text-2xl font-bold text-primary mb-8 text-center lg:text-left">
              Church <span className="text-gradient-gold">Council &amp; Officers</span>
            </h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherLeaders.map((leader) => (
                  <div
                    key={leader.id}
                    className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:border-accent transition-all duration-300 card-hover group"
                  >
                    <div className="relative h-56 bg-primary-dark overflow-hidden">
                      <img
                        src={leader.photoUrl}
                        alt={leader.name}
                        className="w-full h-full object-cover img-zoom"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-accent text-primary-dark text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {leader.role}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-serif text-lg font-bold text-primary mb-2">{leader.name}</h4>
                      <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">
                        {leader.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Choir & Media Team Members Section */}
          <div className="mb-24 pt-16 border-t border-stone-200">
            <div className="text-center mb-12">
              <span className="text-primary-light text-xs font-bold uppercase tracking-widest">MINISTRY TEAM</span>
              <h3 className="font-serif text-3xl font-bold text-primary mt-1">Choir &amp; Media Team Members</h3>
              <p className="text-stone-600 text-sm mt-2">The gifted voices, hands, and hearts ministering before His altar.</p>
            </div>

            {loadingChoir ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : choirMembers.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {choirMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:border-accent transition-all duration-300 card-hover group"
                  >
                    <div className="relative h-48 bg-primary-dark overflow-hidden">
                      <img
                        src={member.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                        alt={member.fullName}
                        className="w-full h-full object-cover img-zoom"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-transparent to-transparent" />
                      {member.section && (
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-accent text-primary-dark text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {member.section}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif text-base font-bold text-primary mb-1">{member.fullName}</h4>
                      <p className="text-stone-500 text-xs font-semibold mb-2">{member.department}</p>
                      {member.bio && (
                        <p className="text-stone-600 text-xs leading-relaxed line-clamp-2 italic">
                          &ldquo;{member.bio}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 max-w-xl mx-auto">
                <p className="text-stone-500 text-sm font-semibold">No members approved yet</p>
              </div>
            )}

            <div className="mt-12 text-center">
              <button
                onClick={() => setShowSignup(true)}
                className="btn-gold px-8 py-3.5 rounded-xl font-bold text-sm cursor-pointer shadow-md hover:scale-105 transition-transform"
              >
                Join the Team
              </button>
            </div>
          </div>

          {/* Departments Section */}
          <div className="mb-24 pt-16 border-t border-stone-200">
            <div className="text-center mb-12">
              <span className="text-primary-light text-xs font-bold uppercase tracking-widest">MINISTRY WINGS</span>
              <h3 className="font-serif text-3xl font-bold text-primary mt-1">Our Departments</h3>
              <p className="text-stone-600 text-sm mt-2">Serving and lifting up the body of Christ in diverse functions.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Choir & Music Ministry */}
              <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm card-hover">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h4 className="font-serif text-xl font-bold text-primary mb-3">Choir &amp; Music Ministry</h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Leading the congregation into deep, glorious worship and celestial adoration through praise, hymns, and spiritual songs.
                </p>
              </div>

              {/* Technical Team */}
              <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm card-hover">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-serif text-xl font-bold text-primary mb-3">Technical &amp; Media Team</h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Powering the streaming, sound reinforcement, and digital media to transmit the clear gospel to a global and local audience.
                </p>
              </div>

              {/* Ushering Department */}
              <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm card-hover">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="font-serif text-xl font-bold text-primary mb-3">Ushering Department</h4>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Welcoming souls into God&apos;s house with exceptional hospitality, maintaining order, and providing comfort during worship services.
                </p>
              </div>
            </div>
          </div>

          {/* Join the Team CTA */}
          <div className="bg-primary-dark rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden text-center shadow-lg">
            <div className="absolute inset-0 pattern-overlay opacity-10" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="font-serif text-2xl lg:text-3xl font-bold mb-4">Want to Serve God With Your Talents?</h3>
              <p className="text-white/70 text-sm lg:text-base mb-8">
                If you have a calling or desire to serve in any of our departments, we welcome you to join us in bringing glory to His sanctuary.
              </p>
              <button
                onClick={() => setShowSignup(true)}
                className="btn-shine btn-gold px-8 py-3.5 rounded-xl font-bold inline-block text-primary-dark cursor-pointer shadow-md hover:scale-105 transition-transform"
              >
                Apply to Join a Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SignUpModal */}
      {showSignup && (
        <SignUpModal dept="Choir" onClose={() => setShowSignup(false)} />
      )}

      <Footer />
    </main>
  );
}
