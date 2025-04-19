import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import HeadersEditor from './HeadersEditor';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('HeadersEditor', () => {
  const mockOnChange = vi.fn();
  const initialHeaders = [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer token' },
  ];

  beforeEach(() => {
    mockOnChange.mockClear();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(
      (key: string) => {
        const translations: Record<string, string> = {
          header_name: 'Header Name',
          header_value: 'Header Value',
          new_header_key: 'New Header Key',
          new_header_value: 'New Header Value',
          add_header: 'Add Header',
          remove_header: 'Remove',
        };
        return translations[key] || key;
      }
    );
  });

  it('renders existing headers', () => {
    render(<HeadersEditor headers={initialHeaders} onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('Content-Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('application/json')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Authorization')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bearer token')).toBeInTheDocument();
  });

  it('allows adding a new header', () => {
    render(<HeadersEditor headers={initialHeaders} onChange={mockOnChange} />);

    const keyInput = screen.getByPlaceholderText('New Header Key');
    const valueInput = screen.getByPlaceholderText('New Header Value');
    const addButton = screen.getByText('Add Header');

    fireEvent.change(keyInput, { target: { value: 'X-Custom-Header' } });
    fireEvent.change(valueInput, { target: { value: 'custom-value' } });
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith([
      ...initialHeaders,
      { key: 'X-Custom-Header', value: 'custom-value' },
    ]);
  });

  it('does not add empty headers', () => {
    render(<HeadersEditor headers={initialHeaders} onChange={mockOnChange} />);

    const addButton = screen.getByText('Add Header');
    fireEvent.click(addButton);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('allows removing a header', () => {
    render(<HeadersEditor headers={initialHeaders} onChange={mockOnChange} />);

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: 'Authorization', value: 'Bearer token' },
    ]);
  });

  it('allows updating a header', () => {
    render(<HeadersEditor headers={initialHeaders} onChange={mockOnChange} />);

    const keyInputs = screen.getAllByPlaceholderText('Header Name');
    fireEvent.change(keyInputs[0], {
      target: { value: 'Content-Type-Updated' },
    });

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: 'Content-Type-Updated', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer token' },
    ]);
  });

  it('clears new header inputs after adding', () => {
    render(<HeadersEditor headers={initialHeaders} onChange={mockOnChange} />);

    const keyInput = screen.getByPlaceholderText('New Header Key');
    const valueInput = screen.getByPlaceholderText('New Header Value');
    const addButton = screen.getByText('Add Header');

    fireEvent.change(keyInput, { target: { value: 'X-Custom-Header' } });
    fireEvent.change(valueInput, { target: { value: 'custom-value' } });
    fireEvent.click(addButton);

    expect(keyInput).toHaveValue('');
    expect(valueInput).toHaveValue('');
  });
});
