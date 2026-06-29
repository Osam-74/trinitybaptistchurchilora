"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sampleStreams } from "@/lib/seed-data";
import { LiveStream } from "@/types";
import { formatDate } from "@/lib/utils";

export default function LivePage() {
  const [streams] = useState<LiveStream[]>(sampleStreams.map((s, i) => ({ ...s, id: `stream-${i}` })));
  const liveStream = streams.find(s => s.status === "live");
  const upcoming = streams.filter(s => s.status === "scheduled");

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            {liveStream ? (
              <div className="inline-flex items-center gap-2 bg-red-600 rounded-full px-5 py-2 mb-6 text-white text-sm font-bold animate-fade-in">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"/>
                LIVE NOW
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                LIVE STREAM
              </div>
            )}
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              {liveStream ? <span>We&apos;re <span className="text-red-400">Live!</span></span> : <span>Watch <span className="text-gradient-gold">Live</span></span>}
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {liveStream ? liveStream.title : "Join us for our next live service"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {liveStream ? (
          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl mb-8 animate-fade-in">
            <div className="aspect-video">
              <iframe
                src={liveStream.embedUrl.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={liveStream.title}
              />
            </div>
            <div className="p-6 bg-primary-dark">
              <div className="flex items-center gap-3 mb-2">
                <div className="badge-live">LIVE</div>
                <h2 className="font-serif text-xl text-white font-bold">{liveStream.title}</h2>
              </div>
              <p className="text-white/50 text-sm">Trinity Baptist Church, Ilora — {formatDate(liveStream.scheduledAt)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-100 shadow-sm mb-10">
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-primary mb-2">No Live Stream Currently</h2>
            <p className="text-text-muted">Check back on Sundays at 7:30 AM & 10:00 AM</p>
          </div>
        )}

        {upcoming.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-primary mb-5">Upcoming Services</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {upcoming.map((stream) => (
                <div key={stream.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 card-hover">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif font-bold text-primary mb-1">{stream.title}</p>
                      <p className="text-text-muted text-sm">{formatDate(stream.scheduledAt)}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-accent/10 text-accent text-xs rounded-full font-semibold flex-shrink-0">Scheduled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
