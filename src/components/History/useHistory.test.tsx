import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from './useHistory';
import { RequestModel } from '@/models/request.model';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(window, 'localStorage', 'get').mockReturnValue(localStorageMock);
});

describe('useHistory Hook', () => {
  it('initializes with null history when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useHistory());

    expect(result.current.history).toBeNull();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('rss-history');
  });

  it('loads and sorts history from localStorage on mount', () => {
    const mockHistory: RequestModel[] = [
      {
        method: 'GET',
        url: 'https://example.com/1',
        executionTime: 1000,
      },
      {
        method: 'POST',
        url: 'https://example.com/2',
        executionTime: 2000,
      },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));
    const { result } = renderHook(() => useHistory());

    expect(result.current.history).toEqual([mockHistory[1], mockHistory[0]]);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('rss-history');
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    const { result } = renderHook(() => useHistory());

    expect(result.current.history).toBeNull();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('rss-history');
  });

  it('adds new request to history and updates localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useHistory());

    const newRequest: RequestModel = {
      method: 'GET',
      url: 'https://example.com/new',
      executionTime: 3000,
    };

    act(() => {
      result.current.addRequestToHistory(newRequest);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'rss-history',
      JSON.stringify([newRequest])
    );
  });

  it('prepends new request to existing history', () => {
    const existingHistory: RequestModel[] = [
      {
        method: 'POST',
        url: 'https://example.com/old',
        executionTime: 1000,
      },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(existingHistory));
    const { result } = renderHook(() => useHistory());

    const newRequest: RequestModel = {
      method: 'GET',
      url: 'https://example.com/new',
      executionTime: 2000,
    };

    act(() => {
      result.current.addRequestToHistory(newRequest);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'rss-history',
      JSON.stringify([newRequest, ...existingHistory])
    );
  });

  it('handles adding request when history is null', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useHistory());

    const newRequest: RequestModel = {
      method: 'DELETE',
      url: 'https://example.com/delete',
      executionTime: 4000,
    };

    act(() => {
      result.current.addRequestToHistory(newRequest);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'rss-history',
      JSON.stringify([newRequest])
    );
  });

  it('returns correct shape with history and addRequestToHistory', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useHistory());

    expect(result.current).toHaveProperty('history');
    expect(result.current).toHaveProperty('addRequestToHistory');
    expect(typeof result.current.addRequestToHistory).toBe('function');
    expect(result.current.history).toBeNull();
  });
});
