import { useIsSignedIn } from '@/hooks/useIsSignedIn';
import { NotSignedIn } from '@/components/NotSignedIn/NotSignedIn';
import React from 'react';

export const authCheck = (Child: React.FC): React.FC => {
  const WrappedComponent: React.FC = () => {
    const isSignedIn = useIsSignedIn();
    return <>{isSignedIn ? <Child /> : <NotSignedIn />}</>;
  };
  return WrappedComponent;
};
