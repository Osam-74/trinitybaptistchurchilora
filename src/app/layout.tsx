import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trinity Baptist Church, Ilora | Sanctuary of Praise",
  description: "Welcome to Trinity Baptist Church, Ilora — Sanctuary of Praise. Join us for worship, fellowship, and spiritual growth under the leadership of Rev'd Dr S. O. Mosebolatan.",
  keywords: ["Trinity Baptist Church", "Ilora", "Oyo State", "Nigeria", "church", "worship", "sermon", "pastor", "Sanctuary of Praise"],
  openGraph: {
    title: "Trinity Baptist Church, Ilora",
    description: "Sanctuary of Praise — A Place of Grace, Faith & Community",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
