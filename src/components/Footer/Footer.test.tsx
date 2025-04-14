import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Footer from './Footer';
import styles from './Footer.module.scss';
import { useTranslations } from 'next-intl';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }): React.JSX.Element => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height }): React.JSX.Element => (
    <div src={src} alt={alt} width={width} height={height} data-testid="img" />
  ),
}));

describe('Footer Component', () => {
  const mockTranslations = {
    nastya: 'Anastasiya Mianko',
    leonid: 'Leanid Matskevich',
    dima: 'Dzmitry Yarash',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    (useTranslations as ReturnType<typeof vi.fn>).mockReturnValue(
      (key: keyof typeof mockTranslations) => mockTranslations[key]
    );
  });

  it('renders footer with translated names and year', () => {
    render(<Footer />);

    expect(screen.getByText('Anastasiya Mianko')).toBeInTheDocument();
    expect(screen.getByText('Leanid Matskevich')).toBeInTheDocument();
    expect(screen.getByText('Dzmitry Yarash')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('renders correct links with GitHub and RS School icons', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);

    expect(links[0]).toHaveAttribute('href', 'https://github.com/nastyavolkm');
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveTextContent('Anastasiya Mianko');

    expect(links[1]).toHaveAttribute('href', 'https://github.com/SpiriT-L');
    expect(links[1]).toHaveAttribute('target', '_blank');
    expect(links[1]).toHaveTextContent('Leanid Matskevich');

    expect(links[2]).toHaveAttribute('href', 'https://github.com/zm1try');
    expect(links[2]).toHaveAttribute('target', '_blank');
    expect(links[2]).toHaveTextContent('Dzmitry Yarash');

    expect(links[3]).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(links[3]).toHaveAttribute('target', '_blank');

    const images = screen.getAllByTestId('img');
    expect(images).toHaveLength(4);
    expect(images[0]).toHaveAttribute('src', '/github.svg');
    expect(images[0]).toHaveAttribute('alt', 'github');
    expect(images[3]).toHaveAttribute('src', '/rss-logo.svg');
    expect(images[3]).toHaveAttribute('alt', 'rs');
  });

  it('applies correct styles to the footer and links', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass(styles.footer);

    const linksContainer = container.querySelector('div');
    expect(linksContainer).toHaveClass(styles.links);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass(styles.link);
    });
  });
});
