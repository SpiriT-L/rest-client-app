import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { NotSignedIn } from './NotSignedIn';
import styles from './NotSignedIn.module.scss';
import { useTranslations } from 'next-intl';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('NotSignedIn Component', () => {
  const mockTranslations = {
    not_signed_in: 'You are not signed in',
    come_back: 'Please do it and come back',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );
  });

  it('renders the correct text content', () => {
    render(<NotSignedIn />);

    expect(screen.getByText('You are not signed in')).toBeInTheDocument();
    expect(screen.getByText('Please do it and come back')).toBeInTheDocument();
  });

  it('applies the correct styles to the container', () => {
    const { container } = render(<NotSignedIn />);

    const div = container.querySelector('div');
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass(styles.notSignedIn);
  });
});
