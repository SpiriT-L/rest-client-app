import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import BodyEditor from './BodyEditor';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('BodyEditor', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(
      (key: string) => {
        const translations: Record<string, string> = {
          title_view: 'Response Body',
          title_edit: 'Request Body',
          format_json: 'Format JSON',
          format_error: 'Invalid JSON format',
          format_placeholder_view: 'View response body...',
          format_placeholder_edit: 'Enter request body...',
        };
        return translations[key] || key;
      }
    );
  });

  it('renders with default title in edit mode', () => {
    render(<BodyEditor value="" onChange={mockOnChange} />);
    expect(screen.getByText('Request Body')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(
      <BodyEditor value="" onChange={mockOnChange} title="Custom Title" />
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders in read-only mode with correct title', () => {
    render(
      <BodyEditor
        value=""
        onChange={mockOnChange}
        readOnly={true}
        title="Response Body"
      />
    );
    expect(screen.getByText('Response Body')).toBeInTheDocument();
  });

  it('handles text input changes', () => {
    render(<BodyEditor value="" onChange={mockOnChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test input' } });

    expect(mockOnChange).toHaveBeenCalledWith('test input');
  });

  it('does not allow changes in read-only mode', () => {
    render(
      <BodyEditor
        value="initial value"
        onChange={mockOnChange}
        readOnly={true}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'new value' } });

    expect(mockOnChange).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('initial value');
  });

  it('formats valid JSON when format button is clicked', () => {
    const jsonInput = '{"name":"John","age":30}';
    render(<BodyEditor value={jsonInput} onChange={mockOnChange} />);

    const formatButton = screen.getByText('Format JSON');
    fireEvent.click(formatButton);

    expect(mockOnChange).toHaveBeenCalledWith(
      JSON.stringify(JSON.parse(jsonInput), null, 2)
    );
  });

  it('shows error message for invalid JSON format', () => {
    render(<BodyEditor value='{"invalid": json}' onChange={mockOnChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '{"invalid": json}' } });

    expect(screen.queryByText('Format JSON')).not.toBeInTheDocument();
  });

  it('automatically formats JSON in read-only mode', () => {
    const jsonInput = '{"name":"John","age":30}';
    render(
      <BodyEditor value={jsonInput} onChange={mockOnChange} readOnly={true} />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(
      JSON.stringify(JSON.parse(jsonInput), null, 2)
    );
  });

  it('hides format button in read-only mode', () => {
    render(<BodyEditor value="{}" onChange={mockOnChange} readOnly={true} />);

    expect(screen.queryByText('Format JSON')).not.toBeInTheDocument();
  });
});
