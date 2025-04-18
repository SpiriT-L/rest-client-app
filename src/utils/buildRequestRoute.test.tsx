import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildRequestRoute } from './buildRequestRoute';
import { RequestModel } from '@/models/request.model';

describe('buildRequestRoute', () => {
  beforeEach(() => {
    global.btoa = (str: string): string => `base64:${str}`;
  });

  afterEach(() => {
    delete global.btoa;
  });

  it('builds route for GET request with only method and URL', () => {
    const request: RequestModel = {
      method: 'GET',
      url: 'https://api.example.com/users',
    };

    const route = buildRequestRoute(request);

    expect(route).toBe(
      '?method=GET&url=base64%3Ahttps%3A%2F%2Fapi.example.com%2Fusers'
    );
  });

  it('builds route for POST request with body', () => {
    const request: RequestModel = {
      method: 'POST',
      url: 'https://api.example.com/users',
      body: { name: 'John', age: '30' },
    };

    const route = buildRequestRoute(request);

    expect(route).toBe(
      '?method=POST&url=base64%3Ahttps%3A%2F%2Fapi.example.com%2Fusers&body=base64%3A%7B%22name%22%3A%22John%22%2C%22age%22%3A%2230%22%7D'
    );
  });

  it('builds route for request with headers', () => {
    const request: RequestModel = {
      method: 'GET',
      url: 'https://api.example.com/users',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
      },
    };

    const route = buildRequestRoute(request);

    expect(route).toBe(
      '?method=GET&url=base64%3Ahttps%3A%2F%2Fapi.example.com%2Fusers&Content-Type=application%252Fjson&Authorization=Bearer%2520token123'
    );
  });

  it('builds route for full request with method, URL, body, and headers', () => {
    const request: RequestModel = {
      method: 'POST',
      url: 'https://api.example.com/users',
      body: { name: 'John', age: '30' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
      },
    };

    const route = buildRequestRoute(request);

    expect(route).toBe(
      '?method=POST&url=base64%3Ahttps%3A%2F%2Fapi.example.com%2Fusers&body=base64%3A%7B%22name%22%3A%22John%22%2C%22age%22%3A%2230%22%7D&Content-Type=application%252Fjson&Authorization=Bearer%2520token123'
    );
  });

  it('handles empty body and headers', () => {
    const request: RequestModel = {
      method: 'GET',
      url: 'https://api.example.com/users',
      body: {},
      headers: {},
    };

    const route = buildRequestRoute(request);

    expect(route).toBe(
      '?method=GET&url=base64%3Ahttps%3A%2F%2Fapi.example.com%2Fusers&body=base64%3A%7B%7D'
    );
  });

  it('handles special characters in URL', () => {
    const request: RequestModel = {
      method: 'GET',
      url: 'https://api.example.com/users?name=John Doe&age=30',
    };

    const route = buildRequestRoute(request);

    expect(route).toBe(
      '?method=GET&url=base64%3Ahttps%3A%2F%2Fapi.example.com%2Fusers%3Fname%3DJohn+Doe%26age%3D30'
    );
  });

  it('handles special characters in headers', () => {
    const request: RequestModel = {
      method: 'GET',
      url: 'https://api.example.com/users',
      headers: {
        'Custom-Header': 'Value with spaces & special chars!@#$%^&*()',
      },
    };

    const route = buildRequestRoute(request);

    expect(route).toBe(
      '?method=GET&url=base64%3Ahttps%3A%2F%2Fapi.example.com%2Fusers&Custom-Header=Value%2520with%2520spaces%2520%2526%2520special%2520chars%21%2540%2523%2524%2525%255E%2526*%28%29'
    );
  });
});
