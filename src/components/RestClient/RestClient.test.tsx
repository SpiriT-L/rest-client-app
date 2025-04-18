import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RestClient from './RestClient';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVariables } from '@/components/Variables/useVariables';
import { useHistory } from '@/components/History/useHistory';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
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
    headers: { key: string; value: string }[];
    onChange?: (headers: { key: string; value: string }[]) => void;
  }): JSX.Element => (
    <div data-testid="headers-editor">
      {headers.map((header, index) => (
        <div key={index}>
          <input
            data-testid={`header-key-${index}`}
            value={header.key}
            onChange={e =>
              onChange?.([
                ...headers.slice(0, index),
                { key: e.target.value, value: header.value },
                ...headers.slice(index + 1),
              ])
            }
          />
          <input
            data-testid={`header-value-${index}`}
            value={header.value}
            onChange={e =>
              onChange?.([
                ...headers.slice(0, index),
                { key: header.key, value: e.target.value },
                ...headers.slice(index + 1),
              ])
            }
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
  }: {
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
  }): JSX.Element => (
    <div
      data-testid={readOnly ? 'response-body-editor' : 'request-body-editor'}
    >
      <h3>{readOnly ? 'response_body' : 'request_body'}</h3>
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
  default: (): JSX.Element => <div data-testid="code-generator" />,
}));

describe('RestClient', () => {
  const mockPush = vi.fn();
  const mockT = vi.fn(key => key);

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useVariables as jest.Mock).mockReturnValue([
      [],
      vi.fn(),
      vi.fn(),
      vi.fn(),
    ]);
    (useHistory as jest.Mock).mockReturnValue({ addRequestToHistory: vi.fn() });
    (useTranslations as jest.Mock).mockReturnValue(mockT);
  });

  it('renders initial state correctly', () => {
    const mockSearchParams = {
      get: vi.fn().mockReturnValue(null),
      forEach: vi.fn(),
    };
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<RestClient />);

    expect(screen.getByTestId('method-selector')).toHaveValue('GET');
    expect(screen.getByTestId('url-input')).toHaveValue('');
    expect(screen.getByTestId('request-body-editor')).toBeInTheDocument();
    expect(screen.getByTestId('response-body-editor')).toBeInTheDocument();
    expect(screen.getByTestId('code-generator')).toBeInTheDocument();
  });

  it('initializes state from URL parameters', () => {
    const mockSearchParams = {
      get: vi.fn(key => {
        switch (key) {
          case 'method':
            return 'POST';
          case 'url':
            return btoa('https://api.example.com');
          case 'body':
            return btoa('{"test": "data"}');
          default:
            return null;
        }
      }),
      forEach: vi.fn(callback => {
        callback(encodeURIComponent('application/json'), 'Content-Type');
      }),
    };
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<RestClient />);

    expect(screen.getByTestId('method-selector')).toHaveValue('POST');
    expect(screen.getByTestId('url-input')).toHaveValue(
      'https://api.example.com'
    );
    expect(screen.getByTestId('header-key-0')).toHaveValue('Content-Type');
    expect(screen.getByTestId('header-value-0')).toHaveValue(
      'application/json'
    );
    expect(screen.getByTestId('request-body-textarea')).toHaveValue(
      '{"test": "data"}'
    );
  });

  it('updates URL when state changes', () => {
    const mockSearchParams = {
      get: vi.fn().mockReturnValue(null),
      forEach: vi.fn(),
    };
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<RestClient />);

    fireEvent.change(screen.getByTestId('method-selector'), {
      target: { value: 'POST' },
    });
    fireEvent.change(screen.getByTestId('url-input'), {
      target: { value: 'https://api.example.com/api' },
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('method=POST'),
      expect.anything()
    );
  });

  it('handles request submission', async () => {
    const mockSearchParams = {
      get: vi.fn().mockReturnValue(null),
      forEach: vi.fn(),
    };
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const mockResponse = {
      ok: true,
      status: 200,
      text: (): Promise<string> => Promise.resolve('{"data":"test"}'),
    };
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    render(<RestClient />);

    fireEvent.change(screen.getByTestId('method-selector'), {
      target: { value: 'POST' },
    });
    fireEvent.change(screen.getByTestId('url-input'), {
      target: { value: 'https://api.example.com/api' },
    });
    fireEvent.change(screen.getByTestId('request-body-textarea'), {
      target: { value: '{"test": "data"}' },
    });

    fireEvent.click(screen.getByText('send_request'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/api', {
        method: 'POST',
        headers: {},
        body: '{"test": "data"}',
      });
      expect(screen.getByTestId('response-body-textarea')).toHaveValue(
        '{"data":"test"}'
      );
    });
  });
});
