import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from './Navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { JSX } from 'react';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(
    (namespace: string) =>
      (key: string): string =>
        `${namespace}.${key}`
  ),
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('@/firebase/config', () => ({
  auth: {
    signOut: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className: string;
  }): JSX.Element => (
    <a href={href} className={className} data-testid="link">
      {children}
    </a>
  ),
}));

vi.mock('./Navigation.module.scss', () => ({
  default: {
    navigation: 'navigation',
    navItem: 'navItem',
  },
}));

describe('Navigation', () => {
  const mockRouter = { push: vi.fn() };
  const mockUser = {
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useRouter.mockImplementation(() => mockRouter);
    usePathname.mockImplementation(() => '/');
    useTranslations.mockImplementation(
      (namespace: string) =>
        (key: string): string =>
          `${namespace}.${key}`
    );
  });

  it('renders login and register links when user is not authenticated', () => {
    useAuthState.mockImplementation(() => [null, false]);
    render(<Navigation />);

    expect(screen.getByText('Navigation.sign_in')).toBeInTheDocument();
    expect(screen.getByText('Navigation.sing_up')).toBeInTheDocument();
  });

  it('renders navigation items when user is authenticated', () => {
    useAuthState.mockImplementation(() => [mockUser, false]);
    render(<Navigation />);

    expect(screen.getByText('Navigation.rest_client')).toBeInTheDocument();
    expect(screen.getByText('Navigation.history')).toBeInTheDocument();
    expect(screen.getByText('Navigation.variables')).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText('Navigation.sign_out')).toBeInTheDocument();
  });

  it('handles sign out correctly', async () => {
    useAuthState.mockImplementation(() => [mockUser, false]);
    render(<Navigation />);

    const signOutButton = screen.getByText('Navigation.sign_out');
    await fireEvent.click(signOutButton);

    expect(auth.signOut).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('applies active class to current route', () => {
    useAuthState.mockImplementation(() => [mockUser, false]);
    usePathname.mockImplementation(() => '/rest-client');
    render(<Navigation />);

    const restClientLink = screen.getByText('Navigation.rest_client');
    expect(restClientLink.className).toContain('active');
  });

  it('does not apply active class to non-current routes', () => {
    useAuthState.mockImplementation(() => [mockUser, false]);
    usePathname.mockImplementation(() => '/rest-client');
    render(<Navigation />);

    const historyLink = screen.getByText('Navigation.history');
    const variablesLink = screen.getByText('Navigation.variables');

    expect(historyLink.className).not.toContain('active');
    expect(variablesLink.className).not.toContain('active');
  });

  it('handles auth error state', () => {
    useAuthState.mockImplementation(() => [
      null,
      false,
      new Error('Auth error'),
    ]);
    render(<Navigation />);

    expect(screen.getByText('Navigation.sign_in')).toBeInTheDocument();
    expect(screen.getByText('Navigation.sing_up')).toBeInTheDocument();
  });
});
