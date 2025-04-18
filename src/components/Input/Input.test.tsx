import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Input from './Input';
import styles from './Input.module.scss';

vi.mock('./Input.module.scss', () => ({
  default: {
    Input: 'Input',
    input: 'input',
    error: 'error',
  },
}));

describe('Input Component', () => {
  const defaultProps = {
    type: 'text',
    name: 'testInput',
    placeholder: 'Enter text',
    value: '',
    onChange: vi.fn(),
    onBlur: vi.fn(),
    error: '',
    touched: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input with correct attributes and no error', () => {
    render(<Input {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('name', 'testInput');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveValue('');
    expect(input).toHaveClass(styles.input);

    const wrapper = input.parentElement;
    expect(wrapper).toHaveClass(styles.Input);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('displays error message when touched and error are provided', () => {
    render(<Input {...defaultProps} error="Required field" touched={true} />);

    const error = screen.getByText('Required field');
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass(styles.error);
  });

  it('does not display error when touched is false', () => {
    render(<Input {...defaultProps} error="Required field" touched={false} />);

    expect(screen.queryByText('Required field')).not.toBeInTheDocument();
  });

  it('does not display error when error is empty', () => {
    render(<Input {...defaultProps} error="" touched={true} />);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('renders different input types correctly', () => {
    const types = ['text', 'email', 'password'];
    types.forEach(type => {
      render(
        <Input {...defaultProps} type={type} placeholder={`${type} input`} />
      );

      const input = screen.getByPlaceholderText(`${type} input`);
      expect(input).toHaveAttribute('type', type);
    });
  });
});
