import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Variables } from './Variables';
import * as useVariablesHook from './useVariables';
import styles from './Variables.module.scss';

vi.mock('@/components/VariableItem/VariableItem', () => ({
  VariableItem: ({
    name,
    value,
    addItemAction,
    removeItemAction,
  }): React.JSX.Element => (
    <div data-testid={`variable-item-${name}`}>
      {name}: {value}
      <button onClick={() => addItemAction(name, value)}>Add</button>
      <button onClick={() => removeItemAction(name)}>Remove</button>
    </div>
  ),
}));

describe('Variables Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders with no variables initially', () => {
    vi.spyOn(useVariablesHook, 'useVariables').mockReturnValue([
      null,
      vi.fn(),
      vi.fn(),
      vi.fn(),
    ]);
    render(<Variables />);

    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByText('No variables added yet')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add new variable/i })
    ).toBeInTheDocument();
  });

  it('renders variables when present', () => {
    const mockVariables = [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ];
    vi.spyOn(useVariablesHook, 'useVariables').mockReturnValue([
      mockVariables,
      vi.fn(),
      vi.fn(),
      vi.fn(),
    ]);
    render(<Variables />);

    expect(
      screen.queryByText('No variables added yet')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('variable-item-key1')).toHaveTextContent(
      'key1: value1'
    );
    expect(screen.getByTestId('variable-item-key2')).toHaveTextContent(
      'key2: value2'
    );
  });

  it('calls addEmptyVariableItem when "Add new variable" button is clicked', () => {
    const mockAddEmptyVariableItem = vi.fn();
    vi.spyOn(useVariablesHook, 'useVariables').mockReturnValue([
      null,
      vi.fn(),
      vi.fn(),
      mockAddEmptyVariableItem,
    ]);
    render(<Variables />);

    const addButton = screen.getByRole('button', { name: /add new variable/i });
    fireEvent.click(addButton);

    expect(mockAddEmptyVariableItem).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles to the container', () => {
    vi.spyOn(useVariablesHook, 'useVariables').mockReturnValue([
      null,
      vi.fn(),
      vi.fn(),
      vi.fn(),
    ]);
    const { container } = render(<Variables />);

    const div = container.querySelector('div');
    expect(div).toHaveClass(styles.variables);
  });
});
