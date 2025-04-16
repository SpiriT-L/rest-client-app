import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVariables } from './useVariables';

const localStorageMock = ((): {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  clear: () => void;
} => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): string => (store[key] = value),
    clear: (): object => (store = {}),
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('useVariables Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with null variables', () => {
    const { result } = renderHook(() => useVariables());
    const [variables] = result.current;
    expect(variables).toBeNull();
  });

  it('loads variables from localStorage on mount', () => {
    localStorage.setItem(
      'rss-variables',
      JSON.stringify([{ key: 'key1', value: 'value1' }])
    );
    const { result } = renderHook(() => useVariables());

    act(() => {
      vi.advanceTimersByTime(0);
    });

    const [variables] = result.current;
    expect(variables).toEqual([{ key: 'key1', value: 'value1' }]);
  });

  it('adds an empty variable item', () => {
    const { result } = renderHook(() => useVariables());
    const [, , , addEmptyVariableItem] = result.current;

    act(() => {
      addEmptyVariableItem();
    });

    const [variables] = result.current;
    expect(variables).toEqual([{ key: 'empty-0', value: '' }]);
    expect(JSON.parse(localStorage.getItem('rss-variables'))).toEqual([
      { key: 'empty-0', value: '' },
    ]);
  });

  it('updates an existing variable', () => {
    const { result } = renderHook(() => useVariables());
    const [, addVariable] = result.current;

    act(() => {
      addVariable('key1', 'value1');
      addVariable('key1', 'updatedValue');
    });

    const [variables] = result.current;
    expect(variables).toEqual([{ key: 'key1', value: 'updatedValue' }]);
  });

  it('removes a variable', () => {
    const initialVariables = [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ];
    localStorage.setItem('rss-variables', JSON.stringify(initialVariables));
    const { result } = renderHook(() => useVariables());

    act(() => {
      vi.advanceTimersByTime(0);
    });

    const [, , removeVariable] = result.current;
    act(() => {
      removeVariable('key1');
    });

    const [variables] = result.current;
    expect(variables).toEqual([{ key: 'key2', value: 'value2' }]);
    expect(JSON.parse(localStorage.getItem('rss-variables'))).toEqual([
      { key: 'key2', value: 'value2' },
    ]);
  });

  it('does nothing on removeVariable if variables is null', () => {
    const { result } = renderHook(() => useVariables());
    const [, , removeVariable] = result.current;

    act(() => {
      removeVariable('key1');
    });

    const [variables] = result.current;
    expect(variables).toBeNull();
    expect(localStorage.getItem('rss-variables')).toBeNull();
  });
});
