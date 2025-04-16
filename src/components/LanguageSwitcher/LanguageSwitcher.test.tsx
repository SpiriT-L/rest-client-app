import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

vi.mock('next-intl', () => ({
  useLocale: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe('LanguageSwitcher Component', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders with "Ru" button text when locale is "en"', () => {
    (useLocale as ReturnType<typeof vi.fn>).mockReturnValue('en');
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: /Ru/i })).toBeInTheDocument();
  });

  it('renders with "En" button text when locale is "ru"', () => {
    (useLocale as ReturnType<typeof vi.fn>).mockReturnValue('ru');
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: /En/i })).toBeInTheDocument();
  });

  it('switches from en to ru for segmented paths', () => {
    (useLocale as ReturnType<typeof vi.fn>).mockReturnValue('en');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/en/variables');
    render(<LanguageSwitcher />);
    const switchButton = screen.getByRole('button', { name: /Ru/i });
    fireEvent.click(switchButton);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/ru/variables');
  });

  it('switches from ru to en for segmented paths', () => {
    (useLocale as ReturnType<typeof vi.fn>).mockReturnValue('ru');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/ru/variables');
    render(<LanguageSwitcher />);
    const switchButton = screen.getByRole('button', { name: /En/i });
    fireEvent.click(switchButton);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/en/variables');
  });

  it('switches from en to ru for root path', () => {
    (useLocale as ReturnType<typeof vi.fn>).mockReturnValue('en');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/en');
    render(<LanguageSwitcher />);
    const switchButton = screen.getByRole('button', { name: /Ru/i });
    fireEvent.click(switchButton);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/ru');
  });

  it('switches from ru to en for root path', () => {
    (useLocale as ReturnType<typeof vi.fn>).mockReturnValue('ru');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/ru');
    render(<LanguageSwitcher />);
    const switchButton = screen.getByRole('button', { name: /En/i });
    fireEvent.click(switchButton);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/en');
  });

  it('handles trailing slash in root path', () => {
    (useLocale as ReturnType<typeof vi.fn>).mockReturnValue('en');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/en/');
    render(<LanguageSwitcher />);
    const switchButton = screen.getByRole('button', { name: /Ru/i });
    fireEvent.click(switchButton);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/ru');
  });
});
