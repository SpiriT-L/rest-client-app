import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

describe('POST /api/rest', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('makes a successful request with JSON response', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      text: () => Promise.resolve('{"success": true}'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const request = new NextRequest('http://localhost/api/rest', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://api.example.com',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: '{"test": "data"}',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: '{"test": "data"}',
    });
    expect(data).toEqual({
      status: 200,
      ok: true,
      body: '{"success": true}',
    });
  });

  it('makes a successful request with plain text response', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      text: () => Promise.resolve('plain text response'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const request = new NextRequest('http://localhost/api/rest', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://api.example.com',
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: 'plain text request',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'plain text request',
    });
    expect(data).toEqual({
      status: 200,
      ok: true,
      body: 'plain text response',
    });
  });

  it('handles request without body', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      text: () => Promise.resolve('{}'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const request = new NextRequest('http://localhost/api/rest', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://api.example.com',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });
    expect(data).toEqual({
      status: 200,
      ok: true,
      body: '{}',
    });
  });

  it('handles request without headers', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      text: () => Promise.resolve('{}'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const request = new NextRequest('http://localhost/api/rest', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://api.example.com',
        method: 'GET',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'GET',
      headers: {},
      body: undefined,
    });
    expect(data).toEqual({
      status: 200,
      ok: true,
      body: '{}',
    });
  });

  it('handles request errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const request = new NextRequest('http://localhost/api/rest', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://api.example.com',
        method: 'GET',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data).toEqual({
      error: 'Failed to make request: Error: Network error',
    });
    expect(response.status).toBe(500);
  });
}); 