import { NotSignedIn } from '@/components/NotSignedIn/NotSignedIn';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';

export const authCheck = (Child: React.FC): React.FC => {
  const WrappedComponent: React.FC = () => {
    const [user] = useAuthState(auth);
    return <>{user ? <Child /> : <NotSignedIn />}</>;
  };
  return WrappedComponent;
};
