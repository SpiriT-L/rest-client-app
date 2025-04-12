import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { VariableItem } from './VariableItem';
import * as useVariableItemHook from './useVariableItem';
import styles from './VariableItem.module.scss';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    onClick,
    className,
  }): React.JSX.Element => (
    <div
      data-testid={`mocked-image-${alt}`}
      data-src={src}
      data-alt={alt}
      style={{ width, height }}
      onClick={onClick}
      className={className}
    />
  ),
}));

describe('VariableItem Component', () => {
  const defaultProps = {
    name: 'testKey',
    value: 'testValue',
    addItemAction: vi.fn(),
    removeItemAction: vi.fn(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with initial values and readonly state', () => {
    vi.spyOn(useVariableItemHook, 'useVariableItem').mockReturnValue([
      'testValue',
      'testKey',
      false,
      vi.fn(),
      vi.fn(),
      vi.fn().mockReturnValue(styles.action),
    ]);
    render(<VariableItem {...defaultProps} />);

    const inputs = screen.getAllByPlaceholderText('');
    const keyInput = inputs[0];
    const valueInput = inputs[1];

    expect(keyInput).toHaveValue('testKey');
    expect(valueInput).toHaveValue('testValue');
    expect(keyInput).toHaveClass(styles.readonly);
    expect(valueInput).toHaveClass(styles.readonly);
    expect(screen.getByTestId('mocked-image-save')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-image-remove')).toBeInTheDocument();
  });

  it('renders in editing state with placeholders', () => {
    vi.spyOn(useVariableItemHook, 'useVariableItem').mockReturnValue([
      'testValue',
      'testKey',
      true,
      vi.fn(),
      vi.fn(),
      vi.fn().mockReturnValue(styles.action),
    ]);
    render(<VariableItem {...defaultProps} />);

    const keyInput = screen.getByPlaceholderText('Variable name');
    const valueInput = screen.getByPlaceholderText('Variable value');
    expect(keyInput).toHaveValue('');
    expect(valueInput).toHaveValue('testValue');
    expect(keyInput).not.toHaveClass(styles.readonly);
    expect(valueInput).not.toHaveClass(styles.readonly);
  });

  it('calls setNewValues on input change', () => {
    const mockSetNewValues = vi.fn();
    vi.spyOn(useVariableItemHook, 'useVariableItem').mockReturnValue([
      'testValue',
      'testKey',
      false,
      mockSetNewValues,
      vi.fn(),
      vi.fn().mockReturnValue(styles.action),
    ]);
    render(<VariableItem {...defaultProps} />);

    const inputs = screen.getAllByPlaceholderText('');
    const keyInput = inputs[0];
    const valueInput = inputs[1];

    fireEvent.change(keyInput, { target: { value: 'newKey' } });
    fireEvent.change(valueInput, { target: { value: 'newValue' } });

    expect(mockSetNewValues).toHaveBeenCalledWith('key', 'newKey');
    expect(mockSetNewValues).toHaveBeenCalledWith('value', 'newValue');
  });

  it('calls saveVariable on save button click', () => {
    const mockSaveVariable = vi.fn();
    vi.spyOn(useVariableItemHook, 'useVariableItem').mockReturnValue([
      'testValue',
      'testKey',
      true,
      vi.fn(),
      mockSaveVariable,
      vi.fn().mockReturnValue(styles.action),
    ]);
    render(<VariableItem {...defaultProps} />);

    const saveButton = screen.getByTestId('mocked-image-save');
    fireEvent.click(saveButton);

    expect(mockSaveVariable).toHaveBeenCalledTimes(1);
  });

  it('calls removeItemAction on remove button click', () => {
    vi.spyOn(useVariableItemHook, 'useVariableItem').mockReturnValue([
      'testValue',
      'testKey',
      false,
      vi.fn(),
      vi.fn(),
      vi.fn().mockReturnValue(styles.action),
    ]);
    render(<VariableItem {...defaultProps} />);

    const removeButton = screen.getByTestId('mocked-image-remove');
    fireEvent.click(removeButton);

    expect(defaultProps.removeItemAction).toHaveBeenCalledWith('testKey');
  });

  it('applies correct styles based on getApplyActionStyles', () => {
    const mockGetApplyActionStyles = vi
      .fn()
      .mockReturnValueOnce(styles.invisible)
      .mockReturnValueOnce(styles.disabled);
    vi.spyOn(useVariableItemHook, 'useVariableItem').mockReturnValue([
      'testValue',
      'testKey',
      true,
      vi.fn(),
      vi.fn(),
      mockGetApplyActionStyles,
    ]);
    const { rerender } = render(<VariableItem {...defaultProps} />);

    const saveButton = screen.getByTestId('mocked-image-save');
    expect(saveButton).toHaveClass(styles.invisible);

    vi.spyOn(useVariableItemHook, 'useVariableItem').mockReturnValue([
      'testValue',
      'testKey',
      true,
      vi.fn(),
      vi.fn(),
      mockGetApplyActionStyles,
    ]);
    rerender(<VariableItem {...defaultProps} />);
    expect(saveButton).toHaveClass(styles.disabled);
  });
});
