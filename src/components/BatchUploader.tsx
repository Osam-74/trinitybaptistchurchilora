"use client";

/**
 * Batch R2 uploader — select multiple files at once, no size limit.
 * Shows per-file progress and overall status.
 */

import { useRef, useState } from "react";
import { uploadToR2, UploadFolder } from "@/lib/r2";

interface Props {
  folder: UploadFolder;
  accept?: string;
  label?: string;
  onAllUploaded: (urls: string[]) => void;
  onError?: (msg: string) => void;
}

interface FileStatus {
  name: string;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
  error?: string;
}

export default function BatchUploader({
  folder,
  accept = "image/*",
  label = "Select multiple photos to upload",
  onAllUploaded,
  onError,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRefs = useRef<File[]>([]);
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickFiles = (selected: File[]) => {
    if (selected.length === 0) return;
    fileRefs.current = selected;
    setFiles(selected.map(f => ({ name: f.name, status: "pending" as const })));
  };

  const handleUpload = async () => {
    if (fileRefs.current.length === 0) return;
    setUploading(true);

    const urls: string[] = [];
    for (let i = 0; i < fileRefs.current.length; i++) {
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "uploading" } : f));
      try {
        const url = await uploadToR2(fileRefs.current[i], folder);
        urls.push(url);
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "done", url } : f));
      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? "Upload failed";
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "error", error: msg } : f));
        onError?.(msg);
      }
    }

    setUploading(false);
    if (urls.length > 0) {
      onAllUploaded(urls);
    }
  };

  const doneCount = files.filter(f => f.status === "done").length;
  const errorCount = files.filter(f => f.status === "error").length;
  const pendingCount = files.filter(f => f.status === "pending").length;

  return (
    <div>
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          pickFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer
          ${uploading ? "border-accent/60 bg-accent/5 cursor-wait" : "border-stone-300 hover:border-accent bg-stone-50"}`}
      >
        <svg className="w-10 h-10 text-stone-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        <p className="text-sm font-semibold text-primary">{label}</p>
        <p className="text-xs text-text-muted mt-1">No size limit — select as many as you need</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={e => pickFiles(Array.from(e.target.files || []))}
      />

      {/* File list with per-file status */}
      {files.length > 0 && (
        <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-stone-50 border border-stone-100">
              {f.status === "done" ? (
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              ) : f.status === "uploading" ? (
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin flex-shrink-0" />
              ) : f.status === "error" ? (
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v9"/>
                </svg>
              )}
              <span className={`flex-1 truncate ${f.status === "done" ? "text-green-700" : f.status === "error" ? "text-red-600" : "text-stone-600"}`}>
                {f.name}
              </span>
              {f.status === "uploading" && <span className="text-accent font-medium">Uploading…</span>}
              {f.status === "done" && <span className="text-green-600 font-medium">✓</span>}
              {f.status === "error" && <span className="text-red-500">Failed</span>}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {pendingCount > 0 && !uploading && (
        <button
          onClick={handleUpload}
          className="mt-3 w-full py-2.5 btn-gold rounded-xl text-sm font-semibold"
        >
          Upload {pendingCount} photo{pendingCount !== 1 ? "s" : ""}
        </button>
      )}

      {/* Summary */}
      {uploading && (
        <p className="mt-2 text-xs text-accent font-medium text-center">
          Uploading… {doneCount} of {files.length} done{errorCount > 0 ? `, ${errorCount} failed` : ""}
        </p>
      )}
      {!uploading && doneCount === files.length && files.length > 0 && (
        <p className="mt-2 text-xs text-green-600 font-medium text-center">
          ✓ All {doneCount} photos uploaded successfully!
        </p>
      )}
    </div>
  );
}
