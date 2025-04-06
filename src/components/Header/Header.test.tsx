import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Header from './Header';
import styles from './Header.module.scss';

describe('Header Component', () => {
  it('renders the Header component', () => {
    render(<Header />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('applies the shrink class when scrolled', () => {
    const { container } = render(<Header />);

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    const header = container.querySelector('header');
    expect(header).toHaveClass(styles.shrink);
  });

  it('removes the shrink class when scrolled back to top', () => {
    const { container } = render(<Header />);

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    fireEvent.scroll(window);

    const header = container.querySelector('header');
    expect(header).not.toHaveClass(styles.shrink);
  });
});
