"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { defaultSettings } from "@/lib/seed-data";
import { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-stone-50"><AdminSidebar /><main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64"><div className="max-w-5xl mx-auto">
      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
          <h3 className="font-serif text-lg text-primary font-bold mb-6">Site Settings</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Church Name</label>
              <input type="text" value={settings.churchName} onChange={(e) => setSettings({ ...settings, churchName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Tagline</label>
              <input type="text" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Service Times</label>
              <input type="text" value={settings.serviceTimes} onChange={(e) => setSettings({ ...settings, serviceTimes: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Contact Email</label>
                <input type="email" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Contact Phone</label>
                <input type="tel" value={settings.contactPhone || ""} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Address</label>
              <input type="text" value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Pastor Name</label>
              <input type="text" value={settings.pastorName || ""} onChange={(e) => setSettings({ ...settings, pastorName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Facebook</label>
                <input type="text" value={settings.socialLinks.facebook || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="URL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Instagram</label>
                <input type="text" value={settings.socialLinks.instagram || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="URL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">YouTube</label>
                <input type="text" value={settings.socialLinks.youtube || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, youtube: e.target.value } })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="URL" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <div>
                <label className="text-sm font-medium text-primary">Comments require approval</label>
                <p className="text-xs text-text-muted">New comments will be held for moderation</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, commentsRequireApproval: !settings.commentsRequireApproval })}
                className={`relative w-12 h-7 rounded-full transition-colors ${settings.commentsRequireApproval ? "bg-accent" : "bg-stone-300"}`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.commentsRequireApproval ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <label className="block text-sm font-medium text-primary mb-1">Gmail Sender Email</label>
              <input type="email" value={settings.gmailSenderEmail || ""} onChange={(e) => setSettings({ ...settings, gmailSenderEmail: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="trinitybaptistilora@gmail.com" />
              <p className="text-xs text-text-muted mt-1">The Gmail address used to send confirmation and reminder emails</p>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <button onClick={handleSave} className="btn-shine px-8 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent-dark transition-colors">Save Changes</button>
            {saved && (
              <span className="text-green-600 text-sm font-medium flex items-center gap-1 animate-fade-in">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Saved successfully
              </span>
            )}
          </div>
        </div>
      </div>
    </div></main></div>
  );
}
