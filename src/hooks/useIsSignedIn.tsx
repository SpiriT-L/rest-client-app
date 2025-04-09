'use client';

import { useEffect, useState } from 'react';

export const useIsSignedIn = (): boolean => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkSignInStatus = (): void => {
      const token = localStorage.getItem('token');
      setIsSignedIn(Boolean(token));
    };

    checkSignInStatus();
  }, []);

  return isSignedIn;
};
