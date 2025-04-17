'use client';
import { authCheck } from '@/hocs/authCheck';
import React, { lazy, Suspense } from 'react';

const History = lazy(() => import('@/components/History/History'));

const AuthenticatedHistory = authCheck(History);

export default function HistoryPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <AuthenticatedHistory />
    </Suspense>
  );
}
