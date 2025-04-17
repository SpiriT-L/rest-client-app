import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Navigation } from './Navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './Navigation.module.scss';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, className }): React.JSX.Element => (
    <a href={href} className={className} data-testid="mocked-link">
      {children}
    </a>
  ),
}));

describe('Navigation Component', () => {
  const mockTranslations = {
    rest_client: 'Rest Client',
    history: 'History',
    variables: 'Variables',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );
    (usePathname as vi.Mock).mockReturnValue('/');
  });

  it('renders navigation links with translations', () => {
    render(<Navigation />);

    expect(screen.getByText('Rest Client')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Variables')).toBeInTheDocument();
  });

  it('applies active class to the link matching the current path', () => {
    (usePathname as vi.Mock).mockReturnValue('/history');
    render(<Navigation />);

    const restClientLink = screen.getByText('Rest Client');
    const historyLink = screen.getByText('History');
    const variablesLink = screen.getByText('Variables');

    expect(restClientLink).not.toHaveClass('active');
    expect(historyLink).toHaveClass('active');
    expect(variablesLink).not.toHaveClass('active');
  });

  it('does not apply active class for unmatched paths', () => {
    (usePathname as vi.Mock).mockReturnValue('/unknown-path');
    render(<Navigation />);

    const restClientLink = screen.getByText('Rest Client');
    const historyLink = screen.getByText('History');
    const variablesLink = screen.getByText('Variables');

    expect(restClientLink).not.toHaveClass('active');
    expect(historyLink).not.toHaveClass('active');
    expect(variablesLink).not.toHaveClass('active');
  });

  it('applies correct styles to the navigation container', () => {
    const { container } = render(<Navigation />);

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass(styles.navigation);
  });

  it('renders links with correct href attributes', () => {
    render(<Navigation />);

    const restClientLink = screen.getByText('Rest Client');
    const historyLink = screen.getByText('History');
    const variablesLink = screen.getByText('Variables');

    expect(restClientLink).toHaveAttribute('href', 'rest-client');
    expect(historyLink).toHaveAttribute('href', 'history');
    expect(variablesLink).toHaveAttribute('href', 'variables');
  });
});
