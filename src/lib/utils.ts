import { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object" && input !== null) {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.join(" ");
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function getWeekdayName(weekday: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[weekday] || "";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2, 18) + Math.random().toString(36).substring(2, 18);
}

const PROFANITY_LIST = [
  "damn", "hell", "crap", "stupid", "idiot", "moron",
];

export function hasProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return PROFANITY_LIST.some((word) => lower.includes(word));
}

export function getCloudinaryUrl(url: string, options: { width?: number; height?: number; crop?: string } = {}): string {
  if (!url.includes("cloudinary.com")) return url;
  const { width, height, crop = "fill" } = options;
  let transforms = "f_auto,q_auto";
  if (width) transforms += `,w_${width}`;
  if (height) transforms += `,h_${height}`;
  if (crop && (width || height)) transforms += `,c_${crop}`;
  return url.replace("/upload/", `/upload/${transforms}/`);
}

export function getYouTubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}`;
}

export function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

export function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  bookings: { slotStart: string; slotEnd: string; status: string }[]
): boolean {
  return !bookings.some(
    (b) =>
      b.status !== "cancelled" &&
      new Date(b.slotStart) < slotEnd &&
      new Date(b.slotEnd) > slotStart
  );
}

export function getMonthName(monthIndex: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return months[monthIndex] || "";
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
