import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { useTranslations } from 'next-intl';
import NoPage from '@/app/not-found';
import { JSX } from 'react';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/components/NotFound/NotFound.module.scss', () => ({
  default: {
    notFound: 'notFound',
  },
}));

vi.mock('@/components/NotFound/NotFound', () => ({
  NotFound: (): JSX.Element => (
    <div data-testid="not-found">Mocked Not Found</div>
  ),
}));

describe('NoPage Component', () => {
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

  it('renders NotFound component', () => {
    render(<NoPage />);

    expect(screen.getByTestId('not-found')).toBeInTheDocument();
    expect(screen.getByText('Mocked Not Found')).toBeInTheDocument();
  });
});
