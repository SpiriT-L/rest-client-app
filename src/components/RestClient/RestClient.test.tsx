import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import RestClient from './RestClient';
import { useVariables } from '@/components/Variables/useVariables';
import { useHistory } from '@/components/History/useHistory';

vi.mock('next-intl', () => ({
  useTranslations: () => {
    return (key: string): string => key;
  },
  useLocale: (): string => 'en',
}));

vi.mock('@/components/Variables/useVariables', () => ({
  useVariables: vi.fn(),
}));

vi.mock('@/components/History/useHistory', () => ({
  useHistory: vi.fn(),
}));

const mockPushState = vi.fn();
Object.defineProperty(window, 'history', {
  value: { pushState: mockPushState },
  writable: true,
});

describe('RestClient', () => {
  const mockVariables = new Map([['testVar', 'testValue']]);
  const mockAddToHistory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useVariables as ReturnType<typeof vi.fn>).mockReturnValue([mockVariables]);
    (useHistory as ReturnType<typeof vi.fn>).mockReturnValue({
      addRequestToHistory: mockAddToHistory,
    });
    global.fetch = vi.fn();
  });

  it('renders with initial state', () => {
    render(<RestClient />);

    expect(screen.getByRole('button', { name: 'send_request' })).toBeDisabled();
  });

  it('enables submit button when URL is provided', () => {
    render(<RestClient initialUrl={btoa('https://api.example.com')} />);

    expect(screen.getByRole('button', { name: 'send_request' })).toBeEnabled();
  });

  it('adds request to history after successful submission', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      text: () => Promise.resolve('{"success": true}'),
    });
    global.fetch = mockFetch;

    render(
      <RestClient
        initialMethod="GET"
        initialUrl={btoa('https://api.example.com')}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'send_request' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddToHistory).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://api.example.com',
          executionTime: expect.any(Number),
        })
      );
    });
  });

  it('handles request errors gracefully', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    render(
      <RestClient
        initialMethod="GET"
        initialUrl={btoa('https://api.example.com')}
      />
    );

    const submitButton = screen.getByRole('button', { name: 'send_request' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/response_error_message/)).toBeInTheDocument();
    });
  });
});
