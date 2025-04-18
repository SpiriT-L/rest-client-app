import { vi } from 'vitest';

export const auth = {
  currentUser: null,
};

export const app = {
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false,
};

export const getAuth = vi.fn(() => auth);
export const getApp = vi.fn(() => app);
export const initializeApp = vi.fn(() => app);
export const getApps = vi.fn(() => []);
