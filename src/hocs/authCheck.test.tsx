import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { authCheck } from './authCheck';
import * as useIsSignedInHook from '@/hooks/useIsSignedIn';

vi.mock('@/components/NotSignedIn/NotSignedIn', () => ({
  NotSignedIn: (): React.JSX.Element => (
    <div data-testid="not-signed-in">Not Signed In</div>
  ),
}));

describe('authCheck HOC', () => {
  const MockChild = (): React.JSX.Element => (
    <div data-testid="child">Child Component</div>
  );

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Child component when user is signed in', () => {
    vi.spyOn(useIsSignedInHook, 'useIsSignedIn').mockReturnValue(true);

    const WrappedComponent = authCheck(MockChild);
    render(<WrappedComponent />);

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('not-signed-in')).not.toBeInTheDocument();
  });

  it('renders NotSignedIn component when user is not signed in', () => {
    vi.spyOn(useIsSignedInHook, 'useIsSignedIn').mockReturnValue(false);

    const WrappedComponent = authCheck(MockChild);
    render(<WrappedComponent />);

    expect(screen.getByTestId('not-signed-in')).toBeInTheDocument();
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });
});
