import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Navigation } from './Navigation';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.scss';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders navigation links', () => {
    (usePathname as vi.Mock).mockReturnValue('/');
    render(<Navigation />);

    expect(screen.getByText('Rest-client')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Variables')).toBeInTheDocument();
  });

  it('applies "active" class to the correct link based on the current path', () => {
    (usePathname as vi.Mock).mockReturnValue('/history');
    render(<Navigation />);

    expect(screen.getByText('Rest-client')).not.toHaveClass('active');
    expect(screen.getByText('History')).toHaveClass('active');
    expect(screen.getByText('Variables')).not.toHaveClass('active');
  });

  it('does not apply "active" class if no link matches the current path', () => {
    (usePathname as vi.Mock).mockReturnValue('/unknown-path');
    render(<Navigation />);

    expect(screen.getByText('Rest-client')).not.toHaveClass('active');
    expect(screen.getByText('History')).not.toHaveClass('active');
    expect(screen.getByText('Variables')).not.toHaveClass('active');
  });

  it('applies the correct styles to the navigation container', () => {
    (usePathname as vi.Mock).mockReturnValue('/');
    const { container } = render(<Navigation />);

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass(styles.navigation);
  });

  it('ensures "href" values for links are correct', () => {
    (usePathname as vi.Mock).mockReturnValue('/');
    render(<Navigation />);

    const restClientLink = screen.getByText('Rest-client');
    const historyLink = screen.getByText('History');
    const variablesLink = screen.getByText('Variables');

    expect(restClientLink).toHaveAttribute('href', 'rest-client');
    expect(historyLink).toHaveAttribute('href', 'history');
    expect(variablesLink).toHaveAttribute('href', 'variables');
  });
});
