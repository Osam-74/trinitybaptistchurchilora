"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              CONTACT US
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Get In <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              We&apos;d love to hear from you. Reach out to Trinity Baptist Church, Ilora
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-primary mb-8">Visit Us</h2>
            <div className="space-y-6">
              {[
                { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z", title: "Address", lines: ["Trinity Baptist Church, Ilora", "Oyo State, Nigeria"] },
                { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Service Times", lines: ["Sunday 7:30 AM — First Service", "Sunday 10:00 AM — Second Service", "Wednesday 5:00 PM — Midweek"] },
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Email", lines: ["trinitybaptistchurchilora@gmail.com"] },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-primary mb-1">{item.title}</p>
                    {item.lines.map(l => <p key={l} className="text-text-muted text-sm">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-stone-100 shadow-sm h-48 bg-stone-100 flex items-center justify-center">
              <div className="text-center text-text-muted">
                <svg className="w-10 h-10 mx-auto mb-2 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p className="text-sm">Map — Ilora, Oyo State</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">Message Sent!</h3>
                <p className="text-text-muted">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 btn-gold px-6 py-2.5 rounded-xl font-semibold text-sm">Send Another</button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-bold text-primary mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Full Name *</label>
                      <input required value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="input-field" placeholder="Your name"/>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Email *</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="input-field" placeholder="your@email.com"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Subject</label>
                    <input value={formData.subject} onChange={e => setFormData(p => ({...p, subject: e.target.value}))} className="input-field" placeholder="What is this about?"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Message *</label>
                    <textarea required rows={5} value={formData.message} onChange={e => setFormData(p => ({...p, message: e.target.value}))} className="input-field resize-none" placeholder="Your message..."/>
                  </div>
                  <button type="submit" className="w-full btn-shine btn-gold py-4 rounded-2xl font-bold text-base">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
