import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { authCheck } from './authCheck';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import React, { JSX } from 'react';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('@/firebase/config', () => ({
  auth: {},
}));

vi.mock('@/components/NotSignedIn/NotSignedIn', () => ({
  NotSignedIn: (): JSX.Element => (
    <div data-testid="not-signed-in">Not Signed In</div>
  ),
}));

describe('authCheck HOC', () => {
  const MockChild: () => React.JSX.Element = () => (
    <div data-testid="child-component">Child Content</div>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Child component when user is authenticated', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([
      { uid: '123', email: 'test@example.com' },
      false,
    ]);

    const WrappedComponent = authCheck(MockChild);
    render(<WrappedComponent />);

    expect(screen.getByTestId('child-component')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();

    expect(screen.queryByTestId('not-signed-in')).not.toBeInTheDocument();
  });

  it('renders NotSignedIn component when user is not authenticated', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([null, false]);

    const WrappedComponent = authCheck(MockChild);
    render(<WrappedComponent />);

    expect(screen.getByTestId('not-signed-in')).toBeInTheDocument();
    expect(screen.getByText('Not Signed In')).toBeInTheDocument();

    expect(screen.queryByTestId('child-component')).not.toBeInTheDocument();
  });

  it('calls useAuthState with correct auth object', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([null, false]);

    const WrappedComponent = authCheck(MockChild);
    render(<WrappedComponent />);

    expect(useAuthState).toHaveBeenCalledWith(auth);
  });
});
