'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import { getPastorSpeaks, savePastorSpeaks, deletePastorSpeaks, PASTOR_DEFAULTS, PastorSpeak } from '@/lib/pastorSpeaks';

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
      if (d) {
        setData({
          ...d,
          pastorName: d.pastorName || PASTOR_DEFAULTS.pastorName,
          pastorImageUrl: d.pastorImageUrl || PASTOR_DEFAULTS.pastorImageUrl,
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.message.trim()) {
      setError('Please enter a message before saving.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await savePastorSpeaks({
        ...data,
        pastorName: PASTOR_DEFAULTS.pastorName,
        pastorImageUrl: PASTOR_DEFAULTS.pastorImageUrl,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove the current Pastor's Word? It will stop showing on the site.")) return;
    setDeleting(true);
    try {
      await deletePastorSpeaks();
      setData({
        message: '',
        pastorName: PASTOR_DEFAULTS.pastorName,
        pastorImageUrl: PASTOR_DEFAULTS.pastorImageUrl,
        active: true,
        updatedAt: '',
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminShell>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-primary">Pastor&apos;s Word</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">

            {/* Active toggle */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
              <div>
                <label className="block text-sm font-bold text-primary">Show on homepage</label>
                <p className="text-xs text-text-muted mt-0.5">Toggle off to hide without deleting</p>
              </div>
              <button
                type="button"
                onClick={() => setData(d => ({ ...d, active: !d.active }))}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  data.active ? 'bg-emerald-500' : 'bg-stone-300'
                }`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  data.active ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>

            {/* Pastor info — read-only */}
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <img
                src={PASTOR_DEFAULTS.pastorImageUrl}
                alt={PASTOR_DEFAULTS.pastorName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-200 flex-shrink-0"
              />
              <p className="font-semibold text-sm text-stone-800">{PASTOR_DEFAULTS.pastorName}</p>
            </div>

            {/* Message */}
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
              <p className="text-xs text-text-muted mt-1">{data.message.length} characters</p>
            </div>

            {data.updatedAt && (
              <p className="text-xs text-text-muted">
                Last updated: {new Date(data.updatedAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : saved ? '✓ Saved!' : "Save Pastor's Word"}
              </button>
              {data.message && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-5 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Removing…' : 'Remove'}
                </button>
              )}
            </div>
          </form>
        )}

        {/* Live Preview */}
        {data.message && (
          <div className="mt-8">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Preview</p>
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-lg overflow-hidden border border-stone-100">
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
              <div className="px-6 pt-5 pb-6">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Pastor&apos;s Word</p>
                <svg className="w-7 h-7 text-amber-200 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="font-serif text-sm text-stone-800 leading-relaxed italic mb-4 line-clamp-6">{data.message}</p>
                <div className="flex items-center gap-2 border-t border-stone-100 pt-3">
                  <img
                    src={PASTOR_DEFAULTS.pastorImageUrl}
                    alt={PASTOR_DEFAULTS.pastorName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-200"
                  />
                  <p className="font-semibold text-xs text-stone-800">{PASTOR_DEFAULTS.pastorName}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
