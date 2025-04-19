import '@testing-library/jest-dom';
import { Router } from 'next/router';
import { vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => {
    return (key: string): string => key;
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: (): Partial<Router> => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useSearchParams: (): URLSearchParams => new URLSearchParams(),
  usePathname: (): string => '/',
}));

Object.defineProperty(window, 'btoa', {
  value: (str: string) => Buffer.from(str).toString('base64'),
  writable: true,
});

Object.defineProperty(window, 'atob', {
  value: (str: string) => Buffer.from(str, 'base64').toString('binary'),
  writable: true,
});

global.fetch = vi.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
