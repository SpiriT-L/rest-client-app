import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { guestCheck } from './guestCheck';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import React, { JSX } from 'react';
import { useRouter } from 'next/navigation';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('guestCheck HOC', () => {
  const MockChild: () => React.JSX.Element = () => (
    <div data-testid="child-component">Child Content</div>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: vi.fn(),
    });
  });

  it('renders Child component when user is not authenticated', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([null, false]);

    const WrappedComponent = guestCheck(MockChild);
    render(<WrappedComponent />);

    expect(screen.getByTestId('child-component')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('redirects to home page when user is authenticated', () => {
    const mockPush = vi.fn();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([
      { uid: '123', email: 'test@example.com' },
      false,
    ]);

    const WrappedComponent = guestCheck(MockChild);
    render(<WrappedComponent />);

    expect(mockPush).toHaveBeenCalledWith('/');
    expect(screen.queryByTestId('child-component')).not.toBeInTheDocument();
  });

  it('calls useAuthState with correct auth object', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([null, false]);

    const WrappedComponent = guestCheck(MockChild);
    render(<WrappedComponent />);

    expect(useAuthState).toHaveBeenCalledWith(auth);
  });
});
