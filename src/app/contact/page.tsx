"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const contactPhone = "08034084270 / 07086454207";
  const address = "P.O. Box 43, Ilora, Oyo State, Nigeria.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill out all required fields.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <div className="page-hero pt-20">
        <div className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-6 text-accent text-sm font-semibold animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              CONTACT US
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold mb-5 animate-fade-in-up">
              Get In <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="text-white/60 text-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
              We would love to hear from you. Reach out to Trinity Baptist Church, Ilora for prayers, inquiries, and counseling.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-stone-100 p-8 lg:p-10">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-3">Message Received!</h3>
                <p className="text-stone-600 mb-8 max-w-md mx-auto">
                  Thank you for reaching out, <strong>{formData.name}</strong>. Our administrative team or Pastor will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
                  }}
                  className="btn-gold px-6 py-3 rounded-xl font-bold text-sm text-primary-dark transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-bold text-primary mb-2">Send a Message</h2>
                <p className="text-stone-500 text-sm mb-8">Feel free to drop us a note and we will reply as soon as possible.</p>
                {error && (
                  <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl mb-6 border border-red-100">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Full Name *</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Email *</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                        placeholder="e.g. +234..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                        className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white"
                      >
                        <option>General Inquiry</option>
                        <option>Prayer Request</option>
                        <option>Counseling</option>
                        <option>Testimony</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      className="input-field w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-shine btn-gold py-4 rounded-2xl font-bold text-base text-primary-dark transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Location card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-primary mb-1">Our Location</h3>
                <p className="text-stone-600 text-sm">{address}</p>
              </div>
            </div>

            {/* Service times card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-primary mb-2.5">Service Times</h3>
                <ul className="space-y-1.5 text-stone-600 text-sm">
                  <li className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-stone-700">Sunday 1st Service</span>
                    <span>7:30 AM</span>
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-stone-700">Sunday School</span>
                    <span>9:00 AM</span>
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-stone-700">Sunday 2nd Service</span>
                    <span>10:00 AM</span>
                  </li>
                  <li className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-stone-700">Wednesday Midweek Service</span>
                    <span>5:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Direct Contact placeholder */}
            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-primary mb-1">Get in Touch Directly</h3>
                <p className="text-stone-600 text-sm">Phone: <a href={`tel:${contactPhone}`} className="hover:underline font-semibold text-primary-light">{contactPhone}</a></p>
                <p className="text-stone-600 text-sm">Email: <a href={`mailto:${contactEmail}`} className="hover:underline font-semibold text-primary-light">{contactEmail}</a></p>
              </div>
            </div>

            {/* Social media connections */}
            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-primary mb-4 text-center">Connect Online</h3>
              <div className="flex justify-center gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-light transition-all flex items-center justify-center text-white font-bold">F</a>
                <a href="#" className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-light transition-all flex items-center justify-center text-white font-bold">Y</a>
                <a href="#" className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-light transition-all flex items-center justify-center text-white font-bold">I</a>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Map & Find Us Section */}
        <div className="mt-20 pt-16 border-t border-stone-200">
          <div className="text-center mb-8">
            <span className="text-accent-dark text-xs font-bold uppercase tracking-widest">MAP GUIDE</span>
            <h3 className="font-serif text-3xl font-bold text-primary mt-1">Find Us</h3>
            <p className="text-stone-600 text-sm max-w-lg mx-auto mt-2">
              Located beautifully in the historic town of Ilora, Oyo State. Our doors are wide open, welcoming you, your friends, and your family.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-stone-200/50 shadow-md h-72 bg-gradient-to-br from-primary-dark to-primary flex flex-col items-center justify-center p-8 text-center text-white relative">
            <div className="absolute inset-0 pattern-overlay opacity-10" />
            <div className="relative z-10 space-y-4">
              <svg className="w-12 h-12 mx-auto text-accent animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h4 className="font-serif text-xl font-bold text-gradient-gold">Trinity Baptist Church</h4>
              <p className="text-white/80 text-sm max-w-md mx-auto">
                {address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}