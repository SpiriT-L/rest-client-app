import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateCode,
  escapeString,
  formatJson,
  validateJson,
  prepareBodyForLanguage,
} from './codeGenerator';
import { substituteVariables } from './variableSubstitution';
import { RestClientState } from '@/models/rest-client';
import { Variable } from '@/models/variable';

vi.mock('./variableSubstitution', () => ({
  substituteVariables: vi.fn((text: string) => text),
}));

vi.mock('./codeTemplates', () => ({
  codeTemplates: {
    curl: vi.fn(
      ({
        method,
        url,
      }: {
        method: string;
        url: string;
        headers: Array<{ key: string; value: string }>;
        body?: string;
      }) => `curl -X ${method} "${url}"`
    ),
    javascript: vi.fn(
      ({
        method,
        url,
      }: {
        method: string;
        url: string;
        headers: Array<{ key: string; value: string }>;
        body?: string;
      }) => `fetch("${url}", { method: "${method}" })`
    ),
  },
}));

describe('codeGenerator', () => {
  describe('helper functions', () => {
    describe('escapeString', () => {
      it('escapes special characters', () => {
        expect(escapeString('\\')).toBe('\\\\');
        expect(escapeString('"')).toBe('\\"');
        expect(escapeString('\n')).toBe('\\n');
        expect(escapeString('\r')).toBe('\\r');
        expect(escapeString('\t')).toBe('\\t');
        expect(escapeString('test\\"new\nline')).toBe('test\\\\\\"new\\nline');
      });
    });

    describe('formatJson', () => {
      it('formats valid JSON', () => {
        expect(formatJson('{"test":"value"}')).toBe('{"test":"value"}');
        expect(formatJson('{"test":1}')).toBe('{"test":1}');
      });

      it('returns original string for invalid JSON', () => {
        expect(formatJson('invalid json')).toBe('invalid json');
      });
    });

    describe('validateJson', () => {
      it('validates JSON correctly', () => {
        expect(validateJson('{"test":"value"}')).toBe(true);
        expect(validateJson('invalid json')).toBe(false);
      });
    });

    describe('prepareBodyForLanguage', () => {
      it('returns empty string for empty body', () => {
        expect(prepareBodyForLanguage('', 'curl')).toBe('');
      });

      it('returns formatted body for valid JSON', () => {
        expect(prepareBodyForLanguage('{"test":"value"}', 'curl')).toBe(
          '{"test":"value"}'
        );
      });
    });
  });

  describe('generateCode', () => {
    const mockState: RestClientState = {
      method: 'GET',
      url: 'https://api.example.com',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: 'Bearer token' },
      ],
      body: '{"test":"value"}',
      response: {
        status: null,
        body: '',
        ok: '',
      },
    };

    const mockVariables: Variable[] = [
      { key: 'baseUrl', value: 'https://api.example.com' },
      { key: 'token', value: 'Bearer token' },
    ];

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('generates curl code', () => {
      const result = generateCode(mockState, mockVariables, 'curl');
      expect(result).toContain('curl -X GET');
      expect(result).toContain('https://api.example.com');
    });

    it('generates javascript code', () => {
      const result = generateCode(mockState, mockVariables, 'javascript');
      expect(result).toContain('fetch("https://api.example.com"');
      expect(result).toContain('method: "GET"');
    });

    it('handles request without body', () => {
      const stateWithoutBody = { ...mockState, body: '' };
      const result = generateCode(stateWithoutBody, mockVariables, 'curl');
      expect(result).not.toContain('-d');
    });

    it('handles request without headers', () => {
      const stateWithoutHeaders = { ...mockState, headers: [] };
      const result = generateCode(stateWithoutHeaders, mockVariables, 'curl');
      expect(result).not.toContain('-H');
    });

    it('throws error for unsupported language', () => {
      expect(() =>
        generateCode(mockState, mockVariables, 'unsupported')
      ).toThrow('Unsupported language: unsupported');
    });

    it('substitutes variables in URL and headers', () => {
      generateCode(mockState, mockVariables, 'curl');

      expect(substituteVariables).toHaveBeenCalledWith(
        mockState.url,
        mockVariables
      );
      expect(substituteVariables).toHaveBeenCalledWith(
        mockState.headers[0].value,
        mockVariables
      );
      expect(substituteVariables).toHaveBeenCalledWith(
        mockState.headers[1].value,
        mockVariables
      );
      expect(substituteVariables).toHaveBeenCalledWith(
        mockState.body,
        mockVariables
      );
    });
  });
});
