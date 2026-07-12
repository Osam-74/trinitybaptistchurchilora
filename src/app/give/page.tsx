"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const givingReasons = [
  { title: "Tithe & Offerings", desc: "Honour God with your first-fruits. Regular tithes and offerings fuel the daily operations and ministries of the church.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Missions Fund", desc: "Support our evangelical outreach, church planting initiatives, and missionary work across Oyo State and Nigeria.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Building Fund", desc: "Contribute to the expansion and maintenance of our sanctuary and facilities — a lasting legacy for generations.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
];

const faqItems = [
  { q: "Is my giving tax deductible?", a: "Trinity Baptist Church, Ilora is a registered faith-based organisation under the Nigerian Baptist Convention. Please speak with the church secretary for documentation." },
  { q: "How are donated funds used?", a: "All funds are managed transparently by the church finance committee. They support ministry operations, community outreach, building maintenance, and missions work — all overseen by the church leadership." },
  { q: "Can I give online or via bank transfer?", a: "Yes! You can give via bank transfer using the account details on this page. We are also working to make online giving available soon. Contact us if you need help." },
];

export default function GivePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("0123456789");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              GIVE & SUPPORT
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-bold mb-5 animate-fade-in-up leading-tight">
              Give to God&apos;s<br/><span className="text-gradient-gold">Kingdom Work</span>
            </h1>
            <p className="text-white/65 text-lg lg:text-xl animate-fade-in max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Your generosity fuels ministry, missions, and community transformation — advancing God&apos;s kingdom in Ilora and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Why Give */}
      <section className="py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4"><div className="w-8 h-px bg-primary-light/40"/>WHY WE GIVE<div className="w-8 h-px bg-primary-light/40"/></div>
            <h2 className="font-serif text-4xl font-bold text-primary">Your Gift Makes a <span className="text-gradient-gold">Difference</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {givingReasons.map((item, i) => (
              <div key={item.title} className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm card-hover reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon}/></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Giving Methods */}
      <section className="py-24 bg-bg-alt">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4"><div className="w-8 h-px bg-primary-light/40"/>HOW TO GIVE<div className="w-8 h-px bg-primary-light/40"/></div>
            <h2 className="font-serif text-4xl font-bold text-primary">Giving <span className="text-gradient-gold">Methods</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bank Transfer */}
            <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm reveal-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary">Bank Transfer</h3>
              </div>
              <div className="space-y-4 bg-bg rounded-2xl p-5 border border-stone-100">
                {[
                  { label: "Bank Name", value: "First Bank of Nigeria Plc" },
                  { label: "Account Name", value: "Trinity Baptist Church Ilora" },
                  { label: "Account Number", value: "0123456789" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">{row.label}</span>
                    <span className="text-primary font-bold text-sm">{row.value}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleCopy}
                className={`mt-5 w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${copied ? "bg-green-100 text-green-700 border border-green-200" : "bg-accent text-primary-dark hover:bg-accent-light"}`}>
                {copied ? (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Account Number Copied!</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>Copy Account Number</>
                )}
              </button>
            </div>

            {/* Church Envelope */}
            <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm reveal-right">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary">Sunday Envelope</h3>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Give freely and joyfully during our Sunday services. Sealed giving envelopes are available at the Welcome Desk and from our ushering team at every service.
              </p>
              <div className="space-y-3">
                {["Available at all Sunday services", "Sealed envelopes for privacy", "Collected during offertory time", "Special project and missions envelopes"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-stone-700">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scripture Strip */}
      <section className="py-20 bg-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10"/>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="text-accent/20 text-8xl font-serif leading-none mb-2">&ldquo;</div>
          <p className="font-serif text-2xl lg:text-3xl text-white/90 italic leading-relaxed -mt-8">
            Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.
          </p>
          <p className="text-accent font-bold text-sm mt-4 tracking-wider">— 2 CORINTHIANS 9:7</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-primary-light text-sm font-semibold mb-4"><div className="w-8 h-px bg-primary-light/40"/>GIVING FAQ<div className="w-8 h-px bg-primary-light/40"/></div>
            <h2 className="font-serif text-4xl font-bold text-primary">Common <span className="text-gradient-gold">Questions</span></h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <button className="w-full flex items-center justify-between px-6 py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-serif text-base font-bold text-primary pr-4">{item.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}>
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40" : "max-h-0"}`}>
                  <p className="px-6 pb-5 text-stone-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prayer CTA */}
      <section className="py-20 bg-bg-alt">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary mb-4">Need Prayer? We&apos;re Here.</h2>
          <p className="text-stone-600 mb-8 max-w-xl mx-auto">Whether you&apos;re giving or seeking support — our prayer team is available. Reach out and let us stand with you in faith.</p>
          <Link href="/contact" className="btn-shine btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-primary-dark">
            Send a Prayer Request
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
