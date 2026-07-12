"use client";

import { useState } from "react";
import { createChoirMember } from "@/lib/choir";
import R2Uploader from "@/components/R2Uploader";

export default function SignUpModal({ dept, onClose }: { dept: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", dateJoined: "", bio: "", section: dept, department: dept });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Name and email are required."); return; }
    setSubmitting(true);
    try {
      await createChoirMember({
        fullName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone || undefined,
        department: form.department,
        section: form.section || undefined,
        photoUrl: photoUrl || undefined,
        bio: form.bio || undefined,
        dateJoined: form.dateJoined || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-primary">Register as a Chorister</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-primary mb-2">Registration Submitted!</h3>
            <p className="text-text-muted mb-6">Your registration is pending approval from the Music Director. You will be contacted once reviewed.</p>
            <button onClick={onClose} className="btn-gold px-6 py-2.5 rounded-xl font-semibold text-sm">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Upload your headshot</label>
              {photoUrl && <img src={photoUrl} alt="Preview" className="w-20 h-20 rounded-2xl object-cover border border-stone-200 mb-2"/>}
              <R2Uploader folder="choir" label="Choose Photo" onUploaded={(url) => setPhotoUrl(url)} />
              <p className="text-xs text-text-muted mt-1">JPG or PNG, max 5MB</p>
            </div>

            {[
              { label: "Full Name *", key: "name", type: "text", required: true },
              { label: "Email Address *", key: "email", type: "email", required: true },
              { label: "Phone Number", key: "phone", type: "tel", required: false },
              { label: "Date Joined the Choir", key: "dateJoined", type: "date", required: false },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-primary mb-1.5">{field.label}</label>
                <input type={field.type} required={field.required} value={(form as unknown as Record<string, string>)[field.key] ?? ""}
                  onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="input-field"/>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Department</label>
              <select value={form.department} onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))}
                className="input-field bg-white">
                <option value="Choir">Choir</option>
                <option value="Media Team">Media Team</option>
                <option value="Instrumentalist">Instrumentalist</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Section / Voice Part</label>
              <select value={form.section} onChange={e => setForm(prev => ({ ...prev, section: e.target.value }))}
                className="input-field bg-white">
                <option value="Soprano">Soprano</option>
                <option value="Alto">Alto</option>
                <option value="Tenor">Tenor</option>
                <option value="Bass">Bass</option>
                <option value="Instrumentalist">Instrumentalist</option>
                <option value="Media Team">Media Team</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Brief Bio</label>
              <textarea value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us a little about yourself..." rows={3}
                className="input-field resize-none"/>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              <strong>Note:</strong> Your registration will be pending approval from the Music Director before activation.
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}
            <button type="submit" disabled={submitting} className="w-full btn-gold py-3.5 rounded-xl font-semibold text-base disabled:opacity-50">
              {submitting ? "Submitting…" : "Submit Registration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
