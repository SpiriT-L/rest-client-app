import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Header from './Header';
import styles from './Header.module.scss';
import { useTranslations } from 'next-intl';
import * as useIsSignedInHook from '@/hooks/useIsSignedIn';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/hooks/useIsSignedIn', () => ({
  useIsSignedIn: vi.fn(),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height }): React.JSX.Element => (
    <div
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-testid="mocked-image"
    />
  ),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }): React.JSX.Element => (
    <a href={href} {...props} data-testid="mocked-link">
      {children}
    </a>
  ),
}));

vi.mock('../LanguageSwitcher/LanguageSwitcher', () => ({
  default: (): React.JSX.Element => (
    <div data-testid="language-switcher">Language Switcher</div>
  ),
}));

vi.mock('@/components/Navigation/Navigation', () => ({
  Navigation: (): React.JSX.Element => (
    <nav data-testid="navigation">Navigation</nav>
  ),
}));

describe('Header Component', () => {
  const mockTranslations = {
    sign_in: 'Sign In',
    sing_up: 'Sign Up',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );
    (
      useIsSignedInHook.useIsSignedIn as ReturnType<typeof vi.fn>
    ).mockReturnValue(false);
  });

  it('renders header with logo, links, and language switcher', () => {
    render(<Header />);

    expect(screen.getByTestId('mocked-image')).toHaveAttribute('alt', 'Logo');
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.queryByTestId('navigation')).not.toBeInTheDocument();
  });

  it('renders navigation when user is signed in', () => {
    (
      useIsSignedInHook.useIsSignedIn as ReturnType<typeof vi.fn>
    ).mockReturnValue(true);
    render(<Header />);

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('applies shrink class when scrolled beyond threshold', () => {
    const { container } = render(<Header />);

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    const header = container.querySelector('header');
    expect(header).toHaveClass(styles.shrink);
  });

  it('removes shrink class when scrolled back to top', () => {
    const { container } = render(<Header />);

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    fireEvent.scroll(window);

    const header = container.querySelector('header');
    expect(header).not.toHaveClass(styles.shrink);
  });

  it('renders correct links with href attributes', () => {
    render(<Header />);

    const links = screen.getAllByTestId('mocked-link');
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/');
    expect(links[2]).toHaveAttribute('href', '/about');
  });
});
