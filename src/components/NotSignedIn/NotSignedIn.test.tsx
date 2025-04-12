import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { NotSignedIn } from './NotSignedIn';
import styles from './NotSignedIn.module.scss';

describe('NotSignedIn Component', () => {
  it('renders the correct text content', () => {
    render(<NotSignedIn />);

    expect(screen.getByText('You are not signed in')).toBeInTheDocument();
    expect(screen.getByText('Please do it and come back')).toBeInTheDocument();
  });

  it('applies the correct styles to the container', () => {
    const { container } = render(<NotSignedIn />);

    const div = container.querySelector('div');
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass(styles.notSignedIn);
  });
});
