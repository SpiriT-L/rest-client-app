import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { authCheck } from '@/hocs/authCheck';
import { Variables } from '@/components/Variables/Variables';
import AuthenticatedVariables from './page';

vi.mock('@/hocs/authCheck', () => ({
  authCheck: vi.fn(Component => Component),
}));

vi.mock('@/components/Variables/Variables', () => ({
  Variables: (): React.JSX.Element => <div>Mocked Variables Component</div>,
}));

describe('AuthenticatedVariables Component', () => {
  it('applies authCheck HOC to the Variables component', () => {
    render(<AuthenticatedVariables />);

    expect(screen.getByText('Mocked Variables Component')).toBeInTheDocument();

    expect(authCheck).toHaveBeenCalledWith(Variables);
    expect(authCheck).toHaveBeenCalledTimes(1);
  });
});
