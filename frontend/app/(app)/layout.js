'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { ToastProvider } from '@/components/Toast';

export default function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <ToastProvider>
        <div className="min-h-screen bg-[#050816] relative overflow-hidden">
          {/* Dot Grid Overlay */}
          <div className="fixed inset-0 dot-grid pointer-events-none z-0" />

          {/* Floating Orbs */}
          <div
            className="floating-orb animate-orb-drift-1"
            style={{
              width: '500px',
              height: '500px',
              background: '#6366f1',
              top: '-150px',
              right: '-100px',
            }}
          />
          <div
            className="floating-orb animate-orb-drift-2"
            style={{
              width: '400px',
              height: '400px',
              background: '#8b5cf6',
              bottom: '-120px',
              left: '20%',
            }}
          />
          <div
            className="floating-orb animate-orb-drift-3"
            style={{
              width: '350px',
              height: '350px',
              background: '#06b6d4',
              top: '40%',
              left: '-100px',
            }}
          />

          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="pl-[280px] relative z-10 min-h-screen">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </ProtectedRoute>
  );
}
