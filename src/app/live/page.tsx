"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sampleStreams } from "@/lib/seed-data";
import { LiveStream } from "@/types";
import { formatDate } from "@/lib/utils";

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

export default function LivePage() {
  useScrollReveal();
  const [streams] = useState<LiveStream[]>(
    sampleStreams.map((s, i) => ({ ...s, id: `stream-${i}` }))
  );

  const liveStream = streams.find(s => s.status === "live");
  const upcoming = streams.filter(s => s.status === "scheduled");

  // Filter past stream replays for past streams list

  return (
    <main className="min-h-screen bg-bg text-primary">
      <Navbar />

      {/* Hero / Main Stream Area */}
      <section className="bg-primary-dark pt-28 pb-12 overflow-hidden pattern-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {liveStream ? (
            <div className="reveal inline-flex items-center gap-2 bg-red-600 text-white rounded-full px-5 py-2 mb-6 text-sm font-black tracking-widest animate-pulse">
              <span className="w-2.5 h-2.5 bg-white rounded-full" />
              LIVE NOW
            </div>
          ) : (
            <div className="reveal inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent-light text-xs font-semibold uppercase tracking-wider">
              <svg className="w-4 h-4 animate-spin text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sermon Broadcasts
            </div>
          )}

          <h1 className="reveal font-display text-4xl sm:text-6xl text-white font-bold tracking-tight mb-4">
            {liveStream ? (
              <span>Join Our <span className="text-red-500">Live Service</span></span>
            ) : (
              <span>Watch <span className="text-gradient-gold">Online Broadcasts</span></span>
            )}
          </h1>
          <p className="reveal text-white/70 text-lg max-w-2xl mx-auto mb-8 font-sans">
            {liveStream ? liveStream.title : "Experience worship, prayer, and life-changing sermon replays from Trinity Baptist Church."}
          </p>

          {/* Full-width Video Embed Area */}
          <div className="reveal max-w-5xl mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5 relative aspect-video">
            {liveStream ? (
              <iframe
                src={liveStream.embedUrl.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={liveStream.title}
              />
            ) : (
              /* If not live: show countdown or last sermon replay */
              <div className="w-full h-full relative flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,rgba(13,74,53,0.8),rgba(11,44,34,1))]">
                <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200')]" />
                <div className="relative z-10 max-w-md text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center mx-auto animate-bounce text-3xl">
                    ⏱️
                  </div>
                  <h3 className="font-serif text-2xl text-white font-bold">Next Service Countdown</h3>
                  <p className="text-white/70 text-sm">
                    Our streams start automatically on Sundays at 7:30 AM & 10:00 AM. Tune in to worship with us live!
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://youtube.com/@trinitybaptistilora"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold inline-flex items-center gap-2 text-primary-dark font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md"
                    >
                      Visit YouTube Channel
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section below video */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Service Info Strip & CTA */}
          <div className="reveal lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-primary-dark mb-2">Live Stream Schedule</h3>
                <p className="text-xs text-text-muted">Set a reminder to join our online community every week.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-bg border border-stone-150 p-4 rounded-2xl">
                  <span className="text-lg">🌅</span>
                  <h4 className="font-bold text-primary-dark mt-2">Sunday First Service</h4>
                  <p className="text-xs text-text-muted mt-1">Sundays at 07:30 AM (WAT)</p>
                </div>
                <div className="bg-bg border border-stone-150 p-4 rounded-2xl">
                  <span className="text-lg">☀️</span>
                  <h4 className="font-bold text-primary-dark mt-2">Sunday Second Service</h4>
                  <p className="text-xs text-text-muted mt-1">Sundays at 10:00 AM (WAT)</p>
                </div>
              </div>

              {/* In Person CTA card */}
              <div className="bg-primary text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
                <h4 className="font-serif text-xl font-bold mb-2">Join Us In Person</h4>
                <p className="text-white/85 text-xs sm:text-sm mb-6 leading-relaxed">
                  While online streams are beautiful, fellowship shines brightest in person. Meet us at Trinity Baptist Church, Ilora, Oyo State, Nigeria.
                </p>
                <a
                  href="/contact"
                  className="btn-gold inline-flex items-center gap-1.5 text-primary-dark font-extrabold px-5 py-3 rounded-xl text-xs uppercase tracking-wider"
                >
                  Get Directions ➜
                </a>
              </div>
            </div>
          </div>

          {/* Prayer Request & Chat sidebar-style section */}
          <div className="reveal">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
                🙏
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-primary-dark mb-1">Need Prayer?</h3>
                <p className="text-stone-500 text-xs">Our intercessors are standing by to lift up your requests during or after the service broadcasts.</p>
              </div>

              <div className="bg-bg border border-stone-150 rounded-2xl p-4 space-y-3">
                <p className="text-xs text-stone-600">
                  Submit a confidential prayer request and our ministerial team will hold you up in spiritual prayers.
                </p>
                <a
                  href="/contact"
                  className="btn-primary block text-center font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-sm"
                >
                  Send Prayer Request
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Streams Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        <div className="reveal text-center max-w-xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-primary-dark">Past Broadcast Replays</h2>
          <div className="gold-divider mx-auto mt-2" />
          <p className="text-xs text-text-muted mt-2">Missed a service? Access recent sermon replays anytime, anywhere.</p>
        </div>

        <div className="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((stream) => (
            <div key={stream.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between">
              <div className="aspect-video bg-stone-100 relative">
                {/* Fallback Thumbnail / Play Overlay */}
                <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600')` }} />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-accent text-primary-dark flex items-center justify-center text-lg font-black group-hover:scale-110 transition-transform">
                    ▶
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] bg-primary/10 text-primary font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Sermon Replay
                  </span>
                  <h4 className="font-serif font-bold text-primary-dark text-base mt-2 line-clamp-2">
                    {stream.title}
                  </h4>
                </div>
                <p className="text-xs text-text-muted border-t border-stone-100 pt-3">
                  ⏰ Recorded on {formatDate(stream.scheduledAt)}
                </p>
              </div>
            </div>
          ))}

          {upcoming.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-12 border-2 border-dashed border-stone-200 rounded-2xl bg-white">
              <p className="text-sm text-stone-400 italic">No past replays found in our current roster. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
