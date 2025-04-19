import { NotSignedIn } from '@/components/NotSignedIn/NotSignedIn';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';

export const authCheck = <P extends object>(
  Child: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = props => {
    const [user] = useAuthState(auth);
    return <>{user ? <Child {...props} /> : <NotSignedIn />}</>;
  };
  return WrappedComponent;
};
