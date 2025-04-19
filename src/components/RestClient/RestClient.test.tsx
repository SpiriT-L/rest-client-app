import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RestClient from './RestClient';
import { useRouter } from 'next/navigation';
import { useVariables } from '@/components/Variables/useVariables';
import { useHistory } from '@/components/History/useHistory';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock('@/components/Variables/useVariables', () => ({
  useVariables: vi.fn(),
}));

vi.mock('@/components/History/useHistory', () => ({
  useHistory: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/components/MethodSelector/MethodSelector', () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }): JSX.Element => (
    <select
      data-testid="method-selector"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="GET">GET</option>
      <option value="POST">POST</option>
    </select>
  ),
}));

vi.mock('@/components/UrlInput/UrlInput', () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }): JSX.Element => (
    <input
      data-testid="url-input"
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  ),
}));

vi.mock('@/components/HeadersEditor/HeadersEditor', () => ({
  default: ({
    headers,
    onChange,
  }: {
    headers: Array<{ key: string; value: string }>;
    onChange: (headers: Array<{ key: string; value: string }>) => void;
  }): JSX.Element => (
    <div data-testid="headers-editor">
      {headers.map((header, index) => (
        <div key={index}>
          <input
            data-testid={`header-key-${index}`}
            value={header.key}
            onChange={e => {
              const newHeaders = [...headers];
              newHeaders[index] = { ...header, key: e.target.value };
              onChange(newHeaders);
            }}
          />
          <input
            data-testid={`header-value-${index}`}
            value={header.value}
            onChange={e => {
              const newHeaders = [...headers];
              newHeaders[index] = { ...header, value: e.target.value };
              onChange(newHeaders);
            }}
          />
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@/components/BodyEditor/BodyEditor', () => ({
  default: ({
    value,
    onChange,
    readOnly,
    title,
  }: {
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    title: string;
  }): JSX.Element => (
    <div
      data-testid={readOnly ? 'response-body-editor' : 'request-body-editor'}
    >
      <h3>{title}</h3>
      <textarea
        data-testid={
          readOnly ? 'response-body-textarea' : 'request-body-textarea'
        }
        value={value}
        onChange={e => onChange?.(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  ),
}));

vi.mock('@/components/CodeGenerator/CodeGenerator', () => ({
  default: ({ state }: { state: unknown }): JSX.Element => (
    <div data-testid="code-generator">{JSON.stringify(state)}</div>
  ),
}));

describe('RestClient', () => {
  const mockPush = vi.fn();
  const mockT = vi.fn(key => key);

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (usePathname as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      '/rest-client/GET/'
    );
    (useVariables as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      [],
      vi.fn(),
      vi.fn(),
      vi.fn(),
    ]);
    (useHistory as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      addRequestToHistory: vi.fn(),
    });
    (useTranslations as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockT
    );
  });

  it('renders initial state correctly', () => {
    render(<RestClient />);

    expect(screen.getByTestId('method-selector')).toHaveValue('GET');
    expect(screen.getByTestId('url-input')).toHaveValue('');
    expect(screen.getByTestId('request-body-editor')).toBeInTheDocument();
    expect(screen.getByTestId('response-body-editor')).toBeInTheDocument();
    expect(screen.getByTestId('code-generator')).toBeInTheDocument();
  });

  it('initializes state from route parameters', () => {
    render(
      <RestClient
        initialMethod="POST"
        initialUrl={btoa('https://api.example.com')}
      />
    );

    expect(screen.getByTestId('method-selector')).toHaveValue('POST');
    expect(screen.getByTestId('url-input')).toHaveValue(
      'https://api.example.com'
    );
  });

  it('updates route when state changes', () => {
    render(<RestClient />);

    fireEvent.change(screen.getByTestId('method-selector'), {
      target: { value: 'POST' },
    });
    fireEvent.change(screen.getByTestId('url-input'), {
      target: { value: 'https://api.example.com/api' },
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/rest-client/POST/'),
      expect.anything()
    );
  });

  it('handles request submission', async () => {
    const mockAddRequestToHistory = vi.fn();
    (useHistory as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      addRequestToHistory: mockAddRequestToHistory,
    });

    const mockResponse = {
      status: 200,
      text: async (): Promise<string> => '{"data": "success"}',
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const { getByTestId, getByText } = render(<RestClient />);

    // Fill in the form
    const urlInput = getByTestId('url-input');
    await userEvent.type(urlInput, 'https://api.example.com/api');

    const bodyTextarea = getByTestId('request-body-textarea');
    await userEvent.type(bodyTextarea, '{"test": "data"}');

    // Submit the form
    const submitButton = getByText('send_request');
    await userEvent.click(submitButton);

    // Wait for the response
    await waitFor(() => {
      expect(mockAddRequestToHistory).toHaveBeenCalledWith({
        url: 'https://api.example.com/api',
        method: 'GET',
        headers: {},
        body: { test: 'data' },
        executionTime: expect.any(Number),
      });
    });
  });
});
