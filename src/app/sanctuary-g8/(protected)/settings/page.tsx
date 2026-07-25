"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import R2Uploader from "@/components/R2Uploader";
import { defaultSettings } from "@/lib/seed-data";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";
import { SiteSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSiteSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateSiteSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code === "permission-denied") {
        setError("Permission denied by Firestore rules. Make sure the latest firestore.rules have been pasted into Firebase Console → Firestore Database → Rules → Publish.");
      } else {
        setError((err as Error)?.message || "Failed to save settings.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell><div className="max-w-5xl mx-auto">
      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
          <h3 className="font-serif text-lg text-primary font-bold mb-2">Site Settings</h3>
          {loading && <p className="text-xs text-text-muted mb-4">Loading saved settings…</p>}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Church Logo</label>
              {settings.logoUrl && (
                <img src={settings.logoUrl} alt="Current logo" className="w-20 h-20 object-contain rounded-xl border border-stone-200 bg-white p-2 mb-3" />
              )}
              <R2Uploader
                folder="logos"
                label="Upload Church Logo"
                onUploaded={(url) => setSettings({ ...settings, logoUrl: url })}
              />
              <p className="text-xs text-text-muted mt-1">Appears in the navigation bar, footer, and admin sidebar. Remember to click Save Changes after uploading.</p>
            </div>
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
            <div className="pt-4 border-t border-stone-100">
              <label className="block text-sm font-medium text-primary mb-1">Gmail Sender Email</label>
              <input type="email" value={settings.gmailSenderEmail || ""} onChange={(e) => setSettings({ ...settings, gmailSenderEmail: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="trinitybaptistchurchilora@gmail.com" />
              <p className="text-xs text-text-muted mt-1">The Gmail address used to send confirmation and reminder emails</p>
            </div>

            {/* Announcements Ticker */}
            <div className="pt-6 border-t border-stone-100">
              <label className="block text-sm font-bold text-primary mb-1">📢 Announcements Ticker</label>
              <p className="text-xs text-text-muted mb-4">These scroll across the top bar of the site. Add one per line or use the + button. Each announcement is separated by a bullet in the display.</p>
              <div className="space-y-2">
                {(settings.announcements || []).map((ann, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={ann}
                      onChange={e => {
                        const updated = [...(settings.announcements || [])];
                        updated[i] = e.target.value;
                        setSettings({ ...settings, announcements: updated });
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      placeholder={`Announcement ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (settings.announcements || []).filter((_, j) => j !== i);
                        setSettings({ ...settings, announcements: updated });
                      }}
                      className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, announcements: [...(settings.announcements || []), ""] })}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-stone-300 text-sm text-primary hover:border-primary/40 hover:bg-stone-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                Add Announcement
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}
          <div className="mt-8 flex items-center gap-4">
            <button onClick={handleSave} disabled={saving} className="btn-shine px-8 py-3 bg-accent text-primary-dark font-medium rounded-xl hover:bg-accent-dark hover:text-white transition-colors disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
            {saved && (
              <span className="text-green-600 text-sm font-medium flex items-center gap-1 animate-fade-in">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Saved successfully
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
    </AdminShell>
  );
}
