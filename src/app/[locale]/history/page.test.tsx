import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import HistoryPage from './page';

vi.mock('react', async () => {
  const actualReact = await vi.importActual('react');
  return {
    ...actualReact,
    lazy: vi.fn((): (() => React.JSX.Element) => {
      const Component = (): React.JSX.Element => (
        <div>Mocked History Component</div>
      );
      Component.displayName = 'LazyMockComponent';
      return Component;
    }),
  };
});

vi.mock('@/hocs/authCheck', () => ({
  authCheck: vi.fn((Component): (() => React.JSX.Element) => {
    const WrappedComponent = (): React.JSX.Element => (
      <div data-testid="authenticated">{<Component />}</div>
    );
    WrappedComponent.displayName = `authCheck(${Component.displayName || Component.name || 'Component'})`;
    return WrappedComponent;
  }),
}));

describe('HistoryPage Component', () => {
  it('renders the History component wrapped in authCheck after loading', async () => {
    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Mocked History Component')).toBeInTheDocument();
    });

    expect(screen.getByTestId('authenticated')).toBeInTheDocument();
  });

  it('does not show the fallback after the component is loaded', async () => {
    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText('Mocked History Component')).toBeInTheDocument();
    });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
