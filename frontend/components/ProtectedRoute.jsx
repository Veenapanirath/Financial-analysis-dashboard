'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { token, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized && !token) {
      router.push('/login');
    }
  }, [isInitialized, token, router]);

  // Still loading
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  // Not authenticated — redirect is in progress
  if (!token) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
