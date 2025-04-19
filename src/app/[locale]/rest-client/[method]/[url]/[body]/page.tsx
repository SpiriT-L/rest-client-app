'use client';

import { authCheck } from '@/hocs/authCheck';
import React, { lazy, Suspense } from 'react';
import { RestClientProps } from '@/components/RestClient/RestClient';

const RestClient = lazy(() => import('@/components/RestClient/RestClient'));

const AuthenticatedRestClient = authCheck(RestClient);

export default function RestClientPage({
  params,
}: {
  params: Promise<{ method: string; url: string; body: string }>;
}): React.JSX.Element {
  const resolvedParams = React.use(params);

  // Decode URL-safe base64 parameters
  const decodedUrl = decodeURIComponent(resolvedParams.url);
  const decodedBody = decodeURIComponent(resolvedParams.body);

  const props: RestClientProps = {
    initialMethod: resolvedParams.method,
    initialUrl: decodedUrl,
    initialBody: decodedBody,
  };

  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <AuthenticatedRestClient {...props} />
    </Suspense>
  );
}
