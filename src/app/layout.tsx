import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trinity Baptist Church, Ilora | Sanctuary of Praise",
  description: "Welcome to Trinity Baptist Church, Ilora — Sanctuary of Praise. Join us for worship, fellowship, and spiritual growth under the leadership of Rev'd Dr S. O. Mosebolatan.",
  keywords: ["Trinity Baptist Church", "Ilora", "Oyo State", "Nigeria", "church", "worship", "sermon", "pastor", "Sanctuary of Praise"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
    other: [
      { rel: "mask-icon", url: "/logo/trinity-logo.png", color: "#1B4332" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Trinity Baptist Church, Ilora",
    description: "Sanctuary of Praise — A place of worship, fellowship, and spiritual growth in Ilora, Oyo State.",
    type: "website",
    images: [{ url: "/logo/trinity-logo.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="text-text bg-bg min-h-screen antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="page-transition">
          {children}
        </div>
      </body>
    </html>
  );
}
