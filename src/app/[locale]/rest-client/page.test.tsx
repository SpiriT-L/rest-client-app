import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import RestClientPage from './page';

vi.mock('@/components/RestClient/RestClient', () => ({
  default: () => <div>Mocked RestClient Component</div>,
}));

vi.mock('@/hocs/authCheck', () => ({
  authCheck: (Component: React.ComponentType) => {
    const WrappedComponent = () => (
      <div data-testid="authenticated">
        <Component />
      </div>
    );
    return WrappedComponent;
  },
}));

describe('RestClientPage Component', () => {
  it('renders the RestClient component wrapped in authCheck after loading', async () => {
    render(<RestClientPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Mocked RestClient Component')
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId('authenticated')).toBeInTheDocument();
  });

  it('does not show the fallback after the component is loaded', async () => {
    render(<RestClientPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Mocked RestClient Component')
      ).toBeInTheDocument();
    });

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });
});
