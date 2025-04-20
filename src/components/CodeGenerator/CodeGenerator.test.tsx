import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import CodeGenerator from './CodeGenerator';
import { useVariables } from '@/components/Variables/useVariables';
import { RestClientState, HttpMethod } from '@/models/rest-client';
import type { Mock } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/components/Variables/useVariables', () => ({
  useVariables: vi.fn(),
}));

describe('CodeGenerator', () => {
  const mockState: RestClientState = {
    method: 'GET' as HttpMethod,
    url: 'https://api.example.com',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    body: '{"test": "data"}',
    response: {
      status: null,
      body: '',
      ok: '',
    },
  };

  beforeEach(() => {
    (useTranslations as Mock).mockReturnValue((key: string) => {
      if (key === 'title') return 'Generated Code';
      return key;
    });

    (useVariables as Mock).mockReturnValue([[]]);
  });

  it('renders the component with title', () => {
    render(<CodeGenerator state={mockState} />);
    expect(screen.getByText('Generated Code')).toBeInTheDocument();
  });

  it('renders language selector', () => {
    render(<CodeGenerator state={mockState} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays cURL code by default', () => {
    render(<CodeGenerator state={mockState} />);
    expect(screen.getByText(/curl -X GET/)).toBeInTheDocument();
  });

  it('substitutes variables in the generated code', () => {
    const variables = [{ key: 'apiKey', value: '12345' }];
    (useVariables as Mock).mockReturnValue([variables]);

    const stateWithVariables: RestClientState = {
      ...mockState,
      url: 'https://api.example.com/{{apiKey}}',
    };

    render(<CodeGenerator state={stateWithVariables} />);
    expect(
      screen.getByText(/https:\/\/api.example.com\/12345/)
    ).toBeInTheDocument();
  });
});
