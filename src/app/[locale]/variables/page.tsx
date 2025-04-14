'use client';
import { authCheck } from '@/hocs/authCheck';
import React, { lazy, Suspense } from 'react';

const Variables = lazy(() => import('@/components/Variables/Variables'));

const AuthenticatedVariables = authCheck(Variables);

export default function VariablesPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <AuthenticatedVariables />
    </Suspense>
  );
}
