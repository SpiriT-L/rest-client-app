import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import styles from './Header.module.scss';
import { Header } from '@/components/Header/Header';
import { JSX } from 'react';

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, priority }): JSX.Element => (
    <div
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-testid="mocked-image"
      data-priority={priority ? 'true' : 'false'}
    />
  ),
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }): JSX.Element => (
    <a href={href} {...props} data-testid="mocked-link">
      {children}
    </a>
  ),
}));

vi.mock(
  '../LanguageSwitcher/LanguageSwitcher',
  (): { default: () => JSX.Element } => ({
    default: () => <div data-testid="language-switcher">Language Switcher</div>,
  })
);

vi.mock('@/components/Navigation/Navigation', () => ({
  Navigation: (): JSX.Element => <nav data-testid="navigation">Navigation</nav>,
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header with logo, navigation, and language switcher', () => {
    render(<Header />);

    const logoImage = screen.getByTestId('mocked-image');
    expect(logoImage).toHaveAttribute('src', '/logo.svg');
    expect(logoImage).toHaveAttribute('alt', 'Logo');

    const logoLink = screen.getByTestId('mocked-link');
    expect(logoLink).toHaveAttribute('href', '/');

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('applies shrink class when scrolled beyond threshold', () => {
    const { container } = render(<Header />);

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    const header = container.querySelector('header');
    expect(header).toHaveClass(styles.shrink);
  });

  it('removes shrink class when scrolled back to top', () => {
    const { container } = render(<Header />);

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    fireEvent.scroll(window);

    const header = container.querySelector('header');
    expect(header).not.toHaveClass(styles.shrink);
  });

  it('adds and removes scroll event listener correctly', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<Header />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
  });
});
