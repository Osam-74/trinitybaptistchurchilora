/**
 * R2 upload helper — uses the existing consultdrfat Cloudflare Worker
 * POST /upload  (multipart/form-data)
 *   fields: file, bookingId (used as namespace prefix)
 * Returns: { ok: true, url: "https://pub-xxxx.r2.dev/session-files/..." }
 *
 * Env vars needed (Vercel dashboard):
 *   NEXT_PUBLIC_CF_WORKER_URL  → https://consultdrfat-api.<subdomain>.workers.dev
 *   NEXT_PUBLIC_R2_PUBLIC_BASE → https://pub-xxxx.r2.dev  (optional — Worker falls back to /files/)
 */

const WORKER_URL = process.env.NEXT_PUBLIC_CF_WORKER_URL ?? "";

export type UploadFolder = "gallery" | "sermons" | "headshots" | "posts";

/**
 * Upload a file to R2 via the Cloudflare Worker.
 * Returns the public URL of the uploaded file.
 */
export async function uploadToR2(
  file: File,
  folder: UploadFolder = "gallery"
): Promise<string> {
  if (!WORKER_URL) {
    throw new Error(
      "NEXT_PUBLIC_CF_WORKER_URL is not set. Add it to your .env.local and Vercel dashboard."
    );
  }

  const form = new FormData();
  form.append("file", file);
  // bookingId is used as namespace — we repurpose it as folder name
  form.append("bookingId", `trinity-${folder}`);

  const res = await fetch(`${WORKER_URL}/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as Record<string,string>)?.error ?? `Upload failed: ${res.status}`);
  }

  const data = (await res.json()) as { ok: boolean; url: string };
  if (!data.ok || !data.url) throw new Error("Upload succeeded but no URL returned");

  return data.url;
}

/**
 * Get the public URL for a known R2 key (without re-uploading).
 * Useful when you already know the key and just need the URL.
 */
export function r2PublicUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE;
  if (base) return `${base.replace(/\/$/, "")}/${key}`;
  // fallback: serve via Worker
  return `${WORKER_URL}/files/${key}`;
}
