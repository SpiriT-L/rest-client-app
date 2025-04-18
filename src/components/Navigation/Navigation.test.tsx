import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Navigation } from './Navigation';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import styles from './Navigation.module.scss';
import { JSX } from 'react';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('@/firebase/config', () => ({
  auth: {
    signOut: vi.fn(),
  },
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, className }): JSX.Element => (
    <a href={href} className={className} data-testid={`link-${href}`}>
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

describe('Navigation Component', () => {
  const mockTranslations = {
    sign_in: 'Sign In',
    sing_up: 'Sign Up',
    rest_client: 'REST Client',
    history: 'History',
    variables: 'Variables',
    sign_out: 'Sign Out',
  };

  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter);
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/');
    (auth.signOut as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  it('renders login and register links for unauthenticated user', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([null, false]);

    render(<Navigation />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass(styles.navigation);

    expect(screen.getByTestId('link-/login')).toHaveTextContent('Sign In');
    expect(screen.getByTestId('link-/login')).toHaveClass(styles.navItem);
    expect(screen.getByTestId('link-/register')).toHaveTextContent('Sign Up');
    expect(screen.getByTestId('link-/register')).toHaveClass(styles.navItem);

    expect(screen.queryByText('REST Client')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  it('renders authenticated links, email, and sign-out button for authenticated user', () => {
    const mockUser = { email: 'test@example.com' };
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([
      mockUser,
      false,
    ]);

    render(<Navigation />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();

    expect(screen.getByTestId('link-rest-client')).toHaveTextContent(
      'REST Client'
    );
    expect(screen.getByTestId('link-rest-client')).toHaveClass(styles.navItem);
    expect(screen.getByTestId('link-history')).toHaveTextContent('History');
    expect(screen.getByTestId('link-variables')).toHaveTextContent('Variables');

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sign Out' })
    ).toBeInTheDocument();

    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('applies active class to link matching current pathname', () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/rest-client');
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([
      { email: 'test@example.com' },
      false,
    ]);

    render(<Navigation />);

    expect(screen.getByTestId('link-rest-client')).toHaveClass('active');
    expect(screen.getByTestId('link-history')).not.toHaveClass('active');
    expect(screen.getByTestId('link-variables')).not.toHaveClass('active');
  });

  it('handles sign-out and redirects to home', async () => {
    const mockUser = { email: 'test@example.com' };
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([
      mockUser,
      false,
    ]);

    render(<Navigation />);

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' });
    fireEvent.click(signOutButton);

    await expect(auth.signOut).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('uses correct translation keys', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([null, false]);

    render(<Navigation />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders accessible navigation structure', () => {
    (useAuthState as ReturnType<typeof vi.fn>).mockReturnValue([null, false]);

    render(<Navigation />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
      'href',
      '/login'
    );
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute(
      'href',
      '/register'
    );
  });
});
