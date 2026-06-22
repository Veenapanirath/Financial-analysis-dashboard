'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';

export default function Home() {
  const router = useRouter();
  const { isInitialized, initialize, token } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized) {
      if (token) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isInitialized, token, router]);

  return (
    <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" />
        <p className="text-dark-200 text-sm">Loading FinanceFlow...</p>
      </div>
    </div>
  );
}
