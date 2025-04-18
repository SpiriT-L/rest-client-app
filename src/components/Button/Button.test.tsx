import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Button from './Button';
import styles from './Button.module.scss';

vi.mock('./Button.module.scss', () => ({
  default: {
    button: 'button',
    disabled: 'disabled',
  },
}));

describe('Button Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders button with correct type and children', () => {
    render(
      <Button type="button" disabled={false}>
        Click Me
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('Click Me');
  });

  it('applies button class and no disabled class when enabled', () => {
    render(
      <Button type="submit" disabled={false}>
        Submit{' '}
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveClass(styles.button);
    expect(button).not.toHaveClass(styles.disabled);
    expect(button).not.toHaveAttribute('disabled');
    expect(button).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('applies button and disabled classes when disabled', () => {
    render(
      <Button type="reset" disabled={true}>
        Reset
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Reset' });
    expect(button).toHaveClass(styles.button);
    expect(button).toHaveClass(styles.disabled);
    expect(button).toHaveAttribute('disabled');
  });

  it('applies custom className when provided', () => {
    render(
      <Button type="button" disabled={false} className="custom-class">
        Custom
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button).toHaveClass(styles.button);
    expect(button).toHaveClass('custom-class');
    expect(button).not.toHaveClass(styles.disabled);
  });

  it('renders correctly with different button types', () => {
    const types: ('button' | 'submit' | 'reset')[] = [
      'button',
      'submit',
      'reset',
    ];

    types.forEach(type => {
      render(<Button type={type} disabled={false}>{`${type} Button`}</Button>);

      const button = screen.getByRole('button', { name: `${type} Button` });
      expect(button).toHaveAttribute('type', type);
    });
  });

  it('renders complex children correctly', () => {
    render(
      <Button type="button" disabled={false}>
        <span>Complex</span> Button
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toContainElement(screen.getByText('Complex'));
    expect(button).toHaveTextContent('Complex Button');
  });

  it('is accessible with proper ARIA attributes', () => {
    render(
      <Button type="submit" disabled={true}>
        Submit
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveAttribute('disabled');
  });
});
