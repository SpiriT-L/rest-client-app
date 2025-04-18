import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useVariables } from './useVariables';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('useVariables Hook', () => {
  beforeEach(() => {
    mockLocalStorage.clear.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with empty variables array', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useVariables());
    const [variables] = result.current;
    expect(variables).toEqual([]);
  });

  it('loads variables from localStorage on mount', () => {
    const storedVariables = [{ name: 'key1', value: 'value1' }];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedVariables));
    const { result } = renderHook(() => useVariables());

    act(() => {
      vi.advanceTimersByTime(0);
    });

    const [variables] = result.current;
    expect(variables).toEqual(storedVariables);
  });

  it('keeps empty array when removing from empty array', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useVariables());
    const [, , removeVariable] = result.current;

    act(() => {
      removeVariable('key1');
    });

    const [variables] = result.current;
    expect(variables).toEqual([]);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'rss-variables',
      JSON.stringify([])
    );
  });
});
