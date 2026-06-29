"use client";

/**
 * Reusable R2 file uploader component.
 * Calls the consultdrfat Cloudflare Worker /upload endpoint.
 * Drop-in for any page that needs file uploads.
 */

import { useRef, useState } from "react";
import { uploadToR2, UploadFolder } from "@/lib/r2";

interface Props {
  folder: UploadFolder;
  accept?: string;
  label?: string;
  onUploaded: (url: string) => void;
  onError?: (msg: string) => void;
  maxMB?: number;
}

export default function R2Uploader({
  folder,
  accept = "image/*",
  label = "Upload File",
  onUploaded,
  onError,
  maxMB = 20,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Size check
    if (file.size > maxMB * 1024 * 1024) {
      const msg = `File too large — max ${maxMB} MB`;
      setError(msg);
      onError?.(msg);
      return;
    }

    setFileName(file.name);

    // Preview for images
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }

    setUploading(true);
    setProgress(10);

    try {
      // Fake progress tick while uploading
      const ticker = setInterval(() => setProgress(p => Math.min(p + 10, 85)), 400);
      const url = await uploadToR2(file, folder);
      clearInterval(ticker);
      setProgress(100);
      setTimeout(() => { setUploading(false); setProgress(0); }, 600);
      onUploaded(url);
    } catch (err: unknown) {
      setUploading(false);
      setProgress(0);
      const msg = (err as Error)?.message ?? "Upload failed";
      setError(msg);
      onError?.(msg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer
          ${uploading ? "border-accent/60 bg-accent/5 cursor-wait" : "border-stone-300 hover:border-accent bg-stone-50 hover:bg-accent/3"}`}
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-xl mb-3"/>
        ) : (
          <svg className="w-10 h-10 text-stone-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
        )}

        {uploading ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Uploading to R2…</p>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-accent rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-text-muted">{fileName}</p>
          </div>
        ) : fileName && progress === 0 ? (
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              <span className="text-sm font-semibold">Uploaded!</span>
            </div>
            <p className="text-xs text-text-muted">{fileName}</p>
            <p className="text-xs text-accent mt-1">Click to replace</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-primary">{label}</p>
            <p className="text-xs text-text-muted mt-1">
              Drag & drop or click — max {maxMB} MB
            </p>
            <p className="text-xs text-text-muted/60 mt-0.5">
              Stored on Cloudflare R2
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {error}
        </p>
      )}

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange}/>
    </div>
  );
}
