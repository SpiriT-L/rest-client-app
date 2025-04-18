import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import UrlInput from './UrlInput';

// Mock the translations
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('UrlInput', () => {
  const mockOnChange = vi.fn();
  const initialUrl = 'https://api.example.com';

  beforeEach(() => {
    // Reset mocks before each test
    mockOnChange.mockClear();
    (useTranslations as any).mockReturnValue((key: string) => {
      const translations: Record<string, string> = {
        placeholder: 'Enter URL...',
      };
      return translations[key] || key;
    });
  });

  it('renders with initial value', () => {
    render(<UrlInput value={initialUrl} onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(initialUrl);
  });

  it('renders with placeholder', () => {
    render(<UrlInput value="" onChange={mockOnChange} />);

    expect(screen.getByPlaceholderText('Enter URL...')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(<UrlInput value={initialUrl} onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    const newUrl = 'https://api.new-example.com';
    fireEvent.change(input, { target: { value: newUrl } });

    expect(mockOnChange).toHaveBeenCalledWith(newUrl);
  });

  it('updates input value when value prop changes', () => {
    const { rerender } = render(
      <UrlInput value={initialUrl} onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(initialUrl);

    const newUrl = 'https://api.new-example.com';
    rerender(<UrlInput value={newUrl} onChange={mockOnChange} />);

    expect(input).toHaveValue(newUrl);
  });

  it('handles special characters in URL', () => {
    render(<UrlInput value={initialUrl} onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    const urlWithSpecialChars =
      'https://api.example.com/path?param=value&param2=value2';
    fireEvent.change(input, { target: { value: urlWithSpecialChars } });

    expect(mockOnChange).toHaveBeenCalledWith(urlWithSpecialChars);
  });
});
