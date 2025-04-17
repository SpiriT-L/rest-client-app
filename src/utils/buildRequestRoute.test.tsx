import { describe, it, expect } from 'vitest';
import { buildRequestRoute } from './buildRequestRoute';

interface RequestModel {
  method: string;
  url: string;
  body?: string | object;
  headers?: Record<string, string>;
  executionTime: number;
}

describe('buildRequestRoute', () => {
  it('builds route for GET request with only method and URL', () => {
    const request: RequestModel = {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      executionTime: 1234567890,
    };
    const result = buildRequestRoute(request);
    expect(result).toBe(
      '/GET/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3RzLzE='
    );
  });

  it('builds route for POST request with body', () => {
    const request: RequestModel = {
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: { title: 'fakeTitle', userId: 1, body: 'fakeMessage' },
      executionTime: 1234567890,
    };
    const result = buildRequestRoute(request);
    expect(result).toBe(
      '/POST/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3Rz/eyJ0aXRsZSI6ImZha2VUaXRsZSIsInVzZXJJZCI6MSwiYm9keSI6ImZha2VNZXNzYWdlIn0='
    );
  });

  it('builds route for request with headers', () => {
    const request: RequestModel = {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
      },
      executionTime: 1234567890,
    };
    const result = buildRequestRoute(request);
    expect(result).toBe(
      '/GET/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3RzLzE=?Content-Type=application%2Fjson&Authorization=Bearer%20token123'
    );
  });

  it('builds route for full request with method, URL, body, and headers', () => {
    const request: RequestModel = {
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: { title: 'fakeTitle', userId: 1, body: 'fakeMessage' },
      headers: {
        'Content-Type': 'application/json',
      },
      executionTime: 1234567890,
    };
    const result = buildRequestRoute(request);
    expect(result).toBe(
      '/POST/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3Rz/eyJ0aXRsZSI6ImZha2VUaXRsZSIsInVzZXJJZCI6MSwiYm9keSI6ImZha2VNZXNzYWdlIn0=?Content-Type=application%2Fjson'
    );
  });

  it('handles string body correctly', () => {
    const request: RequestModel = {
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: '{"custom":"data"}',
      executionTime: 1234567890,
    };
    const result = buildRequestRoute(request);
    expect(result).toBe(
      '/POST/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3Rz/eyJjdXN0b20iOiJkYXRhIn0='
    );
  });

  it('handles special characters in URL and headers', () => {
    const request: RequestModel = {
      method: 'GET',
      url: 'https://example.com/path with spaces?query=val',
      headers: {
        'Custom-Header': 'value with spaces & special chars',
      },
      executionTime: 1234567890,
    };
    const result = buildRequestRoute(request);
    expect(result).toBe(
      '/GET/aHR0cHM6Ly9leGFtcGxlLmNvbS9wYXRoIHdpdGggc3BhY2VzP3F1ZXJ5PXZhbA==?Custom-Header=value%20with%20spaces%20%26%20special%20chars'
    );
  });

  it('handles empty headers object', () => {
    const request: RequestModel = {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      headers: {},
      executionTime: 1234567890,
    };
    const result = buildRequestRoute(request);
    expect(result).toBe(
      '/GET/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3RzLzE='
    );
  });

  it('handles missing body and headers', () => {
    const request: RequestModel = {
      method: 'DELETE',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      executionTime: 1234567890,
    };
    const result = buildRequestRoute(request);
    expect(result).toBe(
      '/DELETE/aHR0cHM6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3RzLzE='
    );
  });
});
