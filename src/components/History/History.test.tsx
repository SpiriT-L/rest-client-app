import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import History from './History';
import { useHistory } from '@/components/History/useHistory';
import { useTranslations } from 'next-intl';
import { buildRequestRoute } from '@/utils/buildRequestRoute';
import { RequestModel } from '@/models/request.model';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/components/History/useHistory', () => ({
  useHistory: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }): React.JSX.Element => (
    <a href={href} {...props} data-testid="mocked-link">
      {children}
    </a>
  ),
}));

vi.mock('@/utils/buildRequestRoute', () => ({
  buildRequestRoute: vi.fn(),
}));

describe('History Component', () => {
  const mockTranslations = {
    history: 'History',
    no_history: 'No history yet',
    empty: 'Your history is empty',
    options: 'Try making a request in',
    link: 'Rest Client',
  };

  const mockHistory = [
    {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      executionTime: 1234567890,
    },
    {
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: { title: 'fakeTitle', userId: 1, body: 'fakeMessage' },
      headers: { 'Content-Type': 'application/json' },
      executionTime: 1234567891,
    },
  ] as RequestModel[];

  beforeEach(() => {
    vi.restoreAllMocks();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );
    (useHistory as ReturnType<typeof vi.fn>).mockReturnValue({
      history: null,
      addRequestToHistory: vi.fn(),
    });
    // Mock buildRequestRoute
    (buildRequestRoute as ReturnType<typeof vi.fn>).mockImplementation(
      (request: RequestModel) => {
        if (request.method === 'GET') {
          return '/GET/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3RzLzE=';
        }
        return '/POST/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3Rz/eyJ0aXRsZSI6ImZha2VUaXRsZSIsInVzZXJJZCI6MSwiYm9keSI6ImZha2VNZXNzYWdlIn0=?Content-Type=application%2Fjson';
      }
    );
  });

  it('renders empty state when history is null', () => {
    render(<History />);

    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('No history yet')).toBeInTheDocument();
    expect(screen.getByText('Your history is empty')).toBeInTheDocument();
    expect(screen.getByText('Try making a request in')).toBeInTheDocument();
    expect(screen.getByText('Rest Client')).toBeInTheDocument();

    const link = screen.getByTestId('mocked-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/rest-client');
  });

  it('renders empty state when history is empty array', () => {
    (useHistory as ReturnType<typeof vi.fn>).mockReturnValue({
      history: [],
      addRequestToHistory: vi.fn(),
    });
    render(<History />);

    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('No history yet')).toBeInTheDocument();
    expect(screen.getByText('Your history is empty')).toBeInTheDocument();
    expect(screen.getByText('Rest Client')).toBeInTheDocument();

    const link = screen.getByTestId('mocked-link');
    expect(link).toHaveAttribute('href', '/rest-client');
  });

  it('renders history items when history exists', () => {
    (useHistory as ReturnType<typeof vi.fn>).mockReturnValue({
      history: mockHistory,
      addRequestToHistory: vi.fn(),
    });
    render(<History />);

    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.queryByText('No history yet')).not.toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(
      screen.getByText('https://jsonplaceholder.typicode.com/posts/1')
    ).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(
      screen.getByText('https://jsonplaceholder.typicode.com/posts')
    ).toBeInTheDocument();

    const links = screen.getAllByTestId('mocked-link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      'href',
      '/rest-client/GET/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3RzLzE='
    );
    expect(links[1]).toHaveAttribute(
      'href',
      '/rest-client/POST/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3Rz/eyJ0aXRsZSI6ImZha2VUaXRsZSIsInVzZXJJZCI6MSwiYm9keSI6ImZha2VNZXNzYWdlIn0=?Content-Type=application%2Fjson'
    );
  });
});
