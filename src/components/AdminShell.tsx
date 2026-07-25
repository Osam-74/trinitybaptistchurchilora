'use client';
import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 pt-16 md:pt-0 md:ml-[72px] lg:ml-[260px] min-w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
