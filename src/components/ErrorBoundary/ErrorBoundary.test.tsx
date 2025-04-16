import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';
import { useTranslations } from 'next-intl';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }): React.JSX.Element => (
    <a href={href} {...props} data-testid="mocked-link">
      {children}
    </a>
  ),
}));

const ProblemChild: () => void = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary Component', () => {
  const mockTranslations = {
    title: 'Something went wrong',
    message: 'Please try again or return to the main page.',
    link: 'Go to Rest Client',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal Content')).toBeInTheDocument();
    expect(
      screen.queryByText('Oops! Something went wrong.')
    ).not.toBeInTheDocument();
  });

  it('displays fallback UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });
});
