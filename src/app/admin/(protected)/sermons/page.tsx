"use client";

import { useState, useRef } from "react";
import R2Uploader from "@/components/R2Uploader";
import AdminSidebar from "@/components/AdminSidebar";
import { Sermon } from "@/types";
import { sampleSermons } from "@/lib/seed-data";
import { formatDate } from "@/lib/utils";
import { uploadToR2 } from "@/lib/r2";

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>(sampleSermons.map((s, i) => ({ ...s, id: `sermon-${i}` })));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", preacher: "", scripture: "", description: "", series: "", type: "video" as "audio" | "video", youtubeId: "", audioUrl: "" });

  // Audio recording state
  const [audioInputMode, setAudioInputMode] = useState<"upload" | "record">("upload");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadingRecording, setUploadingRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      recordedBlobRef.current = null;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        recordedBlobRef.current = blob;
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start(500);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setRecordedUrl("");
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      alert("Microphone access denied. Please allow microphone access and try again.");
    }
  };

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setIsPaused(false);
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const saveRecording = async () => {
    if (!recordedBlobRef.current) return;
    setUploadingRecording(true);
    try {
      const file = new File([recordedBlobRef.current], `sermon-recording-${Date.now()}.webm`, { type: "audio/webm" });
      const url = await uploadToR2(file, "sermons");
      setForm((f) => ({ ...f, audioUrl: url }));
      setRecordedUrl("");
      recordedBlobRef.current = null;
      alert("Recording saved and ready to publish!");
    } catch {
      alert("Failed to upload recording. Please try again.");
    } finally {
      setUploadingRecording(false);
    }
  };

  const resetRecording = () => {
    setRecordedUrl("");
    recordedBlobRef.current = null;
    setRecordingTime(0);
  };

  const handleSave = () => {
    if (!form.title) return;
    setSermons([{ ...form, id: `sermon-${Date.now()}`, date: new Date().toISOString().split("T")[0], featured: false }, ...sermons]);
    setShowForm(false);
    setForm({ title: "", preacher: "", scripture: "", description: "", series: "", type: "video" as "audio" | "video", youtubeId: "", audioUrl: "" });
    setRecordedUrl("");
    setAudioInputMode("upload");
    setRecordingTime(0);
  };

  const handleDelete = (id: string) => { if (confirm("Delete?")) setSermons(sermons.filter((s) => s.id !== id)); };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 pr-16 lg:pr-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="font-serif text-2xl font-bold text-primary">Sermons</h1>
              <p className="text-text-muted text-sm mt-1">Manage the sermon library</p>
            </div>
            <button onClick={() => setShowForm(true)} className="btn-shine px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Sermon
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6 animate-fade-in">
              <h3 className="font-serif text-lg text-primary font-bold mb-4">Add New Sermon</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
                <input type="text" placeholder="Preacher" value={form.preacher} onChange={(e) => setForm({ ...form, preacher: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
                <input type="text" placeholder="Scripture" value={form.scripture} onChange={(e) => setForm({ ...form, scripture: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
                <input type="text" placeholder="Series (optional)" value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />

                {/* Type selector */}
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "audio" | "video", youtubeId: "", audioUrl: "" })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30">
                  <option value="video">Video (YouTube)</option>
                  <option value="audio">Audio</option>
                </select>

                {form.type === "video" ? (
                  <input type="text" placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" value={form.youtubeId} onChange={(e) => setForm({ ...form, youtubeId: e.target.value })} className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30" />
                ) : (
                  <div className="sm:col-span-2">
                    {/* Upload vs Record tabs */}
                    <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-4 w-fit">
                      <button type="button" onClick={() => { setAudioInputMode("upload"); resetRecording(); }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${audioInputMode === "upload" ? "bg-white shadow-sm text-primary" : "text-stone-500 hover:text-primary"}`}>
                        Upload Audio
                      </button>
                      <button type="button" onClick={() => { setAudioInputMode("record"); setForm(f => ({ ...f, audioUrl: "" })); }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${audioInputMode === "record" ? "bg-white shadow-sm text-primary" : "text-stone-500 hover:text-primary"}`}>
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                        Record Directly
                      </button>
                    </div>

                    {audioInputMode === "upload" ? (
                      <div className="space-y-2">
                        <R2Uploader folder="sermons" accept="audio/*" label="Upload sermon audio (MP3/M4A/WAV)" maxMB={80} onUploaded={(url) => setForm({ ...form, audioUrl: url })} />
                        {form.audioUrl && (
                          <p className="text-xs text-green-600 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                            Uploaded successfully
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="border border-stone-200 rounded-2xl p-5 bg-stone-50">
                        <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-4">Direct Recording</p>

                        {/* Not yet started / re-record */}
                        {!isRecording && !recordedUrl && (
                          <button type="button" onClick={startRecording}
                            className="flex items-center gap-3 px-5 py-3 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                            Start Recording
                          </button>
                        )}

                        {/* Recording in progress */}
                        {isRecording && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"/>
                              <span className="font-mono text-2xl font-bold text-primary">{formatTime(recordingTime)}</span>
                              <span className="text-xs text-stone-400">{isPaused ? "Paused" : "Recording…"}</span>
                            </div>
                            <div className="flex gap-2">
                              {!isPaused ? (
                                <button type="button" onClick={pauseRecording}
                                  className="flex items-center gap-2 px-4 py-2.5 bg-stone-700 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                  Pause
                                </button>
                              ) : (
                                <button type="button" onClick={resumeRecording}
                                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                  Resume
                                </button>
                              )}
                              <button type="button" onClick={stopRecording}
                                className="flex items-center gap-2 px-4 py-2.5 bg-stone-200 text-stone-700 rounded-xl text-sm font-semibold hover:bg-stone-300 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                                Stop
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Recorded — preview + actions */}
                        {recordedUrl && !isRecording && (
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                              Recording complete — {formatTime(recordingTime)}
                            </p>
                            <audio controls src={recordedUrl} className="w-full rounded-xl"/>
                            <div className="flex gap-2">
                              <button type="button" onClick={saveRecording} disabled={uploadingRecording}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
                                {uploadingRecording ? (
                                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Uploading…</>
                                ) : (
                                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>Save & Publish</>
                                )}
                              </button>
                              <button type="button" onClick={() => { resetRecording(); startRecording(); }}
                                className="px-4 py-2.5 bg-stone-100 text-stone-600 rounded-xl text-sm font-semibold hover:bg-stone-200 transition-colors">
                                Re-record
                              </button>
                            </div>
                            {form.audioUrl && (
                              <p className="text-xs text-green-600 font-medium">✓ Ready to publish</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => { setShowForm(false); resetRecording(); }} className="px-5 py-2.5 border border-stone-200 rounded-xl text-sm hover:bg-stone-50">Cancel</button>
                <button type="button" onClick={handleSave} disabled={!form.title} className="btn-shine px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark disabled:opacity-50">Save Sermon</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Title</th>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Preacher</th>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Type</th>
                  <th className="text-left px-6 py-3 font-medium text-text-muted">Date</th>
                  <th className="text-right px-6 py-3 font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sermons.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4"><div className="font-medium text-primary">{s.title}</div><div className="text-text-muted text-xs">{s.scripture}</div></td>
                    <td className="px-6 py-4 text-text">{s.preacher}</td>
                    <td className="px-6 py-4"><span className="capitalize text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">{s.type}</span></td>
                    <td className="px-6 py-4 text-text-muted">{formatDate(s.date)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
