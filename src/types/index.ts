export interface User {
  uid: string;
  email: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  active: boolean;
  createdAt: string;
  createdBy: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  scripture: string;
  mediaType: "text" | "audio" | "video" | "image";
  mediaUrl: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  amenCount: number;
  pinned: boolean;
  status: "published" | "draft";
  createdAt: string;
  authorUid: string;
  authorName?: string;
}

export interface LiveStream {
  id: string;
  title: string;
  embedUrl: string;
  scheduledAt: string;
  status: "scheduled" | "live" | "ended";
  createdBy: string;
}

export interface BookingAvailability {
  id: string;
  type: "recurring" | "specific";
  weekday?: number;
  date?: string;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  maxPerDay: number;
  active: boolean;
}

export interface BookingBlock {
  id: string;
  date: string;
  reason: string;
}

export interface Booking {
  id: string;
  slotStart: string;
  slotEnd: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  meetingType: "in_person" | "video";
  status: "requested" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface Album {
  id: string;
  title: string;
  eventDate: string;
  coverUrl: string;
  createdBy: string;
}

export interface Photo {
  id: string;
  cloudinaryUrl: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  scripture: string;
  description: string;
  series?: string;
  type: "audio" | "video";
  audioUrl?: string;
  youtubeId?: string;
  durationSec?: number;
  featured: boolean;
}

export interface Activity {
  id: string;
  title: string;
  weekday: number;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  active: boolean;
}

export interface ReminderSubscriber {
  id: string;
  email: string;
  unsubscribeToken: string;
  active: boolean;
  createdAt: string;
}

export interface SiteSettings {
  churchName: string;
  tagline: string;
  logoUrl?: string;
  serviceTimes: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  pastorName?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  gmailSenderEmail?: string;
}

export interface Hymn {
  id: string;
  number: number;
  category: "english" | "yoruba";
  title: string;
  lyrics: string; // verses separated by a blank line; use "Chorus:" / "Ègbè:" to label a repeated chorus
  author?: string;
  composer?: string;
  createdAt?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  type: "service" | "special" | "meeting" | "fellowship" | "other";
  createdBy: string;
}

export const PERMISSIONS = [
  "manage_users",
  "manage_posts",
  "manage_bookings",
  "manage_availability",
  "manage_streams",
  "manage_gallery",
  "manage_sermons",
  "manage_activities",
  "manage_settings",
  "manage_calendar",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_DEFAULTS: Record<string, Permission[]> = {
  master_admin: [
    "manage_users", "manage_posts", "manage_bookings", "manage_availability",
    "manage_streams", "manage_gallery", "manage_sermons", "manage_activities",
    "manage_settings", "manage_calendar",
  ],
  pastor: [
    "manage_posts", "manage_bookings", "manage_availability",
    "manage_streams", "manage_sermons",
  ],
  media_team: [
    "manage_gallery", "manage_sermons", "manage_streams",
  ],
  editor: [
    "manage_posts", "manage_activities",
  ],
};
