import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MethodSelector from './MethodSelector';

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

describe('MethodSelector', () => {
  const mockOnChange = vi.fn();
  const initialMethod: HttpMethod = 'GET';

  it('renders all HTTP methods', () => {
    render(<MethodSelector value={initialMethod} onChange={mockOnChange} />);

    // Check if all methods are rendered
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('PUT')).toBeInTheDocument();
    expect(screen.getByText('DELETE')).toBeInTheDocument();
    expect(screen.getByText('PATCH')).toBeInTheDocument();
    expect(screen.getByText('HEAD')).toBeInTheDocument();
    expect(screen.getByText('OPTIONS')).toBeInTheDocument();
  });

  it('selects the correct initial method', () => {
    render(<MethodSelector value={initialMethod} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue(initialMethod);
  });

  it('calls onChange when method is changed', () => {
    render(<MethodSelector value={initialMethod} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'POST' } });

    expect(mockOnChange).toHaveBeenCalledWith('POST');
  });

  it('maintains selected value after change', () => {
    let currentValue: HttpMethod = initialMethod;
    const handleChange = (newValue: HttpMethod) => {
      currentValue = newValue;
    };

    const { rerender } = render(
      <MethodSelector value={currentValue} onChange={handleChange} />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'POST' } });

    // Re-render with the new value
    rerender(<MethodSelector value={currentValue} onChange={handleChange} />);

    // The value should be updated in the DOM
    expect(select).toHaveValue('POST');
  });

  it('handles all method changes correctly', () => {
    const methods: HttpMethod[] = [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'HEAD',
      'OPTIONS',
    ];

    render(<MethodSelector value={initialMethod} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');

    methods.forEach(method => {
      fireEvent.change(select, { target: { value: method } });
      expect(mockOnChange).toHaveBeenCalledWith(method);
      mockOnChange.mockClear();
    });
  });
});
