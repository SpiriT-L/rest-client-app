import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocale } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

vi.mock('next-intl', () => ({
  useLocale: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('LanguageSwitcher Component', () => {
  const mockPush = vi.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    vi.restoreAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue(mockSearchParams);
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

  it('preserves query parameters when switching locales', () => {
    (useLocale as ReturnType<typeof vi.fn>).mockReturnValue('en');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/en/rest-client/GET/aHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20');
    mockSearchParams.set('param1', 'value1');
    mockSearchParams.set('param2', 'value2');
    
    render(<LanguageSwitcher />);
    const switchButton = screen.getByRole('button', { name: /Ru/i });
    fireEvent.click(switchButton);
    
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/ru/rest-client/GET/aHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20?param1=value1&param2=value2');
  });

  it('preserves query parameters for root path', () => {
    (useLocale as ReturnType<typeof vi.fn>).mockReturnValue('en');
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue('/en');
    mockSearchParams.delete('param2');
    mockSearchParams.set('param1', 'value1');
    
    render(<LanguageSwitcher />);
    const switchButton = screen.getByRole('button', { name: /Ru/i });
    fireEvent.click(switchButton);
    
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/ru?param1=value1');
  });
});
