import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildRequestRoute } from './buildRequestRoute';
import { RequestModel } from '@/models/request.model';
import { Variable } from '@/models/variable';
import { substituteVariables } from './variableSubstitution';

vi.mock('./variableSubstitution', () => ({
  substituteVariables: vi.fn((text: string) => text),
}));

Object.defineProperty(window, 'btoa', {
  value: (str: string) =>
    Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''),
  writable: true,
});

describe('buildRequestRoute', () => {
  const mockRequest: RequestModel = {
    method: 'GET',
    url: 'https://api.example.com',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    },
    body: { test: 'value' },
  };

  const mockVariables: Variable[] = [
    { key: 'baseUrl', value: 'https://api.example.com' },
    { key: 'token', value: 'Bearer token' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds route with method and URL only', () => {
    const request = { ...mockRequest, headers: undefined, body: undefined };
    const result = buildRequestRoute(request);
    const expectedUrl = Buffer.from(request.url)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    expect(result).toBe(`/${request.method}/${expectedUrl}`);
  });

  it('builds route with method, URL and body', () => {
    const request = { ...mockRequest, headers: undefined };
    const result = buildRequestRoute(request);
    const expectedUrl = Buffer.from(request.url)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const expectedBody = Buffer.from(JSON.stringify(request.body))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    expect(result).toBe(`/${request.method}/${expectedUrl}/${expectedBody}`);
  });

  it('builds route with method, URL and headers', () => {
    const request = { ...mockRequest, body: undefined };
    const result = buildRequestRoute(request);
    const expectedUrl = Buffer.from(request.url)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const params = new URLSearchParams();
    params.append('Content-Type', 'application/json');
    params.append('Authorization', 'Bearer token');

    expect(result).toBe(
      `/${request.method}/${expectedUrl}?${params.toString()}`
    );
  });

  it('builds route with method, URL, body and headers', () => {
    const result = buildRequestRoute(mockRequest);
    const expectedUrl = Buffer.from(mockRequest.url)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const expectedBody = Buffer.from(JSON.stringify(mockRequest.body))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const params = new URLSearchParams();
    params.append('Content-Type', 'application/json');
    params.append('Authorization', 'Bearer token');

    expect(result).toBe(
      `/${mockRequest.method}/${expectedUrl}/${expectedBody}?${params.toString()}`
    );
  });

  it('substitutes variables in URL', () => {
    const request = { ...mockRequest, url: '{{baseUrl}}/endpoint' };
    buildRequestRoute(request, mockVariables);

    expect(substituteVariables).toHaveBeenCalledWith(
      request.url,
      mockVariables
    );
  });

  it('substitutes variables in body', () => {
    const request = { ...mockRequest, body: { test: '{{token}}' } };
    buildRequestRoute(request, mockVariables);

    expect(substituteVariables).toHaveBeenCalledWith(
      JSON.stringify(request.body),
      mockVariables
    );
  });

  it('substitutes variables in headers', () => {
    const request = { ...mockRequest, headers: { Authorization: '{{token}}' } };
    buildRequestRoute(request, mockVariables);

    expect(substituteVariables).toHaveBeenCalledWith(
      '{{token}}',
      mockVariables
    );
  });

  it('handles empty headers', () => {
    const request = { ...mockRequest, headers: {} };
    const result = buildRequestRoute(request);

    expect(result).not.toContain('?');
  });

  it('handles undefined headers', () => {
    const request = { ...mockRequest, headers: undefined };
    const result = buildRequestRoute(request);

    expect(result).not.toContain('?');
  });
});
