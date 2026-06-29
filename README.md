# Trinity Baptist Church, Ilora — Website

**Sanctuary of Praise**

A modern, full-featured church website built with Next.js 16, TypeScript, Tailwind CSS v4, and Firebase.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Firebase Firestore + Firebase Auth
- **Media Hosting**: Cloudflare R2 / Images
- **Email**: Gmail + Nodemailer
- **Deploy**: Vercel

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your values
3. `npm install`
4. `npm run dev`

## Environment Variables

See `.env.example` for all required variables.

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all env vars from `.env.example` in Vercel dashboard
4. Deploy!

## Features
- Homepage with hero, pastor messages, gallery preview, sermon preview
- Sermon library (video/audio) with download button
- Auto-scrolling 3-row gallery with lightbox and download
- Baptist Hymnal search (by title or number)
- Choir/Media Team sign-up with approval workflow
- Modern calendar-based booking system
- Admin portal with role-based permissions
- Departments management (choir, media, instrumentalists)
