import { render, screen } from '@testing-library/react';
import UserActions from './UserActions';
import { vi, describe, it, expect, type Mock } from 'vitest';
import type { User } from 'firebase/auth';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: () => [],
  getApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
}));

vi.mock('../../firebase/config', () => ({
  app: {},
  auth: {},
}));

vi.mock('react-firebase-hooks/auth', async () => {
  return {
    useAuthState: vi.fn(),
  };
});

vi.mock('next/link', async () => {
  const React = await import('react');
  type AnchorProps = React.ComponentPropsWithoutRef<'a'>;
  const MockLink = React.forwardRef<HTMLAnchorElement, AnchorProps>(
    (props, ref) => <a ref={ref} {...props} />
  );
  MockLink.displayName = 'MockLink';
  return {
    default: MockLink,
  };
});

describe('<UserActions />', () => {
  it('renders sign in and sign up buttons when user is not logged in', () => {
    (useAuthState as Mock).mockReturnValue([null]);
    render(<UserActions />);
    expect(screen.getByText('button_sign_in')).toBeInTheDocument();
    expect(screen.getByText('button_sign_up')).toBeInTheDocument();
  });

  it('renders rest client button when user is logged in', () => {
    (useAuthState as Mock).mockReturnValue([{ uid: 'user123' } as User]);
    render(<UserActions />);
    expect(screen.getByText(/🚀/)).toBeInTheDocument();
  });
});
