'use client';

import { authCheck } from '@/hocs/authCheck';
import React, { lazy, Suspense } from 'react';

const RestClient = lazy(() => import('@/components/RestClient/RestClient'));

const AuthenticatedRestClient = authCheck(RestClient);

export default function RestClientPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <AuthenticatedRestClient />
    </Suspense>
  );
}
