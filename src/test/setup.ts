import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
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

beforeEach(() => {
  console.log('Test setup: beforeEach');
});

afterEach(() => {
  console.log('Test setup: afterEach');
});
