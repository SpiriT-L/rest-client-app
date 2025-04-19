import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { NotFound } from './NotFound';
import { useTranslations } from 'next-intl';
import styles from './NotFound.module.scss';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('./NotFound.module.scss', () => ({
  default: {
    notFound: 'notFound',
  },
}));

describe('NotFound Component', () => {
  const mockTranslations = {
    not_found: 'Page Not Found',
    not_exist: 'This page does not exist.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );
  });

  it('renders 404 heading, translated heading, and translated paragraph', () => {
    render(<NotFound />);

    const heading404 = screen.getByRole('heading', { level: 1, name: '404' });
    expect(heading404).toBeInTheDocument();

    const headingNotFound = screen.getByRole('heading', {
      level: 1,
      name: 'Page Not Found',
    });
    expect(headingNotFound).toBeInTheDocument();

    const paragraph = screen.getByText('This page does not exist.');
    expect(paragraph).toBeInTheDocument();
  });

  it('applies correct styles to the container', () => {
    const { container } = render(<NotFound />);

    const notFoundDiv = container.querySelector('div');
    expect(notFoundDiv).toHaveClass(styles.notFound);
  });

  it('uses correct translation keys from next-intl', () => {
    render(<NotFound />);

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('This page does not exist.')).toBeInTheDocument();
  });
});
