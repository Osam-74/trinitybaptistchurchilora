'use client';
import { useState, useEffect } from 'react';
import AdminShell from '@/components/AdminShell';
import R2Uploader from '@/components/R2Uploader';
import { getPastorSpeaks, savePastorSpeaks, deletePastorSpeaks, PastorSpeak } from '@/lib/pastorSpeaks';

export default function PastorSpeaksAdmin() {
  const [data, setData] = useState<PastorSpeak>({
    message: '',
    pastorName: '',
    pastorImageUrl: '',
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
      if (d) setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.message.trim() || !data.pastorName.trim()) {
      setError('Message and pastor name are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await savePastorSpeaks(data);
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
      setData({ message: '', pastorName: '', pastorImageUrl: '', active: true, updatedAt: '' });
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
          <p className="text-text-muted text-sm mt-1">
            This message pops up on the homepage once per visitor session. Update it each Sunday.
          </p>
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
                <p className="text-xs text-text-muted mt-0.5">Toggle off to hide the popup without deleting it</p>
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

            {/* Pastor name */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Pastor&apos;s Name *</label>
              <input
                type="text"
                value={data.pastorName}
                onChange={e => setData(d => ({ ...d, pastorName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                placeholder="e.g. Rev. Emmanuel Adeyemi"
                required
              />
            </div>

            {/* Pastor photo */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Pastor&apos;s Photo (optional)</label>
              {data.pastorImageUrl && (
                <div className="flex items-center gap-3 mb-3">
                  <img src={data.pastorImageUrl} alt="Pastor" className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-200" />
                  <button
                    type="button"
                    onClick={() => setData(d => ({ ...d, pastorImageUrl: '' }))}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove photo
                  </button>
                </div>
              )}
              <R2Uploader
                folder="pastor"
                label="Upload Pastor Photo"
                onUploaded={url => setData(d => ({ ...d, pastorImageUrl: url }))}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Message / Quote / Motivation *</label>
              <textarea
                value={data.message}
                onChange={e => setData(d => ({ ...d, message: e.target.value }))}
                rows={7}
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

        {/* Preview */}
        {data.message && (
          <div className="mt-6">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Preview</p>
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-lg overflow-hidden border border-stone-100">
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
              <div className="px-6 pt-5 pb-6">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Pastor&apos;s Word</p>
                <svg className="w-7 h-7 text-amber-200 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="font-serif text-sm text-stone-800 leading-relaxed italic mb-4 line-clamp-5">{data.message}</p>
                <div className="flex items-center gap-2 border-t border-stone-100 pt-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-white text-xs font-bold">
                    {data.pastorName?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'PS'}
                  </div>
                  <p className="font-semibold text-xs text-stone-800">{data.pastorName || 'Pastor Name'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
