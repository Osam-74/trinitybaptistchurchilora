'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import PermissionGuard from "@/components/PermissionGuard";
import { getPastorSpeaks, savePastorSpeaks, deletePastorSpeaks, PASTOR_DEFAULTS, PastorSpeak } from '@/lib/pastorSpeaks';
import { auth } from '@/lib/firebase';
import { logActivity } from '@/lib/activityLog';

export default function PastorSpeaksAdmin() {
  const [data, setData] = useState<PastorSpeak>({
    message: '',
    pastorName: PASTOR_DEFAULTS.pastorName,
    pastorImageUrl: PASTOR_DEFAULTS.pastorImageUrl,
    active: true,
    updatedAt: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getPastorSpeaks().then(d => {
      if (d) setData({ ...d, pastorName: d.pastorName || PASTOR_DEFAULTS.pastorName, pastorImageUrl: d.pastorImageUrl || PASTOR_DEFAULTS.pastorImageUrl });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.message.trim()) { setError('Please enter a message before saving.'); return; }
    setSaving(true); setError('');
    try {
      await savePastorSpeaks({ ...data, pastorName: PASTOR_DEFAULTS.pastorName, pastorImageUrl: PASTOR_DEFAULTS.pastorImageUrl });
      logActivity({ user: auth?.currentUser?.email ?? 'admin', userName: auth?.currentUser?.displayName ?? 'Admin', action: 'updated', target: "Pastor's Word", section: 'Pastor\'s Word' });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { setError((err as Error).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Remove the current Pastor's Word? It will stop showing on the site.")) return;
    setDeleting(true);
    try {
      await deletePastorSpeaks();
      logActivity({ user: auth?.currentUser?.email ?? 'admin', userName: auth?.currentUser?.displayName ?? 'Admin', action: 'deleted', target: "Pastor's Word", section: 'Pastor\'s Word' });
      setData({ message: '', pastorName: PASTOR_DEFAULTS.pastorName, pastorImageUrl: PASTOR_DEFAULTS.pastorImageUrl, active: true, updatedAt: '' });
    } catch (err) { setError((err as Error).message); }
    finally { setDeleting(false); }
  };

  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <AdminShell>
      <PermissionGuard required="manage_pastor_speaks">
      <div className={`w-full transition-all duration-300 ${data.message ? 'max-w-2xl lg:max-w-6xl' : 'max-w-2xl'}`}>
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-primary">Pastor&apos;s Word</h1>
          <p className="text-text-muted text-sm mt-1">This appears as a popup on the homepage on every visit</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-8 items-start ${data.message ? 'lg:grid-cols-12' : ''}`}>
            <div className={data.message ? 'lg:col-span-7' : ''}>
              <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
                {/* Active toggle */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-bold text-primary">Show on homepage</label>
                    <p className="text-xs text-text-muted mt-0.5">Toggle off to hide without deleting</p>
                  </div>
                  <button type="button" onClick={() => setData(d => ({ ...d, active: !d.active }))}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${data.active ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${data.active ? 'translate-x-6' : ''}`} />
                  </button>
                </div>

                {/* Message textarea */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-1.5">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={data.message}
                    onChange={e => setData(d => ({ ...d, message: e.target.value }))}
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm resize-none font-serif italic"
                    placeholder="Type the pastor's word, quote, or motivational message here…"
                    required
                  />
                  <p className="text-xs text-text-muted mt-1">{data.message.length} characters · The preview below updates as you type</p>
                </div>

                {data.updatedAt && (
                  <p className="text-xs text-text-muted">
                    Last updated: {new Date(data.updatedAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl space-y-1">
                    <p className="font-semibold">{error.includes('permission') || error.includes('Permission') ? 'Firestore Rules Not Published Yet' : 'Error'}</p>
                    {error.includes('permission') || error.includes('Permission') ? (
                      <p className="text-xs leading-relaxed">Go to <strong>Firebase Console → Firestore Database → Rules</strong>, paste the contents of <code>firestore.rules</code>, then click <strong>Publish</strong>.</p>
                    ) : <p>{error}</p>}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {saving ? 'Saving…' : saved ? '✓ Saved!' : "Save Pastor's Word"}
                  </button>
                  {data.message && (
                    <button type="button" onClick={handleDelete} disabled={deleting}
                      className="px-5 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50">
                      {deleting ? 'Removing…' : 'Remove'}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Live Preview — matches the frontend popup exactly */}
            {data.message && (
              <div className="lg:col-span-5 mt-8 lg:mt-0">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Live Preview</p>
                  <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">Updates as you type</span>
                </div>

                {/* Card matches PastorSpeaksPopup exactly */}
                <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100">
                  {/* Top gold accent */}
                  <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />

                  {/* Dark green header */}
                  <div className="bg-[#1B4332] px-5 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <img src="/logo/tbc-logo.png" alt="TBC" className="w-full h-full object-contain p-0.5"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}/>
                      </div>
                      <div className="min-w-0">
                        <p className="text-amber-300 text-[10px] font-bold uppercase tracking-[0.18em] leading-none truncate">
                          Pastor&apos;s Desk
                        </p>
                        <p className="text-white/55 text-[9px] mt-0.5 truncate">Trinity Baptist Church, Ilora</p>
                      </div>
                    </div>
                    <p className="text-white/60 text-[9px] text-right leading-snug hidden sm:block flex-shrink-0">{dateStr}</p>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

                  {/* Body */}
                  <div className="px-6 pt-5 pb-5">
                    <svg className="w-9 h-9 text-amber-200 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    <p className="text-stone-800 italic leading-[1.82] mb-5"
                      style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif", fontSize: '1.05rem' }}>
                      {data.message}
                    </p>
                    <div className="border-t border-stone-100 mb-4" />
                    <div className="flex items-end justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-amber-200 bg-[#1B4332]">
                          <img src={PASTOR_DEFAULTS.pastorImageUrl} alt="Pastor"
                            className="w-full h-full object-cover object-top"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}/>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#1B4332] whitespace-nowrap"
                            style={{ fontFamily: "'Georgia', serif", fontSize: '0.82rem' }}>
                            Rev. Dr S. O. Mosebolatan
                          </p>
                          <p className="text-stone-400 text-[11px] mt-0.5 tracking-wide">Senior Pastor</p>
                        </div>
                      </div>
                      {/* Download button preview */}
                      <div className="flex-shrink-0 flex items-center gap-1.5 bg-stone-100 text-stone-700 text-[11px] font-semibold px-3 py-2 rounded-lg opacity-70 cursor-default select-none">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Download
                      </div>
                    </div>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </PermissionGuard>
    </AdminShell>
  );
}