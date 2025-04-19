import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';

export const guestCheck = (Child: React.FC): React.FC => {
  const WrappedComponent: React.FC = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      if (user) {
        router.push('/');
      }
    }, [user, router]);

    return user ? null : <Child />;
  };
  return WrappedComponent;
};
